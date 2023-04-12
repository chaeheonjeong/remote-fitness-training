import usePost from "../../hooks/usePost";
import styles from "./Write.module.css";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import Header from "../main/Header";
import axios from "axios";
import { useState } from "react";

const Write = () => {
  const [flag, setFlag] = useState(false);
  const hook = usePost();

  const imgLink = "http://localhost:8080/images";

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
                .post("http://localhost:8080/upload", data)
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

  return (
    <>
      <Header />
      <div className={styles.choose}>
        <div className={styles.ch1}>
          <text className={styles.nn}>모집인원</text>

          <select
            name="number"
            className={styles.number}
            defaultValue="default"
            onChange={(e) => {
              hook.setPCondition(e.target.value);
            }}
          >
            <option value="default" disabled hidden>
              모집 인원 선택
            </option>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, "10명 이상"].map((number, index) => (
              <option
                key={number + index}
                value={typeof number === "number" ? `${number}명` : "10명 이상"}
              >
                {typeof number === "number" ? `${number}명` : number}
              </option>
            ))}
          </select>

          <text className={styles.ww}>진행기간</text>
          <select
            name="period"
            className={styles.period}
            defaultValue="default"
            onChange={(e) => {
              hook.setPeriodCondition(e.target.value);
            }}
          >
            <option value="default" disabled hidden>
              진행 기간 선택
            </option>
            {[1, 2, 3, 4, 5, "6개월 이상"].map((month, index) => (
              <option
                key={index}
                value={
                  typeof month === "number" ? `${month}개월` : "6개월 이상"
                }
              >
                {typeof month === "number" ? `${month}개월` : month}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.ch2}>
          <text className={styles.ss}>시작예정일</text>
          <input
            type="date"
            id="date"
            className={styles.date}
            onChange={(event) => {
              hook.setDate(event.target.value);
            }}
          ></input>
          <text className={styles.tt}>태그</text>

          <div>
            <input
              className={styles.tag_input}
              onKeyPress={hook.handleKeyPress}
              type="text"
              placeholder="해시태그 입력(최대 5개)"
            />
            <div className={styles.tag_tagPackage}>
              {hook.tags.map((tag, index) => (
                <span key={index} className={styles.tag_tagindex}>
                  {tag}
                  <button
                    className={styles.tag_Btn}
                    onClick={() => {
                      hook.setTags(hook.tags.filter((tag, i) => i !== index));
                    }}
                  >
                    &times;
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.title_input}>
         <text className={styles.cc}>제목</text>
          <input
            onChange={(e) => {
              hook.setTitle(e.target.value);
            }}
            className={styles.title_tinput}
            placeholder="제목을 입력하세요."
          />
        </div>

        <div className={styles.content}>
          <CKEditor
            editor={ClassicEditor}
            data=""
            config={{
              placeholder: "내용을 입력하세요.",
              extraPlugins: [uploadPlugin],
            }}
            onChange={(e, editor) => {
              const data = editor.getData();
              hook.setContent({
                content: data,
              });
            }}
            onBlur={(e, editor) => {
              // console.log("Blur.", editor);
            }}
            onFocus={(e, editor) => {
              // console.log("Focus.", editor);
            }}
          />
        </div>
      </div>
      <div className={styles.btn}>
        <input
          type="button"
          value="취소"
          className={styles.cancel}
          onClick={() => {
            hook.navigate("/study");
          }}
        />
        <input
          type="submit"
          value="등록"
          className={styles.submit}
          onClick={hook.handleSubmit}
        />
      </div>
    </>
  );
};

export default Write;
