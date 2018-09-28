import * as fs from 'fs';
import * as path from 'path';
import * as puppeteer from 'puppeteer';
import * as format from 'prettier-eslint';
import * as util from 'util';

const readFile = util.promisify(fs.readFile);

export async function readTestContent(fileName: string) {
  return await readFile(path.resolve(__dirname, '../', `components/${fileName}`), {
    encoding: 'utf-8'
  });
}

export async function updateTestData(page: puppeteer.Page, testName: string): Promise<any> {
  await page.click('[data-flashtest-hook="___FLASHTEST-FINISH-BUTTON"]');
  // @ts-ignore
  const initialMarkup = await page.evaluate(() => window.INITIAL_MARKUP);
  // @ts-ignore
  const actions = await page.evaluate(() => window.ACTIONS);
  const filePath = path.resolve(__dirname, '../', `test-data/${testName}-data.js`);
  const code = `
    export const initMarkups = ${JSON.stringify(initialMarkup)};\n

    export const actions = ${JSON.stringify(actions)}
  
  `;
  return new Promise(resolve => {
    fs.writeFile(filePath, format({ text: code }), err => {
      if (err) throw err;
      resolve();
    });
  });
}

// Format code with prettier-eslint and additionally make sure
// that only one blank line is presented between rows(prettier-eslint doesn't handle this case)
// It is needed to be able to see detailed difference between generated and expected codes
export function formatCode(code: string) {
  return format({ text: code }).replace(/[\r\n](?=[\r\n]+)/g, '');
}
