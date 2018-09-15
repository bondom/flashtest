import { updateTestData } from '../testUtils';

const timeout = 30000;

describe('RemovedTextNode', () => {
  let page;
  beforeAll(async () => {
    page = await global.browser.newPage();
    await page.goto('http://localhost:8001/removedTextNode');
  }, timeout);

  afterAll(async () => {
    if (process.env.JEST_UPDATE_DATA_ENV) {
      await updateTestData(page, 'RemovedTextNode');
    }
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
      expect(await page.$eval('[data-hook="wrapper-div"]', el => el.innerHTML)).toEqual('');
    },
    timeout
  );
});
