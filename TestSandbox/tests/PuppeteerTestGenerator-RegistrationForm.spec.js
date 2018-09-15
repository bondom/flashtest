import { updateTestData } from '../testUtils';

const timeout = 30000;

describe('RegistrationForm', () => {
  let page;
  beforeAll(async () => {
    page = await global.browser.newPage();
    await page.goto('http://localhost:8001/registrationForm');
  }, timeout);

  afterAll(async () => {
    if (process.env.JEST_UPDATE_DATA_ENV) {
      await updateTestData(page, 'RegistrationForm');
    }
    await page.close();
  });

  it(
    'first test',
    async () => {
      // user action(this action caused no changes)
      await page.click('[data-hook="registration-form__login"]');

      // check attributes before 'input' on '[data-hook="registration-form__login"]' element
      expect(await page.$eval('[data-hook="registration-form__login"]', el => el.value)).toEqual(
        ''
      );
      expect(
        await page.$eval('[data-hook="registration-form__login"]', el => el.className)
      ).toEqual('');

      // user action
      await page.type('[data-hook="registration-form__login"]', 'login');

      // check elements after 'input' on '[data-hook="registration-form__login"] element'
      expect(await page.$eval('[data-hook="registration-form__login"]', el => el.value)).toEqual(
        'login'
      );
      expect(await page.$('[data-hook="registration-form__login-error"]')).toEqual(null);
      expect(
        await page.$eval('[data-hook="registration-form__login"]', el => el.className)
      ).toEqual('styles-valid-input-12hag1');

      // user action(this action caused no changes)
      await page.click('[data-hook="registration-form__password"]');

      // check attributes before 'input' on '[data-hook="registration-form__password"]' element
      expect(await page.$eval('[data-hook="registration-form__password"]', el => el.value)).toEqual(
        ''
      );
      expect(
        await page.$eval('[data-hook="registration-form__password"]', el => el.className)
      ).toEqual('');

      // user action
      await page.type('[data-hook="registration-form__password"]', 'password');

      // check elements after 'input' on '[data-hook="registration-form__password"] element'
      expect(await page.$eval('[data-hook="registration-form__password"]', el => el.value)).toEqual(
        'password'
      );
      expect(await page.$('[data-hook="registration-form__password-error"]')).toEqual(null);
      expect(
        await page.$eval('[data-hook="registration-form__password"]', el => el.className)
      ).toEqual('styles-valid-input-12hag1');

      // check attributes before 'input' on '[data-hook="registration-form__sex"]' element
      expect(await page.$eval('[data-hook="registration-form__sex"]', el => el.className)).toEqual(
        ''
      );

      // user action
      await page.select('[data-hook="registration-form__sex"]', 'male');

      // check elements after 'input' on '[data-hook="registration-form__sex"] element'
      expect(await page.$eval('[data-hook="registration-form__sex"]', el => el.className)).toEqual(
        'styles-valid-input-12hag1'
      );

      // user action(this action caused no changes)
      await page.click('[data-hook="registration-form__age"]');

      // check attributes before 'input' on '[data-hook="registration-form__age"]' element
      expect(await page.$eval('[data-hook="registration-form__age"]', el => el.value)).toEqual('');
      expect(await page.$eval('[data-hook="registration-form__age"]', el => el.className)).toEqual(
        ''
      );

      // user action
      await page.type('[data-hook="registration-form__age"]', '18');

      // check elements after 'input' on '[data-hook="registration-form__age"] element'
      expect(await page.$eval('[data-hook="registration-form__age"]', el => el.value)).toEqual(
        '18'
      );
      expect(await page.$eval('[data-hook="registration-form__age"]', el => el.className)).toEqual(
        'styles-valid-input-12hag1'
      );

      // check attributes before 'click' on '[data-hook="registration-form__privacy-policy"]' element
      expect(
        await page.$eval('[data-hook="registration-form__privacy-policy"]', el => el.value)
      ).toEqual('false');
      expect(
        await page.$eval(
          '[data-hook="registration-form__privacyPolicy-wrapper"]',
          el => el.className
        )
      ).toEqual('');
      expect(
        await page.$eval('[data-hook="registration-form__submit-btn"]', el => el.className)
      ).toEqual('');

      // user action
      await page.click('[data-hook="registration-form__privacy-policy"]');

      // check elements after 'click' on '[data-hook="registration-form__privacy-policy"] element'
      expect(
        await page.$eval('[data-hook="registration-form__privacy-policy"]', el => el.value)
      ).toEqual('true');
      expect(
        await page.$eval(
          '[data-hook="registration-form__privacyPolicy-wrapper"]',
          el => el.className
        )
      ).toEqual('styles-valid-input-12hag1');
      expect(
        await page.$eval('[data-hook="registration-form__submit-btn"]', el => el.className)
      ).toEqual('styles-btn-valid-12hag1');

      // user action
      await page.click('[data-hook="registration-form__submit-btn"]');

      // check elements after 'click' on '[data-hook="registration-form__submit-btn"] element'
      expect(
        await page.$eval('[data-hook="registration-form__response-msg"]', el => el.outerHTML)
      ).toEqual(
        '<span class="styles-message-12hag1" data-hook="registration-form__response-msg">Success login</span>'
      );
    },
    timeout
  );
});
