import React from 'react';
import { Route, Routes } from 'react-router-dom';


import View from "./component/post/View";
import Write from "./component/post/Write";

const App = () => {

  return (
    <Routes>
      <Route path="/" element={<Write />} />
      <Route path="/Write" element={<Write />} />   
      
    </Routes>


  );
};


export default App;
