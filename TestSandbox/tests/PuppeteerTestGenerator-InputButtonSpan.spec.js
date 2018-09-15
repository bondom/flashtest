import { updateTestData } from '../testUtils';

const timeout = 30000;

describe('InputButtonSpan', () => {
  let page;
  beforeAll(async () => {
    page = await global.browser.newPage();
    await page.goto('http://localhost:8001/inputBtnSpan');
  }, timeout);

  afterAll(async () => {
    if (process.env.JEST_UPDATE_DATA_ENV) {
      await updateTestData(page, 'InputButtonSpan');
    }
    await page.close();
  });

  it(
    'first test',
    async () => {
      expect(await page.$eval('[data-hook="input-button-span__span"]', el => el.outerHTML)).toEqual(
        '<span data-hook="input-button-span__span">Some interesting text</span>'
      );

      await page.click('[data-hook="input-button-span__input"]');

      expect(await page.$eval('[data-hook="input-button-span__input"]', el => el.value)).toEqual(
        ''
      );
      expect(
        await page.$eval('[data-hook="input-button-span__button"]', el => el.disabled)
      ).toEqual(true);
      expect(
        await page.$eval('[data-hook="input-button-span__button"]', el => el.className)
      ).toEqual('');

      await page.type('[data-hook="input-button-span__input"]', 'undisabling');

      expect(await page.$eval('[data-hook="input-button-span__span"]', el => el.innerHTML)).toEqual(
        'Some interesting textundisabling'
      );
      expect(await page.$eval('[data-hook="input-button-span__input"]', el => el.value)).toEqual(
        'undisabling'
      );
      expect(
        await page.$eval('[data-hook="input-button-span__button"]', el => el.disabled)
      ).toEqual(false);
      expect(
        await page.$eval('[data-hook="input-button-span__button"]', el => el.className)
      ).toEqual('styles-valid-12hag1');

      await page.click('[data-hook="input-button-span__button"]');

      expect(await page.$eval('[data-hook="input-button-span__span"]', el => el.innerHTML)).toEqual(
        'Some interesting text'
      );
      expect(await page.$eval('[data-hook="input-button-span__input"]', el => el.value)).toEqual(
        ''
      );
      expect(
        await page.$eval('[data-hook="input-button-span__button"]', el => el.disabled)
      ).toEqual(true);
      expect(
        await page.$eval('[data-hook="input-button-span__button"]', el => el.className)
      ).toEqual('');
    },
    timeout
  );
});
