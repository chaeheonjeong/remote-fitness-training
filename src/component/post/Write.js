import usePost from "../../hooks/usePost";
import styles from "./Write.module.css";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import Header from "../main/Header";
import axios from "axios";
import { useState } from "react";
import { BASE_API_URI } from "../../util/common";

const Write = () => {
  const [flag, setFlag] = useState(false);
  const hook = usePost();

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

  return (
    <>
      <Header />
      <div className={styles.all}>
      <div className={styles.choose}>
        <div className={styles.write_title}>강사 모집글 작성</div>
        <hr />
        
        <div className={styles.select}>
          <div className={styles.left}>
            <div className={styles.recruit_num}>
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
                {[1].map((number, index) => (
                  <option
                    key={number + index}
                    value={typeof number === "number" ? `${number}명` : "10명 이상"}
                  >
                    {typeof number === "number" ? `${number}명` : number}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.running_time}>
              <text className={styles.ww}>예상진행시간</text>
              <input
                className={styles.runningTime}
                onChange={(event) => {
                  hook.setRunningTime(event.target.value);
                }}
                placeholder="분 단위로 입력" 
                type="number" 
                id="runningTime" 
                name="runningTime" 
                min="0" 
                max="1440" 
                step="1"
              />
            </div>
            
            <div className={styles.start_date}>
              <text className={styles.ss}>시작예정일</text>
              <input
                type="date"
                id="date"
                className={styles.date}
                onChange={(event) => {
                  hook.setDate(event.target.value);
                }}
              ></input>
            </div>
          </div>

          <div className={styles.right}>
            <div className={styles.start_time}>
              <text className={styles.ww}>시작시간</text>
              <input
                type="time"
                id="startTime"
                className={styles.startTime_input}
                onChange={(event) => {
                  hook.setStartTime(event.target.value);
                }}
              ></input>
            </div>

            <div className={styles.pay}>
              <text className={styles.ww}>예상금액 (원)</text> 
              <input
                className={styles.estimatedAmount_input}
                onChange={(event) => {
                  hook.setEstimateAmount(event.target.value);
                }}
                type="currency"
                pattern="[0-9]+"
                id="estimatedAmount" 
                name="estimatedAmount" 
                min="0"
                step="100"
              ></input>
            </div>

            <div className={styles.tags}>
              <text className={styles.tt}>태그</text>
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
          </div>

      <hr />
        
        <div className={styles.ch3}>
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

                <div className={styles.btn}>
                  <input
                    type="button"
                    value="취소"
                    className={styles.cancel}
                    onClick={() => {
                      hook.navigate("/");
                    }}
                  />
                  <input
                    type="submit"
                    value="신청"
                    className={styles.submit}
                    onClick={hook.handleSubmit}
                  />
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default Write;
