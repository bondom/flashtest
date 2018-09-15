import { updateTestData } from '../testUtils';

const timeout = 30000;

describe('MergedClickBlur', () => {
  let page;
  beforeAll(async () => {
    page = await global.browser.newPage();
    await page.goto('http://localhost:8001/mergedClickBlur');
  }, timeout);

  afterAll(async () => {
    if (process.env.JEST_UPDATE_DATA_ENV) {
      await updateTestData(page, 'MergedClickBlur');
    }
    await page.close();
  });

  it(
    'first test',
    async () => {
      // check initial outerHTML of elements
      expect(await page.$eval('[data-hook="blur-result"]', el => el.outerHTML)).toEqual(
        '<span data-hook="blur-result">Blured: false</span>'
      );

      // user action(this action caused no changes)
      await page.click('[data-hook="input"]');

      // user action
      await page.evaluate(() => {
        document.querySelector('[data-hook="input"]').blur();
      });

      // check elements after 'blur' on '[data-hook="input"] element'
      expect(await page.$eval('[data-hook="blur-result"]', el => el.innerHTML)).toEqual(
        'Blured: true'
      );
    },
    timeout
  );
});
