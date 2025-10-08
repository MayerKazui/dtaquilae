import { createContext, useContext, useState } from "react";

const StateContext = createContext({
  token: null,
  notification: "",
  setUser: () => {},
  setRole: () => {},
  setToken: () => {},
  setNotification: () => {},
  blockMain: () => {},
  unblockMain: () => {},
  setCheckAccesses: () => {},
});

export const ContextProvider = ({ children }) => {
  const [user, _setUser] = useState(JSON.parse(localStorage.getItem("USER")));
  const [role, _setRole] = useState(localStorage.getItem("ROLE"));
  const [notification, _setNotification] = useState("");
  const [token, _setToken] = useState(localStorage.getItem("ACCESS_TOKEN"));

  const setNotification = (message, timeout = 5000) => {
    _setNotification(message);
    setTimeout(() => {
      _setNotification("");
    }, timeout);
  };

  /**
   * Bloque le block principal pour éviter tout clique durant une action
   */
  const blockMain = () => {
    let main = document.querySelector("#main");
    let loading = document.querySelector("#loading");
    main.classList.add("pointer-events-none");
    main.classList.add("opacity-25");
    loading.classList.remove("hidden");
  };

  /**
   * Débloque le block principal après l'exécution d'une action
   */
  const unblockMain = () => {
    let main = document.querySelector("#main");
    let loading = document.querySelector("#loading");
    main.classList.remove("pointer-events-none");
    main.classList.remove("opacity-25");
    loading.classList.add("hidden");
  };

  /**
   * Mise en session du token si le retour d'API le permet. Si le temps est dépassé, le jeton est retiré de la session.
   *
   * @param {String} token - Le jeton d'authentification (laravel breeze)
   */
  const setToken = (token) => {
    _setToken(token);
    if (token) {
      localStorage.setItem("ACCESS_TOKEN", token);
    } else {
      localStorage.removeItem("ACCESS_TOKEN");
    }
  };

  /**
   * Mise en session du user si le retour d'API le permet. Si le temps est dépassé, le user est retiré de la session.
   *
   * @param {Object} user - L'utilisateur
   */
  const setUser = (user) => {
    _setUser(user);
    if (user) {
      localStorage.setItem("USER", JSON.stringify(user));
    } else {
      localStorage.removeItem("USER");
    }
  };

  /**
   * Mise en session du rôle pour la gestion RBAC si le retour d'API le permet. Si le temps est dépassé, le rôle est retiré de la session.
   *
   * @param {String} role - Le rôle
   */
  const setRole = (role) => {
    _setRole(role);
    if (role) {
      localStorage.setItem("ROLE", role);
    } else {
      localStorage.removeItem("ROLE");
    }
  };

  return (
    <StateContext.Provider
      value={{
        user,
        token,
        role,
        setUser,
        setToken,
        setRole,
        notification,
        setNotification,
        blockMain,
        unblockMain,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
