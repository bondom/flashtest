import { updateTestData } from '../testUtils';

const timeout = 30000;

describe('AsyncKeydown', () => {
  let page;
  beforeAll(async () => {
    const context = await browser.createIncognitoBrowserContext();
    page = await context.newPage();
    await page.goto('http://localhost:8001/asyncKeydown');
  }, timeout);

  afterAll(async () => {
    if (process.env.JEST_UPDATE_DATA_ENV) {
      await updateTestData(page, 'AsyncKeydown');
    }
    await page.close();
  });

  it(
    'first test',
    async () => {
      expect(await page.$eval('[data-hook="async-input__result"]', el => el.outerHTML)).toEqual(
        '<div data-hook="async-input__result">Get Request Result: </div>'
      );

      await page.click('[data-hook="async-input__input"]');

      await Promise.all([
        page.waitForRequest(
          request =>
            request.url() === 'http://localhost:3002/toUpperCase/100/somevalue' &&
            request.method() === 'GET'
        ),
        page.waitForResponse(
          response =>
            response.url() === 'http://localhost:3002/toUpperCase/100/somevalue' &&
            response.status() === 200
        ),

        await page.type('[data-hook="async-input__input"]', 's')
      ]);
      expect(await page.$eval('[data-hook="async-input__result"]', el => el.innerHTML)).toEqual(
        'Get Request Result: SOMEVALUE'
      );
    },
    timeout
  );
});
