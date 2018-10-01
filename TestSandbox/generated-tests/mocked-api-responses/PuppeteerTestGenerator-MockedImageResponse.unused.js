const timeout = 30000;

describe('MockedImageResponse', () => {
  let page;
  beforeAll(async () => {
    page = await global.browser.newPage();
    await page.goto('http://localhost:8001/mockedImageResponse');
  }, timeout);

  afterAll(async () => {
    await page.close();
  });

  it(
    'first test',
    async () => {
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

        await page.click('[data-hook="async-button__get-submit-btn"]')
      ]);

      page.removeListener('request', interceptRequestCallback1);
      await page.setRequestInterception(false);

      // check mutations after response
      expect(
        await page.$eval('[data-hook="async-button__get-submit-btn"]', el => el.disabled)
      ).toEqual(false);
    },
    timeout
  );
});
