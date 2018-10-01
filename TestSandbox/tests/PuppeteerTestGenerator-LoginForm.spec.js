import { updateTestData } from '../testUtils';

const timeout = 30000;

describe('LoginForm', () => {
  let page;
  beforeAll(async () => {
    const context = await browser.createIncognitoBrowserContext();
    page = await context.newPage();
    await page.goto('http://localhost:8001/login');
  }, timeout);

  afterAll(async () => {
    if (process.env.JEST_UPDATE_DATA_ENV) {
      await updateTestData(page, 'LoginForm');
    }
    await page.close();
  });

  it(
    'first test',
    async () => {
      await page.click('[data-hook="login-form-login"]');

      expect(await page.$eval('[data-hook="login-form-login"]', el => el.value)).toEqual('');
      expect(await page.$eval('[data-hook="login-form-login"]', el => el.className)).toEqual('');

      await page.type('[data-hook="login-form-login"]', 'login');

      expect(await page.$eval('[data-hook="login-form-login"]', el => el.value)).toEqual('login');
      expect(await page.$eval('[data-hook="login-form-login"]', el => el.className)).toEqual(
        'styles-valid-input-12hag1'
      );

      await page.click('[data-hook="login-form-password"]');

      expect(await page.$eval('[data-hook="login-form-password"]', el => el.value)).toEqual('');
      expect(await page.$eval('[data-hook="login-form-password"]', el => el.className)).toEqual('');
      expect(await page.$eval('[data-hook="login-form-submit-btn"]', el => el.className)).toEqual(
        ''
      );

      await page.type('[data-hook="login-form-password"]', 'password');

      expect(await page.$eval('[data-hook="login-form-password"]', el => el.value)).toEqual(
        'password'
      );
      expect(await page.$eval('[data-hook="login-form-password"]', el => el.className)).toEqual(
        'styles-valid-input-12hag1'
      );
      expect(await page.$eval('[data-hook="login-form-submit-btn"]', el => el.className)).toEqual(
        'styles-btn-valid-12hag1'
      );

      await page.click('[data-hook="login-form-submit-btn"]');

      expect(await page.$eval('[data-hook="login-form-response-msg"]', el => el.outerHTML)).toEqual(
        '<span class="styles-message-12hag1" data-hook="login-form-response-msg">Success login</span>'
      );
    },
    timeout
  );
});
