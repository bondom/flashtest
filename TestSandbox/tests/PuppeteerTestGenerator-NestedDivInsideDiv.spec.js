import { updateTestData } from '../testUtils';

const timeout = 30000;

describe('NestedDivInsideDiv', () => {
  let page;
  beforeAll(async () => {
    page = await global.browser.newPage();
    await page.goto('http://localhost:8001/nestedDivInsideDiv');
  }, timeout);

  afterAll(async () => {
    if (process.env.JEST_UPDATE_DATA_ENV) {
      await updateTestData(page, 'NestedDivInsideDiv');
    }
    await page.close();
  });

  it(
    'first test',
    async () => {
      expect(await page.$eval('[data-hook="wrapped-div"]', el => el.className)).toEqual(
        'styles-clickableDiv-12hag1'
      );
      await page.click('[data-hook="wrapped-div"]');
      expect(await page.$eval('[data-hook="wrapped-div"]', el => el.className)).toEqual(
        'styles-clickableDiv-12hag1 styles-valid-12hag1'
      );
    },
    timeout
  );
});
