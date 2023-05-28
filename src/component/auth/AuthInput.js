import styles from "./AuthInput.module.css";
import React, { useState, useEffect, useRef } from "react";

const AuthInput = (props) => {

  return (
    <div className={styles.inputWrapper}>
      <input
        onChange={(e) => props.eventHandler(e.target.value)}
        type={props.type}
        placeholder={props.placeholder}
        className={props.inputColor ? styles.input : styles.falseInput}
      />
    </div>
  );
};

export default AuthInput;
