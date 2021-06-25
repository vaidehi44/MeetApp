import React, { Component } from 'react';
import Room from './Room'
import { v4 as uuidv4 } from 'uuid';
import { BrowserRouter, Route, Link, Switch } from 'react-router-dom';

class App extends Component {
  render() {
    const roomId = uuidv4();

    return(
      <BrowserRouter>
        <Switch>
          
          <Route path='/rooms/:id' render = {(props) =>
              <Room {...props}/> }>
          </Route>

          <Route path='/' >
            <button type='button'>
              <Link to={'/rooms/'+roomId}>
                Create new room
              </Link>
            </button>          
          </Route>

        </Switch>
      </BrowserRouter>
      
    );
  };
};

export default App;