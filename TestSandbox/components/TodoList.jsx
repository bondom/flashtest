import * as React from 'react';
import { TEST_API_URL } from '../constants';

class TodoList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      itemsStatus: 'none',
      addingInProcess: false,
      newItem: ''
    };
  }

  componentDidMount() {
    this.setState({ itemsStatus: 'request' });
    fetch(`${TEST_API_URL}/todolist-reset`, { method: 'post' }).then(() => {
      this.getItems();
    });
  }

  onDeleteButtonClick = id => {
    this.setState({ itemsStatus: 'request' });
    this.deleteItem(id).then(() => {
      this.getItems();
    });
  };

  onAddButtonClick = () => {
    const newItemText = this.state.newItem;
    this.setState({ itemsStatus: 'request', addingInProcess: false, newItem: '' });
    this.addItem(newItemText).then(() => {
      this.getItems();
    });
  };

  // api methods

  getItems = () => {
    return fetch(`${TEST_API_URL}/todolist`, {
      method: 'get'
    })
      .then(res => {
        return res.json();
      })
      .then(res => {
        this.setState({ items: res, itemsStatus: 'got' });
      });
  };

  deleteItem = id => {
    return fetch(`${TEST_API_URL}/todolist/${id}`, {
      method: 'delete'
    }).then(res => {
      return res.text();
    });
  };

  addItem = text => {
    return fetch(`${TEST_API_URL}/todolist/${text}`, {
      method: 'post'
    }).then(res => {
      return res.text();
    });
  };

  render() {
    return (
      <div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <h4>TodoList</h4>
          <button
            style={{ height: '30px' }}
            data-hook="todolist__add-new-button"
            onClick={() => this.setState({ addingInProcess: true })}
            disabled={this.state.addingInProcess}
          >
            Add New
          </button>
        </div>
        {this.state.addingInProcess && (
          <div style={{ display: 'flex' }}>
            <input
              onChange={e => this.setState({ newItem: e.target.value })}
              data-hook="todolist__new-item-input"
            />
            <button onClick={this.onAddButtonClick} data-hook="todolist__add-button">
              Add
            </button>
            <button
              onClick={() => this.setState({ addingInProcess: false })}
              data-hook="todolist__adding-cancel-button"
            >
              Cancel
            </button>
          </div>
        )}
        {this.state.itemsStatus === 'request' && (
          <span data-hook="todolist__loader">Loading...</span>
        )}
        {this.state.itemsStatus === 'got' && (
          <ul style={{ padding: '0px' }}>
            {this.state.items.map(item => {
              return (
                <li key={item.id} style={{ display: 'block' }}>
                  <span data-hook={`todolist__item-text-${item.id}`}>{item.text} </span>
                  <button
                    onClick={() => this.onDeleteButtonClick(item.id)}
                    data-hook={`todolist__item-delete-button-${item.id}`}
                  >
                    Delete
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    );
  }
}

export { TodoList };
