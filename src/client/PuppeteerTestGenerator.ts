import Collector from './Collector';
import prepareToCodeGenerating from './prepareToCodeGenerating';
import ActionsHandler from './ActionsHandler';
import {
  isUserInteractionAction,
  isRequestAction,
  getMutationsFromActionChunks,
  isDomMutationAction
} from './helper';
import {
  ElementMarkup,
  DOMMutationAction,
  UserInteractionAction,
  RequestAction,
  ReadonlyActionsArray,
  ReadonlyChunksArray
} from './types';

import { SERVER_URI, SERVER_DEFAULT_PORT } from './Constants';

import devConsole from '../devConsole';

class PuppeteerTestGenerator {
  collector: Collector;
  actionsHandler: ActionsHandler;
  duplicateEventsArray = ['keydown', 'keypress', 'input', 'keyup'];
  addComments: boolean;
  saveToFs: boolean;
  errorsArray: string[];
  testName?: string;
  testsFolder?: string;
  serverUrl: string;
  mockApiResponses: boolean;

  constructor({
    addComments = true,
    saveToFs,
    mockApiResponses,
    indicatorQuerySelector,
    errorsArray,
    testName,
    testsFolder,
    serverPort
  }: {
    addComments: boolean;
    saveToFs: boolean;
    mockApiResponses: boolean;
    indicatorQuerySelector?: string;
    errorsArray: string[];
    testName?: string;
    testsFolder?: string;
    serverPort?: number;
  }) {
    this.saveToFs = saveToFs;
    this.actionsHandler = new ActionsHandler();
    this.addComments = addComments;
    this.testName = testName;
    this.testsFolder = testsFolder;
    this.serverUrl = `http://localhost:${serverPort || SERVER_DEFAULT_PORT}/${SERVER_URI}`;
    this.mockApiResponses = mockApiResponses;
    this.collector = new Collector({
      indicatorQuerySelector,
      errorsArray,
      serverUrl: this.serverUrl
    });
  }

  start() {
    this.collector.start();
  }

  finish(): Promise<void | Error> {
    return this.transformDataAndGenerateCode().then(generatedCode => {
      if (this.saveToFs) {
        return this.saveFile(generatedCode);
      } else {
        /* eslint-disable no-console */
        console.log('saveToFs is false, so code is output to console: ');
        console.log(generatedCode);
        return;
        /* eslint-enable no-console */
      }
    });
  }

  private saveFile(generatedCode: string): Promise<void | Error> {
    const url = this.collector.url;
    return fetch(this.serverUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        code: generatedCode,
        testsFolder: this.testsFolder,
        fileName: url.slice(url.lastIndexOf('/') + 1)
      })
    })
      .then((res: any) => {
        if (res.status === 200) {
          return new Promise<void>(resolve => {
            resolve();
          });
        }
        return Promise.reject(res);
      })
      .catch((error: Error) => {
        /* eslint-disable no-console */
        console.warn('Because of error occured when saving file, code is output to console: ');
        console.log(generatedCode);
        /* eslint-enable no-console */
        return Promise.reject(error);
      });
  }

  private async transformDataAndGenerateCode() {
    this.collector.finish();
    const { actions, initialMarkup, url } = this.collector;
    if (actions.length === 0) {
      throw new Error(
        'Actions array is empty, test will be empty, please reload page and interact with elements on page'
      );
    }

    const actionChunks: ReadonlyChunksArray = await this.actionsHandler.handle(actions);
    const preparedActionChunks = prepareToCodeGenerating(actionChunks);

    const generatedCode = this.generateCode(preparedActionChunks, initialMarkup, url);
    devConsole.log('Generated code: ', generatedCode);
    return generatedCode;
  }

  generateCode(
    actionChunks: ReadonlyChunksArray,
    initMarkups: ElementMarkup[],
    url: string
  ): string {
    const firstChunk = actionChunks[0];

    let gotoCode = '';
    let testCaseCode = '';
    // if some async requests are called on initial render of page
    if (
      firstChunk.some(isRequestAction) &&
      firstChunk.filter(isUserInteractionAction).length === 0
    ) {
      const requestActions = firstChunk.filter(isRequestAction);

      const initMarkupsThatChangedInFirstChunk = this.getInitMarkupThatChanged(
        initMarkups,
        firstChunk.filter(isDomMutationAction)
      );

      // TODO: check markup of elements when request is being sent on initial render
      // let initialMarkupCode = '';
      // initMarkupsThatChangedInFirstChunk.forEach(markup => {
      //   initialMarkupCode += `
      //     expect(
      //       await page.$eval('[data-hook="${markup.dataHook}"]', el => el.outerHTML)
      //     ).toEqual(
      //       '${markup.outerHTML}'
      //     ),
      //   `;
      // });
      // initialMarkupCode += '\n';

      gotoCode = this.generateCodeToWaitRequests(requestActions, `await page.goto('${url}')`);
      const initMarkupsWhichNotChecked = initMarkups.filter(
        markup =>
          typeof initMarkupsThatChangedInFirstChunk.find(
            firstChunkMarkup => firstChunkMarkup.dataHook === markup.dataHook
          ) === 'undefined'
      );
      testCaseCode = this.generateTestCaseCode(actionChunks, initMarkupsWhichNotChecked);
    } else {
      gotoCode = `await page.goto('${url}');`;
      testCaseCode = this.generateTestCaseCode(actionChunks, initMarkups);
    }

    // prettier-ignore
    const code = `
    const timeout = 30000;

    describe(
      '${this.testName ? this.testName : this.getTestName(url)}',
      () => {
        let page;
        beforeAll(async () => {
          page = await global.browser.newPage();
          ${gotoCode}
        }, timeout);

        afterAll(async () => {
          await page.close();
        });

        it(
          'first test',
           async () => {
            ${testCaseCode}
           },
          timeout
        );
      }
    );
    `;
    return code;
  }

  private getTestName(url: string): string {
    const pathname = url.slice(url.lastIndexOf('/') + 1);
    return pathname[0].toUpperCase() + pathname.slice(1);
  }

  private getInitMarkupThatChanged(
    initMarkups: ElementMarkup[],
    mutations: DOMMutationAction[]
  ): ElementMarkup[] {
    return initMarkups.filter(markup =>
      mutations.some(action => action.dataHook === markup.dataHook && action.type !== 'attributes')
    );
  }

  private generateTestCaseCode(actionChunks: ReadonlyChunksArray, initMarkups: ElementMarkup[]) {
    const allMutations: DOMMutationAction[] = getMutationsFromActionChunks(actionChunks);

    const initMarkupsThatChanged = this.getInitMarkupThatChanged(initMarkups, allMutations);

    let code = '';

    // TODO: should check on start elements which were added to DOM later
    // but it is not high priority

    if (initMarkupsThatChanged.length > 0 && this.addComments) {
      code += `// check initial outerHTML of elements`;
    }
    // add initial markup expectations
    initMarkupsThatChanged.forEach(markup => {
      code += `
        expect(
          await page.$eval('[data-hook="${markup.dataHook}"]', el => el.outerHTML)
        ).toEqual(
          '${markup.outerHTML}'
        );
      `;
    });
    code += '\n';
    // Traverse action chunks and generate code
    actionChunks.forEach((chunk, index) => {
      if (chunk.filter(isRequestAction).length === 0) {
        code += this.generateCodeForSyncActionChunk(chunk, index, actionChunks);
      } else {
        code += this.generateCodeForAsyncActionChunk(chunk, index, actionChunks);
      }
    });

    return code;
  }

  private generateCodeToWaitRequests(
    requestActions: RequestAction[],
    causeOfRequestsCode: string
  ): string {
    return `
      ${this.addComments ? '\n// trigger user action and wait for right request and response' : ''}
      await Promise.all([
      ${requestActions
        .map(
          requestAction => `
        page.waitForRequest(
          request =>
            request.url() === '${requestAction.url}' &&
            request.method() === '${requestAction.method}'
        ),
        page.waitForResponse(
          response =>
            response.url() === '${requestAction.url}' &&
            response.status() === ${requestAction.response.status}
        ),
      `
        )
        .join('\n')}
        ${causeOfRequestsCode}
    ]);
    `;
  }

  private generateCodeToExecuteUserAction(
    interaction: UserInteractionAction,
    addSemicolon: boolean = true,
    causedAsyncRequest: boolean = false
  ): string {
    let code = '';
    switch (interaction.eventName) {
      case 'input': {
        if (interaction.tagName === 'SELECT') {
          code += `await page.select('[data-hook="${interaction.dataHook}"]', '${
            interaction.value
          }')`;
        } else {
          code += `await page.type('[data-hook="${interaction.dataHook}"]', '${
            // for user typings which caused async requests use inputData, i.e last entered symbol
            causedAsyncRequest ? interaction.inputData : interaction.value
          }')`;
        }
        break;
      }

      case 'click': {
        code += `await page.click('[data-hook="${interaction.dataHook}"]')`;
        break;
      }

      case 'focus': {
        code += `await page.focus('[data-hook="${interaction.dataHook}"]')`;
        break;
      }

      case 'blur': {
        code += `await page.evaluate(() => {
          document.querySelector('[data-hook="${interaction.dataHook}"]').blur()
        })`;
        break;
      }
      default:
        throw new Error(`Unsupported interaction type ${interaction.eventName}`);
    }

    code += `${addSemicolon ? ';' : ''}\n\n`;
    return code;
  }

  private generateCodeToCheckMutationsAfterInteraction(mutations: DOMMutationAction[]): string {
    let code = '';
    mutations.forEach(mutation => {
      if (mutation.type === 'attributes') {
        code += `expect(await page.$eval('[data-hook="${mutation.dataHook}"]', el => el.${
          mutation.attributeName
        })).toEqual(${mutation.value});`;
      } else if (mutation.type === 'childList-removed-node') {
        code += `expect(
            await page.$('[data-hook="${mutation.dataHook}"]')
          ).toEqual(null);`;
      } else {
        code += `expect(
            await page.$eval('[data-hook="${mutation.dataHook}"]', el => el.${
          mutation.htmlType === 'outer' ? 'outerHTML' : 'innerHTML'
        })
          ).toEqual(
            '${mutation.HTML}'
          );`;
      }
    });
    code += '\n';
    return code;
  }

  private generateCodeToCheckMutationsBeforeInteraction(
    mutations: DOMMutationAction[],
    actionChunks: ReadonlyChunksArray,
    index: number
  ): string {
    const previousMutations = getMutationsFromActionChunks(actionChunks.slice(0, index));
    const mutationsToBeChecked = mutations
      .filter(mutation => mutation.type === 'attributes' && !mutation.raisedByRequest)
      .filter(mutation => {
        // filter mutations which were already checked in one of the previous mutations
        return !previousMutations.some(
          prevMutation =>
            prevMutation.dataHook === mutation.dataHook &&
            prevMutation.attributeName === mutation.attributeName
        );
      });

    const chunkInteraction = actionChunks[index].find(isUserInteractionAction);
    let code = '';
    if (mutationsToBeChecked.length > 0 && this.addComments && chunkInteraction) {
      code += `\n\n// check attributes before '${chunkInteraction.eventName}' on '[data-hook="${
        chunkInteraction.dataHook
      }"]' element`;
    }
    mutationsToBeChecked.forEach(mutation => {
      if (mutation.type === 'attributes') {
        code += `
              expect(await page.$eval('[data-hook="${mutation.dataHook}"]', el => el.${
          mutation.attributeName
        })).toEqual(${mutation.oldValue});`;
      }
    });
    code += '\n\n';
    return code;
  }

  private generateCodeForSyncActionChunk(
    chunk: ReadonlyActionsArray,
    index: number,
    actionChunks: ReadonlyChunksArray
  ): string {
    let code = '';

    const mutations: DOMMutationAction[] = chunk.filter(isDomMutationAction);

    // generate code to check values before interaction(user action)
    code += this.generateCodeToCheckMutationsBeforeInteraction(mutations, actionChunks, index);

    const interaction: UserInteractionAction = chunk.find(isUserInteractionAction)!;

    if (this.addComments) {
      code += `\n\n// user action${
        mutations.length === 0 ? '(this action caused no changes)' : ''
      }\n`;
    }
    // generate code to execute user action
    code += this.generateCodeToExecuteUserAction(interaction);

    if (this.addComments && mutations.length > 0) {
      code += `\n\n// check elements after '${interaction.eventName}' on '[data-hook="${
        interaction.dataHook
      }"] element'\n`;
    }
    // generate code to check values after interaction(user action)
    code += this.generateCodeToCheckMutationsAfterInteraction(mutations);
    return code;
  }

  private generateCodeForAsyncActionChunk(
    chunk: ReadonlyActionsArray,
    index: number,
    actionChunks: ReadonlyChunksArray
  ): string {
    let code = '';

    const mutations: DOMMutationAction[] = chunk.filter(isDomMutationAction);

    // generate code to check values before interaction(user action)
    code += this.generateCodeToCheckMutationsBeforeInteraction(mutations, actionChunks, index);

    const requestActions: RequestAction[] = chunk.filter(isRequestAction);
    const mutationsRaisedByUserInteraction = mutations.filter(
      mutation => !mutation.raisedByRequest
    );

    devConsole.log('mutationsRaisedByUserInteraction: ', mutationsRaisedByUserInteraction);
    const callbackName = `interceptRequestCallback${requestActions[0].id}`;

    // TODO: change
    if (mutationsRaisedByUserInteraction.length > 0) {
      code += `
        ${this.addComments ? '// check DOM while requests are processing' : ''}
        await page.setRequestInterception(true);
        const ${callbackName} = async interceptedRequest => {
          ${requestActions
            .map(
              requestAction => `
              if (
                interceptedRequest.url() === '${requestAction.url}' &&
                interceptedRequest.method() === '${requestAction.method}'
              ) {
                ${this.generateCodeToCheckMutationsAfterInteraction(
                  mutationsRaisedByUserInteraction
                )}
                ${this.mockApiResponses ? this.generateCodeToMockResponse(requestAction) : ''}
            };
            `
            )
            .join('\n')}
        ${!this.mockApiResponses ? 'interceptedRequest.continue();' : ''}
        };
        page.on('request', ${callbackName});
      `;
    }

    const userInteraction: UserInteractionAction | undefined = chunk.find(isUserInteractionAction)!;

    if (index === 0 && typeof userInteraction === 'undefined') {
      // if it is first chunk with async requests raised without user interaction
    } else {
      code += this.generateCodeToWaitRequests(
        requestActions,
        this.generateCodeToExecuteUserAction(userInteraction, false, true)
      );
    }

    if (mutationsRaisedByUserInteraction.length > 0) {
      code += `
        page.removeListener('request', ${callbackName});
        await page.setRequestInterception(false);\n\n
      `;
    }

    const mutationsRaisedByRequest: DOMMutationAction[] = chunk.filter(
      mutation => isDomMutationAction(mutation) && mutation.raisedByRequest
    ) as DOMMutationAction[];

    code += this.generateCodeToCheckMutationsAfterInteraction(mutationsRaisedByRequest);

    return code;
  }

  private generateCodeToMockResponse(requestAction: RequestAction): string {
    const response = requestAction.response;

    const headers = { ...response.headers };
    delete headers['content-type'];

    // by default we can't read Access-Control-Allow-Origin header from Response's header,
    // (Access-Control-Expose-Headers header should be set)
    // so we suppose that every response has this header set
    headers['Access-Control-Allow-Origin'] = '*';

    return `interceptedRequest.respond({
      status: ${response.status},
      headers: ${JSON.stringify(headers)},
      contentType: ${response.contentType},
      body: ${response.body}
    })`;
  }
}

export default PuppeteerTestGenerator;
