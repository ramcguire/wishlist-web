/**
 * @file App.js
 * @brief - Included from create-react-app
 * 
 * Container for the main UI of the wishlist application.
 * 
 * @author - facebook
 * @date 12/15/2019
 */

import React, { Component } from 'react';
import './App.css';
import Wishlist from './components/wishlist';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Wishlist Creator</h1>
          <img className="App-logo" src="gift2.svg" alt="gift logo for application"></img>
        </header>
        <Wishlist />
      </div>
    );
  }
}

export default App;
