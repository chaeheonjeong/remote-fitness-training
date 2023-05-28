import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../main/Header";
import { scrollToTop } from "../../util/common";
import styles from "./AskView.module.css";
import userStore from "../../store/user.store";
import { useParams } from "react-router-dom";
import { HiUserCircle } from "react-icons/hi";
import AskViewReply from "./AskViewReply";
import { BASE_API_URI } from "../../util/common";

const AskViewWrite = () => {
  const [sameUsers, setSameUsers] = useState(false);
  const { id } = useParams();
  const user = userStore();
  const [write, setWrite] = useState([]);

  const [htmlString, setHtmlString] = useState();
  const [sameUser, setSameUser] = useState(false);
  const [good, setGood] = useState(false);
  const [goodCount, setGoodCount] = useState(0);
  const [selectedAId, setSelectedAId] = useState();
  const [profileImg, setProfileImg] = useState(null);
  const [pImg, setPImg] = useState([]);
  const [rPImg, setRPImg] = useState([]);

  const [aBookmarkCount, setABookmarkCount] = useState(0);

  const navigate = useNavigate();

  const passHandler = (userId) => {
    navigate(`/PortfolioView/${userId}`);
  };

  useEffect(() => {
    if (user.token !== null) {
      axios
        .get(`${BASE_API_URI}/getAsk/${id}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        })
        .then((response) => {
          if (response.status === 200) {
            setWrite(response.data.result[0]);
            setSameUser(response.data.sameUser);
            setProfileImg(response.data.profileImg);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      axios
        .get(`${BASE_API_URI}/getAsk2/${id}`)
        .then((response) => {
          if (response.status === 200) {
            setWrite(response.data.result[0]);
            setSameUser(response.data.sameUser);
            setProfileImg(response.data.profileImg);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, []);

  useEffect(() => {
    if (write.content !== undefined) {
      const contentString = JSON.stringify(write.content); // 객체를 문자열로 변환합니다.
      const cleanedString = contentString.replace(/undefined/g, "");
      const parsedContent = JSON.parse(cleanedString); // 문자열을 JSON 객체로 변환합니다.
      const htmlString = parsedContent.content;
      setHtmlString(htmlString);
    }
  }, [write]);

  useEffect(() => {
    scrollToTop();
  }, []);

  // 스크랩 수
  const getABookmarkCount = () => {
    axios
      .get(`${BASE_API_URI}/getAskBookmarkCount/${id}`)
      .then((res) => {
        console.log(res.data.result);

        if (res.status === 200) {
          setABookmarkCount(res.data.result.goodCount);
        }
      })
      .catch((err) => console.log(err));
  };
  useEffect(getABookmarkCount, []);

  const deleteHandler = () => {
    const confirmDelete = window.confirm("글을 삭제하시겠습니까?");
    if (confirmDelete) {
      axios
        .delete(`${BASE_API_URI}/askDelete/${id}`)
        .then((res) => {
          navigate("/question");
        })
        .catch((err) => console.log(err));
    }
  };

  const formatDate = (today) => {
    const daysOfWeek = ["일", "월", "화", "수", "목", "금", "토"];
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const dateW = today.getDate();
    const dayOfWeek = daysOfWeek[today.getDay()];
    const formattedDate = `${year}.${month}.${dateW}(${dayOfWeek})`;

    return formattedDate;
  };

  return (
    <>
      <Header />
      <div className={styles.detail}>
        <div className={styles.content_4}>
          <div className={styles.content_4_a}>
            <input
              type="button"
              value="목록"
              id="view_list_button1"
              onClick={() => {
                navigate("/");
              }}
            />
          </div>

          {sameUser && (
            <div className={styles.content_4_b}>
              <input
                className={styles.dd}
                type="button"
                value="삭제"
                onClick={() => {
                  deleteHandler();
                }}
              />
              <input
                className={styles.mm}
                type="button"
                value="수정"
                onClick={() => {
                  navigate(`/modifyAsk/${id}`);
                }}
              />
            </div>
          )}
        </div>

        <div className={styles.content_1}>
          <div>제목{write.title}</div>
        </div>
        <div className={styles.content_2}>
          <div className={styles.content_2_a}>
            <div>작성자</div>
            <div
              className={styles.profile1}
              onClick={() => {
                passHandler(write._user);
              }}
              style={{ marginRight: "12.5rem" }}
            >
              {profileImg === null ? (
                <HiUserCircle
                  size="40"
                  color="#5a5a5a"
                  style={{ cursor: "pointer" }}
                />
              ) : (
                <img
                  className={styles.profile}
                  src={profileImg}
                  alt="프로필 이미지"
                />
              )}
              {write.writer}
            </div>
            <div>|</div>
            <div>
              날짜
              {write.writeDate !== undefined &&
                formatDate(new Date(write.writeDate))}
            </div>
          </div>
        </div>
        <div className={styles.content_5}>
          <div className={styles.content_5_a}>
            <div>
              태그
              {write.tag !== undefined &&
                write.tag.map((x, i) => {
                  return <span key={x + i}>{x}</span>;
                })}
            </div>
          </div>
        </div>
        <div className={styles.content_3}>
          <div>내용</div>
          <div dangerouslySetInnerHTML={{ __html: htmlString }} />
          <span className={good ? styles.goodBtn : null}>
            스크랩{aBookmarkCount}
          </span>
          <span> 조회수 {write.views} </span>
        </div>
      </div>

      <AskViewReply write={write} setWrite={setWrite} writer={write.writer} />
    </>
  );
};
export default AskViewWrite;
