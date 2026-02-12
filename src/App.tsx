import React, {Fragment} from 'react';
import Header from "./components/layout/Header";
import Home from "./components/layout/Home";
import Footer from "./components/layout/Footer";
import {BrowserRouter as Router,Routes,Route} from "react-router-dom";
import JejuAttractionList from "./components/jeju/JejuAttractionList";
import JejuAttractionDetail from "./components/jeju/JejuAttractionDetail";
import BoardList from "./components/board/BoardList";
import BoardInsert from "./components/board/BoardInsert";
import BoardDetail from "./components/board/BoardDetail";
import BoardUpdate from "./components/board/BoardUpdate";
import BoardDelete from "./components/board/BoardDelete";

function App() {
  return (
      <Router>
          <Header />
          <Routes>
            <Route path="/" element={<Home/>} />
            <Route path="/jeju/attraction" element={<JejuAttractionList/>} />
            <Route path={"/jeju/detail/:contentid"} element={<JejuAttractionDetail/>}/>
            <Route path="/board/list" element={<BoardList/>}/>
            <Route path="/board/insert" element={<BoardInsert/>}/>
            <Route path="/board/detail/:no" element={<BoardDetail/>}/>
            <Route path="/board/update/:no" element={<BoardUpdate/>}/>
            <Route path="/board/delete/:no" element={<BoardDelete/>}/>
          </Routes>
          <Footer />
      </Router>

  );
}

export default App;
