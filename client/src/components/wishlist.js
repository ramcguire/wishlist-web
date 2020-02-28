/**
 * @file wishlist.js
 * @brief - Front-end for the wishlist application.
 * 
 * Handles the user interface and control for creating, reading,
 * updating, and deleting information from a wishlist. 
 * 
 * @author - Ryan McGuire 
 * @date 12/15/2019
 */

import React, { Component } from 'react';
import './wishlist.css';

/**
 * @class Wishlist
 * Top level component, handles rendering of all child components.
 * Holds all state values.
 */
class Wishlist extends Component {
  constructor() {
    super();
    this.state = {
      wishlistSelected: false,
      wishlistName: null,
      wishlistDetails: null,
      nameInput: null,
      titleInput: null,
      urlInput: null,
      editTitle: null,
      editUrl: null,
      addingItem: false,
      addItemError: false,
      editingItem: false,
      editItemIdx: null,
      editItemError: false,
      wishlistEmpty: false,
    };

    // any functions are used as a callback and can change state
    this.itemInputChange = this.itemInputChange.bind(this);
    this.addItemController = this.addItemControler.bind(this);
    this.inputChangeHandler = this.inputChangeHandler.bind(this);
    this.inputSubmitHandler = this.inputSubmitHandler.bind(this);
    this.editItemController = this.editItemController.bind(this);
    this.itemSubmit = this.itemSubmit.bind(this);
  }

  /**
   * Handles the input change event on adding a new item.
   * @param event - event that triggers this function
   */
  itemInputChange(event) {
    switch(event.target.name) {
      case 'name-entry': {
        this.setState({nameInput: event.target.value});
        break;
      }
      case 'title': {
        this.setState({titleInput: event.target.value});
        break;
      }
      case 'url': {
        this.setState({urlInput: event.target.value});
        break;
      }
      case 'edit-title': {
        this.setState({editTitle: event.target.value});
        break;
      }
      case 'edit-url': {
        this.setState({editUrl: event.target.value});
        break;
      }
      default: // should never get here
    }
  }

  /**
   * Handles item changes.
   * Either edits an item, or adds a new item to a wishlist
   * based on the target of the triggering event.
   * @param event - event that triggers this function
   */
  async itemSubmit(event) {
    switch(event.target.name) {
      case 'submit-edit': {
        // check that url and title have data in them
        if (!this.state.editTitle || !this.state.editUrl) {
          this.setState({editItemError: true});
          return;
        // update the wishlist entry
        } else {
          let targetId = this.state.wishlistDetails[this.state.editItemIdx].id
          const payload = {
            name: this.state.wishlistName,
            title: this.state.editTitle,
            url: this.state.editUrl,
            id: targetId,
          };
          // send the payload to the server
          await fetch('/api/edititem', {
            method: 'POST',
            headers: {'Content-Type': 'application/json; charset=utf-8'},
            body: JSON.stringify(payload),
          });
          // update wishlist details
          this.fetchWishlist(this.state.wishlistName);
        }
        break;
      }
      case 'submit': {
        // check if both input boxes have data
        if (!this.state.titleInput || !this.state.urlInput) {
          this.setState({addItemError: true});
          return;
        // if there is valid data to submit
        } else {
          const payload = {
            name: this.state.wishlistName,
            title: this.state.titleInput,
            url: this.state.urlInput,
          };
          // send the payload to the server
          await fetch('/api/additem', {
              method: 'POST',
              headers: {'Content-Type': 'application/json; charset=utf-8'},
              body: JSON.stringify(payload),
          });
          // update wishlist display
          this.fetchWishlist(this.state.wishlistName);
        }
        break;
      }
      default: // should never get here
    }
  }

  /**
   * Used to change whether or not an item is being added.
   * Enables or disables the form to add an item.
   * @param {bool} result - the resulting addingItem state
   */
  addItemControler(result) {
    this.setState({
      addingItem: result,
      addItemError: false,
      editingItem: false,
      editTitle: null,
      editUrl: null,
      editItemError: false,
    });
  }

  /**
   * Used to change the status of if we are editing an item.
   * Convenience function to help cancel the edit.
   * @param {bool} result - the resulting editingItem state
   */
  editItemController(result) {
    this.setState({
      editingItem: result,
      editItemIdx: null,
      editItemError: false,
    })
  }

  /**
     * Handles the input change event on the wishlist name input area.
     */
    inputChangeHandler = (event) => {
      this.setState({nameInput: event.target.value});
    }

    /**
     * Handles the submission of text in the wishlist name input area.
     * Uses fetchWishlist to update information.
     */
    inputSubmitHandler = (event) => {
      event.preventDefault();
      this.fetchWishlist(this.state.nameInput);
    }

    /**
     * Handles allowing a user to edit a wishlist item.
     * @param {int} item - index of item to edit
     */
    async updateItem(item) {
      let itemInfo = this.state.wishlistDetails[item]
      this.setState({
        editingItem: true,
        editItemIdx: item,
        editTitle: itemInfo.title,
        editUrl: itemInfo.url,
        addingItem: false,
        addItemError: false,
      });
    }

    /**
     * Handles the removal of items from specified item
     * @param {int} item - index of item to remove
     */
    async removeItem(item) {
      // get the relative item id
      let itemId = this.state.wishlistDetails[item].id;
      await fetch(`/api/removeitem/${itemId}`);
      this.fetchWishlist(this.state.wishlistDetails[item].name);
    }

    /**
    * Fetch a wishlist from the database.
    * Queries database for a wishlist, and sets state appropriately.
    * @param {string} name - wishlist name to lookup
    */
    async fetchWishlist(name) {
      const response = await fetch(`/api/getwishlist/${name}`);
      const resJson = await response.json();
      // if there was nothing found in database
      if (!resJson.length) {
        this.setState({
          wishlistName: name,
          wishlistDetails: null,
          wishlistEmpty: true,
          wishlistSelected: true,
          addingItem: false,
          addItemError: false,
          editingItem: false,
          editItemError: false,
          editItemIdx: null,
        })
      } else {
      // what was the response
        this.setState({
          wishlistName: name,
          wishlistDetails: resJson,
          addingItem: false,
          addItemError: false,
          editingItem: false,
          editItemError: false,
          editItemIdx: null,
          wishlistEmpty: false,
          wishlistSelected: true,
        });
      } 
    }
  /**
   * React render() function.
   */
  render() {
    // when there is a wishlist selected
    if (this.state.wishlistDetails !== null) {
      return (
        <div>
          <h2>Wishlist for {this.state.wishlistName}</h2>
          <WishlistSearch
            onChange={this.inputChangeHandler}
            onSubmit={this.inputSubmitHandler}
            wishlistName={this.state.wishlistName}
          />
          <br></br>
          <WishlistDisplay 
            wishlistDetails={this.state.wishlistDetails}
            removeItem={i => this.removeItem(i)}
            updateItem={i => this.updateItem(i)}
            editingItem={this.state.editingItem}
            editItemIdx={this.state.editItemIdx}
            editItemController={res => this.editItemController(res)}
            itemInputChange={this.itemInputChange}
            editItemError={this.state.editItemError}
            itemSubmit={this.itemSubmit}
            onChange={this.itemInputChange}
            onSubmit={this.itemSubmit}
            addingItem={this.state.addingItem}
            addItemControler={res => this.addItemControler(res)}
            addItemError={this.state.addItemError}
            wishlistSelected={this.state.wishlistSelected}
            emptyWishlist={this.state.wishlistEmpty}
            wishlistName={this.state.wishlistName}
          />
        </div>
      );
    // wishlist selected, but empty
    } else if (this.state.wishlistName !== null) {
      return (
        <div>
          <h2>
            {this.state.wishlistName}'s wishlist is empty - add an item now!
          </h2>
          <WishlistSearch
            onChange={this.inputChangeHandler}
            onSubmit={this.inputSubmitHandler}
            wishlistName={this.state.wishlistName}
          />
          <br></br>
          <WishlistDisplay 
            wishlistDetails={this.state.wishlistDetails}
            removeItem={i => this.removeItem(i)}
            updateItem={i => this.updateItem(i)}
            editingItem={this.state.editingItem}
            editItemIdx={this.state.editItemIdx}
            editItemController={res => this.editItemController(res)}
            itemInputChange={this.itemInputChange}
            editItemError={this.state.editItemError}
            itemSubmit={this.itemSubmit}
            onChange={this.itemInputChange}
            onSubmit={this.itemSubmit}
            addingItem={this.state.addingItem}
            addItemControler={res => this.addItemControler(res)}
            addItemError={this.state.addItemError}
            wishlistSelected={this.state.wishlistSelected}
            emptyWishlist={this.state.emptyWishlist}
            wishlistName={this.state.wishlistName}
          />
        </div>
      );
    // no wishlist selected
    } else {
      return (
        <div>
          <h2>No wishlist selected - enter a name to get started</h2>
          <WishlistSearch
            onChange={this.inputChangeHandler}
            onSubmit={this.inputSubmitHandler}
            wishlistName={this.state.wishlistName}
          />
          <br></br>
          <WishlistDisplay
            wishlistDetails={this.state.wishlistDetails}
            removeItem={i => this.removeItem(i)}
            updateItem={i => this.updateItem(i)}
            editingItem={this.state.editingItem}
            editItemIdx={this.state.editItemIdx}
            editItemController={res => this.editItemController(res)}
            itemInputChange={this.itemInputChange}
            editItemError={this.state.editItemError}
            itemSubmit={this.itemSubmit}
            onChange={this.itemInputChange}
            onSubmit={this.itemSubmit}
            addingItem={this.state.addingItem}
            addItemControler={res => this.addItemControler(res)}
            addItemError={this.state.addItemError}
            wishlistSelected={this.state.wishlistSelected}
            emptyWishlist={this.state.emptyWishlist}
            wishlistName={this.state.wishlistName}
          />
        </div>
      );
    }
  }

};
/** 
 * @class WishlistSearch
 * Handles search functionality.
 */
class WishlistSearch extends Component {
    /**
     * React render() function
     */
    render() {
      // if a wishlist is selected, prefill input box
      if (this.props.wishlistName !== null) {
        return(
          <div>
            <form className="input-form" onSubmit={this.props.onSubmit}>
              Select a wishlist (and hit ENTER):
              <br></br>
              <input type="text" name="name" 
              defaultValue={this.props.wishlistName} 
              id="name-entry" onChange={this.props.onChange}>
              </input>
              <br></br>
              <input type="submit" className="hidden"></input>
            </form>
          </div>
        );
      // otherwise don't display anything for selected
      } else {
        return(
          <div>
              <form className="input-form" onSubmit={this.props.onSubmit}>
                Select a wishlist (and hit ENTER):
                <br></br>
                <input type="text" name="name" id="name-entry"
                onChange={this.props.onChange}>
                </input>
                <br></br>
                <input type="submit" className="hidden"></input>
              </form>    
            </div>
        )
      }
    }
};

/** 
 * @class WishlistItemControl
 * Handles buttons for individual wishlist items.
 */
class WishlistItemControl extends Component {
  /**
   * React render() function.
   */
  render() {
    return(
      <div>
        <button className="button" onClick={this.props.removeItem}>
          Delete item
        </button>
        <button className="button" onClick={this.props.updateItem}>
          Edit item
        </button>
      </div>
    );
  }
};

/**
 * @class AddItem
 * Holds functionality to add an item.
 * Also prompts to create a wishlist.
 * Wishlist will remain "empty" until an item is added.
 */
class AddItem extends Component {
  errorMessage(shouldDisplay) {
    if (shouldDisplay) {
      return(
        <div>Make sure both fields have input.</div>
      );
    }
  }

  /**
   * React render() function.
   */
  render() {
    // if adding an item
    if (this.props.addingItem) {
      return(
        <div>
          <form onChange={this.props.onChange}>
            <label>Title of entry:</label>
            <input type="text" name="title"></input>
            <br></br>
            <label>URL/description:</label>
            <input className="url-input" type="text" name="url"></input>
            <br></br>
            <button type="button" className="button" name="submit"
            onClick={this.props.onSubmit}>
              Add to wishlist
            </button>
            <button type="button" className="button" name="item-add"
            onClick={() => this.props.addItemControler(false)}>
              Cancel
            </button>
            {this.errorMessage(this.props.addItemError)}
          </form>
        </div>
      );
    // if wishlist is empty, prompt to create one
    } else if (this.props.emptyWishlist) {
      return(
        <button type="button" className="button" name="item-add"
        onClick={() => this.props.addItemControler(true)}>
          Create a wishlist
        </button> 
      );
    // if not adding an item
    } else {
      return(
        <button type="button" className="add-item" name="item-add"
        onClick={() => this.props.addItemControler(true)}>
          Add Item
        </button> 
      );
    }
  }
};

/**
 * @class WishlistDisplay
 * Component that handles the display of the wishlist.
 * Replaces a wishlist item with an edit form if needed.
 * 
 * NOTE: I could have included a url regex, and then format
 * valid URL's as actual links, but that seemed to add
 * unnecessary complexity. See:
 * https://urlregex.com/
 */
class WishlistDisplay extends Component {
  render() {
    let details = this.props.wishlistDetails;
    let list = [];
    // if there are details to display
    if (details) {
      list = details.map((item, idx) =>
      <li key={idx}>
        {item.title}
        <br></br>
        {item.url}
        <br></br>
        <WishlistItemControl 
          removeItem={() => this.props.removeItem(idx)}
          updateItem={() => this.props.updateItem(idx)}
        />
      </li>
      );
    }
    
    // check if we are editing an item
    if (this.props.editingItem) {
      let idx = this.props.editItemIdx;
      list[idx] = (
        <li key={idx}>
          <EditWishlistItem
            onSubmit={this.props.itemSubmit}
            onChange={this.props.itemInputChange}
            editItemController={this.props.editItemController}
            editItemError={this.props.editItemError}
            itemInfo={details[idx]}
          />
        </li>
      );
    }
    if (this.props.wishlistSelected) {
      list.push(
        <li key={list.length + 1}>
          <AddItem
            onChange={this.props.itemInputChange}
            onSubmit={this.props.itemSubmit}
            addingItem={this.props.addingItem}
            addItemControler={res => this.props.addItemControler(res)}
            addItemError={this.props.addItemError}
            wishlistSelected={this.props.wishlistSelected}
            emptyWishlist={this.props.emptyWishlist}
          />
        </li>
      );
    }
    return(
      <div><ul>{list}</ul></div>
    );
  }
}

/**
 * @class EditWishlistItem
 * Similar to AddItem, but allows for editing functionality.
 * Displays the form to edit an item with prefilled values.
 */
class EditWishlistItem extends Component {
  /**
   * Helps display error text if form fields are empty
   * @param {bool} shouldDisplay 
   */
  errorMessage(shouldDisplay) {
    if (shouldDisplay) {
      return(
        <div>Make sure both fields have input.</div>
      );
    }
  }

  /**
   * React render() function.
   */
  render() {
    return(
      <div>
          <form onChange={this.props.onChange}>
            <label>Title of entry:</label>
            <input type="text" name="edit-title"
            defaultValue={this.props.itemInfo.title}>
            </input>
            <br></br>
            <label>URL/description:</label>
            <input className="url-input" type="text" name="edit-url"
            defaultValue={this.props.itemInfo.url}>
            </input>
            <br></br>
            <button type="button" className="button" name="submit-edit"
            onClick={this.props.onSubmit}>
              Submit change
            </button>
            <button type="button" className="button" name="cancel-edit"
            onClick={() => this.props.editItemController(false)}>
              Cancel
            </button>
            {this.errorMessage(this.props.editItemError)}
          </form>
        </div>
    );
  }
}

export default Wishlist;
