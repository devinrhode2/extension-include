/* By Devin Rhode (devinrhode2@gmail.com)
 * General library-esque functions!
 *
 * $.class is a wrapper on document.getElementsByClassName
 * $.id is a wrapper on getElementById
 * log('things like', trickyVaribles);
 * fail('When some bad shit occured.');
 *
 * has: Does a string have a certain substring inside it? returns boolean
 */

(function includeJSStrict(){
'use strict';

window.$ = window.$ || {};
$.class = function getElementsByClassNameWrapper(elements){
  return document.getElementsByClassName(elements);
};
$.id = function getElementByIdWrapper(elements){
  return document.getElementById(elements);
};
$.tag = function getElementsByTagNameWrapper(elements){
  return document.getElementsByTagName(elements);
};
HTMLElement.prototype.class = HTMLElement.prototype.getElementsByClassName;
HTMLElement.prototype.id = HTMLElement.prototype.getElementById;
HTMLElement.prototype.tag = HTMLElement.prototype.getElementsByTagName;

String.prototype.contains = function StringPrototypeHas(string) {
  return this.indexOf(string) > -1;
};

var ajax = {};
ajax.x = function() {
  return new XMLHttpRequest;
};
ajax.send = function(u, f, m, a) {
  var x = ajax.x();
  x.open(m, u, true);
  x.onreadystatechange = function() {
    if(x.readyState == 4) {
      f(x.responseText, x);
    }
  };
  if(m === "POST") {
    x.setRequestHeader("Content-type", "application/x-www-form-urlencoded")
  }
  x.send(a)
};
window.POST = function POST(url, func, args) {
  ajax.send(url, func, "POST", args);
};

window.GET = function GET(url, callback){
  ajax.send(url,callback,'GET');
};

window.masterHistory = function masterHistory(){
  //have a master switch on caller.name === 'f' (log) || 'warn' || 'fail' || 'error'
};

//fail, program cannot continue. Alert a message, and kill it
window.fail = function fail(message){
  masterHistory(arguments);
  alert(message);
  throw message;
};

//from HTML5 boilerplate. Paul Irish is awesome. I have no idea why the function name is 'f'...
window.log = function f() {
  masterHistory(arguments);
  if (typeof debug !== 'undefined' && debug) {
    if (typeof console !== 'undefined') { // with if (this.console) I was getting "Uncaught TypeError: Cannot read property 'console' of undefined"
      var args = arguments;
      var newarr;
  
      try {
          args.callee = f.caller;
      } catch(e) {
  
      }
  
      newarr = [].slice.call(args);
  
      if (typeof console.log === 'object') {
          log.apply.call(console.log, console, newarr);
      } else {
          console.log.apply(console, newarr);//
      }
    }
  }
};


//Some common pitfall that is handled. Application will continue fine.
window.warn = function warn(message){
  masterHistory(arguments);
  debug && console.warn(message);
  return message;
};
//some error where the program will continue, but this scenario really shouldn't be occuring
window.error = function error(message){
  masterHistory(arguments);
  debug && console.error(message);
  return message;
};

//more specific
//kiss metrics push!
window.kmpush = function kmpush(){
  if (typeof _kmq === 'undefined') {
    window._kmq = [];
  }
  var argsArray = [].slice.call(arguments);
  if (argsArray.length === 1) {
    _kmq.push(['record', argsArray[0]]);
  } else {
    _kmq.push(argsArray);
  }
};

window.storageDefault = function storageDefault(arg1, arg2){
  if (typeof arg1 === 'string') {
    if (localStorage.getItem(arg1) === null) {
      localStorage.setItem(arg1, arg2);
    }
  } else {
    if (typeof arg1 === 'object') {
      for (var key in arg1) {
        if (localStorage.getItem(key) === null) {
          localStorage.setItem(arg1, arg1[key]);
        }
      }
    } else {
      fail('storageDefault expects an object or 2 string arguments');
    }
  }
};


//very extension specific:
//coolest method ever!
$.createElement = function createElement(element, props, attributes) {
  var element = document.createElement(element);
  if (typeof props !== 'undefined') {
    for (var prop in props) {
      element[prop] = props[prop];
    }
    if (typeof attributes !== 'undefined') {
      for (var attr in attributes) {
        element.setAttribute(attr, attributes[attr]);
      }
    }
  }
  return element;
};

//UPDATE 1.1.0
window.style = function style(cssString){
  var s = document.createElement('style');
  s.innerHTML = cssString;
  s.setAttribute('from', 'an extension');
  document.documentElement.appendChild(s);
};

window.runInPage = function runInPage() {
  var script = document.createElement('script');
  script.innerHTML = '';
  for (task in arguments) {
    if (typeof arguments[task] === 'string') {
      script.innerHTML += arguments[task];
    } else if (typeof arguments[task] === 'function') {
      script.innerHTML += '(' + arguments[task] + '())';
    }
  }
  try {
    document.documentElement.appendChild(script);
  } catch (e) {
    console.error('CAUGHT ERROR: ', e, 'on:', script.innerHTML);
  }
  //script.removeNode(true); ?
}

/**
 * guardedParse - protected JSON.parse
 * assumes chrome, assumes JSON
 */
JSON.guardedParse = function guardedParse(string) {
  var returnValue = {};
  try {
    if (string.indexOf('{') === 0 && string.charAt(string.length - 1) === '}') {
      returnValue = JSON.parse(string);
    } else {
      console.log('first and last string are not { and } respectively. returning false');
      returnValue = false;
    }
  } catch(e) {
    alert('BAD JSON: ' + string);
    console.error('CAUGHT ERROR! ->', e);
    returnValue = false;
  }
  return returnValue;
};


}());