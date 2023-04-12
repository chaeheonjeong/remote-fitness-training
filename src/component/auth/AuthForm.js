import styles from "./AuthForm.module.css";
import { useNavigate } from "react-router-dom";

const AuthForm = (props) => {
  const navigate = useNavigate();

  return (
    <form onSubmit={props.onSubmit} className={styles.form}>
      <label
        className={styles.label}
        onClick={() => {
          navigate("/");
        }}
      >
        Link
      </label>
      {props.children}
    </form>
  );
};

export default AuthForm;
