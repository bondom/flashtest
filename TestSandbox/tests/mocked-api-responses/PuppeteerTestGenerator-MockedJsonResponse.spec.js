import { updateTestData } from '../../testUtils';

const timeout = 30000;

describe('MockedJsonResponse', () => {
  let page;
  beforeAll(async () => {
    page = await global.browser.newPage();
    await page.goto('http://localhost:8001/mockedJsonResponse');
  }, timeout);

  afterAll(async () => {
    if (process.env.JEST_UPDATE_DATA_ENV) {
      await updateTestData(page, 'MockedJsonResponse');
    }
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

      // check DOM while requests are processing and mock api responses
      await page.setRequestInterception(true);
      const interceptRequestCallback1 = async interceptedRequest => {
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

        interceptedRequest.continue();
      };
      page.on('request', interceptRequestCallback1);

      // trigger user action and wait for right request and response
      await Promise.all([
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
      ).toEqual('Get Request Result: sometext');
    },
    timeout
  );
});
