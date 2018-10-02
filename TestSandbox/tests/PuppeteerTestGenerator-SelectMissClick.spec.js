import { updateTestData } from '../testUtils';

const timeout = 30000;

describe('SelectMissClick', () => {
  let page;
  beforeAll(async () => {
    const context = await browser.createIncognitoBrowserContext();
    page = await context.newPage();
    await page.goto('http://localhost:8001/select');
  }, timeout);

  afterAll(async () => {
    await page.close();
  });

  afterAll(async () => {
    if (process.env.JEST_UPDATE_DATA_ENV) {
      await updateTestData(page, 'SelectMissClick');
    }
    await page.close();
  });

  it(
    'first test',
    async () => {
      // check initial outerHTML of elements
      expect(await page.$eval('[data-hook="select-result"]', el => el.outerHTML)).toEqual(
        '<span data-hook="select-result">Selected: coconut</span>'
      );

      // user action(this action caused no changes)
      await page.select('[data-hook="select"]', 'coconut');

      // user action
      await page.select('[data-hook="select"]', 'mango');

      // check elements after 'input' on '[data-hook="select"] element'
      expect(await page.$eval('[data-hook="select-result"]', el => el.innerHTML)).toEqual(
        'Selected: mango'
      );
    },
    timeout
  );
});
