/* helper functions for QM API */

//////////////////////////////////////////
// Hash table
function hashTable() {
    var _hashTable = new Object();
    _hashTable._data = new Object();
    _hashTable.keys = new Array();
    _hashTable.vals = new Array();
    _hashTable.put = function (key) { this._data[key] = ""; this.keys.push(key); }
    _hashTable.put = function (key, dat) { this._data[key] = dat; this.keys.push(key); this.vals.push(dat); }
    _hashTable.contains = function (key) { return this._data.hasOwnProperty(key); }
    _hashTable.get = function (key) { return this._data.hasOwnProperty(key) ? this._data[key] : null; }
    return _hashTable;
}

//////////////////////////////////////////
// Console wrappers

// writes outString to fileName 
console._write = function (filePath, outString) {
    console.write({ "file": filePath, "txt": outString });
}
// returns file content string 
console._read = function(filePath) {
	return console.read({"file" : filePath});
}
// writes to stdout 
console._say = function(outString) {
	console.say({"msg" : outString});
}

//////////////////////////////////////////
// packaging reply as jsonp when callback is provided
function jsonp(args, res) {
    try {
        if (args.callback) {
            return args.callback + "(" + JSON.stringify(res) + ");";
        } else {
            return JSON.stringify(res);
        }
    } catch (err) {
        return "error stringifying";
    }
}

//////////////////////////////////////////
// is parameter an object
function isObject(arg) {
    if (arg) {
        if ((typeof arg) == "object") {
            //TODO: check if it's not array
            return true;
        } else {
            return false;
        }
    }
    // if no filter, then always true
    return false;
}

//////////////////////////////////////////
// is parameter an array
function isArray(arg) {
    if (arg) {
        if ((typeof arg) == "object") {
            //TODO: check if it's some other object
            return true;
        } else {
            return false;
        }
    }
    // if no filter, then always true
    return false;
}
