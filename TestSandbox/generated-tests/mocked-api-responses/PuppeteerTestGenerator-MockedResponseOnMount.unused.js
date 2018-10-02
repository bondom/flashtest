const timeout = 30000;

describe('MockedResponseOnMount', () => {
  let page;
  beforeAll(async () => {
    const context = await browser.createIncognitoBrowserContext();
    page = await context.newPage();

    // check DOM while requests are processing and mock api responses
    await page.setRequestInterception(true);
    const interceptRequestCallback1 = async interceptedRequest => {
      if (
        interceptedRequest.url() === 'http://localhost:3002/base64encode/100/Uasia' &&
        interceptedRequest.method() === 'GET'
      ) {
        interceptedRequest.respond({
          status: 200,
          headers: { 'Access-Control-Allow-Origin': '*' },
          contentType: 'text/html; charset=utf-8',
          body: 'VWFzaWE='
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

    page.removeListener('request', interceptRequestCallback1);
    await page.setRequestInterception(false);
  }, timeout);

  afterAll(async () => {
    await page.close();
  });

  it(
    'first test',
    async () => {
      // check mutations after response
      expect(await page.$('[data-hook="loader"]')).toEqual(null);
      expect(await page.$eval('[data-hook="result"]', el => el.outerHTML)).toEqual(
        '<div data-hook="result">Get Request Result: VWFzaWE=</div>'
      );
    },
    timeout
  );
});
