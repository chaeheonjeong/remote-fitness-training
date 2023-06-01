import React, { useState } from "react";
import "./SideBar.css";
import { Link, NavLink } from "react-router-dom";
import { GrCircleInformation, GrDocumentUser, GrDocumentText, GrCalendar } from "react-icons/gr";
import { BsBookmarkHeartFill } from "react-icons/bs";
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
                <div className="styles.css1_head" style={{ textDecoration: "none", display: 'flex', alignItems: 'center', marginBottom:"10px"}}>
                <GrCircleInformation style={{ marginRight: '10px' }}/>내 정보</div>
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
                <div className="styles.css1_head" style={{ textDecoration: "none", display: 'flex', alignItems: 'center', marginBottom:"10px"}}>
                <GrDocumentUser style={{ marginRight: '10px' }}/>포트폴리오</div>
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
                <div className="styles.css1_head" style={{ textDecoration: "none", display: 'flex', alignItems: 'center', marginBottom:"10px"}}>
                <BsBookmarkHeartFill style={{ marginRight: '10px' }}/>관심글</div>
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
                <div className="styles.css1_head" style={{ textDecoration: "none", display: 'flex', alignItems: 'center', marginBottom:"10px"}}>
                <GrDocumentText style={{ marginRight: '10px' }}/>내가 쓴 글</div>
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
                <div className="styles.css1_head" style={{ textDecoration: "none", display: 'flex', alignItems: 'center', marginBottom:"10px"}}>
                <GrCalendar style={{ marginRight: '10px' }}/>캘린더</div>
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default SideBar;
