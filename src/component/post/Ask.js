import React, { useEffect, useState } from 'react';
import './Ask.css';

import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";



function Ask() {

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

  const [postInfo, setPostInfo] = useState( {
    title: null,
    contents: null,
    postnum: null,
    writer: sessionStorage.getItem('nickName'),
    tag: null,
    watching: null
  });


  return (
    <div className='body'>
    <div className='ask'>
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
            setPostInfo({
              ...postInfo,
              contents: data
            })
            console.log(postInfo);
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
        <input type='submit' value='등록' className='submit' />
      </div>

    </div>
    </div>
  );
}

export default Ask;
