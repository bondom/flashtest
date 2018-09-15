const timeout = 30000;

describe('ButtonMousedown', () => {
  let page;
  beforeAll(async () => {
    page = await global.browser.newPage();
    await page.goto('http://localhost:8001/buttonMousedown');
  }, timeout);

  afterAll(async () => {
    await page.close();
  });

  it(
    'first test',
    async () => {
      expect(await page.$eval('[data-hook="click-result"]', el => el.outerHTML)).toEqual(
        '<span data-hook="click-result">Mousedown triggered on button: false</span>'
      );

      await page.click('[data-hook="button"]');

      expect(await page.$eval('[data-hook="click-result"]', el => el.innerHTML)).toEqual(
        'Mousedown triggered on button: true'
      );
    },
    timeout
  );
});
