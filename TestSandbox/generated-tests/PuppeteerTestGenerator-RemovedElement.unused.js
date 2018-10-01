const timeout = 30000;

describe('RemovedElement', () => {
  let page;
  beforeAll(async () => {
    const context = await browser.createIncognitoBrowserContext();
    page = await context.newPage();
    await page.goto('http://localhost:8001/removedElement');
  }, timeout);

  afterAll(async () => {
    await page.close();
  });

  it(
    'first test',
    async () => {
      // check initial outerHTML of elements
      expect(await page.$eval('[data-hook="wrapper-div"]', el => el.outerHTML)).toEqual(
        '<div data-hook="wrapper-div">somevalue</div>'
      );

      // user action
      await page.click('[data-hook="clear-button"]');

      // check elements after 'click' on '[data-hook="clear-button"] element'
      expect(await page.$('[data-hook="wrapper-div"]')).toEqual(null);
    },
    timeout
  );
});
