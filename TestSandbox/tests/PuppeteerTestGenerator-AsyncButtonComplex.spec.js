import { updateTestData } from '../testUtils';

const timeout = 30000;

describe('AsyncButtonComplex', () => {
  let page;
  beforeAll(async () => {
    page = await global.browser.newPage();
    await page.goto('http://localhost:8001/asyncButtonComplex');
  }, timeout);

  afterAll(async () => {
    if (process.env.JEST_UPDATE_DATA_ENV) {
      await updateTestData(page, 'AsyncButtonComplex');
    }
    await page.close();
  });

  it(
    'first test',
    async () => {
      expect(await page.$eval('[data-hook="focus-result"]', el => el.outerHTML)).toEqual(
        '<span data-hook="focus-result">Focus triggered on button: false</span>'
      );

      expect(await page.$eval('[data-hook="mouseup-result"]', el => el.outerHTML)).toEqual(
        '<span data-hook="mouseup-result">Mouseup triggered on button: false</span>'
      );

      expect(await page.$eval('[data-hook="click-result"]', el => el.outerHTML)).toEqual(
        '<span data-hook="click-result">Click triggered on button: false</span>'
      );

      expect(
        await page.$eval('[data-hook="mousedown-request-result"]', el => el.outerHTML)
      ).toEqual('<span data-hook="mousedown-request-result">Mousedown request result: </span>');

      expect(await page.$eval('[data-hook="click-request-result"]', el => el.outerHTML)).toEqual(
        '<span data-hook="click-request-result">Click request result:</span>'
      );

      expect(await page.$eval('[data-hook="button"]', el => el.disabled)).toEqual(false);

      await page.setRequestInterception(true);
      const interceptRequestCallback1 = async interceptedRequest => {
        if (
          interceptedRequest.url() === 'http://localhost:3002/toUpperCase/200/mousedownresult' &&
          interceptedRequest.method() === 'GET'
        ) {
          expect(await page.$eval('[data-hook="mouseup-result"]', el => el.innerHTML)).toEqual(
            'Mouseup triggered on button: true'
          );
          expect(await page.$eval('[data-hook="button"]', el => el.disabled)).toEqual(true);
          expect(await page.$eval('[data-hook="focus-result"]', el => el.innerHTML)).toEqual(
            'Focus triggered on button: true'
          );
          expect(await page.$eval('[data-hook="click-result"]', el => el.innerHTML)).toEqual(
            'Click triggered on button: true'
          );
        }

        if (
          interceptedRequest.url() === 'http://localhost:3002/toUpperCase/100/clickresult' &&
          interceptedRequest.method() === 'GET'
        ) {
          expect(await page.$eval('[data-hook="mouseup-result"]', el => el.innerHTML)).toEqual(
            'Mouseup triggered on button: true'
          );
          expect(await page.$eval('[data-hook="button"]', el => el.disabled)).toEqual(true);
          expect(await page.$eval('[data-hook="focus-result"]', el => el.innerHTML)).toEqual(
            'Focus triggered on button: true'
          );
          expect(await page.$eval('[data-hook="click-result"]', el => el.innerHTML)).toEqual(
            'Click triggered on button: true'
          );
        }

        interceptedRequest.continue();
      };
      page.on('request', interceptRequestCallback1);

      await Promise.all([
        page.waitForRequest(
          request =>
            request.url() === 'http://localhost:3002/toUpperCase/200/mousedownresult' &&
            request.method() === 'GET'
        ),
        page.waitForResponse(
          response =>
            response.url() === 'http://localhost:3002/toUpperCase/200/mousedownresult' &&
            response.status() === 200
        ),

        page.waitForRequest(
          request =>
            request.url() === 'http://localhost:3002/toUpperCase/100/clickresult' &&
            request.method() === 'GET'
        ),
        page.waitForResponse(
          response =>
            response.url() === 'http://localhost:3002/toUpperCase/100/clickresult' &&
            response.status() === 200
        ),

        await page.click('[data-hook="button"]')
      ]);

      page.removeListener('request', interceptRequestCallback1);
      await page.setRequestInterception(false);

      expect(await page.$eval('[data-hook="button"]', el => el.disabled)).toEqual(false);
      expect(await page.$eval('[data-hook="click-request-result"]', el => el.innerHTML)).toEqual(
        'Click request result:CLICKRESULT'
      );
      expect(
        await page.$eval('[data-hook="mousedown-request-result"]', el => el.innerHTML)
      ).toEqual('Mousedown request result: MOUSEDOWNRESULT');
    },
    timeout
  );
});
