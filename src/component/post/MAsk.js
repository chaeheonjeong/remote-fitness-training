import React, { useEffect, useState } from 'react';
import styles from './MAsk.module.css';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';


function MAsk() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const navigate = useNavigate();
    
  const titleHandler = (e) => {
    const inputTitle = e.target.value;
    setTitle(inputTitle);
  }
  const { id } = useParams();

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(`http://localhost:8080/getask/${id}`);
        setTitle(response.data.data.title);
        setContent(response.data.data.content);
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  }, [id]);

  const handleMAskmodify = async () => {
    try {
      const response = await axios.post(`http://localhost:8080/modifyAsk/${id}`, {
        title: title,
        content: content
      });
      console.log('success', response.data.message);
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };


  /*const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const response = await axios.post("http://localhost:8080/postAsk", {
          title : title,
          content : JSON.parse(JSON.stringify(content))
        });
        console.log('success' , response.data.message);
        navigate("/");
      }
     catch (error) {
      console.log(error);
    }
  };*/

  return (
    <div className={styles.ask}>
      <div className={styles.title_input}>
        <text className={styles.tt}>제목</text>
        <input onChange={titleHandler} className={styles.title_tinput} value={title} placeholder='제목을 입력하세요.'/>
      </div>
    
      <div className={styles.content}>
        <CKEditor
          editor={ClassicEditor}
          data={content}
          /*config={{
            placeholder: "내용을 입력하세요.",
          }}*/
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
        <input type='submit' value='등록' className='submit' onClick={handleMAskmodify} />
      </div>
    </div>
  );
}

export default MAsk;
