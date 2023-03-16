import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainOpenStudy from "./component/MainOpenStudy";
import MainStudy from "./component/MainStudy";
import MainQuestion from "./component/MainQuestion";
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" exact={true} element={<MainOpenStudy />} />
        <Route path="/study" element={<MainStudy />} />
        <Route path="/question" element={<MainQuestion />} />       
      </Routes>
    </Router>
  );
}

export default App;
