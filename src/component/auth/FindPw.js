import AuthForm from "./AuthForm";
import AuthInput from "./AuthInput";
import AuthSubmitButton from "./AuthSubmitButton";
import styles from "./FindPw.module.css";
import useFindPw from "../../hooks/useFindPw";
import FindPwCount from "./FindPwCount";
import Header from "../main/Header";

const FindPw = () => {
  const hook = useFindPw();

  return (
    <>
      <Header />
      <div className={styles.container}>
        <div className={`${styles.authWrapper} pt-8`}>
          <AuthForm onSubmit={hook.submitHandler} name={"비밀번호 찾기"}>
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
                      onClick={hook.sendEmailHandler}
                    >
                      인증번호
                    </button>
                  </div>
                </div>
                {hook.emailInputColor !== "default" && (
                  <label
                    className={`${styles.explainLabel} ${
                      hook.emailInputColor !== "pass"
                        ? styles.falseExplainLabel
                        : null
                    }`}
                  >
                    {hook.sendText}
                  </label>
                )}
              </div>
              <div style={{ marginBottom: "0.3rem" }}>
                <div className={styles.label}>인증번호</div>
                <div className={styles.numberWrapper}>
                  <input
                    type="text"
                    placeholder="인증 번호"
                    className={styles.numInput}
                    onChange={(e) => hook.setNum(e.target.value)}
                    value={hook.num}
                  />
                  {hook.emailInputColor === "pass" && (
                    <FindPwCount hook={hook} />
                  )}
                  <button
                    className={styles.numBtn}
                    onClick={hook.numBtnHandler}
                  >
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
              </div>
              <div style={{ marginBottom: "0.3rem" }}>
                <div className={styles.label}>새 비밀번호</div>
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
              </div>
              <div style={{ marginBottom: "0.3rem" }}>
                <div className={styles.label}>새 비밀번호 확인</div>
                <AuthInput
                  type="password"
                  placeholder="비밀번호 확인"
                  eventHandler={hook.setRePass}
                  inputColor={hook.rePassColor}
                />
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
                <AuthSubmitButton text="비밀번호 변경하기" />
              </div>
            </div>
          </AuthForm>
        </div>
      </div>
    </>
  );
};

export default FindPw;
