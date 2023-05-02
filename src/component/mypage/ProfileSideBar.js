import './ProfileSideBar.css'
import {useState, useEffect} from 'react';
import { Link } from "react-router-dom";
import profile from "./icon/profile.png";
import axios from 'axios';

function ProfileSideBar() {

    const [profileImg, setProfileImg] = useState(null);
    const token = localStorage.getItem("token");
    const [user, setUser] = useState(null);

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
        const fetchData = async() => {
            try{
                const res = await axios.get(`http://localhost:8080/img-change`,{
                    headers: {Authorization: `Bearer ${token}`},
                });
                setProfileImg(res.data.image);
                console.log("이미지 가져오기에 성공했습니다.", res.data);
            }catch(err){
                console.log("이미지 가져오기에 실패했습니다.", err);
            }
        };
        fetchData();
    }, []);
    return (
        <div className="SideBar">
          <div className="SideBarWrapper">
            <div className="SideBarMenu">
              <h3 className="SideBarTitle">{user?.name}님의 포트폴리오</h3>
              <ul className="SideBarList">
                <li className="SideBarListItem">
                    {profileImg ? (
                        <img className='profileImg' src={profileImg} alt='프로필 이미지'/>
                    ):(
                        <img className='noneProfileImg' src={profile} alt='프로필 기본 이미지'/>
                    )}
                </li>
              </ul>
            </div>
          </div>
        </div>
      );
}

export default ProfileSideBar;