import React, { useEffect, useState } from 'react';
import './Write.css';

function Write() {

  const [title,setTitle] = useState('');
  const [render , setRender] = useState('');
	const send = () => {
    setRender(title);
    setTitle('');
  }
    
  const titleHandler = (e) => {
    const inputTitle = e.target.value;
    setTitle(inputTitle);
  }

  const [periodCondition, setPeriodCondition] = useState({
    num1 : null,
    num2 : null,
    num3 : null,
    num4 : null,
    num5 : null,
    num6 : null,
    num7 : null,
    num8 : null,
    num9 : null,
    num10 : null,
    num11 : null,
    num12 : null,
  });

  const periodChange = (e) => {
    setPCondition(e.target.value);
  }


  const [pCondition, setPCondition] = useState({
    p1 : null,
    p2 : null,
    p3 : null,
    p4 : null,
    p5 : null,
    p6 : null,
    p7 : null,
    p8 : null,
    p9 : null,
    p10 : null,
    p11 : null,
    p12 : null,
  });
  const pChange = (e) => {
    setPCondition(e.target.value);
  }


  return (
    <div className='choose'>
      <div className='ch1'>
        <text className='nn'>모집인원</text>
        
        <select name="number" className="number" onChange={pChange}>
          <option value="명">명</option>
          <option value={pCondition.p1}>1명</option>
          <option value={pCondition.p2}>2명</option>
          <option value={pCondition.p3}>3명</option>
          <option value={pCondition.p4}>4명</option>
          <option value={pCondition.p5}>5명</option>
          <option value={pCondition.p6}>6명</option>
          <option value={pCondition.p7}>7명</option>
          <option value={pCondition.p8}>8명</option>
          <option value={pCondition.p9}>9명</option>
          <option value={pCondition.p11}>10명 이상</option>

        </select>
        <text className='ww'>진행기간</text>
        <select name="period" className="period" onChange={periodChange}>
          <option value="개월">개월</option>
          <option value={periodCondition.num1}>1개월</option>
          <option value={periodCondition.num2}>2개월</option>
          <option value={periodCondition.num3}>3개월</option>
          <option value={periodCondition.num4}>4개월</option>
          <option value={periodCondition.num5}>5개월</option>
          <option value={periodCondition.num6}>6개월 이상</option>
         
        </select>
      </div>

      <div className='ch2'>
        <text className='ss'>시작예정일</text>
        <input type='date' id='date' className='date' /> 
        
        <text className='tt'>태그</text>
        <input type='text' maxLength='20' className='tag_input' name='tag' placeholder='태그를 입력하세요.' />

      </div>

      <div className='title_input'>
        <text className='cc'>제목</text>
        <input onChange={titleHandler} className='title_tinput' value={title} placeholder='제목을 입력하세요.'/>
      </div>
      <div className='render_title'>
        {render}
   	  </div>


      <div className='content'>
        ckeditor
      </div>

      <div className='btn'>
        <input type='button' value='취소' className='cancel' />
        <input type='submit' value='등록' className='submit' />
      </div>

    </div>
  );
}

export default Write;

/*


<input type='number' id='number' classname='number'></input>
<input type='button' value='취소' id='cancel' className='cancel' onClick={onReset}/>
<input type='text' maxLength='30' className='title_input' name='title' placeholder='제목을 작성해주세요.' />



<option value={periodCondition.num6}>6개월</option>
          <option value={periodCondition.num7}>7개월</option>
          <option value={periodCondition.num8}>8개월</option>
          <option value={periodCondition.num9}>9개월</option>
          <option value={periodCondition.num10}>10개월</option>
          <option value={periodCondition.num11}>11개월</option>
          <option value={periodCondition.num12}>12개월</option>
          
<option value={pCondition.p10}>10명</option>
          <option value={pCondition.p11}>11명</option>
          <option value={pCondition.p12}>12명</option>

*/