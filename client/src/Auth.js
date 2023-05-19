import { createContext, useState } from "react";


export const AuthContext = createContext();

export const AuthContextProvider = ({children})=> {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState('');

  return (
    <AuthContext.Provider value={{isAuthenticated, setIsAuthenticated, user, setUser}}>
      {children}
    </AuthContext.Provider>
  );
};
