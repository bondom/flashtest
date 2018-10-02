const timeout = 30000;

describe('InputKeyEvents', () => {
  let page;
  beforeAll(async () => {
    const context = await browser.createIncognitoBrowserContext();
    page = await context.newPage();
    await page.goto('http://localhost:8001/inputKeyEvents');
  }, timeout);

  afterAll(async () => {
    await page.close();
  });

  it(
    'first test',
    async () => {
      expect(await page.$eval('[data-hook="key-press-div"]', el => el.outerHTML)).toEqual(
        '<div data-hook="key-press-div">Key Press event was triggered: 0 times</div>'
      );

      expect(await page.$eval('[data-hook="key-down-div"]', el => el.outerHTML)).toEqual(
        '<div data-hook="key-down-div">Key Down event was triggered: 0 times</div>'
      );

      expect(await page.$eval('[data-hook="key-up-div"]', el => el.outerHTML)).toEqual(
        '<div data-hook="key-up-div">Key Up event was triggered: 0 times</div>'
      );

      await page.click('[data-hook="input"]');

      expect(await page.$eval('[data-hook="input"]', el => el.value)).toEqual('');

      await page.type('[data-hook="input"]', 'some value');

      expect(await page.$eval('[data-hook="key-down-div"]', el => el.innerHTML)).toEqual(
        'Key Down event was triggered: 10 times'
      );
      expect(await page.$eval('[data-hook="key-press-div"]', el => el.innerHTML)).toEqual(
        'Key Press event was triggered: 10 times'
      );
      expect(await page.$eval('[data-hook="input"]', el => el.value)).toEqual('some value');
      expect(await page.$eval('[data-hook="key-up-div"]', el => el.innerHTML)).toEqual(
        'Key Up event was triggered: 10 times'
      );
    },
    timeout
  );
});
