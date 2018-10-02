import * as React from 'react';
import * as PropTypes from 'prop-types';

class DisableCache extends React.Component {
  state = {
    showTooltip: false
  };

  onTooltipToggle(showTooltip) {
    this.setState({ showTooltip });
  }
  render() {
    const { onDisableCacheChange, disableCache } = this.props;
    return (
      <div
        style={{
          display: 'flex',
          marginTop: '5px'
        }}
      >
        <div style={{ position: 'relative' }}>
          <div
            style={{
              borderRadius: '50%',
              background: '#a6a6a6',
              color: 'white',
              height: '16px',
              width: '16px',
              textAlign: 'center',
              cursor: 'pointer',
              marginRight: '10px'
            }}
            onMouseEnter={() => this.onTooltipToggle(true)}
            onMouseLeave={() => this.onTooltipToggle(false)}
          >
            ?
          </div>
          {this.state.showTooltip && (
            <div
              style={{
                position: 'absolute',
                background: 'white',
                border: '1px solid black',
                top: '24px',
                padding: '2px 5px',
                width: '200px'
              }}
            >
              Turn this checkbox on only if dev tools are open and {`'Disable cache'`} in Network
              tab is checked
            </div>
          )}
        </div>
        Disable cache:{' '}
        <input type="checkbox" onChange={onDisableCacheChange} checked={disableCache} />
      </div>
    );
  }
}

DisableCache.propTypes = {
  onDisableCacheChange: PropTypes.func.isRequired,
  disableCache: PropTypes.bool.isRequired
};

export default DisableCache;
