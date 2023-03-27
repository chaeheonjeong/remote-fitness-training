import { useEffect, useState } from "react";
import { emailRegEx } from "../util/common";
import { users } from "../util/dummy";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function useFindPw() {
  const [emailText, setEmailText] = useState();
  const [passColor, setPassColor] = useState(true);
  const [rePassColor, setRePassColor] = useState(true);
  const [pass, setPass] = useState("");
  const [rePass, setRePass] = useState("");
  const [num, setNum] = useState("");
  const [sendText, setSendText] = useState("");
  const [emailInputColor, setEmailInputColor] = useState("default");
  const [numCheckText, setNumCheckText] = useState("");
  const [numCheckColor, setNumCheckColor] = useState("default");
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(5);
  const [warn, setWarn] = useState("");

  const navigate = useNavigate();

  const sendEmailHandler = async (event) => {
    event.preventDefault();
    setNumCheckColor("default");
    setMinutes(5);
    setSeconds(0);
    setNum("");

    if (emailRegEx.test(emailText)) {
      try {
        const response = await axios.post("http://localhost:8080/email-send", {
          email: emailText,
        });
        if (response.status === 200) setEmailInputColor("pass");
      } catch (error) {
        setEmailInputColor("fail2");
      }
    } else setEmailInputColor("fail1");
  };

  const numBtnHandler = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post("http://localhost:8080/email-verify", {
        email: emailText,
        verify: num,
      });
      if (numCheckColor !== "fail2" && response.status === 200) {
        setNumCheckColor("pass");
      }
    } catch (error) {
      setNumCheckColor("fail");
    }
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    if (numCheckColor !== "pass") {
      setWarn("인증번호를 확인해주세요.");
    } else if (!passColor || !rePassColor || pass === "" || rePass === "") {
      setWarn("비밀번호를 확인해주세요.");
    } else {
      const response = await axios.post("http://localhost:8080/email-newpass", {
        email: emailText,
        verify: num,
        newPassword: pass,
      });
      if (response.status === 200) {
        alert("비밀번호 변경이 완료되었습니다!");
        navigate("/login");
      }
    }
  };

  useEffect(() => {
    if (emailInputColor === "pass") {
      setSendText("E-mail이 발송되었습니다.");
    } else if (emailInputColor === "fail1") {
      setSendText(" 정확한 이메일을 입력해주세요.");
    } else {
      setSendText(" 존재하지 않는 계정입니다.  회원가입을 진행해주세요.");
    }
  }, [emailInputColor]);

  useEffect(() => {
    if (pass !== "") setPassColor(pass.length >= 6);
    else setPassColor(true);
    if (rePass !== "" && pass !== rePass) setRePassColor(false);
    else setRePassColor(true);
  }, [pass, rePass]);

  useEffect(() => {
    if (numCheckColor === "pass") {
      setNumCheckText(" 인증되었습니다.");
    } else if (numCheckColor === "fail") {
      setNumCheckText(" 옳지 않은 인증번호입니다.");
    } else if (numCheckColor === "fail2" && numCheckColor !== "pass") {
      setNumCheckText(" 인증번호 유효 시간이 만료되었습니다.");
    }
  }, [numCheckColor]);

  useEffect(() => {
    // setInterval(()=>{...function},num) : num 주기로 function 실행
    // countdown : 1초마다 안에 함수들을 실행
    const countdown = setInterval(() => {
      if (parseInt(seconds) > 0 && emailInputColor === "pass") {
        if (numCheckColor === "pass") clearInterval(countdown);
        else setSeconds(parseInt(seconds) - 1);
      }
      if (parseInt(seconds) === 0) {
        if (parseInt(minutes) === 0) {
          setNumCheckColor("fail2");
          clearInterval(countdown);
        } else if (numCheckColor !== "pass") {
          setMinutes(parseInt(minutes) - 1);
          setSeconds(59);
        }
      }
    }, 1000);

    return () => clearInterval(countdown);
  }, [minutes, seconds, numCheckColor, emailInputColor]);

  return {
    sendEmailHandler,
    emailText,
    setEmailText,
    passColor,
    setPassColor,
    rePassColor,
    setRePassColor,
    pass,
    setPass,
    rePass,
    setRePass,
    sendText,
    num,
    setNum,
    emailInputColor,
    numCheckText,
    numCheckColor,
    setNumCheckColor,
    numBtnHandler,
    minutes,
    setMinutes,
    seconds,
    setSeconds,
    submitHandler,
    warn,
  };
}
