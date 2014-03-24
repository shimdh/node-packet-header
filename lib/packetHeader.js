var HeaderTypes = {
    uInt8: {
        readName: "readUInt8",
        writeName: "writeUInt8",
        size: 1
    },
    uInt16Le: {
        readName: "readUInt16LE",
        writeName: "writeUInt16LE",
        size: 2
    },
    uInt16Be: {
        readName: "readUInt16BE",
        writeName: "writeUInt16BE",
        size: 2
    },
    uInt32Le: {
        readName: "readUInt32LE",
        writeName: "writeUInt32LE",
        size: 4
    },
    uInt32Be: {
        readName: "readUInt32BE",
        writeName: "writeUInt32BE",
        size: 4
    },
    int8: {
        readName: "readInt8",
        writeName: "writeInt8",
        size: 1
    },
    int16Le: {
        readName: "readInt16LE",
        writeName: "writeInt16LE",
        size: 2
    },
    int16Be: {
        readName: "readInt16BE",
        writeName: "writeInt16BE",
        size: 2
    },
    int32Le: {
        readName: "readInt32LE",
        writeName: "writeInt32LE",
        size: 4
    },
    int32Be: {
        readName: "readInt32BE",
        writeName: "writeInt32BE",
        size: 4
    },
    floatLe: {
        "FloatLE",
        "FloatLE",
        size: 4
    },
    floatBe: {
        readName: "FloatBE",
        writeName: "FloatBE",
        size: 4
    },
    doubleLe: {
        readName: "readDoubleLE",
        writeName: "writeDoubleLE",
        size: 8
    },
    doubleBe: {
        readName: "readDoubleBE"
        writeName: "writeDoubleBE"
        size: 8
    },
    slice: {
        readName: "slice",
        writeName: "copy"
    }
};


var Header = (function() {
    function Header(buffer) {
        this.buffer = buffer != null ? buffer : null;
        if (this.buffer == null) {
            this.init();
        }
    }

    Header.prototype.getBuffer = function() {
        return this.buffer;
    };

    Header.prototype.setBuffer = function(buffer) {
        this.buffer = buffer;
    };

    Header.prototype.write = function(detailFormats, names, values, headerLength) {
        var newBuffer = new Buffer(headerLength + values[values.length - 1].length);
        var index = 0;

        for (var i = 0; i < detailFormats.length; i++) {
            if (HeaderTypes.indexOf(detailFormats[i]) <= -1) {
                return false;
            }

            var methodName = HeaderTypes[detailFormats[i]];
            if (methodName === HeaderTypes.slice) {
                values[i].copy(newBuffer, index);
            }
            else {
                newBuffer[HeaderTypes[methodName]['writeName']](values[i], index);
                index += HeaderTypes[methodName]['size'];
            }
        };

        this.buffer = newBuffer;
        return true;
    };

    Header.prototype.read = function(detailFormats, names, headerLength) {
        if (this.buffer.length !== headerLength) return false;

        var index = 0;

        for (var i = 0; i < detailFormats.length; i++) {
            if (HeaderTypes.indexOf(detailFormats[i]) <= -1) {
                return false;
            }

            var methodName = HeaderTypes[detailFormats[i]];
            if (methodName === HeaderTypes.slice) {
                this[names[i]] = this.buffer.slice(index);
            }
            else {
                this.buffer[HeaderTypes[methodName]['readName']](index);
                index += HeaderTypes[methodName]['size'];
            }
        };

        return true;
    };

    Header.prototype.isValid = function(fun) {
        return fun();
    };

    Header.prototype.toString = function() {
        return this.buffer.toString('base64');
    };

    return Header;
})();

module.exports.Header = Header;
module.exports.HeaderTypes = HeaderTypes;
