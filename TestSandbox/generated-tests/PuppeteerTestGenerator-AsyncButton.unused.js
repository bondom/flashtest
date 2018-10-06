import assert from 'assert';
const timeout = 30000;

describe('AsyncButton', () => {
  let page;
  beforeAll(async () => {
    const context = await browser.createIncognitoBrowserContext();
    page = await context.newPage();
    await page.goto('http://localhost:8001/asyncButton');
  }, timeout);

  afterAll(async () => {
    await page.close();
  });

  it(
    'first test',
    async () => {
      // check initial outerHTML of elements
      expect(
        await page.$eval('[data-hook="async-button__get-request-result"]', el => el.outerHTML)
      ).toEqual('<div data-hook="async-button__get-request-result">Get Request Result: </div>');

      // check attributes before 'click' on '[data-hook="async-button__get-submit-btn"]' element
      expect(
        await page.$eval('[data-hook="async-button__get-submit-btn"]', el => el.disabled)
      ).toEqual(false);

      // check DOM while requests are processing
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

      // trigger user action and wait for right request and response
      await Promise.all([
        page.waitForRequest(
          request =>
            request.url() === 'http://localhost:3002/base64/100/SFRUUEJJTiBpcyBhd2Vzb21l' &&
            request.method() === 'GET'
        ),
        page.waitForResponse(response => {
          const url = response.url();
          const method = response.request().method();
          if (
            url === 'http://localhost:3002/base64/100/SFRUUEJJTiBpcyBhd2Vzb21l' &&
            method === 'GET'
          ) {
            const actualResponseStatus = response.status();
            assert.strictEqual(
              actualResponseStatus,
              200,
              `Response status of '${method} ${url}' should be 200, but it is ${actualResponseStatus}`
            );
            return true;
          }
          return false;
        }),

        await page.click('[data-hook="async-button__get-submit-btn"]')
      ]);

      page.removeListener('request', interceptRequestCallback1);
      await page.setRequestInterception(false);

      // check mutations after response
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
