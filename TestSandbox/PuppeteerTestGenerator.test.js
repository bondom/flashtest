/* eslint-disable no-console */
import PuppeteerTestGenerator from '../src/client/PuppeteerTestGenerator';
import { readTestContent, formatCode } from './testUtils';

import {
  actions as mergedClickFocusActions,
  initMarkups as mergedClickFocusInitMarkups
} from './test-data/MergedClickFocus-data';

import {
  actions as mergedClickBlurActions,
  initMarkups as mergedClickBlurInitMarkups
} from './test-data/MergedClickBlur-data';

import {
  actions as dynamicallyAddedButtonActions,
  initMarkups as dynamicallyAddedButtonInitMarkups
} from './test-data/DynamicallyAddedButton-data';

import {
  actions as removedTextNodeActions,
  initMarkups as removedTextNodeInitMarkups
} from './test-data/RemovedTextNode-data';

import {
  actions as removedElementActions,
  initMarkups as removedElementInitMarkups
} from './test-data/RemovedElement-data';

import { actions as inputActions, initMarkups as inputInitMarkups } from './test-data/Input-data';

import {
  actions as inputNumberActions,
  initMarkups as inputNumberInitMarkups
} from './test-data/InputNumber-data';

import {
  actions as buttonActions,
  initMarkups as buttonInitMarkups
} from './test-data/Button-data';

import {
  actions as buttonComplexActions,
  initMarkups as buttonComplexInitMarkups
} from './test-data/ButtonComplex-data';

import {
  actions as buttonMousedownActions,
  initMarkups as buttonMousedownInitMarkups
} from './test-data/ButtonMousedown-data';

import {
  actions as textareaActions,
  initMarkups as textareaInitMarkups
} from './test-data/Textarea-data';

import {
  actions as inputAndButtonActions,
  initMarkups as inputAndButtonInitMarkups
} from './test-data/InputButtonSpan-data';

import {
  actions as loginFormActions,
  initMarkups as loginFormInitMarkups
} from './test-data/LoginForm-data';

import {
  actions as inputEnhancedActions,
  initMarkups as inputEnhancedInitMarkups
} from './test-data/InputEnhanced-data';

import {
  actions as inputKeyEventsActions,
  initMarkups as inputKeyEventsInitMarkups
} from './test-data/InputKeyEvents-data';

import {
  actions as inputCheckboxActions,
  initMarkups as inputCheckboxInitMarkups
} from './test-data/InputCheckbox-data';

import {
  actions as inputRadioActions,
  initMarkups as inputRadioInitMarkups
} from './test-data/InputRadio-data';

import {
  actions as asyncButtonActions,
  initMarkups as asyncButtonInitMarkups
} from './test-data/AsyncButton-data';

import {
  actions as asyncButtonTwoClicksActions,
  initMarkups as asyncButtonTwoClicksInitMarkups
} from './test-data/AsyncButton__TwoClicks-data';

import {
  actions as asyncButtonComplexActions,
  initMarkups as asyncButtonComplexInitMarkups
} from './test-data/AsyncButtonComplex-data';

import {
  actions as asyncRequestOnMountActions,
  initMarkups as asyncRequestOnMountInitMarkups
} from './test-data/AsyncRequestOnMount-data';

import {
  actions as asyncButtonTwoRequestsOnClickActions,
  initMarkups as asyncButtonTwoRequestsOnClickMarkups
} from './test-data/AsyncButtonTwoRequestsOnClick-data';

import {
  actions as asyncButtonTwoRequestsOneByOneActions,
  initMarkups as asyncButtonTwoRequestsOneByOneInitMarkups
} from './test-data/AsyncButtonTwoRequestsOneByOne-data';

import {
  actions as asyncKeydownActions,
  initMarkups as asyncKeydownInitMarkups
} from './test-data/AsyncKeydown-data';

import {
  actions as asyncFormActions,
  initMarkups as asyncFormInitMarkups
} from './test-data/AsyncForm-data';

import {
  actions as asyncInputSlowTypingsActions,
  initMarkups as asyncInputSlowTypingsInitMarkups
} from './test-data/AsyncInputSlowTypings-data';

import {
  actions as delayedButtonActions,
  initMarkups as delayedButtonInitMarkups
} from './test-data/DelayedButton-data';

import {
  actions as nestedDivInsideDivActions,
  initMarkups as nestedDivInsideDivInitMarkups
} from './test-data/NestedDivInsideDiv-data';

import {
  actions as nestedInputInsideDivActions,
  initMarkups as nestedInputInsideDivInitMarkups
} from './test-data/NestedInputInsideDiv-data';

import {
  actions as childListMutationActions,
  initMarkups as childListMutationInitMarkups
} from './test-data/ChildListMutation-data';

import {
  actions as nestedComplexComponentActions,
  initMarkups as nestedComplexComponentInitMarkups
} from './test-data/NestedComplexComponent-data';

import {
  actions as selectActions,
  initMarkups as selectInitMarkups
} from './test-data/Select-data';

import {
  actions as selectMissClickActions,
  initMarkups as selectMissClickInitMarkups
} from './test-data/SelectMissClick-data';

import {
  actions as registrationFormActions,
  initMarkups as registrationFormInitMarkups
} from './test-data/RegistrationForm-data';

import {
  actions as registrationFormFirstSubmitFailureActions,
  initMarkups as registrationFormFirstSubmitFailureInitMarkups
} from './test-data/RegistrationFormFirstSubmitFailure-data';

import {
  actions as todoListActions,
  initMarkups as todoListInitMarkups
} from './test-data/TodoList-data';

describe('PuppeteerTestGenerator.transformDataAndGenerateCode', () => {
  test('merged click and focus actions', async () => {
    const testGenerator = new PuppeteerTestGenerator({
      testName: 'MergedClickFocus',
      addComments: true
    });
    testGenerator.collector.url = 'http://localhost:8001/mergedClickFocus';
    testGenerator.collector.initialMarkup = mergedClickFocusInitMarkups;
    testGenerator.collector.actions = mergedClickFocusActions;

    const code = await testGenerator.transformDataAndGenerateCode();
    const mergedClickFocusExpectedCode = await readTestContent(
      'PuppeteerTestGenerator-MergedClickFocus.unused.js'
    );
    expect(formatCode(code)).toEqual(formatCode(mergedClickFocusExpectedCode));
  });

  test('merged click and blur actions', async () => {
    const testGenerator = new PuppeteerTestGenerator({
      testName: 'MergedClickBlur',
      addComments: true
    });
    testGenerator.collector.url = 'http://localhost:8001/mergedClickBlur';
    testGenerator.collector.initialMarkup = mergedClickBlurInitMarkups;
    testGenerator.collector.actions = mergedClickBlurActions;

    const code = await testGenerator.transformDataAndGenerateCode();
    const mergedClickBlurExpectedCode = await readTestContent(
      'PuppeteerTestGenerator-MergedClickBlur.unused.js'
    );
    expect(formatCode(code)).toEqual(formatCode(mergedClickBlurExpectedCode));
  });

  test(`dynamically added button: when new element with data-hook is added on page, 
          event listener is added to this element`, async () => {
    const testGenerator = new PuppeteerTestGenerator({
      testName: 'DynamicallyAddedButton',
      addComments: true
    });
    testGenerator.collector.url = 'http://localhost:8001/dynamicallyAddedButton';
    testGenerator.collector.initialMarkup = dynamicallyAddedButtonInitMarkups;
    testGenerator.collector.actions = dynamicallyAddedButtonActions;

    const code = await testGenerator.transformDataAndGenerateCode();
    const dynamicallyAddedButtonExpectedCode = await readTestContent(
      'PuppeteerTestGenerator-DynamicallyAddedButton.unused.js'
    );
    expect(formatCode(code)).toEqual(formatCode(dynamicallyAddedButtonExpectedCode));
  });

  test(`removed text node: outerHTML of wrapper div is checked when text node inside this div is deleted`, async () => {
    const testGenerator = new PuppeteerTestGenerator({
      testName: 'RemovedTextNode',
      addComments: true
    });
    testGenerator.collector.url = 'http://localhost:8001/removedTextNode';
    testGenerator.collector.initialMarkup = removedTextNodeInitMarkups;
    testGenerator.collector.actions = removedTextNodeActions;

    const code = await testGenerator.transformDataAndGenerateCode();
    const removedTextNodeExpectedCode = await readTestContent(
      'PuppeteerTestGenerator-RemovedTextNode.unused.js'
    );
    expect(formatCode(code)).toEqual(formatCode(removedTextNodeExpectedCode));
  });

  test(`removed element: after div is deleted, code checks if it doesn't exist`, async () => {
    const testGenerator = new PuppeteerTestGenerator({
      testName: 'RemovedElement',
      addComments: true
    });
    testGenerator.collector.url = 'http://localhost:8001/removedElement';
    testGenerator.collector.initialMarkup = removedElementInitMarkups;
    testGenerator.collector.actions = removedElementActions;

    const code = await testGenerator.transformDataAndGenerateCode();
    const removedElementExpectedCode = await readTestContent(
      'PuppeteerTestGenerator-RemovedElement.unused.js'
    );
    expect(formatCode(code)).toEqual(formatCode(removedElementExpectedCode));
  });

  test('input', async () => {
    const testGenerator = new PuppeteerTestGenerator({
      testName: 'Input',
      addComments: false
    });
    testGenerator.collector.url = 'http://localhost:8001/input';
    testGenerator.collector.initialMarkup = inputInitMarkups;
    testGenerator.collector.actions = inputActions;

    const code = await testGenerator.transformDataAndGenerateCode();
    const inputExpectedCode = await readTestContent('PuppeteerTestGenerator-Input.unused.js');
    expect(formatCode(code)).toEqual(formatCode(inputExpectedCode));
  });

  test('input number: DOM changes in right way when input event is triggered', async () => {
    const testGenerator = new PuppeteerTestGenerator({
      testName: 'InputNumber',
      addComments: false
    });
    testGenerator.collector.url = 'http://localhost:8001/inputNumber';
    testGenerator.collector.initialMarkup = inputNumberInitMarkups;
    testGenerator.collector.actions = inputNumberActions;

    const code = await testGenerator.transformDataAndGenerateCode();
    const inputNumberExpectedCode = await readTestContent(
      'PuppeteerTestGenerator-InputNumber.unused.js'
    );
    expect(formatCode(code)).toEqual(formatCode(inputNumberExpectedCode));
  });

  test('button: DOM changes when button is clicked', async () => {
    const testGenerator = new PuppeteerTestGenerator({
      testName: 'Button',
      addComments: false
    });
    testGenerator.collector.url = 'http://localhost:8001/button';
    testGenerator.collector.initialMarkup = buttonInitMarkups;
    testGenerator.collector.actions = buttonActions;

    const code = await testGenerator.transformDataAndGenerateCode();
    const buttonExpectedCode = await readTestContent('PuppeteerTestGenerator-Button.unused.js');
    expect(formatCode(code)).toEqual(formatCode(buttonExpectedCode));
  });

  test('button mousedown: DOM changes when button is clicked(DOM change function is linked to mousedown event)', async () => {
    const testGenerator = new PuppeteerTestGenerator({
      testName: 'ButtonMousedown',
      addComments: false
    });
    testGenerator.collector.url = 'http://localhost:8001/buttonMousedown';
    testGenerator.collector.initialMarkup = buttonMousedownInitMarkups;
    testGenerator.collector.actions = buttonMousedownActions;

    const code = await testGenerator.transformDataAndGenerateCode();

    const buttonMousedownExpectedCode = await readTestContent(
      'PuppeteerTestGenerator-ButtonMousedown.unused.js'
    );
    expect(formatCode(code)).toEqual(formatCode(buttonMousedownExpectedCode));
  });

  test('button complex: DOM changes when button is clicked, all 4 events change DOM: focus, mousedown, mouseup, click', async () => {
    const testGenerator = new PuppeteerTestGenerator({
      testName: 'ButtonComplex',
      addComments: false
    });
    testGenerator.collector.url = 'http://localhost:8001/buttonComplex';
    testGenerator.collector.initialMarkup = buttonComplexInitMarkups;
    testGenerator.collector.actions = buttonComplexActions;

    const code = await testGenerator.transformDataAndGenerateCode();
    const buttonComplexExpectedCode = await readTestContent(
      'PuppeteerTestGenerator-ButtonComplex.unused.js'
    );
    expect(formatCode(code)).toEqual(formatCode(buttonComplexExpectedCode));
  });

  test('textarea: outerHTML of textarea is checked when value is entered', async () => {
    const testGenerator = new PuppeteerTestGenerator({
      testName: 'Textarea',
      addComments: false
    });
    testGenerator.collector.url = 'http://localhost:8001/textarea';
    testGenerator.collector.initialMarkup = textareaInitMarkups;
    testGenerator.collector.actions = textareaActions;

    const code = await testGenerator.transformDataAndGenerateCode();
    const textareaExpectedCode = await readTestContent('PuppeteerTestGenerator-Textarea.unused.js');
    expect(formatCode(code)).toEqual(formatCode(textareaExpectedCode));
  });

  test('input, button, span', async () => {
    const testGenerator = new PuppeteerTestGenerator({
      testName: 'InputButtonSpan',
      addComments: false
    });
    testGenerator.collector.url = 'http://localhost:8001/inputBtnSpan';
    testGenerator.collector.initialMarkup = inputAndButtonInitMarkups;
    testGenerator.collector.actions = inputAndButtonActions;

    const code = await testGenerator.transformDataAndGenerateCode();
    const inputAndButtonExpectedCode = await readTestContent(
      'PuppeteerTestGenerator-InputButtonSpan.unused.js'
    );
    expect(formatCode(code)).toEqual(formatCode(inputAndButtonExpectedCode));
  });

  test('login form: login and password fields, classNames, success msg on btn click', async () => {
    const testGenerator = new PuppeteerTestGenerator({
      testName: 'LoginForm',
      addComments: false
    });
    testGenerator.collector.url = 'http://localhost:8001/login';
    testGenerator.collector.initialMarkup = loginFormInitMarkups;
    testGenerator.collector.actions = loginFormActions;

    const code = await testGenerator.transformDataAndGenerateCode();
    const loginFormExpectedCode = await readTestContent(
      'PuppeteerTestGenerator-LoginForm.unused.js'
    );
    expect(formatCode(code)).toEqual(formatCode(loginFormExpectedCode));
  });

  test('input enhanced: two inputs with onBlur, onFocus, onKeyDown, onKeyPress callbacks', async () => {
    const testGenerator = new PuppeteerTestGenerator({
      testName: 'InputEnhanced',
      addComments: false
    });
    testGenerator.collector.url = 'http://localhost:8001/inputEnhanced';
    testGenerator.collector.initialMarkup = inputEnhancedInitMarkups;
    testGenerator.collector.actions = inputEnhancedActions;

    const code = await testGenerator.transformDataAndGenerateCode();
    const inputEnhancedExpectedCode = await readTestContent(
      'PuppeteerTestGenerator-InputEnhanced.unused.js'
    );
    expect(formatCode(code)).toEqual(formatCode(inputEnhancedExpectedCode));
  });

  test('input key events: keypress, keyup, keydown', async () => {
    const testGenerator = new PuppeteerTestGenerator({
      testName: 'InputKeyEvents',
      addComments: false
    });
    testGenerator.collector.url = 'http://localhost:8001/inputKeyEvents';
    testGenerator.collector.initialMarkup = inputKeyEventsInitMarkups;
    testGenerator.collector.actions = inputKeyEventsActions;

    const code = await testGenerator.transformDataAndGenerateCode();
    const inputKeyEventsExpectedCode = await readTestContent(
      'PuppeteerTestGenerator-InputKeyEvents.unused.js'
    );
    expect(formatCode(code)).toEqual(formatCode(inputKeyEventsExpectedCode));
  });

  test('input checkbox: content of div changes when checkbox is checked and unchecked', async () => {
    const testGenerator = new PuppeteerTestGenerator({
      testName: 'InputCheckbox',
      addComments: false
    });
    testGenerator.collector.url = 'http://localhost:8001/inputCheckbox';
    testGenerator.collector.initialMarkup = inputCheckboxInitMarkups;
    testGenerator.collector.actions = inputCheckboxActions;

    const code = await testGenerator.transformDataAndGenerateCode();
    const inputCheckboxExpectedCode = await readTestContent(
      'PuppeteerTestGenerator-InputCheckbox.unused.js'
    );
    expect(formatCode(code)).toEqual(formatCode(inputCheckboxExpectedCode));
  });

  test('input radio: content of div changes when another radio input is selected', async () => {
    const testGenerator = new PuppeteerTestGenerator({
      testName: 'InputRadio',
      addComments: false
    });
    testGenerator.collector.url = 'http://localhost:8001/inputRadio';
    testGenerator.collector.initialMarkup = inputRadioInitMarkups;
    testGenerator.collector.actions = inputRadioActions;

    const code = await testGenerator.transformDataAndGenerateCode();
    const inputRadioExpectedCode = await readTestContent(
      'PuppeteerTestGenerator-InputRadio.unused.js'
    );
    expect(formatCode(code)).toEqual(formatCode(inputRadioExpectedCode));
  });

  test('async keydown: request is sent when keydown event is fired on input, result of request changes DOM', async () => {
    const testGenerator = new PuppeteerTestGenerator({
      testName: 'AsyncKeydown',
      addComments: false
    });
    testGenerator.collector.url = 'http://localhost:8001/asyncKeydown';
    testGenerator.collector.initialMarkup = asyncKeydownInitMarkups;
    testGenerator.collector.actions = asyncKeydownActions;

    const code = await testGenerator.transformDataAndGenerateCode();
    const asyncKeydownExpectedCode = await readTestContent(
      'PuppeteerTestGenerator-AsyncKeydown.unused.js'
    );
    expect(formatCode(code)).toEqual(formatCode(asyncKeydownExpectedCode));
  });

  test('async button: request is sent when button is clicked, result of request changes DOM', async () => {
    const testGenerator = new PuppeteerTestGenerator({
      testName: 'AsyncButton',
      addComments: false
    });
    testGenerator.collector.url = 'http://localhost:8001/asyncButton';
    testGenerator.collector.initialMarkup = asyncButtonInitMarkups;
    testGenerator.collector.actions = asyncButtonActions;

    const code = await testGenerator.transformDataAndGenerateCode();
    const asyncButtonExpectedCode = await readTestContent(
      'PuppeteerTestGenerator-AsyncButton.unused.js'
    );
    expect(formatCode(code)).toEqual(formatCode(asyncButtonExpectedCode));
  });

  test('async button(two clicks): request is sent when button is clicked, result of request changes DOM, the same for second click', async () => {
    const testGenerator = new PuppeteerTestGenerator({
      testName: 'AsyncButton__TwoClicks',
      addComments: false
    });
    testGenerator.collector.url = 'http://localhost:8001/asyncButton';
    testGenerator.collector.initialMarkup = asyncButtonTwoClicksInitMarkups;
    testGenerator.collector.actions = asyncButtonTwoClicksActions;

    const code = await testGenerator.transformDataAndGenerateCode();
    const asyncButtonTwoClicksExpectedCode = await readTestContent(
      'PuppeteerTestGenerator-AsyncButton__TwoClicks.unused.js'
    );
    expect(formatCode(code)).toEqual(formatCode(asyncButtonTwoClicksExpectedCode));
  });

  test('async request on mount: on initial render request is sent, result of request changes DOM', async () => {
    const testGenerator = new PuppeteerTestGenerator({
      testName: 'AsyncRequestOnMount',
      addComments: false
    });
    testGenerator.collector.url = 'http://localhost:8001/asyncRequestOnMount';
    testGenerator.collector.initialMarkup = asyncRequestOnMountInitMarkups;
    testGenerator.collector.actions = asyncRequestOnMountActions;

    const code = await testGenerator.transformDataAndGenerateCode();
    const asyncRequestOnMountExpectedCode = await readTestContent(
      'PuppeteerTestGenerator-AsyncRequestOnMount.unused.js'
    );
    expect(formatCode(code)).toEqual(formatCode(asyncRequestOnMountExpectedCode));
  });

  test('async button, two requests on click: two requests are sent when button is clicked, DOM changes', async () => {
    const testGenerator = new PuppeteerTestGenerator({
      testName: 'AsyncButtonTwoRequestsOnClick',
      addComments: false
    });
    testGenerator.collector.url = 'http://localhost:8001/asyncButtonTwoRequestsOnClick';
    testGenerator.collector.initialMarkup = asyncButtonTwoRequestsOnClickMarkups;
    testGenerator.collector.actions = asyncButtonTwoRequestsOnClickActions;

    const code = await testGenerator.transformDataAndGenerateCode();
    const asyncButtonTwoRequestsOnClickExpectedCode = await readTestContent(
      'PuppeteerTestGenerator-AsyncButtonTwoRequestsOnClick.unused.js'
    );
    expect(formatCode(code)).toEqual(formatCode(asyncButtonTwoRequestsOnClickExpectedCode));
  });

  test('async button, two requests one by one on click', async () => {
    const testGenerator = new PuppeteerTestGenerator({
      testName: 'AsyncButtonTwoRequestsOneByOne',
      addComments: false
    });
    testGenerator.collector.url = 'http://localhost:8001/asyncButtonTwoRequestsOneByOne';
    testGenerator.collector.initialMarkup = asyncButtonTwoRequestsOneByOneInitMarkups;
    testGenerator.collector.actions = asyncButtonTwoRequestsOneByOneActions;

    const code = await testGenerator.transformDataAndGenerateCode();
    const asyncButtonTwoRequestsOneByOneExpectedCode = await readTestContent(
      'PuppeteerTestGenerator-AsyncButtonTwoRequestsOneByOne.unused.js'
    );
    expect(formatCode(code)).toEqual(formatCode(asyncButtonTwoRequestsOneByOneExpectedCode));
  });

  test(`async button complex, when button is clicked two requests are sent:
          1) first is sent when keydown event is triggered
          2) second is sent when click event is triggered`, async () => {
    const testGenerator = new PuppeteerTestGenerator({
      testName: 'AsyncButtonComplex',
      addComments: false
    });
    testGenerator.collector.url = 'http://localhost:8001/asyncButtonComplex';
    testGenerator.collector.initialMarkup = asyncButtonComplexInitMarkups;
    testGenerator.collector.actions = asyncButtonComplexActions;

    const code = await testGenerator.transformDataAndGenerateCode();
    const asyncButtonComplexExpectedCode = await readTestContent(
      'PuppeteerTestGenerator-AsyncButtonComplex.unused.js'
    );
    expect(formatCode(code)).toEqual(formatCode(asyncButtonComplexExpectedCode));
  });

  test(`async form: 
          1) value is entered in input, 
          2) first button is clicked => first request is sent to server => request finished => DOM changes
          3) second button is clicked => second request is sent to server => request finished => DOM changes`, async () => {
    const testGenerator = new PuppeteerTestGenerator({
      testName: 'AsyncForm',
      addComments: false
    });
    testGenerator.collector.url = 'http://localhost:8001/asyncForm';
    testGenerator.collector.initialMarkup = asyncFormInitMarkups;
    testGenerator.collector.actions = asyncFormActions;

    const code = await testGenerator.transformDataAndGenerateCode();
    const asyncFormExpectedCode = await readTestContent(
      'PuppeteerTestGenerator-AsyncForm.unused.js'
    );
    expect(formatCode(code)).toEqual(formatCode(asyncFormExpectedCode));
  });

  test(`async input slow typings: on every entered symbol request is sent,
          user enters next symbol only after previous request is done`, async () => {
    const testGenerator = new PuppeteerTestGenerator({
      testName: 'AsyncInputSlowTypings',
      addComments: true
    });
    testGenerator.collector.url = 'http://localhost:8001/asyncInput';
    testGenerator.collector.initialMarkup = asyncInputSlowTypingsInitMarkups;
    testGenerator.collector.actions = asyncInputSlowTypingsActions;

    const code = await testGenerator.transformDataAndGenerateCode();
    const asyncInputSlowTypingsExpectedCode = await readTestContent(
      'PuppeteerTestGenerator-AsyncInputSlowTypings.unused.js'
    );
    expect(formatCode(code)).toEqual(formatCode(asyncInputSlowTypingsExpectedCode));
  });

  test(`delayed button: user clicks on button, but first 4 clicks don't cause nor request no DOM mutation,
          only 5th click causes DOM mutation`, async () => {
    const testGenerator = new PuppeteerTestGenerator({
      testName: 'DelayedButton',
      addComments: false
    });
    testGenerator.collector.url = 'http://localhost:8001/delayedButton';
    testGenerator.collector.initialMarkup = delayedButtonInitMarkups;
    testGenerator.collector.actions = delayedButtonActions;

    const code = await testGenerator.transformDataAndGenerateCode();
    const delayedButtonExpectedCode = await readTestContent(
      'PuppeteerTestGenerator-DelayedButton.unused.js'
    );
    expect(formatCode(code)).toEqual(formatCode(delayedButtonExpectedCode));
  });

  test(`nested div inside div: user clicks on inner div, and className of inner div changes,
          outerHTML of outer div shouldn't be checked in code`, async () => {
    const testGenerator = new PuppeteerTestGenerator({
      testName: 'NestedDivInsideDiv',
      addComments: false
    });
    testGenerator.collector.url = 'http://localhost:8001/nestedDivInsideDiv';
    testGenerator.collector.initialMarkup = nestedDivInsideDivInitMarkups;
    testGenerator.collector.actions = nestedDivInsideDivActions;

    const code = await testGenerator.transformDataAndGenerateCode();
    const nestedDivInsideDivExpectedCode = await readTestContent(
      'PuppeteerTestGenerator-NestedDivInsideDiv.unused.js'
    );
    expect(formatCode(code)).toEqual(formatCode(nestedDivInsideDivExpectedCode));
  });

  test(`nested input inside div: user enters value in input => className of wrapper div changes,
          outerHTML of wrapper div shouldn't be checked in code`, async () => {
    const testGenerator = new PuppeteerTestGenerator({
      testName: 'NestedInputInsideDiv',
      addComments: false
    });
    testGenerator.collector.url = 'http://localhost:8001/nestedInputInsideDiv';
    testGenerator.collector.initialMarkup = nestedInputInsideDivInitMarkups;
    testGenerator.collector.actions = nestedInputInsideDivActions;

    const code = await testGenerator.transformDataAndGenerateCode();
    const nestedInputInsideDivExpectedCode = await readTestContent(
      'PuppeteerTestGenerator-NestedInputInsideDiv.unused.js'
    );
    expect(formatCode(code)).toEqual(formatCode(nestedInputInsideDivExpectedCode));
  });

  test(`nested complex component: there are tree divs on page: 
          1) wraps input and text node,
          2) wraps textarea and text node;
          3) wraps button(with delayed effect, first several clicks don't cause DOM change) and text node\n
          When values are entered in input and textarea, button is clicked - DOM changes sequentially`, async () => {
    const testGenerator = new PuppeteerTestGenerator({
      testName: 'NestedComplexComponent',
      addComments: true
    });
    testGenerator.collector.url = 'http://localhost:8001/nestedComplexComponent';
    testGenerator.collector.initialMarkup = nestedComplexComponentInitMarkups;
    testGenerator.collector.actions = nestedComplexComponentActions;

    const code = await testGenerator.transformDataAndGenerateCode();
    const nestedComplexComponentExpectedCode = await readTestContent(
      'PuppeteerTestGenerator-NestedComplexComponent.unused.js'
    );
    expect(formatCode(code)).toEqual(formatCode(nestedComplexComponentExpectedCode));
  });

  test(`child list mutation: check cases when element with data-hook is added to the DOM,
          but this element can have a lot of different children structures`, async () => {
    const testGenerator = new PuppeteerTestGenerator({
      testName: 'ChildListMutation',
      addComments: true
    });
    testGenerator.collector.url = 'http://localhost:8001/childListMutation';
    testGenerator.collector.initialMarkup = childListMutationInitMarkups;
    testGenerator.collector.actions = childListMutationActions;

    const code = await testGenerator.transformDataAndGenerateCode();
    const childListMutationExpectedCode = await readTestContent(
      'PuppeteerTestGenerator-ChildListMutation.unused.js'
    );
    expect(formatCode(code)).toEqual(formatCode(childListMutationExpectedCode));
  });

  test(`select: div content changes when new option is selected`, async () => {
    const testGenerator = new PuppeteerTestGenerator({
      testName: 'Select',
      addComments: false
    });
    testGenerator.collector.url = 'http://localhost:8001/select';
    testGenerator.collector.initialMarkup = selectInitMarkups;
    testGenerator.collector.actions = selectActions;

    const code = await testGenerator.transformDataAndGenerateCode();
    const selectExpectedCode = await readTestContent('PuppeteerTestGenerator-Select.unused.js');
    expect(formatCode(code)).toEqual(formatCode(selectExpectedCode));
  });

  test(`select miss click: if select is clicked but then blured current select value is selected in code`, async () => {
    const testGenerator = new PuppeteerTestGenerator({
      testName: 'SelectMissClick',
      addComments: true
    });
    testGenerator.collector.url = 'http://localhost:8001/select';
    testGenerator.collector.initialMarkup = selectMissClickInitMarkups;
    testGenerator.collector.actions = selectMissClickActions;

    const code = await testGenerator.transformDataAndGenerateCode();
    const selectMissClickExpectedCode = await readTestContent(
      'PuppeteerTestGenerator-SelectMissClick.unused.js'
    );
    expect(formatCode(code)).toEqual(formatCode(selectMissClickExpectedCode));
  });

  test(`registration form: filling all fields, press Sign Up button`, async () => {
    const testGenerator = new PuppeteerTestGenerator({
      testName: 'RegistrationForm',
      addComments: true
    });
    testGenerator.collector.url = 'http://localhost:8001/registrationForm';
    testGenerator.collector.initialMarkup = registrationFormInitMarkups;
    testGenerator.collector.actions = registrationFormActions;

    const code = await testGenerator.transformDataAndGenerateCode();
    const registrationFormExpectedCode = await readTestContent(
      'PuppeteerTestGenerator-RegistrationForm.unused.js'
    );
    expect(formatCode(code)).toEqual(formatCode(registrationFormExpectedCode));
  });

  test(`registration form first submit failure: 
          1) on start submit button is clicked => errors are shown
          2) Filling all fields, after filling field respective error dissappers
          3) press Sign Up button, success msg is shown`, async () => {
    const testGenerator = new PuppeteerTestGenerator({
      testName: 'RegistrationFormFirstSubmitFailure',
      addComments: true
    });
    testGenerator.collector.url = 'http://localhost:8001/registrationForm';
    testGenerator.collector.initialMarkup = registrationFormFirstSubmitFailureInitMarkups;
    testGenerator.collector.actions = registrationFormFirstSubmitFailureActions;

    const code = await testGenerator.transformDataAndGenerateCode();
    const registrationFormFirstSubmitFailureExpectedCode = await readTestContent(
      'PuppeteerTestGenerator-RegistrationFormFirstSubmitFailure.unused.js'
    );
    expect(formatCode(code)).toEqual(formatCode(registrationFormFirstSubmitFailureExpectedCode));
  });

  test(`todo list: 
      1) on start two requests are sent: first to reset todolist, second to get it
      2) all(two) items are deleted
      3) two items are added`, async () => {
    const testGenerator = new PuppeteerTestGenerator({
      testName: 'TodoList',
      addComments: true
    });
    testGenerator.collector.url = 'http://localhost:8001/todoList';
    testGenerator.collector.initialMarkup = todoListInitMarkups;
    testGenerator.collector.actions = todoListActions;

    const code = await testGenerator.transformDataAndGenerateCode();
    const todoListExpectedCode = await readTestContent('PuppeteerTestGenerator-TodoList.unused.js');
    expect(formatCode(code)).toEqual(formatCode(todoListExpectedCode));
  });
});
