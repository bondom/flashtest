import * as fs from 'node-fs-extra';
import devConsole from '../devConsole';
import * as format from 'prettier-eslint';

import * as appRootPath from 'app-root-path';

export async function save(
  fileName: string,
  code: string,
  testsFolder: string = '/'
): Promise<any> {
  const filePath = appRootPath + '/' + testsFolder + '/' + fileName + '.spec.generated.js';
  devConsole.log('File path: \n', filePath);
  try {
    fs.outputFileSync(filePath, format({ text: code }));
    return Promise.resolve();
  } catch (e) {
    /* eslint-disable no-console */
    console.error('Problem with saving body request to file: ', e);
    /* eslint-enable no-console */
    return Promise.reject(e);
  }
}
