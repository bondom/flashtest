import { updateTestData } from '../testUtils';

const timeout = 30000;

describe('ButtonComplex', () => {
  let page;
  beforeAll(async () => {
    const context = await browser.createIncognitoBrowserContext();
    page = await context.newPage();
    await page.goto('http://localhost:8001/buttonComplex');
  }, timeout);

  afterAll(async () => {
    if (process.env.JEST_UPDATE_DATA_ENV) {
      await updateTestData(page, 'ButtonComplex');
    }
    await page.close();
  });

  it(
    'first test',
    async () => {
      expect(await page.$eval('[data-hook="mousedown-result"]', el => el.outerHTML)).toEqual(
        '<span data-hook="mousedown-result">Mousedown triggered on button: false</span>'
      );

      expect(await page.$eval('[data-hook="focus-result"]', el => el.outerHTML)).toEqual(
        '<span data-hook="focus-result">Focus triggered on button: false</span>'
      );

      expect(await page.$eval('[data-hook="mouseup-result"]', el => el.outerHTML)).toEqual(
        '<span data-hook="mouseup-result">Mouseup triggered on button: false</span>'
      );

      expect(await page.$eval('[data-hook="click-result"]', el => el.outerHTML)).toEqual(
        '<span data-hook="click-result">Click triggered on button: false</span>'
      );

      await page.click('[data-hook="button"]');

      expect(await page.$eval('[data-hook="mousedown-result"]', el => el.innerHTML)).toEqual(
        'Mousedown triggered on button: true'
      );
      expect(await page.$eval('[data-hook="mouseup-result"]', el => el.innerHTML)).toEqual(
        'Mouseup triggered on button: true'
      );
      expect(await page.$eval('[data-hook="focus-result"]', el => el.innerHTML)).toEqual(
        'Focus triggered on button: true'
      );
      expect(await page.$eval('[data-hook="click-result"]', el => el.innerHTML)).toEqual(
        'Click triggered on button: true'
      );
    },
    timeout
  );
});
