import AuthForm from "./AuthForm";
import AuthInput from "./AuthInput";
import AuthSubmitButton from "./AuthSubmitButton";
import styles from "./FindPw.module.css";
import useFindPw from "../../hooks/useFindPw";
import FindPwCount from "./FindPwCount";

const FindPw = () => {
  const hook = useFindPw();

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
          <button className={styles.emailBtn} onClick={hook.sendEmailHandler}>
            인증번호 발송
          </button>
        </div>
        {hook.emailInputColor !== "default" && (
          <label
            className={`${styles.explainLabel} ${
              hook.emailInputColor !== "pass" ? styles.falseExplainLabel : null
            }`}
          >
            {hook.sendText}
          </label>
        )}
        <div className={styles.emailWrapper}>
          <input
            type="text"
            placeholder="인증 번호"
            className={styles.numInput}
            onChange={(e) => hook.setNum(e.target.value)}
            value={hook.num}
          />
          {hook.emailInputColor === "pass" && <FindPwCount hook={hook} />}
          <button className={styles.numBtn} onClick={hook.numBtnHandler}>
            확인
          </button>
        </div>
        {hook.numCheckColor !== "default" && (
          <label
            className={`${styles.explainLabel} ${
              hook.numCheckColor !== "pass"
                ? styles.falseExplainLabel
                : styles.greenExplainLabel
            }`}
          >
            {hook.numCheckText}
          </label>
        )}
        <AuthInput
          type="password"
          placeholder="새 비밀번호"
          eventHandler={hook.setPass}
          inputColor={hook.passColor}
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
          eventHandler={hook.setRePass}
          inputColor={hook.rePassColor}
        />
        <label className={styles.warnLabel}>{hook.warn}</label>
        <AuthSubmitButton text="비밀번호 변경하기" />
      </AuthForm>
    </div>
  );
};

export default FindPw;
