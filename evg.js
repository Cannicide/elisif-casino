//The evergreen (evg) standard storage system, to make the getLS and setLS functions globally accessible.

const fs = require("fs");

/**
 * The evergreen (evg) standard storage system.
 * @param {String} filename - The name of the JSON storage file
 */
function Evg(filename) {

    var storageSrc = __dirname + "/storage/" + filename + ".json";

    function getLS() {
        try {
            //Gets json file, and converts into JS object
            var storage = JSON.parse(fs.readFileSync(storageSrc));
        }
        catch (err) {
            console.log("Reading JSON was not possible due to error: " + err);
            return false;
        }


        //Returns the storage object
        return storage;
    }

    function setLS(newStorage) {

        //Updates json file with new config additions/updates
        fs.writeFileSync(storageSrc, JSON.stringify(newStorage, null, "\t"));
    }

    this.get = getLS;

    this.set = setLS;

}

module.exports = Evg;