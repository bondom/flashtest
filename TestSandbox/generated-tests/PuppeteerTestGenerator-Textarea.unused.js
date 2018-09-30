const timeout = 30000;

describe('Textarea', () => {
  let page;
  beforeAll(async () => {
    page = await global.browser.newPage();
    await page.goto('http://localhost:8001/textarea');
  }, timeout);

  afterAll(async () => {
    await page.close();
  });

  it(
    'first test',
    async () => {
      expect(await page.$eval('[data-hook="textarea"]', el => el.outerHTML)).toEqual(
        '<textarea data-hook="textarea"></textarea>'
      );

      await page.click('[data-hook="textarea"]');

      await page.type('[data-hook="textarea"]', 'uasia');

      expect(await page.$eval('[data-hook="textarea"]', el => el.innerHTML)).toEqual('uasia');
    },
    timeout
  );
});
