import React, { useEffect, useState } from 'react';
import './View.css';


function View() {
   
    const [progress, setProgress] = useState(false);

    const [BtnColorRed, setBtnColorRed] = useState(false);

    const [showReplyInput, setShowReplyInput] = useState(false);
    const [showReplyList, setShowReplyList] = useState(false);

    const handleShowReplyInput = () => {
        setShowReplyInput(!showReplyInput);
        //setShowReplyList(false); // 대댓글 입력 칸을 보여주면서 대댓글 목록도 함께 보여줌
    }

    const handleHideReplyInput = () => {
        setShowReplyInput(false);
        setShowReplyList(false);
    }

    const handleShowReplyList = () => {
        setShowReplyList(true);
        setShowReplyInput(showReplyInput); // 대댓글 입력 칸을 보여주면서 대댓글 목록도 함께 보여줌
    }

    const handleHideReplyList = () => {
        setShowReplyInput(false);
        setShowReplyList(false);
    }

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
    return (
        <div className='detail'>
            <div className='content_4'>
                <div className='content_4_a'>
                    <div>
                        <button className={progress ? "falseBtn" : "cbtn"} onClick={() => {
                            setProgress(!progress);
                            setBtnColorRed(!BtnColorRed);
                        }}>
                            {progress ? "모집완료" : "모집중"}
                            {/* <cbtn style={progress ? {color:'green'} : {color:'red'}}></cbtn> */}
                        </button>
                    </div>                    
                </div>
                    
                <div className='content_4_b'>
                    <input type='button' value='삭제'/>
                    <input type='button' value='수정'/>
                    
                </div>
            </div>

            <div className='content_1'>
                <div>제목</div>
            </div>

            <div className='content_2'>
                <div className='content_2_a'>
                    <div>작성자</div>
                    <div>|</div>
                    <div>날짜</div>
                </div>
                <div className='content_2_c'>
                    <div></div>
                </div>
                <div className='content_2_b'>
                    <div></div>
                </div>
            </div>

            <div className='content_5'>
                <div className='content_5_a'>
                    <div>모집인원</div>
                    <div>시작 예정일</div>
                </div>
                <div className='content_5_b'>
                    <div>진행기간</div>
                    <div>태그</div>
                </div>
            </div>

            <div className='content_3'>
                <div>내용</div>
            </div>

            <div className='content_6'>
            
                <input type='text' className='reply_input' placeholder='댓글 내용을 입력해주세요.' />
                <div className='reply_choose'>
                    <input type='checkbox'></input>
                    <text className='rc1'>비밀댓글</text>
                    <input type='button' className='sbtn' value='등록'></input>
                </div>
               
            </div>
            <div className='rr_reply'>
                <table>
                    <thead>
                        <tr className='replyName'>
                            <th> </th>
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
                                <input type="button" className='rdbtn' value="삭제"></input>
                                <input type="button" className='rmbtn' value="수정"></input>
                            </th>
                        </tr>
                        <tr className='replyContent'>
                            
                                {!showReplyInput && (
                                    <button onClick={handleShowReplyInput}>대댓글 추가</button>
                                )}
                                {showReplyInput && (
                                    <>
                                    <input type='text' className='reply_input' placeholder='대댓글 내용을 입력해주세요.' />
                                    <div className='reply_choose'>
                                        <input type='checkbox'></input>
                                        <text className='rc1'>비밀 대댓글</text>
                                        <button onClick='/'>대댓글 등록</button>
                                        

                                        <button onClick={handleHideReplyInput}>대댓글 작성 취소</button>
                                    </div>
                                    </>
                                )}

                                {!showReplyList && (
                                    <button onClick={handleShowReplyList}>대댓글 목록 보기</button>
                                )}
                                {showReplyList && (
                                    <div className='rr_reply'>
                                        <div>
                                            {/* 대댓글 목록 보여주는 코드 */}
                                        </div>
                                        <div>
                                            <button onClick={handleHideReplyList}>대댓글 목록 닫기</button>

                                        </div>
                                                                                
                                    </div>
                                    
                                    
                                )}
                                
                                
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