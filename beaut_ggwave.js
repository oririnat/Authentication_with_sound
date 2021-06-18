var ggwave_factory = (function() {
    var _scriptDir = typeof document !== 'undefined' && document.currentScript ? document.currentScript.src : undefined;
    if (typeof __filename !== 'undefined') _scriptDir = _scriptDir || __filename;
    return (
        function(ggwave_factory) {
            ggwave_factory = ggwave_factory || {};

            var Module = typeof ggwave_factory !== "undefined" ? ggwave_factory : {};
            var readyPromiseResolve, readyPromiseReject;
            Module["ready"] = new Promise(function(resolve, reject) {
                readyPromiseResolve = resolve;
                readyPromiseReject = reject
            });
            var moduleOverrides = {};
            var key;
            for (key in Module) {
                if (Module.hasOwnProperty(key)) {
                    moduleOverrides[key] = Module[key]
                }
            }
            var arguments_ = [];
            var thisProgram = "./this.program";
            var quit_ = function(status, toThrow) {
                throw toThrow
            };
            var ENVIRONMENT_IS_WEB = false;
            var ENVIRONMENT_IS_WORKER = false;
            var ENVIRONMENT_IS_NODE = false;
            var ENVIRONMENT_IS_SHELL = false;
            ENVIRONMENT_IS_WEB = typeof window === "object";
            ENVIRONMENT_IS_WORKER = typeof importScripts === "function";
            ENVIRONMENT_IS_NODE = typeof process === "object" && typeof process.versions === "object" && typeof process.versions.node === "string";
            ENVIRONMENT_IS_SHELL = !ENVIRONMENT_IS_WEB && !ENVIRONMENT_IS_NODE && !ENVIRONMENT_IS_WORKER;
            var scriptDirectory = "";

            function locateFile(path) {
                if (Module["locateFile"]) {
                    return Module["locateFile"](path, scriptDirectory)
                }
                return scriptDirectory + path
            }
            var read_, readAsync, readBinary, setWindowTitle;
            var nodeFS;
            var nodePath;
            if (ENVIRONMENT_IS_NODE) {
                if (ENVIRONMENT_IS_WORKER) {
                    scriptDirectory = require("path").dirname(scriptDirectory) + "/"
                } else {
                    scriptDirectory = __dirname + "/"
                }
                read_ = function shell_read(filename, binary) {
                    var ret = tryParseAsDataURI(filename);
                    if (ret) {
                        return binary ? ret : ret.toString()
                    }
                    if (!nodeFS) nodeFS = require("fs");
                    if (!nodePath) nodePath = require("path");
                    filename = nodePath["normalize"](filename);
                    return nodeFS["readFileSync"](filename, binary ? null : "utf8")
                };
                readBinary = function readBinary(filename) {
                    var ret = read_(filename, true);
                    if (!ret.buffer) {
                        ret = new Uint8Array(ret)
                    }
                    assert(ret.buffer);
                    return ret
                };
                if (process["argv"].length > 1) {
                    thisProgram = process["argv"][1].replace(/\\/g, "/")
                }
                arguments_ = process["argv"].slice(2);
                process["on"]("uncaughtException", function(ex) {
                    if (!(ex instanceof ExitStatus)) {
                        throw ex
                    }
                });
                process["on"]("unhandledRejection", abort);
                quit_ = function(status) {
                    process["exit"](status)
                };
                Module["inspect"] = function() {
                    return "[Emscripten Module object]"
                }
            } else if (ENVIRONMENT_IS_SHELL) {
                if (typeof read != "undefined") {
                    read_ = function shell_read(f) {
                        var data = tryParseAsDataURI(f);
                        if (data) {
                            return intArrayToString(data)
                        }
                        return read(f)
                    }
                }
                readBinary = function readBinary(f) {
                    var data;
                    data = tryParseAsDataURI(f);
                    if (data) {
                        return data
                    }
                    if (typeof readbuffer === "function") {
                        return new Uint8Array(readbuffer(f))
                    }
                    data = read(f, "binary");
                    assert(typeof data === "object");
                    return data
                };
                if (typeof scriptArgs != "undefined") {
                    arguments_ = scriptArgs
                } else if (typeof arguments != "undefined") {
                    arguments_ = arguments
                }
                if (typeof quit === "function") {
                    quit_ = function(status) {
                        quit(status)
                    }
                }
                if (typeof print !== "undefined") {
                    if (typeof console === "undefined") console = {};
                    console.log = print;
                    console.warn = console.error = typeof printErr !== "undefined" ? printErr : print
                }
            } else if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
                if (ENVIRONMENT_IS_WORKER) {
                    scriptDirectory = self.location.href
                } else if (typeof document !== "undefined" && document.currentScript) {
                    scriptDirectory = document.currentScript.src
                }
                if (_scriptDir) {
                    scriptDirectory = _scriptDir
                }
                if (scriptDirectory.indexOf("blob:") !== 0) {
                    scriptDirectory = scriptDirectory.substr(0, scriptDirectory.lastIndexOf("/") + 1)
                } else {
                    scriptDirectory = ""
                } {
                    read_ = function(url) {
                        try {
                            var xhr = new XMLHttpRequest;
                            xhr.open("GET", url, false);
                            xhr.send(null);
                            return xhr.responseText
                        } catch (err) {
                            var data = tryParseAsDataURI(url);
                            if (data) {
                                return intArrayToString(data)
                            }
                            throw err
                        }
                    };
                    if (ENVIRONMENT_IS_WORKER) {
                        readBinary = function(url) {
                            try {
                                var xhr = new XMLHttpRequest;
                                xhr.open("GET", url, false);
                                xhr.responseType = "arraybuffer";
                                xhr.send(null);
                                return new Uint8Array(xhr.response)
                            } catch (err) {
                                var data = tryParseAsDataURI(url);
                                if (data) {
                                    return data
                                }
                                throw err
                            }
                        }
                    }
                    readAsync = function(url, onload, onerror) {
                        var xhr = new XMLHttpRequest;
                        xhr.open("GET", url, true);
                        xhr.responseType = "arraybuffer";
                        xhr.onload = function() {
                            if (xhr.status == 200 || xhr.status == 0 && xhr.response) {
                                onload(xhr.response);
                                return
                            }
                            var data = tryParseAsDataURI(url);
                            if (data) {
                                onload(data.buffer);
                                return
                            }
                            onerror()
                        };
                        xhr.onerror = onerror;
                        xhr.send(null)
                    }
                }
                setWindowTitle = function(title) {
                    document.title = title
                }
            } else {}
            var out = Module["print"] || console.log.bind(console);
            var err = Module["printErr"] || console.warn.bind(console);
            for (key in moduleOverrides) {
                if (moduleOverrides.hasOwnProperty(key)) {
                    Module[key] = moduleOverrides[key]
                }
            }
            moduleOverrides = null;
            if (Module["arguments"]) arguments_ = Module["arguments"];
            if (Module["thisProgram"]) thisProgram = Module["thisProgram"];
            if (Module["quit"]) quit_ = Module["quit"];
            var tempRet0 = 0;
            var setTempRet0 = function(value) {
                tempRet0 = value
            };
            var wasmBinary;
            if (Module["wasmBinary"]) wasmBinary = Module["wasmBinary"];
            var noExitRuntime;
            if (Module["noExitRuntime"]) noExitRuntime = Module["noExitRuntime"];
            if (typeof WebAssembly !== "object") {
                abort("no native wasm support detected")
            }
            var wasmMemory;
            var ABORT = false;
            var EXITSTATUS;

            function assert(condition, text) {
                if (!condition) {
                    abort("Assertion failed: " + text)
                }
            }
            var UTF8Decoder = typeof TextDecoder !== "undefined" ? new TextDecoder("utf8") : undefined;

            function UTF8ArrayToString(heap, idx, maxBytesToRead) {
                var endIdx = idx + maxBytesToRead;
                var endPtr = idx;
                while (heap[endPtr] && !(endPtr >= endIdx)) ++endPtr;
                if (endPtr - idx > 16 && heap.subarray && UTF8Decoder) {
                    return UTF8Decoder.decode(heap.subarray(idx, endPtr))
                } else {
                    var str = "";
                    while (idx < endPtr) {
                        var u0 = heap[idx++];
                        if (!(u0 & 128)) {
                            str += String.fromCharCode(u0);
                            continue
                        }
                        var u1 = heap[idx++] & 63;
                        if ((u0 & 224) == 192) {
                            str += String.fromCharCode((u0 & 31) << 6 | u1);
                            continue
                        }
                        var u2 = heap[idx++] & 63;
                        if ((u0 & 240) == 224) {
                            u0 = (u0 & 15) << 12 | u1 << 6 | u2
                        } else {
                            u0 = (u0 & 7) << 18 | u1 << 12 | u2 << 6 | heap[idx++] & 63
                        }
                        if (u0 < 65536) {
                            str += String.fromCharCode(u0)
                        } else {
                            var ch = u0 - 65536;
                            str += String.fromCharCode(55296 | ch >> 10, 56320 | ch & 1023)
                        }
                    }
                }
                return str
            }

            function UTF8ToString(ptr, maxBytesToRead) {
                return ptr ? UTF8ArrayToString(HEAPU8, ptr, maxBytesToRead) : ""
            }

            function stringToUTF8Array(str, heap, outIdx, maxBytesToWrite) {
                if (!(maxBytesToWrite > 0)) return 0;
                var startIdx = outIdx;
                var endIdx = outIdx + maxBytesToWrite - 1;
                for (var i = 0; i < str.length; ++i) {
                    var u = str.charCodeAt(i);
                    if (u >= 55296 && u <= 57343) {
                        var u1 = str.charCodeAt(++i);
                        u = 65536 + ((u & 1023) << 10) | u1 & 1023
                    }
                    if (u <= 127) {
                        if (outIdx >= endIdx) break;
                        heap[outIdx++] = u
                    } else if (u <= 2047) {
                        if (outIdx + 1 >= endIdx) break;
                        heap[outIdx++] = 192 | u >> 6;
                        heap[outIdx++] = 128 | u & 63
                    } else if (u <= 65535) {
                        if (outIdx + 2 >= endIdx) break;
                        heap[outIdx++] = 224 | u >> 12;
                        heap[outIdx++] = 128 | u >> 6 & 63;
                        heap[outIdx++] = 128 | u & 63
                    } else {
                        if (outIdx + 3 >= endIdx) break;
                        heap[outIdx++] = 240 | u >> 18;
                        heap[outIdx++] = 128 | u >> 12 & 63;
                        heap[outIdx++] = 128 | u >> 6 & 63;
                        heap[outIdx++] = 128 | u & 63
                    }
                }
                heap[outIdx] = 0;
                return outIdx - startIdx
            }

            function stringToUTF8(str, outPtr, maxBytesToWrite) {
                return stringToUTF8Array(str, HEAPU8, outPtr, maxBytesToWrite)
            }

            function lengthBytesUTF8(str) {
                var len = 0;
                for (var i = 0; i < str.length; ++i) {
                    var u = str.charCodeAt(i);
                    if (u >= 55296 && u <= 57343) u = 65536 + ((u & 1023) << 10) | str.charCodeAt(++i) & 1023;
                    if (u <= 127) ++len;
                    else if (u <= 2047) len += 2;
                    else if (u <= 65535) len += 3;
                    else len += 4
                }
                return len
            }
            var UTF16Decoder = typeof TextDecoder !== "undefined" ? new TextDecoder("utf-16le") : undefined;

            function UTF16ToString(ptr, maxBytesToRead) {
                var endPtr = ptr;
                var idx = endPtr >> 1;
                var maxIdx = idx + maxBytesToRead / 2;
                while (!(idx >= maxIdx) && HEAPU16[idx]) ++idx;
                endPtr = idx << 1;
                if (endPtr - ptr > 32 && UTF16Decoder) {
                    return UTF16Decoder.decode(HEAPU8.subarray(ptr, endPtr))
                } else {
                    var str = "";
                    for (var i = 0; !(i >= maxBytesToRead / 2); ++i) {
                        var codeUnit = HEAP16[ptr + i * 2 >> 1];
                        if (codeUnit == 0) break;
                        str += String.fromCharCode(codeUnit)
                    }
                    return str
                }
            }

            function stringToUTF16(str, outPtr, maxBytesToWrite) {
                if (maxBytesToWrite === undefined) {
                    maxBytesToWrite = 2147483647
                }
                if (maxBytesToWrite < 2) return 0;
                maxBytesToWrite -= 2;
                var startPtr = outPtr;
                var numCharsToWrite = maxBytesToWrite < str.length * 2 ? maxBytesToWrite / 2 : str.length;
                for (var i = 0; i < numCharsToWrite; ++i) {
                    var codeUnit = str.charCodeAt(i);
                    HEAP16[outPtr >> 1] = codeUnit;
                    outPtr += 2
                }
                HEAP16[outPtr >> 1] = 0;
                return outPtr - startPtr
            }

            function lengthBytesUTF16(str) {
                return str.length * 2
            }

            function UTF32ToString(ptr, maxBytesToRead) {
                var i = 0;
                var str = "";
                while (!(i >= maxBytesToRead / 4)) {
                    var utf32 = HEAP32[ptr + i * 4 >> 2];
                    if (utf32 == 0) break;
                    ++i;
                    if (utf32 >= 65536) {
                        var ch = utf32 - 65536;
                        str += String.fromCharCode(55296 | ch >> 10, 56320 | ch & 1023)
                    } else {
                        str += String.fromCharCode(utf32)
                    }
                }
                return str
            }

            function stringToUTF32(str, outPtr, maxBytesToWrite) {
                if (maxBytesToWrite === undefined) {
                    maxBytesToWrite = 2147483647
                }
                if (maxBytesToWrite < 4) return 0;
                var startPtr = outPtr;
                var endPtr = startPtr + maxBytesToWrite - 4;
                for (var i = 0; i < str.length; ++i) {
                    var codeUnit = str.charCodeAt(i);
                    if (codeUnit >= 55296 && codeUnit <= 57343) {
                        var trailSurrogate = str.charCodeAt(++i);
                        codeUnit = 65536 + ((codeUnit & 1023) << 10) | trailSurrogate & 1023
                    }
                    HEAP32[outPtr >> 2] = codeUnit;
                    outPtr += 4;
                    if (outPtr + 4 > endPtr) break
                }
                HEAP32[outPtr >> 2] = 0;
                return outPtr - startPtr
            }

            function lengthBytesUTF32(str) {
                var len = 0;
                for (var i = 0; i < str.length; ++i) {
                    var codeUnit = str.charCodeAt(i);
                    if (codeUnit >= 55296 && codeUnit <= 57343) ++i;
                    len += 4
                }
                return len
            }

            function allocateUTF8(str) {
                var size = lengthBytesUTF8(str) + 1;
                var ret = _malloc(size);
                if (ret) stringToUTF8Array(str, HEAP8, ret, size);
                return ret
            }

            function alignUp(x, multiple) {
                if (x % multiple > 0) {
                    x += multiple - x % multiple
                }
                return x
            }
            var buffer, HEAP8, HEAPU8, HEAP16, HEAPU16, HEAP32, HEAPU32, HEAPF32, HEAPF64;

            function updateGlobalBufferAndViews(buf) {
                buffer = buf;
                Module["HEAP8"] = HEAP8 = new Int8Array(buf);
                Module["HEAP16"] = HEAP16 = new Int16Array(buf);
                Module["HEAP32"] = HEAP32 = new Int32Array(buf);
                Module["HEAPU8"] = HEAPU8 = new Uint8Array(buf);
                Module["HEAPU16"] = HEAPU16 = new Uint16Array(buf);
                Module["HEAPU32"] = HEAPU32 = new Uint32Array(buf);
                Module["HEAPF32"] = HEAPF32 = new Float32Array(buf);
                Module["HEAPF64"] = HEAPF64 = new Float64Array(buf)
            }
            var INITIAL_MEMORY = Module["INITIAL_MEMORY"] || 16777216;
            var wasmTable;
            var __ATPRERUN__ = [];
            var __ATINIT__ = [];
            var __ATMAIN__ = [];
            var __ATPOSTRUN__ = [];
            var runtimeInitialized = false;
            __ATINIT__.push({
                func: function() {
                    ___wasm_call_ctors()
                }
            });

            function preRun() {
                if (Module["preRun"]) {
                    if (typeof Module["preRun"] == "function") Module["preRun"] = [Module["preRun"]];
                    while (Module["preRun"].length) {
                        addOnPreRun(Module["preRun"].shift())
                    }
                }
                callRuntimeCallbacks(__ATPRERUN__)
            }

            function initRuntime() {
                runtimeInitialized = true;
                callRuntimeCallbacks(__ATINIT__)
            }

            function preMain() {
                callRuntimeCallbacks(__ATMAIN__)
            }

            function postRun() {
                if (Module["postRun"]) {
                    if (typeof Module["postRun"] == "function") Module["postRun"] = [Module["postRun"]];
                    while (Module["postRun"].length) {
                        addOnPostRun(Module["postRun"].shift())
                    }
                }
                callRuntimeCallbacks(__ATPOSTRUN__)
            }

            function addOnPreRun(cb) {
                __ATPRERUN__.unshift(cb)
            }

            function addOnPostRun(cb) {
                __ATPOSTRUN__.unshift(cb)
            }
            var runDependencies = 0;
            var runDependencyWatcher = null;
            var dependenciesFulfilled = null;

            function addRunDependency(id) {
                runDependencies++;
                if (Module["monitorRunDependencies"]) {
                    Module["monitorRunDependencies"](runDependencies)
                }
            }

            function removeRunDependency(id) {
                runDependencies--;
                if (Module["monitorRunDependencies"]) {
                    Module["monitorRunDependencies"](runDependencies)
                }
                if (runDependencies == 0) {
                    if (runDependencyWatcher !== null) {
                        clearInterval(runDependencyWatcher);
                        runDependencyWatcher = null
                    }
                    if (dependenciesFulfilled) {
                        var callback = dependenciesFulfilled;
                        dependenciesFulfilled = null;
                        callback()
                    }
                }
            }
            Module["preloadedImages"] = {};
            Module["preloadedAudios"] = {};

            function abort(what) {
                if (Module["onAbort"]) {
                    Module["onAbort"](what)
                }
                what += "";
                err(what);
                ABORT = true;
                EXITSTATUS = 1;
                what = "abort(" + what + "). Build with -s ASSERTIONS=1 for more info.";
                var e = new WebAssembly.RuntimeError(what);
                readyPromiseReject(e);
                throw e
            }

            function hasPrefix(str, prefix) {
                return String.prototype.startsWith ? str.startsWith(prefix) : str.indexOf(prefix) === 0
            }
            var dataURIPrefix = "data:application/octet-stream;base64,";

            function isDataURI(filename) {
                return hasPrefix(filename, dataURIPrefix)
            }
            var fileURIPrefix = "file://";

            function isFileURI(filename) {
                return hasPrefix(filename, fileURIPrefix)
            }
            var wasmBinaryFile = "data:application/octet-stream;base64,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NgIEDwsgBARAIAAgBDYCBCAEEB8gAEEANgIIIABCADcCAEEAIQULAkAgBkGAgICABE8NACAGIAVBAXUiAiACIAZJG0H/////AyAFQQJ1Qf////8BSRsiAkGAgICABE8NACAAIAJBAnQiBBAgIgI2AgAgACACNgIEIAAgAiAEajYCCCAAIANBAU4EfyACIAEgAxAhIANqBSACCzYCBA8LECkACyUBAn9BCBADIgAiAUHMFhBiIAFBvMsANgIAIABB3MsAQRUQBgALSwECfyAAKAIEIgZBCHUhByAAKAIAIgAgASACIAZBAXEEfyADKAIAIAdqKAIABSAHCyADaiAEQQIgBkECcRsgBSAAKAIAKAIUEQkAC6MBACAAQQE6ADUCQCAAKAIEIAJHDQAgAEEBOgA0IAAoAhAiAkUEQCAAQQE2AiQgACADNgIYIAAgATYCECADQQFHDQEgACgCMEEBRw0BIABBAToANg8LIAEgAkYEQCAAKAIYIgJBAkYEQCAAIAM2AhggAyECCyAAKAIwQQFHDQEgAkEBRw0BIABBAToANg8LIABBAToANiAAIAAoAiRBAWo2AiQLCx0AIAEEQCAAIAEoAgAQQiAAIAEoAgQQQiABEB8LC10BAX8gACgCECIDRQRAIABBATYCJCAAIAI2AhggACABNgIQDwsCQCABIANGBEAgACgCGEECRw0BIAAgAjYCGA8LIABBAToANiAAQQI2AhggACAAKAIkQQFqNgIkCwsUACAAQcTKADYCACAAQQRqEGAgAAsJAEGYyQAQMgALnhECD38BfiMAQdAAayIGJAAgBiABNgJMIAZBN2ohFCAGQThqIRJBACEBAkADQAJAIA9BAEgNAEH/////ByAPayABSARAQdjWAEE9NgIAQX8hDwwBCyABIA9qIQ8LIAYoAkwiCyEBAkACQAJAIAstAAAiBwRAA0ACQAJAIAdB/wFxIgdFBEAgASEHDAELIAdBJUcNASABIQcDQCABLQABQSVHDQEgBiABQQJqIgk2AkwgB0EBaiEHIAEtAAIhCiAJIQEgCkElRg0ACwsgByALayEBIAAEQCAAIAsgARAjCyABDQYgBigCTCEBIAYCfwJAIAYoAkwsAAFBMGtBCk8NACABLQACQSRHDQAgASwAAUEwayERQQEhEyABQQNqDAELQX8hESABQQFqCyIBNgJM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A3FFDQAgAC0AAEUEQEEADwsDQCABQQFqIgFBA3FFDQEgAS0AAA0ACwwBCwNAIAEiAkEEaiEBIAIoAgAiA0F/cyADQYGChAhrcUGAgYKEeHFFDQALIANB/wFxRQRAIAIgAGsPCwNAIAItAAEhAyACQQFqIgEhAiADDQALCyABIABrC8EBAQN/AkAgASACKAIQIgMEfyADBSACEKgBDQEgAigCEAsgAigCFCIFa0sEQCACIAAgASACKAIkEQYADwsCQCACLABLQQBIBEBBACEDDAELIAEhBANAIAQiA0UEQEEAIQMMAgsgACADQQFrIgRqLQAAQQpHDQALIAIgACADIAIoAiQRBgAiBCADSQ0BIAAgA2ohACABIANrIQEgAigCFCEFCyAFIAAgARAhGiACIAIoAhQgAWo2AhQgASADaiEECyAEC0kAAkAgAUUNACABQcTOABAoIgFFDQAgASgCCCAAKAIIQX9zcQ0AIAAoAgwgASgCDEEAECJFDQAgACgCECABKAIQQQAQIg8LQQALUgEBfyAAKAIEIQQgACgCACIAIAECf0EAIAJFDQAaIARBCHUiASAEQQFxRQ0AGiACKAIAIAFqKAIACyACaiADQQIgBEECcRsgACgCACgCHBEHAAsKACAAIAFBABAiCwsAIAAQRBogABAfCxQAIABB2MoANgIAIABBBGoQYCAACwcAIAAoAgQLLAEBfwJ/IAAoAgBBDGsiACIBIAEoAghBAWsiATYCCCABQX9MCwRAIAAQHwsLewICfwF+IwBBMGsiACQAQQEgAEEgahAWBEBB2NYAKAIAGhAIAAsgAAJ/IABBEGoiASAANAIgNwMAIAELAn8gAEEIaiIBIABBIGpBBHI0AgA3AwAgAQsQwwE3AxggAEEoaiIBIAApAxg3AwAgASkDACECIABBMGokACACCx0AIABBmMoANgIAIABBxMoANgIAIABBBGogARBjCzcBAn8gARBYIgJBDWoQICIDQQA2AgggAyACNgIEIAMgAjYCACAAIANBDGogASACQQFqECE2AgALCgAgAEHM1wAQFwsKACAAQbDXABAYC7sCAAJAIAFBFEsNAAJAAkACQAJAAkACQAJAAkACQAJAIAFBCWsOCgABAgMEBQYHCAkKCyACIAIoAgAiAUEEajYCACAAIAEoAgA2AgAPCyACIAIoAgAiAUEE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IAALKAEBfyMAQRBrIgAkACAAQdInNgIMQeQtQQcgACgCDBABIABBEGokAAsoAQF/IwBBEGsiACQAIABBsyc2AgxBvC1BBiAAKAIMEAEgAEEQaiQACygBAX8jAEEQayIAJAAgAEHFJTYCDEGULUEFIAAoAgwQASAAQRBqJAALKAEBfyMAQRBrIgAkACAAQaclNgIMQewsQQQgACgCDBABIABBEGokAAtHAQF/IwBBIGsiAiQAIAIgASgCGDYCGCACIAEpAhA3AxAgAiABKQIINwMIIAIgASkCADcDACACIAARAQAhACACQSBqJAAgAAsoAQF/IwBBEGsiACQAIABBsyM2AgxBiA5BACAAKAIMEAEgAEEQaiQACykBAX8jAEEQayIAJAAgAEHEIjYCDEHA0AAgACgCDEEIEAogAEEQaiQACykBAX8jAEEQayIAJAAgAEG+IjYCDEG00AAgACgCDEEEEAogAEEQaiQACy0BAX8jAEEQayIAJAAgAEGwIjYCDEGo0AAgACgCDEEEQQBBfxACIABBEGokAAs1AQF/IwBBEGsiACQAIABBqyI2AgxBnNAAIAAoAgxBBEGAgICAeEH/////BxACIABBEGokAAtJAQF/IwBBIGsiASQAIAEgABEAAEEcECAiACABKAIYNgIYIAAgASkDEDcCECAAIAEpAwg3AgggACABKQMANwIAIAFBIGokACAACy0BAX8jAEEQayIAJAAgAEGeIjYCDEGQ0AAgACgCDEEEQQBBfxACIABBEGokAAs1AQF/IwBBEGsiACQAIABBmiI2AgxBhNAAIAAoAgxBBEGAgICAeEH/////BxACIABBEGokAAsvAQF/IwBBEGsiACQAIABBiyI2AgxB+M8AIAAoAgxBAkEAQf//AxACIABBEGokAAsxAQF/IwBBEGsiACQAIABBhSI2AgxB7M8AIAAoAgxBAkGAgH5B//8BEAIgAEEQaiQACy4BAX8jAEEQayIAJAAgAEH3ITYCDEHUzwAgACgCDEEBQQBB/wEQAiAAQRBqJAALLwEBfyMAQRBrIgAkACAAQeshNgIMQeDPACAAKAIMQQFBgH9B/wAQAiAAQRBqJAALLwEBfyMAQRBrIgAkACAAQeYhNgIMQcjPACAAKAIMQQFBgH9B/wAQAiAAQRBqJAALRQEBfyMAQRBrIgEkACABIAA2AgwCfyMAQRBrIgAgASgCDDYCCCAAIAAoAggoAgQ2AgwgACgCDAsQbCEAIAFBEGokACAAC40DAgV/A3wgAEEANgIIIABCADcCACAAQYDAABAgIgE2AgAgACABQYBAayICNgIIIAFBAEGAwAAQHiEDIABBADYCFCAAQgA3AgwgACACNgIEIABBgAYQICIBNgIMIAAgAUGABmoiAjYCFCABQQBBgAYQHiEEIABBADYCICAAQgA3AhggACACNgIQIABBgAIQICIBNgIYIAAgAUGAAmoiAjYCICABQQBBgAIQHiEFIABBADYCLCAAQgA3AiQgACACNgIcIABBgMAAECAiAjYCJCAAIAJBgEBrIgE2AiwgACABNgIoIANBgICA/AM2AgBBASEBA0AgAbciBkQYLURU+yEJQKJEAAAAAAAAoD+iIgcQNCEIIAMgAUECdGogBkQYLURU+yFZP6IQR0QAAAAAAADgP6JEAAAAAAAA4D+gIAggB6O2u6K2OAIAIAFBAWoiAUGAEEcNAAsgAEIANwMwIABBQGtCADcDACAAQgA3AzggBUEAQYACEB4aIARBAEGABhAeGiACQQBBgMAAEB4aCwUAQbwhCxMAIABBBGpBACABKAIEQaQhRhsLXQECfyACKAIAIgIgACgCBCIEKAIAIgMgAiADSRsiAgRAIAEoAgAgACgCCCgCACACECogACgCBCIEKAIAIQMLIAQgAyACazYCACAAKAIIIgAgACgCACACajYCACACCxQAIAFB/B82AgAgASAAKQIENwIECxwBAX9BDBAgIgFB/B82AgAgASAAKQIENwIEIAELBQBB7B8LEwAgAEEEakEAIAEoAgRB1B9GGwszACACKAIAIgIEQCAAKAIEKAIAIAEoAgAgAhAqCyAAKAIIIAIgACgCDCgCACgCFG42AgALHgAgAUGoHjYCACABIAApAgQ3AgQgASAAKAIMNgIMCyYBAX9BEBAgIgFBqB42AgAgASAAKQIENwIEIAEgACgCDDYCDCABC8cCAQV/IAAoAggoAgAgAC8BBGoiAyACKAIIKAIAIAIvAQRqIgRHBEAgBCADIAAtAAAQIRoLIAIgAC0AACIDOgAAIAAtAAAiBCABLQAAIgVrQQFqIgZBAU4EQEEAIQMDQAJAIAIoAggoAgAgAi8BBGogA2otAAAiBkUNACAFQQJJDQBBASEE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BGohACADKAIEIgVFDQEgACEDCyADIQEgBSEDDAELCyACIAM2AgAgAA8LIAIgAzYCACABDwsgAiAHNgIAIAcPCyACIAE2AgAgAyABNgIAIAMLDwBBxNYAQcjWACgCABA4C8MDAgV/An5ByNYAQgA3AgBBxNYAQcjWADYCAAJAIAAoAgQiAkUNACAAKAIAIgMgAkEUbGohBUHI1gAhAANAQcjWACgCACECAkACQAJAQcjWACIBIABGDQACQCACIgAEQANAIAAiASgCBCIADQAMAgsAC0HQ1gAhAUHQ1gAoAgAoAgBByNYARgRAA0AgASgCACIAQQhqIQEgACAAKAIIKAIARg0ACwsgASgCACEBCyADKAIAIgQgASgCEEoNACACRQRAQcjWACIAIQIMAgsDQCACIgAoAhAiAiAESgRAIAAoAgAiAg0BIAAhAgwDCyACIARODQMgACgCBCICDQALIAAiAkEEaiEADAELIAFBBGpByNYAIAIbIgAoAgANASABQcjWACACGyECC0EkECAhASADKQIIIQYgAygCECEEIAMpAgAhByABIAI2AgggAUIANwIAIAEgBDYCICABIAY3AhggASAHNwIQIAAgATYCAEHE1gAoAgAoAgAiAgRAQcTWACACNgIAIAAoAgAhAQtByNYAKAIAIAEQLUHM1gBBzNYAKAIAQQFqNgIACyADQRRqIgMgBUYNAUHE1gAoAgAhAAwACwALC7MDAQd/IAEgACgCCCIEIAAoAgQiAmtBDG1NBEAgACABBH8gAkEAIAFBDGxBDGtBDG5BDGxBDGoiABAeIABqBSACCzYCBA8LAkACQAJAIAIgACgCACIGa0EMbSIFIAFqIgNB1qrVqgFJBEACfyADIAQgBmtBDG0iBEEBdCIHIAMgB0sbQdWq1aoBIARBqtWq1QBJGyIEBEAgBEHWqtWqAU8NAyAEQQxsECAhCAsgCCAFQQxsaiIDC0EAIAFBDGxBDGtBDG5BDGxBDGoiARAeIgcgAWohBSAIIARBDGxqIQEgAiAGRg0CA0AgA0EMayIDQQA2AgggA0IANwIAIAMgAkEMayICKAIANgIAIAMgAigCBDYCBCADIAIoAgg2AgggAkEANgIIIAJCADcCACACIAZHDQALIAAgATYCCCAAKAIEIQEgACAFNgIEIAAoAgAhAiAAIAM2AgAgASACRg0DA0AgAUEMayIAKAIAIgMEQCABQQhrIAM2AgAgAxAfCyAAIgEgAkcNAAsMAwsQKQALQdYXEDIACyAAIAE2AgggACAFNgIEIAAgBzYCAAsgAgRAIAIQHwsLBwAgABEKAAuRAgEFfyMAQRBrIgUkACABIAJHBEAgAEEEaiEHA0AgACAHIAVBDGogBUEIaiABIgRBEGoiARCUASIGKAIARQRAQSQQICIDIAEoAhA2AiAgAyABKQIINwIYIAMgASkCADcCECAFKAIMIQEgA0IANwIAIAMgATYCCCAGIAM2AgAgACgCACgCACIBBEAgACABNgIAIAYoAgAhAwsgACgCBCADEC0gACAAKAIIQQFqNgIICwJAIAQoAgQiA0UEQCAEKAIIIgEoAgAgBEYNASAEQQhqIQMDQCADKAIAIgRBCGohAyAEIAQoAggiASgCAEcNAAsMAQsDQCADIgEoAgAiAw0ACwsgASACRw0ACwsgBUEQaiQAC8UrBBV/An4GfQJ8IwBB0AJrIgEkACAAQQACfyAAKAL8ASAAKALsASICQQxsaiIDIABBlAFqRwRAIAMgACgClAEgACgCmAEQPiAAKALsASECCyACQQFqCyACQQJKGyIDNgLsAQJAIAMEQCAALQBIRQ0BCyAAQQE6AIQBIAAoAvQBIAAoAvABIghrIgNBAU4EQCAIQQAgA0ECdiIDIANBAEdrQQJ0QQRqEB4aCyAAKAIIIQUCQCAAKAL8ASIDIAAoAoACIgRHBEAgBUEBSA0BA0AgAygCACEJQQAhAgNAIAggAkECdCIHaiIKIAcgCWoqAgAgCioCAJI4AgAgAkEBaiICIAVHDQALIANBDGoiAyAERw0ACwtBACECIAVBAEwNAANAIAggAkECdGoiAyADKgIAQwAAgD6UOAIAIAJBAWoiAiAFRw0ACwsgBQR/IAAoAmwgCCAFQQJ0ECogACgCCAVBAAshAyAAKAJsIAAoAnggAxA9IAAoAggiA0EBSA0AIAAoAogBIQggACgCeCEFQQAhAgNAIAggAkECdGogBSACQQN0IgRqKgIAIhggGJQgBSAEQQRyaioCACIYIBiUkjgCACACQQFqIgIgA0cNAAsgA0EESA0AIANBAm0iAkECIAJBAkobIQggACgCiAEhBUEBIQIDQCAFIAJBAnRqIgQgBSADIAJrQQJ0aioCACAEKgIAkjgCACACQQFqIgIgCEcNAAsLAkAgACgCXCICQQFIDQAgACgCCCIDBEAgACgCiAIgACgCZCACayADbEECdGogACgClAEgA0ECdBAqIAAoAlwhAgsgACACQQFrNgJcIAJBAUoNACAAQQE6AEkLIAAtAEkEQEG4yAAoAgAiDiIDKAJMGkGzFEEbIAMQWRoQYSEWIAAoAghBEG0hEAJAAkACQCAAKALgASIDIABB5AFqIhFHBEAgAUH8AGohBgNAAkAgAyIJKAIYIAAoAlBHDQAgACgCjAEgACgCiAEiA2siAkEBTgRAIANBACACQQJ2IgMgA0EAR2tBAnRBBGoQHhoLIAAgACgCNCIDQQR0Igg2AmAgACAINgJYIANBAUgNAANAIAgiD0EBayEIQQAhB0EAIQ0CQAJAAkAgDyAAKAJUQQR0Sg0AIAkoAhwhAkEAIQogCCEEA0AgACgCwAIgACgCvAJrIApBAWoiDCAJKAIgbEwNASAAKAIIIgMEQCAAKAJsIAAoAogCIAQgEGxBAnRqIANBAnQQKiAJKAIcIQILIAAoAgghBQJAIAJBAkgNACAFQQFIDQAgAkECIAJBAkobIQsgACgCbCESIAAoAogCIRNBASEDA0AgA0EEdCAEaiAQbCEUQQAhAgNAIBIgAkECdGoiFSATIAIgFGpBAnRqKgIAIBUqAgCSOAIAIAJBAWoiAiAFRw0ACyADQQFqIgMgC0cNAAsLIAAoAmwgACgCeCAFED0CQCAAKAIIIgNBAUgNACAAKAKIASEEIAAoAnghBUEAIQIDQCAEIAJBAnRqIAUgAkEDdCILaioCACIYIBiUIAUgC0EEcmoqAgAiGCAYlJI4AgAgAkEBaiICIANHDQALIANBBEgNACADQQJtIgJBAiACQQJKGyEEIAAoAogBIQVBASECA0AgBSACQQJ0aiILIAUgAyACa0ECdGoqAgAgCyoCAJI4AgAgAkEBaiICIARHDQALC0EAIQVBACEDIAkoAiAiC0EASgRAA0ACfyAAKgIkuyAAKgIgIAkoAhiylLuiEDsgA0EEdLegIh6ZRAAAAAAAAOBBYwRAIB6qDAELQYCAgIB4CyECQQ9BDkENQQxBC0EKQQlBCEEHQQZBBUEEQQNBAiAAKAKIASACQQJ0aiICKgIAuyIeRAAAAAAAAAAAIB5EAAAAAAAAAABkGyIeIAIqAgS7Ih9jIgQgHyAeIAQbIh4gAioCCLsiH2MiBBsgHyAeIAQbIh4gAioCDLsiH2MiBBsgHyAeIAQbIh4gAioCELsiH2MiBBsgHyAeIAQbIh4gAioCFLsiH2MiBBsgHyAeIAQbIh4gAioCGLsiH2MiBBsgHyAeIAQbIh4gAioCHLsiH2MiBBsgHyAeIAQbIh4gAioCILsiH2MiBBsgHyAeIAQbIh4gAioCJLsiH2MiBBsgHyAeIAQbIh4gAioCKLsiH2MiBBsgHyAeIAQbIh4gAioCLLsiH2MiBBsgHyAeIAQbIh4gAioCMLsiH2MiBBsgHyAeIAQbIh4gAioCNLsiH2MiBBsgHyAeIAQbIh4gAioCOLsiH2MiBBsgAioCPLsgHyAeIAQbZBshAiADQQFxBH8gACgCvAIgCiALbCADQQF2amogAkEEdCAFajoAAEEABSACCyEFIANBAWoiAyAJKAIgIgtBAXRIDQALCyANIAAoAjgiBCAKIAtsTnJBAXFFBEBBACENIAFBADoAeCABIARBAWsiAzoAcSABQQE6AHAgA0H/AXFBAWoQICECIAFBADsBhAEgASACNgJ0IAEgBDoAggEgASAGNgKIASABQQA7AYABIAEgBDoAjgEgASAGNgKUASABQYACOwGMASABIANBAXQiAzoAmgEgAUGABjsBpAEgASAGNgKgASABQYAEOwGYASABIAM6AKYBIAFBBDoAsQEgASAGNgKsASABIARB/wFxIgU7AZABIAEgBUEBdCILOwGcASABIAsgA0H+AXEiAmoiCzsBqAEgASACIAtqIgs7AbQBIAEgBjYCuAEgASADOgCyASABQYAKOwG8ASABQQA6ALABIAEgBDoAvgEgASAGNgLEASABQYAMOwHIASABIAM6AMoBIAEgBjYC0AEgAUGADjsB1AEgASADOgDWASABIAY2AtwBIAFBCDoA4QEgASADOgDiASABIAIgC2oiBDsBwAEgASAEIAVqIgU7AcwBIAEgAiAFaiIFOwHYASABIAIgBWoiBTsB5AEgAUGAEjsB7AEgASAGNgLoASABQQA6AOABIAEgAzoA7gEgASAGNgL0ASABIAM6APoBIAFBgBQ7AfgBIAEgBjYCgAIgASADOgCGAiABQYAWOwGEAiABQYAYOwGQAiABIAY2AowCIAEgAzoAkgIgASAGNgKYAiABQQ06AJ0CIAEgAiAFaiIFOwHwASABIAIgBWoiBTsB/AEgASACIAVqIgU7AYgCIAEgAiAFaiIFOwGUAiABIAIgBWoiBTsBoAIgASADOgCeAiABQQ46AKkCIAEgBjYCpAIgAUEAOgCcAiABIAIgBWoiBTsBrAIgASADOgCqAiABQQ86ALUCIAEgBjYCsAIgAUEAOgCoAiABIAIgBWoiBTsBuAIgASADOgC2AiABIAIgBWo7AcQCIAFBEDoAwQIgASAGNgK8AiABQQA6ALQCIAEgAzoAwgIgASAGNgLIAiABQQA6AMACQRUhAgJAIAFB8ABqIAAoArwCIgMgAyABLQBwaiAAKALAARA8DQAgACgCwAEtAAAiA0EBa0H/AXFBiwFLDQAgACgCOCECQRVBACAAKAJUIgUgCSgCHCAJKAIgIgQgA0EETwR/IANBBW5BAXQiB0EEIAdBBEsbBUECCyACIANqampBAWsgBG1sIgJIIAUgAiAAKAI0QQF0akpyIgUbIQIgBUEBcyENIAMhBwsgASgCdCIDBEAgAxAfCyACDQIgACgCOCEEC0ECIQIgB0EETgRAIAdBBW5BAXQiA0EEIANBBEsbIQILAkAgDUEBcQRAIAQgB2ogAmpBAWogCSgCICAKbEgNBCAMQYAIRg0EDAELQQAhDSAMQYAIRg0ECyAJKAIcIgIgDCIKbEEEdCAIaiIEIAAoAlRBBHRIDQALCyANQQFxRQ0BC0ECIQJBACEFIAFBADoAeCAHQQROBEAgB0EFbkEBdCIDQQQgA0EESxshAgsgASACOgBxIAEgBzoAcCACQf8BcUEBahAgIQMgAUEAOwGEASABIAM2AnQgASACIAdqIgQ6AIIBIAEgBjYCiAEgAUEAOwGAASABIAQ6AI4BIAEgBjYClAEgAUGAAjsBjAEgASACQQF0IgM6AJoBIAFBgAY7AaQBIAEgBjYCoAEgAUGABDsBmAEgASADOgCmASABQQQ6ALEBIAEgBjYCrAEgASAEQf8BcSIKOwGQASABIApBAXQiDDsBnAEgASAMIANB/gFxIgJqIgw7AagBIAEgAiAMaiIMOwG0ASABIAY2ArgBIAEgAzoAsgEgAUGACjsBvAEgAUEAOgCwASABIAQ6AL4BIAEgBjYCxAEgAUGADDsByAEgASADOgDKASABIAY2AtABIAFBgA47AdQBIAEgAzoA1gEgASAGNgLcASABQQg6AOEBIAEgAzoA4gEgASACIAxqIgQ7AcABIAEgBCAKaiIEOwHMASABIAIgBGoiBDsB2AEgASACIARqIgQ7AeQBIAFBgBI7AewBIAEgBjYC6AEgAUEAOgDgASABIAM6AO4BIAEgBjYC9AEgASADOgD6ASABQYAUOwH4ASABIAY2AoACIAEgAzoAhgIgAUGAFjsBhAIgAUGAGDsBkAIgASAGNgKMAiABIAM6AJICIAEgBjYCmAIgAUENOgCdAiABIAIgBGoiBDsB8AEgASACIARqIgQ7AfwBIAEgAiAEaiIEOwGIAiABIAIgBGoiBDsBlAIgASACIARqIgQ7AaACIAEgAzoAngIgAUEOOgCpAiABIAY2AqQCIAFBADoAnAIgASACIARqIgQ7AawCIAEgAzoAqgIgAUEPOgC1AiABIAY2ArACIAFBADoAqAIgASACIARqIgQ7AbgCIAEgAzoAtgIgASACIARqOwHEAiABQRA6AMECIAEgBjYCvAIgAUEAOgC0AiABIAM6AMICIAEgBjYCyAIgAUEAOgDAAgJAIAFB8ABqIAAoArwCIAAoAjhqIgMgAyABLQBwaiAAKALAARA8DQAgACgCwAEiAi0AAEUNACAHQXBPDQYCQAJAIAdBC08EQCAHQRBqQXBxIgUQICEDIAEgBUGAgICAeHI2AmggASADNgJgIAEgBzYCZAwBCyABIAc6AGsgAUHgAGohAyAHRQ0BCyADIAIgBxAhGgsgAyAHakEAOgAAIAkpAhAhFyABIAc2AlAgASAXQiCJNwJUIA5BzxQgAUHQAGoQJCABIAEoAmAgAUHgAGogASwAa0EASBs2AkAgDkH6FCABQUBrECQgACAHNgK8ASAAQQE6ALgBIAAgCSkCHDcC1AEgACAJKQIUNwLMASAAIAkoAhA2AtwBIAEsAGtBf0wEQCABKAJgEB8LQQEhBQsgASgCdCIDBEAgAxAfCyAFDQYLIAAgACgCWEEBazYCWCAPQQFKDQALCwJAIAkoAgQiAkUEQCAJKAIIIgMoAgAgCUYNASAJQQhqIQQDQCAEKAIAIgJBCGohBCACIAIoAggiAygCAEcNAAsMAQsDQCACIgMoAgAiAg0ACwsgAyARRw0ACwsgAEEANgJkIAEgACgCwAEtAAA2AjAgDkGiFSABQTBqECQgAEF/NgJkIABBfzYCvAEMAgsQRQALIABBADYCZAsgAEEAOwFIIAAoAowBIAAoAogBIgNrIgJBAU4EQCADQQAgAkECdiIDIANBAEdrQQJ0QQRqEB4aCyAAQQA2AlggAEEANgJgIAEQYSAWfULoB3+0QwAAekSVuzkDICAOIAFBIGoQzAELIAAtAEghAxAmIgJBBGohByACKAIAIQICQAJAAkAgA0UEQCACIAdHBEAgACgCMCIJQQFIDQIgACgCKCEMIAAqAjwhGiAAKAKIASEKIAAqAiwhGyAAKgIgIRwgACoCJLshHgNAIBwgAiIIKAIYIgSylCEdQQAhAiAJIQUDQCAaIAogDAJ/IB4gHSAbIAKylJK7ohA7Ih+ZRAAAAAAAAOBBYwRAIB+qDAELQYCAgIB4CyIDakECdGoqAgCUIRggCiADQQJ0aioCACEZAkACQCACQQFxBEAgGCAZX0EBc0UNAQwCCyAYIBlgQQFzDQELIAVBAWshBQsgAkEBaiICIAlHDQALIAUgCUYNBAJAIAgoAgQiAwRAA0AgAyICKAIAIgMNAAwCCwALIAgoAggiAigCACAIRg0AIAhBCGohBQNAIAUoAgAiA0EIaiEFIAMgAygCCCICKAIARw0ACwsgAiAHRw0ACwsgAEEANgJMDAMLAkAgAiAHRwRAIAAoAjAiCUEBSA0BIAAoAighDCAAKgI8IRogACgCiAEhCiAAKgIsIRsgACoCICEcIAAqAiS7IR5BACEEA0AgHCACIggoAhiylCEdQQAhAiAJIQUDQCAaIAogDAJ/IB4gHSAbIAKylJK7ohA7Ih+ZRAAAAAAAAOBBYwRAIB+qDAELQYCAgIB4CyIDakECdGoqAgCUIRggCiADQQJ0aioCACEZAkACQCACQQFxBEAgGCAZYEEBc0UNAQwCCyAYIBlfQQFzDQELIAVBAWshBQsgAkEBaiICIAlHDQALIAUgCUYiDw0CAkAgCCgCBCIDBEADQCADIgIoAgAiAw0ADAILAAsgCCgCCCICKAIAIAhGDQAgCEEIaiEFA0AgBSgCACIDQQhqIQUgAyADKAIIIgIoAgBHDQALCyAEIA9yIQQgAiAHRw0ACyAEQQFxDQELIABBADYCTAwDCyAAIAAoAkwiA0EBajYCTCADQQBIDQIgACgCZEECSA0CIAFBABAMNgJwIAAgACgCVCAAKAJca0EBajYCVCABQfAAahBkEGUhAyAAKAJcIQIgASAAKAJUNgIYIAEgAjYCFCABIAM2AhBBuMgAKAIAQZQWIAFBEGoQJCAAQQE2AlwgAEEANgJMDAILIAIoAhghBAsgACAENgJQIAAgACgCTCIDQQFqNgJMIANBf0wNAEEAIQsgAUEAEAw2AnAgASABQfAAahBkEGU2AgBBuMgAKAIAQfgVIAEQJCAAQQE6AEggACgCxAEgACgCwAEiA2siAkEBTgRAIANBACACEB4aCyAAKAI0IQkQJiICKAIAIgMgAkEEaiIIRwRAA0AgCyADIgUoAhwiB0ghCgJAIAMoAgQiAkUEQCAFKAIIIgMoAgAgBUYNASAFQQhqIQQDQCAEKAIAIgJBCGohBCACIAIoAggiAygCAEcNAAsMAQsDQCACIgMoAgAiAg0ACwsgByALIAobIQsgAyAIRw0ACwsQJigCACgCICEFECYiAigCACIDIAJBBGoiB0cEQANAIAMiCCgCICIKIAVIIQwCQCADKAIEIgJFBEAgCCgCCCIDKAIAIAhGDQEgCEEIaiEEA0AgBCgCACICQQhqIQQgAiACKAIIIgMoAgBHDQALDAELA0AgAiIDKAIAIgINAAsLIAogBSAMGyEFIAMgB0cNAAsLIABBADYCTCAAQcQBIAVtQQFqIAtsIAlBAXRqIgM2AmQgACADNgJUIAAgAzYCXAsgAUHQAmokAAvlFwIXfxJ9IwBBkAJrIgIkAAJ/QQAgACgCCCIDRQ0AGiAAKAJsIAAoApQBIANBAnQQKiAAKAIICyEDIAAoAmwgACgCeCADED0CQCAAKAIIIgNBAUgNACAAKAKIASEEIAAoAnghBwNAIAQgAUECdGogByABQQN0IghqKgIAIhggGJQgByAIQQRyaioCACIYIBiUkjgCACABQQFqIgEgA0cNAAsgA0EESA0AIANBAm0iAUECIAFBAkobIQQgACgCiAEhB0EBIQEDQCAHIAFBAnRqIgggByADIAFrQQJ0aioCACAIKgIAkjgCACABQQFqIgEgBEcNAAsLIAAgACgCmAIiASAAKAKUAiIDQQxsaiIHIABBiAFqRwR/IAcgACgCiAEgACgCjAEQPiAAKAKYAiEBIAAoApQCBSADC0EBaiIDQQAgAyAAKAKcAiABa0EMbUgbNgKUAgJAIAAoAuABIgMgAEHkAWoiE0YNAEG4yAAoAgAhFCACQRxqIQgDQCADIgcoAhghFUECIQQgACgCRCIDQQROBEAgA0EFbkEBdCIBQQQgAUEESxshBAsgACgClAIgBygCICIBIAMgBGoiC2pBAWsgAW0iEiAHKAIcbGsiDUF/TARAIAAoApwCIAAoApgCa0EMbSANaiENCyACQQA2AogCIAJCADcDgAICQAJAAkAgCwRAIAtBAXQiCUGAgICABE8NASACIAtBA3QiBBAgIgU2AoACIAIgBSAJQQJ0ajYCiAIgAiAFQQAgBBAeIARqNgKEAgtBACEPIAJBADYC+AEgAkIANwPwAUEAIQQCQCABBEAgAUEBdCIFQYCAgCBPDQEgAiABQQd0IgEQICIENgLwASACIAQgBUEGdGo2AvgBIAIgBEEAIAEQHiABaiIPNgL0AQsgEkEBTgRAIA8gBGtBQHEhFkEBIRBBACEKA0AgBCAPRwRAIARBACAWEB4aCwJAIAcoAhwiCUEATARAIAcoAiAhAQwBCyAAKAKcAiAAKAKYAiIOa0EMbSEMIAcoAiAhAUEAIQUDQCABQQFOBEBBACEDIA4gBSANaiAJIApsaiIBQQAgDCABIAxIG2tBDGxqKAIAIQkDQCAJIANBBXQgFWpBAnRqIgEqAnwhKSABKgJ4IRsgASoCdCEcIAEqAnAhHSABKgJsIR4gASoCaCEfIAEqAmQhICABKgJgISEgASoCXCEiIAEqAlghIyABKgJUISQgASoCUCElIAEqAkwhJiABKgJIIScgASoCRCEoIAFBQGsqAgAhGCAEIANBB3QiEWpBD0EOQQ1BDEELQQpBCUEIQQdBBkEFQQRBA0ECQQFBAEF/IAEqAgAiGUMAAAAAYBsgGUMAAAAAIBlDAAAAAF4bIhkgASoCBCIaXyIGGyAaIBkgBhsiGSABKgIIIhpfIgYbIBogGSAGGyIZIAEqAgwiGl8iBhsgGiAZIAYbIhkgASoCECIaXyIGGyAaIBkgBhsiGSABKgIUIhpfIgYbIBogGSAGGyIZIAEqAhgiGl8iBhsgGiAZIAYbIhkgASoCHCIaXyIGGyAaIBkgBhsiGSABKgIgIhpfIgYbIBogGSAGGyIZIAEqAiQiGl8iBhsgGiAZIAYbIhkgASoCKCIaXyIGGyAaIBkgBhsiGSABKgIsIhpfIgYbIBogGSAGGyIZIAEqAjAiGl8iBhsgGiAZIAYbIhkgASoCNCIaXyIGGyAaIBkgBhsiGSABKgI4IhpfIgYbIAEqAjwgGiAZIAYbYBtBAnRqIgEgASgCAEEBajYCACAEIBFBwAByakEPQQ5BDUEMQQtBCkEJQQhBB0EGQQVBBEEDQQJBAUEAQX8gGEMAAAAAYBsgGEMAAAAAIBhDAAAAAF4bIhggKF8iARsgKCAYIAEbIhggJ18iARsgJyAYIAEbIhggJl8iARsgJiAYIAEbIhggJV8iARsgJSAYIAEbIhggJF8iARsgJCAYIAEbIhggI18iARsgIyAYIAEbIhggIl8iARsgIiAYIAEbIhggIV8iARsgISAYIAEbIhggIF8iARsgICAYIAEbIhggH18iARsgHyAYIAEbIhggHl8iARsgHiAYIAEbIhggHV8iARsgHSAYIAEbIhggHF8iARsgHCAYIAEbIhggG18iARsgGyAYIAEbIClfG0ECdGoiASABKAIAQQFqNgIAIANBAWoiAyAHKAIgIgFIDQALIAcoAhwhCQsgBUEBaiIFIAlIDQALC0EAIQVBACEMQQAhCQJAIAFBAEwNAANAIAEgCmwgBWogC04NASAFQQF0IhFBAXIhBkEAIQEgAigCgAIhDgNAIAcoAhxBAm0iAyABQQJ0IhcgBCARQQZ0amooAgBIBEAgDiAHKAIgIApsIAVqQQN0aiABNgIAIAlBAWohCSAHKAIcQQJtIQMLIAMgBCAGQQZ0aiAXaigCAEgEQCAOIAcoAiAgCmwgBWpBA3RBBHJqIAE2AgAgCUEBaiEJCyABQQFqIgFBEEcNAAsgDEECaiEMIAVBAWoiBSAHKAIgIgFIDQALCyAQIAkgDE5xIRAgCkEBaiIKIBJHDQALQQAhASAQRQ0EIAAoAkQhAwtBAiEEIANBBE4EQCADQQVuQQF0IgFBBCABQQRLGyEEC0EAIQEgAkEAOgAYIAIgBDoAESACIAM6ABAgBEH/AXFBAWoQICEFIAJBADsBJCACIAU2AhQgAiADIARqIgU6ACIgAiAINgIoIAJBADsBICACIAU6AC4gAiAINgI0IAJBgAI7ASwgAiAEQQF0IgM6ADogAkGABjsBRCACIAg2AkAgAkGABDsBOCACIAM6AEYgAkEEOgBRIAIgCDYCTCACIAVB/wFxIgk7ATAgAiAJQQF0Igo7ATwgAiAKIANB/gFxIgRqIgo7AUggAiAEIApqIgo7AVQgAiAINgJYIAIgAzoAUiACQYAKOwFcIAJBADoAUCACIAU6AF4gAiAINgJkIAJBgAw7AWggAiADOgBqIAIgCDYCcCACQYAOOwF0IAIgAzoAdiACIAg2AnwgAkEIOgCBASACIAM6AIIBIAIgBCAKaiIFOwFgIAIgBSAJaiIFOwFsIAIgBCAFaiIFOwF4IAIgBCAFaiIFOwGEASACQYASOwGMASACIAg2AogBIAJBADoAgAEgAiADOgCOASACIAg2ApQBIAIgAzoAmgEgAkGAFDsBmAEgAiAINgKgASACIAM6AKYBIAJBgBY7AaQBIAJBgBg7AbABIAIgCDYCrAEgAiADOgCyASACIAg2ArgBIAJBDToAvQEgAiAEIAVqIgU7AZABIAIgBCAFaiIFOwGcASACIAQgBWoiBTsBqAEgAiAEIAVqIgU7AbQBIAIgBCAFaiIFOwHAASACIAM6AL4BIAJBDjoAyQEgAiAINgLEASACQQA6ALwBIAIgBCAFaiIFOwHMASACIAM6AMoBIAJBDzoA1QEgAiAINgLQASACQQA6AMgBIAIgBCAFaiIFOwHYASACIAM6ANYBIAIgBCAFajsB5AEgAkEQOgDhASACIAg2AtwBIAJBADoA1AEgAiADOgDiASACIAg2AugBIAJBADoA4AEgC0EATA0CA0AgACgCvAIgAWogAigCgAIiAyABQQN0IgRBBHJqKAIAQQR0IAMgBGooAgBqOgAAIAFBAWoiASALRw0ACwwCCxApAAsQKQALQQAhAQJAIAJBEGogACgCvAIiAyADIAItABBqIAAoAsABEDwNACAAKALAASIDLQAARQ0AIAIgAzYCACAUQfoUIAIQJEEBIQEgAEEBOgC4ASAAIAAoAkQ2ArwBIAAgBykCHDcC1AEgACAHKQIUNwLMASAAIAcoAhA2AtwBCyACKAIUIgNFDQAgAxAfCyACKALwASIDBEAgAiADNgL0ASADEB8LIAIoAoACIgMEQCACIAM2AoQCIAMQHwsgAQ0BAkAgBygCBCIBRQRAIAcoAggiAygCACAHRg0BIAdBCGohBANAIAQoAgAiAUEIaiEEIAEgASgCCCIDKAIARw0ACwwBCwNAIAEiAygCACIBDQALCyADIBNHDQALCyACQZACaiQAC4ICAQV/IAIgAWsiBCAAKAIIIgUgACgCACIDa00EQCABIAAoAgQgA2siBWogAiAEIAVLGyIGIAFrIgcEQCADIAEgBxAqCyAEIAVLBEAgACgCBCEBIAAgAiAGayIAQQFOBH8gASAGIAAQISAAagUgAQs2AgQPCyAAIAMgB2o2AgQPCyADBEAgACADNgIEIAMQHyAAQQA2AgggAEIANwIAQQAhBQsCQCAEQX9MDQAgBCAFQQF0IgIgAiAESRtB/////wcgBUH/////A0kbIgNBf0wNACAAIAMQICICNgIAIAAgAjYCBCAAIAIgA2o2AgggACACIAEgBBAhIARqNgIEDwsQKQALmQgCB38CfSMAQSBrIgQkAAJAIAAtAKQCDQAgACgCaCEDAkADQCAAKgIAIgpDAIA7R5UhCQJ/IApDAIA7R1sEQCAAKAIQIANsDAELIAAoApQDQwAAgD8gCZUgAyAAKAKgAUEAEDBBBGogACgCEGwLIQICQAJ/IAAoAhgiA0EBa0EETwRAQQAgA0EFRw0BGiAEIAAoAqABNgIcIAQgAjYCGCABKAIQIgNFDQIgAyAEQRxqIARBGGogAygCACgCGBEGAAwBCyAEIAAoAqwBNgIcIAQgAjYCGCABKAIQIgNFDQEgAyAEQRxqIARBGGogAygCACgCGBEGAAsiBSAFIAAoAhAiBm4iAyAGbEcEQCAEIAY2AhQgBCAFNgIQQbjIACgCAEGSEyAEQRBqECQgACAAKAIINgJoDAQLIAIgBUkEQCAEIAIgBm42AgQgBCAFIAZuNgIAQbjIACgCAEHlEyAEECQgACAAKAIINgJoDAQLAkACQAJAAkACQCAAKAIYQQFrDgQAAQIDBAsgA0EBSA0DIAAoAqwBIQcgACgCoAEhCEEAIQIDQCAIIAJBAnRqIAIgB2otAABBgAFrskMAAAA8lDgCACACQQFqIgIgA0cNAAsMAwsgA0EBSA0CIAAoAqwBIQcgACgCoAEhCEEAIQIDQCAIIAJBAnRqIAIgB2osAACyQwAAADyUOAIAIAJBAWoiAiADRw0ACwwCCyADQQFIDQEgACgCrAEhByAAKAKgASEIQQAhAgNAIAggAkECdGogByACQQF0ai8BAEGAgAJrskMAAAA4lDgCACACQQFqIgIgA0cNAAsMAQsgA0EBSA0AIAAoAqwBIQcgACgCoAEhCEEAIQIDQCAIIAJBAnRqIAcgAkEBdGouAQCyQwAAADiUOAIAIAJBAWoiAiADRw0ACwsgBSAGSQ0DIAAoAggiBSAAKAJoayEGAkAgACoCAEMAgDtHWwRAIANBAUgNASAAKAKUASEHIAAoAqABIQhBACECA0AgByACIAZqQQJ0aiAIIAJBAnRqKgIAOAIAIAJBAWoiAiADRw0ACwwBCyADQYABTARAIAAgBTYCaAwFCwJAIAAtAEgNACAAKAKUAyICKAIwsiAJQwAAcEKUQwCAO0eUXkEBcw0AIAIQUgsgACgClAMgCSADIAAoAqABIAAoApQBIAZBAnRqEDAgBmohAyAAKAIIIQULIAMgBUgNAgJAIAAtAEAEQCAAEJsBDAELIAAQmgELIAMgACgCCCICayIFQQFOBEAgACgClAEhBkEAIQMDQCAGIANBAnRqIAYgAiADakECdGoqAgA4AgAgA0EBaiIDIAVHDQALCyAAIAIgBWsiAzYCaCAALQCkAkUNAQwDCwsQVAALIAAgBSADazYCaAsgBEEgaiQAC4wEAQJ/IwBBMGsiBCQAIAQgAjYCKCAEIAE2AixBuNYAIQICQEG41gAoAgAiAUUEQEG41gAhAQwBCwNAAkAgACABKAIQIgVIBEAgASgCACIFDQEgASECDAMLIAAgBUwNAiABQQRqIQIgASgCBCIFRQ0CIAIhAQsgASECIAUhAQwACwALIAIoAgAiBUUEQEEYECAiBUEANgIUIAUgADYCECAFIAE2AgggBUIANwIAIAIgBTYCAAJ/IAVBtNYAKAIAKAIAIgBFDQAaQbTWACAANgIAIAIoAgALIQBBuNYAKAIAIAAQLUG81gBBvNYAKAIAQQFqNgIACyAFKAIUIQAgBEH8HzYCECAEIARBEGo2AiAgBCAEQSxqNgIYIAQgBEEoajYCFCAAIARBEGoQnQEgBEEANgIIIARCADcDAAJ/QQAgACgCvAEiAkUNABogAEEANgK8AUF/IAJBf0YNABogBCAAQcABakcEQCAEIAAoAsABIAAoAsQBEJwBCyAEKAIAIQACQCACQQFIDQAgACAEKAIEIgVGDQAgACEBA0AgAyABLQAAOgAAIANBAWohAyABQQFqIgEgBUcNAAsLIAAEQCAEIAA2AgQgABAfCyACCyEBAkAgBCgCICIAIARBEGpGBEAgACAAKAIAKAIQEQAADAELIABFDQAgACAAKAIAKAIUEQAACyAEQTBqJAAgAQvuAQEGfyABIAAoAggiBCAAKAIEIgJrQQF1TQRAIAAgAQR/IAJBACABQQF0IgAQHiAAagUgAgs2AgQPCwJAIAIgACgCACIFayIGQQF1IgcgAWoiA0F/SgRAQQAhAgJ/IAMgBCAFayIEIAMgBEsbQf////8HIARBAXVB/////wNJGyIDBEAgA0F/TA0DIANBAXQQICECCyACIAdBAXRqC0EAIAFBAXQiARAeIAFqIQEgBkEBTgRAIAIgBSAGECEaCyAAIAIgA0EBdGo2AgggACABNgIEIAAgAjYCACAFBEAgBRAfCw8LECkAC0HWFxAyAAsLACAABEAgABAfCwvoJwMYfwh9BHwjAEHwAWsiAyQAIAAoApQDEFJBgBAQIEEAQYAQEB4hEyAAKALUAkEDdLchIgNAIBMgAkEDdGogArdEGC1EVPshCUCiICKjOQMAIAJBAWoiAkGAAkcNAAtBIBAgIg5CADcCACAOQgA3AhggDkIANwIQIA5CADcCCEGAGBAgQQBBgBgQHiIPQYAYaiEUQYAYECBBAEGAGBAeIhBBgBhqIRUDQCAAKgIsIRsgACoCICEaIAAoAswCIQYCQCAPIARBDGwiB2oiAigCBCACKAIAIgVrIghBAnUiDEH/D00EQCACQYAQIAxrECwMAQsgCEGAwABGDQAgAiAFQYBAazYCBAsCQCAHIBBqIgcoAgQgBygCACIFayIIQQJ1IgxB/w9NBEAgB0GAECAMaxAsDAELIAhBgMAARg0AIAcgBUGAQGs2AgQLAkAgACgCCCIFQQFIIggNACATIARBA3RqKwMAISJEAAAAAAAA8D8gACoCILujIiMgGiAGspQgGyAEspSSuyIkoiElIAIoAgAhBkEAIQIDQCAGIAJBAnRqICIgJSACtyAAKgIMu6JEGC1EVPshGUCioqAQNLY4AgAgAkEBaiICIAVHDQALIAgNACAHKAIAIQcgACgCKLIhG0EAIQIDQCAHIAJBAnRqICIgArcgACoCDLuiRBgtRFT7IRlAoiAjICQgACoCICAblLugoqKgEDS2OAIAIAJBAWoiAiAFRw0ACwsgBEEBaiIEQYACRw0AC0ECIQQgACgCrAIiAkEETgRAIAJBBW5BAXQiBEEEIARBBEsbIQQLIAAoAtQCIgcgACgCOCIGIAIgBGpqakEBayAHbSEMIAAoAtACIQ0gAC0AQEUEQCADQQA6ABAgAyAGQQFrIgc6AAkgA0EBOgAIIAdB/wFxQQFqECAhCiADQQA7ARwgAyAGOgAaIAMgBkH/AXEiCDsBKCADIANBFGoiAjYCICADIAY6ACYgAyAIQQF0Igk7ATQgAyACNgIsIANBgAI7ASQgAyAHQQF0Igc6ADIgA0FAayAJIAdB/gFxIgVqIgk7AQAgA0GABjsBPCADIAI2AjggA0GABDsBMCADIAc6AD4gA0EEOgBJIAMgAjYCRCADIAUgCWoiCTsBTCADIAo2AgwgA0EAOwEYIAMgBSAJaiIKOwFYIAMgAjYCUCADQQA6AEggAyAHOgBKIAMgBjoAViADIAI2AlwgA0GACjsBVCADIAc6AGIgA0GADjsBbCADIAI2AmggA0GADDsBYCADIAc6AG4gA0EIOgB5IAMgAjYCdCADIAc6AHogAyAIIApqIgY7AWQgAyAFIAZqIgY7AXAgAyAFIAZqIgY7AXwgAyAFIAZqIgY7AYgBIANBgBI7AYQBIAMgAjYCgAEgA0EAOgB4IAMgBzoAhgEgAyACNgKMASADQYAUOwGQASADIAc6AJIBIAMgAjYCmAEgA0GAFjsBnAEgAyAHOgCeASADIAI2AqQBIANBgBg7AagBIAMgBzoAqgEgAyACNgKwASADQQ06ALUBIAMgBSAGaiIGOwGUASADIAUgBmoiBjsBoAEgAyAFIAZqIgY7AawBIAMgBSAGaiIGOwG4ASADQQA6ALQBIAMgBzoAtgEgAyACNgK8ASADIAUgBmoiBjsBxAEgAyAHOgDCASADQYAcOwHAASADIAI2AsgBIAMgBzoAzgEgA0GAHjsBzAEgAyACNgLUASADIAc6ANoBIANBgCA7AdgBIAMgAjYC4AEgAyAFIAZqIgI7AdABIAMgAiAFajsB3AEgA0EIaiAAKAKwAiICIAAoArwCIAIgAy0ACBAhIAMtAAhqEFUgAygCDCICBEAgAhAfCyAAKAKsAiECC0EAIQcgA0EAOgAQIAMgBDoACSADIAI6AAggBEH/AXFBAWoQICEKIANBADsBHCADIAIgBGoiBjoAGiADIAZB/wFxIgg7ASggAyADQRRqIgI2AiAgAyAGOgAmIAMgCEEBdCIJOwE0IAMgAjYCLCADQYACOwEkIAMgBEEBdCIEOgAyIANBgAY7ATwgAyACNgI4IANBgAQ7ATAgAyAEOgA+IANBBDoASSADIAI2AkQgA0FAayAJIARB/gFxIgVqIgk7AQAgAyAFIAlqIgk7AUwgAyAKNgIMIANBADsBGCADIAUgCWoiCjsBWCADIAI2AlAgA0EAOgBIIAMgBDoASiADIAY6AFYgAyACNgJcIANBgAo7AVQgAyAEOgBiIANBgA47AWwgAyACNgJoIANBgAw7AWAgAyAEOgBuIANBCDoAeSADIAI2AnQgAyAEOgB6IAMgCCAKaiIGOwFkIAMgBSAGaiIGOwFwIAMgBSAGaiIGOwF8IAMgBSAGaiIGOwGIASADQYASOwGEASADIAI2AoABIANBADoAeCADIAQ6AIYBIAMgAjYCjAEgA0GAFDsBkAEgAyAEOgCSASADIAI2ApgBIANBgBY7AZwBIAMgBDoAngEgAyACNgKkASADQYAYOwGoASADIAQ6AKoBIAMgAjYCsAEgA0ENOgC1ASADIAUgBmoiBjsBlAEgAyAFIAZqIgY7AaABIAMgBSAGaiIGOwGsASADIAUgBmoiBjsBuAEgA0EAOgC0ASADIAQ6ALYBIAMgAjYCvAEgAyAFIAZqIgY7AcQBIAMgBDoAwgEgA0GAHDsBwAEgAyACNgLIASADIAQ6AM4BIANBgB47AcwBIAMgAjYC1AEgAyAEOgDaASADQYAgOwHYASADIAI2AuABIAMgBSAGaiICOwHQASADIAIgBWo7AdwBIANBCGogACgCsAJBAWoiAiAAKAK8AiAAKAI4aiACIAMtAAgQISADLQAIahBVAkAgAC0ApAJFDQAgDCANbCEXQwCAO0cgACoCBJUhISAAQeQCaiEYQQAhBgNAIAAoAtwCIhkgACgC2AIiDGsiAkEBTgRAIAxBACACQQJ2IgIgAkEAR2tBAnRBBGoQHhoLAkACQAJAAkAgACgCNCICIAZKBEAgACgCMCIFQQFIDQEgACgCCCIIIAJssiIdQ5qZGT6UIRogBiAIbCENQwAAgD8gGpUhGwJ/IB1DmplZP5QiHItDAAAAT10EQCAcqAwBC0GAgICAeAuyIR4CfyAai0MAAABPXQRAIBqoDAELQYCAgIB4C7IhIEEAIQQDQCAAKgKoAiEaAkAgBEEBcUUEQCAIQQFIDQEgDyAEQQxsaigCACEKIAAoAtgCIQlBACECA0AgCSACQQJ0aiILIAsqAgACfSACIA1qsiIcICBdQQFzRQRAIBsgHJQgGiAKIAJBAnRqKgIAlJQMAQsgGiAKIAJBAnRqKgIAlCIfIBwgHl5BAXMNABogGyAdIByTlCAflAuSOAIAIAJBAWoiAiAIRw0ACwwBCyAIQQFIDQAgECAEQQxsaigCACEKIAAoAtgCIQlBACECA0AgCSACQQJ0aiILIAsqAgACfSACIA1qsiIcICBdQQFzRQRAIBsgHJQgGiAKIAJBAnRqKgIAlJQMAQsgGiAKIAJBAnRqKgIAlCIfIBwgHl5BAXMNABogGyAdIByTlCAflAuSOAIAIAJBAWoiAiAIRw0ACwsgBEEBaiIEIAVHDQALDAELIAIgF2oiBCAGSgRAIAYgAmsiAiACIAAoAtACIg1tIgkgDWxrIQogACgC1AIhBUGAAiEIQQAhBCAOIQIDQCACIAIoAgBBfiAEd3E2AgAgAkEEaiACIARBH0YiCxshAkEAIARBAWogCxshBCAIQQFLIQsgCEEBayEIIAsNAAsgBUEBSCIIDQIgBSAJbCEJIAAoArwCIQtBACECA0AgDiACQf///z9xQQJ0aiIEIAQoAgBBASALIAIgCWpqIhEtAABBD3F0ciISNgIAIARBASARLQAAQQR2QRBydCAScjYCACACQQFqIgIgBUcNAAsgCA0CIAVBBXQiAkEBIAJBAUobIQtBACEEQQAhBQNAAkAgDiAEQQN2Qfz///8BcWooAgAgBHZBAXFFDQAgBEEBdiECIAVBAWohBSAAKAIIIQggACoCqAIhGyAEQQFxBEAgCEEBSA0BIBAgAkEMbGooAgAhCSAAKALYAiERQwAAgD8gCCANbLIiHUOamRk+lCIalSEcIAggCmwhEgJ/IB1DmplZP5QiHotDAAAAT10EQCAeqAwBC0GAgICAeAuyIR4CfyAai0MAAABPXQRAIBqoDAELQYCAgIB4C7IhIEEAIQIDQCARIAJBAnRqIhYgFioCAAJ9IAIgEmqyIhogIF1BAXNFBEAgHCAalCAbIAkgAkECdGoqAgCUlAwBCyAbIAkgAkECdGoqAgCUIh8gGiAeXkEBcw0AGiAcIB0gGpOUIB+UC5I4AgAgAkEBaiICIAhHDQALDAELIAhBAUgNACAPIAJBDGxqKAIAIQkgACgC2AIhEUMAAIA/IAggDWyyIh1DmpkZPpQiGpUhHCAIIApsIRICfyAdQ5qZWT+UIh6LQwAAAE9dBEAgHqgMAQtBgICAgHgLsiEeAn8gGotDAAAAT10EQCAaqAwBC0GAgICAeAuyISBBACECA0AgESACQQJ0aiIWIBYqAgACfSACIBJqsiIaICBdQQFzRQRAIBwgGpQgGyAJIAJBAnRqKgIAlJQMAQsgGyAJIAJBAnRqKgIAlCIfIBogHl5BAXMNABogHCAdIBqTlCAflAuSOAIAIAJBAWoiAiAIRw0ACwsgBEEBaiIEIAtHDQALDAELIAYgAiAEak4NAyAAKAIwIgVBAUgNACAAKAIIIgggAmyyIh1DmpkZPpQhGiAGIARrIAhsIQ1DAACAPyAalSEbAn8gHUOamVk/lCIci0MAAABPXQRAIByoDAELQYCAgIB4C7IhHgJ/IBqLQwAAAE9dBEAgGqgMAQtBgICAgHgLsiEgQQAhBANAIAAqAqgCIRoCQCAEQQFxRQRAIAhBAUgNASAQIARBDGxqKAIAIQogACgC2AIhCUEAIQIDQCAJIAJBAnRqIgsgCyoCAAJ9IAIgDWqyIhwgIF1BAXNFBEAgGyAclCAaIAogAkECdGoqAgCUlAwBCyAaIAogAkECdGoqAgCUIh8gHCAeXkEBcw0AGiAbIB0gHJOUIB+UC5I4AgAgAkEBaiICIAhHDQALDAELIAhBAUgNACAPIARBDGxqKAIAIQogACgC2AIhCUEAIQIDQCAJIAJBAnRqIgsgCyoCAAJ9IAIgDWqyIhwgIF1BAXNFBEAgGyAclCAaIAogAkECdGoqAgCUlAwBCyAaIAogAkECdGoqAgCUIh8gHCAeXkEBcw0AGiAbIB0gHJOUIB+UC5I4AgAgAkEBaiICIAhHDQALCyAEQQFqIgQgBUcNAAsLIAVB//8DcQ0BC0EBIQULQQAhAiAAKAIIIgRBAEoEQEMAAIA/IAVB//8DcbOVIRsDQCAMIAJBAnRqIgUgGyAFKgIAlDgCACACQQFqIgIgBEcNAAsLAkAgACoCBEMAgDtHXARAIAAoApQDICEgBCAMIAAoAuQCEDAhBAwBCyAYIAwgGRA+CyAEQQFIIgVFBEAgACgC/AIhCCAAKALkAiEMQQAhAgNAIAggAiAHakEBdGoCfyAMIAJBAnRqKgIAQwAAAEeUIhuLQwAAAE9dBEAgG6gMAQtBgICAgHgLOwEAIAJBAWoiAiAERw0ACwsCQAJAAkACQAJAIAAoAhxBAWsOBQABAgQDBAsgBQ0DIAAoAvACIQVBACECA0AgBSACIAdqagJ/IAAoAuQCIAJBAnRqKgIAQwAAgD+SQwAAAEOUIhtDAACAT10gG0MAAAAAYHEEQCAbqQwBC0EACzoAACACQQFqIgIgBEcNAAsMAwsgBQ0CIAAoAvACIQVBACECA0AgBSACIAdqagJ/IAAoAuQCIAJBAnRqKgIAQwAAAEOUIhtDAACAT10gG0MAAAAAYHEEQCAbqQwBC0EACzoAACACQQFqIgIgBEcNAAsMAgsgBQ0BIAAoAvACIQUgACgC5AIhCEEAIQIDQCAFIAIgB2pBAXRqAn8gCCACQQJ0aioCAEMAAIA/kkMAAABHlCIbQwAAgE9dIBtDAAAAAGBxBEAgG6kMAQtBAAs7AQAgAkEBaiICIARHDQALDAELIAUNACAAKALwAiEFIAAoAuQCIQhBACECA0AgBSACIAdqQQJ0aiAIIAJBAnRqKgIAOAIAIAJBAWoiAiAERw0ACwsgBCAHaiEHIAZBAWohBiAALQCkAg0BDAILCyAAQQA6AKQCCwJAAkACQAJAIAAoAhxBAWsOBQEBAQABAgsgACgCFCECIAMgACgC/AI2AuwBIAMgAiAHbDYC6AEgASgCECIBRQ0CIAEgA0HsAWogA0HoAWogASgCACgCGBEDAAwBCyAAKAIUIQIgAyAAKALwAjYC7AEgAyACIAdsNgLoASABKAIQIgFFDQEgASADQewBaiADQegBaiABKAIAKAIYEQMACwJAAkAgACgCjAMgACgCiAMiAmtBAXUiASAHSQRAIABBiANqIAcgAWsQnwEMAQsgASAHSwRAIAAgAiAHQQF0ajYCjAMLIAdFDQELIAAoAogDIQEgACgC/AIhAEEAIQIDQCABIAJBAXQiBGogACAEai8BADsBACACQQFqIgIgB0cNAAsLIAMoAgwiAARAIAAQHwsDQCAVQQxrIgAoAgAiAQRAIBVBCGsgATYCACABEB8LIAAiFSAQRw0ACyAQEB8DQCAUQQxrIgAoAgAiAQRAIBRBCGsgATYCACABEB8LIAAiFCAPRw0ACyAPEB8gDhAfIBMQHyADQfABaiQADwsQVAALvwkBBn8gASEDAn8CQAJAIAEoAgAiBARAIAEoAgQiAkUNAQNAIAIiAygCACICDQALCyADKAIEIgQNAUEAIQRBAQwCCwsgBCADKAIINgIIQQALIQYCQCADIAMoAggiBSgCACICRgRAIAUgBDYCACAAIANGBEBBACECIAQhAAwCCyAFKAIEIQIMAQsgBSAENgIECyADLQAMIQcgASADRwRAIAMgASgCCCIFNgIIIAUgASgCCCgCACABR0ECdGogAzYCACADIAEoAgAiBTYCACAFIAM2AgggAyABKAIEIgU2AgQgBQRAIAUgAzYCCAsgAyABLQAMOgAMIAMgACAAIAFGGyEACwJAAkACQAJAIAdFDQAgAEUNACAGBEADQCACLQAMIQECQCACIAIoAggiAygCAEcEQAJAAn8gAUUEQCACQQE6AAwgA0EAOgAMIAMgAygCBCIBKAIAIgQ2AgQgBARAIAQgAzYCCAsgASADKAIINgIIIAMoAggiBCAEKAIAIANHQQJ0aiABNgIAIAEgAzYCACADIAE2AgggAiAAIAAgAigCACIBRhshACABKAIEIQILIAIoAgAiAwsEQCADLQAMRQ0BCyACKAIEIgEEQCABLQAMRQ0HCyACQQA6AAwCQCAAIAIoAggiAkYEQCAAIQIMAQsgAi0ADA0DCyACQQE6AAwPCyACKAIEIgENBQwGCwJAIAEEQCACIQEMAQsgAkEBOgAMIANBADoADCADIAIoAgQiATYCACABBEAgASADNgIICyACIAMoAgg2AggCQCADIAMoAggiBCgCAEYEQCAEIAI2AgAgAygCACEBDAELIAQgAjYCBAsgAiADNgIEIAMgAjYCCCACIAAgACADRhshAAsCQAJAIAEoAgAiA0UNACADLQAMDQAgASECDAELAkAgASgCBCICBEAgAi0ADEUNAQsgAUEAOgAMIAAgASgCCCICRwRAIAItAAwNAwsgAkEBOgAMDwsgAwRAIAMtAAxFBEAgASECDAILIAEoAgQhAgsgAkEBOgAMIAFBADoADCABIAIoAgAiADYCBCAABEAgACABNgIICyACIAEoAgg2AgggASgCCCIAIAAoAgAgAUdBAnRqIAI2AgAgAiABNgIAIAEgAjYCCCABIQMLIAIgAigCCCIALQAMOgAMIABBAToADCADQQE6AAwgACAAKAIAIgEoAgQiAjYCACACBEAgAiAANgIICyABIAAoAgg2AgggACgCCCICIAIoAgAgAEdBAnRqIAE2AgAgASAANgIEIAAgATYCCA8LIAIoAggiASABKAIAIAJGQQJ0aigCACECDAALAAsgBEEBOgAMCw8LIAEtAAwNACACIQMMAQsgA0EBOgAMIAJBADoADCACIAMoAgQiADYCACAABEAgACACNgIICyADIAIoAgg2AgggAigCCCIAIAAoAgAgAkdBAnRqIAM2AgAgAyACNgIEIAIgAzYCCCACIQELIAMgAygCCCIALQAMOgAMIABBAToADCABQQE6AAwgACAAKAIEIgEoAgAiAjYCBCACBEAgAiAANgIICyABIAAoAgg2AgggACgCCCICIAIoAgAgAEdBAnRqIAE2AgAgASAANgIAIAAgATYCCAujBQEEfyAAKAKUAyEBIABBADYClAMgAQRAIAEoAiQiAgRAIAEgAjYCKCACEB8LIAEoAhgiAgRAIAEgAjYCHCACEB8LIAEoAgwiAgRAIAEgAjYCECACEB8LIAEoAgAiAgRAIAEgAjYCBCACEB8LIAEQHwsgACgCiAMiAQRAIAAgATYCjAMgARAfCyAAKAL8AiIBBEAgACABNgKAAyABEB8LIAAoAvACIgEEQCAAIAE2AvQCIAEQHwsgACgC5AIiAQRAIAAgATYC6AIgARAfCyAAKALYAiIBBEAgACABNgLcAiABEB8LIAAoArwCIgEEQCAAIAE2AsACIAEQHwsgACgCsAIiAQRAIAAgATYCtAIgARAfCyAAKAKYAiIDBEACfyADIAMgACgCnAIiAUYNABoDQCABQQxrIgIoAgAiBARAIAFBCGsgBDYCACAEEB8LIAIiASADRw0ACyAAKAKYAgshASAAIAM2ApwCIAEQHwsgACgCiAIiAQRAIAAgATYCjAIgARAfCyAAKAL8ASIDBEACfyADIAMgACgCgAIiAUYNABoDQCABQQxrIgIoAgAiBARAIAFBCGsgBDYCACAEEB8LIAIiASADRw0ACyAAKAL8AQshASAAIAM2AoACIAEQHwsgACgC8AEiAQRAIAAgATYC9AEgARAfCyAAQeABaiAAKALkARA4IAAoAsABIgEEQCAAIAE2AsQBIAEQHwsgACgCrAEiAQRAIAAgATYCsAEgARAfCyAAKAKgASIBBEAgACABNgKkASABEB8LIAAoApQBIgEEQCAAIAE2ApgBIAEQHwsgACgCiAEiAQRAIAAgATYCjAEgARAfCyAAKAJ4IgEEQCAAIAE2AnwgARAfCyAAKAJsIgEEQCAAIAE2AnAgARAfCyAAC8IDAQR/QbjWACECAkBBuNYAKAIAIgFFBEBBuNYAIQEMAQsDQAJAIAAgASgCECIDSARAIAEoAgAiAw0BIAEhAgwDCyAAIANMDQIgAUEEaiECIAEoAgQiA0UNAiACIQELIAEhAiADIQEMAAsACyACKAIAIgNFBEBBGBAgIgNBADYCFCADIAA2AhAgAyABNgIIIANCADcCACACIAM2AgACfyADQbTWACgCACgCACIBRQ0AGkG01gAgATYCACACKAIACyEBQbjWACgCACABEC1BvNYAQbzWACgCAEEBajYCAAsgAygCFCIBBEAgARCjARAfCwJAQbjWACgCACIERQ0AQbjWACECIAQhAQNAIAIgASABKAIQIABIIgMbIQIgASADQQJ0aigCACIBDQALIAJBuNYARg0AIAIoAhAgAEoNAAJAIAIoAgQiAUUEQCACKAIIIgAoAgAgAkYNASACQQhqIQMDQCADKAIAIgFBCGohAyABIAEoAggiACgCAEcNAAsMAQsDQCABIgAoAgAiAQ0ACwsgAkG01gAoAgBGBEBBtNYAIAA2AgALQbzWAEG81gAoAgBBAWs2AgAgBCACEKIBIAIQHwsLBQBB4AwLgxUCC38BfSMAQdAAayIGJAAgACABKAIEsjgCACAAIAEoAgiyOAIEIAAgASgCDCICNgIIIABDAACAPyACspU4AgwgAAJ/IAEoAhQiAkEGTwRAIAYgAjYCMEG4yAAoAgBB5BYgBkEwahAkQQAMAQsgAkECdEHEIWooAgALNgIQIAACfyABKAIYIgNBBk8EQCAGIAM2AiBBuMgAKAIAQeQWIAZBIGoQJCABKAIYIQNBAAwBCyADQQJ0QcQhaigCAAs2AhQgASgCFCECIAAgAzYCHCAAIAI2AhggASgCDCECIABBEDYCMCAAQQE2AiggAEMAgDtHIAKylSINOAIgIAAgDSANkjgCLCAAQwAAgD8gDZU4AiQgAEEAQQMgASgCACICQQBKIgMbNgI4IAAgAkEBSEEEdDYCNCABKgIQIQ0gACACNgJEIAAgAzoAQCAAIA04AjwgAEEANgJ0IABCADcCbCAAIAAoAgg2AmggAEGAwAAQICICNgJsIAAgAkGAQGsiAzYCdCACQQBBgMAAEB4aIABBADYCgAEgAEIANwJ4IAAgAzYCcCAAQYCAARAgIgI2AnggACACQYCAAWoiAzYCgAEgAkEAQYCAARAeGiAAQQA2ApABIABCADcCiAEgAEEAOgCEASAAIAM2AnwgAEGAwAAQICICNgKIASAAIAJBgEBrIgM2ApABIAJBAEGAwAAQHhogAEEANgKcASAAQgA3ApQBIAAgAzYCjAEgAEGAxAAQICICNgKUASAAIAJBgMQAaiIDNgKcASACQQBBgMQAEB4aIABBADYCqAEgAEIANwKgASAAIAM2ApgBIABBgIAEECAiAjYCoAEgACACQYCABGoiAzYCqAEgAkEAQYCABBAeGiAAIAM2AqQBIABBADYCtAEgAEIANwKsAQJAAkACQAJAAkACQAJAAkACQAJAIAAoAhAiAgRAIAJBf0wNASAAIAJBDnQiAhAgIgM2AqwBIAAgAiADaiIENgK0ASADQQAgAhAeGiAAIAQ2ArABCyAAQgA3ArwBIABBADoAuAEgAEIANwLEASAAQYACECAiAjYCwAEgACACQYACaiIDNgLIASACQQBBgAIQHhogACADNgLEARAmKAIEIgNFDQcDQCADKAIQIgJBAk4EQCADKAIAIgMNAQwJCyACQQFHBEAgAygCBCIDDQEMCQsLIANFDQcgACADKQIcNwLUASAAIAMpAhQ3AswBIABBATYC3AEQJiECIABB5AFqIgNCADcCACAAIAM2AuABIABB4AFqIAIoAgAgAkEEahCZASAAQgA3AvQBIABCADcC7AEgAEGAwAAQICICNgLwASAAIAJBgEBrIgM2AvgBIAJBAEGAwAAQHhogAEEANgKEAiAAQgA3AvwBIAAgAzYC9AEgAEEwECAiAjYC/AEgACACQTBqIgM2AoQCIAJCADcCKCACQgA3AiAgAkIANwIYIAJCADcCECACQgA3AgggAkIANwIAIABCADcCiAIgACADNgKAAiAAQgA3ApACIABBmAJqIgtCADcCACAAQgA3AJ0CIABCADcCrAIgAEHNmbPuAzYCqAIgAEIANwK0AiAAQYACECAiAjYCsAIgACACQYACaiIDNgK4AiACQQBBgAIQHhogAEEANgLEAiAAQgA3ArwCIAAgAzYCtAIgAEGAAhAgIgI2ArwCIAAgAkGA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AEdHV0FWRV9UWF9QUk9UT0NPTF9BVURJQkxFX0ZBU1QAR0dXQVZFX1RYX1BST1RPQ09MX0FVRElCTEVfRkFTVEVTVABHR1dBVkVfVFhfUFJPVE9DT0xfVUxUUkFTT1VORF9OT1JNQUwAR0dXQVZFX1RYX1BST1RPQ09MX1VMVFJBU09VTkRfRkFTVABHR1dBVkVfVFhfUFJPVE9DT0xfVUxUUkFTT1VORF9GQVNURVNUAFBhcmFtZXRlcnMAc2FtcGxlUmF0ZUlucABzYW1wbGVSYXRlT3V0AHNhbXBsZXNQZXJGcmFtZQBzYW1wbGVGb3JtYXRJbnAAc2FtcGxlRm9ybWF0T3V0AGdldERlZmF1bHRQYXJhbWV0ZXJzAGluaXQAZnJlZQBlbmNvZGUAZGVjb2RlADE5Z2d3YXZlX1NhbXBsZUZvcm1hdAAAAABQKAAACwYAADE5Z2d3YXZlX1R4UHJvdG9jb2xJZAAAAFAoAAAsBgAAMTdnZ3dhdmVfUGFyYW1ldGVycwCcKAAATAYAAFAxN2dnd2F2ZV9QYXJhbWV0ZXJzAAAAAHwpAABoBgAAAAAAAGAGAABQSzE3Z2d3YXZlX1BhcmFtZXRlcnMAAAB8KQAAkAYAAAEAAABgBgAAaWkAdgB2aQCABgAAaWlpAHZpaWkAAAAAYAYAAAQoAABgBgAApCcAAAQoAAB2aWkATjEwZW1zY3JpcHRlbjExbWVtb3J5X3ZpZXdJY0VFAACcKAAA6AYAADgHAAAEKAAAsAcAAEQGAAAEKAAATjEwZW1zY3JpcHRlbjN2YWxFAACcKAAAJAcAAE5TdDNfXzIxMmJhc2ljX3N0cmluZ0ljTlNfMTFjaGFyX3RyYWl0c0ljRUVOU185YWxsb2NhdG9ySWNFRUVFAE5TdDNfXzIyMV9fYmFzaWNfc3RyaW5nX2NvbW1vbklMYjFFRUUAAAAAnCgAAH8HAAAgKQAAQAcAAAAAAAABAAAAqAcAAAAAAABpaWlpaWkAALAHAAAEKAAAsAcAAGlpaWkASW52YWxpZCBHR1dhdmUgaW5zdGFuY2UgJWQKAEZhaWxlZCB0byBpbml0aWFsaXplIEdHV2F2ZSBpbnN0YW5jZSAlZAoASW52YWxpZCBwYXlsb2FkIGxlZ250aABJbnZhbGlkIG9yIHVuc3VwcG9ydGVkIGNhcHR1cmUgc2FtcGxlIGZvcm1hdABJbnZhbGlkIG9yIHVuc3VwcG9ydGVkIHBsYXliYWNrIHNhbXBsZSBmb3JtYXQASW52YWxpZCBzYW1wbGVzIHBlciBmcmFtZQBFcnJvcjogY2FwdHVyZSBzYW1wbGUgcmF0ZSAoJWQgSHopIG11c3QgYmUgPj0gJWQgSHoKAEludmFsaWQgY2FwdHVyZS9wbGF5YmFjayBzYW1wbGUgcmF0ZQBFcnJvcjogY2FwdHVyZSBzYW1wbGUgcmF0ZSAoJWQgSHopIG11c3QgYmUgPD0gJWQgSHoKAE5lZ2F0aXZlIGRhdGEgc2l6ZTogJWQKAFRydW5jYXRpbmcgZGF0YSBmcm9tICVkIHRvICVkIGJ5dGVzCgBJbnZhbGlkIHZvbHVtZTogJWQKAEZhaWx1cmUgZHVyaW5nIGNhcHR1cmUgLSBwcm92aWRlZCBieXRlcyAoJWQpIGFyZSBub3QgbXVsdGlwbGUgb2Ygc2FtcGxlIHNpemUgKCVkKQoARmFpbHVyZSBkdXJpbmcgY2FwdHVyZSAtIG1vcmUgc2FtcGxlcyB3ZXJlIHByb3ZpZGVkICglZCkgdGhhbiByZXF1ZXN0ZWQgKCVkKQoAQW5hbHl6aW5nIGNhcHR1cmVkIGRhdGEgLi4KAERlY29kZWQgbGVuZ3RoID0gJWQsIHByb3RvY29sID0gJyVzJyAoJWQpCgBSZWNlaXZlZCBzb3VuZCBkYXRhIHN1Y2Nlc3NmdWxseTogJyVzJwoARmFpbGVkIHRvIGNhcHR1cmUgc291bmQgZGF0YS4gUGxlYXNlIHRyeSBhZ2FpbiAobGVuZ3RoID0gJWQpCgBUaW1lIHRvIGFuYWx5emU6ICVnIG1zCgAlc1JlY2VpdmluZyBzb3VuZCBkYXRhIC4uLgoAJXNSZWNlaXZlZCBlbmQgbWFya2VyLiBGcmFtZXMgbGVmdCA9ICVkLCByZWNvcmRlZCA9ICVkCgBtYXA6OmF0OiAga2V5IG5vdCBmb3VuZABJbnZhbGlkIHNhbXBsZSBmb3JtYXQ6ICVkCgBOb3JtYWwARmFzdABGYXN0ZXN0AFtVXSBOb3JtYWwAW1VdIEZhc3QAW1VdIEZhc3Rlc3QAW0RUXSBOb3JtYWwAW0RUXSBGYXN0AFtEVF0gRmFzdGVzdABhbGxvY2F0b3I8VD46OmFsbG9jYXRlKHNpemVfdCBuKSAnbicgZXhjZWVkcyBtYXhpbXVtIHN1cHBvcnRlZCBzaXplAEGiGAulKwEZAjIaxgPfM+4baMdLBGTgDjSN74EcwWn4yAhMcQWKZS/hJA8hNZOO2vASgkUdtcJ9aif5ucmaCXhN5HKmBr+LYmbdMP3imCWzEJEiiDbQlM6Pltu98dITXIM4RkAeQrajw0h+bms6KFT6hbo9yl6bnwoVeStO1OWsc/OnVwdwwPeMgGMNZ0re7THF/hjjpZl3Jri0fBFEktkjIIkuNz/RW5W8z82Qh5ey3Py+YfJW06sUKl2ehDw5U0dtQaIfLUPYt3ukdsQXSex/DG/2bKE7UimdVar7YIaxu8w+WstZX7CcqaBRC/UW63p1LNdPrtXp5uet6HTW9OqoUFivAQIECBAgQIAdOnTozYcTJkyYLVq0derJjwMGDBgwYMCdJ06cJUqUNWrUtXfuwZ8jRowFChQoUKBdumnSuW/eoV++YcKZL168ZcqJDx48ePD959O7a9axf/7h36NbtnHi2a9DhhEiRIgNGjRo0L1nzoEfPnz47ceTO3bsxZczZsyFFy5cuG3aqU+eIUKEFSpUqE2aKVKkVapJkjly5NW3c+bRv2PGkT9+/OXXs3v28f/j26tLljFixJU3btylV65BghkyZMiNBw4cOHDg3adTplGiWbJ58vnvw5srVqxFigkSJEiQPXr09ffz++vLiwsWLFiwffrpz4MbNmzYrUeOAQIECBAgQIAdOnTozYcTJkyYLVq0derJjwMGDBgwYMCdJ06cJUqUNWrUtXfuwZ8jRowFChQoUKBdumnSuW/eoV++YcKZL168ZcqJDx48ePD959O7a9axf/7h36NbtnHi2a9DhhEiRIgNGjRo0L1nzoEfPnz47ceTO3bsxZczZsyFFy5cuG3aqU+eIUKEFSpUqE2aKVKkVapJkjly5NW3c+bRv2PGkT9+/OXXs3v28f/j26tLljFixJU3btylV65BghkyZMiNBw4cOHDg3adTplGiWbJ58vnvw5srVqxFigkSJEiQPXr09ffz++vLiwsWLFiwffrpz4MbNmzYrUeOAQIAAAAAyA8AABgAAAAZAAAAGgAAABsAAAAcAAAAHQAAAB4AAAAfAAAAIAAAAE5TdDNfXzIxMF9fZnVuY3Rpb242X19mdW5jSVoxM2dnd2F2ZV9lbmNvZGVFMyRfME5TXzlhbGxvY2F0b3JJUzJfRUVGdlBLdmpFRUUATlN0M19fMjEwX19mdW5jdGlvbjZfX2Jhc2VJRnZQS3ZqRUVFAAAAnCgAAJkPAADEKAAATA8AAMAPAABaMTNnZ3dhdmVfZW5jb2RlRTMkXzAAAACcKAAA1A8AAAAAAACYEAAAIQAAACIAAAAjAAAAJAAAACUAAAAmAAAAJwAAACgAAAApAAAATlN0M19fMjEwX19mdW5jdGlvbjZfX2Z1bmNJWjEzZ2d3YXZlX2RlY29kZUUzJF8xTlNfOWFsbG9jYXRvcklTMl9FRUZqUHZqRUVFAE5TdDNfXzIxMF9fZnVuY3Rpb242X19iYXNlSUZqUHZqRUVFAJwoAABsEAAAxCgAACAQAACQEAAAWjEzZ2d3YXZlX2RlY29kZUUzJF8xAAAAnCgAAKQQAAAAAAAAAQAAAAEAAAACAAAAAgAAAAQAAAB2b2lkAGJvb2wAY2hhcgBzaWduZWQgY2hhcgB1bnNpZ25lZCBjaGFyAHNob3J0AHVuc2lnbmVkIHNob3J0AGludAB1bnNpZ25lZCBpbnQAbG9uZwB1bnNpZ25lZCBsb25nAGZsb2F0AGRvdWJsZQBzdGQ6OnN0cmluZwBzdGQ6OmJhc2ljX3N0cmluZzx1bnNpZ25lZCBjaGFyPgBzdGQ6OndzdHJpbmcAc3RkOjp1MTZzdHJpbmcAc3RkOjp1MzJzdHJpbmcAZW1zY3JpcHRlbjo6dmFsAGVtc2NyaXB0ZW46Om1lbW9yeV92aWV3PGNoYXI+AGVtc2NyaXB0ZW46Om1lbW9yeV92aWV3PHNpZ25lZCBjaGFyPgBlbXNjcmlwdGVuOjptZW1vcnlfdmlldzx1bnNpZ25lZCBjaGFyPgBlbXNjcmlwdGVuOjptZW1vcnlfdmlldzxzaG9ydD4AZW1zY3JpcHRlbjo6bWVtb3J5X3ZpZXc8dW5zaWduZWQgc2hvcnQ+AGVtc2NyaXB0ZW46Om1lbW9yeV92aWV3PGludD4AZW1zY3JpcHRlbjo6bWVtb3J5X3ZpZXc8dW5zaWduZWQgaW50PgBlbXNjcmlwdGVuOjptZW1vcnlfdmlldzxsb25nPgBlbXNjcmlwdGVuOjptZW1vcnlfdmlldzx1bnNpZ25lZCBsb25nPgBlbXNjcmlwdGVuOjptZW1vcnlfdmlldzxpbnQ4X3Q+AGVtc2NyaXB0ZW46Om1lbW9yeV92aWV3PHVpbnQ4X3Q+AGVtc2NyaXB0ZW46Om1lbW9yeV92aWV3PGludDE2X3Q+AGVtc2NyaXB0ZW46Om1lbW9yeV92aWV3PHVpbnQxNl90PgBlbXNjcmlwdGVuOjptZW1vcnlfdmlldzxpbnQzMl90PgBlbXNjcmlwdGVuOjptZW1vcnlfdmlldzx1aW50MzJfdD4AZW1zY3JpcHRlbjo6bWVtb3J5X3ZpZXc8ZmxvYXQ+AGVtc2NyaXB0ZW46Om1lbW9yeV92aWV3PGRvdWJsZT4ATlN0M19fMjEyYmFzaWNfc3RyaW5nSWhOU18xMWNoYXJfdHJhaXRzSWhFRU5TXzlhbGxvY2F0b3JJaEVFRUUAAAAAICkAAPITAAAAAAAAAQAAAKgHAAAAAAAATlN0M19fMjEyYmFzaWNfc3RyaW5nSXdOU18xMWNoYXJfdHJhaXRzSXdFRU5TXzlhbGxvY2F0b3JJd0VFRUUAACApAABMFAAAAAAAAAEAAACoBwAAAAAAAE5TdDNfXzIxMmJhc2ljX3N0cmluZ0lEc05TXzExY2hhcl90cmFpdHNJRHNFRU5TXzlhbGxvY2F0b3JJRHNFRUVFAAAAICkAAKQUAAAAAAAAAQAAAKgHAAAAAAAATlN0M19fMjEyYmFzaWNfc3RyaW5nSURpTlNfMTFjaGFyX3RyYWl0c0lEaUVFTlNfOWFsbG9jYXRvcklEaUVFRUUAAAAgKQAAABUAAAAAAAABAAAAqAcAAAAAAABOMTBlbXNjcmlwdGVuMTFtZW1vcnlfdmlld0lhRUUAAJwoAABcFQAATjEwZW1zY3JpcHRlbjExbWVtb3J5X3ZpZXdJaEVFAACcKAAAhBUAAE4xMGVtc2NyaXB0ZW4xMW1lbW9yeV92aWV3SXNFRQAAnCgAAKwVAABOMTBlbXNjcmlwdGVuMTFtZW1vcnlfdmlld0l0RUUAAJwoAADUFQAATjEwZW1zY3JpcHRlbjExbWVtb3J5X3ZpZXdJaUVFAACcKAAA/BUAAE4xMGVtc2NyaXB0ZW4xMW1lbW9yeV92aWV3SWpFRQAAnCgAACQWAABOMTBlbXNjcmlwdGVuMTFtZW1vcnlfdmlld0lsRUUA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";
            if (!isDataURI(wasmBinaryFile)) {
                wasmBinaryFile = locateFile(wasmBinaryFile)
            }

            function getBinary(file) {
                try {
                    if (file == wasmBinaryFile && wasmBinary) {
                        return new Uint8Array(wasmBinary)
                    }
                    var binary = tryParseAsDataURI(file);
                    if (binary) {
                        return binary
                    }
                    if (readBinary) {
                        return readBinary(file)
                    } else {
                        throw "both async and sync fetching of the wasm failed"
                    }
                } catch (err) {
                    abort(err)
                }
            }

            function getBinaryPromise() {
                if (!wasmBinary && (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER)) {
                    if (typeof fetch === "function" && !isFileURI(wasmBinaryFile)) {
                        return fetch(wasmBinaryFile, {
                            credentials: "same-origin"
                        }).then(function(response) {
                            if (!response["ok"]) {
                                throw "failed to load wasm binary file at '" + wasmBinaryFile + "'"
                            }
                            return response["arrayBuffer"]()
                        }).catch(function() {
                            return getBinary(wasmBinaryFile)
                        })
                    } else {
                        if (readAsync) {
                            return new Promise(function(resolve, reject) {
                                readAsync(wasmBinaryFile, function(response) {
                                    resolve(new Uint8Array(response))
                                }, reject)
                            })
                        }
                    }
                }
                return Promise.resolve().then(function() {
                    return getBinary(wasmBinaryFile)
                })
            }

            function createWasm() {
                var info = {
                    "a": asmLibraryArg
                };

                function receiveInstance(instance, module) {
                    var exports = instance.exports;
                    Module["asm"] = exports;
                    wasmMemory = Module["asm"]["E"];
                    updateGlobalBufferAndViews(wasmMemory.buffer);
                    wasmTable = Module["asm"]["F"];
                    removeRunDependency("wasm-instantiate")
                }
                addRunDependency("wasm-instantiate");

                function receiveInstantiatedSource(output) {
                    receiveInstance(output["instance"])
                }

                function instantiateArrayBuffer(receiver) {
                    return getBinaryPromise().then(function(binary) {
                        return WebAssembly.instantiate(binary, info)
                    }).then(receiver, function(reason) {
                        err("failed to asynchronously prepare wasm: " + reason);
                        abort(reason)
                    })
                }

                function instantiateAsync() {
                    if (!wasmBinary && typeof WebAssembly.instantiateStreaming === "function" && !isDataURI(wasmBinaryFile) && !isFileURI(wasmBinaryFile) && typeof fetch === "function") {
                        return fetch(wasmBinaryFile, {
                            credentials: "same-origin"
                        }).then(function(response) {
                            var result = WebAssembly.instantiateStreaming(response, info);
                            return result.then(receiveInstantiatedSource, function(reason) {
                                err("wasm streaming compile failed: " + reason);
                                err("falling back to ArrayBuffer instantiation");
                                return instantiateArrayBuffer(receiveInstantiatedSource)
                            })
                        })
                    } else {
                        return instantiateArrayBuffer(receiveInstantiatedSource)
                    }
                }
                if (Module["instantiateWasm"]) {
                    try {
                        var exports = Module["instantiateWasm"](info, receiveInstance);
                        return exports
                    } catch (e) {
                        err("Module.instantiateWasm callback failed with error: " + e);
                        return false
                    }
                }
                instantiateAsync().catch(readyPromiseReject);
                return {}
            }

            function callRuntimeCallbacks(callbacks) {
                while (callbacks.length > 0) {
                    var callback = callbacks.shift();
                    if (typeof callback == "function") {
                        callback(Module);
                        continue
                    }
                    var func = callback.func;
                    if (typeof func === "number") {
                        if (callback.arg === undefined) {
                            wasmTable.get(func)()
                        } else {
                            wasmTable.get(func)(callback.arg)
                        }
                    } else {
                        func(callback.arg === undefined ? null : callback.arg)
                    }
                }
            }

            function _tzset() {
                if (_tzset.called) return;
                _tzset.called = true;
                var currentYear = (new Date).getFullYear();
                var winter = new Date(currentYear, 0, 1);
                var summer = new Date(currentYear, 6, 1);
                var winterOffset = winter.getTimezoneOffset();
                var summerOffset = summer.getTimezoneOffset();
                var stdTimezoneOffset = Math.max(winterOffset, summerOffset);
                HEAP32[__get_timezone() >> 2] = stdTimezoneOffset * 60;
                HEAP32[__get_daylight() >> 2] = Number(winterOffset != summerOffset);

                function extractZone(date) {
                    var match = date.toTimeString().match(/\(([A-Za-z ]+)\)$/);
                    return match ? match[1] : "GMT"
                }
                var winterName = extractZone(winter);
                var summerName = extractZone(summer);
                var winterNamePtr = allocateUTF8(winterName);
                var summerNamePtr = allocateUTF8(summerName);
                if (summerOffset < winterOffset) {
                    HEAP32[__get_tzname() >> 2] = winterNamePtr;
                    HEAP32[__get_tzname() + 4 >> 2] = summerNamePtr
                } else {
                    HEAP32[__get_tzname() >> 2] = summerNamePtr;
                    HEAP32[__get_tzname() + 4 >> 2] = winterNamePtr
                }
            }

            function _asctime_r(tmPtr, buf) {
                var date = {
                    tm_sec: HEAP32[tmPtr >> 2],
                    tm_min: HEAP32[tmPtr + 4 >> 2],
                    tm_hour: HEAP32[tmPtr + 8 >> 2],
                    tm_mday: HEAP32[tmPtr + 12 >> 2],
                    tm_mon: HEAP32[tmPtr + 16 >> 2],
                    tm_year: HEAP32[tmPtr + 20 >> 2],
                    tm_wday: HEAP32[tmPtr + 24 >> 2]
                };
                var days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
                var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                var s = days[date.tm_wday] + " " + months[date.tm_mon] + (date.tm_mday < 10 ? "  " : " ") + date.tm_mday + (date.tm_hour < 10 ? " 0" : " ") + date.tm_hour + (date.tm_min < 10 ? ":0" : ":") + date.tm_min + (date.tm_sec < 10 ? ":0" : ":") + date.tm_sec + " " + (1900 + date.tm_year) + "\n";
                stringToUTF8(s, buf, 26);
                return buf
            }

            function ___asctime_r(a0, a1) {
                return _asctime_r(a0, a1)
            }
            var ExceptionInfoAttrs = {
                DESTRUCTOR_OFFSET: 0,
                REFCOUNT_OFFSET: 4,
                TYPE_OFFSET: 8,
                CAUGHT_OFFSET: 12,
                RETHROWN_OFFSET: 13,
                SIZE: 16
            };

            function ___cxa_allocate_exception(size) {
                return _malloc(size + ExceptionInfoAttrs.SIZE) + ExceptionInfoAttrs.SIZE
            }

            function ExceptionInfo(excPtr) {
                this.excPtr = excPtr;
                this.ptr = excPtr - ExceptionInfoAttrs.SIZE;
                this.set_type = function(type) {
                    HEAP32[this.ptr + ExceptionInfoAttrs.TYPE_OFFSET >> 2] = type
                };
                this.get_type = function() {
                    return HEAP32[this.ptr + ExceptionInfoAttrs.TYPE_OFFSET >> 2]
                };
                this.set_destructor = function(destructor) {
                    HEAP32[this.ptr + ExceptionInfoAttrs.DESTRUCTOR_OFFSET >> 2] = destructor
                };
                this.get_destructor = function() {
                    return HEAP32[this.ptr + ExceptionInfoAttrs.DESTRUCTOR_OFFSET >> 2]
                };
                this.set_refcount = function(refcount) {
                    HEAP32[this.ptr + ExceptionInfoAttrs.REFCOUNT_OFFSET >> 2] = refcount
                };
                this.set_caught = function(caught) {
                    caught = caught ? 1 : 0;
                    HEAP8[this.ptr + ExceptionInfoAttrs.CAUGHT_OFFSET >> 0] = caught
                };
                this.get_caught = function() {
                    return HEAP8[this.ptr + ExceptionInfoAttrs.CAUGHT_OFFSET >> 0] != 0
                };
                this.set_rethrown = function(rethrown) {
                    rethrown = rethrown ? 1 : 0;
                    HEAP8[this.ptr + ExceptionInfoAttrs.RETHROWN_OFFSET >> 0] = rethrown
                };
                this.get_rethrown = function() {
                    return HEAP8[this.ptr + ExceptionInfoAttrs.RETHROWN_OFFSET >> 0] != 0
                };
                this.init = function(type, destructor) {
                    this.set_type(type);
                    this.set_destructor(destructor);
                    this.set_refcount(0);
                    this.set_caught(false);
                    this.set_rethrown(false)
                };
                this.add_ref = function() {
                    var value = HEAP32[this.ptr + ExceptionInfoAttrs.REFCOUNT_OFFSET >> 2];
                    HEAP32[this.ptr + ExceptionInfoAttrs.REFCOUNT_OFFSET >> 2] = value + 1
                };
                this.release_ref = function() {
                    var prev = HEAP32[this.ptr + ExceptionInfoAttrs.REFCOUNT_OFFSET >> 2];
                    HEAP32[this.ptr + ExceptionInfoAttrs.REFCOUNT_OFFSET >> 2] = prev - 1;
                    return prev === 1
                }
            }
            var exceptionLast = 0;
            var uncaughtExceptionCount = 0;

            function ___cxa_throw(ptr, type, destructor) {
                var info = new ExceptionInfo(ptr);
                info.init(type, destructor);
                exceptionLast = ptr;
                uncaughtExceptionCount++;
                throw ptr
            }

            function _localtime_r(time, tmPtr) {
                _tzset();
                var date = new Date(HEAP32[time >> 2] * 1e3);
                HEAP32[tmPtr >> 2] = date.getSeconds();
                HEAP32[tmPtr + 4 >> 2] = date.getMinutes();
                HEAP32[tmPtr + 8 >> 2] = date.getHours();
                HEAP32[tmPtr + 12 >> 2] = date.getDate();
                HEAP32[tmPtr + 16 >> 2] = date.getMonth();
                HEAP32[tmPtr + 20 >> 2] = date.getFullYear() - 1900;
                HEAP32[tmPtr + 24 >> 2] = date.getDay();
                var start = new Date(date.getFullYear(), 0, 1);
                var yday = (date.getTime() - start.getTime()) / (1e3 * 60 * 60 * 24) | 0;
                HEAP32[tmPtr + 28 >> 2] = yday;
                HEAP32[tmPtr + 36 >> 2] = -(date.getTimezoneOffset() * 60);
                var summerOffset = new Date(date.getFullYear(), 6, 1).getTimezoneOffset();
                var winterOffset = start.getTimezoneOffset();
                var dst = (summerOffset != winterOffset && date.getTimezoneOffset() == Math.min(winterOffset, summerOffset)) | 0;
                HEAP32[tmPtr + 32 >> 2] = dst;
                var zonePtr = HEAP32[__get_tzname() + (dst ? 4 : 0) >> 2];
                HEAP32[tmPtr + 40 >> 2] = zonePtr;
                return tmPtr
            }

            function ___localtime_r(a0, a1) {
                return _localtime_r(a0, a1)
            }

            function getShiftFromSize(size) {
                switch (size) {
                    case 1:
                        return 0;
                    case 2:
                        return 1;
                    case 4:
                        return 2;
                    case 8:
                        return 3;
                    default:
                        throw new TypeError("Unknown type size: " + size)
                }
            }

            function embind_init_charCodes() {
                var codes = new Array(256);
                for (var i = 0; i < 256; ++i) {
                    codes[i] = String.fromCharCode(i)
                }
                embind_charCodes = codes
            }
            var embind_charCodes = undefined;

            function readLatin1String(ptr) {
                var ret = "";
                var c = ptr;
                while (HEAPU8[c]) {
                    ret += embind_charCodes[HEAPU8[c++]]
                }
                return ret
            }
            var awaitingDependencies = {};
            var registeredTypes = {};
            var typeDependencies = {};
            var char_0 = 48;
            var char_9 = 57;

            function makeLegalFunctionName(name) {
                if (undefined === name) {
                    return "_unknown"
                }
                name = name.replace(/[^a-zA-Z0-9_]/g, "$");
                var f = name.charCodeAt(0);
                if (f >= char_0 && f <= char_9) {
                    return "_" + name
                } else {
                    return name
                }
            }

            function createNamedFunction(name, body) {
                name = makeLegalFunctionName(name);
                return new Function("body", "return function " + name + "() {\n" + '    "use strict";' + "    return body.apply(this, arguments);\n" + "};\n")(body)
            }

            function extendError(baseErrorType, errorName) {
                var errorClass = createNamedFunction(errorName, function(message) {
                    this.name = errorName;
                    this.message = message;
                    var stack = new Error(message).stack;
                    if (stack !== undefined) {
                        this.stack = this.toString() + "\n" + stack.replace(/^Error(:[^\n]*)?\n/, "")
                    }
                });
                errorClass.prototype = Object.create(baseErrorType.prototype);
                errorClass.prototype.constructor = errorClass;
                errorClass.prototype.toString = function() {
                    if (this.message === undefined) {
                        return this.name
                    } else {
                        return this.name + ": " + this.message
                    }
                };
                return errorClass
            }
            var BindingError = undefined;

            function throwBindingError(message) {
                throw new BindingError(message)
            }
            var InternalError = undefined;

            function throwInternalError(message) {
                throw new InternalError(message)
            }

            function whenDependentTypesAreResolved(myTypes, dependentTypes, getTypeConverters) {
                myTypes.forEach(function(type) {
                    typeDependencies[type] = dependentTypes
                });

                function onComplete(typeConverters) {
                    var myTypeConverters = getTypeConverters(typeConverters);
                    if (myTypeConverters.length !== myTypes.length) {
                        throwInternalError("Mismatched type converter count")
                    }
                    for (var i = 0; i < myTypes.length; ++i) {
                        registerType(myTypes[i], myTypeConverters[i])
                    }
                }
                var typeConverters = new Array(dependentTypes.length);
                var unregisteredTypes = [];
                var registered = 0;
                dependentTypes.forEach(function(dt, i) {
                    if (registeredTypes.hasOwnProperty(dt)) {
                        typeConverters[i] = registeredTypes[dt]
                    } else {
                        unregisteredTypes.push(dt);
                        if (!awaitingDependencies.hasOwnProperty(dt)) {
                            awaitingDependencies[dt] = []
                        }
                        awaitingDependencies[dt].push(function() {
                            typeConverters[i] = registeredTypes[dt];
                            ++registered;
                            if (registered === unregisteredTypes.length) {
                                onComplete(typeConverters)
                            }
                        })
                    }
                });
                if (0 === unregisteredTypes.length) {
                    onComplete(typeConverters)
                }
            }

            function registerType(rawType, registeredInstance, options) {
                options = options || {};
                if (!("argPackAdvance" in registeredInstance)) {
                    throw new TypeError("registerType registeredInstance requires argPackAdvance")
                }
                var name = registeredInstance.name;
                if (!rawType) {
                    throwBindingError('type "' + name + '" must have a positive integer typeid pointer')
                }
                if (registeredTypes.hasOwnProperty(rawType)) {
                    if (options.ignoreDuplicateRegistrations) {
                        return
                    } else {
                        throwBindingError("Cannot register type '" + name + "' twice")
                    }
                }
                registeredTypes[rawType] = registeredInstance;
                delete typeDependencies[rawType];
                if (awaitingDependencies.hasOwnProperty(rawType)) {
                    var callbacks = awaitingDependencies[rawType];
                    delete awaitingDependencies[rawType];
                    callbacks.forEach(function(cb) {
                        cb()
                    })
                }
            }

            function __embind_register_bool(rawType, name, size, trueValue, falseValue) {
                var shift = getShiftFromSize(size);
                name = readLatin1String(name);
                registerType(rawType, {
                    name: name,
                    "fromWireType": function(wt) {
                        return !!wt
                    },
                    "toWireType": function(destructors, o) {
                        return o ? trueValue : falseValue
                    },
                    "argPackAdvance": 8,
                    "readValueFromPointer": function(pointer) {
                        var heap;
                        if (size === 1) {
                            heap = HEAP8
                        } else if (size === 2) {
                            heap = HEAP16
                        } else if (size === 4) {
                            heap = HEAP32
                        } else {
                            throw new TypeError("Unknown boolean type size: " + name)
                        }
                        return this["fromWireType"](heap[pointer >> shift])
                    },
                    destructorFunction: null
                })
            }

            function ClassHandle_isAliasOf(other) {
                if (!(this instanceof ClassHandle)) {
                    return false
                }
                if (!(other instanceof ClassHandle)) {
                    return false
                }
                var leftClass = this.$$.ptrType.registeredClass;
                var left = this.$$.ptr;
                var rightClass = other.$$.ptrType.registeredClass;
                var right = other.$$.ptr;
                while (leftClass.baseClass) {
                    left = leftClass.upcast(left);
                    leftClass = leftClass.baseClass
                }
                while (rightClass.baseClass) {
                    right = rightClass.upcast(right);
                    rightClass = rightClass.baseClass
                }
                return leftClass === rightClass && left === right
            }

            function shallowCopyInternalPointer(o) {
                return {
                    count: o.count,
                    deleteScheduled: o.deleteScheduled,
                    preservePointerOnDelete: o.preservePointerOnDelete,
                    ptr: o.ptr,
                    ptrType: o.ptrType,
                    smartPtr: o.smartPtr,
                    smartPtrType: o.smartPtrType
                }
            }

            function throwInstanceAlreadyDeleted(obj) {
                function getInstanceTypeName(handle) {
                    return handle.$$.ptrType.registeredClass.name
                }
                throwBindingError(getInstanceTypeName(obj) + " instance already deleted")
            }
            var finalizationGroup = false;

            function detachFinalizer(handle) {}

            function runDestructor($$) {
                if ($$.smartPtr) {
                    $$.smartPtrType.rawDestructor($$.smartPtr)
                } else {
                    $$.ptrType.registeredClass.rawDestructor($$.ptr)
                }
            }

            function releaseClassHandle($$) {
                $$.count.value -= 1;
                var toDelete = 0 === $$.count.value;
                if (toDelete) {
                    runDestructor($$)
                }
            }

            function attachFinalizer(handle) {
                if ("undefined" === typeof FinalizationGroup) {
                    attachFinalizer = function(handle) {
                        return handle
                    };
                    return handle
                }
                finalizationGroup = new FinalizationGroup(function(iter) {
                    for (var result = iter.next(); !result.done; result = iter.next()) {
                        var $$ = result.value;
                        if (!$$.ptr) {
                            console.warn("object already deleted: " + $$.ptr)
                        } else {
                            releaseClassHandle($$)
                        }
                    }
                });
                attachFinalizer = function(handle) {
                    finalizationGroup.register(handle, handle.$$, handle.$$);
                    return handle
                };
                detachFinalizer = function(handle) {
                    finalizationGroup.unregister(handle.$$)
                };
                return attachFinalizer(handle)
            }

            function ClassHandle_clone() {
                if (!this.$$.ptr) {
                    throwInstanceAlreadyDeleted(this)
                }
                if (this.$$.preservePointerOnDelete) {
                    this.$$.count.value += 1;
                    return this
                } else {
                    var clone = attachFinalizer(Object.create(Object.getPrototypeOf(this), {
                        $$: {
                            value: shallowCopyInternalPointer(this.$$)
                        }
                    }));
                    clone.$$.count.value += 1;
                    clone.$$.deleteScheduled = false;
                    return clone
                }
            }

            function ClassHandle_delete() {
                if (!this.$$.ptr) {
                    throwInstanceAlreadyDeleted(this)
                }
                if (this.$$.deleteScheduled && !this.$$.preservePointerOnDelete) {
                    throwBindingError("Object already scheduled for deletion")
                }
                detachFinalizer(this);
                releaseClassHandle(this.$$);
                if (!this.$$.preservePointerOnDelete) {
                    this.$$.smartPtr = undefined;
                    this.$$.ptr = undefined
                }
            }

            function ClassHandle_isDeleted() {
                return !this.$$.ptr
            }
            var delayFunction = undefined;
            var deletionQueue = [];

            function flushPendingDeletes() {
                while (deletionQueue.length) {
                    var obj = deletionQueue.pop();
                    obj.$$.deleteScheduled = false;
                    obj["delete"]()
                }
            }

            function ClassHandle_deleteLater() {
                if (!this.$$.ptr) {
                    throwInstanceAlreadyDeleted(this)
                }
                if (this.$$.deleteScheduled && !this.$$.preservePointerOnDelete) {
                    throwBindingError("Object already scheduled for deletion")
                }
                deletionQueue.push(this);
                if (deletionQueue.length === 1 && delayFunction) {
                    delayFunction(flushPendingDeletes)
                }
                this.$$.deleteScheduled = true;
                return this
            }

            function init_ClassHandle() {
                ClassHandle.prototype["isAliasOf"] = ClassHandle_isAliasOf;
                ClassHandle.prototype["clone"] = ClassHandle_clone;
                ClassHandle.prototype["delete"] = ClassHandle_delete;
                ClassHandle.prototype["isDeleted"] = ClassHandle_isDeleted;
                ClassHandle.prototype["deleteLater"] = ClassHandle_deleteLater
            }

            function ClassHandle() {}
            var registeredPointers = {};

            function ensureOverloadTable(proto, methodName, humanName) {
                if (undefined === proto[methodName].overloadTable) {
                    var prevFunc = proto[methodName];
                    proto[methodName] = function() {
                        if (!proto[methodName].overloadTable.hasOwnProperty(arguments.length)) {
                            throwBindingError("Function '" + humanName + "' called with an invalid number of arguments (" + arguments.length + ") - expects one of (" + proto[methodName].overloadTable + ")!")
                        }
                        return proto[methodName].overloadTable[arguments.length].apply(this, arguments)
                    };
                    proto[methodName].overloadTable = [];
                    proto[methodName].overloadTable[prevFunc.argCount] = prevFunc
                }
            }

            function exposePublicSymbol(name, value, numArguments) {
                if (Module.hasOwnProperty(name)) {
                    if (undefined === numArguments || undefined !== Module[name].overloadTable && undefined !== Module[name].overloadTable[numArguments]) {
                        throwBindingError("Cannot register public name '" + name + "' twice")
                    }
                    ensureOverloadTable(Module, name, name);
                    if (Module.hasOwnProperty(numArguments)) {
                        throwBindingError("Cannot register multiple overloads of a function with the same number of arguments (" + numArguments + ")!")
                    }
                    Module[name].overloadTable[numArguments] = value
                } else {
                    Module[name] = value;
                    if (undefined !== numArguments) {
                        Module[name].numArguments = numArguments
                    }
                }
            }

            function RegisteredClass(name, constructor, instancePrototype, rawDestructor, baseClass, getActualType, upcast, downcast) {
                this.name = name;
                this.constructor = constructor;
                this.instancePrototype = instancePrototype;
                this.rawDestructor = rawDestructor;
                this.baseClass = baseClass;
                this.getActualType = getActualType;
                this.upcast = upcast;
                this.downcast = downcast;
                this.pureVirtualFunctions = []
            }

            function upcastPointer(ptr, ptrClass, desiredClass) {
                while (ptrClass !== desiredClass) {
                    if (!ptrClass.upcast) {
                        throwBindingError("Expected null or instance of " + desiredClass.name + ", got an instance of " + ptrClass.name)
                    }
                    ptr = ptrClass.upcast(ptr);
                    ptrClass = ptrClass.baseClass
                }
                return ptr
            }

            function constNoSmartPtrRawPointerToWireType(destructors, handle) {
                if (handle === null) {
                    if (this.isReference) {
                        throwBindingError("null is not a valid " + this.name)
                    }
                    return 0
                }
                if (!handle.$$) {
                    throwBindingError('Cannot pass "' + _embind_repr(handle) + '" as a ' + this.name)
                }
                if (!handle.$$.ptr) {
                    throwBindingError("Cannot pass deleted object as a pointer of type " + this.name)
                }
                var handleClass = handle.$$.ptrType.registeredClass;
                var ptr = upcastPointer(handle.$$.ptr, handleClass, this.registeredClass);
                return ptr
            }

            function genericPointerToWireType(destructors, handle) {
                var ptr;
                if (handle === null) {
                    if (this.isReference) {
                        throwBindingError("null is not a valid " + this.name)
                    }
                    if (this.isSmartPointer) {
                        ptr = this.rawConstructor();
                        if (destructors !== null) {
                            destructors.push(this.rawDestructor, ptr)
                        }
                        return ptr
                    } else {
                        return 0
                    }
                }
                if (!handle.$$) {
                    throwBindingError('Cannot pass "' + _embind_repr(handle) + '" as a ' + this.name)
                }
                if (!handle.$$.ptr) {
                    throwBindingError("Cannot pass deleted object as a pointer of type " + this.name)
                }
                if (!this.isConst && handle.$$.ptrType.isConst) {
                    throwBindingError("Cannot convert argument of type " + (handle.$$.smartPtrType ? handle.$$.smartPtrType.name : handle.$$.ptrType.name) + " to parameter type " + this.name)
                }
                var handleClass = handle.$$.ptrType.registeredClass;
                ptr = upcastPointer(handle.$$.ptr, handleClass, this.registeredClass);
                if (this.isSmartPointer) {
                    if (undefined === handle.$$.smartPtr) {
                        throwBindingError("Passing raw pointer to smart pointer is illegal")
                    }
                    switch (this.sharingPolicy) {
                        case 0:
                            if (handle.$$.smartPtrType === this) {
                                ptr = handle.$$.smartPtr
                            } else {
                                throwBindingError("Cannot convert argument of type " + (handle.$$.smartPtrType ? handle.$$.smartPtrType.name : handle.$$.ptrType.name) + " to parameter type " + this.name)
                            }
                            break;
                        case 1:
                            ptr = handle.$$.smartPtr;
                            break;
                        case 2:
                            if (handle.$$.smartPtrType === this) {
                                ptr = handle.$$.smartPtr
                            } else {
                                var clonedHandle = handle["clone"]();
                                ptr = this.rawShare(ptr, __emval_register(function() {
                                    clonedHandle["delete"]()
                                }));
                                if (destructors !== null) {
                                    destructors.push(this.rawDestructor, ptr)
                                }
                            }
                            break;
                        default:
                            throwBindingError("Unsupporting sharing policy")
                    }
                }
                return ptr
            }

            function nonConstNoSmartPtrRawPointerToWireType(destructors, handle) {
                if (handle === null) {
                    if (this.isReference) {
                        throwBindingError("null is not a valid " + this.name)
                    }
                    return 0
                }
                if (!handle.$$) {
                    throwBindingError('Cannot pass "' + _embind_repr(handle) + '" as a ' + this.name)
                }
                if (!handle.$$.ptr) {
                    throwBindingError("Cannot pass deleted object as a pointer of type " + this.name)
                }
                if (handle.$$.ptrType.isConst) {
                    throwBindingError("Cannot convert argument of type " + handle.$$.ptrType.name + " to parameter type " + this.name)
                }
                var handleClass = handle.$$.ptrType.registeredClass;
                var ptr = upcastPointer(handle.$$.ptr, handleClass, this.registeredClass);
                return ptr
            }

            function simpleReadValueFromPointer(pointer) {
                return this["fromWireType"](HEAPU32[pointer >> 2])
            }

            function RegisteredPointer_getPointee(ptr) {
                if (this.rawGetPointee) {
                    ptr = this.rawGetPointee(ptr)
                }
                return ptr
            }

            function RegisteredPointer_destructor(ptr) {
                if (this.rawDestructor) {
                    this.rawDestructor(ptr)
                }
            }

            function RegisteredPointer_deleteObject(handle) {
                if (handle !== null) {
                    handle["delete"]()
                }
            }

            function downcastPointer(ptr, ptrClass, desiredClass) {
                if (ptrClass === desiredClass) {
                    return ptr
                }
                if (undefined === desiredClass.baseClass) {
                    return null
                }
                var rv = downcastPointer(ptr, ptrClass, desiredClass.baseClass);
                if (rv === null) {
                    return null
                }
                return desiredClass.downcast(rv)
            }

            function getInheritedInstanceCount() {
                return Object.keys(registeredInstances).length
            }

            function getLiveInheritedInstances() {
                var rv = [];
                for (var k in registeredInstances) {
                    if (registeredInstances.hasOwnProperty(k)) {
                        rv.push(registeredInstances[k])
                    }
                }
                return rv
            }

            function setDelayFunction(fn) {
                delayFunction = fn;
                if (deletionQueue.length && delayFunction) {
                    delayFunction(flushPendingDeletes)
                }
            }

            function init_embind() {
                Module["getInheritedInstanceCount"] = getInheritedInstanceCount;
                Module["getLiveInheritedInstances"] = getLiveInheritedInstances;
                Module["flushPendingDeletes"] = flushPendingDeletes;
                Module["setDelayFunction"] = setDelayFunction
            }
            var registeredInstances = {};

            function getBasestPointer(class_, ptr) {
                if (ptr === undefined) {
                    throwBindingError("ptr should not be undefined")
                }
                while (class_.baseClass) {
                    ptr = class_.upcast(ptr);
                    class_ = class_.baseClass
                }
                return ptr
            }

            function getInheritedInstance(class_, ptr) {
                ptr = getBasestPointer(class_, ptr);
                return registeredInstances[ptr]
            }

            function makeClassHandle(prototype, record) {
                if (!record.ptrType || !record.ptr) {
                    throwInternalError("makeClassHandle requires ptr and ptrType")
                }
                var hasSmartPtrType = !!record.smartPtrType;
                var hasSmartPtr = !!record.smartPtr;
                if (hasSmartPtrType !== hasSmartPtr) {
                    throwInternalError("Both smartPtrType and smartPtr must be specified")
                }
                record.count = {
                    value: 1
                };
                return attachFinalizer(Object.create(prototype, {
                    $$: {
                        value: record
                    }
                }))
            }

            function RegisteredPointer_fromWireType(ptr) {
                var rawPointer = this.getPointee(ptr);
                if (!rawPointer) {
                    this.destructor(ptr);
                    return null
                }
                var registeredInstance = getInheritedInstance(this.registeredClass, rawPointer);
                if (undefined !== registeredInstance) {
                    if (0 === registeredInstance.$$.count.value) {
                        registeredInstance.$$.ptr = rawPointer;
                        registeredInstance.$$.smartPtr = ptr;
                        return registeredInstance["clone"]()
                    } else {
                        var rv = registeredInstance["clone"]();
                        this.destructor(ptr);
                        return rv
                    }
                }

                function makeDefaultHandle() {
                    if (this.isSmartPointer) {
                        return makeClassHandle(this.registeredClass.instancePrototype, {
                            ptrType: this.pointeeType,
                            ptr: rawPointer,
                            smartPtrType: this,
                            smartPtr: ptr
                        })
                    } else {
                        return makeClassHandle(this.registeredClass.instancePrototype, {
                            ptrType: this,
                            ptr: ptr
                        })
                    }
                }
                var actualType = this.registeredClass.getActualType(rawPointer);
                var registeredPointerRecord = registeredPointers[actualType];
                if (!registeredPointerRecord) {
                    return makeDefaultHandle.call(this)
                }
                var toType;
                if (this.isConst) {
                    toType = registeredPointerRecord.constPointerType
                } else {
                    toType = registeredPointerRecord.pointerType
                }
                var dp = downcastPointer(rawPointer, this.registeredClass, toType.registeredClass);
                if (dp === null) {
                    return makeDefaultHandle.call(this)
                }
                if (this.isSmartPointer) {
                    return makeClassHandle(toType.registeredClass.instancePrototype, {
                        ptrType: toType,
                        ptr: dp,
                        smartPtrType: this,
                        smartPtr: ptr
                    })
                } else {
                    return makeClassHandle(toType.registeredClass.instancePrototype, {
                        ptrType: toType,
                        ptr: dp
                    })
                }
            }

            function init_RegisteredPointer() {
                RegisteredPointer.prototype.getPointee = RegisteredPointer_getPointee;
                RegisteredPointer.prototype.destructor = RegisteredPointer_destructor;
                RegisteredPointer.prototype["argPackAdvance"] = 8;
                RegisteredPointer.prototype["readValueFromPointer"] = simpleReadValueFromPointer;
                RegisteredPointer.prototype["deleteObject"] = RegisteredPointer_deleteObject;
                RegisteredPointer.prototype["fromWireType"] = RegisteredPointer_fromWireType
            }

            function RegisteredPointer(name, registeredClass, isReference, isConst, isSmartPointer, pointeeType, sharingPolicy, rawGetPointee, rawConstructor, rawShare, rawDestructor) {
                this.name = name;
                this.registeredClass = registeredClass;
                this.isReference = isReference;
                this.isConst = isConst;
                this.isSmartPointer = isSmartPointer;
                this.pointeeType = pointeeType;
                this.sharingPolicy = sharingPolicy;
                this.rawGetPointee = rawGetPointee;
                this.rawConstructor = rawConstructor;
                this.rawShare = rawShare;
                this.rawDestructor = rawDestructor;
                if (!isSmartPointer && registeredClass.baseClass === undefined) {
                    if (isConst) {
                        this["toWireType"] = constNoSmartPtrRawPointerToWireType;
                        this.destructorFunction = null
                    } else {
                        this["toWireType"] = nonConstNoSmartPtrRawPointerToWireType;
                        this.destructorFunction = null
                    }
                } else {
                    this["toWireType"] = genericPointerToWireType
                }
            }

            function replacePublicSymbol(name, value, numArguments) {
                if (!Module.hasOwnProperty(name)) {
                    throwInternalError("Replacing nonexistant public symbol")
                }
                if (undefined !== Module[name].overloadTable && undefined !== numArguments) {
                    Module[name].overloadTable[numArguments] = value
                } else {
                    Module[name] = value;
                    Module[name].argCount = numArguments
                }
            }

            function dynCallLegacy(sig, ptr, args) {
                if (args && args.length) {
                    return Module["dynCall_" + sig].apply(null, [ptr].concat(args))
                }
                return Module["dynCall_" + sig].call(null, ptr)
            }

            function dynCall(sig, ptr, args) {
                if (sig.indexOf("j") != -1) {
                    return dynCallLegacy(sig, ptr, args)
                }
                return wasmTable.get(ptr).apply(null, args)
            }

            function getDynCaller(sig, ptr) {
                assert(sig.indexOf("j") >= 0, "getDynCaller should only be called with i64 sigs");
                var argCache = [];
                return function() {
                    argCache.length = arguments.length;
                    for (var i = 0; i < arguments.length; i++) {
                        argCache[i] = arguments[i]
                    }
                    return dynCall(sig, ptr, argCache)
                }
            }

            function embind__requireFunction(signature, rawFunction) {
                signature = readLatin1String(signature);

                function makeDynCaller() {
                    if (signature.indexOf("j") != -1) {
                        return getDynCaller(signature, rawFunction)
                    }
                    return wasmTable.get(rawFunction)
                }
                var fp = makeDynCaller();
                if (typeof fp !== "function") {
                    throwBindingError("unknown function pointer with signature " + signature + ": " + rawFunction)
                }
                return fp
            }
            var UnboundTypeError = undefined;

            function getTypeName(type) {
                var ptr = ___getTypeName(type);
                var rv = readLatin1String(ptr);
                _free(ptr);
                return rv
            }

            function throwUnboundTypeError(message, types) {
                var unboundTypes = [];
                var seen = {};

                function visit(type) {
                    if (seen[type]) {
                        return
                    }
                    if (registeredTypes[type]) {
                        return
                    }
                    if (typeDependencies[type]) {
                        typeDependencies[type].forEach(visit);
                        return
                    }
                    unboundTypes.push(type);
                    seen[type] = true
                }
                types.forEach(visit);
                throw new UnboundTypeError(message + ": " + unboundTypes.map(getTypeName).join([", "]))
            }

            function __embind_register_class(rawType, rawPointerType, rawConstPointerType, baseClassRawType, getActualTypeSignature, getActualType, upcastSignature, upcast, downcastSignature, downcast, name, destructorSignature, rawDestructor) {
                name = readLatin1String(name);
                getActualType = embind__requireFunction(getActualTypeSignature, getActualType);
                if (upcast) {
                    upcast = embind__requireFunction(upcastSignature, upcast)
                }
                if (downcast) {
                    downcast = embind__requireFunction(downcastSignature, downcast)
                }
                rawDestructor = embind__requireFunction(destructorSignature, rawDestructor);
                var legalFunctionName = makeLegalFunctionName(name);
                exposePublicSymbol(legalFunctionName, function() {
                    throwUnboundTypeError("Cannot construct " + name + " due to unbound types", [baseClassRawType])
                });
                whenDependentTypesAreResolved([rawType, rawPointerType, rawConstPointerType], baseClassRawType ? [baseClassRawType] : [], function(base) {
                    base = base[0];
                    var baseClass;
                    var basePrototype;
                    if (baseClassRawType) {
                        baseClass = base.registeredClass;
                        basePrototype = baseClass.instancePrototype
                    } else {
                        basePrototype = ClassHandle.prototype
                    }
                    var constructor = createNamedFunction(legalFunctionName, function() {
                        if (Object.getPrototypeOf(this) !== instancePrototype) {
                            throw new BindingError("Use 'new' to construct " + name)
                        }
                        if (undefined === registeredClass.constructor_body) {
                            throw new BindingError(name + " has no accessible constructor")
                        }
                        var body = registeredClass.constructor_body[arguments.length];
                        if (undefined === body) {
                            throw new BindingError("Tried to invoke ctor of " + name + " with invalid number of parameters (" + arguments.length + ") - expected (" + Object.keys(registeredClass.constructor_body).toString() + ") parameters instead!")
                        }
                        return body.apply(this, arguments)
                    });
                    var instancePrototype = Object.create(basePrototype, {
                        constructor: {
                            value: constructor
                        }
                    });
                    constructor.prototype = instancePrototype;
                    var registeredClass = new RegisteredClass(name, constructor, instancePrototype, rawDestructor, baseClass, getActualType, upcast, downcast);
                    var referenceConverter = new RegisteredPointer(name, registeredClass, true, false, false);
                    var pointerConverter = new RegisteredPointer(name + "*", registeredClass, false, false, false);
                    var constPointerConverter = new RegisteredPointer(name + " const*", registeredClass, false, true, false);
                    registeredPointers[rawType] = {
                        pointerType: pointerConverter,
                        constPointerType: constPointerConverter
                    };
                    replacePublicSymbol(legalFunctionName, constructor);
                    return [referenceConverter, pointerConverter, constPointerConverter]
                })
            }

            function heap32VectorToArray(count, firstElement) {
                var array = [];
                for (var i = 0; i < count; i++) {
                    array.push(HEAP32[(firstElement >> 2) + i])
                }
                return array
            }

            function runDestructors(destructors) {
                while (destructors.length) {
                    var ptr = destructors.pop();
                    var del = destructors.pop();
                    del(ptr)
                }
            }

            function __embind_register_class_constructor(rawClassType, argCount, rawArgTypesAddr, invokerSignature, invoker, rawConstructor) {
                assert(argCount > 0);
                var rawArgTypes = heap32VectorToArray(argCount, rawArgTypesAddr);
                invoker = embind__requireFunction(invokerSignature, invoker);
                var args = [rawConstructor];
                var destructors = [];
                whenDependentTypesAreResolved([], [rawClassType], function(classType) {
                    classType = classType[0];
                    var humanName = "constructor " + classType.name;
                    if (undefined === classType.registeredClass.constructor_body) {
                        classType.registeredClass.constructor_body = []
                    }
                    if (undefined !== classType.registeredClass.constructor_body[argCount - 1]) {
                        throw new BindingError("Cannot register multiple constructors with identical number of parameters (" + (argCount - 1) + ") for class '" + classType.name + "'! Overload resolution is currently only performed using the parameter count, not actual type info!")
                    }
                    classType.registeredClass.constructor_body[argCount - 1] = function unboundTypeHandler() {
                        throwUnboundTypeError("Cannot construct " + classType.name + " due to unbound types", rawArgTypes)
                    };
                    whenDependentTypesAreResolved([], rawArgTypes, function(argTypes) {
                        classType.registeredClass.constructor_body[argCount - 1] = function constructor_body() {
                            if (arguments.length !== argCount - 1) {
                                throwBindingError(humanName + " called with " + arguments.length + " arguments, expected " + (argCount - 1))
                            }
                            destructors.length = 0;
                            args.length = argCount;
                            for (var i = 1; i < argCount; ++i) {
                                args[i] = argTypes[i]["toWireType"](destructors, arguments[i - 1])
                            }
                            var ptr = invoker.apply(null, args);
                            runDestructors(destructors);
                            return argTypes[0]["fromWireType"](ptr)
                        };
                        return []
                    });
                    return []
                })
            }

            function validateThis(this_, classType, humanName) {
                if (!(this_ instanceof Object)) {
                    throwBindingError(humanName + ' with invalid "this": ' + this_)
                }
                if (!(this_ instanceof classType.registeredClass.constructor)) {
                    throwBindingError(humanName + ' incompatible with "this" of type ' + this_.constructor.name)
                }
                if (!this_.$$.ptr) {
                    throwBindingError("cannot call emscripten binding method " + humanName + " on deleted object")
                }
                return upcastPointer(this_.$$.ptr, this_.$$.ptrType.registeredClass, classType.registeredClass)
            }

            function __embind_register_class_property(classType, fieldName, getterReturnType, getterSignature, getter, getterContext, setterArgumentType, setterSignature, setter, setterContext) {
                fieldName = readLatin1String(fieldName);
                getter = embind__requireFunction(getterSignature, getter);
                whenDependentTypesAreResolved([], [classType], function(classType) {
                    classType = classType[0];
                    var humanName = classType.name + "." + fieldName;
                    var desc = {
                        get: function() {
                            throwUnboundTypeError("Cannot access " + humanName + " due to unbound types", [getterReturnType, setterArgumentType])
                        },
                        enumerable: true,
                        configurable: true
                    };
                    if (setter) {
                        desc.set = function() {
                            throwUnboundTypeError("Cannot access " + humanName + " due to unbound types", [getterReturnType, setterArgumentType])
                        }
                    } else {
                        desc.set = function(v) {
                            throwBindingError(humanName + " is a read-only property")
                        }
                    }
                    Object.defineProperty(classType.registeredClass.instancePrototype, fieldName, desc);
                    whenDependentTypesAreResolved([], setter ? [getterReturnType, setterArgumentType] : [getterReturnType], function(types) {
                        var getterReturnType = types[0];
                        var desc = {
                            get: function() {
                                var ptr = validateThis(this, classType, humanName + " getter");
                                return getterReturnType["fromWireType"](getter(getterContext, ptr))
                            },
                            enumerable: true
                        };
                        if (setter) {
                            setter = embind__requireFunction(setterSignature, setter);
                            var setterArgumentType = types[1];
                            desc.set = function(v) {
                                var ptr = validateThis(this, classType, humanName + " setter");
                                var destructors = [];
                                setter(setterContext, ptr, setterArgumentType["toWireType"](destructors, v));
                                runDestructors(destructors)
                            }
                        }
                        Object.defineProperty(classType.registeredClass.instancePrototype, fieldName, desc);
                        return []
                    });
                    return []
                })
            }
            var emval_free_list = [];
            var emval_handle_array = [{}, {
                value: undefined
            }, {
                value: null
            }, {
                value: true
            }, {
                value: false
            }];

            function __emval_decref(handle) {
                if (handle > 4 && 0 === --emval_handle_array[handle].refcount) {
                    emval_handle_array[handle] = undefined;
                    emval_free_list.push(handle)
                }
            }

            function count_emval_handles() {
                var count = 0;
                for (var i = 5; i < emval_handle_array.length; ++i) {
                    if (emval_handle_array[i] !== undefined) {
                        ++count
                    }
                }
                return count
            }

            function get_first_emval() {
                for (var i = 5; i < emval_handle_array.length; ++i) {
                    if (emval_handle_array[i] !== undefined) {
                        return emval_handle_array[i]
                    }
                }
                return null
            }

            function init_emval() {
                Module["count_emval_handles"] = count_emval_handles;
                Module["get_first_emval"] = get_first_emval
            }

            function __emval_register(value) {
                switch (value) {
                    case undefined: {
                        return 1
                    }
                    case null: {
                        return 2
                    }
                    case true: {
                        return 3
                    }
                    case false: {
                        return 4
                    }
                    default: {
                        var handle = emval_free_list.length ? emval_free_list.pop() : emval_handle_array.length;
                        emval_handle_array[handle] = {
                            refcount: 1,
                            value: value
                        };
                        return handle
                    }
                }
            }

            function __embind_register_emval(rawType, name) {
                name = readLatin1String(name);
                registerType(rawType, {
                    name: name,
                    "fromWireType": function(handle) {
                        var rv = emval_handle_array[handle].value;
                        __emval_decref(handle);
                        return rv
                    },
                    "toWireType": function(destructors, value) {
                        return __emval_register(value)
                    },
                    "argPackAdvance": 8,
                    "readValueFromPointer": simpleReadValueFromPointer,
                    destructorFunction: null
                })
            }

            function enumReadValueFromPointer(name, shift, signed) {
                switch (shift) {
                    case 0:
                        return function(pointer) {
                            var heap = signed ? HEAP8 : HEAPU8;
                            return this["fromWireType"](heap[pointer])
                        };
                    case 1:
                        return function(pointer) {
                            var heap = signed ? HEAP16 : HEAPU16;
                            return this["fromWireType"](heap[pointer >> 1])
                        };
                    case 2:
                        return function(pointer) {
                            var heap = signed ? HEAP32 : HEAPU32;
                            return this["fromWireType"](heap[pointer >> 2])
                        };
                    default:
                        throw new TypeError("Unknown integer type: " + name)
                }
            }

            function __embind_register_enum(rawType, name, size, isSigned) {
                var shift = getShiftFromSize(size);
                name = readLatin1String(name);

                function ctor() {}
                ctor.values = {};
                registerType(rawType, {
                    name: name,
                    constructor: ctor,
                    "fromWireType": function(c) {
                        return this.constructor.values[c]
                    },
                    "toWireType": function(destructors, c) {
                        return c.value
                    },
                    "argPackAdvance": 8,
                    "readValueFromPointer": enumReadValueFromPointer(name, shift, isSigned),
                    destructorFunction: null
                });
                exposePublicSymbol(name, ctor)
            }

            function requireRegisteredType(rawType, humanName) {
                var impl = registeredTypes[rawType];
                if (undefined === impl) {
                    throwBindingError(humanName + " has unknown type " + getTypeName(rawType))
                }
                return impl
            }

            function __embind_register_enum_value(rawEnumType, name, enumValue) {
                var enumType = requireRegisteredType(rawEnumType, "enum");
                name = readLatin1String(name);
                var Enum = enumType.constructor;
                var Value = Object.create(enumType.constructor.prototype, {
                    value: {
                        value: enumValue
                    },
                    constructor: {
                        value: createNamedFunction(enumType.name + "_" + name, function() {})
                    }
                });
                Enum.values[enumValue] = Value;
                Enum[name] = Value
            }

            function _embind_repr(v) {
                if (v === null) {
                    return "null"
                }
                var t = typeof v;
                if (t === "object" || t === "array" || t === "function") {
                    return v.toString()
                } else {
                    return "" + v
                }
            }

            function floatReadValueFromPointer(name, shift) {
                switch (shift) {
                    case 2:
                        return function(pointer) {
                            return this["fromWireType"](HEAPF32[pointer >> 2])
                        };
                    case 3:
                        return function(pointer) {
                            return this["fromWireType"](HEAPF64[pointer >> 3])
                        };
                    default:
                        throw new TypeError("Unknown float type: " + name)
                }
            }

            function __embind_register_float(rawType, name, size) {
                var shift = getShiftFromSize(size);
                name = readLatin1String(name);
                registerType(rawType, {
                    name: name,
                    "fromWireType": function(value) {
                        return value
                    },
                    "toWireType": function(destructors, value) {
                        if (typeof value !== "number" && typeof value !== "boolean") {
                            throw new TypeError('Cannot convert "' + _embind_repr(value) + '" to ' + this.name)
                        }
                        return value
                    },
                    "argPackAdvance": 8,
                    "readValueFromPointer": floatReadValueFromPointer(name, shift),
                    destructorFunction: null
                })
            }

            function new_(constructor, argumentList) {
                if (!(constructor instanceof Function)) {
                    throw new TypeError("new_ called with constructor type " + typeof constructor + " which is not a function")
                }
                var dummy = createNamedFunction(constructor.name || "unknownFunctionName", function() {});
                dummy.prototype = constructor.prototype;
                var obj = new dummy;
                var r = constructor.apply(obj, argumentList);
                return r instanceof Object ? r : obj
            }

            function craftInvokerFunction(humanName, argTypes, classType, cppInvokerFunc, cppTargetFunc) {
                var argCount = argTypes.length;
                if (argCount < 2) {
                    throwBindingError("argTypes array size mismatch! Must at least get return value and 'this' types!")
                }
                var isClassMethodFunc = argTypes[1] !== null && classType !== null;
                var needsDestructorStack = false;
                for (var i = 1; i < argTypes.length; ++i) {
                    if (argTypes[i] !== null && argTypes[i].destructorFunction === undefined) {
                        needsDestructorStack = true;
                        break
                    }
                }
                var returns = argTypes[0].name !== "void";
                var argsList = "";
                var argsListWired = "";
                for (var i = 0; i < argCount - 2; ++i) {
                    argsList += (i !== 0 ? ", " : "") + "arg" + i;
                    argsListWired += (i !== 0 ? ", " : "") + "arg" + i + "Wired"
                }
                var invokerFnBody = "return function " + makeLegalFunctionName(humanName) + "(" + argsList + ") {\n" + "if (arguments.length !== " + (argCount - 2) + ") {\n" + "throwBindingError('function " + humanName + " called with ' + arguments.length + ' arguments, expected " + (argCount - 2) + " args!');\n" + "}\n";
                if (needsDestructorStack) {
                    invokerFnBody += "var destructors = [];\n"
                }
                var dtorStack = needsDestructorStack ? "destructors" : "null";
                var args1 = ["throwBindingError", "invoker", "fn", "runDestructors", "retType", "classParam"];
                var args2 = [throwBindingError, cppInvokerFunc, cppTargetFunc, runDestructors, argTypes[0], argTypes[1]];
                if (isClassMethodFunc) {
                    invokerFnBody += "var thisWired = classParam.toWireType(" + dtorStack + ", this);\n"
                }
                for (var i = 0; i < argCount - 2; ++i) {
                    invokerFnBody += "var arg" + i + "Wired = argType" + i + ".toWireType(" + dtorStack + ", arg" + i + "); // " + argTypes[i + 2].name + "\n";
                    args1.push("argType" + i);
                    args2.push(argTypes[i + 2])
                }
                if (isClassMethodFunc) {
                    argsListWired = "thisWired" + (argsListWired.length > 0 ? ", " : "") + argsListWired
                }
                invokerFnBody += (returns ? "var rv = " : "") + "invoker(fn" + (argsListWired.length > 0 ? ", " : "") + argsListWired + ");\n";
                if (needsDestructorStack) {
                    invokerFnBody += "runDestructors(destructors);\n"
                } else {
                    for (var i = isClassMethodFunc ? 1 : 2; i < argTypes.length; ++i) {
                        var paramName = i === 1 ? "thisWired" : "arg" + (i - 2) + "Wired";
                        if (argTypes[i].destructorFunction !== null) {
                            invokerFnBody += paramName + "_dtor(" + paramName + "); // " + argTypes[i].name + "\n";
                            args1.push(paramName + "_dtor");
                            args2.push(argTypes[i].destructorFunction)
                        }
                    }
                }
                if (returns) {
                    invokerFnBody += "var ret = retType.fromWireType(rv);\n" + "return ret;\n"
                } else {}
                invokerFnBody += "}\n";
                args1.push(invokerFnBody);
                var invokerFunction = new_(Function, args1).apply(null, args2);
                return invokerFunction
            }

            function __embind_register_function(name, argCount, rawArgTypesAddr, signature, rawInvoker, fn) {
                var argTypes = heap32VectorToArray(argCount, rawArgTypesAddr);
                name = readLatin1String(name);
                rawInvoker = embind__requireFunction(signature, rawInvoker);
                exposePublicSymbol(name, function() {
                    throwUnboundTypeError("Cannot call " + name + " due to unbound types", argTypes)
                }, argCount - 1);
                whenDependentTypesAreResolved([], argTypes, function(argTypes) {
                    var invokerArgsArray = [argTypes[0], null].concat(argTypes.slice(1));
                    replacePublicSymbol(name, craftInvokerFunction(name, invokerArgsArray, null, rawInvoker, fn), argCount - 1);
                    return []
                })
            }

            function integerReadValueFromPointer(name, shift, signed) {
                switch (shift) {
                    case 0:
                        return signed ? function readS8FromPointer(pointer) {
                            return HEAP8[pointer]
                        } : function readU8FromPointer(pointer) {
                            return HEAPU8[pointer]
                        };
                    case 1:
                        return signed ? function readS16FromPointer(pointer) {
                            return HEAP16[pointer >> 1]
                        } : function readU16FromPointer(pointer) {
                            return HEAPU16[pointer >> 1]
                        };
                    case 2:
                        return signed ? function readS32FromPointer(pointer) {
                            return HEAP32[pointer >> 2]
                        } : function readU32FromPointer(pointer) {
                            return HEAPU32[pointer >> 2]
                        };
                    default:
                        throw new TypeError("Unknown integer type: " + name)
                }
            }

            function __embind_register_integer(primitiveType, name, size, minRange, maxRange) {
                name = readLatin1String(name);
                if (maxRange === -1) {
                    maxRange = 4294967295
                }
                var shift = getShiftFromSize(size);
                var fromWireType = function(value) {
                    return value
                };
                if (minRange === 0) {
                    var bitshift = 32 - 8 * size;
                    fromWireType = function(value) {
                        return value << bitshift >>> bitshift
                    }
                }
                var isUnsignedType = name.indexOf("unsigned") != -1;
                registerType(primitiveType, {
                    name: name,
                    "fromWireType": fromWireType,
                    "toWireType": function(destructors, value) {
                        if (typeof value !== "number" && typeof value !== "boolean") {
                            throw new TypeError('Cannot convert "' + _embind_repr(value) + '" to ' + this.name)
                        }
                        if (value < minRange || value > maxRange) {
                            throw new TypeError('Passing a number "' + _embind_repr(value) + '" from JS side to C/C++ side to an argument of type "' + name + '", which is outside the valid range [' + minRange + ", " + maxRange + "]!")
                        }
                        return isUnsignedType ? value >>> 0 : value | 0
                    },
                    "argPackAdvance": 8,
                    "readValueFromPointer": integerReadValueFromPointer(name, shift, minRange !== 0),
                    destructorFunction: null
                })
            }

            function __embind_register_memory_view(rawType, dataTypeIndex, name) {
                var typeMapping = [Int8Array, Uint8Array, Int16Array, Uint16Array, Int32Array, Uint32Array, Float32Array, Float64Array];
                var TA = typeMapping[dataTypeIndex];

                function decodeMemoryView(handle) {
                    handle = handle >> 2;
                    var heap = HEAPU32;
                    var size = heap[handle];
                    var data = heap[handle + 1];
                    return new TA(buffer, data, size)
                }
                name = readLatin1String(name);
                registerType(rawType, {
                    name: name,
                    "fromWireType": decodeMemoryView,
                    "argPackAdvance": 8,
                    "readValueFromPointer": decodeMemoryView
                }, {
                    ignoreDuplicateRegistrations: true
                })
            }

            function __embind_register_std_string(rawType, name) {
                name = readLatin1String(name);
                var stdStringIsUTF8 = name === "std::string";
                registerType(rawType, {
                    name: name,
                    "fromWireType": function(value) {
                        var length = HEAPU32[value >> 2];
                        var str;
                        if (stdStringIsUTF8) {
                            var decodeStartPtr = value + 4;
                            for (var i = 0; i <= length; ++i) {
                                var currentBytePtr = value + 4 + i;
                                if (i == length || HEAPU8[currentBytePtr] == 0) {
                                    var maxRead = currentBytePtr - decodeStartPtr;
                                    var stringSegment = UTF8ToString(decodeStartPtr, maxRead);
                                    if (str === undefined) {
                                        str = stringSegment
                                    } else {
                                        str += String.fromCharCode(0);
                                        str += stringSegment
                                    }
                                    decodeStartPtr = currentBytePtr + 1
                                }
                            }
                        } else {
                            var a = new Array(length);
                            for (var i = 0; i < length; ++i) {
                                a[i] = String.fromCharCode(HEAPU8[value + 4 + i])
                            }
                            str = a.join("")
                        }
                        _free(value);
                        return str
                    },
                    "toWireType": function(destructors, value) {
                        if (value instanceof ArrayBuffer) {
                            value = new Uint8Array(value)
                        }
                        var getLength;
                        var valueIsOfTypeString = typeof value === "string";
                        if (!(valueIsOfTypeString || value instanceof Uint8Array || value instanceof Uint8ClampedArray || value instanceof Int8Array)) {
                            throwBindingError("Cannot pass non-string to std::string")
                        }
                        if (stdStringIsUTF8 && valueIsOfTypeString) {
                            getLength = function() {
                                return lengthBytesUTF8(value)
                            }
                        } else {
                            getLength = function() {
                                return value.length
                            }
                        }
                        var length = getLength();
                        var ptr = _malloc(4 + length + 1);
                        HEAPU32[ptr >> 2] = length;
                        if (stdStringIsUTF8 && valueIsOfTypeString) {
                            stringToUTF8(value, ptr + 4, length + 1)
                        } else {
                            if (valueIsOfTypeString) {
                                for (var i = 0; i < length; ++i) {
                                    var charCode = value.charCodeAt(i);
                                    if (charCode > 255) {
                                        _free(ptr);
                                        throwBindingError("String has UTF-16 code units that do not fit in 8 bits")
                                    }
                                    HEAPU8[ptr + 4 + i] = charCode
                                }
                            } else {
                                for (var i = 0; i < length; ++i) {
                                    HEAPU8[ptr + 4 + i] = value[i]
                                }
                            }
                        }
                        if (destructors !== null) {
                            destructors.push(_free, ptr)
                        }
                        return ptr
                    },
                    "argPackAdvance": 8,
                    "readValueFromPointer": simpleReadValueFromPointer,
                    destructorFunction: function(ptr) {
                        _free(ptr)
                    }
                })
            }

            function __embind_register_std_wstring(rawType, charSize, name) {
                name = readLatin1String(name);
                var decodeString, encodeString, getHeap, lengthBytesUTF, shift;
                if (charSize === 2) {
                    decodeString = UTF16ToString;
                    encodeString = stringToUTF16;
                    lengthBytesUTF = lengthBytesUTF16;
                    getHeap = function() {
                        return HEAPU16
                    };
                    shift = 1
                } else if (charSize === 4) {
                    decodeString = UTF32ToString;
                    encodeString = stringToUTF32;
                    lengthBytesUTF = lengthBytesUTF32;
                    getHeap = function() {
                        return HEAPU32
                    };
                    shift = 2
                }
                registerType(rawType, {
                    name: name,
                    "fromWireType": function(value) {
                        var length = HEAPU32[value >> 2];
                        var HEAP = getHeap();
                        var str;
                        var decodeStartPtr = value + 4;
                        for (var i = 0; i <= length; ++i) {
                            var currentBytePtr = value + 4 + i * charSize;
                            if (i == length || HEAP[currentBytePtr >> shift] == 0) {
                                var maxReadBytes = currentBytePtr - decodeStartPtr;
                                var stringSegment = decodeString(decodeStartPtr, maxReadBytes);
                                if (str === undefined) {
                                    str = stringSegment
                                } else {
                                    str += String.fromCharCode(0);
                                    str += stringSegment
                                }
                                decodeStartPtr = currentBytePtr + charSize
                            }
                        }
                        _free(value);
                        return str
                    },
                    "toWireType": function(destructors, value) {
                        if (!(typeof value === "string")) {
                            throwBindingError("Cannot pass non-string to C++ string type " + name)
                        }
                        var length = lengthBytesUTF(value);
                        var ptr = _malloc(4 + length + charSize);
                        HEAPU32[ptr >> 2] = length >> shift;
                        encodeString(value, ptr + 4, length + charSize);
                        if (destructors !== null) {
                            destructors.push(_free, ptr)
                        }
                        return ptr
                    },
                    "argPackAdvance": 8,
                    "readValueFromPointer": simpleReadValueFromPointer,
                    destructorFunction: function(ptr) {
                        _free(ptr)
                    }
                })
            }

            function __embind_register_void(rawType, name) {
                name = readLatin1String(name);
                registerType(rawType, {
                    isVoid: true,
                    name: name,
                    "argPackAdvance": 0,
                    "fromWireType": function() {
                        return undefined
                    },
                    "toWireType": function(destructors, o) {
                        return undefined
                    }
                })
            }

            function __emval_incref(handle) {
                if (handle > 4) {
                    emval_handle_array[handle].refcount += 1
                }
            }

            function __emval_take_value(type, argv) {
                type = requireRegisteredType(type, "_emval_take_value");
                var v = type["readValueFromPointer"](argv);
                return __emval_register(v)
            }

            function _abort() {
                abort()
            }
            var _emscripten_get_now;
            if (ENVIRONMENT_IS_NODE) {
                _emscripten_get_now = function() {
                    var t = process["hrtime"]();
                    return t[0] * 1e3 + t[1] / 1e6
                }
            } else if (typeof dateNow !== "undefined") {
                _emscripten_get_now = dateNow
            } else _emscripten_get_now = function() {
                return performance.now()
            };
            var _emscripten_get_now_is_monotonic = true;

            function setErrNo(value) {
                HEAP32[___errno_location() >> 2] = value;
                return value
            }

            function _clock_gettime(clk_id, tp) {
                var now;
                if (clk_id === 0) {
                    now = Date.now()
                } else if ((clk_id === 1 || clk_id === 4) && _emscripten_get_now_is_monotonic) {
                    now = _emscripten_get_now()
                } else {
                    setErrNo(28);
                    return -1
                }
                HEAP32[tp >> 2] = now / 1e3 | 0;
                HEAP32[tp + 4 >> 2] = now % 1e3 * 1e3 * 1e3 | 0;
                return 0
            }

            function _emscripten_memcpy_big(dest, src, num) {
                HEAPU8.copyWithin(dest, src, src + num)
            }

            function _emscripten_get_heap_size() {
                return HEAPU8.length
            }

            function emscripten_realloc_buffer(size) {
                try {
                    wasmMemory.grow(size - buffer.byteLength + 65535 >>> 16);
                    updateGlobalBufferAndViews(wasmMemory.buffer);
                    return 1
                } catch (e) {}
            }

            function _emscripten_resize_heap(requestedSize) {
                requestedSize = requestedSize >>> 0;
                var oldSize = _emscripten_get_heap_size();
                var maxHeapSize = 2147483648;
                if (requestedSize > maxHeapSize) {
                    return false
                }
                var minHeapSize = 16777216;
                for (var cutDown = 1; cutDown <= 4; cutDown *= 2) {
                    var overGrownHeapSize = oldSize * (1 + .2 / cutDown);
                    overGrownHeapSize = Math.min(overGrownHeapSize, requestedSize + 100663296);
                    var newSize = Math.min(maxHeapSize, alignUp(Math.max(minHeapSize, requestedSize, overGrownHeapSize), 65536));
                    var replacement = emscripten_realloc_buffer(newSize);
                    if (replacement) {
                        return true
                    }
                }
                return false
            }
            var SYSCALLS = {
                mappings: {},
                buffers: [null, [],
                    []
                ],
                printChar: function(stream, curr) {
                    var buffer = SYSCALLS.buffers[stream];
                    if (curr === 0 || curr === 10) {
                        (stream === 1 ? out : err)(UTF8ArrayToString(buffer, 0));
                        buffer.length = 0
                    } else {
                        buffer.push(curr)
                    }
                },
                varargs: undefined,
                get: function() {
                    SYSCALLS.varargs += 4;
                    var ret = HEAP32[SYSCALLS.varargs - 4 >> 2];
                    return ret
                },
                getStr: function(ptr) {
                    var ret = UTF8ToString(ptr);
                    return ret
                },
                get64: function(low, high) {
                    return low
                }
            };

            function _fd_close(fd) {
                return 0
            }

            function _fd_seek(fd, offset_low, offset_high, whence, newOffset) {}

            function _fd_write(fd, iov, iovcnt, pnum) {
                var num = 0;
                for (var i = 0; i < iovcnt; i++) {
                    var ptr = HEAP32[iov + i * 8 >> 2];
                    var len = HEAP32[iov + (i * 8 + 4) >> 2];
                    for (var j = 0; j < len; j++) {
                        SYSCALLS.printChar(fd, HEAPU8[ptr + j])
                    }
                    num += len
                }
                HEAP32[pnum >> 2] = num;
                return 0
            }

            function _setTempRet0($i) {
                setTempRet0($i | 0)
            }

            function _time(ptr) {
                var ret = Date.now() / 1e3 | 0;
                if (ptr) {
                    HEAP32[ptr >> 2] = ret
                }
                return ret
            }
            embind_init_charCodes();
            BindingError = Module["BindingError"] = extendError(Error, "BindingError");
            InternalError = Module["InternalError"] = extendError(Error, "InternalError");
            init_ClassHandle();
            init_RegisteredPointer();
            init_embind();
            UnboundTypeError = Module["UnboundTypeError"] = extendError(Error, "UnboundTypeError");
            init_emval();
            var ASSERTIONS = false;

            function intArrayToString(array) {
                var ret = [];
                for (var i = 0; i < array.length; i++) {
                    var chr = array[i];
                    if (chr > 255) {
                        if (ASSERTIONS) {
                            assert(false, "Character code " + chr + " (" + String.fromCharCode(chr) + ")  at offset " + i + " not in 0x00-0xFF.")
                        }
                        chr &= 255
                    }
                    ret.push(String.fromCharCode(chr))
                }
                return ret.join("")
            }
            var decodeBase64 = typeof atob === "function" ? atob : function(input) {
                var keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
                var output = "";
                var chr1, chr2, chr3;
                var enc1, enc2, enc3, enc4;
                var i = 0;
                input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
                do {
                    enc1 = keyStr.indexOf(input.charAt(i++));
                    enc2 = keyStr.indexOf(input.charAt(i++));
                    enc3 = keyStr.indexOf(input.charAt(i++));
                    enc4 = keyStr.indexOf(input.charAt(i++));
                    chr1 = enc1 << 2 | enc2 >> 4;
                    chr2 = (enc2 & 15) << 4 | enc3 >> 2;
                    chr3 = (enc3 & 3) << 6 | enc4;
                    output = output + String.fromCharCode(chr1);
                    if (enc3 !== 64) {
                        output = output + String.fromCharCode(chr2)
                    }
                    if (enc4 !== 64) {
                        output = output + String.fromCharCode(chr3)
                    }
                } while (i < input.length);
                return output
            };

            function intArrayFromBase64(s) {
                if (typeof ENVIRONMENT_IS_NODE === "boolean" && ENVIRONMENT_IS_NODE) {
                    var buf;
                    try {
                        buf = Buffer.from(s, "base64")
                    } catch (_) {
                        buf = new Buffer(s, "base64")
                    }
                    return new Uint8Array(buf["buffer"], buf["byteOffset"], buf["byteLength"])
                }
                try {
                    var decoded = decodeBase64(s);
                    var bytes = new Uint8Array(decoded.length);
                    for (var i = 0; i < decoded.length; ++i) {
                        bytes[i] = decoded.charCodeAt(i)
                    }
                    return bytes
                } catch (_) {
                    throw new Error("Converting base64 string to bytes failed.")
                }
            }

            function tryParseAsDataURI(filename) {
                if (!isDataURI(filename)) {
                    return
                }
                return intArrayFromBase64(filename.slice(dataURIPrefix.length))
            }
            var asmLibraryArg = {
                "y": ___asctime_r,
                "d": ___cxa_allocate_exception,
                "g": ___cxa_throw,
                "x": ___localtime_r,
                "C": __embind_register_bool,
                "A": __embind_register_class,
                "r": __embind_register_class_constructor,
                "f": __embind_register_class_property,
                "B": __embind_register_emval,
                "n": __embind_register_enum,
                "a": __embind_register_enum_value,
                "k": __embind_register_float,
                "e": __embind_register_function,
                "c": __embind_register_integer,
                "b": __embind_register_memory_view,
                "l": __embind_register_std_string,
                "h": __embind_register_std_wstring,
                "D": __embind_register_void,
                "o": __emval_decref,
                "p": __emval_incref,
                "q": __emval_take_value,
                "i": _abort,
                "w": _clock_gettime,
                "u": _emscripten_memcpy_big,
                "v": _emscripten_resize_heap,
                "z": _fd_close,
                "s": _fd_seek,
                "j": _fd_write,
                "t": _setTempRet0,
                "m": _time
            };
            var asm = createWasm();
            var ___wasm_call_ctors = Module["___wasm_call_ctors"] = function() {
                return (___wasm_call_ctors = Module["___wasm_call_ctors"] = Module["asm"]["G"]).apply(null, arguments)
            };
            var _malloc = Module["_malloc"] = function() {
                return (_malloc = Module["_malloc"] = Module["asm"]["H"]).apply(null, arguments)
            };
            var _free = Module["_free"] = function() {
                return (_free = Module["_free"] = Module["asm"]["I"]).apply(null, arguments)
            };
            var ___getTypeName = Module["___getTypeName"] = function() {
                return (___getTypeName = Module["___getTypeName"] = Module["asm"]["J"]).apply(null, arguments)
            };
            var ___embind_register_native_and_builtin_types = Module["___embind_register_native_and_builtin_types"] = function() {
                return (___embind_register_native_and_builtin_types = Module["___embind_register_native_and_builtin_types"] = Module["asm"]["K"]).apply(null, arguments)
            };
            var ___errno_location = Module["___errno_location"] = function() {
                return (___errno_location = Module["___errno_location"] = Module["asm"]["L"]).apply(null, arguments)
            };
            var __get_tzname = Module["__get_tzname"] = function() {
                return (__get_tzname = Module["__get_tzname"] = Module["asm"]["M"]).apply(null, arguments)
            };
            var __get_daylight = Module["__get_daylight"] = function() {
                return (__get_daylight = Module["__get_daylight"] = Module["asm"]["N"]).apply(null, arguments)
            };
            var __get_timezone = Module["__get_timezone"] = function() {
                return (__get_timezone = Module["__get_timezone"] = Module["asm"]["O"]).apply(null, arguments)
            };
            var dynCall_jiji = Module["dynCall_jiji"] = function() {
                return (dynCall_jiji = Module["dynCall_jiji"] = Module["asm"]["P"]).apply(null, arguments)
            };
            var calledRun;

            function ExitStatus(status) {
                this.name = "ExitStatus";
                this.message = "Program terminated with exit(" + status + ")";
                this.status = status
            }
            dependenciesFulfilled = function runCaller() {
                if (!calledRun) run();
                if (!calledRun) dependenciesFulfilled = runCaller
            };

            function run(args) {
                args = args || arguments_;
                if (runDependencies > 0) {
                    return
                }
                preRun();
                if (runDependencies > 0) return;

                function doRun() {
                    if (calledRun) return;
                    calledRun = true;
                    Module["calledRun"] = true;
                    if (ABORT) return;
                    initRuntime();
                    preMain();
                    readyPromiseResolve(Module);
                    if (Module["onRuntimeInitialized"]) Module["onRuntimeInitialized"]();
                    postRun()
                }
                if (Module["setStatus"]) {
                    Module["setStatus"]("Running...");
                    setTimeout(function() {
                        setTimeout(function() {
                            Module["setStatus"]("")
                        }, 1);
                        doRun()
                    }, 1)
                } else {
                    doRun()
                }
            }
            Module["run"] = run;
            if (Module["preInit"]) {
                if (typeof Module["preInit"] == "function") Module["preInit"] = [Module["preInit"]];
                while (Module["preInit"].length > 0) {
                    Module["preInit"].pop()()
                }
            }
            noExitRuntime = true;
            run();


            return ggwave_factory.ready
        }
    );
})();
if (typeof exports === 'object' && typeof module === 'object')
    module.exports = ggwave_factory;
else if (typeof define === 'function' && define['amd'])
    define([], function() {
        return ggwave_factory;
    });
else if (typeof exports === 'object')
    exports["ggwave_factory"] = ggwave_factory;
