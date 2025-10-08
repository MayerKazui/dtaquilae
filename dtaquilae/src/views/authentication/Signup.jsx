import { Link } from "react-router-dom";
import { createRef, useState } from "react";
import axiosClient from "../../axios-client.js";
import { useStateContext } from "../../context/ContextProvider.jsx";
import { getLabels } from "../../lang/langFunctions.js";

export default function Signup() {
  const nameRef = createRef();
  const emailRef = createRef();
  const passwordRef = createRef();
  const passwordConfirmationRef = createRef();
  const { setUser, setToken } = useStateContext();
  const [errors, setErrors] = useState(null);

  const onSubmit = (ev) => {
    ev.preventDefault();
    const payload = {
      name: nameRef.current.value,
      email: emailRef.current.value,
      password: passwordRef.current.value,
      password_confirmation: passwordConfirmationRef.current.value,
    };
    axiosClient
      .post("/signup", payload)
      .then(({ data }) => {
        setUser(data.user);
        setToken(data.token);
      })
      .catch((err) => {
        const response = err.response;
        if (response && response.status == 422) {
          setErrors(response.data.errors);
        }
      });
  };

  return (
    <div className="login-signup-form animate-fade-in-down">
      <div className="form">
        <form onSubmit={onSubmit}>
          <h1 className="title">{getLabels('signup.title')}</h1>
          {errors && (
            <div className="alert">
              {Object.keys(errors).map((key) => (
                <p key={key}>{errors[key][0]}</p>
              ))}
            </div>
          )}
          <input ref={nameRef} type="text" placeholder={getLabels('users.fields.name')} />
          <input ref={emailRef} type="email" placeholder={getLabels('users.fields.email')} />
          <input ref={passwordRef} type="password" placeholder={getLabels('users.fields.password')} />
          <input
            ref={passwordConfirmationRef}
            type="password"
            placeholder={getLabels('users.fields.passwordConfirmation')}
          />
          <button className="btn btn-block">{getLabels('signup.title')}</button>
          <p className="message">
            {getLabels('signup.alreadyAccount')} <Link to="/login">{getLabels('login.btn.connect')}</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
