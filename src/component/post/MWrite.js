import React, { useEffect, useState } from 'react';
import styles from './MWrite.module.css';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';


function MWrite() {

  const [title, setTitle] = useState('');

  const [content, setContent] = useState('');

  const [date, setDate] = useState(new Date());

  const handleSelectDate = (date) => {
    setDate(date);
  }

  const [tags, setTags] = useState([]);


  

  const { id } = useParams();
  console.log(id);

  const [write, setWrite] = useState([]);

  useEffect(() => {
    const fetchWrite = async () => {
        try{
            const res = await axios.get(`http://localhost:8080/getwrite/${(id)}` );
            setWrite(res.data.data.map(({ _id, number, period, date, tag, title, content }) => ({ _id, number, period, date, tag, title, content })));
            console.log(res.data.message);
        }catch(err){
            console.error(err);
            console.log(id);
        }
    };
    fetchWrite();
  }, [id]);




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
    setPeriodCondition(e.target.value);
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

  
  function handleKeyPress(e) {
    if(e.key === 'Enter') {
        const newTag = e.target.value.trim();

        if(tags.length < 5) {

            if(newTag !== '') {
                setTags([...tags, newTag]);
                e.target.value = '';
            }
        } else {
            alert('태그는 최대 5개까지 가능합니다.');
        }
    }
  }

  function handleDelete(index) {
      setTags(tags.filter((tag, i) => i !== index));
  }


  const handleModify = async (e) => {
    e.preventDefault();
    try {
        const response = await axios.post(`http://localhost:8080/updatewrite/${(id)}`, {
          number: pCondition,
          period: periodCondition,
          date: String(date),
          tag : tags,
          title : title,
          content : JSON.parse(JSON.stringify(content))
        });
        alert('해당 게시글이 수정되었습니다.');
        console.log('success' , response.data.message);
        navigate("/");
      }
     catch (error) {
      console.log(error);
    }
  };


  return (
    <div className={styles.choose}>
      <div className={styles.ch1}>
        <text className={styles.nn}>모집인원</text>
        
        <select name="number" className={styles.number} onChange={pChange}>
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
        <text className={styles.ww}>진행기간</text>
        <select name="period" className={styles.period} onChange={periodChange}>
          <option value="개월">개월</option>
          <option value={periodCondition.num1}>1개월</option>
          <option value={periodCondition.num2}>2개월</option>
          <option value={periodCondition.num3}>3개월</option>
          <option value={periodCondition.num4}>4개월</option>
          <option value={periodCondition.num5}>5개월</option>
          <option value={periodCondition.num6}>6개월 이상</option>
        </select>
      </div>

      <div className={styles.ch2}>
        <text className={styles.ss}>시작예정일</text>
        <input type='date' id='date' className={styles.date} onChange={handleSelectDate}/> 
        
        <text className={styles.tt}>태그</text>

        <div>
          <input
            className={styles.tag_input}
            onKeyPress={handleKeyPress}
            type="text"
            placeholder="해시태그 입력(최대 5개)"
          />
          <div className={styles.tag_tagPackage}>
            {tags.map((tag, index) => (
              <span key={index} className={styles.tag_tagindex}>
                {tag}
                <button 
                  className={styles.tag_Btn}
                  onClick={() => handleDelete(index)}
                >
                  &times;
                </button>
              </span>
            ))}
          </div>

        </div>


      </div>

      <div className={styles.title_input}>
        <text className={styles.tt}>제목</text>
        <input onChange={titleHandler} className={styles.title_tinput} value={title} placeholder='제목을 입력하세요.'/>
      </div>
    

      <div className={styles.content}>
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
          onChange={(e, editor) => {
            const data = editor.getData();
            console.log({ e, editor, data });
            setContent({
              content : data
            })
           
          
          }}
  
          onBlur={(e, editor) => {
            console.log('Blur.', editor);
          }}
          onFocus={(e, editor) => {
            console.log('Focus.', editor);
          }}
        />
      
      </div>

      <div className={styles.btn}>
        <input type='button' value='취소' className='cancel' />
        <input type='submit' value='수정' className='submit' onClick={handleModify} />
      </div>

    </div>
  );
}

export default MWrite;
