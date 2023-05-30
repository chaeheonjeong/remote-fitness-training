import React, { useState } from "react";
import "./SideBar.css";
import { Link, NavLink } from "react-router-dom";
import "./MyInfo";
import "./MyCalendar";

function SideBar() {
  const [activeItem, setActiveItem] = useState("");

  const handleItemClick = (itemPath) => {
    setActiveItem(itemPath);
  };

  return (
    <div className="SideBar">
      <div className="SideBarWrapper">
        <div className="SideBarMenu">
          <h3 className="SideBarTitle">My Page</h3>
          <ul className="SideBarList">
            <li className="SideBarListItem">
              <NavLink
                exact
                to="/MyInfo"
                style={{ textDecoration: "none", color: "black" }}
                activeClassName="active"
                onClick={() => handleItemClick("/MyInfo")}
              >
                내 정보
              </NavLink>
            </li>
            <li className="SideBarListItem">
              <NavLink
                exact
                to="/Portfolio"
                style={{ textDecoration: "none", color: "black" }}
                activeClassName="active"
                onClick={() => handleItemClick("/Portfolio")}
              >
                포트폴리오
              </NavLink>
            </li>
            <li className="SideBarListItem">
              <NavLink
                exact
                to="/myLikedPost"
                style={{ textDecoration: "none", color: "black" }}
                activeClassName="active"
                onClick={() => handleItemClick("/myLikedPost")}
              >
                관심글
              </NavLink>
            </li>
            <li className="SideBarListItem">
              <NavLink
                exact
                to="/myPost"
                style={{ textDecoration: "none", color: "black" }}
                activeClassName="active"
                onClick={() => handleItemClick("/myPost")}
              >
                내가 쓴 글
              </NavLink>
            </li>
            <li className="SideBarListItem">
              <NavLink
                exact
                to="/MyCalendar"
                style={{ textDecoration: "none", color: "black" }}
                activeClassName="active"
                onClick={() => handleItemClick("/MyCalendar")}
              >
                캘린더
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default SideBar;
