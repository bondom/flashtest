const timeout = 30000;

describe('TodoList', () => {
  let page;
  beforeAll(async () => {
    page = await global.browser.newPage();

    // trigger user action and wait for right request and response
    await Promise.all([
      page.waitForRequest(
        request =>
          request.url() === 'http://localhost:3002/todolist-reset' && request.method() === 'POST'
      ),
      page.waitForResponse(
        response =>
          response.url() === 'http://localhost:3002/todolist-reset' && response.status() === 200
      ),

      page.waitForRequest(
        request => request.url() === 'http://localhost:3002/todolist' && request.method() === 'GET'
      ),
      page.waitForResponse(
        response => response.url() === 'http://localhost:3002/todolist' && response.status() === 200
      ),

      await page.goto('http://localhost:8001/todoList')
    ]);
  }, timeout);

  afterAll(async () => {
    await page.close();
  });

  it(
    'first test',
    async () => {
      expect(await page.$('[data-hook="todolist__loader"]')).toEqual(null);
      expect(await page.$eval('[data-hook="todolist__item-text-1"]', el => el.outerHTML)).toEqual(
        '<span data-hook="todolist__item-text-1">drink water </span>'
      );
      expect(
        await page.$eval('[data-hook="todolist__item-delete-button-1"]', el => el.outerHTML)
      ).toEqual('<button data-hook="todolist__item-delete-button-1">Delete</button>');
      expect(await page.$eval('[data-hook="todolist__item-text-2"]', el => el.outerHTML)).toEqual(
        '<span data-hook="todolist__item-text-2">buy banana </span>'
      );
      expect(
        await page.$eval('[data-hook="todolist__item-delete-button-2"]', el => el.outerHTML)
      ).toEqual('<button data-hook="todolist__item-delete-button-2">Delete</button>');

      // check DOM while requests are processing
      await page.setRequestInterception(true);
      const interceptRequestCallback3 = async interceptedRequest => {
        if (
          interceptedRequest.url() === 'http://localhost:3002/todolist/1' &&
          interceptedRequest.method() === 'DELETE'
        ) {
          expect(await page.$('[data-hook="todolist__item-text-1"]')).toEqual(null);
          expect(await page.$('[data-hook="todolist__item-delete-button-1"]')).toEqual(null);
          expect(await page.$('[data-hook="todolist__item-text-2"]')).toEqual(null);
          expect(await page.$('[data-hook="todolist__item-delete-button-2"]')).toEqual(null);
          expect(await page.$eval('[data-hook="todolist__loader"]', el => el.outerHTML)).toEqual(
            '<span data-hook="todolist__loader">Loading...</span>'
          );
        }

        if (
          interceptedRequest.url() === 'http://localhost:3002/todolist' &&
          interceptedRequest.method() === 'GET'
        ) {
          expect(await page.$('[data-hook="todolist__item-text-1"]')).toEqual(null);
          expect(await page.$('[data-hook="todolist__item-delete-button-1"]')).toEqual(null);
          expect(await page.$('[data-hook="todolist__item-text-2"]')).toEqual(null);
          expect(await page.$('[data-hook="todolist__item-delete-button-2"]')).toEqual(null);
          expect(await page.$eval('[data-hook="todolist__loader"]', el => el.outerHTML)).toEqual(
            '<span data-hook="todolist__loader">Loading...</span>'
          );
        }

        interceptedRequest.continue();
      };
      page.on('request', interceptRequestCallback3);

      // trigger user action and wait for right request and response
      await Promise.all([
        page.waitForRequest(
          request =>
            request.url() === 'http://localhost:3002/todolist/1' && request.method() === 'DELETE'
        ),
        page.waitForResponse(
          response =>
            response.url() === 'http://localhost:3002/todolist/1' && response.status() === 200
        ),

        page.waitForRequest(
          request =>
            request.url() === 'http://localhost:3002/todolist' && request.method() === 'GET'
        ),
        page.waitForResponse(
          response =>
            response.url() === 'http://localhost:3002/todolist' && response.status() === 200
        ),

        await page.click('[data-hook="todolist__item-delete-button-1"]')
      ]);

      page.removeListener('request', interceptRequestCallback3);
      await page.setRequestInterception(false);

      expect(await page.$('[data-hook="todolist__loader"]')).toEqual(null);
      expect(await page.$eval('[data-hook="todolist__item-text-2"]', el => el.outerHTML)).toEqual(
        '<span data-hook="todolist__item-text-2">buy banana </span>'
      );
      expect(
        await page.$eval('[data-hook="todolist__item-delete-button-2"]', el => el.outerHTML)
      ).toEqual('<button data-hook="todolist__item-delete-button-2">Delete</button>');

      // check DOM while requests are processing
      await page.setRequestInterception(true);
      const interceptRequestCallback5 = async interceptedRequest => {
        if (
          interceptedRequest.url() === 'http://localhost:3002/todolist/2' &&
          interceptedRequest.method() === 'DELETE'
        ) {
          expect(await page.$('[data-hook="todolist__item-text-2"]')).toEqual(null);
          expect(await page.$('[data-hook="todolist__item-delete-button-2"]')).toEqual(null);
          expect(await page.$eval('[data-hook="todolist__loader"]', el => el.outerHTML)).toEqual(
            '<span data-hook="todolist__loader">Loading...</span>'
          );
        }

        if (
          interceptedRequest.url() === 'http://localhost:3002/todolist' &&
          interceptedRequest.method() === 'GET'
        ) {
          expect(await page.$('[data-hook="todolist__item-text-2"]')).toEqual(null);
          expect(await page.$('[data-hook="todolist__item-delete-button-2"]')).toEqual(null);
          expect(await page.$eval('[data-hook="todolist__loader"]', el => el.outerHTML)).toEqual(
            '<span data-hook="todolist__loader">Loading...</span>'
          );
        }

        interceptedRequest.continue();
      };
      page.on('request', interceptRequestCallback5);

      // trigger user action and wait for right request and response
      await Promise.all([
        page.waitForRequest(
          request =>
            request.url() === 'http://localhost:3002/todolist/2' && request.method() === 'DELETE'
        ),
        page.waitForResponse(
          response =>
            response.url() === 'http://localhost:3002/todolist/2' && response.status() === 200
        ),

        page.waitForRequest(
          request =>
            request.url() === 'http://localhost:3002/todolist' && request.method() === 'GET'
        ),
        page.waitForResponse(
          response =>
            response.url() === 'http://localhost:3002/todolist' && response.status() === 200
        ),

        await page.click('[data-hook="todolist__item-delete-button-2"]')
      ]);

      page.removeListener('request', interceptRequestCallback5);
      await page.setRequestInterception(false);

      expect(await page.$('[data-hook="todolist__loader"]')).toEqual(null);

      // check attributes before 'click' on '[data-hook="todolist__add-new-button"]' element
      expect(await page.$eval('[data-hook="todolist__add-new-button"]', el => el.disabled)).toEqual(
        false
      );

      // user action
      await page.click('[data-hook="todolist__add-new-button"]');

      // check elements after 'click' on '[data-hook="todolist__add-new-button"] element'
      expect(await page.$eval('[data-hook="todolist__add-new-button"]', el => el.disabled)).toEqual(
        true
      );
      expect(
        await page.$eval('[data-hook="todolist__new-item-input"]', el => el.outerHTML)
      ).toEqual('<input data-hook="todolist__new-item-input">');
      expect(await page.$eval('[data-hook="todolist__add-button"]', el => el.outerHTML)).toEqual(
        '<button data-hook="todolist__add-button">Add</button>'
      );
      expect(
        await page.$eval('[data-hook="todolist__adding-cancel-button"]', el => el.outerHTML)
      ).toEqual('<button data-hook="todolist__adding-cancel-button">Cancel</button>');

      // user action(this action caused no changes)
      await page.click('[data-hook="todolist__new-item-input"]');

      // user action(this action caused no changes)
      await page.type('[data-hook="todolist__new-item-input"]', 'new item');

      // check DOM while requests are processing
      await page.setRequestInterception(true);
      const interceptRequestCallback7 = async interceptedRequest => {
        if (
          interceptedRequest.url() === 'http://localhost:3002/todolist/new%20item' &&
          interceptedRequest.method() === 'POST'
        ) {
          expect(await page.$('[data-hook="todolist__new-item-input"]')).toEqual(null);
          expect(await page.$('[data-hook="todolist__add-button"]')).toEqual(null);
          expect(await page.$('[data-hook="todolist__adding-cancel-button"]')).toEqual(null);
          expect(
            await page.$eval('[data-hook="todolist__add-new-button"]', el => el.disabled)
          ).toEqual(false);
          expect(await page.$eval('[data-hook="todolist__loader"]', el => el.outerHTML)).toEqual(
            '<span data-hook="todolist__loader">Loading...</span>'
          );
        }

        if (
          interceptedRequest.url() === 'http://localhost:3002/todolist' &&
          interceptedRequest.method() === 'GET'
        ) {
          expect(await page.$('[data-hook="todolist__new-item-input"]')).toEqual(null);
          expect(await page.$('[data-hook="todolist__add-button"]')).toEqual(null);
          expect(await page.$('[data-hook="todolist__adding-cancel-button"]')).toEqual(null);
          expect(
            await page.$eval('[data-hook="todolist__add-new-button"]', el => el.disabled)
          ).toEqual(false);
          expect(await page.$eval('[data-hook="todolist__loader"]', el => el.outerHTML)).toEqual(
            '<span data-hook="todolist__loader">Loading...</span>'
          );
        }

        interceptedRequest.continue();
      };
      page.on('request', interceptRequestCallback7);

      // trigger user action and wait for right request and response
      await Promise.all([
        page.waitForRequest(
          request =>
            request.url() === 'http://localhost:3002/todolist/new%20item' &&
            request.method() === 'POST'
        ),
        page.waitForResponse(
          response =>
            response.url() === 'http://localhost:3002/todolist/new%20item' &&
            response.status() === 200
        ),

        page.waitForRequest(
          request =>
            request.url() === 'http://localhost:3002/todolist' && request.method() === 'GET'
        ),
        page.waitForResponse(
          response =>
            response.url() === 'http://localhost:3002/todolist' && response.status() === 200
        ),

        await page.click('[data-hook="todolist__add-button"]')
      ]);

      page.removeListener('request', interceptRequestCallback7);
      await page.setRequestInterception(false);

      expect(await page.$('[data-hook="todolist__loader"]')).toEqual(null);
      expect(await page.$eval('[data-hook="todolist__item-text-1"]', el => el.outerHTML)).toEqual(
        '<span data-hook="todolist__item-text-1">new item </span>'
      );
      expect(
        await page.$eval('[data-hook="todolist__item-delete-button-1"]', el => el.outerHTML)
      ).toEqual('<button data-hook="todolist__item-delete-button-1">Delete</button>');

      // user action
      await page.click('[data-hook="todolist__add-new-button"]');

      // check elements after 'click' on '[data-hook="todolist__add-new-button"] element'
      expect(await page.$eval('[data-hook="todolist__add-new-button"]', el => el.disabled)).toEqual(
        true
      );
      expect(
        await page.$eval('[data-hook="todolist__new-item-input"]', el => el.outerHTML)
      ).toEqual('<input data-hook="todolist__new-item-input">');
      expect(await page.$eval('[data-hook="todolist__add-button"]', el => el.outerHTML)).toEqual(
        '<button data-hook="todolist__add-button">Add</button>'
      );
      expect(
        await page.$eval('[data-hook="todolist__adding-cancel-button"]', el => el.outerHTML)
      ).toEqual('<button data-hook="todolist__adding-cancel-button">Cancel</button>');

      // user action(this action caused no changes)
      await page.click('[data-hook="todolist__new-item-input"]');

      // user action(this action caused no changes)
      await page.type('[data-hook="todolist__new-item-input"]', 'one more item');

      // check DOM while requests are processing
      await page.setRequestInterception(true);
      const interceptRequestCallback9 = async interceptedRequest => {
        if (
          interceptedRequest.url() === 'http://localhost:3002/todolist/one%20more%20item' &&
          interceptedRequest.method() === 'POST'
        ) {
          expect(await page.$('[data-hook="todolist__new-item-input"]')).toEqual(null);
          expect(await page.$('[data-hook="todolist__add-button"]')).toEqual(null);
          expect(await page.$('[data-hook="todolist__adding-cancel-button"]')).toEqual(null);
          expect(await page.$('[data-hook="todolist__item-text-1"]')).toEqual(null);
          expect(await page.$('[data-hook="todolist__item-delete-button-1"]')).toEqual(null);
          expect(
            await page.$eval('[data-hook="todolist__add-new-button"]', el => el.disabled)
          ).toEqual(false);
          expect(await page.$eval('[data-hook="todolist__loader"]', el => el.outerHTML)).toEqual(
            '<span data-hook="todolist__loader">Loading...</span>'
          );
        }

        if (
          interceptedRequest.url() === 'http://localhost:3002/todolist' &&
          interceptedRequest.method() === 'GET'
        ) {
          expect(await page.$('[data-hook="todolist__new-item-input"]')).toEqual(null);
          expect(await page.$('[data-hook="todolist__add-button"]')).toEqual(null);
          expect(await page.$('[data-hook="todolist__adding-cancel-button"]')).toEqual(null);
          expect(await page.$('[data-hook="todolist__item-text-1"]')).toEqual(null);
          expect(await page.$('[data-hook="todolist__item-delete-button-1"]')).toEqual(null);
          expect(
            await page.$eval('[data-hook="todolist__add-new-button"]', el => el.disabled)
          ).toEqual(false);
          expect(await page.$eval('[data-hook="todolist__loader"]', el => el.outerHTML)).toEqual(
            '<span data-hook="todolist__loader">Loading...</span>'
          );
        }

        interceptedRequest.continue();
      };
      page.on('request', interceptRequestCallback9);

      // trigger user action and wait for right request and response
      await Promise.all([
        page.waitForRequest(
          request =>
            request.url() === 'http://localhost:3002/todolist/one%20more%20item' &&
            request.method() === 'POST'
        ),
        page.waitForResponse(
          response =>
            response.url() === 'http://localhost:3002/todolist/one%20more%20item' &&
            response.status() === 200
        ),

        page.waitForRequest(
          request =>
            request.url() === 'http://localhost:3002/todolist' && request.method() === 'GET'
        ),
        page.waitForResponse(
          response =>
            response.url() === 'http://localhost:3002/todolist' && response.status() === 200
        ),

        await page.click('[data-hook="todolist__add-button"]')
      ]);

      page.removeListener('request', interceptRequestCallback9);
      await page.setRequestInterception(false);

      expect(await page.$('[data-hook="todolist__loader"]')).toEqual(null);
      expect(await page.$eval('[data-hook="todolist__item-text-1"]', el => el.outerHTML)).toEqual(
        '<span data-hook="todolist__item-text-1">new item </span>'
      );
      expect(
        await page.$eval('[data-hook="todolist__item-delete-button-1"]', el => el.outerHTML)
      ).toEqual('<button data-hook="todolist__item-delete-button-1">Delete</button>');
      expect(await page.$eval('[data-hook="todolist__item-text-2"]', el => el.outerHTML)).toEqual(
        '<span data-hook="todolist__item-text-2">one more item </span>'
      );
      expect(
        await page.$eval('[data-hook="todolist__item-delete-button-2"]', el => el.outerHTML)
      ).toEqual('<button data-hook="todolist__item-delete-button-2">Delete</button>');
    },
    timeout
  );
});
