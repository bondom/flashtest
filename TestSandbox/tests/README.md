Tests in this folder are common for generator and collector. They test two things:
<ul>
  <li>Generated test for route executes fine</li>
  <li>Collected actions and initial markup by library match manually collected actions and initial markup</li>
</ul>
<p>Content of these files are created in next way:
<ul>
  <li>Content of test with the same name is copied from `generator/TestSandbox/components` folder(tests in this folder are generated by library).
  </li>
  <li>Code to test collected actions and initial markup is added</li> 
</ul>

**Drawbacks of these tests**:
<ol>
  <li>
    Keyup event can't be tested in right way, because
    manual actions are collected by programmer and there is some time between keyup and keydown. At the same time puppeteer default timeout for keyup event is 0
  </li>
</ol>