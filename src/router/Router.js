import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../component/auth/Login";
import Register from "../component/auth/Register";
import FindPw from "../component/auth/FindPw";
import Main from "../component/main/Main";
import Notification from "../component/main/Notification";

import MainOpenStudy from "../component/MainOpenStudy";
import MainStudy from "../component/MainStudy";
import MainQuestion from "../component/MainQuestion";

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
            </Routes>
        </BrowserRouter>
    );

}

export default Router;