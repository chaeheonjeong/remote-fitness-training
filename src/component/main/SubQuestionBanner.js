import React, { useRef, useState } from "react";
import styles from "./SubQuestionBanner.module.css";
import useSearch from "../../hooks/useSearch";

export default function SubQBanner() {
   const hook = useSearch;
    
    return(
        <div class={styles.banner}>
            <div class={styles.bannertext}>
                <h1>질문 Q&A</h1>
                <h6>평소에 궁금했던 운동 지식들을 물어보세요</h6>
            </div>
            <div className={styles.searchAndMake} onSubmit={hook.searchHandler}>
              <form className={styles.search}>
                <select onChange={hook.changeSelectHandler}>
                  <option value="title">제목</option>
                  <option value="tags">태그</option>
                  <option value="writer">작성자</option>
                </select>
                <input
                  id="searchInput"
                  name="searchInput"
                  value={hook.searchInput}
                  onChange={hook.searchInputHandler}
                  placeholder="검색어를 입력하세요"
                />
                <button type="submit">검색</button>
              </form>
            </div>
        </div>
    );
}