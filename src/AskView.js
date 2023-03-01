import React, { useEffect, useState } from 'react';
import './AskView.css';
import dummy from "./data.json";

function A_View() {
    const text=1;
    const pList = dummy.titles.filter(titlecontent => (titlecontent.text === text));

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

        </div>
    );
}

export default A_View;

/*


<input type='number' id='number' classname='number'></input>
<input type='button' value='취소' id='cancel' className='cancel' onClick={onReset}/>

*/