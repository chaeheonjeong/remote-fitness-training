import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./AskView.css";
import userStore from "../../store/user.store";
import Header from "../main/Header";
import styles from "./View.module.css";
import axios from "axios";
import { scrollToTop } from "../../util/common";
import { HiUserCircle } from "react-icons/hi";

function AskView() {
  const navigate = useNavigate();
  const { id } = useParams();
  const user = userStore();
  const [write, setWrite] = useState([]);
  const [htmlString, setHtmlString] = useState();
  const [sameUser, setSameUser] = useState();
  const [good, setGood] = useState(false);
  const [goodCount, setGoodCount] = useState(0);
  const [profileImg, setProfileImg] = useState(null);

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
            setProfileImg(response.data.profileImg);
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
  }, []);

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

  const [showAReplyModifyInput, setShowModifyAReplyInput] = useState(false);

  const [Areply, setAReply] = useState([]);

  const [isASecret, setIsASecret] = useState(false); // 비밀댓글 여부
  const [sameAUsers, setSameAUsers] = useState(false);
  const [replyAInput, setReplyAInput] = useState("");
  const [replyModifyAInput, setReplyModifyAInput] = useState("");

  useEffect(() => {
    const fetchAReply = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/getAReply/${id}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        if (res.data !== undefined) {
          setAReply(res.data.data);
          setSameAUsers(res.data.sameAUsers);
          console.log(res.data.message);
          console.log(res.data.data);
        }console.log(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    
    fetchAReply();
 
  }, []);

  // 댓글삭제
  const deleteAReply = (replyId) => {
    const confirmDelete = window.confirm("댓글을 삭제하시겠습니까?");
    if(confirmDelete) {
      axios
        .delete(`http://localhost:8080/askView/${id}/reply/${replyId}`)
        .then((res) => {
          setAReply(Areply.filter(Areply => Areply._id !== replyId));
          console.log("data", res.data);
          alert("댓글이 삭제되었습니다.");
        })
        .catch((err) => console.log(err));
    }
  };

    // 댓글수정
const modifyAHandleSubmit = async (e, replyId) => {
e.preventDefault();

if(replyModifyAInput === "") {
  alert("내용을 작성해주세요.");
  return;
}

try {
  const response = await axios.post("http://localhost:8080/viewAReplyModify", {
    postId: id,
    _id: replyId,
    ArWriteDate: today,
    Areply: String(replyModifyAInput),
    isASecret: Boolean(isASecret), 
  });

  alert("수정이 완료되었습니다.");
  navigate(`/askView/${id}`);

  //console.log("data", res.data);

} catch(error) {
  console.log(error);
}
};

// 댓글수정(가져오기)
const modifyAReply = async (replyId) => {
try {
  const res = await axios
  .get(`http://localhost:8080/askView/${id}/modify/${replyId}`)
  
  if(res.data !== undefined) {
    setIsASecret(res.data.result[0].isASecret);
    setReplyModifyAInput(res.data.result[0].Areply);
  }

  console.log(res.data.result[0].isASecret, res.data.result[0].Areply);
} catch(error) {
  console.log(error);
}
}

// 댓글수정(내용반영)
const modifyAReplyInputChangeHandler = (e) => {
setReplyModifyAInput(e.target.value);
}


  const [Ar_reply, setAR_Reply] = useState([]);
  const { Arid } = useParams();
  const [isARSecret, setIsARSecret] = useState(false); // 비밀댓글 여부
  const [ARsameUsers, setARSameUsers] = useState(false);
  const [postARId, setPostARId] = useState(); 
  /* useEffect(() => {
    const fetchAR_Reply = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/getAR_Reply/${id}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        if (res.data !== undefined) {
          setAR_Reply(res.data.data);
          setARSameUsers(res.data.ARsameUsers);
          console.log(res.data.message);
          console.log(res.data.data);
        }console.log(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    
    fetchAR_Reply();
 
  }, []); */

  const fetchAR_Reply = async (rid) => {
    try {
      const res = await axios.get(`http://localhost:8080/getAR_Reply/${id}/${rid}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      if(res.data.data.length) {
        setAR_Reply(res.data.data);
        //setRSameUsers(res.data.RsameUsers);
        console.log(res.data.messgae);
        console.log(res.data.data);
      } else {
       setAR_Reply([]); 
       console.log('대댓글이 없습니다.');
      }//console.log('here: ', res.data.data);
    } catch(error) {
      console.log(error);
    }
  };

  const replyAInputChangeHandler = (e) => {
    setReplyAInput(e.target.value);
  };

const today = new Date();

const AhandleSubmit = async (e) => {
    e.preventDefault();
    const data = { reply: replyAInput, isSecret: isASecret };
    
    console.log(data);
    try {
      const response = await axios.post(`http://localhost:8080/postAreply/${id}`, {
        Areply: String(replyAInput),
        isASecret : Boolean(isASecret),
        Arwriter: user.name,
        ArwriteDate: today,
      }, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const data = { Ar_reply : replyARInput, isARSecret : isARSecret};
      console.log(typeof isASecret);
      
      
      console.log(typeof data);
      //console.log(res.data.datas);
      console.log("success", response.data.message);

      // 새로운 댓글을 추가합니다.
      setAReply([...Areply, replyAInput]);
      setReplyAInput(""); // 댓글 입력창을 초기화합니다.

      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  const replyInputARChangeHandler = (e) => {
    setReplyARInput(e.target.value);
  };
  const [replyARInput, setReplyARInput] = useState("");
  const [selectedARId, setSelectedARId] = useState();

  const ArhandleSubmit = async (e) => {
    e.preventDefault();
    const data = { Ar_reply : replyARInput, isRSecret : isARSecret};
    console.log(data);
    try {
      const response = await axios.post(`http://localhost:8080/postAr_reply/${id}/${selectedARId}`, {
        Ar_reply: String(replyARInput),
        isARSecret : Boolean(isARSecret),
        Ar_rwriter: user.name,
        Ar_rwriteDate: today,
        
      }, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      console.log(typeof isRSecret);
      
      
      console.log(typeof data);
      console.log("success", response.data.message);

      // 새로운 댓글을 추가합니다.
      setAR_Reply([...Ar_reply, replyARInput]);
      setReplyARInput(""); // 댓글 입력창을 초기화합니다.

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
            <div>
              작성자
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
          <span onClick={clickGood} className={good ? styles.goodBtn : null}>
            좋아요{goodCount}
          </span>
          <span> 조회수 {write.views} </span>
        </div>


        
        {/* 댓글 입력 폼 */}
        <form onSubmit={AhandleSubmit}>
                    <div className={styles.content_6}>
                        <input
                        type="text"
                        className={styles.reply_input}
                        placeholder="댓글 내용을 입력해주세요."
                        value={replyAInput}
                        onChange={replyAInputChangeHandler}
                        />
                        <div className={styles.reply_choose}>

                        <text className= {isASecret ? styles.falseSecret : styles.trueSecret}>비밀댓글: {isASecret ? '체크됨' : '체크안됨'}</text>

                        <input type="checkbox" checked={isASecret} className={styles.secret} onChange={(e) => setIsASecret(e.target.checked)}></input>
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
                        {Areply.map((r) => (
                        
                        <tr className={styles.replyTitle} key={r._id}>
                            <td>{r.Arwriter}</td>
                            <td>{r.isASecret ? "비밀댓글" : "공개댓글"}</td>
                            <td>{r.Areply}</td>
                            <td>{" "}
                            {r.ArwriteDate !== undefined &&
                            formatDate(new Date(r.ArwriteDate))}</td>

                            {/* 댓글수정 */}
                            {!sameAUsers && (
                            <td>
                                <input type="button" className={styles.rdbtn} value="삭제" onClick={ deleteAReply.bind(null, r._id) }></input>
                                <input 
                                  type="button" 
                                  className={styles.rmbtn} 
                                  value="수정" 
                                  onClick={ () => {
                                    setShowModifyAReplyInput(selectedAId === r._id ? null : r._id);
                                    setSelectedAId(selectedAId === r._id ? null : r._id);
                                    modifyAReply(r._id);
                                  }}
                                ></input>
                                { showAReplyModifyInput === r._id && (
                                  <form onSubmit={(e) => modifyAHandleSubmit(e, r._id)}> 
                                      <div className={styles.handle}>
                                      
                                        <input
                                          type="text"
                                          className={styles.reply_input}
                                          value={replyModifyAInput}
                                          onChange={modifyAReplyInputChangeHandler}
                                        />
                                        <div className={styles.reply_choose}>
                                          <input type="checkbox" checked={isASecret} className={styles.secret} onChange={(e) => setIsASecret(e.target.checked)}></input>
                                          <text className={styles.rc1}>비밀 댓글</text>
                                          <input type="submit" value="댓글수정"></input>
                                          <button onClick={() => {setShowModifyAReplyInput(null); setSelectedAId(null);}}>댓글수정 취소</button>
                                        </div>
                                      </div>
                                  </form>
                                ) }
                            </td>
                            )}

                            <td>
                            {!showAReplyInput && (
                                <button onClick={() => {
                                setShowAReplyInput(selectedARId === r._id ? null : r._id);
                                setSelectedARId(selectedARId === r._id ? null : r._id);
                                }}>대댓글 추가</button>
                            )}
                            {showAReplyInput === r._id && (
                                <form onSubmit={ArhandleSubmit}> 
                                    <div className={styles.rhandle}>
                                    
                                    <input
                                        type="text"
                                        className={styles.reply_input}
                                        placeholder="대댓글 내용을 입력해주세요."
                                        value={replyARInput}
                                        onChange={replyInputARChangeHandler}
                                    />
                                    <div className={styles.reply_choose}>
                                        <input type="checkbox" checked={isARSecret} className={styles.secret} onChange={(e) => setIsARSecret(e.target.checked)}></input>
                                        <text className={styles.rc1}>비밀 대댓글</text>
                                        <input type="submit" value="대댓글 등록"></input>
                                        <button onClick={() => {setShowAReplyInput(null); setSelectedARId(null);}}>대댓글 작성 취소</button>
                                    </div>
                                    </div>
                                </form>
                            
                            )}
                            {!showAReplyList && (
                                <button onClick={() => {
                                setShowAReplyList(selectedARId === r._id ? null : r._id);
                                setSelectedARId(selectedARId === r._id ? null : r._id);
                                fetchAR_Reply(r._id);
                                }}>대댓글 목록 보기</button>
                            )}
                            <div>
                                {showAReplyList && (
                                <button onClick={() => {
                                    setShowAReplyList(selectedARId === r._id ? null : r._id);
                                    setSelectedARId(selectedARId === r._id ? null : r._id);
                                    fetchAR_Reply(r._id);
                                }}>대댓글 목록 닫기</button>
                                )}
                            
                            </div>
                            {showAReplyList === r._id && (
                                
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
                                      {Ar_reply.map((rr) => (
                                      <tbody>
                                          <tr>
                                          <td>{rr.Ar_rwriter}</td>
                                          <td>{rr.isARSecret ? "비밀댓글" : "공개댓글"}</td>
                                          <td>{rr.Ar_reply}</td>
                                          <td>{" "}{rr.Ar_rwriteDate !== undefined && formatDate(new Date(rr.Ar_rwriteDate))}</td>
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

export default AskView;