import React, { Component } from "react";

// Styles
import "./styles.css";

// Router
import { Redirect, withRouter } from "react-router-dom";

// Components
import Button from "../../components/button";

// Services
import { gameData as game_data } from "../../services/data";
import { themes } from "../../services/themes";
import { find, updateItem } from "../../database";
import { RoomContext } from "../../services/room";

class GameSettings extends Component {
  static contextType = RoomContext;
  state = {
    roomId: null,
    maxRounds: 1,

    redirect: false,
    nicknameP1: "Player 1",
    nicknameP2: "Player 2",

    inputP1: "",
    inputP2: "",
  };

  constructor(props) {
    super(props);
    const id = this.props.match.params.id;

    this.state.roomId = id;
    this.setRounds = this.setRounds.bind(this);
    this.changeTheme = this.changeTheme.bind(this);
  }

  setRounds(rounds) {
    this.setState({ maxRounds: rounds });
  }

  //   setRoomId(roomId) {
  //     this.setState({ roomId });
  //   }

  async start() {
    const maxRounds = this.state.maxRounds;
    const nicknameP1 = this.state.nicknameP1;
    const nicknameP2 = this.state.nicknameP2;

    const gameData = await game_data.generateData(
      maxRounds,
      nicknameP1,
      nicknameP2
    );
    await game_data.save(gameData);
    const ress = this.context;

    console.log("USERDID", ress); // { name: 'Tania', loggedIn: true }

    const room = await find({ table: "room", id: this.state.roomId });
    const player1 = room.player1;
    const player2 = room.player2;
    const userId = ress.userId;
    if (room.player1.id === userId) {
      player1.isReady = true;
    } else {
      player2.isReady = true;
    }

    updateItem({
      table: "room",
      id: this.state.roomId,
      player1,
      player2,
    });
    this.setState({ redirect: true });
  }

  async componentDidMount() {
    console.log("asd", this.state.roomId);
    const res = await find({
      table: "room",
      id: this.state.roomId,
    });

    console.log("res", res);

    const { player1, player2 } = res;

    const data = localStorage.getItem("game_data")
      ? game_data.load()
      : { p1: {}, p2: {} };

    data.p1 = {
      nickname: player1.name,
    };

    data.p2 = {
      nickname: player2.name,
    };

    const newState = {};
    if (data.p1.nickname && data.p1.nickname !== "Player 1") {
      newState.nicknameP1 = data.p1.nickname;
      newState.inputP1 = data.p1.nickname;
    }

    if (data.p2.nickname && data.p2.nickname !== "Player 2") {
      newState.nicknameP2 = data.p2.nickname;
      newState.inputP2 = data.p2.nickname;
    }

    if (data.maxRounds) {
      newState.maxRounds = data.maxRounds;
    }

    this.setState(newState);

    localStorage.removeItem("game_data");

    themes.loadThemes();
  }

  changeTheme(themeIndex) {
    switch (themeIndex) {
      case 0:
        themes.setTheme(themes.themes_data.dark);
        break;
      case 1:
        themes.setTheme(themes.themes_data.blue);
        break;
      default:
        themes.setTheme(themes.themes_data.dark);
        break;
    }
  }

  render() {
    // if (hasGameStarted) {
    //   return <Redirect to={`/ticTacToe/${this.state.roomId}/game`} />;
    // }
    if (this.state.redirect) {
      return <Redirect to={`/ticTacToe/${this.state.roomId}/game`} />;
    } else {
      return (
        <div className="GameSettings">
          <div className="themesSets">
            <ul>
              <li>
                <Button
                  onClick={() => this.changeTheme(0)}
                  value={themes.themes_data.dark.title}
                />
              </li>

              <li>
                <Button
                  onClick={() => this.changeTheme(1)}
                  value={themes.themes_data.blue.title}
                />
              </li>
            </ul>
          </div>

          <div className="rounds">
            <h1>Rounds: </h1>
            <ul>
              <li>
                <Button onClick={() => this.setRounds(1)} value="1" />
              </li>

              <li>
                <Button onClick={() => this.setRounds(3)} value="3" />
              </li>

              <li>
                <Button onClick={() => this.setRounds(5)} value="5" />
              </li>
            </ul>
          </div>
          <div className="players">
            <div>
              <h1>Player 1: </h1>
              <input
                type="text"
                placeholder="Name..."
                className="inputNickname"
                onChange={(e) =>
                  this.setState({
                    inputP1: e.target.value,
                    nicknameP1: e.target.value,
                  })
                }
                value={this.state.inputP1}
              />
            </div>

            <div>
              <h1>Player 2: </h1>
              <input
                type="text"
                placeholder="Name..."
                className="inputNickname"
                onChange={(e) =>
                  this.setState({
                    inputP2: e.target.value,
                    nicknameP2: e.target.value,
                  })
                }
                value={this.state.inputP2}
              />
            </div>
          </div>
          <div>
            <Button onClick={() => this.start()} value="Start!" />
          </div>
        </div>
      );
    }
  }
}

export default withRouter(GameSettings);
