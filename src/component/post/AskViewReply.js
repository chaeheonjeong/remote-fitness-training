import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../main/Header";
import { scrollToTop } from "../../util/common";
import styles from "./AskView.module.css";
import userStore from "../../store/user.store";
import { useParams } from "react-router-dom";
import { HiUserCircle } from "react-icons/hi";
import { BASE_API_URI } from "../../util/common";

const AskViewReply = ({ write, setWrite, writer }) => {
  const [sameUsers, setSameUsers] = useState(false);
  const { id } = useParams();
  const user = userStore();
  const textareaRef = useRef();

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

  const postCategory = "AskView";

  const formatDate = (today) => {
    const daysOfWeek = ["일", "월", "화", "수", "목", "금", "토"];
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const dateW = today.getDate();
    const dayOfWeek = daysOfWeek[today.getDay()];
    const formattedDate = `${year}.${month}.${dateW}(${dayOfWeek})`;

    return formattedDate;
  };

  const [Aprogress, setAProgress] = useState(false);
  const [BtnAColorRed, setBtnAColorRed] = useState(false);

  const [showAReplyInput, setShowAReplyInput] = useState(false);
  const [showAReplyList, setShowAReplyList] = useState(false);
  const [showAReplyModifyAInput, setShowModifyAReplyInput] = useState(false);
  const [Areply, setAReply] = useState([]);

  const [sameAUsers, setSameAUsers] = useState(false);
  const [replyAInput, setReplyAInput] = useState("");
  const [replyModifyAInput, setReplyModifyAInput] = useState("");

  const [rWriter, setRWriter] = useState("");

  const fetchAReply = async () => {
    try {
      const res = await axios.get(`${BASE_API_URI}/getAReply/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      if (res.data !== undefined) {
        setAReply(res.data.data);
        setSameAUsers(res.data.sameAUsers);
        setPImg(res.data.profileImgs);

        console.log(res.data.message);
        console.log(res.data.data);
      }
      console.log(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAReply();
  }, []);

  const [Ar_reply, setAR_Reply] = useState([]);
  const { Arid } = useParams();
  const [ARsameUsers, setARSameUsers] = useState(false);
  const [postARId, setPostARId] = useState();

  const fetchAR_Reply = async (rid) => {
    try {
      const res = await axios.get(`${BASE_API_URI}/getAR_Reply/${id}/${rid}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      if (res.data.data.length) {
        setAR_Reply(res.data.data);
        setARSameUsers(res.data.ARsameUsers);
        setRPImg(res.data.profileImgs);

        console.log(res.data.messgae);
        console.log(res.data.data);
      } else {
        setAR_Reply([]);
        console.log("대댓글이 없습니다.");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const replyAInputChangeHandler = (e) => {
    setReplyAInput(e.target.value);
  };

  const today = new Date();

  const AhandleSubmit = async (e) => {
    e.preventDefault();
    const data = { reply: replyAInput };
    try {
      const response = await axios.post(
        `${BASE_API_URI}/postAreply/${id}`,
        {
          Areply: String(replyAInput),
          Arwriter: user.name,
          ArwriteDate: today,
        },
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      const data = { Ar_reply: replyARInput };

      console.log("success", response.data.message);

      createRAlarm();

      // 새로운 댓글을 추가합니다.
      setAReply([...Areply, replyAInput]);
      setReplyAInput(""); // 댓글 입력창을 초기화합니다.

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
          message: String(replyAInput),
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

  const replyInputARChangeHandler = (e) => {
    setReplyARInput(e.target.value);
  };
  const [replyARInput, setReplyARInput] = useState("");
  const [selectedARId, setSelectedARId] = useState();

  const ArhandleSubmit = async (e) => {
    e.preventDefault();
    const data = { Ar_reply: replyARInput };
    console.log(data);
    try {
      const response = await axios.post(
        `${BASE_API_URI}/postAr_reply/${id}/${selectedARId}`,
        {
          Ar_reply: String(replyARInput),
          Ar_rwriter: user.name,
          AAr_rwriteDate: today,
        },
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      console.log("success", response.data.message);

      createRrAlarm();

      // 새로운 댓글을 추가합니다.
      setAR_Reply([...Ar_reply, replyARInput]);
      console.log(Ar_reply, replyARInput);
      setReplyARInput(""); // 댓글 입력창을 초기화합니다.

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
        message: String(replyARInput),
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

  //질문글 대댓글 삭제
  const handleARDelete = async (rrid) => {
    const confirmARDelete = window.confirm("대댓글을 삭제하시겠습니까?");
    if (confirmARDelete) {
      try {
        const response = await axios.delete(
          `${BASE_API_URI}/postAr_reply/${id}/${selectedARId}/${rrid}`,
          {
            headers: { Authorization: `Bearer ${user.token}` },
          }
        );
        console.log(response.data);
        alert("대댓글이 삭제되었습니다.");
        setAR_Reply(Ar_reply.filter((r) => r._id !== rrid)); // 삭제된 대댓글을 제외하고 대댓글 목록을 업데이트합니다.
      } catch (error) {
        console.error(error);
      }
    }
  };

  // 댓글삭제
  const deleteAReply = (replyId) => {
    const confirmDelete = window.confirm("댓글을 삭제하시겠습니까?");
    if (confirmDelete) {
      axios
        .delete(`${BASE_API_URI}/askView/${id}/reply/${replyId}`)
        .then((res) => {
          setAReply(Areply.filter((Areply) => Areply._id !== replyId));
          console.log("data", res.data);
          alert("댓글이 삭제되었습니다.");
        })
        .catch((err) => console.log(err));
    }
  };

  // 댓글수정
  const modifyAHandleSubmit = async (e, replyId) => {
    e.preventDefault();

    if (replyModifyAInput === "") {
      alert("내용을 작성해주세요.");
      return;
    }

    try {
      const response = await axios.post(`${BASE_API_URI}/viewAReplyModify`, {
        postId: id,
        _id: replyId,
        ArWriteDate: today,
        Areply: String(replyModifyAInput),
      });

      alert("수정이 완료되었습니다.");
      navigate(`/askView/${id}`);
    } catch (error) {
      console.log(error);
    }
  };

  // 댓글수정(가져오기)
  const modifyAReply = async (replyId) => {
    try {
      const res = await axios.get(
        `${BASE_API_URI}/askView/${id}/modify/${replyId}`
      );

      if (res.data !== undefined) {
        setReplyModifyAInput(res.data.result[0].Areply);
      }

      console.log(res.data.result[0].Areply);
    } catch (error) {
      console.log(error);
    }
  };

  // 댓글수정(내용반영)
  const modifyAReplyInputChangeHandler = (e) => {
    setReplyModifyAInput(e.target.value);
  };

  const [showAR_ReplyModifyAInput, setShowARModifyReplyInput] = useState(false);
  const [replyARModifyInput, setReplyARModifyInput] = useState("");

  // 대댓글수정
  const modifyARHandleSubmit = async (e, selectedARId, rrid) => {
    e.preventDefault();

    if (replyARModifyInput === "") {
      alert("내용을 작성해주세요.");
      return;
    }
    try {
      const response = await axios.post(
        `${BASE_API_URI}/askviewReplyARModify`,
        {
          postRId: id,
          selectedARId: selectedARId,
          _id: rrid,
          Ar_rWriteDate: today,
          Ar_reply: String(replyARModifyInput),
        }
      );

      alert("대댓글 수정이 완료되었습니다.");
      navigate(`/askView/${id}`);
    } catch (error) {
      console.log(error);
    }
  };

  // 대댓글수정(가져오기)
  const modifyAR_Reply = async (rrid) => {
    try {
      const res = await axios.get(
        `${BASE_API_URI}/askview/${id}/modify/${selectedARId}/${rrid}`
      );

      if (res.data !== undefined) {
        setReplyARModifyInput(res.data.result[0].Ar_reply);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // 대댓글수정(내용반영)
  const modifyAR_ReplyInputChangeHandler = (e) => {
    setReplyARModifyInput(e.target.value);
  };

  //-----------------------------------------------------------------------------

  //댓글 페이지네이션
  const [AcurrentPage, setACurrentPage] = useState(1);
  const [AperPage] = useState(5);

  // 현재 페이지에 보여질 댓글들 추출
  const startIndex = (AcurrentPage - 1) * AperPage;
  const endIndex = startIndex + AperPage;
  const AcurrentReply = Areply.slice(startIndex, endIndex);

  // 페이지네이션 컴포넌트
  const totalPages = Math.ceil(Areply.length / AperPage);
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  const renderAPageNumbers = pageNumbers.map((number) => {
    return (
      <li key={number}>
        <button onClick={() => setACurrentPage(number)}>{number}</button>
      </li>
    );
  });

  const [ARgood, setARGood] = useState([]);
  const [ARgoodCount, setARGoodCount] = useState([]);
  const [clickedAReplyId, setClickedAReplyId] = useState(null); // 초기값은 null로 설정
  const [clickedAReplyLiked, setClickedAReplyLiked] = useState(false);
  const [AcurrentReplySorted, setAcurrentReplySorted] = useState([]); // 추가

  /* const handleAReplyClick = (clickedAReplyId) => {
        setClickedAReplyId(clickedAReplyId);
        fetchARGood(clickedAReplyId);
        clickARGood(clickedAReplyId);
  
    useEffect(() => {
        fetchARGoodCount(clickedAReplyId);
      }, [clickedAReplyId]);
 */
  const handleAReplyClick = (clickedAReplyId) => {
    setClickedAReplyId(clickedAReplyId);
    //fetchARGood(clickedAReplyId);
    //clickARGood(clickedAReplyId);

    console.log("글 번호는 : ", id);
    console.log("댓글 번호는 : ", clickedAReplyId);
  };

  const fetchARGood = (clickedAReplyId) => {
    if (user.token !== null) {
      axios
        .get(`${BASE_API_URI}/getARGood/${clickedAReplyId}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        })
        .then((response) => {
          if (response.status === 200) {
            console.log(response.data.ARgoodCount);
            //console.log(response.data.ARgoodCount);
            setARGood(true);
            setARGoodCount(response.data.ARgoodCount);
            console.log(response.data.message);
            //console.log(response.data.ARgood);

            console.log("");
          } else if (response.status === 204) {
            setARGood(false);
            setARGoodCount(0);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      axios
        .get(`${BASE_API_URI}/getARGood2/${clickedAReplyId}`)
        .then((response) => {
          if (response.status === 200) {
            setARGood(true);
            setARGoodCount(response.data.ARcount || 0);
          } else if (response.status === 204) {
            setARGood(false);
            setARGoodCount(0);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const clickARGood = (clickedAReplyId) => {
    if (user.token !== null) {
      axios
        .post(`${BASE_API_URI}/setARGood/${clickedAReplyId}`, null, {
          headers: { Authorization: `Bearer ${user.token}` },
        })
        .then((response) => {
          if (response.status === 200) {
            console.log("@### ", response);
            setARGood(!ARgood);
            if (!ARgood) {
              setARGoodCount((prevARCount) => prevARCount + 1);
            }
            if (ARgood) {
              setARGoodCount((prevARCount) => prevARCount - 1);
            }
          }
        })

        .catch((error) => {
          console.log(error);
        });
    } else {
      alert("로그인 해주세요.");
    }
  };

  const AReplyProfileClick = (userId) => {
    navigate(`/PortfolioView/${userId}`);
  };

  const AAReplyProfileClick = (userId) => {
    navigate(`/PortfolioView/${userId}`);
  };

  // 좋아요 핸들러
  const handleLike = async (id) => {
    try {
      await axios.put(
        `${BASE_API_URI}/likeAreply/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );

      // 댓글을 다시 불러와서 업데이트된 좋아요 수를 확인합니다
      fetchAReply();

      // 좋아요 요청에 대한 처리를 추가해주세요
    } catch (error) {
      console.log(error);
    }
  };

  const autoResize = () => {
    const textarea = textareaRef.current;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  }

  return (
    <>
      {/* 댓글 입력 폼 */}
      <form onSubmit={AhandleSubmit}>
        <div className={styles.content_6}>
          <textarea
            type="text"
            className={styles.reply_input}
            placeholder="댓글 내용을 입력해주세요."
            value={replyAInput}
            onChange={replyAInputChangeHandler}
            ref={textareaRef}
            onInput={autoResize}   
          />
          <div className={styles.reply_choose}>
            <input type="submit" className={styles.sbtn} value="등록"></input>
          </div>
        </div>
      </form>
        
        <p className={styles.reply_list}>댓글 목록</p>
        <div className={styles.rr_reply}>

      {/* 비밀댓글 체크 여부 출력 */}
      <div>
        
        {AcurrentReply.map((r, index) => (
              <div className={styles.replies} key={r._id}>
                <div className={styles.reply_package}>
                  
                  <div className={styles.rwriter_pack}>
                    <div key={r._id} className={styles.reply_top} 
                        onClick={() => AReplyProfileClick(r._user)}
                      >
                    {!pImg || !pImg[index] ? (
                      <HiUserCircle
                        size="40"
                        color="#5a5a5a"
                        style={{ cursor: "pointer" }}
                        /* onClick={() => {
                                    profileClick(write.writer, id);
                                }} */
                      />
                    ) : (
                      <img
                        className={styles.profile}
                        src={pImg[index]}
                        alt="프로필 이미지"
                      />
                    )}
                    </div>

                    <div className={styles.rwriter}>
                      <div className={styles.rname}>
                        {r.Arwriter}
                      </div>
                      <div className={styles.rdate}>
                        {r.ArwriteDate !== undefined &&
                        formatDate(new Date(r.ArwriteDate))}
                      </div>
                    </div>
                  </div>

                  {sameAUsers[index] && (
                       showAReplyModifyAInput !== r._id ? (
                      <div className={styles.rdm_btn}>
                        <input 
                          type="button" 
                          className={styles.rmbtn} 
                          value="수정" 
                          onClick={ () => {
                            setShowModifyAReplyInput(selectedAId === r._id ? null : r._id);
                            setSelectedAId(selectedAId === r._id ? null : r._id);
                            modifyAReply(r._id);
                            console.log("here ", showAReplyModifyAInput, selectedAId, r);
                          }}
                      ></input>
                      <input type="button" className={styles.rdbtn} value="삭제" onClick={ deleteAReply.bind(null, r._id) }></input>
                      </div> ) : (
                        <div className={styles.rdm_btn}>
                          <form 
                            onSubmit={(e) => modifyAHandleSubmit(e, r._id)} 
                          > 
                            <div className={styles.handle}>
                          
                              <div className={styles.reply_choose}>
                                <button className={styles.rrrr2} onClick={() => {setShowModifyAReplyInput(null); setSelectedAId(null);}}>취소</button>
                                <input className={styles.rrrr} type="submit" value="등록"></input>
                              </div>
                            </div>
                        </form>
                        </div>
                      )
                    )}
                </div>




                <div className={styles.reply}>
                {showAReplyModifyAInput === r._id ? (
                  <form onSubmit={(e) => modifyAHandleSubmit(e, r._id)}>
                    <div className={styles.handle}>
                    {selectedAId === r._id ? (
                      <textarea
                        className={`${styles.reply_input} ${styles.reply_content}`}
                        value={replyModifyAInput}
                        onChange={modifyAReplyInputChangeHandler}
                        ref={textareaRef}
                        onInput={autoResize}
                        style={{ width: "34rem" }}
                        rows="5"
                      />
                    ) : null}
                    </div>
                  </form>
                ) : (
                  <div className={styles.reply_content}>
                    {r.Areply}
                  </div>)}
                  
                  <div className={styles.good}>
                          <span
                            className={styles.like_button}
                            onClick={() => handleLike(r._id)} // 좋아요 버튼 클릭 시 핸들러 호출
                          >
                            👍
                          {r.likesCount}{" "}
                          </span>
                        </div>
                </div>

                <div>
                <div className={styles.list}>
                  <div>
                  {!showAReplyList || showAReplyList !== r._id ? (
                    <button
                      className={styles.asdf1}
                      onClick={() => {
                        setShowAReplyList(r._id);
                        setSelectedARId(r._id);
                        fetchAR_Reply(r._id);
                        console.log("1", showAReplyList === r._id);
                      }}
                    > 대댓글 목록 보기
                    </button>
                  ) : (
                    <button
                      className={styles.asdf1}
                      onClick={() => {
                        setShowAReplyList(null);
                        setSelectedARId(null);
                        fetchAR_Reply(r._id);
                        console.log("2", showAReplyList === r._id);
                      }}
                    >
                      대댓글 목록 닫기
                    </button>
                  )}
                </div>
                
                  {!showAReplyInput && (
                    <button className={styles.asdf} onClick={() => {
                      setShowAReplyInput(selectedARId === r._id ? null : r._id);
                      setSelectedARId(selectedARId === r._id ? null : r._id);
                      setRWriter(selectedARId === r._id ? null : r._id);
                    }}>대댓글 추가</button>
                  )}
                  {showAReplyInput === r._id && (
                      <form onSubmit={ArhandleSubmit}> 
                        <div className={styles.rhandle}>
                        
                          <textarea
                            type="text"
                            className={styles.reply_input}
                            placeholder="대댓글 내용을 입력해주세요."
                            value={replyARInput}
                            onChange={replyInputARChangeHandler}
                            ref={textareaRef}
                            onInput={autoResize}   
                          />
                          <div className={styles.reply_choose}>
                            <input className={styles.asdf3} type="submit" value="대댓글 등록"></input>
                            <button className={styles.reply_choose2} onClick={() => {setShowAReplyInput(null); setSelectedARId(null);}}>대댓글 작성 취소</button>
                          </div>
                        </div>
                    </form>
                
                  )}
                  </div>
                </div>

                {showAReplyList === r._id && (
                      
                        Ar_reply.map((rr, index) => {
                          return (
                            <>
                            <div className={styles.rr_reply}>
                              <div className={styles.r_replies} key={rr._id}>
                              <div className={styles.reply_package}>

                                <div className={styles.rwriter_pack}>
                                  <div key={rr._id} className={styles.reply_top} 
                                    onClick={() => AReplyProfileClick(rr._user)}
                                  >
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
                                    </div>

                                    <div className={styles.rwriter}>
                                      <div className={styles.rname}>
                                        {rr.r_rwriter}
                                      </div>
                                      <div className={styles.rdate}>
                                        {rr.Ar_rwriteDate !== undefined &&
                                        formatDate(new Date(rr.Ar_rwriteDate))}
                                      </div>
                                    </div>
                                  </div>

                                  {ARsameUsers[index] && (
                                    selectedARId === rr._id && selectedARId === showAR_ReplyModifyAInput ? (
                                      <div className={styles.rdm_btn}>
                                          <button className={styles.rrrr2} onClick={() => { setShowARModifyReplyInput(null); setSelectedARId(null); }}>취소</button>
                                              
                                              <form onSubmit={(e) => modifyARHandleSubmit(e, rr.selectedARId, rr._id)}>
                                                <input className={styles.rrrr} type="submit" value="등록"></input>
                                            </form>
                                      </div>
                                    ) : (
                                      <div className={styles.rdm_btn}>
                                        <input 
                                          type="button" 
                                          className={styles.rmbtn} 
                                          value="수정" 
                                          onClick={() => {
                                            setShowARModifyReplyInput(rr._id);
                                            setSelectedARId(rr._id);
                                            modifyAR_Reply(rr._id);
                                            console.log("here ", showAR_ReplyModifyAInput, selectedARId, rr._id);
                                          }}
                                        ></input>
                                        <input 
                                          type="button" 
                                          className={styles.rdbtn} 
                                          value="삭제" 
                                          onClick={() => handleARDelete(rr._id)}
                                        ></input>
                                      </div>
                                    )
                                  )}

                                    </div>
                                    <div className={styles.reply}>
                                    { showAR_ReplyModifyAInput === rr._id ? (
                                        <form onSubmit={(e) => modifyARHandleSubmit(e, rr.selectedARId, r._id)}> 
                                        
                                          
                                          <div className={styles.handle}>{/* 
                                          {selectedARId === rr._id ? ( */}
                                            <textarea
                                              className={`${styles.reply_input} ${styles.reply_content}`}
                                              value={replyARModifyInput}
                                              onChange={modifyAR_ReplyInputChangeHandler}
                                              ref={textareaRef}
                                              onInput={autoResize}
                                              style={{ width: "34rem" }}
                                              rows="5"
                                            />{/* 
                                          ) : null} */}
                                          </div>
                                        </form>
                                        ) : (
                                          <div className={styles.reply_content}>
                                            {rr.r_reply}
                                          </div>
                                          )}
                                        </div>
                            </div>
                            </div>
                            </>
                          );
                        })
                  )}
              <hr/>
          </div>
        ))}
      </div>  
            <div className={styles.pagination}>
              <ul className={styles.pageNumbers}>
                {renderAPageNumbers}
              </ul>
            </div>
          </div>
        </>
  );
};
export default AskViewReply;
