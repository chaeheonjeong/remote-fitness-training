import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";


import Write from "./Write";
import View from "./View";
import Ask from "./Ask";
import AskView from "./AskView";
import View2 from "./View2";

function App() {

  return (
    <Router>
        <Routes>
          <Route path="/Write" element={<Write />} />
          <Route path="/View" element={<View />} />
          <Route path="/Ask" element={<Ask />} />
          <Route path='/View2' element={<View2 />} />
          <Route path="/AskView" element={<AskView />} />
          

        </Routes>
    </Router>
  );
}

export default App;

