import { BrowserRouter, Routes, Route } from "react-router-dom";
import React, { useEffect, useState } from 'react';


import Login from "../component/auth/Login";
import Register from "../component/auth/Register";
import FindPw from "../component/auth/FindPw";
import Main from "../component/main/Main";
import Notification from "../component/main/Notification";
import Write from "../component/post/Write";
import View from "../component/post//View";
import Ask from "../component/post//Ask";
import AskView from "../component/post//AskView";
import View2 from "../component/post//View2";

import View3 from "../component/post//View3";

import MainOpenStudy from "../component/MainOpenStudy";
import MainStudy from "../component/MainStudy";
import MainQuestion from "../component/MainQuestion";
import MyCalendar from '../component/mypage/MyCalendar';
import MyInfo from '../component/mypage/MyInfo';

const Router = () => {
    return(
        <BrowserRouter>
            <Routes>
                <Route path="/" element={[<Main/>, <MainOpenStudy/>]}/>
                <Route path="/study" element={[<Main/>, <MainStudy/>]}/>
                <Route path="/question" element={[<Main/>, <MainQuestion/>]}/>
                
                <Route path="/login" element={<Login/>}/>
                <Route path="/register" element={<Register/>}/>
                <Route path="/findPassword" element={<FindPw/>}/>
                <Route path="/notification" element={<Notification/>}/>
                
                {/* <Route path="/" element={<Main />} /> */}
                <Route path="/Write" element={<Write />} />
                <Route path="/View" element={<View />} />
                <Route path="/Ask" element={<Ask />} />
                <Route path='/View2' element={<View2 />} />
                <Route path='/View3' element={<View3 />} />
                <Route path="/AskView" element={<AskView />} />
                <Route path="/MyInfo" element={<MyInfo/>} />
                <Route path="/MyCalendar" element={<MyCalendar/>}/>
            </Routes>
        </BrowserRouter>
    );

}

export default Router;