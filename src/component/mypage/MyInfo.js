import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import profile from "./icon/profile.png";
import "./MyInfo.css";
import SideBar from "./SideBar";
import axios from "axios";
import Modal from "react-modal";
import Header from "../main/Header";
import { HiUserCircle } from "react-icons/hi";
import userStore from "../../store/user.store";

function MyInfo() {
  const [imgFile, setImgFile] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const imgRef = useRef();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(false);
  const [nameError, setNameError] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState(false);
  const [call, setCall] = useState(false);
  const token = localStorage.getItem("token");
  const tuser = userStore();

  useEffect(() => {
    if (token) {
      axios
        .get("http://localhost:8080/users", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setUser(res.data);
          console.log(res.data);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [token]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/img-change`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setImgFile(res.data.image);
        console.log("이미지 가져오기에 성공 했습니다.", res.data);
      } catch (err) {
        console.log("이미지 가져오기에 실패했습니다.", err);
      }
    };
    fetchData();
  }, []);

  const handleChangePassword = (e) => {
    e.preventDefault();
    axios
      .put(
        `http://localhost:8080/users/change-password/${user._id}`,
        {
          password: password,
          newPassword: newPassword,
          confirmNewPassword: confirmNewPassword,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((res) => {
        setModalIsOpen(false);
        setPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
        console.log(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleNewPwdChange = (e) => {
    setNewPassword(e.target.value);
    setPasswordMatch(e.target.value === confirmNewPassword);
    if (e.target.value.length < 6) {
      setErrorMessage("6자 이상 입력해주세요");
    } else {
      setErrorMessage("");
    }
  };

  const handleConfirmPwdChange = (e) => {
    setConfirmNewPassword(e.target.value);
    setPasswordMatch(e.target.value === newPassword);
  };

  const handleWithDraw = (e) => {
    e.preventDefault();
    const confirmed = window.confirm(
      "회원 탈퇴시 재로그인이 불가합니다. 회원 탈퇴를 하시겠습니까?"
    );

    if (confirmed) {
      axios
        .delete(`http://localhost:8080/users/withdraw/${user._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          localStorage.removeItem("token");
          localStorage.removeItem("name");
          setUser(null);
          navigate("/");
          console.log(res.data);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    console.log(user._id);

    try {
      const response = await axios.post(
        `http://localhost:8080/nick-change`,
        {
          nick: user.name,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.status === 200) {
        alert("닉네임이 변경되었습니다.");
        tuser.changeName(user.name);

        console.log(tuser.name);
      }
      setNameError(false);

      const res = await axios.put(
        `http://localhost:8080/img-change/${user._id}`,
        { image: imgFile },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.status === 200) {
        console.log("이미지 업로드에 성공 했습니다.");
        setCall((prev) => !prev);
        setImgFile(res.data.image);
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message === "이미 존재하는 닉네임 입니다."
      ) {
        setNameError("이미 존재하는 닉네임 입니다.");
      }
      console.error("이미지 업로드에 실패했습니다.", error);
    }
  };

  const saveImgFile = () => {
    const file = imgRef.current.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setImgFile(reader.result);
    };
  };

  return (
    <div>
      <Header imgFile={imgFile} callback={call} />
      <SideBar />
      {user ? (
        <div className="MyInfo">
          {imgFile ? (
            <img className="Profile" src={imgFile} alt="프로필 이미지" />
          ) : (
            <HiUserCircle size="180" />
          )}
          <label className="img-btn" for="ProfileImg">
            프로필 변경
          </label>
          <input
            id="ProfileImg"
            type="file"
            accept="image/*"
            onChange={saveImgFile}
            ref={imgRef}
            style={{ display: "none" }}
          />
          <form className="Information" onSubmit={handleFormSubmit}>
            <label className="nickname">닉네임 </label>
            <input
              type="text"
              value={user.name}
              className="Input"
              onChange={(e) => setUser({ ...user, name: e.target.value })}
            />
            <br />
            {nameError && <p style={{ color: "red" }}>{nameError}</p>}
            <label className="email">이메일 </label>
            <input type="text" value={user.email} className="Input" />
            <br />
            <button type="submit" value="modify" className="Btn">
              수정
            </button>
          </form>
          <div>
            <button onClick={() => setModalIsOpen(true)} className="CBtn">
              비밀번호 변경
            </button>
            <button
              type="submit"
              onClick={handleWithDraw}
              value="SignOut"
              className="DBtn"
            >
              회원 탈퇴
            </button>
          </div>
          <Modal
            className="Modal"
            ariaHideApp={false}
            isOpen={modalIsOpen}
            onRequestClose={() => setModalIsOpen(false)}
            overlayClassName="Overlay"
          >
            <button
              type="submit"
              onClick={() => setModalIsOpen(false)}
              className="ModalButton"
            >
              X
            </button>
            <form className="change" onSubmit={handleChangePassword}>
              <div className="pwd">
                <p>
                  <label className="password">현재 비밀번호</label>
                </p>
                <input
                  type="password"
                  className="_input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="pwd">
                <p>
                  <label className="password">새 비밀번호</label>
                </p>
                <input
                  type="password"
                  className="_input"
                  value={newPassword}
                  onChange={handleNewPwdChange}
                  required
                />
              </div>
              {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
              <div className="pwd">
                <p>
                  <label className="password">새 비밀번호 확인</label>
                </p>
                <input
                  type="password"
                  className={
                    passwordMatch ? "password-match" : "password-not-match"
                  }
                  value={confirmNewPassword}
                  onChange={handleConfirmPwdChange}
                  required
                />
              </div>
              <button type="submit" className="changeBtn">
                변경
              </button>
              <button
                onClick={() => setModalIsOpen(false)}
                className="changeBtn"
              >
                취소
              </button>
            </form>
          </Modal>
        </div>
      ) : (
        <p className="noLogin">로그인되어 있지 않습니다. 로그인을 해주세요</p>
      )}
    </div>
  );
}

export default MyInfo;
