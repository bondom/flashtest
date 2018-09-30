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

import {
  actions as asyncButtonWithoutMutatingDOMActions,
  initMarkups as asyncButtonWithoutMutatingDOMInitMarkups
} from './test-data/AsyncButtonMockedJsonResponseWithoutMutatingDOM-data';

import {
  actions as asyncButtonMockedImageResponseActions,
  initMarkups as asyncButtonMockedImageResponseInitMarkups
} from './test-data/AsyncButtonMockedImageResponse-data';

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

  test(`async button: request is sent when button is clicked, 
        (button isn't disabled while request is running, so no DOM is mutated when request is sent), 
        result of request changes DOM, 
        response is mocked with json`, async () => {
    const testGenerator = new PuppeteerTestGenerator({
      testName: 'AsyncButtonMockedJsonResponseWithoutMutatingDOM',
      addComments: true,
      mockApiResponses: true
    });
    testGenerator.collector.url =
      'http://localhost:8001/asyncButtonMockedJsonResponseWithoutMutatingDOM';
    testGenerator.collector.initialMarkup = asyncButtonWithoutMutatingDOMInitMarkups;
    testGenerator.collector.actions = asyncButtonWithoutMutatingDOMActions;

    const code = await testGenerator.transformDataAndGenerateCode();
    const asyncButtonWithoutMutatingDOMExpectedCode = await readTestContent(
      'mocked-api-responses/PuppeteerTestGenerator-AsyncButtonMockedJsonResponseWithoutMutatingDOM.unused.js'
    );
    expect(formatCode(code)).toEqual(formatCode(asyncButtonWithoutMutatingDOMExpectedCode));
  });

  test(`async button: request to get image is sent when button is clicked, 
        result of request changes src attribute of img, this change isn't checked in tests,
        because src value is base64(too long)`, async () => {
    const testGenerator = new PuppeteerTestGenerator({
      testName: 'AsyncButtonMockedImageResponse',
      addComments: true,
      mockApiResponses: true
    });
    testGenerator.collector.url = 'http://localhost:8001/asyncButtonMockedImageResponse';
    testGenerator.collector.initialMarkup = asyncButtonMockedImageResponseInitMarkups;
    testGenerator.collector.actions = asyncButtonMockedImageResponseActions;

    const code = await testGenerator.transformDataAndGenerateCode();
    const asyncButtonMockedImageResponseExpectedCode = await readTestContent(
      'mocked-api-responses/PuppeteerTestGenerator-AsyncButtonMockedImageResponse.unused.js'
    );
    expect(formatCode(code)).toEqual(formatCode(asyncButtonMockedImageResponseExpectedCode));
  });
});
