import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../component/auth/Login";
import Register from "../component/auth/Register";
import FindPw from "../component/auth/FindPw";
import Main from "../component/main/Main";
import Notification from "../component/main/Notification";
import MyCalendar from '../component/mypage/MyCalendar';
import MyInfo from '../component/mypage/MyInfo';

const Router = () => {
    return(
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Main/>}/>
                <Route path="/login" element={<Login/>}/>
                <Route path="/register" element={<Register/>}/>
                <Route path="/findPassword" element={<FindPw/>}/>
                <Route path="/notification" element={<Notification/>}/>
                <Route path="/MyInfo" element={<MyInfo/>} />
                <Route path="/MyCalendar" element={<MyCalendar/>}/>
            </Routes>
        </BrowserRouter>
    );

}

export default Router;