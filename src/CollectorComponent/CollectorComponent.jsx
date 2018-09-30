import * as React from 'react';
import * as PropTypes from 'prop-types';
import PuppeteerTestGenerator from '../client/PuppeteerTestGenerator';
import ToggleCollapseIcon from './ToggleCollapseIcon';

const Statuses = {
  None: 'none',
  Generating: 'generating',
  Success: 'success'
};
class CollectorComponent extends React.Component {
  static defaultProps = {
    saveToFs: false,
    addComments: true,
    mockApiResponses: false
  };

  constructor(props) {
    super(props);
    const errorsArray = [];
    errorsArray.push = element => {
      this.setState({ error: element, collapsed: false });
    };

    this.state = {
      generator: new PuppeteerTestGenerator({
        testsFolder: props.testsFolder,
        saveToFs: props.saveToFs,
        addComments: props.addComments,
        indicatorQuerySelector: '[data-flashtest-hook="___FLASHTEST-INDICATOR"]',
        serverPort: props.serverPort,
        errorsArray,
        mockApiResponses: props.mockApiResponses
      }),

      error: undefined,
      success: false,
      moveable: false,
      collapsed: false,
      status: Statuses.None
    };
    this.state.generator.start();
  }

  onMouseDown = e => {
    const root = this.root;
    let startClientX = null;
    let startClientY = null;
    let startRight = 0;
    let startTop = 0;
    moveAt(e, true);

    function moveAt(e, first = false) {
      if (first) {
        startClientX = e.clientX;
        startClientY = e.clientY;
        startRight = parseInt(root.style.right);
        startTop = parseInt(root.style.top);
        return;
      }
      const computedRight = startRight + (startClientX - e.clientX);
      if (computedRight >= 0) {
        root.style.right = computedRight + 'px';
      }
      const computedTop = startTop + (e.clientY - startClientY);
      if (computedTop >= 0) {
        root.style.top = computedTop + 'px';
      }
    }

    const mouseMoveEventListener = e => {
      if (e.preventDefault) e.preventDefault();
      moveAt(e);
    };

    document.addEventListener('mousemove', mouseMoveEventListener);

    document.addEventListener('mouseup', function mouseUpEventListener() {
      document.removeEventListener('mouseup', mouseUpEventListener);
      document.removeEventListener('mousemove', mouseMoveEventListener);
    });
  };

  onFinishBtnClick = () => {
    this.setState({ status: Statuses.Generating });
    this.state.generator
      .finish()
      .then(() => {
        this.setState({ status: Statuses.Success });
      })
      .catch(res => {
        /* eslint-disable no-console */
        if (res.stack) {
          console.error(res.stack);
        }
        /* eslint-enable no-console */
        this.setState({
          error: res.message ? this.handleError(res.message) : res.status,
          status: Statuses.None
        });
      });
  };

  handleError = errorMsg => {
    return errorMsg.replace(/\n/g, '<br />');
  };

  render() {
    const { error, status } = this.state;
    return (
      <div>
        {this.props.children}
        <div
          ref={el => (this.root = el)}
          style={{
            position: 'fixed',
            right: '0px',
            top: '0px',
            zIndex: 10000,
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <div
            style={{
              display: 'flex',
              boxShadow: '0 2px 5px 2px rgba(65,36,75,.1)',
              border: '1px solid #a6a6a6',
              borderBottom: 'none',
              height: '26px',
              width: '51px',
              boxSizing: 'border-box',
              background: 'white',
              alignSelf: 'flex-end'
            }}
          >
            <div
              style={{ padding: '2px', borderRight: '1px solid #a6a6a6', cursor: 'pointer' }}
              onMouseDown={this.onMouseDown}
            >
              <svg width="20px" height="20px" viewBox="0 0 16 16">
                <path
                  fill="#0a6a6a"
                  d="M16 8l-3-3v2h-4v-4h2l-3-3-3 3h2v4h-4v-2l-3 3 3 3v-2h4v4h-2l3 3 3-3h-2v-4h4v2z"
                />
              </svg>
            </div>
            <div style={{ padding: '2px', cursor: 'pointer' }}>
              <ToggleCollapseIcon
                collapsed={this.state.collapsed}
                onCollapseToggle={collapsed => this.setState({ collapsed })}
              />
            </div>
          </div>
          {!this.state.collapsed && (
            <div
              style={{
                boxSizing: 'border-box',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                background: 'white',
                padding: '10px',
                width: '300px',
                boxShadow: '0 2px 5px 2px rgba(65,36,75,.1)',
                border: '1px solid #a6a6a6'
              }}
            >
              {status === Statuses.Generating && <div>Generating...</div>}
              {status === Statuses.Success && <div>Test successfully saved</div>}
              {status === Statuses.None && (
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <button
                    onClick={this.onFinishBtnClick}
                    data-flashtest-hook="___FLASHTEST-FINISH-BUTTON"
                    style={{
                      width: '100px',
                      height: '32px',
                      border: 'none',
                      background: '#a6a6a6',
                      color: 'white',
                      cursor: 'pointer',
                      outline: 'none'
                    }}
                  >
                    Finish Test
                  </button>
                </div>
              )}
              {error && (
                <div
                  style={{
                    marginTop: '10px',
                    border: 'none',
                    padding: '4px',
                    fontSize: '15px'
                  }}
                  dangerouslySetInnerHTML={{ __html: error }}
                />
              )}
            </div>
          )}
          <div
            style={{
              background: 'green',
              width: this.state.collapsed ? '51px' : '100%',
              height: '8px'
            }}
            data-flashtest-hook="___FLASHTEST-INDICATOR"
          />
        </div>
      </div>
    );
  }
}

CollectorComponent.propTypes = {
  saveToFs: PropTypes.bool,
  testsFolder: PropTypes.string,
  addComments: PropTypes.bool,
  serverPort: PropTypes.number,
  mockApiResponses: PropTypes.bool
};
export default CollectorComponent;
