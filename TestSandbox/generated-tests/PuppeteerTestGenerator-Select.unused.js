const timeout = 30000;

describe('Select', () => {
  let page;
  beforeAll(async () => {
    const context = await browser.createIncognitoBrowserContext();
    page = await context.newPage();
    await page.goto('http://localhost:8001/select');
  }, timeout);

  afterAll(async () => {
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
