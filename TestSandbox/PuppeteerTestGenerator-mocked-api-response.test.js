/* eslint-disable no-console */
import PuppeteerTestGenerator from '../src/client/PuppeteerTestGenerator';
import { readTestContent, formatCode } from './testUtils';

import {
  actions as asyncButtonActions,
  initMarkups as asyncButtonInitMarkups
} from './test-data/AsyncButtonMocked-data';

describe('PuppeteerTestGenerator.transformDataAndGenerateCode: mocked api responses', () => {
  test('async button: request is sent when button is clicked, result of request changes DOM', async () => {
    const testGenerator = new PuppeteerTestGenerator({
      testName: 'AsyncButtonMocked',
      addComments: true,
      mockApiResponses: true
    });
    testGenerator.collector.url = 'http://localhost:8001/asyncButton';
    testGenerator.collector.initialMarkup = asyncButtonInitMarkups;
    testGenerator.collector.actions = asyncButtonActions;

    const code = await testGenerator.transformDataAndGenerateCode();
    const asyncButtonExpectedCode = await readTestContent(
      'mocked-api-responses/PuppeteerTestGenerator-AsyncButtonMocked.unused.js'
    );
    expect(formatCode(code)).toEqual(formatCode(asyncButtonExpectedCode));
  });
});
