import React, { Component } from "react";

// Router
import { Router as ReactRouter, Switch, Route } from "react-router-dom";

// Pages
import GameSettings from "./pages/GameSettings";
import Game from "./pages/Game";
import Lobby from "./pages/Lobby/Lobby";
import history from "./history";

class Routes extends Component {
  render() {
    return (
      <ReactRouter history={history}>
        <Switch>
          {/* <Route exact path="/" component={GameSettings} /> */}
          <Route exact path="/ticTacToe/:id" component={GameSettings} />
          <Route exact path="/ticTacToe/:id/game" component={Game} />
          <Route path="/" component={Lobby} />
        </Switch>
      </ReactRouter>
    );
  }
}

export default Routes;
