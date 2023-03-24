import styles from './StudyRanking.module.css';

const StudyRanking = () => {
    return(
        <div className={styles.wrapper}>
            <div className={styles.title}>
                공부 시간 랭킹
            </div>
            <div className={styles.content}>
                1위 느티나무
            </div>
        </div>
    );
}

export default StudyRanking;