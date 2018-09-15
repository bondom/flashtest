const timeout = 30000;

describe('DynamicallyAddedButton', () => {
  let page;
  beforeAll(async () => {
    page = await global.browser.newPage();
    await page.goto('http://localhost:8001/dynamicallyAddedButton');
  }, timeout);

  afterAll(async () => {
    await page.close();
  });

  it(
    'first test',
    async () => {
      // user action
      await page.click('[data-hook="first-button"]');

      // check elements after 'click' on '[data-hook="first-button"] element'
      expect(await page.$eval('[data-hook="second-button"]', el => el.outerHTML)).toEqual(
        '<button data-hook="second-button">Second Button</button>'
      );

      // user action
      await page.click('[data-hook="second-button"]');

      // check elements after 'click' on '[data-hook="second-button"] element'
      expect(
        await page.$eval('[data-hook="second-button-click-result"]', el => el.outerHTML)
      ).toEqual('<span data-hook="second-button-click-result">Second button clicked!!</span>');
    },
    timeout
  );
});
