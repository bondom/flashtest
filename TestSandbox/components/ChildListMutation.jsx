import * as React from 'react';
import { TEST_API_URL } from '../constants';

class ChildListMutation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      divsAreDisplayed: false
    };
  }
  onBtnClick = () => {
    this.setState(prevState => ({ divsAreDisplayed: !prevState.divsAreDisplayed }));
  };

  render() {
    const buttonText = this.state.divsAreDisplayed ? 'Hide divs' : 'Show divs';
    return (
      <div>
        <button onClick={this.onBtnClick} data-hook="button">
          {buttonText}
        </button>

        {/* All children and root element have data-hook attribute */}
        {/* in this case root1-span and root1-inner-div__span should be checked*/}
        {this.state.divsAreDisplayed && (
          <div data-hook="root1">
            <span data-hook="root1-span">First div - span</span>
            <div data-hook="root1-inner-div">
              <span data-hook="root1-inner-div__span">First div - inner div - span</span>
            </div>
          </div>
        )}
        <br />

        {/* All children and root element have data-hook attribute, 
        but the most nested span has input as a child */}
        {/* in this case root2-span and root2-inner-div__input should be checked, if programmer wants to test 
        content of span he should wrap only text with span[data-hook] without input(select, textarea, button also) */}
        {this.state.divsAreDisplayed && (
          <div data-hook="root2">
            <span data-hook="root2-span">First div - span</span>
            <div data-hook="root2-inner-div">
              <span data-hook="root2-inner-div__span">
                <input data-hook="root2-inner-div__input" defaultValue={'some value'} />
                First div - inner div - span
              </span>
            </div>
          </div>
        )}
        <br />

        {/* All children have data-hook attribute, but not root element */}
        {/* in this case root3-span and root3-inner-div__span should be checked*/}
        {this.state.divsAreDisplayed && (
          <div>
            <span data-hook="root3-span">Second div - span</span>
            <div data-hook="root3-inner-div">
              <span data-hook="root3-inner-div__span">Second div - inner div - span</span>
            </div>
          </div>
        )}
        <br />

        {/* Root element has data-hook attribute, but not children*/}
        {/* in this case root4 should be checked*/}
        {this.state.divsAreDisplayed && (
          <div data-hook="root4">
            <span>Fourth div - span</span>
            <div>
              <span>Fourth div - inner div - span</span>
            </div>
          </div>
        )}
        <br />

        {/* Root element has data-hook attribute, but not children except input child*/}
        {/* in this case root5-input should be checked*/}
        {this.state.divsAreDisplayed && (
          <div data-hook="root5">
            <span>Fifth div - span</span>
            <input defaultValue={'some value'} data-hook="root5-input" />
            <div>
              <span>Fifth div - inner div - span</span>
            </div>
          </div>
        )}
        <br />

        {/* Root element and some children have data-hook attribute*/}
        {/* in this case root6__inner-div should be checked*/}
        {this.state.divsAreDisplayed && (
          <div data-hook="root6">
            <span>Sixth div - span</span>
            <div data-hook="root6__inner-div">
              <span>Sixth div - inner div - span</span>
            </div>
          </div>
        )}

        {/* Root element and some children have data-hook attribute*/}
        {/* in this case root7__inner-div and root7__span should be checked*/}
        {this.state.divsAreDisplayed && (
          <div data-hook="root7">
            <span data-hook="root7__span">Seventh div - span</span>
            <div data-hook="root7__inner-div">
              <span>Seventh div - inner div - span</span>
            </div>
          </div>
        )}
        <br />

        {/* Root element and some children have data-hook attribute*/}
        {/* in this case root8__inner-div-span and root8__span should be checked*/}
        {this.state.divsAreDisplayed && (
          <div data-hook="root8">
            <span data-hook="root8__span">8th div - span</span>
            <div>
              <span data-hook="root8__inner-div-span">8th div - inner div - span</span>
            </div>
          </div>
        )}

        {/* Root element and some children have data-hook attribute*/}
        {/* in this case root9__span, root9__inner-div-span, root9__inner-div1-span should be checked*/}
        {this.state.divsAreDisplayed && (
          <div data-hook="root9">
            <span data-hook="root9__span">9th div - span</span>
            <div data-hook="root9__inner-div1">
              text
              <div data-hook="root9__inner-div1-nested">
                <span data-hook="root9__inner-div1-span">9th div - inner div - span</span>
              </div>
            </div>

            <div data-hook="root9__inner-div2">
              <div data-hook="root9__inner-div2-nested">
                <span data-hook="root9__inner-div2-span">9th div - inner div - span</span>
              </div>
            </div>
          </div>
        )}
        <br />

        {/* Root element has data-hook attribute, but not children, also there is child input*/}
        {/* in this case no elements should be checked*/}
        {this.state.divsAreDisplayed && (
          <div data-hook="root10">
            <span>10th div - span</span>
            <input defaultValue={'some value'} />
            <div>
              <span>10th div - inner div - span</span>
            </div>
          </div>
        )}
        <br />
      </div>
    );
  }
}

export { ChildListMutation };
