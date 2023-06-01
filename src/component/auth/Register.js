import AuthInput from "./AuthInput";
import AuthForm from "./AuthForm";
import AuthSubmitButton from "./AuthSubmitButton";
import styles from "./Register.module.css";
import React, { useState, useEffect } from "react";
import useRegister from "../../hooks/useRegister";
import Header from "../main/Header";

const Register = () => {
  const hook = useRegister();

  return (
    <>
      <Header />
      <div className={styles.container}>
        <div className={`${styles.authWrapper}`} style={{ marginTop: "2rem" }}>
          <AuthForm onSubmit={hook.submitHandler} name={"회원가입"}>
            <div className={`${styles.emailWrapper} w-[430px]`}>
              <div style={{ marginBottom: "0.3rem" }}>
                <div>
                  <div className={styles.label}>이메일</div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <input
                      type="text"
                      placeholder="E-mail"
                      className={styles.emailInput}
                      onChange={(e) => hook.setEmailText(e.target.value)}
                    />
                    <button
                      className={styles.emailBtn}
                      onClick={hook.checkEmailHandler}
                    >
                      중복확인
                    </button>
                  </div>
                </div>
                <label
                  className={`${styles.explainLabel} ${
                    hook.emailInputColor === "pass"
                      ? styles.greenExplainLabel
                      : hook.emailInputColor !== "default"
                      ? styles.falseExplainLabel
                      : null
                  }`}
                >
                  {hook.email}
                </label>
              </div>
              <div>
                {" "}
                <div style={{ marginBottom: "0.3rem" }}>
                  <div className={styles.label}>비밀번호</div>
                  <AuthInput
                    type="password"
                    placeholder="비밀번호"
                    inputColor={hook.passColor}
                    eventHandler={hook.setPass}
                  />
                  <label
                    className={`${styles.explainLabel} ${
                      hook.passColor === true ? null : styles.falseExplainLabel
                    }`}
                  >
                    * 6글자 이상 입력해주세요.
                  </label>
                </div>
              </div>
              <div>
                <div className={styles.label}>비밀번호 확인</div>
                <AuthInput
                  type="password"
                  placeholder="비밀번호 확인"
                  inputColor={hook.rePassColor}
                  eventHandler={hook.setRePass}
                />
              </div>
              <div>
                <div className={styles.label}>닉네임</div>
                <div className={styles.nickWrapper}>
                  <input
                    type="text"
                    placeholder="닉네임"
                    className={styles.nickInput}
                    onChange={(e) => hook.setNick(e.target.value)}
                  />
                  <button
                    className={styles.emailBtn}
                    onClick={hook.checkNickHandler}
                  >
                    중복확인
                  </button>
                </div>
                <label
                  className={`${styles.explainLabel} ${
                    hook.nickInputColor === "pass"
                      ? styles.greenExplainLabel
                      : hook.emailInputColor !== "fail"
                      ? styles.falseExplainLabel
                      : null
                  }`}
                >
                  {hook.nickWarn}
                </label>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "1rem",
                }}
              >
                <label className={styles.warnLabel}>{hook.warn}</label>
              </div>
              <AuthSubmitButton text="회원가입" />
            </div>
          </AuthForm>
        </div>
      </div>
    </>
  );
};

export default Register;
