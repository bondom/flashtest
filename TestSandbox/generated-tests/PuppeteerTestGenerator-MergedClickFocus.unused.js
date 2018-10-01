const timeout = 30000;

describe('MergedClickFocus', () => {
  let page;
  beforeAll(async () => {
    const context = await browser.createIncognitoBrowserContext();
    page = await context.newPage();
    await page.goto('http://localhost:8001/mergedClickFocus');
  }, timeout);

  afterAll(async () => {
    await page.close();
  });

  it(
    'first test',
    async () => {
      // check initial outerHTML of elements
      expect(await page.$eval('[data-hook="click-result"]', el => el.outerHTML)).toEqual(
        '<span data-hook="click-result">Clicked: false</span>'
      );

      // user action
      await page.click('[data-hook="input"]');

      // check elements after 'click' on '[data-hook="input"] element'
      expect(await page.$eval('[data-hook="click-result"]', el => el.innerHTML)).toEqual(
        'Clicked: true'
      );
    },
    timeout
  );
});
