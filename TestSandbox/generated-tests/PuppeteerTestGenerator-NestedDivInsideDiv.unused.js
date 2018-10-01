const timeout = 30000;

describe('NestedDivInsideDiv', () => {
  let page;
  beforeAll(async () => {
    const context = await browser.createIncognitoBrowserContext();
    page = await context.newPage();
    await page.goto('http://localhost:8001/nestedDivInsideDiv');
  }, timeout);

  afterAll(async () => {
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
