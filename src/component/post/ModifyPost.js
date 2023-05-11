import usePost from "../../hooks/usePost";
import "./Write.css";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../main/Header";

import SelectModal from "./SelectModal";

const ModifyPost = () => {
  const hook = usePost();

  const [flag, setFlag] = useState(false);
  const [modal, setModal] = useState(false);

  /* const hook2 = SelectModal({ modal, setModal }); */

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

  useEffect(() => {
    const fetchWrite = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8080/getWrite/${hook.id}`,
          {
            headers: { Authorization: `Bearer ${hook.user.token}` },
          }
        );
        if (res.data !== undefined) {
          hook.setPCondition(res.data.result[0].number);
          /* hook.setPeriodCondition(res.data.result[0].number.period); */
          hook.setStartTime(res.data.result[0].startTime);
          hook.setRunningTime(res.data.result[0].runningTime);
          hook.setEstimateAmount(res.data.result[0].estimateAmount);
          hook.setDate(res.data.result[0].date);
          hook.setTags(res.data.result[0].tag);
          hook.setTitle(res.data.result[0].title);
          hook.setContent(res.data.result[0].content);
          hook.setRecruit(res.data.result[0].recruit);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchWrite();
  }, []);

  const numberSelect = (number) => {
    if (typeof number === "number") {
      if (hook.pCondition === `${number}명`) return true;
    } else {
      if (hook.pCondition === "10명 이상") return true;
    }
    return false;
  };

  const periodSelect = (month) => {
    if (typeof month === "number") {
      if (hook.periodCondition === `${month}개월`) return true;
    } else {
      if (hook.periodCondition === "6개월 이상") return true;
    }
    return false;
  };

  const selection = () => {
    setModal(!modal);
  }

  const [recruitChange, setRecruitChange] = useState();

  const handleRecruitChange = (value) => {
    setRecruitChange(value);
    hook.setRecruit(value);
  };

  return (
    <>
    { modal && (
        <SelectModal
          modal = {modal}
          setModal = {setModal}
          onRecruitChange={handleRecruitChange}
        />
      )
    }

      <Header />
      <div className="choose">
        <button
          className={hook.recruit ? "cbtn" : "falseBtn"}
          onClick={() => {
            selection();
          }}
        >
          {hook.recruit ? "모집중" : "모집완료"}
        </button>
        <div className="ch1">
          <text className="nn">모집인원</text>

          <select
            name="number"
            className="number"
            onChange={(e) => {
              hook.setPCondition(e.target.value);
            }}
          >
            {[1, 2].map((number, index) => (
              <option
                key={number + index}
                value={typeof number === "number" ? `${number}명` : "10명 이상"}
                selected={numberSelect(number)}
              >
                {typeof number === "number" ? `${number}명` : number}
              </option>
            ))}
          </select>

          {/* <text className="ww">진행기간</text>
          <select
            name="period"
            className="period"
            onChange={(e) => {
              hook.setPeriodCondition(e.target.value);
            }}
          >
            {[1, 2, 3, 4, 5, "6개월 이상"].map((month, index) => (
              <option
                key={index}
                value={
                  typeof month === "number" ? `${month}개월` : "6개월 이상"
                }
                selected={periodSelect(month)}
              >
                {typeof month === "number" ? `${month}개월` : month}
              </option>
            ))}
          </select> */}

          <text className="ww">시작시간</text>
            <input
              type="time"
              id="startTime"
              className="startTime_input"
              onChange={(event) => {
                hook.setStartTime(event.target.value);
              }}
              defaultValue={hook.startTime}
            ></input>
        </div>

        <div className="ch2">
          {/* <text className="ss">시작예정일</text>
          <input
            type="date"
            id="date"
            className="date"
            onChange={(event) => {
              hook.setDate(event.target.value);
            }}
            defaultValue={hook.date}
          ></input> */}

            <text className="ww">예상진행시간</text>
              <input
                className="runningTime"
                onChange={(event) => {
                  hook.setRunningTime(event.target.value);
                }}
                defaultValue={hook.runningTime}
                placeholder="분 단위로 입력" 
                type="number" 
                id="runningTime" 
                name="runningTime" 
                min="0" 
                max="1440" 
                step="1"
              />

              <text className="ww">예상금액</text> 
              <input
                className="estimatedAmount_input"
                onChange={(event) => {
                  hook.setEstimateAmount(event.target.value);
                }}
                defaultValue={hook.estimateAmount}
                type="currency"
                pattern="[0-9]+"
                id="estimatedAmount" 
                name="estimatedAmount" 
                min="0"
                step="100"
              ></input> 원
        </div>

        <div className="ch3">
          <text className="ss">시작예정일</text>
          <input
            type="date"
            id="date"
            className="date"
            onChange={(event) => {
              hook.setDate(event.target.value);
            }}
            defaultValue={hook.date}
          ></input>

          <text className="tt">태그</text>
          <div>
            <input
              className="tag_input"
              onKeyPress={hook.handleKeyPress}
              type="text"
              placeholder="해시태그 입력(최대 5개)"
            />
            <div className="tag_tagPackage">
              {hook.tags !== undefined &&
                hook.tags.map((tag, index) => (
                  <span key={tag + index} className="tag_tagindex">
                    {tag}
                    <button
                      className="tag_Btn"
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
        <div className="title_input">
          <text className="cc">제목</text>
          <input
            onChange={(e) => {
              hook.setTitle(e.target.value);
            }}
            className="title_tinput"
            placeholder="제목을 입력하세요."
            defaultValue={hook.title}
          />
        </div>
        <div className="content">
          <CKEditor
            editor={ClassicEditor}
            data={hook.htmlString}
            config={{
              placeholder: "내용을 입력하세요.",
              extraPlugins: [uploadPlugin],
            }}
            /*           onReady={(editor) => {
            console.log("Editor is ready to use!", editor);
          }} */
            onChange={(e, editor) => {
              const data = editor.getData();
              hook.setContent({
                content: data,
              });
            }}
          />
        </div>

        <div className="btn">
          <input
            type="button"
            value="취소"
            className="cancel"
            onClick={() => {
              hook.navigate(`/view/${hook.id}`);
            }}
          />
          <input
            type="submit"
            value="수정"
            className="submit"
            onClick={hook.handleModify}
          />
        </div>
      </div>
    </>
  );
};

export default ModifyPost;