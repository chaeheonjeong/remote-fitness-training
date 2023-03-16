import styles from "./Paginator.module.css";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
/* 
    currentPage,
    setCurrentPage,
    totalPage,
    nextPage,
    beforePage,
    rendData,
*/

export default function Paginator({ hook }) {
  const arr = new Array(hook.totalPage).fill();
  return (
    <div className={styles.wrapper}>
      <MdKeyboardArrowLeft
        size={25}
        color="#000"
        onClick={() => hook.beforePage()}
        style={{
            cursor: "pointer"
        }}
      />
      {arr.map((x, i) => {
        return (
          <div
            key={i}
            className={styles.pageNumber}
            style={{
              fontWeight: i + 1 === hook.currentPage ? "900" : "400",
              cursor: "pointer"
            }}
            onClick={() => hook.setCurrentPage(i + 1)}
          >
            {i + 1}
          </div>
        );
      })}
      <MdKeyboardArrowRight
        size={25}
        color="#000"
        onClick={() => hook.nextPage()}
        styles={{
            cursor: "pointer"
        }}
      />
    </div>
  );
}
