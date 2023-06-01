import styles from "./ProfileSideBar.module.css";
import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import profile from "./icon/profile.png";
import { HiUserCircle } from "react-icons/hi";
import axios from "axios";
import { BASE_API_URI } from "../../util/common";

function ProfileSideBar({ setNameHandler }) {
  const [profileImg, setProfileImg] = useState(null);
  const [user, setUser] = useState(null);
  const { writerId } = useParams();

  useEffect(
    () => {
      const fetchUser = async () => {
        if (writerId) {
          try {
            const res = await axios.get(
              `${BASE_API_URI}/portfolioInfo/${writerId}`
            );
            setUser(res.data[0]);
            setProfileImg(res.data[0].image);
            if (res.data[0] !== null) {
              setNameHandler(res.data[0].name);
            }
            console.log("이미지 불러오기에 성공했습니다.");
          } catch (err) {
            console.error("이미지 불러오기에 실패했습니다.", err);
          }
        }
      };
      fetchUser();
    },
    [writerId],
    setNameHandler
  );

  return (
    <>
      <div
        style={{
          overflowX:
            "hidden" /* 가로로 넘치는 부분을 자르기 위해 overflow-x 속성을 hidden으로 설정 */,
          overflowY: "hidden",
        }}
      >
        {profileImg ? (
          <img
            className={styles.profileImgBack}
            src={profileImg}
            alt="프로필 이미지"
          />
        ) : (
          <div style={{ backgroundColor: "gray" }}></div>
        )}
        {profileImg ? (
          <img
            className={styles.profileImg}
            src={profileImg}
            alt="프로필 이미지"
          />
        ) : (
          <HiUserCircle
            size="180"
            style={{ marginLeft: "200px", color: "gray" }}
          />
        )}
      </div>
    </>
  );
}

export default ProfileSideBar;
