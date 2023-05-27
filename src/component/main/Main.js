import Header from "./Header";
import MyGoal from "./MyGoal";
import StudyRanking from "./StudyRanking";
import styles from "./Main.module.css";
import MainOpenStudy from "./MainOpenStudy";

const Main = () => {
  return (
    <div>
      <Header />
      <div className={styles.wrapper}>
        <MyGoal />
        <StudyRanking />
      </div>
    </div>
  );
};

export default Main;
