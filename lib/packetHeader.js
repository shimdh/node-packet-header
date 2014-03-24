/**
 * define header detail type
 * @type {Object}
 */
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

/**
 * Header class to make packet header and body
 * @return {Header class} Header class
 */
var Header = (function() {
    function Header(buffer) {
        this.buffer = buffer != null ? buffer : null;

    }

    /**
     * get this buffer
     * @return {buffer} return this buffer
     */
    Header.prototype.getBuffer = function() {
        return this.buffer;
    };

    /**
     * set this buffer
     * @param {buffer} buffer to set by argument.
     */
    Header.prototype.setBuffer = function(buffer) {
        this.buffer = buffer;
    };

    Header.prototype.write = function(detailFormats, names, values, headerLength) {
        this.buffer = new Buffer(headerLength + values[values.length - 1].length);
        var index = 0;

        for (var i = 0; i < detailFormats.length; i++) {
            if (HeaderTypes.indexOf(detailFormats[i]) <= -1) {
                return false;
            }

            var methodName = HeaderTypes[detailFormats[i]];
            if (methodName === HeaderTypes.slice) {
                values[i].copy(this.buffer, index);
            }
            else {
                this.buffer[HeaderTypes[methodName]['writeName']](values[i], index);
                index += HeaderTypes[methodName]['size'];
            }
        };

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

    /**
     * return string from buffer by base64 decoding
     * @return {string} string from this buffer using base64 decoding.
     */
    Header.prototype.toString = function() {
        return this.buffer.toString('base64');
    };

    return Header;
})();

module.exports.Header = Header;
module.exports.HeaderTypes = HeaderTypes;
