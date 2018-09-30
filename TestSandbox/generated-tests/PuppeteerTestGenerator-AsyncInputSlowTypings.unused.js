const timeout = 30000;

describe('AsyncInputSlowTypings', () => {
  let page;
  beforeAll(async () => {
    page = await global.browser.newPage();
    await page.goto('http://localhost:8001/asyncInput');
  }, timeout);

  afterAll(async () => {
    await page.close();
  });

  it(
    'first test',
    async () => {
      // check initial outerHTML of elements
      expect(await page.$eval('[data-hook="async-input__result"]', el => el.outerHTML)).toEqual(
        '<div data-hook="async-input__result">Get Request Result: </div>'
      );

      // user action(this action caused no changes)
      await page.click('[data-hook="async-input__input"]');

      // trigger user action and wait for right request and response
      await Promise.all([
        page.waitForRequest(
          request =>
            request.url() === 'http://localhost:3002/toUpperCase/20/p' && request.method() === 'GET'
        ),
        page.waitForResponse(
          response =>
            response.url() === 'http://localhost:3002/toUpperCase/20/p' && response.status() === 200
        ),

        await page.type('[data-hook="async-input__input"]', 'p')
      ]);
      expect(await page.$eval('[data-hook="async-input__result"]', el => el.innerHTML)).toEqual(
        'Get Request Result: P'
      );

      // check DOM while requests are processing
      await page.setRequestInterception(true);
      const interceptRequestCallback2 = async interceptedRequest => {
        if (
          interceptedRequest.url() === 'http://localhost:3002/toUpperCase/20/pa' &&
          interceptedRequest.method() === 'GET'
        ) {
          expect(await page.$eval('[data-hook="async-input__result"]', el => el.innerHTML)).toEqual(
            'Get Request Result: '
          );
        }

        interceptedRequest.continue();
      };
      page.on('request', interceptRequestCallback2);

      // trigger user action and wait for right request and response
      await Promise.all([
        page.waitForRequest(
          request =>
            request.url() === 'http://localhost:3002/toUpperCase/20/pa' &&
            request.method() === 'GET'
        ),
        page.waitForResponse(
          response =>
            response.url() === 'http://localhost:3002/toUpperCase/20/pa' &&
            response.status() === 200
        ),

        await page.type('[data-hook="async-input__input"]', 'a')
      ]);

      page.removeListener('request', interceptRequestCallback2);
      await page.setRequestInterception(false);

      expect(await page.$eval('[data-hook="async-input__result"]', el => el.innerHTML)).toEqual(
        'Get Request Result: PA'
      );

      // check DOM while requests are processing
      await page.setRequestInterception(true);
      const interceptRequestCallback3 = async interceptedRequest => {
        if (
          interceptedRequest.url() === 'http://localhost:3002/toUpperCase/20/pas' &&
          interceptedRequest.method() === 'GET'
        ) {
          expect(await page.$eval('[data-hook="async-input__result"]', el => el.innerHTML)).toEqual(
            'Get Request Result: '
          );
        }

        interceptedRequest.continue();
      };
      page.on('request', interceptRequestCallback3);

      // trigger user action and wait for right request and response
      await Promise.all([
        page.waitForRequest(
          request =>
            request.url() === 'http://localhost:3002/toUpperCase/20/pas' &&
            request.method() === 'GET'
        ),
        page.waitForResponse(
          response =>
            response.url() === 'http://localhost:3002/toUpperCase/20/pas' &&
            response.status() === 200
        ),

        await page.type('[data-hook="async-input__input"]', 's')
      ]);

      page.removeListener('request', interceptRequestCallback3);
      await page.setRequestInterception(false);

      expect(await page.$eval('[data-hook="async-input__result"]', el => el.innerHTML)).toEqual(
        'Get Request Result: PAS'
      );

      // check DOM while requests are processing
      await page.setRequestInterception(true);
      const interceptRequestCallback4 = async interceptedRequest => {
        if (
          interceptedRequest.url() === 'http://localhost:3002/toUpperCase/20/pass' &&
          interceptedRequest.method() === 'GET'
        ) {
          expect(await page.$eval('[data-hook="async-input__result"]', el => el.innerHTML)).toEqual(
            'Get Request Result: '
          );
        }

        interceptedRequest.continue();
      };
      page.on('request', interceptRequestCallback4);

      // trigger user action and wait for right request and response
      await Promise.all([
        page.waitForRequest(
          request =>
            request.url() === 'http://localhost:3002/toUpperCase/20/pass' &&
            request.method() === 'GET'
        ),
        page.waitForResponse(
          response =>
            response.url() === 'http://localhost:3002/toUpperCase/20/pass' &&
            response.status() === 200
        ),

        await page.type('[data-hook="async-input__input"]', 's')
      ]);

      page.removeListener('request', interceptRequestCallback4);
      await page.setRequestInterception(false);

      expect(await page.$eval('[data-hook="async-input__result"]', el => el.innerHTML)).toEqual(
        'Get Request Result: PASS'
      );
    },
    timeout
  );
});
