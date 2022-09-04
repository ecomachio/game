import React, { useEffect, useState } from "react";
import { v1 } from "uuid";

export const RoomContext = React.createContext(null);

const RoomProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);
  const [maxRounds, setMaxRounds] = useState(1);

  useEffect(() => {
    setUserId(v1());
  }, []);

  const contextValue = React.useMemo(
    () => ({ userId, maxRounds, setMaxRounds }),
    [userId, maxRounds, setMaxRounds]
  );

  console.log("CONTEXT USER ID", userId);

  return (
    <RoomContext.Provider value={contextValue}>{children}</RoomContext.Provider>
  );
};

export default RoomProvider;
