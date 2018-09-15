const timeout = 30000;

describe('DelayedButton', () => {
  let page;
  beforeAll(async () => {
    page = await global.browser.newPage();
    await page.goto('http://localhost:8001/delayedButton');
  }, timeout);

  afterAll(async () => {
    await page.close();
  });

  it(
    'first test',
    async () => {
      await page.click('[data-hook="button"]');

      await page.click('[data-hook="button"]');

      await page.click('[data-hook="button"]');

      await page.click('[data-hook="button"]');

      expect(await page.$eval('[data-hook="button"]', el => el.disabled)).toEqual(false);

      await page.click('[data-hook="button"]');

      expect(await page.$eval('[data-hook="button"]', el => el.disabled)).toEqual(true);
      expect(await page.$eval('[data-hook="warning"]', el => el.outerHTML)).toEqual(
        '<span data-hook="warning">You clicked button 5 times, you can\'t click it anymore</span>'
      );
    },
    timeout
  );
});
