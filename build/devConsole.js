"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable no-console*/
var devConsole = /** @class */ (function () {
    function devConsole() {
    }
    devConsole.log = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (!process.env.OFF_CONSOLE)
            console.log.apply(null, args);
    };
    devConsole.warn = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (!process.env.OFF_CONSOLE)
            console.warn.apply(null, args);
    };
    devConsole.error = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (!process.env.OFF_CONSOLE)
            console.error.apply(null, args);
    };
    devConsole.group = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (!process.env.OFF_CONSOLE)
            console.group.apply(null, args);
    };
    devConsole.groupEnd = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (!process.env.OFF_CONSOLE)
            console.groupEnd.apply(null, args);
    };
    return devConsole;
}());
exports.default = devConsole;
