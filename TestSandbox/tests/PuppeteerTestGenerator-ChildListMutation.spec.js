import { updateTestData } from '../testUtils';

const timeout = 30000;

describe('ChildListMutation', () => {
  let page;
  beforeAll(async () => {
    page = await global.browser.newPage();
    await page.goto('http://localhost:8001/childListMutation');
  }, timeout);

  afterAll(async () => {
    if (process.env.JEST_UPDATE_DATA_ENV) {
      await updateTestData(page, 'ChildListMutation');
    }
    await page.close();
  });

  it(
    'first test',
    async () => {
      // check initial outerHTML of elements
      expect(await page.$eval('[data-hook="button"]', el => el.outerHTML)).toEqual(
        '<button data-hook="button">Show divs</button>'
      );

      // user action
      await page.click('[data-hook="button"]');

      // check elements after 'click' on '[data-hook="button"] element'
      expect(await page.$eval('[data-hook="button"]', el => el.innerHTML)).toEqual('Hide divs');
      expect(await page.$eval('[data-hook="root1-span"]', el => el.outerHTML)).toEqual(
        '<span data-hook="root1-span">First div - span</span>'
      );
      expect(await page.$eval('[data-hook="root1-inner-div__span"]', el => el.outerHTML)).toEqual(
        '<span data-hook="root1-inner-div__span">First div - inner div - span</span>'
      );
      expect(await page.$eval('[data-hook="root2-span"]', el => el.outerHTML)).toEqual(
        '<span data-hook="root2-span">First div - span</span>'
      );
      expect(await page.$eval('[data-hook="root2-inner-div__input"]', el => el.outerHTML)).toEqual(
        '<input data-hook="root2-inner-div__input" value="some value">'
      );
      expect(await page.$eval('[data-hook="root3-span"]', el => el.outerHTML)).toEqual(
        '<span data-hook="root3-span">Second div - span</span>'
      );
      expect(await page.$eval('[data-hook="root3-inner-div__span"]', el => el.outerHTML)).toEqual(
        '<span data-hook="root3-inner-div__span">Second div - inner div - span</span>'
      );
      expect(await page.$eval('[data-hook="root4"]', el => el.outerHTML)).toEqual(
        '<div data-hook="root4"><span>Fourth div - span</span><div><span>Fourth div - inner div - span</span></div></div>'
      );
      expect(await page.$eval('[data-hook="root5-input"]', el => el.outerHTML)).toEqual(
        '<input data-hook="root5-input" value="some value">'
      );
      expect(await page.$eval('[data-hook="root6__inner-div"]', el => el.outerHTML)).toEqual(
        '<div data-hook="root6__inner-div"><span>Sixth div - inner div - span</span></div>'
      );
      expect(await page.$eval('[data-hook="root7__span"]', el => el.outerHTML)).toEqual(
        '<span data-hook="root7__span">Seventh div - span</span>'
      );
      expect(await page.$eval('[data-hook="root7__inner-div"]', el => el.outerHTML)).toEqual(
        '<div data-hook="root7__inner-div"><span>Seventh div - inner div - span</span></div>'
      );
      expect(await page.$eval('[data-hook="root8__span"]', el => el.outerHTML)).toEqual(
        '<span data-hook="root8__span">8th div - span</span>'
      );
      expect(await page.$eval('[data-hook="root8__inner-div-span"]', el => el.outerHTML)).toEqual(
        '<span data-hook="root8__inner-div-span">8th div - inner div - span</span>'
      );
      expect(await page.$eval('[data-hook="root9__span"]', el => el.outerHTML)).toEqual(
        '<span data-hook="root9__span">9th div - span</span>'
      );
      expect(await page.$eval('[data-hook="root9__inner-div1-span"]', el => el.outerHTML)).toEqual(
        '<span data-hook="root9__inner-div1-span">9th div - inner div - span</span>'
      );
      expect(await page.$eval('[data-hook="root9__inner-div2-span"]', el => el.outerHTML)).toEqual(
        '<span data-hook="root9__inner-div2-span">9th div - inner div - span</span>'
      );
      expect(await page.$eval('[data-hook="root10"]', el => el.outerHTML)).toEqual(
        '<div data-hook="root10"><span>10th div - span</span><input value="some value"><div><span>10th div - inner div - span</span></div></div>'
      );

      // user action
      await page.click('[data-hook="button"]');

      // check elements after 'click' on '[data-hook="button"] element'
      expect(await page.$('[data-hook="root1-span"]')).toEqual(null);
      expect(await page.$('[data-hook="root1-inner-div__span"]')).toEqual(null);
      expect(await page.$('[data-hook="root2-span"]')).toEqual(null);
      expect(await page.$('[data-hook="root2-inner-div__input"]')).toEqual(null);
      expect(await page.$('[data-hook="root3-span"]')).toEqual(null);
      expect(await page.$('[data-hook="root3-inner-div__span"]')).toEqual(null);
      expect(await page.$('[data-hook="root4"]')).toEqual(null);
      expect(await page.$('[data-hook="root5-input"]')).toEqual(null);
      expect(await page.$('[data-hook="root6__inner-div"]')).toEqual(null);
      expect(await page.$('[data-hook="root7__span"]')).toEqual(null);
      expect(await page.$('[data-hook="root7__inner-div"]')).toEqual(null);
      expect(await page.$('[data-hook="root8__span"]')).toEqual(null);
      expect(await page.$('[data-hook="root8__inner-div-span"]')).toEqual(null);
      expect(await page.$('[data-hook="root9__span"]')).toEqual(null);
      expect(await page.$('[data-hook="root9__inner-div1-span"]')).toEqual(null);
      expect(await page.$('[data-hook="root9__inner-div2-span"]')).toEqual(null);
      expect(await page.$('[data-hook="root10"]')).toEqual(null);
      expect(await page.$eval('[data-hook="button"]', el => el.innerHTML)).toEqual('Show divs');
    },
    timeout
  );
});
