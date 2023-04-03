import React, { useState, useRef, useEffect } from 'react';
import {useNavigate} from 'react-router-dom';
import profile from './icon/profile.png';
import './MyInfo.css';
import SideBar from './SideBar';
import axios from 'axios';
import Modal from 'react-modal';
import Header from "../main/Header";

function MyInfo(){
   const [imgFile, setImgFile] = useState("");
   const [modalIsOpen, setModalIsOpen] = useState(false);
   const imgRef = useRef();
   const navigate = useNavigate();
   const [user, setUser] = useState(null);
   const [password, setPassword] = useState("");
   const [newPassword, setNewPassword] = useState("");
   const [confirmNewPassword, setConfirmNewPassword] = useState("");
   const [errorMessage, setErrorMessage] = useState(false);
   const [passwordMatch, setPasswordMatch] = useState(false);
   const token = localStorage.getItem('token');

   useEffect(() => {
    if(token){
        axios.get("http://localhost:8080/users", {
            headers : {Authorization: `Bearer ${token}`}
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

   const handleChangePassword = (e) => {
    e.preventDefault();
    axios.put(`http://localhost:8080/users/change-password/${user._id}`, {
        password : password,
        newPassword: newPassword,
        confirmNewPassword: confirmNewPassword
    },{
        headers : {Authorization: `Bearer ${token}`}
    })
        .then(res => {
            setModalIsOpen(false);
            setPassword('');
            setNewPassword('');
            setConfirmNewPassword('');
            console.log(res.data);
        })
        .catch(err => {
            console.error(err);
        })
   };

   const handleNewPwdChange = (e) => {
    setNewPassword(e.target.value);
    setPasswordMatch(e.target.value === confirmNewPassword);
    if(e.target.value.length < 6){
        setErrorMessage("6자 이상 입력해주세요");
    }else{
        setErrorMessage("");
    }
   };

   const handleConfirmPwdChange = (e) => {
    setConfirmNewPassword(e.target.value);
    setPasswordMatch(e.target.value === newPassword);
   };

   const handleWithDraw = (e) => {
    e.preventDefault();
    const confirmed = window.confirm("회원 탈퇴시 재로그인이 불가합니다. 회원 탈퇴를 하시겠습니까?");
    
    if(confirmed){
        axios.delete(`http://localhost:8080/users/withdraw/${user._id}`,{
            headers : {Authorization: `Bearer ${token}`}
        })
            .then((res) => {
                localStorage.removeItem("token");
                localStorage.removeItem("name");
                setUser(null);
                navigate('/');
                console.log(res.data);
            })
            .catch((err) => {
                console.error(err);
            })
    }
    
   };

   const handleFormSubmit = (e) => {
    e.preventDefault();
    console.log(user._id);
    axios.put(`http://localhost:8080/users/${user._id}`, {
        name : user.name
    },{
        headers : {Authorization: `Bearer ${token}`}
    })
        .then(res => {
            setUser(res.data);
            console.log(res.data);
        })
        .catch(err => {
            console.error(err);
        });
   };

   const saveImgFile = () => {
    const file = imgRef.current.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
        setImgFile(reader.result);
    };
   };
    return(
        <div>
        <Header />
        <SideBar/>
        {user ? (
            <div className="MyInfo">
            <img
                className="Profile"
                src={imgFile ? imgFile : profile}
                alt="프로필 이미지"
            />
            <input
                className="ProfileImg"
                type="file"
                accept="image/*"
                onChange={saveImgFile}
                ref={imgRef}
            />
            <form className="Information" onSubmit={handleFormSubmit}>
                <label className="nickname">닉네임 </label>
                <input type="text" value={user.name} className="Input" onChange={(e) => setUser({ ...user, name: e.target.value })} />
                <br/>
                <label className="email">이메일 </label>
                <input type="text" value={user.email} className="Input"/>
                <br/>
                <button type="submit" value="modify" className="Btn">수정</button>
                <button onClick={() => setModalIsOpen(true)} className="Btn">비밀번호 변경</button>
                <button type="submit" onClick={handleWithDraw} value="SignOut" className="Btn">회원 탈퇴</button>
            </form>
            <Modal className='Modal' ariaHideApp={false} isOpen={modalIsOpen} onRequestClose={() => setModalIsOpen(false)} overlayClassName='Overlay'>
                <button type="submit" onClick={() => setModalIsOpen(false)} className='ModalButton'>X</button>
                <form className='change' onSubmit={handleChangePassword}>
                    <div className='pwd'>
                        <p><label className='password'>현재 비밀번호</label></p>
                        <input type="password" className='_input' value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                    <div className='pwd'>
                        <p><label className='password'>새 비밀번호</label></p>
                        <input type="password" className='_input' value={newPassword} onChange={handleNewPwdChange} required />
                    </div>
                    {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
                    <div className='pwd'>
                        <p><label className='password'>새 비밀번호 확인</label></p>
                        <input type="password" className={passwordMatch ? 'password-match' : 'password-not-match'} value={confirmNewPassword} onChange={handleConfirmPwdChange} required />
                    </div>
                    <button type="submit" className='changeBtn'>변경</button>
                    <button onClick={() => setModalIsOpen(false)} className='changeBtn'>취소</button>
                </form>
            </Modal>         
        </div>
        ):(<p className='noLogin'>로그인되어 있지 않습니다. 로그인을 해주세요</p>)}
        </div>
    )   
}

export default MyInfo;