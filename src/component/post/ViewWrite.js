import React, { useEffect, useState } from "react";
import styles from "./View.module.css";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import userStore from "../../store/user.store";
import Header from "../main/Header";
import { scrollToTop } from "../../util/common";
import { HiUserCircle } from "react-icons/hi";
import { Link } from "react-router-dom";
import MyPAReviews from "../mypage/MyPAReviews";
import response from "http-browserify/lib/response";
import usePost from "../../hooks/usePost";
import ViewReply from "./ViewReply";

const ViewWrite = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const user = userStore();
  const [write, setWrite] = useState([]);
  const [htmlString, setHtmlString] = useState();
  const [sameUser, setSameUser] = useState(false);
  /* const [selectedId, setSelectedId] = useState();
    const [selectedRId, setSelectedRId] = useState(); */
  const [good, setGood] = useState(false);
  const [bookmarkCount, setBookmarkCount] = useState(0);
  const [profileImg, setProfileImg] = useState(null);

  const hook = usePost();

  const passHandler = (userId) => {
    navigate(`/PortfolioView/${userId}`);
  };

  const deleteHandler = () => {
    const confirmDelete = window.confirm("글을 삭제하시겠습니까?");
    if (confirmDelete) {
      axios
        .delete(`http://localhost:8080/writeDelete/${id}`)
        .then((res) => {
          navigate("/study");
        })
        .catch((err) => console.log(err));
    }
  };

  // 스크랩 수
  const getBookmarkCount = () => {
    axios
      .get(`http://localhost:8080/getBookmarkCount/${id}`)
      .then((res) => {
        if (res.status === 200) {
          setBookmarkCount(res.data.result.goodCount);
        }
      })
      .catch((err) => console.log(err));
  };
  useEffect(getBookmarkCount, []);

  useEffect(() => {
    if (user.token !== null) {
      axios
        .get(`http://localhost:8080/getWrite/${id}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        })
        .then((response) => {
          if (response.status === 200) {
            setWrite(response.data.result[0]);
            setSameUser(response.data.sameUser);
            setProfileImg(response.data.profileImg);
          }
          console.log("getWrite: ", response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      axios
        .get(`http://localhost:8080/getWrite2/${id}`)
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
    const fetchWrite = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/getWrite/${id}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        if (res.data !== undefined) {
          setWrite(res.data.data[0]);
          setSameUser(res.data.sameUser);
          console.log(res.data.message);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchWrite();
  }, [id]);

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
            <div>
              <button className={write.recruit ? styles.cbtn : styles.falseBtn}>
                {write.recruit ? "모집중" : "모집완료"}
              </button>
            </div>
          </div>
          {sameUser && (
            <div className={styles.content_4_b}>
              <input
                type="button"
                value="삭제"
                onClick={() => {
                  deleteHandler();
                }}
              />
              <input
                type="button"
                value="수정"
                onClick={() => {
                  navigate(`/modifyPost/${id}`);
                }}
              />
            </div>
          )}
        </div>
        <div className={styles.content_1}>
          <div>제목</div>
          <div>{write.title}</div>
        </div>
        <div className={styles.content_2}>
          <div>작성자</div>
          <div
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
          <div>
            날짜{" "}
            {write.writeDate !== undefined &&
              formatDate(new Date(write.writeDate))}
          </div>
        </div>
      </div>
      <div className={styles.content_5}>
        <div style={{ marginRight: "1rem" }}>모집인원</div>
        <div style={{ marginRight: "15rem" }}>{write.number}</div>

        <div style={{ marginRight: "1rem" }}> 시작 예정일</div>
        <div style={{ marginRight: "15rem" }}>{write.date}</div>

        <div style={{ marginRight: "1rem" }}> 시작 시간</div>
        <div>{write.startTime}</div>
      </div>
      <div className={styles.content_5a}>
        <div style={{ marginRight: "1rem" }}>예상 진행시간</div>
        <div style={{ marginRight: "14rem" }}>{write.runningTime} 분</div>

        <div style={{ marginRight: "1rem" }}>예상 금액</div>
        <div style={{ marginRight: "14rem" }}>{write.estimateAmount} 원</div>

        <div>태그</div>
        <div>
          {write.tag !== undefined &&
            write.tag.map((x, i) => {
              return <span key={x + i}>{x}</span>;
            })}
        </div>
      </div>
      <div className={styles.content_3}>
        <div>내용</div>
        <div dangerouslySetInnerHTML={{ __html: htmlString }} />
        <span className={good ? styles.goodBtn : null}>
          스크랩{bookmarkCount}
        </span>
        <span>조회수{write.views}</span>
      </div>

      <ViewReply write={write} setWrite={setWrite} />
    </>
  );
};
export default ViewWrite;
