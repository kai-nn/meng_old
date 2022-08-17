import React from "react";
import style from './Main.module.css'
import {Route, Routes} from "react-router-dom";
import Home from "../pages/Home/Home";
import Detail from "../pages/Detail/Detail";
import Login from "../pages/Login/Login";
// import Test from "../pages/Tests/1_redux_toolkit/Test";
// import Test from "../pages/Tests/2_redux_toolkit/Test";
// import Test from "../pages/Tests/3_redux_toolkit/TechList";
import Test from "../pages/Tests/4_react_hook_form/AuthPage";
import Message from "../Message/Message";
import Logout from "../pages/Logout/Logout";
import TestJWT from "../pages/TestJWT/TestJWT";
import Review from "../pages/Tech/Review/Review";


const Main = () => {
    return (
        <div className={style.window}>
            <div className={style.content}>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="review" element={<Review />} />
                    <Route path="detail" element={<Detail />} />
                    <Route path="login" element={<Login />} />
                    <Route path="logout" element={<Logout />} />
                    {/*<Route path="test" element={<Test />} />*/}
                    <Route path="test_jwt" element={<TestJWT />} />
                </Routes>
                <Message/>
            </div>
        </div>
    )
}

export default Main