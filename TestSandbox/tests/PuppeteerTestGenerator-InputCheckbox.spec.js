import { updateTestData } from '../testUtils';

const timeout = 30000;

describe('InputCheckbox', () => {
  let page;
  beforeAll(async () => {
    page = await global.browser.newPage();
    await page.goto('http://localhost:8001/inputCheckbox');
  }, timeout);

  afterAll(async () => {
    if (process.env.JEST_UPDATE_DATA_ENV) {
      await updateTestData(page, 'InputCheckbox');
    }
    await page.close();
  });

  it(
    'first test',
    async () => {
      expect(await page.$eval('[data-hook="checked-div"]', el => el.outerHTML)).toEqual(
        '<div data-hook="checked-div">Checked: false</div>'
      );

      await page.click('[data-hook="checkbox"]');

      expect(await page.$eval('[data-hook="checked-div"]', el => el.innerHTML)).toEqual(
        'Checked: true'
      );

      await page.click('[data-hook="checkbox"]');

      expect(await page.$eval('[data-hook="checked-div"]', el => el.innerHTML)).toEqual(
        'Checked: false'
      );
    },
    timeout
  );
});
