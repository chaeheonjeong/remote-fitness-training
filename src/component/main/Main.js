import Header from "./Header";
import MyGoal from "./MyGoal";
import BannerSwiper from "./MainBannerSwiper";
import StudyRanking from "./StudyRanking";
import styles from "./Main.module.css";
import question from "../../images/question.png";
import findT from "../../images/findT.png";
import lesson from "../../images/lesson.png";
import { Link } from "react-router-dom";



const Main = () => {
  return (
    <div>
      <Header />
      <div className={styles.banner}>
        <BannerSwiper/>
      </div>
      <div className={styles.link}>
        <Link to="/Recruitment" className={styles.findLink} style={{textDecoration : "none"}}>
        <img
          className={styles.findT}
          src={findT}
          alt="findT"
        />
        <p className={styles.findtext}>강사 찾기</p>
        </Link>
        <Link to="/detailSRecruitment" className={styles.lessonLink} style={{textDecoration : "none"}}>
        <img
          className={styles.lesson}
          src={lesson}
          alt="lesson"
        />
        <p className={styles.lessontext}>레슨</p>
        </Link>
        <Link to="/detailQuestion" className={styles.questionLink} style={{textDecoration : "none"}}>
        <img
          className={styles.question}
          src={question}
          alt="question"
        />
        <p className={styles.qtext}>질문Q&A</p>
        </Link>
      </div>
      <div className={styles.ranking}>
        <StudyRanking />
      </div>
      <div className={styles.myhappiness}>
        <MyGoal />
      </div>
    </div>
  );
};

export default Main;
