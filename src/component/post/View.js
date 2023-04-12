import React, { useEffect, useState } from "react";
import styles from "./View.module.css";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import userStore from "../../store/user.store";
import Header from "../main/Header";
import { scrollToTop } from "../../util/common";

const View = () => {
  const { id } = useParams();
  const user = userStore();
  const [write, setWrite] = useState([]);
  const [htmlString, setHtmlString] = useState();
  const [sameUser, setSameUser] = useState(false);
  const [selectedId, setSelectedId] = useState();
  const [selectedRId, setSelectedRId] = useState();
  const [good, setGood] = useState(false);
  const [goodCount, setGoodCount] = useState(0);

  const [getReplyId, setReplyId] = useState();

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
    if (user.token !== null) {
      axios
        .get(`http://localhost:8080/getWrite/${id}`, {
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
        .get(`http://localhost:8080/getWrite2/${id}`)
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

  const [progress, setProgress] = useState(false);

  const [BtnColorRed, setBtnColorRed] = useState(false);

  const [showReplyInput, setShowReplyInput] = useState(false);
  const [showReplyList, setShowReplyList] = useState(false);

  const [showReplyModifyInput, setShowModifyReplyInput] = useState(false);

  const handleShowReplyInput = () => {
    setShowReplyInput(!showReplyInput);
    //setShowReplyList(false); // 대댓글 입력 칸을 보여주면서 대댓글 목록도 함께 보여줌
  };

  const handleHideReplyInput = () => {
    setShowReplyInput(false);
    //setShowReplyList(false);
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

  


  //---------------------------------


  const [reply, setReply] = useState([]);
  
  const [isSecret, setIsSecret] = useState(false); // 비밀댓글 여부
  const [sameUsers, setSameUsers] = useState(false);
  const [postId, setPostId] = useState(); 
  const [replyInput, setReplyInput] = useState("");
  const [replyModifyInput, setReplyModifyInput] = useState("");

  const [replies, setReplies] = useState([]); // 수정된 댓글 가져올 때

  useEffect(() => {
    if (user.token !== null) {
      axios
        .get(`http://localhost:8080/getGoodPost/${id}`, {
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
        .get(`http://localhost:8080/getGoodPost2/${id}`)
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
  }, []);

  const clickGood = () => {
    if (user.token !== null) {
      axios
        .post(`http://localhost:8080/setGoodPost/${id}`, null, {
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

  useEffect(() => {
    const fetchReply = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/getReply/${id}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        if (res.data !== undefined) {
          setReply(res.data.data);
          setSameUsers(res.data.sameUsers);
          console.log(res.data.message);
          console.log(res.data.data);
        }console.log(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    
    fetchReply();
 
  }, []);

  // 댓글삭제 
  const deleteReply = (replyId) => {
    const confirmDelete = window.confirm("댓글을 삭제하시겠습니까?");
    if(confirmDelete) {
      axios
        .delete(`http://localhost:8080/view/${id}/reply/${replyId}`)
        .then((res) => {
          setReply(reply.filter(reply => reply._id !== replyId));
          console.log("data", res.data);
          alert("댓글이 삭제되었습니다.");
        })
        .catch((err) => console.log(err));
    }
  };

  // 댓글수정
  const modifyHandleSubmit = async (e, replyId) => {
    e.preventDefault();

    if(replyModifyInput === "") {
      alert("내용을 작성해주세요.");
      return;
    }
    
    try {
      const response = await axios.post("http://localhost:8080/viewReplyModify", {
        postId: id,
        _id: replyId,
        rWriteDate: today,
        reply: String(replyModifyInput),
        isSecret: Boolean(isSecret), 
      });

      alert("수정이 완료되었습니다.");
      navigate(`/view/${id}`);

      //console.log("data", res.data);

    } catch(error) {
      console.log(error);
    }
  };

  // 댓글수정(가져오기)
  const modifyReply = async (replyId) => {
    try {
      const res = await axios
      .get(`http://localhost:8080/view/${id}/modify/${replyId}`)
      
      if(res.data !== undefined) {
        setIsSecret(res.data.result[0].isSecret);
        setReplyModifyInput(res.data.result[0].reply);
      }
    } catch(error) {
      console.log(error);
    }
  }

  // 댓글수정(내용반영)
  const modifyReplyInputChangeHandler = (e) => {
    setReplyModifyInput(e.target.value);
  }


  const navigate = useNavigate();

  //-----------------------------------------------------------
  const [r_reply, setR_Reply] = useState([]);
  const { rid } = useParams();
  const [isRSecret, setIsRSecret] = useState(false); // 비밀댓글 여부
  const [RsameUsers, setRSameUsers] = useState(false);
  const [postRId, setPostRId] = useState(); 


  /* useEffect(() => {
    const fetchR_Reply = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/getR_Reply/${id}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        if (res.data !== undefined) {
          setR_Reply(res.data.data);
          setRSameUsers(res.data.RsameUsers);
          console.log(res.data.message);
          console.log(res.data.data);
        }console.log('here: ', res.data.data);
      } catch (err) {
        console.error(err);
      }
    };
    
    fetchR_Reply();
 
  }, []); */

  const [showR_ReplyModifyInput, setShowRModifyReplyInput] = useState(false);
  const [replyRModifyInput, setReplyRModifyInput] = useState("");

// 대댓글수정
    const modifyRHandleSubmit = async (e, rid, rrid) => {
    e.preventDefault();

    if(replyRModifyInput === "") {
      alert("내용을 작성해주세요.");
      return;
    }
    
    try {
      console.log('selectedRId: ', rid);
      console.log('rrid: ', rrid);

      const response = await axios.post("http://localhost:8080/viewReplyRModify", {
        postRId: id,
        selectedRId: rid,
        _id: rrid,
        r_rWriteDate: today,
        r_reply: String(replyRModifyInput),
        isRSecret: Boolean(isRSecret), 
      });

      alert("대댓글 수정이 완료되었습니다.");
      navigate(`/view/${id}`);

      //console.log("data", res.data);

    } catch(error) {
      console.log(error);
    }
  };

  // 대댓글수정(가져오기)
  const modifyR_Reply = async (rrid) => {
    try {
      const res = await axios
      .get(`http://localhost:8080/view/${id}/modify/${selectedRId}/${rrid}`)
      
      if(res.data !== undefined) {
        setIsRSecret(res.data.result[0].isRSecret);
        setReplyRModifyInput(res.data.result[0].r_reply);
      }
    } catch(error) {
      console.log(error);
    }
  }

  // 대댓글수정(내용반영)
  const modifyR_ReplyInputChangeHandler = (e) => {
    setReplyRModifyInput(e.target.value);
  }
  

  const fetchR_Reply = async (rid) => {
    try {
      const res = await axios.get(`http://localhost:8080/getR_Reply/${id}/${rid}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      if(res.data.data.length) {
        setR_Reply(res.data.data);
        //setRSameUsers(res.data.RsameUsers);
        console.log(res.data.messgae);
        console.log(res.data.data);
      } else {
       setR_Reply([]); 
       console.log('대댓글이 없습니다.');
      }//console.log('here: ', res.data.data);
    } catch(error) {
      console.log(error);
    }
  };

  const handleRDelete = async (rrid) => {
    const confirmRDelete = window.confirm("대댓글을 삭제하시겠습니까?");
    if(confirmRDelete) {
      try {
        const response = await axios.delete(`http://localhost:8080/postr_reply/${id}/${selectedRId}/${rrid}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        console.log(response.data);
        alert("대댓글이 삭제되었습니다.");
        setR_Reply(r_reply.filter((r) => r._id !== rrid)); // 삭제된 대댓글을 제외하고 대댓글 목록을 업데이트합니다.
      } catch (error) {
        console.error(error);
      }
    }
    
  };




  //----------------------------------------------------------------

  const replyHandler = (e) => {
    setReply(e.target.value);
  };

  const replyInputChangeHandler = (e) => {
    setReplyInput(e.target.value);
  };

  const today = new Date();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { reply: replyInput, isSecret: isSecret };
    
    console.log(data);
    try {
      const response = await axios.post(`http://localhost:8080/postreply/${id}`, {
        reply: String(replyInput),
        isSecret : Boolean(isSecret),
        rwriter: user.name,
        rwriteDate: today,
      }, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      console.log(typeof isSecret);
      
      
      console.log(typeof data);
      //console.log(res.data.datas);
      console.log("success", response.data.message);

      // 새로운 댓글을 추가합니다.
      setReply([...reply, replyInput]);
      setReplyInput(""); // 댓글 입력창을 초기화합니다.

      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };


  const replyInputRChangeHandler = (e) => {
    setReplyRInput(e.target.value);
  };
  const [replyRInput, setReplyRInput] = useState("");

  const rhandleSubmit = async (e) => {
    e.preventDefault();
    const data = { r_reply : replyRInput, isRSecret : isRSecret};
    console.log(data);
    try {
      const response = await axios.post(`http://localhost:8080/postr_reply/${id}/${selectedRId}`, {
        r_reply: String(replyRInput),
        isRSecret : Boolean(isRSecret),
        r_rwriter: user.name,
        r_rwriteDate: today,
        
      }, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      console.log(typeof isRSecret);
      
      
      console.log(typeof data);
      console.log("success", response.data.message);

      // 새로운 댓글을 추가합니다.
      setR_Reply([...r_reply, replyRInput]);
      setReplyRInput(""); // 댓글 입력창을 초기화합니다.

      navigate("/");
    } catch (error) {
      console.log(error);
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
            <div>
              <button
                className={progress ? styles.falseBtn : styles.cbtn}
              >
                {progress ? "모집완료" : "모집중"}
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
            <div>
                날짜{" "}
                {write.writeDate !== undefined &&
                  formatDate(new Date(write.writeDate))}
            </div>
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
            <span onClick={clickGood} className={good ? `styles.goodBtn` : null}>
              좋아요{goodCount}
            </span>
            <span>조회수{write.views}</span>
          </div>
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

              <text className= {isSecret ? styles.falseSecret : styles.trueSecret}>비밀댓글: {isSecret ? '체크됨' : '체크안됨'}</text>

              <input type="checkbox" checked={isSecret} className={styles.secret} onChange={(e) => setIsSecret(e.target.checked)}></input>
              <text className={styles.rc1}>비밀댓글</text>            
              <input type="submit" className={styles.sbtn} value="등록"></input>
            </div>
          </div>
        </form>
        {/* 비밀댓글 체크 여부 출력 */}
        

        <div className={styles.rr_reply}>
          <table>
            <thead>
              <tr className={styles.replyName}>
                <th>닉네임</th>
                <th>비밀댓글 여부</th>
                <th>댓글 내용</th>
                <th>날짜</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {reply.map((r) => (
              
              <tr className={styles.replyTitle} key={r._id}>
                <td>{r.rwriter}</td>
                <td>{r.isSecret ? "비밀댓글" : "공개댓글"}</td>
                <td>{r.reply}</td>
                <td>{" "}
                {r.rwriteDate !== undefined &&
                  formatDate(new Date(r.rwriteDate))}</td>

                { /* 댓글수정 */ }
                {!sameUsers && (
                  <td>
                    <input type="button" className={styles.rdbtn} value="삭제" onClick={ deleteReply.bind(null, r._id) }></input>
                    <input 
                      type="button" 
                      className={styles.rmbtn} 
                      value="수정" 
                      onClick={ () => {
                        setShowModifyReplyInput(selectedId === r._id ? null : r._id);
                        setSelectedId(selectedId === r._id ? null : r._id);
                        modifyReply(r._id);
                      }}
                     ></input>
                     { showReplyModifyInput === r._id && (
                      <form onSubmit={(e) => modifyHandleSubmit(e, r._id)}> 
                          <div className={styles.handle}>
                          
                            <input
                              type="text"
                              className={styles.reply_input}
                              value={replyModifyInput}
                              onChange={modifyReplyInputChangeHandler}
                            />
                            <div className={styles.reply_choose}>
                              <input type="checkbox" checked={isSecret} className={styles.secret} onChange={(e) => setIsSecret(e.target.checked)}></input>
                              <text className={styles.rc1}>비밀 댓글</text>
                              <input type="submit" value="댓글수정"></input>
                              <button onClick={() => {setShowModifyReplyInput(null); setSelectedId(null);}}>댓글수정 취소</button>
                            </div>
                          </div>
                      </form>
                    ) }
                  </td>
                )}

                <td>
                  {!showReplyInput && (
                    <button onClick={() => {
                      setShowReplyInput(selectedRId === r._id ? null : r._id);
                      setSelectedRId(selectedRId === r._id ? null : r._id);
                    }}>대댓글 추가</button>
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
                            <input type="checkbox" checked={isRSecret} className={styles.secret} onChange={(e) => setIsRSecret(e.target.checked)}></input>
                            <text className={styles.rc1}>비밀 대댓글</text>
                            <input type="submit" value="대댓글 등록"></input>
                            <button onClick={() => {setShowReplyInput(null); setSelectedRId(null);}}>대댓글 작성 취소</button>
                          </div>
                        </div>
                    </form>
                
                  )}
                  {!showReplyList && (
                    <button onClick={() => {
                      setShowReplyList(selectedRId === r._id ? null : r._id);
                      setSelectedRId(selectedRId === r._id ? null : r._id);
                      fetchR_Reply(r._id);
                    }}>대댓글 목록 보기</button>
                  )}
                  <div>
                    {showReplyList && (
                      <button onClick={() => {
                        setShowReplyList(selectedRId === r._id ? null : r._id);
                        setSelectedRId(selectedRId === r._id ? null : r._id);
                        fetchR_Reply(r._id);
                      }}>대댓글 목록 닫기</button>
                    )}
                  
                  </div>
                  {showReplyList === r._id && (
                    
                    <div className={styles.rr_reply2}>
                      {/* 대댓글 목록 보여주는 코드 */}
                      
                        <table>
                          <thead>
                            <tr className={styles.ttrrr}>
                              <td>닉네임</td>
                              <td>비밀댓글 여부</td>
                              <td>대댓글 내용</td>
                              <td>작성 날짜</td>
                            </tr>
                          </thead>
                          {r_reply.map((rr) => (
                          <tbody>
                            <tr>
                              <td>{rr.r_rwriter}</td>
                              <td>{rr.isRSecret ? "비밀댓글" : "공개댓글"}</td>
                              <td>{rr.r_reply}</td>
                              <td>{" "}{rr.r_rwriteDate !== undefined && formatDate(new Date(rr.r_rwriteDate))}</td>

                             {/* 대댓글수정 */}
                             {!sameUsers && (
                                <td>
                                  <input type="button" className={styles.rrdbtn} value="삭제" onClick={() => handleRDelete(rr._id)}></input>
                                  <input 
                                    type="button" 
                                    className={styles.rrmbtn} 
                                    value="수정" 
                                    onClick={ () => {
                                      setShowRModifyReplyInput(selectedRId === rr._id ? null : rr._id);
                                      setSelectedRId(selectedRId === rr._id ? null : rr._id);
                                      modifyR_Reply(rr._id);
                                    }}
                                  ></input>
                                  { showR_ReplyModifyInput === rr._id && (
                                    <form onSubmit={(e) => modifyRHandleSubmit(e, rr.selectedRId, rr._id)}> 
                                        <div className={styles.handle}>
                                        
                                          <input
                                            type="text"
                                            className={styles.reply_input}
                                            value={replyRModifyInput}
                                            onChange={modifyR_ReplyInputChangeHandler}
                                          />
                                          <div className={styles.reply_choose}>
                                            <input type="checkbox" checked={isRSecret} className={styles.secret} onChange={(e) => setIsRSecret(e.target.checked)}></input>
                                            <text className={styles.rc1}>비밀 대댓글</text>
                                            <input type="submit" value="대댓글수정"></input>
                                            <button onClick={() => {setShowRModifyReplyInput(null); setSelectedRId(null);}}>대댓글수정 취소</button>
                                          </div>
                                        </div>
                                    </form>
                                  ) }
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
        </div>
      </div>
    </>
  );
}
export default View;
