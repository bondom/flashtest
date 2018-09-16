import * as React from 'react';
import { Router, Switch, Redirect, Route, Link } from 'react-router-dom';
import createHistory from 'history/createBrowserHistory';
import {
  Input,
  InputNumber,
  InputCheckbox,
  InputRadio,
  Textarea,
  Button,
  ButtonMousedown,
  Select,
  // async components
  AsyncButton,
  AsyncButtonTwoRequestsOnClick,
  AsyncButtonTwoRequestsOneByOne,
  AsyncButtonComplex,
  AsyncInput,
  AsyncKeydown,
  AsyncForm,
  AsyncRequestOnMount,
  // nesting
  NestedInputInsideDiv,
  NestedComplexComponent,
  NestedDivInsideDiv,
  ChildListMutation,
  // delayed
  DelayedButton,
  // complex
  InputEnhanced,
  InputButtonSpan,
  InputKeyEvents,
  ButtonComplex,
  LoginForm,
  RegistrationForm,
  TodoList,
  // merging
  MergedClickFocus,
  MergedClickBlur,
  DynamicallyAddedButton,
  RemovedTextNode,
  RemovedElement
} from './components';

import * as styles from './styles.scss';

import CollectorComponent from '../src/CollectorComponent/CollectorComponent.jsx';

const App = () => (
  <CollectorComponent saveToFs={false} addComments={true}>
    <Router history={createHistory()}>
      <div>
        <nav className={styles.nav}>
          <div>
            <Link to="/mergedClickFocus">MergedClickFocus</Link>
            <Link to="/mergedClickBlur">MergedClickBlur</Link>
            <Link to="/dynamicallyAddedButton">DynamicallyAddedButton</Link>
            <Link to="/removedTextNode">RemovedTextNode</Link>
            <Link to="/removedElement">RemovedElement</Link>
          </div>
          <div>
            <Link to="/input">Input</Link>
            <Link to="/inputNumber">InputNumber</Link>
            <Link to="/inputCheckbox">InputCheckbox</Link>
            <Link to="/inputRadio">InputRadio</Link>
            <Link to="/textarea">Textarea</Link>
            <Link to="/button">Button</Link>
            <Link to="/buttonMousedown">ButtonMousedown</Link>
            <Link to="/select">Select</Link>
          </div>
          <div>
            <Link to="/asyncButton">AsyncButton</Link>
            <Link to="/asyncButtonTwoRequestsOnClick">AsyncButtonTwoRequestsOnClick</Link>
            <Link to="/asyncButtonTwoRequestsOneByOne">AsyncButtonTwoRequestsOneByOne</Link>
            <Link to="/asyncButtonComplex">AsyncButtonComplex</Link>
            <Link to="/asyncInput">AsyncInput</Link>
            <Link to="/asyncKeydown">AsyncKeydown</Link>
            <Link to="/asyncForm">AsyncForm</Link>
            <Link to="/asyncRequestOnMount">AsyncRequestOnMount</Link>
          </div>
          <div>
            <Link to="/nestedInputInsideDiv">NestedInputInsideDiv</Link>
            <Link to="/nestedComplexComponent">NestedComplexComponent</Link>
            <Link to="/nestedDivInsideDiv">NestedDivInsideDiv</Link>
            <Link to="/childListMutation">ChildListMutation</Link>
          </div>
          <div>
            <Link to="/delayedButton">DelayedButton</Link>
          </div>
          <div>
            <Link to="/inputEnhanced">InputEnhanced</Link>
            <Link to="/inputKeyEvents">InputKeyEvents</Link>
            <Link to="/inputBtnSpan">InputButtonSpan</Link>
            <Link to="/buttonComplex">ButtonComplex</Link>
            <Link to="/login">LoginForm</Link>
            <Link to="/registrationForm">RegistrationForm</Link>
            <Link to="/todoList">TodoList</Link>
          </div>
        </nav>
        <Switch>
          <Route exact path="/mergedClickFocus" component={MergedClickFocus} />
          <Route exact path="/mergedClickBlur" component={MergedClickBlur} />
          <Route exact path="/dynamicallyAddedButton" component={DynamicallyAddedButton} />
          <Route exact path="/removedTextNode" component={RemovedTextNode} />
          <Route exact path="/removedElement" component={RemovedElement} />

          <Route exact path="/login" component={LoginForm} />
          <Route exact path="/input" component={Input} />
          <Route exact path="/inputNumber" component={InputNumber} />
          <Route exact path="/inputCheckbox" component={InputCheckbox} />
          <Route exact path="/inputRadio" component={InputRadio} />
          <Route exact path="/textarea" component={Textarea} />
          <Route exact path="/button" component={Button} />
          <Route exact path="/buttonMousedown" component={ButtonMousedown} />
          <Route exact path="/select" component={Select} />
          <Route exact path="/inputEnhanced" component={InputEnhanced} />
          <Route exact path="/inputKeyEvents" component={InputKeyEvents} />
          <Route exact path="/inputBtnSpan" component={InputButtonSpan} />

          <Route exact path="/asyncButton" component={AsyncButton} />
          <Route
            exact
            path="/asyncButtonTwoRequestsOnClick"
            component={AsyncButtonTwoRequestsOnClick}
          />
          <Route
            exact
            path="/asyncButtonTwoRequestsOneByOne"
            component={AsyncButtonTwoRequestsOneByOne}
          />
          <Route exact path="/asyncButtonComplex" component={AsyncButtonComplex} />
          <Route exact path="/asyncInput" component={AsyncInput} />
          <Route exact path="/asyncKeydown" component={AsyncKeydown} />
          <Route exact path="/asyncForm" component={AsyncForm} />
          <Route exact path="/asyncRequestOnMount" component={AsyncRequestOnMount} />
          <Route exact path="/nestedInputInsideDiv" component={NestedInputInsideDiv} />
          <Route exact path="/nestedComplexComponent" component={NestedComplexComponent} />
          <Route exact path="/nestedDivInsideDiv" component={NestedDivInsideDiv} />
          <Route exact path="/childListMutation" component={ChildListMutation} />
          <Route exact path="/delayedButton" component={DelayedButton} />
          <Route exact path="/buttonComplex" component={ButtonComplex} />
          <Route exact path="/registrationForm" component={RegistrationForm} />
          <Route exact path="/todoList" component={TodoList} />
          <Redirect to="/login" />
        </Switch>
      </div>
    </Router>
  </CollectorComponent>
);

export default App;
