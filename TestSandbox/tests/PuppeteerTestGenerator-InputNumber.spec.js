import { updateTestData } from '../testUtils';

const timeout = 30000;

describe('InputNumber', () => {
  let page;
  beforeAll(async () => {
    const context = await browser.createIncognitoBrowserContext();
    page = await context.newPage();
    await page.goto('http://localhost:8001/inputNumber');
  }, timeout);

  afterAll(async () => {
    if (process.env.JEST_UPDATE_DATA_ENV) {
      await updateTestData(page, 'InputNumber');
    }
    await page.close();
  });

  it(
    'first test',
    async () => {
      await page.click('[data-hook="input"]');

      expect(await page.$eval('[data-hook="input"]', el => el.value)).toEqual('');

      await page.type('[data-hook="input"]', '12');

      expect(await page.$eval('[data-hook="input"]', el => el.value)).toEqual('12');
    },
    timeout
  );
});
