import { updateTestData } from '../testUtils';

const timeout = 30000;

describe('AsyncForm', () => {
  let page;
  beforeAll(async () => {
    page = await global.browser.newPage();
    await page.goto('http://localhost:8001/asyncForm');
  }, timeout);

  afterAll(async () => {
    if (process.env.JEST_UPDATE_DATA_ENV) {
      await updateTestData(page, 'AsyncForm');
    }
    await page.close();
  });

  it(
    'first test',
    async () => {
      expect(
        await page.$eval('[data-hook="async-button__request-status-code"]', el => el.outerHTML)
      ).toEqual('<div data-hook="async-button__request-status-code">Res: </div>');

      expect(
        await page.$eval('[data-hook="async-button__get-request-result"]', el => el.outerHTML)
      ).toEqual('<div data-hook="async-button__get-request-result">Get Request Result: </div>');

      await page.click('[data-hook="async-button-input"]');

      expect(await page.$eval('[data-hook="async-button-input"]', el => el.value)).toEqual('');

      await page.type('[data-hook="async-button-input"]', 'Uasia');

      expect(await page.$eval('[data-hook="async-button-input"]', el => el.value)).toEqual('Uasia');

      expect(
        await page.$eval('[data-hook="async-button__get-submit-btn"]', el => el.disabled)
      ).toEqual(false);

      await page.setRequestInterception(true);
      const interceptRequestCallback1 = async interceptedRequest => {
        if (
          interceptedRequest.url() === 'http://localhost:3002/base64encode/100/Uasia' &&
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
            request.url() === 'http://localhost:3002/base64encode/100/Uasia' &&
            request.method() === 'GET'
        ),
        page.waitForResponse(
          response =>
            response.url() === 'http://localhost:3002/base64encode/100/Uasia' &&
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
        await page.$eval('[data-hook="async-button__request-status-code"]', el => el.innerHTML)
      ).toEqual('Res: 200');
      expect(
        await page.$eval('[data-hook="async-button__get-request-result"]', el => el.innerHTML)
      ).toEqual('Get Request Result: VWFzaWE=');

      expect(
        await page.$eval('[data-hook="async-button__post-submit-btn"]', el => el.disabled)
      ).toEqual(false);

      await page.setRequestInterception(true);
      const interceptRequestCallback2 = async interceptedRequest => {
        if (
          interceptedRequest.url() === 'http://localhost:3002/status/0/200' &&
          interceptedRequest.method() === 'POST'
        ) {
          expect(
            await page.$eval('[data-hook="async-button__post-submit-btn"]', el => el.disabled)
          ).toEqual(true);
          expect(
            await page.$eval('[data-hook="async-button__request-status-code"]', el => el.innerHTML)
          ).toEqual('Res: ');
        }

        interceptedRequest.continue();
      };
      page.on('request', interceptRequestCallback2);
      await Promise.all([
        page.waitForRequest(
          request =>
            request.url() === 'http://localhost:3002/status/0/200' && request.method() === 'POST'
        ),
        page.waitForResponse(
          response =>
            response.url() === 'http://localhost:3002/status/0/200' && response.status() === 200
        ),

        await page.click('[data-hook="async-button__post-submit-btn"]')
      ]);

      page.removeListener('request', interceptRequestCallback2);
      await page.setRequestInterception(false);

      expect(
        await page.$eval('[data-hook="async-button__post-submit-btn"]', el => el.disabled)
      ).toEqual(false);
      expect(
        await page.$eval('[data-hook="async-button__request-status-code"]', el => el.innerHTML)
      ).toEqual('Res: 200');
    },
    timeout
  );
});
