import './ProfileSideBar.css'
import {useState, useEffect} from 'react';
import { Link, useParams } from "react-router-dom";
import profile from "./icon/profile.png";
import { HiUserCircle } from "react-icons/hi";
import axios from 'axios';

function ProfileSideBar() {

    const [profileImg, setProfileImg] = useState(null);
    const [user, setUser] = useState(null);
    const {writerId}  = useParams();

    useEffect(() => {
      const fetchUser = async() => {
        if(writerId){
          try{
            const res = await  axios.get(`http://localhost:8080/portfolioInfo/${writerId}`);
            setUser(res.data[0]);
            setProfileImg(res.data[0].image);
            console.log(res.data);
            console.log("이미지 불러오기에 성공했습니다.");
          }catch(err){
            console.error("이미지 불러오기에 실패했습니다.", err);
          }
        }
       
      };
      fetchUser();
      }, [writerId]);

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
                        <HiUserCircle size="180"/>
                    )}
                </li>
              </ul>
            </div>
          </div>
        </div>
      );
}

export default ProfileSideBar;