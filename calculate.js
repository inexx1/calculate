var sourceArray = [];
var formatArray = [];
var firstArea = document.getElementsByClassName('first-area')[0];
var secondArea = document.getElementsByClassName('second-area')[0];

function formatSource(str) {
  //to do rese
  //re = /[/+/*//()]|^-[0-9.]+|(-[0-9.]+)|[0-9.]+/g;
  re=/[/+-/*//()]|[0-9.]+/g;
  str = str.replace(/\(-/g,"(0-");
  formatArray = str.match(re);
  return formatArray;
}
function standCheck(varArray) {
  var res = /[.]/g;
 // var reb = /[/+-/*//]?\(-?[0-9.]+([/+-/*//]?-?[0-9.]+)*\)[/+-/*//]?/g;
  var reb = /\(\)|\(([/+-/*//][0-9.]+)|\(([0-9.]+[/+-/*//])\)|([0-9.]+\()|([0-9.]+\)[0-9.]+)|\)\(/g;
  
  //符号 （ 数字 符号 数字  ） 符号
  var pointNumber = -1;
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
        console.log(varArray[i]);
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
  var v = 0;
  switch (elem) {   
  case '+':  
      v =  2;  
      break;  
  case '-':  
      v = 2;  
      break;  
  case '*':  
      v = 4;  
      break;  
  case '/':  
      v = 4;  
      break; 
  case '(':  
      v = 7;  
      break;  
  case ')':  
      v = 1;  
      break;
  }  
  return v;
}

function isp (elem) {
  var v = 0;
  switch (elem) {   
  case '+':  
      v = 3;  
      break;  
  case '-':  
      v = 3;  
      break;  
  case '*':  
      v = 5;  
      break;  
  case '/':  
      v = 5;  
      break; 
  case '(':  
      v = 1;  
      break;  
  case ')':  
      v = 7;  
      break;
  }  
  return v;
}

function getBackExpre(varArray) {
  
  var list = new Array();
  var op =new Array();
  var i = 0;  
  for (var i = 0;i < varArray.length;++i) { 
    if (!isNaN(parseFloat(varArray[i]))) {
      list.push(varArray[i]);
          
          console.log("hi"); 
          console.log(list[0]); 
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
            console.log("h");
        }  
        op.push(varArray[i]);  
    }
  }  
  while (!op.length == 0) {  
      list.push(op.pop());  
  }
  return list;
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
  }/* else if (str === '+' || str === '*' || str === '/') {
    if (isOperator(sourceArray[sourceArray.length-1])) {
      sourceArray.pop();
      sourceArray.push(str);
      firstArea.value = sourceArray.join("");
    } else {
      sourceArray.push(str);
      firstArea.value = sourceArray.join("");
    }
  } else if (str === '-'){
    if (sourceArray[sourceArray.length-1] == '-' &&
      isOperator(sourceArray[sourceArray.length-2])  
    ) {
      onError();
    } else if (sourceArray[sourceArray.length-1] == '-' &&
      !isOperator(sourceArray[sourceArray.length-2])  
      ) {
        sourceArray.pop();
        sourceArray.push("+");
        firstArea.value = sourceArray.join("");
    } else {
      sourceArray.push(str);
      firstArea.value = sourceArray.join("");
    }
  }*/
      else if (isOperator(str)) {
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
      console.log(getBackExpre(formatArray));
      formatArray=[];
      //shuchu
      } else {
      onError();
      }
    } else {
    onError();
    }
}