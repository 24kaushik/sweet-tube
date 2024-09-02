import React, { createContext, useContext, useEffect, useState } from "react";

const UserContext = createContext();

const UserProvider = ({children}) => {
  const [user, setUser] = useState();
  useEffect(() => {
    async function fetchUser() {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND}/users/current-user`,
        {
          method: "get",
          credentials: "include",
        }
      );
      const data = await response.json();
      if (data.success) {
        setUser(data.data);
      }
    }
    fetchUser();
  }, []);

  return <UserContext.Provider value={{user}}>{children}</UserContext.Provider>;
};

const useUser = () => useContext(UserContext);

export default UserProvider;
export {useUser}
