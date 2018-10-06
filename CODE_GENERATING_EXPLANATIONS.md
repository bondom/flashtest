### Explanations of generated code
> In this section `Element` means HTMLElement with `data-hook` attribute.
1. If `Element` has children which are `interaction elements` and content of this `Element` is <b>changed</b>, this change will not be tracked by library, it is needed to reduce size of tested html.<br/> 
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

    <b>Note:</b> it is not related to case when `Element` is <b>added</b> to the DOM, in this case see point 3 below.


2. If `Element` is <b>added</b> to the DOM, outerHTML is checked in tests.<br/>
If content of `Element` is <b>changed</b> (TextNode is changed/added), innerHTML is checked in tests.

3. If `Element` is <b>added</b> to the DOM, and there are children of this element with data-hook attribute, library will search children with data-hook attribute of the most nested sub-trees and check outerHTML of them.<br/>
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
