import styles from "./Header.module.css";
import { HiUserCircle } from "react-icons/hi";
import { GoBell } from "react-icons/go";
import useHeader from "../../hooks/useHeader";
import userStore from "../../store/user.store";
import axios from "axios";
import React, { useEffect, useState } from "react";

const Header = ({ ...props }) => {
  const [profileImg, setProfileImg] = useState(null);
  const hook = useHeader();
  const user = userStore();
  const logout = () => {
    user.logout();
    hook.navigate("/login");
  };

  useEffect(() => {
    if (user.token !== null) {
      axios
        .get("http://localhost:8080/header-profile", {
          headers: { Authorization: `Bearer ${user.token}` },
        })
        .then((response) => {
          if (response.status === 200) {
            setProfileImg(response.data.image);
          } else if (response.status === 204) {
            setProfileImg(null);
          }
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [props.callback]);

  return (
    <div className={styles.container}>
      {/* {console.log(profileImg)} */}
      <label
        className={styles.linkLabel}
        onClick={() => {
          hook.navigate("/login");
        }}
      >
        고습도치
      </label>
      <div className={styles.smallContainer}>
        <div className={styles.smallContainer2}>
          {user.token !== null && (
            <div style={{ position: "relative" }}>
              <GoBell
                size="25"
                color="#8AE52E"
                onClick={() =>
                  window.open(hook.popUrl, hook.popTarget, hook.popFeat)
                }
              />
              {
                <div className={styles.notiCircle}>{hook.notiCount}</div>
              }
            </div>
          )}
          {user.token !== null && (
            <div className={styles.profileContainer} ref={hook.el}>
              {profileImg === null ? (
                <HiUserCircle
                  size="40"
                  color="#5a5a5a"
                  onClick={() => hook.setDropVisible(!hook.dropVisible)}
                  style={{ cursor: "pointer" }}
                />
              ) : (
                <img
                  className={styles.profile}
                  src={profileImg}
                  alt="프로필 이미지"
                  onClick={() => hook.setDropVisible(!hook.dropVisible)}
                />
              )}
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
            user.token !== null ? logout() : hook.navigate("/login");
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
