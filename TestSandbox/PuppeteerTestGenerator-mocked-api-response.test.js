/* eslint-disable no-console */
import PuppeteerTestGenerator from '../src/client/PuppeteerTestGenerator';
import { readTestContent, formatCode } from './testUtils';

import {
  actions as mockedTextActions,
  initMarkups as mockedTextInitiMarkups
} from './test-data/AsyncButtonMocked-data';

import {
  actions as mockedJsonResponseActions,
  initMarkups as mockedJsonResponseInitMarkups
} from './test-data/MockedJsonResponse-data';

import {
  actions as mockedWithoutMutatingDOMActions,
  initMarkups as mockedWithoutMutatingDOMInitMarkups
} from './test-data/MockedJsonResponseWithoutMutatingDOM-data';

import {
  actions as mockedImageResponseActions,
  initMarkups as mockedImageResponseInitMarkups
} from './test-data/MockedImageResponse-data';

import {
  actions as mockedAllResponsesSimultaneouslyActions,
  initMarkups as mockedAllResponsesSimultaneouslyInitMarkups
} from './test-data/MockedAllResponsesSimultaneously-data';

describe('PuppeteerTestGenerator.transformDataAndGenerateCode: mocked api responses', () => {
  test(`request is sent when button is clicked
        (button is disabled while request is running), 
        result of request changes DOM, 
        response is mocked with text`, async () => {
    const testGenerator = new PuppeteerTestGenerator({
      testName: 'AsyncButtonMocked',
      addComments: true,
      mockApiResponses: true
    });
    testGenerator.collector.url = 'http://localhost:8001/asyncButton';
    testGenerator.collector.initialMarkup = mockedTextInitiMarkups;
    testGenerator.collector.actions = mockedTextActions;

    const code = await testGenerator.transformDataAndGenerateCode();
    const asyncButtonExpectedCode = await readTestContent(
      'mocked-api-responses/PuppeteerTestGenerator-MockedTextResponse.unused.js'
    );
    expect(formatCode(code)).toEqual(formatCode(asyncButtonExpectedCode));
  });

  test(`request is sent when button is clicked, 
        (button is disabled while request is running), 
        result of request changes DOM, 
        response is mocked with json`, async () => {
    const testGenerator = new PuppeteerTestGenerator({
      testName: 'MockedJsonResponse',
      addComments: true,
      mockApiResponses: true
    });
    testGenerator.collector.url = 'http://localhost:8001/mockedJsonResponse';
    testGenerator.collector.initialMarkup = mockedJsonResponseInitMarkups;
    testGenerator.collector.actions = mockedJsonResponseActions;

    const code = await testGenerator.transformDataAndGenerateCode();
    const asyncButtonJsonResponseExpectedCode = await readTestContent(
      'mocked-api-responses/PuppeteerTestGenerator-MockedJsonResponse.unused.js'
    );
    expect(formatCode(code)).toEqual(formatCode(asyncButtonJsonResponseExpectedCode));
  });

  test(`request is sent when button is clicked, 
        (button isn't disabled while request is running, so no DOM is mutated when request is sent), 
        result of request changes DOM, 
        response is mocked with json`, async () => {
    const testGenerator = new PuppeteerTestGenerator({
      testName: 'MockedJsonResponseWithoutMutatingDOM',
      addComments: true,
      mockApiResponses: true
    });
    testGenerator.collector.url = 'http://localhost:8001/mockedJsonResponseWithoutMutatingDOM';
    testGenerator.collector.initialMarkup = mockedWithoutMutatingDOMInitMarkups;
    testGenerator.collector.actions = mockedWithoutMutatingDOMActions;

    const code = await testGenerator.transformDataAndGenerateCode();
    const asyncButtonWithoutMutatingDOMExpectedCode = await readTestContent(
      'mocked-api-responses/PuppeteerTestGenerator-MockedJsonResponseWithoutMutatingDOM.unused.js'
    );
    expect(formatCode(code)).toEqual(formatCode(asyncButtonWithoutMutatingDOMExpectedCode));
  });

  test(`request to get image is sent when button is clicked, 
        result of request changes src attribute of img, this change isn't checked in tests,
        because src value is base64(too long),
        response is mocked with image content(array buffer)`, async () => {
    const testGenerator = new PuppeteerTestGenerator({
      testName: 'MockedImageResponse',
      addComments: true,
      mockApiResponses: true
    });
    testGenerator.collector.url = 'http://localhost:8001/mockedImageResponse';
    testGenerator.collector.initialMarkup = mockedImageResponseInitMarkups;
    testGenerator.collector.actions = mockedImageResponseActions;

    const code = await testGenerator.transformDataAndGenerateCode();
    const asyncButtonMockedImageResponseExpectedCode = await readTestContent(
      'mocked-api-responses/PuppeteerTestGenerator-MockedImageResponse.unused.js'
    );
    expect(formatCode(code)).toEqual(formatCode(asyncButtonMockedImageResponseExpectedCode));
  });

  test(`3 requests are sent when button is clicked(image, text, json), all 3 responses are mocked`, async () => {
    const testGenerator = new PuppeteerTestGenerator({
      testName: 'MockedAllResponsesSimultaneously',
      addComments: true,
      mockApiResponses: true
    });
    testGenerator.collector.url = 'http://localhost:8001/mockedAllResponsesSimultaneously';
    testGenerator.collector.initialMarkup = mockedAllResponsesSimultaneouslyInitMarkups;
    testGenerator.collector.actions = mockedAllResponsesSimultaneouslyActions;

    const code = await testGenerator.transformDataAndGenerateCode();
    const mockedAllResponsesSimultaneouslyExpectedCode = await readTestContent(
      'mocked-api-responses/PuppeteerTestGenerator-MockedAllResponsesSimultaneously.unused.js'
    );
    expect(formatCode(code)).toEqual(formatCode(mockedAllResponsesSimultaneouslyExpectedCode));
  });
});
