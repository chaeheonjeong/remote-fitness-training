import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../component/auth/Login";
import Register from "../component/auth/Register";
import FindPw from "../component/auth/FindPw";
import Main from "../component/main/Main";
import Notification from "../component/main/Notification";
import Write from "../component/post/Write";
import View from "../component/post//View";
import Ask from "../component/post//Ask";
import AskView from "../component/post//AskView";
import MyInfo from "../component/mypage/MyInfo";
import Jitsi from "../component/videochat/jitsi";
import Portfolio from "../component/mypage/Portfolio";
import PortfolioView from "../component/mypage/PortfolioView";
import PortfolioModify from "../component/mypage/PortfolioModify";
import MainOpenStudy from "../component/main/MainOpenStudy";
import MainStudy from "../component/main/MainStudy";
import MainQuestion from "../component/main/MainQuestion";
import MyCalendar from "../component/mypage/MyCalendar";
import MyLikedPost from "../component/mypage/MyLikedPost";
import MyLikedQuestion from "../component/mypage/MyLikedQuestion";
import ModifyPost from "../component/post/ModifyPost";
import ModifyAsk from "../component/post/ModifyAsk";
import MyPost from "../component/mypage/MyPost";
import MyAsk from "../component/mypage/MyAsk";
import RTCChat from "../component/class/RTCChat";
const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={[<Main key="main" />, <MainOpenStudy key="openstudy" />]}
        />
        <Route
          path="/study"
          element={[<Main key="smain" />, <MainStudy key="study" />]}
        />
        <Route
          path="/question"
          element={[<Main key="qmain" />, <MainQuestion key="question" />]}
        />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/findPassword" element={<FindPw />} />
        <Route path="/notification" element={<Notification />} />
        <Route path="/writePost" element={<Write />} />
        <Route path="/modifyPost/:id" element={<ModifyPost />} />
        <Route path="/View/:id" element={<View />} />
        <Route path="/Ask" element={<Ask />} />
        <Route path="/modifyAsk/:id" element={<ModifyAsk />} />
        {/* <Route path="/View2" element={<View2 />} />
        <Route path="/View3" element={<View3 />} /> */}
        <Route path="/AskView/:id" element={<AskView />} />
        <Route path="/MyInfo" element={<MyInfo />} />
        <Route path="/MyCalendar" element={<MyCalendar />} />
        <Route path="/MyLikedPost" element={<MyLikedPost />} />
        <Route path="/MyLikedQuestion" element={<MyLikedQuestion />} />
        <Route path="/View/:id" element={<View />} />
        <Route path="myAsk" element={<MyAsk />} />
        <Route path="myPost" element={<MyPost />} />
        <Route path="/Jitsi" element={<Jitsi />} />
        <Route path="/class/chat" element={<RTCChat />} />
        <Route path="Portfolio" element={<Portfolio/>}/>
        <Route path="PortfolioView/:writerId" element={<PortfolioView/>}/>
        <Route path="PortfolioModify" element={<PortfolioModify/>}/>
      </Routes>
    </BrowserRouter>
  );
};

export default Router;