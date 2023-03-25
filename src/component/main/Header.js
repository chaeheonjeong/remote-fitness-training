import styles from "./Header.module.css";
import { HiUserCircle } from "react-icons/hi";
import { GoBell } from "react-icons/go";
import useHeader from "../../hooks/useHeader";

const Header = () => {
  const hook = useHeader();

  return (
    <div className={styles.container}>
      <label className={styles.linkLabel}>Link</label>
      <div className={styles.smallContainer}>
        <div className={styles.smallContainer2}>
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
                    //   onClick={()=>window.open(x.url)}
                    // 나중에 URL 추가하고 활성화
                  >
                    {x.emo}
                    {x.title}
                  </button>
                );
              })}
            </div>
          </div>
          <label className={styles.welcomeLabel}>두루미 님 환영합니다.</label>
        </div>
        <button
          onClick={() => {
            hook.navigate("/login");
          }}
          className={styles.logButton}
        >
          로그아웃
        </button>
      </div>
    </div>
  );
};

export default Header;
