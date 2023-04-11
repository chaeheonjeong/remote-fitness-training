import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
//import "./AskView.css";
import userStore from "../../store/user.store";
import Header from "../main/Header";
import styles from "./View.module.css";
import axios from "axios";
import { scrollToTop } from "../../util/common";
import Reply from '../../server/models/reply';

function AskView() {
  const navigate = useNavigate();
  const { id } = useParams();
  const user = userStore();
  const [write, setWrite] = useState([]);
  const [htmlString, setHtmlString] = useState();
  const [sameUser, setSameUser] = useState();
  const [good, setGood] = useState(false);
  const [goodCount, setGoodCount] = useState(0);

  /*   useEffect(() => {
    const fetchWrite = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/getAsk/${id}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        if (res.data !== undefined) {
          setWrite(res.data.result[0]);
          setSameUser(res.data.sameUser);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchWrite();
  }, [id]); */

  useEffect(() => {
    if (user.token !== null) {
      axios
        .get(`http://localhost:8080/getAsk/${id}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        })
        .then((response) => {
          if (response.status === 200) {
            setWrite(response.data.result[0]);
            setSameUser(response.data.sameUser);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      axios
        .get(`http://localhost:8080/getAsk2/${id}`)
        .then((response) => {
          if (response.status === 200) {
            setWrite(response.data.result[0]);
            setSameUser(response.data.sameUser);
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
    if (user.token !== null) {
      axios
        .get(`http://localhost:8080/getGood/${id}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        })
        .then((response) => {
          if (response.status === 200) {
            setGood(response.data.good);
            setGoodCount(response.data.count);
            console.log(response.data.message);
          } else if (response.status === 204) {
            setGood(false);
            setGoodCount(0);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      axios
        .get(`http://localhost:8080/getGood2/${id}`)
        .then((response) => {
          if (response.status === 200) {
            setGoodCount(response.data.count);
          } else if (response.status === 204) {
            setGood(false);
            setGoodCount(0);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, []);

  useEffect(() => {
    scrollToTop();
  });

  const clickGood = () => {
    if (user.token !== null) {
      axios
        .post(`http://localhost:8080/setGood/${id}`, null, {
          headers: { Authorization: `Bearer ${user.token}` },
        })
        .then((response) => {
          if (response.status === 200) {
            setGood(!good);
            if (!good) {
              setGoodCount((prevCount) => prevCount + 1);
            } else {
              setGoodCount((prevCount) => prevCount - 1);
            }
          } else if (response.status === 201) {
            setGood(!good);
            setGoodCount(1);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      alert("로그인 해주세요.");
    }
  };

  const deleteHandler = () => {
    const confirmDelete = window.confirm("글을 삭제하시겠습니까?");
    if (confirmDelete) {
      axios
        .delete(`http://localhost:8080/askDelete/${id}`)
        .then((res) => {
          navigate("/question");
        })
        .catch((err) => console.log(err));
    }
  };

  const deleteReply = (id, replyId) => {
    const confirmDelete = window.confirm("댓글을 삭제하시겠습니까?");
    if(confirmDelete) {
      axios
        .delete(`http://localhost:8080/askDelete/${id}/reply/${replyId}`)
        .then((res) => {
          console.log(res.data);
          //navigate("/");
        })
        .catch((err) => console.log(err));
    }
  }

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
                    navigate(`/modifyAsk/${id}`);
                  }}
                />
              </div>
            )}
          </div>
        </div>
        <div className={styles.content_1}>
          <div>제목{write.title}</div>
        </div>
        <div className={styles.content_2}>
          <div className={styles.content_2_a}>
            <div>작성자{write.writer}</div>
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
          <span onClick={clickGood} className={good ? `styles.goodBtn` : null}>
            좋아요{goodCount}
          </span>
          <span> 조회수 {write.views} </span>
        </div>
        <div className="detail">
          <div>
            <input
              type="text"
              className="reply_input"
              placeholder="댓글 내용을 입력해주세요."
            />
            <div className="reply_choose">
              <input type="checkbox"></input>
              <p className="rc1">비밀댓글</p>
              <input type="button" className="sbtn" value="등록"></input>
            </div>
          </div>

          <div className="rr_reply">
            <table>
              <thead>
                <tr className="replyName">
                  <th></th>
                  <th>닉네임</th>
                  <th>댓글 내용</th>
                  <th>날짜</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr className="replyTitle">
                  <th>프로필 이미지</th>
                  <th>초록풀</th>
                  <th>리액트 공부 같이하고 싶습니다</th>
                  <th>작성된 날짜</th>
                  <th>
                    <input type="button" className="rrbtn" value="답장"></input>
                    <input type="button" className="rdbtn" value="삭제" onClick={deleteReply}></input>
                    <input type="button" className="rmbtn" value="수정"></input>
                  </th>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

export default AskView;
