import { updateTestData } from '../testUtils';

const timeout = 30000;

describe('NestedComplexComponent', () => {
  let page;
  beforeAll(async () => {
    page = await global.browser.newPage();
    await page.goto('http://localhost:8001/nestedComplexComponent');
  }, timeout);

  afterAll(async () => {
    if (process.env.JEST_UPDATE_DATA_ENV) {
      await updateTestData(page, 'NestedComplexComponent');
    }
    await page.close();
  });

  it(
    'first test',
    async () => {
      // check initial outerHTML of elements
      expect(await page.$eval('[data-hook="wrapped-textarea"]', el => el.outerHTML)).toEqual(
        '<textarea data-hook="wrapped-textarea"></textarea>'
      );

      // user action(this action caused no changes)
      await page.click('[data-hook="wrapped-input"]');

      // check attributes before 'input' on '[data-hook="wrapped-input"]' element
      expect(await page.$eval('[data-hook="wrapped-input"]', el => el.value)).toEqual('');
      expect(await page.$eval('[data-hook="wrapper-input-div"]', el => el.className)).toEqual('');

      // user action
      await page.type('[data-hook="wrapped-input"]', 'inputvalue');

      // check elements after 'input' on '[data-hook="wrapped-input"] element'
      expect(await page.$eval('[data-hook="wrapped-input"]', el => el.value)).toEqual('inputvalue');
      expect(await page.$eval('[data-hook="wrapper-input-div"]', el => el.className)).toEqual(
        'styles-valid-12hag1'
      );

      // user action(this action caused no changes)
      await page.click('[data-hook="wrapped-textarea"]');

      // check attributes before 'input' on '[data-hook="wrapped-textarea"]' element
      expect(await page.$eval('[data-hook="wrapper-textarea-div"]', el => el.className)).toEqual(
        ''
      );

      // user action
      await page.type('[data-hook="wrapped-textarea"]', 'textareavalue');

      // check elements after 'input' on '[data-hook="wrapped-textarea"] element'
      expect(await page.$eval('[data-hook="wrapped-textarea"]', el => el.innerHTML)).toEqual(
        'textareavalue'
      );
      expect(await page.$eval('[data-hook="wrapper-textarea-div"]', el => el.className)).toEqual(
        'styles-valid-12hag1'
      );

      // user action(this action caused no changes)
      await page.click('[data-hook="wrapped-button"]');

      // user action(this action caused no changes)
      await page.click('[data-hook="wrapped-button"]');

      // user action(this action caused no changes)
      await page.click('[data-hook="wrapped-button"]');

      // user action(this action caused no changes)
      await page.click('[data-hook="wrapped-button"]');

      // user action(this action caused no changes)
      await page.click('[data-hook="wrapped-button"]');

      // check attributes before 'click' on '[data-hook="wrapped-button"]' element
      expect(await page.$eval('[data-hook="wrapper-button-div"]', el => el.className)).toEqual('');

      // user action
      await page.click('[data-hook="wrapped-button"]');

      // check elements after 'click' on '[data-hook="wrapped-button"] element'
      expect(await page.$eval('[data-hook="wrapper-button-div"]', el => el.className)).toEqual(
        'styles-valid-12hag1'
      );
    },
    timeout
  );
});
