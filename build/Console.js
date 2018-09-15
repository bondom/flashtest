"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable no-console*/
var Console = /** @class */ (function () {
    function Console() {
    }
    Console.log = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (!process.env.OFF_CONSOLE)
            console.log.apply(null, args);
    };
    Console.warn = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (!process.env.OFF_CONSOLE)
            console.warn.apply(null, args);
    };
    Console.error = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (!process.env.OFF_CONSOLE)
            console.error.apply(null, args);
    };
    Console.group = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (!process.env.OFF_CONSOLE)
            console.group.apply(null, args);
    };
    Console.groupEnd = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (!process.env.OFF_CONSOLE)
            console.groupEnd.apply(null, args);
    };
    return Console;
}());
exports.default = Console;
