import { useRef, useState, useEffect, useContext } from "react";
import { create, updateItem, find, listen } from "../../database";
import { v1 as createUuid } from "uuid";
import { Redirect } from "react-router-dom";
import history from "../../history";
import { RoomContext } from "../../services/room";

const Lobby = () => {
  const { userId, setUserId } = useContext(RoomContext);
  const inputRef = useRef(null);
  const [isLookingMatch, setIsLookingMatch] = useState(false);
  console.log({ userId, setUserId });

  const startGame = (id) => {
    console.log("startGame func", id);
    history.push("/ticTacToe/" + id);
    // return <Redirect to="/ticTacToe" />;
  };

  useEffect(() => {
    const listener = listen({
      table: "room",
      noId: true,
      callback: (snapshot) => {
        if (snapshot.exists()) {
          const roomId = Object.keys(snapshot.val())[0];
          startGame(roomId);
        } else {
        }
      },
    });
    listener();
  }, []);

  const findMatch = async () => {
    const currentQueue = await find({ table: "queue" });
    console.log('findMatch @@menegat', userId)
    const player = {
      name: inputRef.current.value,
      id: userId,
    };

    if (!currentQueue) {
      create({
        table: "queue",
        players: [player],
        noId: true,
      });
      setIsLookingMatch(true);
    } else {
      const opponent = currentQueue.players.at(-1);

      if (opponent) {
        const res = await create({
          table: "room",
          player1: opponent,
          player2: player,
        });
        updateItem({
          table: "queue",
          players: [],
        });
        console.log(res);
        //startGame()
      } else {
        updateItem({
          table: "queue",
          players: [...currentQueue.players, player],
        });
        setIsLookingMatch(true);
      }
    }
  };

  const cancelMatchSearch = async () => {};

  // render(){

  // }
  return (
    <div className="div">
      {isLookingMatch && <h1>PROCURANDO PARTIDA...</h1>}
      <input type="text" ref={inputRef} />
      {!isLookingMatch && <button onClick={findMatch}>Achar partida</button>}
      {isLookingMatch && (
        <button onClick={cancelMatchSearch}>Cancelar Busca</button>
      )}
    </div>
  );
};

export default Lobby;
