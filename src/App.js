import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import MyCalendar from './component/mypage/MyCalendar';
import MyInfo from './component/mypage/MyInfo';
import SideBar from './component/mypage/SideBar';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <SideBar />
        <Routes>
          <Route path="/MyInfo" element={<MyInfo/>} />
          <Route path="/MyCalendar" element={<MyCalendar/>}/>
        </Routes>
      </BrowserRouter>
    </div>
    
  );
}

export default App;
