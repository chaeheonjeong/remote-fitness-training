import AuthInput from "./AuthInput";
import AuthForm from "./AuthForm";
import AuthSubmitButton from "./AuthSubmitButton";
import styles from "./Register.module.css";
import React, { useState, useEffect } from "react";
import useRegister from "../../hooks/useRegister";

const Register = () => {
  const hook = useRegister();

  return (
    <div className={styles.authWrapper}>
      <AuthForm onSubmit={hook.submitHandler}>
        <div className={styles.emailWrapper}>
          <input
            type="text"
            placeholder="E-mail"
            className={styles.emailInput}
            onChange={(e) => hook.setEmailText(e.target.value)}
          />
          <button className={styles.emailBtn} onClick={hook.checkEmailHandler}>
            중복확인
          </button>
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

        <AuthInput
          type="password"
          placeholder="비밀번호 확인"
          inputColor={hook.rePassColor}
          eventHandler={hook.setRePass}
        />
        <AuthInput
          type="text"
          placeholder="닉네임"
          inputColor={true}
          eventHandler={hook.setNick}
        />
        <label className={styles.warnLabel}>{hook.warn}</label>
        <AuthSubmitButton text="회원가입" />
      </AuthForm>
    </div>
  );
};

export default Register;
