import { updateTestData } from '../testUtils';

const timeout = 30000;

describe('AsyncButton__TwoClicks', () => {
  let page;
  beforeAll(async () => {
    page = await global.browser.newPage();
    await page.goto('http://localhost:8001/asyncButton');
  }, timeout);

  afterAll(async () => {
    if (process.env.JEST_UPDATE_DATA_ENV) {
      await updateTestData(page, 'AsyncButton__TwoClicks');
    }
    await page.close();
  });

  it(
    'first test',
    async () => {
      expect(
        await page.$eval('[data-hook="async-button__get-request-result"]', el => el.outerHTML)
      ).toEqual('<div data-hook="async-button__get-request-result">Get Request Result: </div>');

      expect(
        await page.$eval('[data-hook="async-button__get-submit-btn"]', el => el.disabled)
      ).toEqual(false);

      await page.setRequestInterception(true);
      const interceptRequestCallback1 = async interceptedRequest => {
        if (
          interceptedRequest.url() ===
            'http://localhost:3002/base64/100/SFRUUEJJTiBpcyBhd2Vzb21l' &&
          interceptedRequest.method() === 'GET'
        ) {
          expect(
            await page.$eval('[data-hook="async-button__get-submit-btn"]', el => el.disabled)
          ).toEqual(true);
        }

        interceptedRequest.continue();
      };
      page.on('request', interceptRequestCallback1);
      await Promise.all([
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

      expect(
        await page.$eval('[data-hook="async-button__get-submit-btn"]', el => el.disabled)
      ).toEqual(false);
      expect(
        await page.$eval('[data-hook="async-button__get-request-result"]', el => el.innerHTML)
      ).toEqual('Get Request Result: HTTPBIN is awesome');

      await page.setRequestInterception(true);
      const interceptRequestCallback2 = async interceptedRequest => {
        if (
          interceptedRequest.url() ===
            'http://localhost:3002/base64/100/SFRUUEJJTiBpcyBhd2Vzb21l' &&
          interceptedRequest.method() === 'GET'
        ) {
          expect(
            await page.$eval('[data-hook="async-button__get-submit-btn"]', el => el.disabled)
          ).toEqual(true);
          expect(
            await page.$eval('[data-hook="async-button__get-request-result"]', el => el.innerHTML)
          ).toEqual('Get Request Result: ');
        }

        interceptedRequest.continue();
      };
      page.on('request', interceptRequestCallback2);
      await Promise.all([
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

      page.removeListener('request', interceptRequestCallback2);
      await page.setRequestInterception(false);

      expect(
        await page.$eval('[data-hook="async-button__get-submit-btn"]', el => el.disabled)
      ).toEqual(false);
      expect(
        await page.$eval('[data-hook="async-button__get-request-result"]', el => el.innerHTML)
      ).toEqual('Get Request Result: HTTPBIN is awesome');
    },
    timeout
  );
});
