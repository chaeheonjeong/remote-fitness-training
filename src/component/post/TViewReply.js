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
import { useEffect, useState } from "react";
/* import response from "http-browserify/lib/response"; */
import usePost from "../../hooks/useTPost";
import { BASE_API_URI } from "../../util/common";

const TViewReply = ({ write, setWrite, writer }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const user = userStore();
  //const [write, setWrite] = useState([]);
  const [htmlString, setHtmlString] = useState();
  const [sameUser, setSameUser] = useState(false);
  const [selectedId, setSelectedId] = useState();
  const [selectedRId, setSelectedRId] = useState();
  const [good, setGood] = useState(false);
  const [bookmarkCount, setBookmarkCount] = useState(0);
  const [profileImg, setProfileImg] = useState(null);

  const hook = usePost();

  const [showReplyInput, setShowReplyInput] = useState(false);
  const [showReplyList, setShowReplyList] = useState(false);

  const postCategory = "tView";

  const ReplyProfileClick = (userId) => {
    navigate(`/PortfolioView/${userId}`);
  };

  const R_ReplyProfileClick = (userId) => {
    navigate(`/PortfolioView/${userId}`);
  };

  const handleShowReplyInput = () => {
    setShowReplyInput(!showReplyInput);
    //setShowReplyList(false); // 대댓글 입력 칸을 보여주면서 대댓글 목록도 함께 보여줌
  };

  const handleHideReplyInput = () => {
    setShowReplyInput(false);
    setSelectedRId(null);
  };

  const handleShowReplyList = () => {
    setShowReplyList(true);
    setShowReplyInput(showReplyInput); // 대댓글 입력 칸을 보여주면서 대댓글 목록도 함께 보여줌
  };

  const handleHideReplyList = () => {
    setShowReplyInput(false);
    setShowReplyList(false);
  };

  const [reply, setReply] = useState([]);
  const [pImg, setPImg] = useState([]);
  const [rPImg, setRPImg] = useState([]);

  const [sameUsers, setSameUsers] = useState(false);
  const [postId, setPostId] = useState();
  const [replyInput, setReplyInput] = useState("");

  useEffect(() => {
    const fetchReply = async () => {
      try {
        const res = await axios.get(`${BASE_API_URI}/getTReply/${id}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        if (res.data !== undefined) {
          setReply(res.data.data);
          setSameUsers(res.data.sameUsers);
          setPImg(res.data.profileImgs);

          /* console.log("sameUsers: ", res.data.sameUsers); */

          console.log(res.data);
        }
        console.log(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchReply();
  }, []);

  const [r_reply, setR_Reply] = useState([]);
  const { rid } = useParams();
  const { rrid } = useParams();
  const [RsameUsers, setRSameUsers] = useState(false);
  const [postRId, setPostRId] = useState();
  const [rWriter, setRWriter] = useState("");

  const fetchR_Reply = async (rid) => {
    try {
      const res = await axios.get(`${BASE_API_URI}/getTR_Reply/${id}/${rid}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      if (res.data.data.length) {
        setR_Reply(res.data.data);
        setRSameUsers(res.data.RsameUsers);
        setRPImg(res.data.profileImgs);

        console.log(rPImg);

        console.log(res.data.profileImgs);
        console.log(res.data.messgae);
        console.log(res.data.data);
      } else {
        setR_Reply([]);
        console.log("대댓글이 없습니다.");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const [getReplyId, setReplyId] = useState();

  const replyHandler = (e) => {
    setReply(e.target.value);
  };

  const replyInputChangeHandler = (e) => {
    setReplyInput(e.target.value);
  };

  const today = new Date();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { reply: replyInput /* isSecret: isSecret */ };

    console.log("data: ", data);

    try {
      const response = await axios.post(
        `${BASE_API_URI}/postTreply/${id}`,
        {
          reply: String(replyInput),
          /* isSecret : Boolean(isSecret), */
          rwriter: user.name,
          rwriteDate: today,
        },
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );

      console.log(typeof data);
      console.log("success", response.data.message);

      createRAlarm();

      // 새로운 댓글을 추가합니다.
      setReply([...reply, replyInput]);
      setReplyInput(""); // 댓글 입력창을 초기화합니다.

      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  const createRAlarm = async () => {
    try {
      if (writer !== user.name) {
        const data = {
          rwriter: user.name,
          message: String(replyInput),
          to: writer,
          postCategory: postCategory,
          postId: id,
        };

        const response = await axios.post(`${BASE_API_URI}/rAlarm`, data);

        console.log(response.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const replyInputRChangeHandler = (e) => {
    setReplyRInput(e.target.value);
  };
  const [replyRInput, setReplyRInput] = useState("");

  const rhandleSubmit = async (e) => {
    e.preventDefault();
    const data = { r_reply: replyRInput /* , isRSecret : isRSecret */ };
    console.log(data);
    try {
      const response = await axios.post(
        `${BASE_API_URI}/postTr_reply/${id}/${selectedRId}`,
        {
          r_reply: String(replyRInput),
          /* isRSecret : Boolean(isRSecret), */
          r_rwriter: user.name,
          r_rwriteDate: today,
        },
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      /* console.log(typeof isRSecret); */

      console.log(typeof data);
      console.log("success", response.data.message);

      createRrAlarm();

      // 새로운 대댓글을 추가합니다.
      setR_Reply([...r_reply, replyRInput]);
      setReplyRInput(""); // 대댓글 입력창을 초기화합니다.

      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  const createRrAlarm = async () => {
    let writers;

    if (writer !== rWriter) {
      if (writer !== user.name && rWriter !== user.name) {
        writers = Array.isArray(rWriter)
          ? [...rWriter, writer]
          : [rWriter, writer];
      } else if (writer !== user.name && rWriter === user.name) {
        // 댓글만 나
        writers = [writer];
      } else if (writer === user.name && rWriter !== user.name) {
        // 글쓴이만 나
        writers = [rWriter];
      }
    } else {
      if (writer !== user.name) {
        writers = [rWriter];
      }
    }

    try {
      setRWriter(writers);

      const data = {
        rrwriter: user.name,
        message: String(replyRInput),
        to: writers,
        postCategory: postCategory,
        postId: id,
      };

      const response = await axios.post(`${BASE_API_URI}/rrAlarm`, data);

      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  //대댓글 삭제
  const handleRDelete = async (rrid) => {
    const confirmRDelete = window.confirm("대댓글을 삭제하시겠습니까?");
    if (confirmRDelete) {
      try {
        const response = await axios.delete(
          `${BASE_API_URI}/postTr_reply/${id}/${selectedRId}/${rrid}`,
          {
            headers: { Authorization: `Bearer ${user.token}` },
          }
        );
        console.log(response.data);
        alert("대댓글이 삭제되었습니다.");
        setR_Reply(r_reply.filter((r) => r._id !== rrid)); // 삭제된 대댓글을 제외하고 대댓글 목록을 업데이트합니다.
      } catch (error) {
        console.error(error);
      }
    }
  };

  const [showR_ReplyModifyInput, setShowRModifyReplyInput] = useState(false);
  const [replyRModifyInput, setReplyRModifyInput] = useState("");

  // 대댓글수정
  const modifyRHandleSubmit = async (e, selectedRId, rrid) => {
    e.preventDefault();

    if (replyRModifyInput === "") {
      alert("내용을 작성해주세요.");
      return;
    }

    try {
      const response = await axios.post(`${BASE_API_URI}/viewTReplyRModify`, {
        postRId: id,
        selectedRId: selectedRId,
        _id: rrid,
        r_rWriteDate: today,
        r_reply: String(replyRModifyInput),
        /* isRSecret: Boolean(isRSecret),  */
      });

      alert("대댓글 수정이 완료되었습니다.");
      navigate(`/view/${id}`);
    } catch (error) {
      console.log(error);
    }
  };
  // 대댓글수정(가져오기)
  const modifyR_Reply = async (rrid) => {
    try {
      const res = await axios.get(
        `${BASE_API_URI}/tView/${id}/modify/${selectedRId}/${rrid}`
      );

      if (res.data !== undefined) {
        setReplyRModifyInput(res.data.result[0].r_reply);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // 대댓글수정(내용반영)
  const modifyR_ReplyInputChangeHandler = (e) => {
    setReplyRModifyInput(e.target.value);
  };

  // 댓글삭제
  const deleteReply = (replyId) => {
    const confirmDelete = window.confirm("댓글을 삭제하시겠습니까?");
    if (confirmDelete) {
      axios
        .delete(`${BASE_API_URI}/tView/${id}/reply/${replyId}`)
        .then((res) => {
          setReply(reply.filter((reply) => reply._id !== replyId));
          console.log("data", res.data);
          alert("댓글이 삭제되었습니다.");
        })
        .catch((err) => console.log(err));
    }
  };
  const [showReplyModifyInput, setShowModifyReplyInput] = useState(false);
  const [replyModifyInput, setReplyModifyInput] = useState("");

  const [replies, setReplies] = useState([]); // 수정된 댓글 가져올 때

  // 댓글수정
  const modifyHandleSubmit = async (e, replyId) => {
    e.preventDefault();

    if (replyModifyInput === "") {
      alert("내용을 작성해주세요.");
      return;
    }
    try {
      const response = await axios.post(`${BASE_API_URI}/viewTReplyModify`, {
        postId: id,
        _id: replyId,
        rWriteDate: today,
        reply: String(replyModifyInput),
        /* isSecret: Boolean(isSecret),  */
      });

      alert("수정이 완료되었습니다.");
      navigate(`/view/${id}`);
    } catch (error) {
      console.log(error);
    }
  };

  // 댓글수정(가져오기)
  const modifyReply = async (replyId) => {
    try {
      const res = await axios.get(
        `${BASE_API_URI}/tView/${id}/modify/${replyId}`
      );

      if (res.data !== undefined) {
        //setIsSecret(res.data.result[0].isSecret);
        setReplyModifyInput(res.data.result[0].reply);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // 댓글수정(내용반영)
  const modifyReplyInputChangeHandler = (e) => {
    setReplyModifyInput(e.target.value);
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

  //댓글 페이지네이션
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(5);

  // 현재 페이지에 보여질 댓글들 추출
  const startIndex = (currentPage - 1) * perPage;
  const endIndex = startIndex + perPage;
  const currentReply = reply.slice(startIndex, endIndex);

  // 페이지네이션 컴포넌트
  const totalPages = Math.ceil(reply.length / perPage);
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  const renderPageNumbers = pageNumbers.map((number) => {
    return (
      <li key={number}>
        <button onClick={() => setCurrentPage(number)}>{number}</button>
      </li>
    );
  });

  return (
    <>
      {/* 댓글 입력 폼 */}
      <form onSubmit={handleSubmit}>
        <div className={styles.content_6}>
          <input
            type="text"
            className={styles.reply_input}
            placeholder="댓글 내용을 입력해주세요."
            value={replyInput}
            onChange={replyInputChangeHandler}
          />
          <div className={styles.reply_choose}>
            <input type="submit" className={styles.sbtn} value="등록"></input>
          </div>
        </div>
      </form>

      <div className={styles.rr_reply}>
        <table>
          <thead>
            <tr className={styles.replyName}>
              <th>닉네임</th>
              <th>댓글 내용</th>
              <th>날짜</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {currentReply.map((r, index) => (
              <tr className={styles.replyTitle} key={r._id}>
                <td key={r._id} onClick={() => ReplyProfileClick(r._user)}>
                  <div>
                    {!pImg || !pImg[index] ? (
                      <HiUserCircle
                        size="40"
                        color="#5a5a5a"
                        style={{ cursor: "pointer" }}
                      />
                    ) : (
                      <img
                        className={styles.profile}
                        src={pImg[index]}
                        alt="프로필 이미지"
                      />
                    )}

                    {r.rwriter}
                  </div>
                </td>
                <td>{r.reply}</td>
                <td>
                  {" "}
                  {r.rwriteDate !== undefined &&
                    formatDate(new Date(r.rwriteDate))}
                </td>

                {/* 댓글 수정 & 삭제 */}
                {sameUsers[index] && (
                  <td>
                    <input
                      type="button"
                      className={styles.rdbtn}
                      value="삭제"
                      onClick={deleteReply.bind(null, r._id)}
                    ></input>
                    <input
                      type="button"
                      className={styles.rmbtn}
                      value="수정"
                      onClick={() => {
                        setShowModifyReplyInput(
                          selectedId === r._id ? null : r._id
                        );
                        setSelectedId(selectedId === r._id ? null : r._id);
                        modifyReply(r._id);
                      }}
                    ></input>
                    {showReplyModifyInput === r._id && (
                      <form onSubmit={(e) => modifyHandleSubmit(e, r._id)}>
                        <div className={styles.handle}>
                          <input
                            type="text"
                            className={styles.reply_input}
                            value={replyModifyInput}
                            onChange={modifyReplyInputChangeHandler}
                          />
                          <div className={styles.reply_choose}>
                            <input type="submit" value="댓글수정"></input>
                            <button
                              onClick={() => {
                                setShowModifyReplyInput(null);
                                setSelectedId(null);
                              }}
                            >
                              댓글수정 취소
                            </button>
                          </div>
                        </div>
                      </form>
                    )}
                  </td>
                )}

                <td>
                  {!showReplyInput && (
                    <button
                      onClick={() => {
                        setShowReplyInput(selectedRId === r._id ? null : r._id);
                        setSelectedRId(selectedRId === r._id ? null : r._id);
                        setRWriter(
                          selectedRId === r.rwriter ? null : r.rwriter
                        );
                      }}
                    >
                      대댓글 추가
                    </button>
                  )}
                  {showReplyInput === r._id && (
                    <form onSubmit={rhandleSubmit}>
                      <div className={styles.rhandle}>
                        <input
                          type="text"
                          className={styles.reply_input}
                          placeholder="대댓글 내용을 입력해주세요."
                          value={replyRInput}
                          onChange={replyInputRChangeHandler}
                        />
                        <div className={styles.reply_choose}>
                          <input
                            className={styles.asdf3}
                            type="submit"
                            value="대댓글 등록"
                          ></input>
                          <button
                            className={styles.reply_choose2}
                            onClick={() => {
                              setShowReplyInput(null);
                              setSelectedRId(null);
                            }}
                          >
                            대댓글 작성 취소
                          </button>
                        </div>
                      </div>
                    </form>
                  )}
                  <div>
                    {!showReplyList ? (
                      <button
                        className={styles.asdf1}
                        onClick={() => {
                          setShowReplyList(
                            selectedRId === r._id ? null : r._id
                          );
                          setSelectedRId(selectedRId === r._id ? null : r._id);
                          fetchR_Reply(r._id);
                        }}
                      >
                        대댓글 목록 보기
                      </button>
                    ) : selectedRId === r._id ? (
                      <button
                        className={styles.asdf1}
                        onClick={() => {
                          setShowReplyList(
                            selectedRId === r._id ? null : r._id
                          );
                          setSelectedRId(selectedRId === r._id ? null : r._id);
                          fetchR_Reply(r._id);
                        }}
                      >
                        대댓글 목록 닫기
                      </button>
                    ) : (
                      <button
                        className={styles.asdf1}
                        onClick={() => {
                          setShowReplyList(
                            selectedRId === r._id ? null : r._id
                          );
                          setSelectedRId(selectedRId === r._id ? null : r._id);
                          fetchR_Reply(r._id);
                        }}
                      >
                        대댓글 목록 보기
                      </button>
                    )}
                  </div>
                  {showReplyList === r._id && (
                    <div className={styles.rr_reply2}>
                      {/* 대댓글 목록 보여주는 코드 */}

                      <table>
                        <thead>
                          <tr className={styles.ttrrr}>
                            <td>닉네임</td>
                            <td>대댓글 내용</td>
                            <td>작성 날짜</td>
                          </tr>
                        </thead>
                        {r_reply.map((rr, index) => (
                          <tbody>
                            <tr>
                              <td
                                key={rr._id}
                                onClick={() => R_ReplyProfileClick(rr._user)}
                              >
                                <div>
                                  {!rPImg || !rPImg[index] ? (
                                    <HiUserCircle
                                      size="40"
                                      color="#5a5a5a"
                                      style={{ cursor: "pointer" }}
                                    />
                                  ) : (
                                    <img
                                      className={styles.profile}
                                      src={rPImg[index]}
                                      alt="프로필 이미지"
                                    />
                                  )}
                                  {rr.r_rwriter}
                                </div>
                              </td>
                              <td>{rr.r_reply}</td>
                              <td>
                                {" "}
                                {rr.r_rwriteDate !== undefined &&
                                  formatDate(new Date(rr.r_rwriteDate))}
                              </td>

                              {/* 대댓글수정 */}
                              {RsameUsers[index] && (
                                <td>
                                  <input
                                    type="button"
                                    className={styles.rrdbtn}
                                    value="삭제"
                                    onClick={() => handleRDelete(rr._id)}
                                  ></input>
                                  <input
                                    type="button"
                                    className={styles.rrmbtn}
                                    value="수정"
                                    onClick={() => {
                                      setShowRModifyReplyInput(
                                        selectedRId === rr._id ? null : rr._id
                                      );
                                      setSelectedRId(
                                        selectedRId === rr._id ? null : rr._id
                                      );
                                      modifyR_Reply(rr._id);
                                    }}
                                  ></input>
                                  {showR_ReplyModifyInput === rr._id && (
                                    <form
                                      onSubmit={(e) =>
                                        modifyRHandleSubmit(
                                          e,
                                          rr.selectedRId,
                                          rr._id
                                        )
                                      }
                                    >
                                      <div className={styles.handle}>
                                        <input
                                          type="text"
                                          className={styles.reply_input}
                                          value={replyRModifyInput}
                                          onChange={
                                            modifyR_ReplyInputChangeHandler
                                          }
                                        />
                                        <div className={styles.reply_choose}>
                                          <input
                                            type="submit"
                                            value="대댓글수정"
                                          ></input>
                                          <button
                                            onClick={() => {
                                              setShowRModifyReplyInput(null);
                                              setSelectedRId(null);
                                            }}
                                          >
                                            대댓글수정 취소
                                          </button>
                                        </div>
                                      </div>
                                    </form>
                                  )}
                                </td>
                              )}
                            </tr>
                          </tbody>
                        ))}
                      </table>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className={styles.pagination}>
          <ul className={styles.pageNumbers}>{renderPageNumbers}</ul>
        </div>
      </div>
    </>
  );
};
export default TViewReply;
