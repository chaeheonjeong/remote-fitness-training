import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import Header from "../main/Header";
import { scrollToTop } from "../../util/common";
import styles from './AskView.module.css';
import userStore from "../../store/user.store";
import { useParams } from "react-router-dom";
import Reply from '../../server/models/reply';
import { HiUserCircle } from "react-icons/hi";

const AskViewReply = ({ write, setWrite }) => {
    const [sameUsers, setSameUsers] = useState(false);
    const { id } = useParams();
    const user = userStore();

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
            setPImg(res.data.profileImgs);

            console.log(res.data.message);
            console.log(res.data.data);
            }console.log(res.data);
        } catch (err) {
            console.error(err);
        }
        };    
        fetchAReply();
    }, []);

    const [Ar_reply, setAR_Reply] = useState([]);
    const { Arid } = useParams();
    const [ARsameUsers, setARSameUsers] = useState(false);
    const [postARId, setPostARId] = useState(); 
    
    const fetchAR_Reply = async (rid) => {
        try {
            const res = await axios.get(`http://localhost:8080/getAR_Reply/${id}/${rid}`, {
                headers: { Authorization: `Bearer ${user.token}` },
            });

            if(res.data.data.length) {
                setAR_Reply(res.data.data);
                setARSameUsers(res.data.RsameUsers);
                setRPImg(res.data.profileImgs);

                console.log(res.data.messgae);
                console.log(res.data.data);
            } else {
            setAR_Reply([]); 
            console.log('대댓글이 없습니다.');
            }
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
        const data = { reply: replyAInput };
        try {
        const response = await axios.post(`http://localhost:8080/postAreply/${id}`, {
            Areply: String(replyAInput),
            Arwriter: user.name,
            ArwriteDate: today,
        }, {
            headers: { Authorization: `Bearer ${user.token}` },
        });
        const data = { Ar_reply : replyARInput};
    
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
        const data = { Ar_reply : replyARInput};
        console.log(data);
        try {
        const response = await axios.post(`http://localhost:8080/postAr_reply/${id}/${selectedARId}`, {
            Ar_reply: String(replyARInput),
            Ar_rwriter: user.name,
            Ar_rwriteDate: today,  
        }, {
            headers: { Authorization: `Bearer ${user.token}` },
        });
        console.log("success", response.data.message);
        
        // 새로운 댓글을 추가합니다.
        setAR_Reply([...Ar_reply, replyARInput]);
        console.log(Ar_reply, replyARInput);
        setReplyARInput(""); // 댓글 입력창을 초기화합니다.
        
        navigate("/");
        } catch (error) {
        console.log(error);
        }
    };

    //질문글 대댓글 삭제
    const handleARDelete = async (rrid) => {
        const confirmARDelete = window.confirm("대댓글을 삭제하시겠습니까?");
        if(confirmARDelete) {
        try {
            const response = await axios.delete(`http://localhost:8080/postAr_reply/${id}/${selectedARId}/${rrid}`, {
            headers: { Authorization: `Bearer ${user.token}` },
            });
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
    });

    alert("수정이 완료되었습니다.");
    navigate(`/askView/${id}`);

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
        setReplyModifyAInput(res.data.result[0].Areply);
    }

    console.log(res.data.result[0].Areply);
    } catch(error) {
    console.log(error);
    }
    }

    // 댓글수정(내용반영)
    const modifyAReplyInputChangeHandler = (e) => {
    setReplyModifyAInput(e.target.value);
    }



    const [showAR_ReplyModifyInput, setShowARModifyReplyInput] = useState(false);
    const [replyARModifyInput, setReplyARModifyInput] = useState("");


    // 대댓글수정
    const modifyARHandleSubmit = async (e, selectedARId, rrid) => {
        e.preventDefault();

        if(replyARModifyInput === "") {
        alert("내용을 작성해주세요.");
        return;
        }
        try {
        const response = await axios.post("http://localhost:8080/askviewReplyARModify", {
            postRId: id,
            selectedARId: selectedARId,
            _id: rrid,
            Ar_rWriteDate: today,
            Ar_reply: String(replyARModifyInput),
        });

        alert("대댓글 수정이 완료되었습니다.");
        navigate(`/askView/${id}`);

        } catch(error) {
        console.log(error);
        }
    };

    // 대댓글수정(가져오기)
    const modifyAR_Reply = async (rrid) => {
        try {
        const res = await axios
        .get(`http://localhost:8080/askview/${id}/modify/${selectedARId}/${rrid}`)
        
        if(res.data !== undefined) {
            setReplyARModifyInput(res.data.result[0].Ar_reply);
        }
        } catch(error) {
        console.log(error);
        }
    }

    // 대댓글수정(내용반영)
    const modifyAR_ReplyInputChangeHandler = (e) => {
        setReplyARModifyInput(e.target.value);
    }

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

    const renderAPageNumbers = pageNumbers.map(number => {
        return (
          <li key={number}>
            <button onClick={() => setACurrentPage(number)}>
              {number}
            </button>
          </li>
        );
    });

    const [ARgood, setARGood] = useState([]);
    const [ARgoodCount, setARGoodCount] = useState([]);
    const [clickedAReplyId, setClickedAReplyId] = useState(null); // 초기값은 null로 설정
    const [clickedAReplyLiked, setClickedAReplyLiked] = useState(false);
    const [AcurrentReplySorted, setAcurrentReplySorted] = useState([]); // 추가

    const handleAReplyClick = (clickedAReplyId) => {
        setClickedAReplyId(clickedAReplyId);
        fetchARGood(clickedAReplyId);
        clickARGood(clickedAReplyId);

        console.log("글 번호는 : " , id);
        console.log("댓글 번호는 : " , clickedAReplyId);
    };

    const fetchARGood = (clickedAReplyId) => {
        if (user.token !== null) {
          axios
            .get(`http://localhost:8080/getARGood/${clickedAReplyId}`, {
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
            .get(`http://localhost:8080/getARGood2/${clickedAReplyId}`)
            .then((response) => {
              if (response.status === 200) {
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
            .post(`http://localhost:8080/setARGood/${clickedAReplyId}`, null, {
              headers: { Authorization: `Bearer ${user.token}` },
            })
            .then((response) => {
              if (response.status === 200) {
                console.log("@### ", response);
                setARGood(!ARgood);
               
                /* if (!ARgood) {
                  setARGoodCount((prevARCount) => prevARCount + 1);
                } else {
                  setARGoodCount((prevARCount) => prevARCount - 1);
                }  */

                /* if (!ARgood) {
                  setARGoodCount((prevARCount) => {
                    return prevARCount + 1;
                  });
                } else {
                  setARGoodCount((prevARCount) => {
                    return prevARCount - 1;
                  });
                } */
              } 
            })
            .catch((error) => {
              console.log(error);
            });
        } else {
          alert("로그인 해주세요.");
        }
    };


    return(
        <>
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
                    <th>댓글 내용</th>
                    <th>날짜</th>
                    <th>좋아요</th>
                    <th></th>
                    </tr>
                </thead>
                <tbody>
                    {Areply.map((r, index) => (
                            
                    <tr className={styles.replyTitle} key={r._id}>
                        <td>
                        <div>
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
                            /* onClick={() => {
                                profileClick(write.writer, id);
                            }} */
                            />
                        )}
                        </div>
                        {r.Arwriter}
                        </td>
                        <td>{r.Areply}</td>
                        <td>{" "}
                        {r.ArwriteDate !== undefined &&
                        formatDate(new Date(r.ArwriteDate))}</td>


                        <td>
                            <span onClick={() => {handleAReplyClick(r._id)}}
                                className={r._id === clickedAReplyId && ARgood ? styles.ARgoodBtn : null}
                            >
                                👍 {r._id !== clickedAReplyId ? '' : ARgoodCount}
                            </span>
                        </td>

                        
                        {/* 댓글수정 */}
                        {sameAUsers[index] && (
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
                                    <td>대댓글 내용</td>
                                    <td>작성 날짜</td>
                                    </tr>
                                </thead>
                                {Ar_reply.map((rr, index) => (
                                    <tbody>
                                    <tr>
                                        <div>
                                        {!rPImg || !rPImg[index] ? (
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
                                            /* onClick={() => {
                                            profileClick(write.writer, id);
                                            }} */
                                        />
                                        )}
                                        </div>
                                        <td>{rr.Ar_rwriter}</td>
                                        <td>{rr.Ar_reply}</td>
                                        <td>{" "}{rr.Ar_rwriteDate !== undefined && formatDate(new Date(rr.Ar_rwriteDate))}</td>
                                        
                                        {/* 대댓글수정 */}
                                        {ARsameUsers[index] && (
                                        <td>
                                            <input type="button" className={styles.rrdbtn} value="삭제" onClick={() => handleARDelete(rr._id)}></input>
                                            <input 
                                            type="button" 
                                            className={styles.rrmbtn} 
                                            value="수정" 
                                            onClick={ () => {
                                                setShowARModifyReplyInput(selectedARId === rr._id ? null : rr._id);
                                                setSelectedARId(selectedARId === rr._id ? null : rr._id);
                                                modifyAR_Reply(rr._id);
                                            }}
                                            ></input>
                                            { showAR_ReplyModifyInput === rr._id && (
                                            <form onSubmit={(e) => modifyARHandleSubmit(e, rr.selectedARId, rr._id)}> 
                                                <div className={styles.handle}>
                                                
                                                    <input
                                                    type="text"
                                                    className={styles.reply_input}
                                                    value={replyARModifyInput}
                                                    onChange={modifyAR_ReplyInputChangeHandler}
                                                    />
                                                    <div className={styles.reply_choose}>
                                                    <input type="submit" value="대댓글수정"></input>
                                                    <button onClick={() => {setShowARModifyReplyInput(null); setSelectedARId(null);}}>대댓글수정 취소</button>
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
            </div>
        </>
    );
}
export default AskViewReply;