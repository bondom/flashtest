const timeout = 30000;

describe('MockedTodoList', () => {
  let page;
  beforeAll(async () => {
    const context = await browser.createIncognitoBrowserContext();
    page = await context.newPage();

    // check DOM while requests are processing and mock api responses
    await page.setRequestInterception(true);
    const interceptRequestCallback1 = async interceptedRequest => {
      if (
        interceptedRequest.url() === 'http://localhost:3002/todolist-reset' &&
        interceptedRequest.method() === 'POST'
      ) {
        interceptedRequest.respond({
          status: 200,
          headers: { 'Access-Control-Allow-Origin': '*' },
          contentType: 'text/plain; charset=utf-8',
          body: 'OK'
        });
        return;
      }

      if (
        interceptedRequest.url() === 'http://localhost:3002/todolist' &&
        interceptedRequest.method() === 'GET'
      ) {
        interceptedRequest.respond({
          status: 200,
          headers: { 'Access-Control-Allow-Origin': '*' },
          contentType: 'application/json; charset=utf-8',
          body: '[{"id":1,"text":"drink water"},{"id":2,"text":"buy banana"}]'
        });
        return;
      }

      interceptedRequest.continue();
    };
    page.on('request', interceptRequestCallback1);

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

    page.removeListener('request', interceptRequestCallback1);
    await page.setRequestInterception(false);
  }, timeout);

  afterAll(async () => {
    await page.close();
  });

  it(
    'first test',
    async () => {
      // check mutations after response
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

      // check DOM while requests are processing and mock api responses
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

          interceptedRequest.respond({
            status: 200,
            headers: { 'Access-Control-Allow-Origin': '*' },
            contentType: 'text/plain; charset=utf-8',
            body: 'OK'
          });
          return;
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

          interceptedRequest.respond({
            status: 200,
            headers: { 'Access-Control-Allow-Origin': '*' },
            contentType: 'application/json; charset=utf-8',
            body: '[{"id":2,"text":"buy banana"}]'
          });
          return;
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

      // check mutations after response
      expect(await page.$('[data-hook="todolist__loader"]')).toEqual(null);
      expect(await page.$eval('[data-hook="todolist__item-text-2"]', el => el.outerHTML)).toEqual(
        '<span data-hook="todolist__item-text-2">buy banana </span>'
      );
      expect(
        await page.$eval('[data-hook="todolist__item-delete-button-2"]', el => el.outerHTML)
      ).toEqual('<button data-hook="todolist__item-delete-button-2">Delete</button>');

      // check DOM while requests are processing and mock api responses
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

          interceptedRequest.respond({
            status: 200,
            headers: { 'Access-Control-Allow-Origin': '*' },
            contentType: 'text/plain; charset=utf-8',
            body: 'OK'
          });
          return;
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

          interceptedRequest.respond({
            status: 200,
            headers: { 'Access-Control-Allow-Origin': '*' },
            contentType: 'application/json; charset=utf-8',
            body: '[]'
          });
          return;
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

      // check mutations after response
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
      await page.type('[data-hook="todolist__new-item-input"]', 'fgd');

      // check DOM while requests are processing and mock api responses
      await page.setRequestInterception(true);
      const interceptRequestCallback7 = async interceptedRequest => {
        if (
          interceptedRequest.url() === 'http://localhost:3002/todolist/fgd' &&
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

          interceptedRequest.respond({
            status: 200,
            headers: { 'Access-Control-Allow-Origin': '*' },
            contentType: 'text/plain; charset=utf-8',
            body: 'OK'
          });
          return;
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

          interceptedRequest.respond({
            status: 200,
            headers: { 'Access-Control-Allow-Origin': '*' },
            contentType: 'application/json; charset=utf-8',
            body: '[{"id":1,"text":"fgd"}]'
          });
          return;
        }

        interceptedRequest.continue();
      };
      page.on('request', interceptRequestCallback7);

      // trigger user action and wait for right request and response
      await Promise.all([
        page.waitForRequest(
          request =>
            request.url() === 'http://localhost:3002/todolist/fgd' && request.method() === 'POST'
        ),
        page.waitForResponse(
          response =>
            response.url() === 'http://localhost:3002/todolist/fgd' && response.status() === 200
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

      // check mutations after response
      expect(await page.$('[data-hook="todolist__loader"]')).toEqual(null);
      expect(await page.$eval('[data-hook="todolist__item-text-1"]', el => el.outerHTML)).toEqual(
        '<span data-hook="todolist__item-text-1">fgd </span>'
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
      await page.type('[data-hook="todolist__new-item-input"]', 'gjk');

      // check DOM while requests are processing and mock api responses
      await page.setRequestInterception(true);
      const interceptRequestCallback9 = async interceptedRequest => {
        if (
          interceptedRequest.url() === 'http://localhost:3002/todolist/gjk' &&
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

          interceptedRequest.respond({
            status: 200,
            headers: { 'Access-Control-Allow-Origin': '*' },
            contentType: 'text/plain; charset=utf-8',
            body: 'OK'
          });
          return;
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

          interceptedRequest.respond({
            status: 200,
            headers: { 'Access-Control-Allow-Origin': '*' },
            contentType: 'application/json; charset=utf-8',
            body: '[{"id":1,"text":"fgd"},{"id":2,"text":"gjk"}]'
          });
          return;
        }

        interceptedRequest.continue();
      };
      page.on('request', interceptRequestCallback9);

      // trigger user action and wait for right request and response
      await Promise.all([
        page.waitForRequest(
          request =>
            request.url() === 'http://localhost:3002/todolist/gjk' && request.method() === 'POST'
        ),
        page.waitForResponse(
          response =>
            response.url() === 'http://localhost:3002/todolist/gjk' && response.status() === 200
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

      // check mutations after response
      expect(await page.$('[data-hook="todolist__loader"]')).toEqual(null);
      expect(await page.$eval('[data-hook="todolist__item-text-1"]', el => el.outerHTML)).toEqual(
        '<span data-hook="todolist__item-text-1">fgd </span>'
      );
      expect(
        await page.$eval('[data-hook="todolist__item-delete-button-1"]', el => el.outerHTML)
      ).toEqual('<button data-hook="todolist__item-delete-button-1">Delete</button>');
      expect(await page.$eval('[data-hook="todolist__item-text-2"]', el => el.outerHTML)).toEqual(
        '<span data-hook="todolist__item-text-2">gjk </span>'
      );
      expect(
        await page.$eval('[data-hook="todolist__item-delete-button-2"]', el => el.outerHTML)
      ).toEqual('<button data-hook="todolist__item-delete-button-2">Delete</button>');

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
      await page.type('[data-hook="todolist__new-item-input"]', 'last item');

      // check DOM while requests are processing and mock api responses
      await page.setRequestInterception(true);
      const interceptRequestCallback11 = async interceptedRequest => {
        if (
          interceptedRequest.url() === 'http://localhost:3002/todolist/last%20item' &&
          interceptedRequest.method() === 'POST'
        ) {
          expect(await page.$('[data-hook="todolist__new-item-input"]')).toEqual(null);
          expect(await page.$('[data-hook="todolist__add-button"]')).toEqual(null);
          expect(await page.$('[data-hook="todolist__adding-cancel-button"]')).toEqual(null);
          expect(await page.$('[data-hook="todolist__item-text-1"]')).toEqual(null);
          expect(await page.$('[data-hook="todolist__item-delete-button-1"]')).toEqual(null);
          expect(await page.$('[data-hook="todolist__item-text-2"]')).toEqual(null);
          expect(await page.$('[data-hook="todolist__item-delete-button-2"]')).toEqual(null);
          expect(
            await page.$eval('[data-hook="todolist__add-new-button"]', el => el.disabled)
          ).toEqual(false);
          expect(await page.$eval('[data-hook="todolist__loader"]', el => el.outerHTML)).toEqual(
            '<span data-hook="todolist__loader">Loading...</span>'
          );

          interceptedRequest.respond({
            status: 200,
            headers: { 'Access-Control-Allow-Origin': '*' },
            contentType: 'text/plain; charset=utf-8',
            body: 'OK'
          });
          return;
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
          expect(await page.$('[data-hook="todolist__item-text-2"]')).toEqual(null);
          expect(await page.$('[data-hook="todolist__item-delete-button-2"]')).toEqual(null);
          expect(
            await page.$eval('[data-hook="todolist__add-new-button"]', el => el.disabled)
          ).toEqual(false);
          expect(await page.$eval('[data-hook="todolist__loader"]', el => el.outerHTML)).toEqual(
            '<span data-hook="todolist__loader">Loading...</span>'
          );

          interceptedRequest.respond({
            status: 200,
            headers: { 'Access-Control-Allow-Origin': '*' },
            contentType: 'application/json; charset=utf-8',
            body: '[{"id":1,"text":"fgd"},{"id":2,"text":"gjk"},{"id":3,"text":"last item"}]'
          });
          return;
        }

        interceptedRequest.continue();
      };
      page.on('request', interceptRequestCallback11);

      // trigger user action and wait for right request and response
      await Promise.all([
        page.waitForRequest(
          request =>
            request.url() === 'http://localhost:3002/todolist/last%20item' &&
            request.method() === 'POST'
        ),
        page.waitForResponse(
          response =>
            response.url() === 'http://localhost:3002/todolist/last%20item' &&
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

      page.removeListener('request', interceptRequestCallback11);
      await page.setRequestInterception(false);

      // check mutations after response
      expect(await page.$('[data-hook="todolist__loader"]')).toEqual(null);
      expect(await page.$eval('[data-hook="todolist__item-text-1"]', el => el.outerHTML)).toEqual(
        '<span data-hook="todolist__item-text-1">fgd </span>'
      );
      expect(
        await page.$eval('[data-hook="todolist__item-delete-button-1"]', el => el.outerHTML)
      ).toEqual('<button data-hook="todolist__item-delete-button-1">Delete</button>');
      expect(await page.$eval('[data-hook="todolist__item-text-2"]', el => el.outerHTML)).toEqual(
        '<span data-hook="todolist__item-text-2">gjk </span>'
      );
      expect(
        await page.$eval('[data-hook="todolist__item-delete-button-2"]', el => el.outerHTML)
      ).toEqual('<button data-hook="todolist__item-delete-button-2">Delete</button>');
      expect(await page.$eval('[data-hook="todolist__item-text-3"]', el => el.outerHTML)).toEqual(
        '<span data-hook="todolist__item-text-3">last item </span>'
      );
      expect(
        await page.$eval('[data-hook="todolist__item-delete-button-3"]', el => el.outerHTML)
      ).toEqual('<button data-hook="todolist__item-delete-button-3">Delete</button>');
    },
    timeout
  );
});
