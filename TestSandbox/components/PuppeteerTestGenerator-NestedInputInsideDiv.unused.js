const timeout = 30000;

describe('NestedInputInsideDiv', () => {
  let page;
  beforeAll(async () => {
    page = await global.browser.newPage();
    await page.goto('http://localhost:8001/nestedInputInsideDiv');
  }, timeout);

  afterAll(async () => {
    await page.close();
  });

  it(
    'first test',
    async () => {
      await page.click('[data-hook="wrapped-input"]');

      expect(await page.$eval('[data-hook="wrapped-input"]', el => el.value)).toEqual('');
      expect(await page.$eval('[data-hook="wrapper-div"]', el => el.className)).toEqual('');

      await page.type('[data-hook="wrapped-input"]', 'password');

      expect(await page.$eval('[data-hook="wrapped-input"]', el => el.value)).toEqual('password');
      expect(await page.$eval('[data-hook="wrapper-div"]', el => el.className)).toEqual(
        'styles-valid-12hag1'
      );
    },
    timeout
  );
});
