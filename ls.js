//Evolved LocalStorage v3.4.6 (EvG-based system)
//This module was entirely designed by Cannicide

var evg = new (require("./evg"))("ls");

function LS() {

    var storage = evg.get();

    this.set = function(key, value) {
        storage = evg.get();
        storage[key] = value;
        evg.set(storage);
    }

    this.get = function(key) {
        storage = evg.get();
        return this.exist(key) ? storage[key] : false;
    }

    this.exist = function(key) {
        storage = evg.get();
        if (key in storage) {
            return true;
        }
        else {
            return false;
        }
    }

    this.remove = function(key) {
        storage = evg.get();
        if (this.exist(key)) delete storage[key];
        evg.set(storage);
    }

}

module.exports = new LS();