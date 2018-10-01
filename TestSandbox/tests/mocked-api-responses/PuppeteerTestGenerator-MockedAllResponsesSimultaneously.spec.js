import { updateTestData } from '../../testUtils';

const timeout = 30000;

describe('MockedAllResponsesSimultaneously', () => {
  let page;
  beforeAll(async () => {
    page = await global.browser.newPage();
    await page.goto('http://localhost:8001/mockedAllResponsesSimultaneously');
  }, timeout);

  afterAll(async () => {
    if (process.env.JEST_UPDATE_DATA_ENV) {
      await updateTestData(page, 'MockedAllResponsesSimultaneously');
    }
    await page.close();
  });

  it(
    'first test',
    async () => {
      // check initial outerHTML of elements
      expect(
        await page.$eval('[data-hook="async-button__text-result"]', el => el.outerHTML)
      ).toEqual('<div data-hook="async-button__text-result">Text Request Result: </div>');

      expect(
        await page.$eval('[data-hook="async-button__json-result"]', el => el.outerHTML)
      ).toEqual('<div data-hook="async-button__json-result">JSON Request Result: </div>');

      // check attributes before 'click' on '[data-hook="async-button__get-submit-btn"]' element
      expect(
        await page.$eval('[data-hook="async-button__get-submit-btn"]', el => el.disabled)
      ).toEqual(false);

      // check DOM while requests are processing and mock api responses
      await page.setRequestInterception(true);
      const interceptRequestCallback1 = async interceptedRequest => {
        if (
          interceptedRequest.url() === 'http://localhost:3002/files/dog.jpg' &&
          interceptedRequest.method() === 'GET'
        ) {
          expect(
            await page.$eval('[data-hook="async-button__get-submit-btn"]', el => el.disabled)
          ).toEqual(true);
        }

        if (
          interceptedRequest.url() === 'http://localhost:3002/wrapIntoObject/100/sometext' &&
          interceptedRequest.method() === 'GET'
        ) {
          expect(
            await page.$eval('[data-hook="async-button__get-submit-btn"]', el => el.disabled)
          ).toEqual(true);

          interceptedRequest.respond({
            status: 200,
            headers: { 'Access-Control-Allow-Origin': '*' },
            contentType: 'application/json; charset=utf-8',
            body: '{"wrappedArg":"sometext"}'
          });
          return;
        }

        if (
          interceptedRequest.url() ===
            'http://localhost:3002/base64/100/SFRUUEJJTiBpcyBhd2Vzb21l' &&
          interceptedRequest.method() === 'GET'
        ) {
          expect(
            await page.$eval('[data-hook="async-button__get-submit-btn"]', el => el.disabled)
          ).toEqual(true);

          interceptedRequest.respond({
            status: 200,
            headers: { 'Access-Control-Allow-Origin': '*' },
            contentType: 'application/octet-stream',
            body: 'HTTPBIN is awesome'
          });
          return;
        }

        interceptedRequest.continue();
      };
      page.on('request', interceptRequestCallback1);

      // trigger user action and wait for right request and response
      await Promise.all([
        page.waitForRequest(
          request =>
            request.url() === 'http://localhost:3002/files/dog.jpg' && request.method() === 'GET'
        ),
        page.waitForResponse(
          response =>
            response.url() === 'http://localhost:3002/files/dog.jpg' && response.status() === 200
        ),

        page.waitForRequest(
          request =>
            request.url() === 'http://localhost:3002/wrapIntoObject/100/sometext' &&
            request.method() === 'GET'
        ),
        page.waitForResponse(
          response =>
            response.url() === 'http://localhost:3002/wrapIntoObject/100/sometext' &&
            response.status() === 200
        ),

        page.waitForRequest(
          request =>
            request.url() === 'http://localhost:3002/base64/100/SFRUUEJJTiBpcyBhd2Vzb21l' &&
            request.method() === 'GET'
        ),
        page.waitForResponse(
          response =>
            response.url() === 'http://localhost:3002/base64/100/SFRUUEJJTiBpcyBhd2Vzb21l' &&
            response.status() === 200
        ),

        await page.click('[data-hook="async-button__get-submit-btn"]')
      ]);

      page.removeListener('request', interceptRequestCallback1);
      await page.setRequestInterception(false);

      // check mutations after response
      expect(
        await page.$eval('[data-hook="async-button__get-submit-btn"]', el => el.disabled)
      ).toEqual(false);
      expect(
        await page.$eval('[data-hook="async-button__text-result"]', el => el.innerHTML)
      ).toEqual('Text Request Result: HTTPBIN is awesome');
      expect(
        await page.$eval('[data-hook="async-button__json-result"]', el => el.innerHTML)
      ).toEqual('JSON Request Result: sometext');
    },
    timeout
  );
});
