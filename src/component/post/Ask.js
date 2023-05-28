import styles from "./Ask.module.css";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "../main/Header";
import userStore from "../../store/user.store";
import { useState } from "react";
import { BASE_API_URI } from "../../util/common";

function Ask() {
  const today = new Date();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState([]);
  const [flag, setFlag] = useState(false);
  const navigate = useNavigate();
  const user = userStore();

  const imgLink = `${BASE_API_URI}/images`;

  const customUploadAdapter = (loader) => {
    // (2)
    return {
      upload() {
        return new Promise((resolve, reject) => {
          loader.file.then((file) => {
            // 이미지 리사이징 및 압축
            compressImage(file, 800, 800).then((compressedFile) => {
              const data = new FormData();
              data.append("name", file.name);
              data.append("file", compressedFile);

              axios
                .post(`${BASE_API_URI}/upload`, data)
                .then((res) => {
                  if (!flag) {
                    setFlag(true);
                  }
                  resolve({
                    default: `${imgLink}/${res.data.filename}`,
                  });
                  console.log(`${imgLink}/${res.data.filename}`);
                })
                .catch((err) => reject(err));
            });
          });
        });
      },
    };
  };

  function uploadPlugin(editor) {
    // (3)
    editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
      return customUploadAdapter(loader);
    };
  }

  const compressImage = (file, maxWidth, maxHeight) => {
    return new Promise((resolve, reject) => {
      const image = new Image();
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      image.onload = function () {
        let width = image.width;
        let height = image.height;
        let newWidth = width;
        let newHeight = height;

        // 이미지 크기 조정
        if (width > maxWidth) {
          newWidth = maxWidth;
          newHeight = (height * maxWidth) / width;
        }
        if (newHeight > maxHeight) {
          newHeight = maxHeight;
          newWidth = (newWidth * maxHeight) / newHeight;
          newHeight = maxHeight;
        }

        canvas.width = newWidth;
        canvas.height = newHeight;

        // 이미지 압축
        ctx.drawImage(image, 0, 0, newWidth, newHeight);
        canvas.toBlob(
          (blob) => {
            resolve(blob);
          },
          file.type,
          0.7
        );
      };

      image.onerror = (e) => {
        reject(e);
      };

      image.src = URL.createObjectURL(file);
    });
  };

  const titleHandler = (e) => {
    const inputTitle = e.target.value;
    setTitle(inputTitle);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (title === "") alert("제목을 작성해주세요.");
    else if (content === "") alert("내용을 작성해주세요.");
    else if (user.token !== null) {
      try {
        const response = await axios.post(
          `${BASE_API_URI}/postAsk`,
          {
            title: title,
            content: JSON.parse(JSON.stringify(content)),
            tag: tags,
            writer: user.name,
            writeDate: today,
          },
          {
            headers: { Authorization: `Bearer ${user.token}` },
          }
        );
        console.log("success", response.data.message);
        navigate("/question");
      } catch (error) {
        console.log(error);
      }
    }
  };

  function handleKeyPress(e) {
    if (e.key === "Enter") {
      const newTag = e.target.value.trim();

      if (tags.length < 5) {
        if (newTag !== "") {
          setTags([...tags, newTag]);
          e.target.value = "";
        }
      } else {
        alert("태그는 최대 5개까지 가능합니다.");
      }
    }
  }

  return (
    <>
      <Header />
      <div className={styles.ask}>
        <div className={styles.title_input}>
          <text className={styles.tt}>제목</text>
          <input
            onChange={titleHandler}
            className={styles.title_tinput}
            value={title}
            placeholder="제목을 입력하세요."
          />
        </div>
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
                  onClick={() => {
                    setTags(tags.filter((tag, i) => i !== index));
                  }}
                >
                  &times;
                </button>
              </span>
            ))}
          </div>

          <div className={styles.content}>
            <CKEditor
              editor={ClassicEditor}
              data=""
              config={{
                placeholder: "내용을 입력하세요.",
                extraPlugins: [uploadPlugin],
              }}
              /*             onReady={(editor) => {
              // You can store the "editor" and use when it is needed.
              console.log("Editor is ready to use!", editor);
            }} */
              onChange={(e, editor) => {
                const data = editor.getData();
                console.log({ e, editor, data });
                setContent({
                  content: data,
                });
              }}
              /*             onBlur={(e, editor) => {
              console.log("Blur.", editor);
            }}
            onFocus={(e, editor) => {
              console.log("Focus.", editor);
            }} */
            />
          </div>

          <div className={styles.btn}>
            <input
              type="button"
              value="취소"
              className={styles.cancel}
              onClick={() => {
                navigate("/question");
              }}
            />
            <input
              type="submit"
              value="등록"
              className={styles.submit}
              onClick={handleSubmit}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default Ask;
