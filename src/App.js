import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Write from "./Write";
import View from "./View";
import Ask from "./Ask";
import AskView from "./AskView";

function App() {

  return (
    <Router>
        <Routes>
          <Route path="/Write" element={<Write />} />
          <Route path="/View" element={<View />} />
          <Route path="/Ask" element={<Ask />} />
          <Route path="/AskView" element={<AskView />} />
          

        </Routes>
    </Router>
  );
}

export default App;

