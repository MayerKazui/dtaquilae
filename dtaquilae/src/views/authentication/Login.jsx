import { createRef, useEffect, useState } from "react";
import axiosClient from "../../axios-client.js";
import { useStateContext } from "../../context/ContextProvider.jsx";
import { getLabels, getMessages } from "../../lang/langFunctions.js";

export default function Login() {
  const queryParameters = new URLSearchParams(window.location.search);
  const { setNotification } = useStateContext();
  const loginRef = createRef();
  const passwordRef = createRef();
  const { setUser, setToken, setRole } = useStateContext();
  const [errors, setErrors] = useState(null);

  const onSubmit = (ev) => {
    ev.preventDefault();
    const payload = {
      password: passwordRef.current.value,
      login: loginRef.current.value,
    };
    axiosClient
      .post("/login", payload)
      .then(({ data }) => {
        setUser(data.user);
        setToken(data.token);
        setRole(data.role);
        setNotification("");
      })
      .catch((err) => {
        const response = err.response;
        if (response && response.status == 422) {
          let message =
            response.status == 422
              ? response.data.message
              : response.data.errors;
          setErrors(message);
        }
      });
  };

  useEffect(() => {
    if (queryParameters.get("token"))
      setNotification(getMessages("users.token.expired"), 2147483647);
  });

  return (
    <div className="login-signup-form animate-fade-in-down">
      <div className="form">
        <div className="flex justify-center">
          <img className="mb-4 ml-8" width={"125rem"} src="DTA_aquilae.svg" />
        </div>
        <form onSubmit={onSubmit}>
          <h1 className="title">{getLabels("login.title")}</h1>
          {errors && (
            <div className="alert">
              {typeof errors === "string" ? (
                <p>{errors}</p>
              ) : (
                Object.keys(errors).map((key) => <p key={key}>{errors[key]}</p>)
              )}
            </div>
          )}
          <input
            ref={loginRef}
            type="login"
            placeholder={getLabels("users.fields.login")}
          />
          <input
            ref={passwordRef}
            type="password"
            placeholder={getLabels("users.fields.password")}
          />
          <button className="btn btn-block">
            {getLabels("login.btn.connect")}
          </button>
        </form>
      </div>
    </div>
  );
}
