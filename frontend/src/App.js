import * as React from "react";
import logo from "./logo.svg";
import "./app.css";
import { create, listen } from "./database";
import Routes from "./routes";
import RoomProvider from "./services/room";


function App() {
  const handleSubmit = async (e) => {
    e.preventDefault();
    create({
      table: "users",
      name: "edian",
      sexo: "gay",
    });
  };

  React.useEffect(() => {
    const listener = listen({
      table: "users",
      id: "4b142a90-2bf8-11ed-848e-578fe79398aa",
      callback: (snapshot) => {
        console.log(snapshot.val());
      },
    });
    listener();
  }, []);

  return (
    <RoomProvider>
      <Routes />
    </RoomProvider>
  );
}

export default App;
