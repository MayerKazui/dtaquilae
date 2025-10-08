import { Link, Navigate, Outlet, useNavigate } from "react-router-dom";
import axiosClient from "../../axios-client.js";
import { useStateContext } from "../../context/ContextProvider.jsx";
import { getLabels, getMessages } from "../../lang/langFunctions.js";
import LoadingComponent from "../common/LoadingComponent.jsx";
import { hasRole, hasPermission } from "../../utils/accessControl.js";
import { useEffect } from "react";
import { Menubar } from "primereact/menubar";

export default function DefaultLayout() {
  const {
    role,
    token,
    notification,
    setNotification,
    setToken,
    setUser,
    setRole,
  } = useStateContext();
  const queryParameters = new URLSearchParams(window.location.search);

  if (!token) {
    return <Navigate to={"/login"} />;
  }

  if (hasRole(role, "STA")) {
    return <Navigate to={"/stagiaire/accueil"} />;
  }

  const navigate = useNavigate();

  useEffect(() => {
    if (queryParameters.get("forbidden"))
      setNotification(getMessages("common.unauthorized"));
  }, []);

  const onLogout = (ev) => {
    ev.preventDefault();
    axiosClient.post("/logout").then(() => {
      setToken(null);
      setUser(null);
      setRole(null);
    });
  };

  const items = [
    {
      label: "Tableau de bord",
      icon: "pi pi-home",
      command: () => {
        navigate("/");
      },
    },
    {
      label: "Utilisateurs",
      icon: "pi pi-user",
      items: [
        {
          label: "Lister",
          icon: "pi pi-search",
          command: () => {
            navigate("/users");
          },
          visible: hasPermission("user.search"),
        },
        {
          label: "Ajouter",
          icon: "pi pi-plus",
          command: () => {
            window.location.href.includes("users/")
              ? window.open("/users/add", "_blank")
              : navigate("/users/add");
          },
          visible: hasPermission("user.create"),
        },
      ],
    },
    {
      label: "Stages",
      icon: "pi pi-users",
      items: [
        {
          label: "Lister",
          icon: "pi pi-search",
          command: () => {
            navigate("/stages");
          },
          visible: hasPermission("stage.search"),
        },
        {
          label: "Ajouter",
          icon: "pi pi-plus",
          command: () => {
            navigate("/stages/add");
          },
          visible: hasPermission("stage.create"),
        },
      ],
    },
    {
      label: "Questions",
      icon: "pi pi-question",
      items: [
        {
          label: "Lister",
          icon: "pi pi-search",
          command: () => {
            navigate("/questions");
          },
          visible: hasPermission("question.search"),
        },
        {
          label: "Ajouter",
          icon: "pi pi-plus",
          command: () => {
            navigate("/questions/new");
          },
          visible: hasPermission("question.create"),
        },
      ],
    },
    {
      label: "Questionnaires",
      icon: "pi pi-file-edit",
      items: [
        {
          label: "Lister",
          icon: "pi pi-search",
          command: () => {
            navigate("/questionnaires");
          },
          visible: hasPermission("questionnaire.search"),
        },
        {
          label: "Ajouter",
          icon: "pi pi-plus",
          command: () => {
            navigate("/questionnaires/add");
          },
          visible: hasPermission("questionnaire.create"),
        },
      ],
    },
    {
      label: "Tests",
      icon: "pi pi-list-check",
      items: [
        {
          label: "Lister",
          icon: "pi pi-search",
          command: () => {
            navigate("/tests");
          },
          visible: hasPermission("test.search"),
        },
        {
          label: "Ajouter",
          icon: "pi pi-plus",
          command: () => {
            navigate("/tests/add");
          },
          visible: hasPermission("test.create"),
        },
      ],
    },
  ];

  const end = (
    <a
      href="#"
      onClick={onLogout}
      className="mr-2 p-3 hover:rounded hover:bg-gray-100"
    >
      {getLabels("layout.disconnected")}
    </a>
  );

  const start = <img className="ml-4" src="/DTA_aquilae.svg" width={"35%"} />;

  return (
    <>
      <LoadingComponent />
      <div id={"defaultLayout"}>
        <div className={"content"}>
          <Menubar model={items} end={end} start={start} />
          <div
            id="main"
            className="relative flex min-h-screen flex-col overflow-hidden pl-5 pr-5 pt-5"
          >
            <Outlet />
          </div>
          {notification && <div className="notification">{notification}</div>}
        </div>
      </div>
    </>
  );
}
