import AuthForm from "./AuthForm";
import AuthInput from "./AuthInput";
import AuthSubmitButton from "./AuthSubmitButton";
import styles from "./Login.module.css";
import { users } from "../../util/dummy";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import userStore from "../../store/user.store";

const Login = () => {
  const [emailText, setEmailText] = useState("");
  const [passText, setPassText] = useState("");
  const [warnLabel, setWarnLabel] = useState("");
  const navigate = useNavigate();
  const user = userStore();

  const submitHandler = (event) => {
    event.preventDefault();
    user.login(emailText, passText, setWarnLabel);
  };

  const submitRegisterHandler = (event) => {
    event.preventDefault();
    navigate("/register");
  };

  const findPasswordHandler = (event) => {
    event.preventDefault();
    navigate("/findPassword");
  };

  useEffect(() => {
    user.token !== null && navigate("/");
  }, [user.token]);

  return (
    <div className={styles.authWrapper}>
      <AuthForm onSubmit={submitHandler}>
        <AuthInput
          type="text"
          placeholder="E-mail"
          inputColor={true}
          eventHandler={setEmailText}
        />
        <AuthInput
          type="password"
          placeholder="비밀번호"
          inputColor={true}
          eventHandler={setPassText}
        />
        <label className={styles.warnLabel}>{warnLabel}</label>
        <label className={styles.findPassLabel} onClick={findPasswordHandler}>
          비밀번호를 잊으셨나요?
        </label>
        <AuthSubmitButton text="로그인" />
        <button
          type="submit"
          className={styles.registerBtn}
          onClick={() => {
            navigate("/register");
          }}
        >
          회원가입
        </button>
      </AuthForm>
    </div>
  );
};

export default Login;
