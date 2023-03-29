import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './AskView.module.css';

function A_View() {

    const navigate = useNavigate();
    
    return (
        <div className={styles.detail}>
            <div className={styles.content_4}>
                <div className={styles.content_4_a}>
                    <input type='button' value='목록' id='view_list_button1' onClick={() => {
                        navigate("/");
                    }}/>
                </div>
                    
                <div className={styles.content_4_b}>
                    <input type='button' value='수정'/>
                    <input type='button' value='삭제'/>
                </div>
            </div>

            <div className={styles.content_1}>
                <div>제목</div>
            </div>

            <div className={styles.content_2}>
                <div className={styles.content_2_a}>
                    <div>작성자</div>
                    <div>|</div>
                    <div>날짜</div>
                </div>
                <div className={styles.content_2_c}>
                    <div></div>
                </div>
                <div className={styles.content_2_b}>
                    <div></div>
                </div>
            </div>

            <div className={styles.content_3}>
                <div>내용</div>
            </div>

            <div className={styles.content_6}>
                <input type='text' className={styles.reply_input} placeholder='댓글 내용을 입력해주세요.' />
                <div className={styles.reply_choose}>
                    <input type='checkbox'></input>
                    <text className={styles.rc1}>비밀댓글</text>
                    <input type='button' className={styles.sbtn} value='등록'></input>
                </div>                
            </div>

         
            <div className={styles.rr_reply}>
                <table>
                    <thead>
                        <tr className={styles.replyName}>
                            <th></th>
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
                            <th>
                                <input type="button" className={styles.rrbtn} value="답장"></input>
                                <input type="button" className={styles.rdbtn} value="삭제"></input>
                                <input type="button" className={styles.rmbtn} value="수정"></input>
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