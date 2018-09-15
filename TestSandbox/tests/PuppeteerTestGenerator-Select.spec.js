import { updateTestData } from '../testUtils';

const timeout = 30000;

describe('Select', () => {
  let page;
  beforeAll(async () => {
    page = await global.browser.newPage();
    await page.goto('http://localhost:8001/select');
  }, timeout);

  afterAll(async () => {
    if (process.env.JEST_UPDATE_DATA_ENV) {
      await updateTestData(page, 'Select');
    }
    await page.close();
  });

  it(
    'first test',
    async () => {
      expect(await page.$eval('[data-hook="select-result"]', el => el.outerHTML)).toEqual(
        '<span data-hook="select-result">Selected: coconut</span>'
      );

      await page.select('[data-hook="select"]', 'lime');

      expect(await page.$eval('[data-hook="select-result"]', el => el.innerHTML)).toEqual(
        'Selected: lime'
      );
    },
    timeout
  );
});
