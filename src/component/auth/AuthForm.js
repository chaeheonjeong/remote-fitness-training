import styles from "./AuthForm.module.css";

const AuthForm = (props) => {
  return (
    <form onSubmit={props.onSubmit} className={styles.form}>
      <label className={styles.label}>Link</label>
      {props.children}
    </form>
  );
};

export default AuthForm;
