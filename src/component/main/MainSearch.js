<div className={mainStyles.menu}>
    <div className={mainStyles.select}>
        <Link to="/"><button className={mainStyles.openStudy}>오픈스터디</button></Link>
        <Link to="/study"><button className={mainStyles.study}>스터디</button></Link>
        <Link to="/question"><button className={mainStyles.question}>질문</button></Link>
    </div>

    <form className={mainStyles.search}>
        <select>
            <option>제목</option>
            <option>태그</option>
            <option>작성자</option>
        </select>
        <input />
        <button>검색</button>
    </form>
    <button onClick={() => {setStudyModal(!studyModal)}}>만들기</button>
</div>