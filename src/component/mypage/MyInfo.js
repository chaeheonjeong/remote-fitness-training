import React, { useState, useRef, useEffect } from 'react';
import profile from './icon/profile.png';
import './MyInfo.css';
import SideBar from './SideBar';
import axios from 'axios';
import jwt_decode from 'jwt-decode';

function MyInfo(){
   const [imgFile, setImgFile] = useState("");
   const imgRef = useRef();
   const [user, setUser] = useState(null);

   useEffect(()=>{
    const token = localStorage.getItem('token');

    if(token){
        axios.get('/user', {headers : {Authorization:`Bearer ${token}`}})
        .then((res) => {
            const decodedToken = jwt_decode(token);
            setUser({email : decodedToken.email, ...res.data});
        })
        .catch((err) => {
            console.log(err);
        });
    }
    
   }, []);

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
                <p className="nickname">닉네임 <input type="text" value={user.name} className="NickName"/></p>
                <p className="email">이메일 <input type="text" value={user.email} className="Email"/></p>
                <p className="newPhone">새 비밀번호 <input type="password" className="NewPassWord"/></p>
                <p className="newPhone">새 비밀번호 확인 <input type="password" className="NewPassWord"/></p>
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