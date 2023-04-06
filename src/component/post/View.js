import React, { useEffect, useState } from "react";
import styles from "./View.module.css";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import userStore from "../../store/user.store";

function View() {
  const { id } = useParams();
  const { rid } = useParams();
  const user = userStore();
  const [write, setWrite] = useState([]);
  const [htmlString, setHtmlString] = useState();
  const [sameUser, setSameUser] = useState(false);

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


  const [reply, setReply] = useState([]);
  
  const [isSecret, setIsSecret] = useState(false); // 비밀댓글 여부
  const [sameUsers, setSameUsers] = useState(false);
  const [postId, setPostId] = useState(); 

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

  const handlePodastClick = (postId) => {
    setPostId(postId);
  };

  const navigate = useNavigate();

  const replyHandler = (e) => {
    setReply(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { reply, isSecret };
    
    console.log(data);
    try {
      const response = await axios.post(`http://localhost:8080/postreply/${id}`, {
        reply: String(reply),
        isSecret : Boolean(isSecret),
      }, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      console.log(typeof isSecret);
      
      
      console.log(typeof data);
      //console.log(res.data.datas);
      console.log("success", response.data.message);
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  const [r_reply, setR_Reply] = useState([]);
  const [isRSecret, setIsRSecret] = useState(false); // 비밀댓글 여부

  const rhandleSubmit = async (e) => {
    e.preventDefault();
    const data = { r_reply, isRSecret };
    console.log(data);
    try {
      const response = await axios.post(`http://localhost:8080/postr_reply/${id}`, {
        r_reply: String(r_reply),
        isRSecret : Boolean(isRSecret),
      }, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      console.log(typeof isRSecret);
      
      
      console.log(typeof data);
      //console.log(res.data.datas);
      console.log("success", response.data.message);
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  const replyRHandler = (e) => {
    setR_Reply(e.target.value);
  };

  
  return (
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
            <input type="button" value="삭제" />
            <input
              type="button"
              value="수정"
              onClick={() => {
                navigate(`/write/${id}`);
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
          {/* <div>태그{String(write?.tag)}</div> */}
        </div>
      </div>
      <div className={styles.content_3}>
        <div>내용</div>
        <div dangerouslySetInnerHTML={{ __html: htmlString }} />
      </div>
      {/* 댓글 입력 폼 */}
      <form onSubmit={handleSubmit}>
        <div className={styles.content_6}>
          <input
            type="text"
            className={styles.reply_input}
            placeholder="댓글 내용을 입력해주세요."
            value={reply}
            onChange={replyHandler}
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
              <td></td>
              <td>{r.isSecret ? "비밀댓글" : "공개댓글"}</td>
              <td>{r.reply}</td>
              <td>{r.createdAt}</td>
              {sameUsers && (
                <td>
                  <input type="button" className={styles.rdbtn} value="삭제"></input>
                  <input type="button" className={styles.rmbtn} value="수정"></input>
                </td>
              )}

              <td>
              {!showReplyInput && (
                <button onClick={handleShowReplyInput}>대댓글 추가</button>
              )}

              {showReplyInput && (
                <form onSubmit={rhandleSubmit}> 
                  <div className={styles.rhandle}>
                  
                    <input
                      type="text"
                      className={styles.reply_input}
                      placeholder="대댓글 내용을 입력해주세요."
                      value={r_reply}
                      onChange={replyRHandler}
                    />
                    <div className={styles.reply_choose}>
                      <input type="checkbox" checked={isRSecret} className={styles.secret} onChange={(e) => setIsRSecret(e.target.checked)}></input>
                      <text className={styles.rc1}>비밀 대댓글</text>
                      <input type="submit" value="대댓글 등록"></input>
                      <button onClick={handleHideReplyInput}>대댓글 작성 취소</button>
                    </div>
                  </div>
                </form>
                
              )}

              {!showReplyList && (
                <button onClick={handleShowReplyList}>대댓글 목록 보기</button>
              )}
              </td>

            </tr>
          ))}
    
            <tr className={styles.replyContent}>
              <td>
              
              {showReplyList && (
                <tr className={styles.replyContent}>
                  <td colSpan={10}>
                    <div className={styles.rr_reply}>
                      <div>{/* 대댓글 목록 보여주는 코드 */}</div>
                      <div>
                        <button onClick={handleHideReplyList}>
                          대댓글 목록 닫기
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default View;

/*


<input type='number' id='number' classname='number'></input>
<input type='button' value='취소' id='cancel' className='cancel' onClick={onReset}/>
<input type='button' value='모집중' id='view_list_button1' />
<input type={text} />

*/

/*
{!showReplyList && ( <button onClick={handleShowReplyList}>대댓글 등록</button>)}
                                        {showReplyList && (
                                            <div className='rr_reply'>
                                            {/* 대댓글 목록 보여주는 코드 }
                                            </div>
                                        )}

*/
/*
<input type="button" className='rrbtn' value="답장"></input>*/

/*
    const [local, setLocal] = useState([])

    const dispatch = useDispatch()
    const comments = useSelector(state => state.comment)
    const [commentValue, setCommentValule] = useState('')
    const [text1, setText1] = useState('')
    const [display, setDisplay] = useState(false)
    const onSubmit = (e) => {
        e.preventDefault();
        setCommentValule(text1)
        let data = {
            content: text1,
            writer: 'jamong',
            postId: '123123',
            responseTo: 'root',
            commentId: uuid()
        }
        //dispatch(addComment(data))

        setText1('')
    }
    useEffect(() => {
        localStorage.setItem('reply', JSON.stringify(comments))
        setLocal(comments.filter(comment => comment.responseTo === 'root'))
    }, [comments])

*/