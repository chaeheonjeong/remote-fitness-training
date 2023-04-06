import React, { useEffect, useState } from "react";
import "./Ask.css";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Ask() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const navigate = useNavigate();

  const titleHandler = (e) => {
    const inputTitle = e.target.value;
    setTitle(inputTitle);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8080/postAsk", {
        title: title,
        content: JSON.parse(JSON.stringify(content)),
      });
      console.log("success", response.data.message);
      navigate("/question");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="ask">
      <div className="title_input">
        <text className="cc">제목</text>
        <input
          onChange={titleHandler}
          className="title_tinput"
          value={title}
          placeholder="제목을 입력하세요."
        />
      </div>

      <div className="content">
        <CKEditor
          editor={ClassicEditor}
          data=""
          config={{
            placeholder: "내용을 입력하세요.",
          }}
          onReady={(editor) => {
            // You can store the "editor" and use when it is needed.
            console.log("Editor is ready to use!", editor);
          }}
          onChange={(e, editor) => {
            const data = editor.getData();
            console.log({ e, editor, data });
            setContent({
              content: data,
            });
          }}
          onBlur={(e, editor) => {
            console.log("Blur.", editor);
          }}
          onFocus={(e, editor) => {
            console.log("Focus.", editor);
          }}
        />
      </div>

      <div className="btn">
        <input
          type="button"
          value="취소"
          className="cancel"
          onClick={() => {
            navigate("/question");
          }}
        />
        <input
          type="submit"
          value="등록"
          className="submit"
          onClick={handleSubmit}
        />
      </div>
    </div>
  );
}

export default Ask;
