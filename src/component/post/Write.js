import usePost from "../../hooks/usePost";
import "./Write.css";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import Header from "../main/Header";
import axios from "axios";

const Write = () => {
  const hook = usePost();

  return (
    <>
      <Header />
      <div className="choose">
        <div className="ch1">
          <text className="nn">모집인원</text>

          <select
            name="number"
            className="number"
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

          <text className="ww">진행기간</text>
          <select
            name="period"
            className="period"
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

        <div className="ch2">
          <text className="ss">시작예정일</text>
          <input
            type="date"
            id="date"
            className="date"
            onChange={(event) => {
              hook.setDate(event.target.value);
            }}
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
              {hook.tags.map((tag, index) => (
                <span key={index} className="tag_tagindex">
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
          />
        </div>

        <div className="content">
          <CKEditor
            editor={ClassicEditor}
            data=""
            config={{
              placeholder: "내용을 입력하세요.",
              ckfinder: {
                // 이미지 업로드 설정
                uploadUrl: "/upload",
                options: {
                  resourceType: "Images",
                  multiple: false,
                  formats: ["jpg", "jpeg", "png", "gif"],
                },
                // 이미지 탭 삽입 이벤트
                onInsert: (data) => {
                  const images = data.data;
                  const imageUrl = images.default.attributes.src;
                  // 서버로 이미지 파일 경로 전송
                },
              },
            }}
            onChange={(e, editor) => {
              const data = editor.getData();
              console.log({ e, editor, data });
              hook.setContent({
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
              hook.navigate("/study");
            }}
          />
          <input
            type="submit"
            value="등록"
            className="submit"
            onClick={hook.handleSubmit}
          />
        </div>
      </div>
    </>
  );
};

export default Write;
