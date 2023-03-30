import React, { useState, useRef, useEffect } from 'react';
import profile from './icon/profile.png';
import './MyInfo.css';
import SideBar from './SideBar';
import axios from 'axios';
import Header from "../main/Header";

function MyInfo(){
   const [imgFile, setImgFile] = useState("");
   const imgRef = useRef();
   const [user, setUser] = useState(null);
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
            <h3 className="Title">내 정보</h3>
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
            <div className="Information">
                <p className="nickname">닉네임 <input type="text" value={user.name} className="Input" /></p>
                <p className="email">이메일 <input type="text" value={user.email} className="Input"/></p>
                <p className="newPhone">새 비밀번호 <input type="password" className="Input"/></p>
                <p className="newPhone">새 비밀번호 확인 <input type="password" className="Input"/></p>
            </div>
            <div className="submitBtn">
                <button type="submit" value="modify" className="Modify">수정</button>
                <button type="submit" value="SignOut" className="SignOut">회원 탈퇴</button>
            </div>         
        </div>
        ):(<p>로그인되어 있지 않습니다. 로그인을 해주세요</p>)}
        </div>
    )   
}

export default MyInfo;