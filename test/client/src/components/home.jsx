import React, { useState } from "react";
import {Link, useNavigate } from "react-router-dom";
import useFetch from "../hooks/fetch.hook";
import Login from "./login";

import "./style.scss";

export default function Home(props) {
    const notify = useFetch("getNotification"); 
    const navigate = useNavigate();
    localStorage.removeItem('token');
    
    return(
        <div className="homeContainer">
            <div className="top"><Navbar/></div>
            <div className="mid">
                <div className="midleft">
                    <h1>Notification</h1>
                    <div className="listNotify">
                        {
                            notify[0]?.apiData?.map((notification,index) => (
                                <div className="contentBox" key={index}>
                                    {notification.msg}
                                </div>
                            ))
                        }
                    </div>
                </div>
                <div className="midright">
                    <div className="logi">
                    <Login />
                    </div>
                </div>
            </div>
            <div className="bottom"></div>
        </div>
    );
}

export function Navbar(){
    const navigate = useNavigate();

    const handleRegisterbtn = () => {
        navigate('/register');
    }
    return(
        <div className="NavbarContainer">
            <div className="logoImg"><b>Online-Exam-Portal</b></div>
            <div className="right">
                <div className="resultbtn"><span>Result</span></div>
                <div className="registerbtn"><span onClick={handleRegisterbtn}>Register</span></div>
            </div>
        </div>
    );
}