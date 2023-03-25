import React, { useState, useEffect } from "react";
import styles from './FindPwCounter.module.css';

const FindPwCount = ({hook}) => {
  return (
    <>
    {hook.numCheckColor !== "pass" &&
    <div className={styles.counter}>
    {hook.minutes}:{hook.seconds < 10 ? `0${hook.seconds}` : hook.seconds}
    </div>}
    </>
  );
}

export default FindPwCount;