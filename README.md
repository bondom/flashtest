# Flashtest
[![npm version](https://img.shields.io/npm/v/flashtest.svg)](https://www.npmjs.com/package/flashtest)

Flashtest is Javascript library for generating tests written with [jest](https://github.com/facebook/jest) and [puppeteer](https://github.com/GoogleChrome/puppeteer). You just interact with UI as a usual user and test is generated for you!
> #### !!! Important:
> 1. For now library exposes only component for [React](https://github.com/facebook/react) users.
> 2. Library was tested only in Chrome.
> 3. It is <b>experimental</b> library and wasn't tested properly yet on real projects. So it may have bugs in generated code.

### Why to use:
1. Tests generated by library check real work of your whole application by testing `the most significant things: ` changes to the DOM and requests.

2. You can create a lot of tests for different scenarious in short time.

### Installation

This library generates test written with jest and puppeteer.
So first you need to setup [jest](https://github.com/facebook/jest) and [puppeteer](https://github.com/GoogleChrome/puppeteer) to work together, otherwise you will not be able to run generated tests.
There is awesome [jest-puppeteer](https://github.com/smooth-code/jest-puppeteer) for this.

After you set up jest with puppeteer run:
```shell
npm i flashtest --save-dev
```

### Usage

#### 1. Add `helper window` to your UI to be able to interact with library.
```jsx
  import { CollectorComponent } from "flashtest";

  // your usual App component
  const App = () => (
    // ...
  );

  const RenderedApp = () => (
    // wrapping your usual App component with CollectorComponent.
    // CollectorComponent renders helper window.
    // This window allows to interact with library in convenient way
    <CollectorComponent>
      <App />
    </CollectorComponent>
  );

  ReactDOM.render(<RenderedApp />, document.getElementById("app"));
```

<!-- Because of you need `CollectorComponent` only for generating tests, you can create one more separate script 
with env variable and conditionally render your App component depending on this env variable.

<b>Example:</b>
<br/> 
If you have such script in package.json to run your app:<br/>
`"start": "webpack-dev-server --mode development"`

You can add one more script with env variable:<br/>
`"start:flashtest": "cross-env WRITE_TEST=true webpack-dev-server --mode development"`

Then you can change `RenderedApp` variable specified above to:

```jsx
const RenderedApp = process.env.WRITE_TEST
  ? () => (
      <CollectorComponent
        saveToFs={false}
        addComments={true}
      >
        <App />
      </CollectorComponent>
    )
  : App;
``` -->

#### 2. Add `data-hook` attribute to elements on page:
1. `interaction elements`(these elements are also `testeable`): buttons, inputs, textareas, clickable divs and so on;
2. `testeable elements`: divs, spans and so on;
<br/>

<b>The rule of thumb is:</b> first add `data-hook` attribute to your `interaction elements`, because if you miss to add `data-hook` attribute to `interaction element`, and then interact
with this element you will get broken code. Now there is no way to detect this wrong usage before 
actual test generating.



#### 3. Run app and interact with UI as a usual user

Run two scripts:
1) Your actual React app with `CollectorComponent`
2) If you set `saveToFs` to true in `CollectorComponent` props, you need to run backend part: `npm run flashtest-sever`

Just open your page, and interact with elements. 
<br/>When you finished all your interactions press `Finish` button in helper window. If test is successfully generated you will
get corresponding message in helper window. Generated code is output to console or saved to file depending on `saveToFs` prop of CollectorComponent.
<br/>
<br/>
When you got generated code in test file just run it,
if it passes - good!<br/>
If test <b>fails</b> at once after generating check next things:
1. Your jest puppeteer setup, to check this one just create simple test with jest and puppeteer and run it.
2. Check if you added `data-hook` attribute to all `interaction elements` you interacted with.
3. If you use async requests, check if data sent by backend didn't change.
4. Check sections [Async requests](#async-requests), [Usage rules](#usage-rules) and [Current Support](#current-support)

If these things are fine, it means that more likely there is a bug in library. Feel free to create issue!

### Example
There is [example repo](https://github.com/bondom/flashtest-example).

### CollectorComponent API

#### saveToFs _(default: false)_
if set to `true`, request will be sent to `backend part` and generated code will be saved in file.<br/>
If you set `saveToFs` to `true` and didn't run backend part, code will be output to console.
#### addComments _(default: true)_ 
if set to `true`, comments will be added to generated code. These comments just help you to understand code.
#### testsFolder _(default: '')_
path to folder where generated tests will be saved, is relative to app root folder. <br/>This prop will be ignored if `saveToFs` is `false`.
#### serverPort _(default: 3000)_ 
port where backend part is running.<br/>
<b>Note:</b> `serverPort` should equal to `-p` arg passed to `flashtest-server`!
#### mockApiResponses _(default: false)_
if set to `true`, responses will be mocked with puppeteer's [request.respond](https://github.com/GoogleChrome/puppeteer/blob/v1.8.0/docs/api.md#requestrespondresponse).<br/>
If `contentType` header of response starts with `image`, such response will not be mocked.

### Backend part API
You can run backend part with `npm run flashtest-server` - it is needed only if you set `saveToFs` to `true`.

By default express server will run on 3000 port. If you want to change port, specify `-p` arg:

`npm run flashtest-server -p 3333`<br/>
<b>Note:</b> `-p` arg should equal to [serverPort](#serverport-default-3000) prop of CollectorComponent!

### Async requests
Library tracks requests which are sent with only [fetch](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch), if you use
[XMLHttpRequest](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest) library will just miss these requests.


### Current support 
1. `HTMLElement` was only checked, `SVGElement` and others weren't checked yet. 
2.  Special buttons such as `Esc`, `Backspace` and similar ones aren't supported yet.
3. Body of request isn't checked in tests, only url and method are checked.
4. Url change isn't supported. If you want to create test for particular url, go to this url, reload page and start
`interacting process` from scratch.
5. HTMLElement with `contentEditable` attribute isn't handled properly yet, so generated code will be broken if you use this element and add `data-hook` attribute to it.
6. Change to following elements aren't checked in generated code: `input[type="checkbox"]`, `input[type="radio"]` 
and `select` because in these cases DOM isn't changed.


### Usage rules

1. When you start to add `data-hook` attribute, pay great attention to `interaction elements`(input, button, textarea, clickable divs...), because if you forget to add `data-hook` attribute to these elements and interact with them during test generating, generated test will be broken. 

2. Add `data-hook` to your `testeable elements` as lowest as possible, try to avoid wrapping static text where 
it is possible. It is needed to avoid putting useless info in generated code.

    Example of bad usage:

    ```jsx
    <div data-hook="some-data-hook-name">
      Some static text
      <span>
        [value that changes when some button is clicked]
      </span>
    </div>
    ```
    Example of good usage:

    ```jsx
    <div>
      Some static text
      <span data-hook="some-data-hook-name">
        [value that changes when some button is clicked]
      </span>
    </div>
    ```

    One more example of good usage:<br/>`div` and `span` both have `data-hook` attribute, it may be needed if `div` element for example has some DOM attribute(e.g. `className`) that changes dynamically:

    ```jsx
    <div data-hook="some-div-data-hook-name" className="[dynamic-className]">
      Some static text
      <span data-hook="some-span-data-hook-name">
        [value that changes when some button is clicked]
      </span>
    </div>
    ```


2. When you did some action that led to sending request(for example clicked submit button), don't do any other actions until request is finished. If you do, code generating will more likely end up with error, or generated code will be broken.<br/>
    > You will get corresponding warning in helper window if you break this rule.

3. Don't change url, url change isn't supported yet.
    > You will get corresponding warning in helper window if you break this rule.
4. Make all `data-hook` attributes unique.
    > You will get corresponding warning in helper window if you break this rule.

5. When you click on `input`/`textarea` element, before entering value please wait 1 second.
  If you start to enter value too fast, order of triggered events is unusual. This point is planned
  to be automated in future, but now please keep in mind it.
    > You will get corresponding warning in helper window if you break this rule.


### Сlarifications related to generated code
> In this section `Element` means HTMLElement with `data-hook` attribute.
1. If `Element` has children which are `interaction elements` and content of this `Element` is changed, this change will not be tracked by library, it is needed to reduce size of tested html.<br/> 
    Consider this piece of code:

    ```jsx
    <div data-hook="div">
      [input value]
      <input data-hook="input" />
    </div>
    ```
    When user typed value in input, only attribute value of input will be checked,
    but outerHTML of div will not be checked.<br/>
    If you want to check this one, it should be:

    ```jsx
    <div data-hook="div">
      <span data-hook="input value">[input value]</span>
      <input data-hook="input" />
    </div>
    ```

    <b>Note:</b> it is not related to case when HTMLElement is added to the DOM, in this case outerHTML of added HTMLElement will be checked despite of its children.


2. If `Element` is added to the DOM, outerHTML is checked in tests.<br/>
If content of `Element` changed(TextNode changed/added), innerHTML is checked in tests.

3. If `Element` is added to the DOM, and there are children of this element with data-hook attribute, library will search children with data-hook attribute of the most nested sub-trees and check outerHTML of them.<br/>
    <b>Example:</b> When next `Element` is added to the DOM:

    ```jsx
    <div data-hook="root-div">
      <span data-hook="span1">Some text</span>
      <div data-hook="div1">
        <div data-hook="div1-nested">
          <span data-hook="span2">Some text2</span>
        </div>
      </div>
      <div data-hook="div2">
        <input data-hook="input" value="val" />
      </div>
    </div>
    ```

    outerHTML of next elements will be checked in tests: `[data-hook="span1"]`, `[data-hook="span2"]`, `[data-hook="input"]`.

4. If TextNode is changed and direct parentElement doesn't have data-hook attribute, 
this change will not be checked in tests. If you want to track this change, add data-hook attribute to direct parent 
of TextNode.

    Change to span WILL NOT be checked in code:
    ```jsx
    <div data-hook="div">
      <span>[input value]</span>
      <input data-hook="input" />
    </div>
    ```
    Change to span IS GOING to be checked in code:
    ```jsx
    <div data-hook="div">
      <span data-hook="span">[input value]</span>
      <input data-hook="input" />
    </div>
    ```
    
### License
Flashtest is [MIT licensed](./LICENSE).
