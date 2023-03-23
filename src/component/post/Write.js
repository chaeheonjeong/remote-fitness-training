import React, { useEffect, useState } from 'react';
import './Write.css';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


function Write() {

  const [title, setTitle] = useState('');

  const [content, setContent] = useState('');

  const [date, setDate] = useState(new Date());

  const handleSelectDate = (date) => {
    setDate(date);
  }

  const [tags, setTags] = useState([]);

  const [render , setRender] = useState('');


	const send = () => {
    setRender(title);
    setTitle('');
  }

  const navigate = useNavigate();
    
  const titleHandler = (e) => {
    const inputTitle = e.target.value;
    setTitle(inputTitle);
  }

  const [periodCondition, setPeriodCondition] = useState({
    num1 : '1개월',
    num2 : '2개월',
    num3 : '3개월',
    num4 : '4개월',
    num5 : '5개월',
    num6 : '6개월 이상',

  });

  const periodChange = (e) => {
    setPCondition(e.target.value);
  }


  const [pCondition, setPCondition] = useState({
    p1 : '1명',
    p2 : '2명',
    p3 : '3명',
    p4 : '4명',
    p5 : '5명',
    p6 : '6명',
    p7 : '7명',
    p8 : '8명',
    p9 : '9명',
    p10 : '10명 이상',

  });
  const pChange = (e) => {
    setPCondition(e.target.value);
  }

  
  function handleKeyPress(event) {
    if(event.key === 'Enter') {
        const newTag = event.target.value.trim();

        if(tags.length < 5) {

            if(newTag !== '') {
                setTags([...tags, newTag]);
                event.target.value = '';
            }
        } else {
            alert('태그는 최대 5개까지 가능합니다.');
        }
    }
  }

  function handleDelete(index) {
      setTags(tags.filter((tag, i) => i !== index));
  }

  /*const createPost = () => {
    if(postInfo.number === "") postInfo.number ="";
    if(postInfo.period === "") postInfo.period ="";
    if(postInfo.date === "") postInfo.date ="";
    if(postInfo.tag === "") postInfo.tag ="";
    if(postInfo.title === "") postInfo.title = "";
    if(postInfo.content === "") postInfo.content = "";
    axios.post('http://localhost:8080/postwrite',{postInfo})
    .then(res => {
      console.log(res);
      alert('글쓰기가 완료되었습니다.');
      
    })
    .catch(e => console.error(e))
  };*/



  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
        const response = await axios.post("http://localhost:8080/postwrite", {
          number: pCondition,
          period: periodCondition,
          date: date,
          tag : tags,
          title : title,
          content : content
        });
        console.log('success' ,response.date);
        /*navigate("/");*/
      }
     catch (error) {
      console.log(error);
    }
  };


  


  /*const [postInfo, setPostInfo] = useState( {
    number: null,
    period: null,
    date: null,
    tag : null,
    title : null,
    content : null
  });*/


  /*async function handleSubmit(e) {
    e.preventDefault();
    await createPost();
  };*/


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
        <input type='date' id='date' className='date' onChange={handleSelectDate}/> 
        
        <text className='tt'>태그</text>

        <div>
          <input
            className='tag_input'
            onKeyPress={handleKeyPress}
            type="text"
            placeholder="해시태그 입력(최대 5개)"
          />
          <div className='tag_tagPackage'>
            {tags.map((tag, index) => (
              <span key={index} className='tag_tagindex'>
                {tag}
                <button 
                  className='tag_Btn'
                  onClick={() => handleDelete(index)}
                >
                  &times;
                </button>
              </span>
            ))}
          </div>

        </div>


      </div>

      <div className='title_input'>
        <text className='cc'>제목</text>
        <input onChange={titleHandler} className='title_tinput' value={title} placeholder='제목을 입력하세요.'/>
      </div>
      <div className='render_title'>
        {render}
   	  </div>


      <div className='content'>
        <CKEditor
          editor={ClassicEditor}
          data=""
          config={{
            placeholder: "내용을 입력하세요.",
          }}
          onReady={(editor) => {
            // You can store the "editor" and use when it is needed.
            console.log('Editor is ready to use!', editor);
          }}
          onChange={(event, editor) => {
            const data = editor.getData();
            console.log({ event, editor, data });
            setContent({
              content : data
            })
           
            /*setPostInfo({
              ...postInfo,
              contents: data
            })*/
            //console.log(data/*postInfo*/);
          }}
  
          onBlur={(event, editor) => {
            console.log('Blur.', editor);
          }}
          onFocus={(event, editor) => {
            console.log('Focus.', editor);
          }}
        />
      
      </div>

      <div className='btn'>
        <input type='button' value='취소' className='cancel' />
        <input type='submit' value='등록' className='submit' onClick={handleSubmit} />
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

/*
<input type='text' onKeyPress={handleKeyPress} maxLength='20' className='tag_input' name='tag' placeholder='태그를 입력하세요.' />
<textarea onKeyPress={handleKeyPress}  className='tag_input' name='tag' placeholder='태그를 입력하세요.'/>*/

