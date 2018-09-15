import { updateTestData } from '../testUtils';

const timeout = 30000;

describe('InputRadio', () => {
  let page;
  beforeAll(async () => {
    page = await global.browser.newPage();
    await page.goto('http://localhost:8001/inputRadio');
  }, timeout);

  afterAll(async () => {
    if (process.env.JEST_UPDATE_DATA_ENV) {
      await updateTestData(page, 'InputRadio');
    }
    await page.close();
  });

  it(
    'first test',
    async () => {
      expect(await page.$eval('[data-hook="selected-pizza"]', el => el.outerHTML)).toEqual(
        '<span data-hook="selected-pizza">Selected pizza: </span>'
      );

      await page.click('[data-hook="small-pizza-input"]');

      expect(await page.$eval('[data-hook="selected-pizza"]', el => el.innerHTML)).toEqual(
        'Selected pizza: small'
      );

      await page.click('[data-hook="medium-pizza-input"]');

      expect(await page.$eval('[data-hook="selected-pizza"]', el => el.innerHTML)).toEqual(
        'Selected pizza: medium'
      );

      await page.click('[data-hook="large-pizza-input"]');

      expect(await page.$eval('[data-hook="selected-pizza"]', el => el.innerHTML)).toEqual(
        'Selected pizza: large'
      );

      await page.click('[data-hook="small-pizza-input"]');

      expect(await page.$eval('[data-hook="selected-pizza"]', el => el.innerHTML)).toEqual(
        'Selected pizza: small'
      );
    },
    timeout
  );
});
