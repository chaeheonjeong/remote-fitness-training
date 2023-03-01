import { Link } from "react-router-dom";

function MainStudy() {
    return(
        <div>
            <Link to="/"><button>오픈스터디</button></Link>
            <Link to="/study"><button>스터디</button></Link>
            <Link to="/question"><button>질문</button></Link>

            <select>
                <option>제목</option>
                <option>태그</option>
                <option>작성자</option>
            </select>
            <input />
            <button>만들기</button>


            <h2>Study</h2>
        </div>
    );
} export default MainStudy;