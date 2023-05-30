import React, { useRef, useState } from "react";
import styles from "./SubBanner.module.css";
import useSearch from "../../hooks/useSearch";

export default function SubSBanner() {
   const hook = useSearch;
    
    return(
        <div class={styles.banner}>
            <div class={styles.bannertext}>
                <h1>학생 모집</h1>
                <h6>수업을 재밌게 즐길 수 있는 학생들을 구해보세요</h6>
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