import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import styles from './AskView.module.css';
import userStore from "../../store/user.store";
import { useParams } from "react-router-dom";
import Reply from '../../server/models/reply';

function A_View() {

    const { id } = useParams();
    const user = userStore();
    const [ask, setAsk] = useState([]);
    const [htmlString, setHtmlString] = useState();
    const [sameUser, setSameUser] = useState(false);  

    const navigate = useNavigate();

    useEffect(() => {
        const fetchAsk = async () => {
          try {
            const res = await axios.get(`http://localhost:8080/getAsk/${id}`, {
              headers: { Authorization: `Bearer ${user.token}` },
            });
            if (res.data !== undefined) {
              setAsk(res.data.data[0]);
              setSameUser(res.data.sameUser);
              console.log(res.data.message);
            }
          } catch (err) {
            console.error(err);
          }
        };
        fetchAsk();
      }, [id]);

      useEffect(() => {
        if (ask.content !== undefined) {
          const contentString = JSON.stringify(ask.content); // 객체를 문자열로 변환합니다.
          const cleanedString = contentString.replace(/undefined/g, "");
          const parsedContent = JSON.parse(cleanedString); // 문자열을 JSON 객체로 변환합니다.
          const htmlString = parsedContent.content;
          setHtmlString(htmlString);
        }
      }, [ask]);
    
    return (
        <div className={styles.detail}>
            <div className={styles.content_4}>
                <div className={styles.content_4_a}>
                    <input type='button' value='목록' id='view_list_button1' onClick={() => {
                        navigate("/");
                    }}/>
                </div>
                    
                {sameUser && (
                    <div className={styles.content_4_b}>
                        <input type="button" value="삭제" />
                        <input
                            type="button"
                            value="수정"
                            onClick={() => {
                                navigate(`/reply/${id}`);
                            }}
                        />
                    </div>
                )}
            </div>

            <div className={styles.content_1}>
                <div>제목{ask.title}</div>
            </div>

            <div className={styles.content_2}>
                <div className={styles.content_2_a}>
                    <div>작성자{ask.writer}</div>
                    <div>|</div>
                    <div>날짜{ask.writeDate}</div>
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
                <div dangerouslySetInnerHTML={{ __html: htmlString }} />
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