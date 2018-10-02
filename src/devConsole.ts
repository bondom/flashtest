/* eslint-disable no-console*/
export default class devConsole {
  static log(...args: any[]) {
    if (!process.env.OFF_CONSOLE) console.log.apply(null, args);
  }

  static warn(...args: any[]) {
    if (!process.env.OFF_CONSOLE) console.warn.apply(null, args);
  }

  static error(...args: any[]) {
    if (!process.env.OFF_CONSOLE) console.error.apply(null, args);
  }

  static group(...args: any[]) {
    if (!process.env.OFF_CONSOLE) console.group.apply(null, args);
  }
  static groupEnd(...args: any[]) {
    if (!process.env.OFF_CONSOLE) console.groupEnd.apply(null, args);
  }
}
