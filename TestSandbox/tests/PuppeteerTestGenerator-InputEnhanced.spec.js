import { updateTestData } from '../testUtils';

const timeout = 30000;

describe('InputEnhanced', () => {
  let page;
  beforeAll(async () => {
    const context = await browser.createIncognitoBrowserContext();
    page = await context.newPage();
    await page.goto('http://localhost:8001/inputEnhanced');
  }, timeout);

  afterAll(async () => {
    if (process.env.JEST_UPDATE_DATA_ENV) {
      await updateTestData(page, 'InputEnhanced');
    }
    await page.close();
  });

  it(
    'first test',
    async () => {
      expect(await page.$eval('[data-hook="key-codes-div"]', el => el.outerHTML)).toEqual(
        '<div data-hook="key-codes-div">Pressed keys on inputs: </div>'
      );

      expect(await page.$eval('[data-hook="key-downs-count-div"]', el => el.outerHTML)).toEqual(
        '<div data-hook="key-downs-count-div">Key downs count on inputs: 0</div>'
      );

      expect(await page.$eval('[data-hook="first-input-focus-state"]', el => el.outerHTML)).toEqual(
        '<div data-hook="first-input-focus-state">first input focused: false</div>'
      );

      expect(
        await page.$eval('[data-hook="second-input-focus-state"]', el => el.outerHTML)
      ).toEqual('<div data-hook="second-input-focus-state">second input focused: false</div>');

      await page.click('[data-hook="input"]');

      expect(await page.$eval('[data-hook="first-input-focus-state"]', el => el.innerHTML)).toEqual(
        'first input focused: true'
      );

      expect(await page.$eval('[data-hook="input"]', el => el.value)).toEqual('');

      await page.type('[data-hook="input"]', 'value1');

      expect(await page.$eval('[data-hook="key-downs-count-div"]', el => el.innerHTML)).toEqual(
        'Key downs count on inputs: 6'
      );
      expect(await page.$eval('[data-hook="key-codes-div"]', el => el.innerHTML)).toEqual(
        'Pressed keys on inputs: value1'
      );
      expect(await page.$eval('[data-hook="input"]', el => el.value)).toEqual('value1');

      await page.click('[data-hook="input-second"]');

      expect(await page.$eval('[data-hook="first-input-focus-state"]', el => el.innerHTML)).toEqual(
        'first input focused: false'
      );
      expect(
        await page.$eval('[data-hook="second-input-focus-state"]', el => el.innerHTML)
      ).toEqual('second input focused: true');

      expect(await page.$eval('[data-hook="input-second"]', el => el.value)).toEqual('');

      await page.type('[data-hook="input-second"]', 'value2');

      expect(await page.$eval('[data-hook="input-second"]', el => el.value)).toEqual('value2');

      await page.evaluate(() => {
        document.querySelector('[data-hook="input-second"]').blur();
      });

      expect(
        await page.$eval('[data-hook="second-input-focus-state"]', el => el.innerHTML)
      ).toEqual('second input focused: false');
    },
    timeout
  );
});
