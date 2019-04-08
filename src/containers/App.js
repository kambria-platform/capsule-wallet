import React, { Component } from 'react';
import { Route, Link, Switch, Redirect } from 'react-router-dom';

import TestWallet from './testWallet';

class App extends Component {
  render() {
    return (
      <div>
        <header>
          <Link to='/test-wallet'>Test Wallet</Link>
        </header>
        <main>
          <Switch>
            <Redirect exact from='/' to='/test-wallet' />
            <Route exact path='/test-wallet' component={TestWallet} />
          </Switch>
        </main>
      </div>
    );
  }
}

export default App;
