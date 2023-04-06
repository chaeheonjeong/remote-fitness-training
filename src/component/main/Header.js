import styles from "./Header.module.css";
import { HiUserCircle } from "react-icons/hi";
import { GoBell } from "react-icons/go";
import useHeader from "../../hooks/useHeader";
import userStore from "../../store/user.store";

const Header = () => {
  const hook = useHeader();
  const user = userStore();

  return (
    <div className={styles.container}>
      <label className={styles.linkLabel}>Link</label>
      <div className={styles.smallContainer}>
        <div className={styles.smallContainer2}>
          {user.token !== null && (
            <div style={{ position: "relative" }}>
              <GoBell
                size="25"
                color="#5a5a5a"
                onClick={() =>
                  window.open(hook.popUrl, hook.popTarget, hook.popFeat)
                }
              />
              <div className={styles.notiCircle}>1</div>
            </div>
          )}
          {user.token !== null && (
            <div className={styles.profileContainer} ref={hook.el}>
              <HiUserCircle
                size="40"
                color="#5a5a5a"
                onClick={() => hook.setDropVisible(!hook.dropVisible)}
                style={{ cursor: "pointer" }}
              />
              <div
                className={`${styles.profileDropdown} ${
                  hook.dropVisible ? styles.dropOpen : styles.dropClose
                }`}
              >
                {hook.profileDrop.map((x, i) => {
                  return (
                    <button
                      key={x.title}
                      className={styles.profileDropItem}
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        hook.navigate(x.url);
                      }}
                    >
                      {x.emo}
                      {x.title}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
          {user.token !== null && (
            <label className={styles.welcomeLabel}>
              {user.name} 님 환영합니다.
            </label>
          )}
        </div>
        <button
          onClick={() => {
            user.token !== null ? user.logout() : hook.navigate("/login");
          }}
          className={styles.logButton}
        >
          {user.token !== null ? "로그아웃" : "로그인"}
        </button>
        {user.token === null && (
          <button
            onClick={() => {
              hook.navigate("/register");
            }}
            className={styles.regiButton}
          >
            회원가입
          </button>
        )}
      </div>
    </div>
  );
};

export default Header;
