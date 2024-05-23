import React,{ useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProfile } from "../helper/helper";
import "./style.scss";

export default function Profile(props) {
    const navigate = useNavigate();
    const [display,setDisplay] = useState(false);
    getProfile().then(data => {
        localStorage.setItem("username",data.data.username);
        if(data.data.type === "Admin") {
            navigate("admin",{ replace: true});
        } else if(data.data.type === "Evaluator") {
            navigate("evaluator",{ replace: true});
        } else if(data.data.type === "QSetter") {
            navigate("qsetter",{ replace: true});
        } else if(data.data.type === "Student") {
            navigate("student",{ replace: true});
        } else {
            setDisplay(true);
            userLogout();
        }
    });
    const userLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    }
    if(display) {
    return(
        <div className="profileContainer componentContainer">
            <h1>Something went wrong you are being logged out...</h1>
        </div>
    );
    }
    return(
        <div className="profileContainer componentContainer">
            <h1>Loading profile...</h1>
        </div>
    );
}