//Simpler localStorage v1.3.1
//Designed for npm localstorage module, nodeJS
//Only works for pre-required localStorage module
//Include this code in your main nodeJS file:
/* 
    if (typeof localStorage === "undefined" || localStorage === null) {
        var LocalStorage = require('node-localstorage').LocalStorage;
        localStorage = new LocalStorage('./ls');
    }
    var ls = require("./ls");
*/
//The node-localstorage module was not designed by me
//This is merely my way of simplifying its usage
//This Simple LocalStorage module was created by me to work with node-localstorage

module.exports = {
    set: function(key, value) {
        return localStorage.setItem(key, value);
    },
    get: function(key) {
        return localStorage.getItem(key);
    },
    setObj: function(key, obj) {
        return localStorage.setItem(key, JSON.stringify(obj));
    },
    getObj: function(key) {
        return JSON.parse(localStorage.getItem(key));
    },
    exist: function(key) {
        if (localStorage.getItem(key)) {
            return true;
        }
        else {
            return false;
        }
    },
    remove: function(key) {
        return localStorage.removeItem(key);
    },
    clear: function() {
        return localStorage.clear();
    }
}

//The node-localstorage module can be found at:
//https://www.npmjs.com/package/node-localstorage