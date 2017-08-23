var sourceArray = [];
var formatArray = [];
var backExpreArray = [];
var firstArea = document.getElementsByClassName('first-area')[0];
var secondArea = document.getElementsByClassName('second-area')[0];
var request = {};
var response = {};
function formatSource(str) {
  re=/[/+-/*//()]|[0-9.]+/g;
  str = str.replace(/\(-/g,"(0-");
  formatArray = str.match(re);
  return formatArray;
}

function standCheck(varArray) {
  var res = /[.]/g;
 // var reb = /[/+-/*//]?\(-?[0-9.]+([/+-/*//]?-?[0-9.]+)*\)[/+-/*//]?/g;
  var reb = /\(\)|\(([/+-/*//][0-9.]+)|\(([0-9.]+[/+-/*//])\)|([0-9.]+\()|([0-9.]+\)[0-9.]+)|\)\(/g;
  var leftBracketNumber = -1;
  var rightBracketNumber = -1;
  for (var i = 0;i < varArray.length;++i) {
    var pointArray = varArray[i].match(res);
    if (isOperator(varArray[i])) {
      continue;
    } else if (varArray[i] === '(') {
      leftBracketNumber++;
      continue;
    } else if (varArray[i] === ')') {
      rightBracketNumber++;
      continue;
    } else if (pointArray === null) {
      continue;
    } else if (pointArray.length > 1) {
      return false;
    } else if (pointArray.length === 1) {
      if(!isNaN(parseFloat(varArray[i]))) {
        varArray[i]=String(parseFloat(varArray[i]));
        continue;
      }
      else {
        return false;
      }
    }
  }
  if (leftBracketNumber !== rightBracketNumber) {
    return false;
  }
  if(varArray[0] === '-') {
    varArray.unshift('(','0');
    varArray.splice(4,0,')');
  }
  if(varArray.join("").match(reb) != null) {
    return false;
  }
  return true;
}

function checkBackExpre(backExpreArray) {
  var backStack = new Array();
  for (var i = 0;i < backExpreArray.length;++i) {
    if (isOperator(backExpreArray[i])) {
      if (backStack.pop() !== undefined && backStack.pop() !== undefined) {
        backStack.push('X');
        continue;
      } else {
        return false;
      }
    } else if (!isNaN(parseFloat(backExpreArray[i])) || backExpreArray[i] === 'X') {
      backStack.push('X');
      continue;
    } else {
      return false;
    }
  }
  if (backStack.length === 1 && !isOperator(backExpreArray[i])) {
    return true;
  }
  return false;
}

function isNumber(str) {
  if (
    str === '0' ||
    str === '1' ||
    str === '2' ||
    str === '3' ||
    str === '4' ||
    str === '5' ||
    str === '6' ||
    str === '7' ||
    str === '8' ||
    str === '9'
  ) {
    return true;
  }
  return false;
}

function isOperator(str) {
  if (
    str === '+' ||
    str === '-' ||
    str === '*' ||
    str === '/'
  ) {
    return true;
  }
  return false;
}

function isBrackets(str) {
  if (
    str === '(' ||
    str === ')'
  ) {
    return true;
  }
  return false;
}

function isPoint(str) {
  if (str === '.') {
    return true;
  }
  return false;
}

function onClear() {
  sourceArray = [];
  formatArray = [];
  firstArea.value = "";
  secondArea.value = "";
}

function onError() {
  window.alert("Error");
  onClear();
}

function icp(elem) {
  var expLevel = 0;
  switch (elem) {
    case '+': {
      expLevel = 2;
      break;
    } 
    case '-': {
      expLevel = 2;
      break;
    } 
    case '*':{
      expLevel = 4;
      break;
    }
    case '/':{
      expLevel = 4;
      break; 
    }
    case '(':{
      expLevel = 7;
      break;
    } 
    case ')':{
      expLevel = 1;
      break;
    }
  }
  return expLevel;
}

function isp (elem) {
  var expLevel = 0;
  switch (elem) {
    case '+': {
      expLevel = 3;
      break;
    } 
    case '-': {
      expLevel = 3;
      break;
    } 
    case '*':{
      expLevel = 5;
      break;
    }
    case '/':{
      expLevel = 5;
      break; 
    }
    case '(':{
      expLevel = 1;
      break;
    } 
    case ')':{
      expLevel = 7;
      break;
    }
  }
  return expLevel;
}

function getBackExpre(varArray) {
  var list = new Array();
  var op =new Array();
  var i = 0;
  for (var i = 0;i < varArray.length;++i) {
    if (!isNaN(parseFloat(varArray[i]))) {
      list.push(varArray[i]);
    } else if (varArray[i] === '(') {
      op.push(varArray[i]);
    } else if (varArray[i] === ')') {
      var p=op.pop();
      while(p!='('){
        list.push(p);
        p=op.pop();
      }  
    } else if (varArray[i] === '+' || varArray[i] === '-' || varArray[i] === '*' || varArray[i] === '/') {  
      while(op.length !== 0 && icp(varArray[i]) <= isp (op[op.length-1])) {
        list.push(op.pop());
        }
        op.push(varArray[i]);
    }
  }
  while (!op.length == 0) {
      list.push(op.pop());
  }
  return list;
}

function stackCalculate(valueA,valueB,backExpreOperator) {
  var stackResult = 0;
  valueA = parseFloat(valueA);
  valueB = parseFloat(valueB);
  switch (backExpreOperator) {
    case '+': {
      stackResult = valueA + valueB;
      break;
    }
    case '-': {
      stackResult = valueA - valueB;
      break;
    }
    case '*': {
      stackResult = valueA * valueB;
      break;
    }
    case '/': {
      stackResult = valueA / valueB;
      break;
    }
  }
  return stackResult;
}

function getCalculateResult(varBackArray) {
  var printResult = new Array();
  for (var i = 0;i < varBackArray.length;++i){
    if (!isNaN(varBackArray[i])) {
      printResult.push(varBackArray[i]);
    } else {
      var numB = printResult.pop();
      var numA = printResult.pop();
      var stackResult=stackCalculate(numA,numB,varBackArray[i]);
      printResult.push(stackResult);
    }
  }
  return printResult.pop();
}

function calc(str) {
  if (checkBackExpre(getBackExpre(formatArray)) === true) {
    result = {
      "result": {
        "resultCode": 200 ,
        "value": getCalculateResult(JSON.parse(str).calculate.expression)
      }
    }
  } else {
    result = {
      "result": {
        "resultCode": 400 ,
        "value": null
      }
    }
  }
  return JSON.stringify(result);
}

function getResult(str) {
  if (str === 'AC') {
    onClear();
    firstArea.value = sourceArray.join("");
  } else if (str === 'b') {
    sourceArray.pop();
    firstArea.value = sourceArray.join("");
  } else if (isNumber(str)) {
    sourceArray.push(str);
    firstArea.value = sourceArray.join("");
  } else if (isPoint(str)) {
    if (isPoint(sourceArray[sourceArray.length-1])) {
      sourceArray.pop();
      sourceArray.push(str);
      firstArea.value = sourceArray.join("");
    } else {
      sourceArray.push(str);
      firstArea.value = sourceArray.join("");
    }
  } else if ((str === '+' || str === '*' || str === '/') && sourceArray.length === 0) {
    sourceArray.pop();
    firstArea.value = sourceArray.join("");
  } else if (isOperator(str)) {
    if (isOperator(sourceArray[sourceArray.length-1])) {
      sourceArray.pop();
      sourceArray.push(str);
      firstArea.value = sourceArray.join("");
    } else {
      sourceArray.push(str);
      firstArea.value = sourceArray.join("");
    }
  } else if (str === ')' && sourceArray.indexOf('(') === -1) {
    sourceArray.push(str);
    sourceArray.pop();
    firstArea.value = sourceArray.join("");
  } else if (isBrackets(str)) {
    sourceArray.push(str);
    firstArea.value = sourceArray.join("");
  } else if (str === '=') {
    if (standCheck(formatSource(firstArea.value))) {
      if (checkBackExpre(getBackExpre(formatArray)) === true) {
        request = {
          "calculate": {
            "expression": getBackExpre(formatArray),
            "config": {}
          }
        }
        response = JSON.parse(calc(JSON.stringify(request)));
        secondArea.value = formatSource(firstArea.value).join('') + '=';
        firstArea.value = response.result.value;
        sourceArray = [];
        formatArray = [];
        backExpreArray = [];
        response = {};
        request = {};
      } else {
        onError();
      }
    } else {
    onError();
    }
  } else {
  onError();
  }
}