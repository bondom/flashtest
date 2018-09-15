const timeout = 30000;

describe('AsyncRequestOnMount', () => {
  let page;
  beforeAll(async () => {
    page = await global.browser.newPage();

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

      await page.goto('http://localhost:8001/asyncRequestOnMount')
    ]);
  }, timeout);

  afterAll(async () => {
    await page.close();
  });

  it(
    'first test',
    async () => {
      expect(await page.$('[data-hook="loader"]')).toEqual(null);
      expect(await page.$eval('[data-hook="result"]', el => el.outerHTML)).toEqual(
        '<div data-hook="result">Get Request Result: VWFzaWE=</div>'
      );
    },
    timeout
  );
});
