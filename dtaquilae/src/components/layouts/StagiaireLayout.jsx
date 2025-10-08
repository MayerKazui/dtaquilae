import { Navigate, Outlet } from "react-router-dom";
import axiosClient from "../../axios-client.js";
import { useStateContext } from "../../context/ContextProvider.jsx";
import { getLabels } from "../../lang/langFunctions.js";
import {hasRole} from "../../utils/accessControl.js"

export default function StagiaireLayout() {
  
  const { user, token, role, notification, setUser, setToken,setRole} = useStateContext();

  if (!token) {
    return <Navigate to={"/login"} />;
  }

  if(!hasRole(role, 'STA')) {
    return <Navigate to={"/"} />;
  }
  
  const onLogout = (ev) => {
    ev.preventDefault();
    axiosClient.post("/logout").then(() => {
      setUser(null);
      setToken(null);
      setRole(null);
    });
  };
  
  return (
    <div id={"stagiaireLayout"}>
    <div className={"content"}>
      <header>
      <div>{user.nom} {user.prenom}</div>
        <div>
          <a className={"btn btn-logout"} href="#" onClick={onLogout}>
            {getLabels('layout.disconnected')}
          </a>
        </div>
      </header>
      <div
        id="main"
        className="relative flex min-h-screen flex-col overflow-hidden pr-5 pl-5 pt-5"
      >
        <div
          id="loading"
          className="loading z-50 absolute top-1/3 left-1/2 hidden"
        ></div>
        <Outlet />
      </div>
      {notification && <div className="notification">{notification}</div>}
    </div>
  </div>
  )
}