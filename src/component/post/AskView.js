import React, { useEffect, useState } from 'react';
import './AskView.css';

function A_View() {
    
    return (
        <div className='detail'>
            <div className='content_4'>
                <div className='content_4_a'>
                    <input type='button' value='목록' id='view_list_button1' />
                </div>
                    
                <div className='content_4_b'>
                    <input type='button' value='수정'/>
                    <input type='button' value='삭제'/>
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
                                <input type="button" className='rrbtn' value="답장"></input>
                                <input type="button" className='rdbtn' value="삭제"></input>
                                <input type="button" className='rmbtn' value="수정"></input>
                            </th>
                           

                        </tr>
                    </tbody>
                </table>
            </div>

        </div>
    );
}

export default A_View;

/*


<input type='number' id='number' classname='number'></input>
<input type='button' value='취소' id='cancel' className='cancel' onClick={onReset}/>

*/