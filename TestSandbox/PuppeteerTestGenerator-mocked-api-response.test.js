/* eslint-disable no-console */
import PuppeteerTestGenerator from '../src/client/PuppeteerTestGenerator';
import { readTestContent, formatCode } from './testUtils';

import {
  actions as asyncButtonActions,
  initMarkups as asyncButtonInitMarkups
} from './test-data/AsyncButtonMocked-data';

import {
  actions as asyncButtonJsonResponseActions,
  initMarkups as asyncButtonJsonResponseInitMarkups
} from './test-data/AsyncButtonMockedJsonResponse-data';

describe('PuppeteerTestGenerator.transformDataAndGenerateCode: mocked api responses', () => {
  test(`async button: request is sent when button is clicked
        (button is disabled while request is running), 
        result of request changes DOM, 
        response is mocked with text`, async () => {
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

  test(`async button: request is sent when button is clicked, 
        (button is disabled while request is running), 
        result of request changes DOM, 
        response is mocked with json`, async () => {
    const testGenerator = new PuppeteerTestGenerator({
      testName: 'AsyncButtonMockedJsonResponse',
      addComments: true,
      mockApiResponses: true
    });
    testGenerator.collector.url = 'http://localhost:8001/asyncButtonMockedJsonResponse';
    testGenerator.collector.initialMarkup = asyncButtonJsonResponseInitMarkups;
    testGenerator.collector.actions = asyncButtonJsonResponseActions;

    const code = await testGenerator.transformDataAndGenerateCode();
    const asyncButtonJsonResponseExpectedCode = await readTestContent(
      'mocked-api-responses/PuppeteerTestGenerator-AsyncButtonMockedJsonResponse.unused.js'
    );
    expect(formatCode(code)).toEqual(formatCode(asyncButtonJsonResponseExpectedCode));
  });
});
