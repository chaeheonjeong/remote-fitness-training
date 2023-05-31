import Header from "./Header";
import MyGoal from "./MyGoal";
import BannerSwiper from "./bannerSwiper";
import StudyRanking from "./StudyRanking";
import styles from "./Main.module.css";



const Main = () => {
  return (
    <div>
      <Header />
      <div className={styles.banner}>
        <BannerSwiper/>
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
