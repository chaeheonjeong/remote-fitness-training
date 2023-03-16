import React, { useState, useRef } from 'react';
import profile from './icon/profile.png'
import './MyInfo.css'

function MyInfo(){
   const [imgFile, setImgFile] = useState("");
   const imgRef = useRef();

   const saveImgFile = () => {
    const file = imgRef.current.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
        setImgFile(reader.result);
    };
   };
    return(
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
                <p className="nickname">닉네임 <input type="text" className="NickName"/></p>
                <p className="phone">전화번호 <input type="text" className="PhoneNum"/></p>
                <p className="newPhone">새 비밀번호 <input type="password" className="NewPassWord"/></p>
                <p className="newPhone">새 비밀번호 확인 <input type="password" className="NewPassWord"/></p>
            </div>
            <div className="submitBtn">
                <button type="submit" value="modify" className="Modify">수정</button>
                <button type="submit" value="SignOut" className="SignOut">회원 탈퇴</button>
            </div>         
        </div>
    )   
}

export default MyInfo;