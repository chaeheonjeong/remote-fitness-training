import React from "react";
import "./SideBar.css";
import { Link } from "react-router-dom";
import "./MyInfo";
import "./MyCalendar";

function SideBar() {
  return (
    <div className="SideBar">
      <div className="SideBarWrapper">
        <div className="SideBarMenu">
          <h3 className="SideBarTitle">My Page</h3>
          <ul className="SideBarList">
            <li className="SideBarListItem">
              <Link
                to="/MyInfo"
                style={{ textDecoration: "none", color: "black" }}
              >
                내 정보
              </Link>
            </li>
            <li className="SideBarListItem">
            <Link
                to="/Portfolio"
                style={{ textDecoration: "none", color: "black" }}
              >
                포트폴리오
              </Link>
            </li>
            <li className="SideBarListItem">
              <Link
                to="/myLikedPost"
                style={{ textDecoration: "none", color: "black" }}
              >
                관심글
              </Link>
              </li>
            <li className="SideBarListItem">
              <Link
                to="/myPost"
                style={{ textDecoration: "none", color: "black" }}
              >
                내가 쓴 글
              </Link>
            </li>
            <li className="SideBarListItem">
              <Link
                to="/MyCalendar"
                style={{ textDecoration: "none", color: "black" }}
              >
                캘린더
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default SideBar;
