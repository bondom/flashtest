const timeout = 30000;

describe('AsyncButtonTwoRequestsOneByOne', () => {
  let page;
  beforeAll(async () => {
    const context = await browser.createIncognitoBrowserContext();
    page = await context.newPage();
    await page.goto('http://localhost:8001/asyncButtonTwoRequestsOneByOne');
  }, timeout);

  afterAll(async () => {
    await page.close();
  });

  it(
    'first test',
    async () => {
      expect(
        await page.$eval('[data-hook="async-button__first-request-result"]', el => el.outerHTML)
      ).toEqual('<div data-hook="async-button__first-request-result">First Request Result: </div>');

      expect(
        await page.$eval('[data-hook="async-button__second-request-result"]', el => el.outerHTML)
      ).toEqual(
        '<div data-hook="async-button__second-request-result">Second Request Result: </div>'
      );

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

        if (
          interceptedRequest.url() === 'http://localhost:3002/base64/200/SGVsbG8gV29ybGQ=' &&
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

        page.waitForRequest(
          request =>
            request.url() === 'http://localhost:3002/base64/200/SGVsbG8gV29ybGQ=' &&
            request.method() === 'GET'
        ),
        page.waitForResponse(
          response =>
            response.url() === 'http://localhost:3002/base64/200/SGVsbG8gV29ybGQ=' &&
            response.status() === 200
        ),

        await page.click('[data-hook="async-button__get-submit-btn"]')
      ]);

      page.removeListener('request', interceptRequestCallback1);
      await page.setRequestInterception(false);

      expect(
        await page.$eval('[data-hook="async-button__first-request-result"]', el => el.innerHTML)
      ).toEqual('First Request Result: HTTPBIN is awesome');
      expect(
        await page.$eval('[data-hook="async-button__get-submit-btn"]', el => el.disabled)
      ).toEqual(false);
      expect(
        await page.$eval('[data-hook="async-button__second-request-result"]', el => el.innerHTML)
      ).toEqual('Second Request Result: Hello World');
    },
    timeout
  );
});
