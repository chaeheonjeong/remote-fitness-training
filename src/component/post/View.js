import React, { useEffect, useState } from "react";
import styles from "./View.module.css";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import userStore from "../../store/user.store";
import Header from "../main/Header";

function View() {
  const { id } = useParams();
  const user = userStore();
  const [write, setWrite] = useState([]);
  const [htmlString, setHtmlString] = useState();
  const [sameUser, setSameUser] = useState(false);
  const [progress, setProgress] = useState(false);
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [showReplyList, setShowReplyList] = useState(false);

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

  useEffect(() => {
    const fetchWrite = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/getWrite/${id}`, {
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

  const handleShowReplyInput = () => {
    setShowReplyInput(!showReplyInput);
    //setShowReplyList(false); // 대댓글 입력 칸을 보여주면서 대댓글 목록도 함께 보여줌
  };

  const handleHideReplyInput = () => {
    setShowReplyInput(false);
    setShowReplyList(false);
  };

  const handleShowReplyList = () => {
    setShowReplyList(true);
    setShowReplyInput(showReplyInput); // 대댓글 입력 칸을 보여주면서 대댓글 목록도 함께 보여줌
  };

  const handleHideReplyList = () => {
    setShowReplyInput(false);
    setShowReplyList(false);
  };

  //---------------------------------

  const [reply, setReply] = useState("");
  const navigate = useNavigate();

  const replyHandler = (e) => {
    const inputReply = e.target.value;
    setReply(inputReply);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8080/postreply", {
        reply: reply,
      });
      console.log("success", response.data.message);
      navigate("/");
    } catch (error) {
      console.log(error);
    }
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
          <div>제목{write.title}</div>
        </div>
        <div className={styles.content_2}>
          <div className={styles.content_2_a}>
            <div>작성자{write.writer}</div>
            <div>|</div>
            <div>날짜{write.writeDate}</div>
          </div>
          <div className={styles.content_2_c}>
            <div></div>
          </div>
          <div className={styles.content_2_b}>
            <div></div>
          </div>
        </div>
        <div className={styles.content_5}>
          <div className={styles.content_5_a}>
            <div>모집인원{write.number}</div>
            <div>시작 예정일{write.date}</div>
          </div>
          <div className={styles.content_5_b}>
            <div>진행기간{write.period}</div>
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
        </div>
        <div className={styles.content_6}>
          <input
            type="text"
            className={styles.reply_input}
            placeholder="댓글 내용을 입력해주세요."
          />
          <div className={styles.reply_choose}>
            <input type="checkbox"></input>
            <text className={styles.rc1}>비밀댓글</text>
            <input type="button" className={styles.sbtn} value="등록"></input>
          </div>
        </div>
        <div className={styles.rr_reply}>
          <table>
            <thead>
              <tr className={styles.replyName}>
                <th> </th>
                <th>닉네임</th>
                <th>댓글 내용</th>
                <th>날짜</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr className={styles.replyTitle}>
                <th>프로필 이미지</th>
                <th>초록풀</th>
                <th>리액트 공부 같이하고 싶습니다</th>
                <th>작성된 날짜</th>
                {sameUser && (
                  <th>
                    <input
                      type="button"
                      className={styles.rdbtn}
                      value="삭제"
                    ></input>
                    <input
                      type="button"
                      className={styles.rmbtn}
                      value="수정"
                    ></input>
                  </th>
                )}
              </tr>
              <tr className={styles.replyContent}>
                {!showReplyInput && (
                  <button onClick={handleShowReplyInput}>대댓글 추가</button>
                )}
                {showReplyInput && (
                  <>
                    <input
                      type="text"
                      className={styles.reply_input}
                      placeholder="대댓글 내용을 입력해주세요."
                    />
                    <div className={styles.reply_choose}>
                      <input type="checkbox"></input>
                      <text className={styles.rc1}>비밀 대댓글</text>
                      <button onClick="/">대댓글 등록</button>

                      <button onClick={handleHideReplyInput}>
                        대댓글 작성 취소
                      </button>
                    </div>
                  </>
                )}

                {!showReplyList && (
                  <button onClick={handleShowReplyList}>
                    대댓글 목록 보기
                  </button>
                )}
                {showReplyList && (
                  <div className={styles.rr_reply}>
                    <div>{/* 대댓글 목록 보여주는 코드 */}</div>
                    <div>
                      <button onClick={handleHideReplyList}>
                        대댓글 목록 닫기
                      </button>
                    </div>
                  </div>
                )}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default View;
