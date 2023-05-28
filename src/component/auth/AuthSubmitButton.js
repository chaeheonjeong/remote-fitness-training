import styles from "./AuthSubmitButton.module.css";

const AuthSubmitButton = (props) => {
  return (
    <button type="submit" className={styles.submitBtn}>
      {props.text}
    </button>
  );
};

export default AuthSubmitButton;
