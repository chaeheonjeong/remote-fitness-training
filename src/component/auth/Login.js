import AuthForm from "./AuthForm";
import AuthInput from "./AuthInput";
import AuthSubmitButton from "./AuthSubmitButton";
import styles from "./Login.module.css";
import { users } from "../../util/dummy";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import userStore from "../../store/user.store";
import Header from "../main/Header";
import { SiNaver } from "react-icons/si";
import { RiKakaoTalkFill } from "react-icons/ri";

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

  const findPasswordHandler = (event) => {
    event.preventDefault();
    navigate("/findPassword");
  };

  useEffect(() => {
    user.token !== null && navigate("/");
  }, [user.token]);

  return (
    <>
      <Header />
      <div className={styles.container}>
        <div className={`${styles.authWrapper} pt-20`}>
          <AuthForm onSubmit={submitHandler} name={"로그인"}>
            <div className={`${styles.inputWrapper}  w-[430px]`}>
              <div>
                <div className={styles.label}>이메일</div>
                <AuthInput
                  type="text"
                  placeholder="E-mail"
                  inputColor={true}
                  eventHandler={setEmailText}
                />
              </div>
              <div>
                <div className={styles.label}>비밀번호</div>
                <AuthInput
                  type="password"
                  placeholder="비밀번호"
                  inputColor={true}
                  eventHandler={setPassText}
                />
              </div>
              <div style={{ display: "flex", justifyContent: "center" }}>
                {" "}
                <label className={styles.warnLabel}>{warnLabel}</label>
              </div>
              <AuthSubmitButton text="이메일 로그인" />
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  width: "100%",
                  gap: "1rem",
                  paddingTop: "1rem",
                }}
              >
                <p
                  style={{
                    fontSize: "14px",
                    color: "rgb(113, 113, 113)",
                    fontWeight: "550",
                    cursor: "pointer",
                  }}
                  onClick={findPasswordHandler}
                >
                  비밀번호 찾기
                </p>{" "}
                <p
                  style={{
                    fontSize: "14px",
                    color: "rgb(201, 201, 201)",
                  }}
                >
                  |
                </p>
                <p
                  style={{
                    fontSize: "14px",
                    color: "rgb(113, 113, 113)",
                    fontWeight: "550",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    navigate("/register");
                  }}
                >
                  회원가입
                </p>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                  marginTop: "3rem",
                }}
              >
                <button className={styles.KakaoSocialBtn}>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      gap: "0.8rem",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <RiKakaoTalkFill size={25} />
                    카카오로 시작하기
                  </div>
                </button>
                <button className={styles.NaverSocialBtn}>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      gap: "0.8rem",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <SiNaver />
                    네이버로 시작하기
                  </div>
                </button>
              </div>
            </div>
          </AuthForm>
        </div>
      </div>
    </>
  );
};

export default Login;
