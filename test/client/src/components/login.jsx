import React from "react";
import toast,{ Toaster } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { loginValidate } from "../helper/validate";
import { verifyPassword } from "../helper/helper";
import "./style.scss";

export default function Login() {
    localStorage.removeItem('token');
    const navigate = useNavigate();
    const formik = useFormik({
        initialValues: {
            username: "",
            password: ""
        },
        validate: loginValidate,
        validateOnBlur: false,
        validateOnChange: false,
        onSubmit: async values => {
            let loginPromise = verifyPassword({ username: values.username,password : values.password });
            toast.promise(loginPromise, {
                loading : "Checking...",
                success : <b>{values.username} Login success...!</b>,
                error : <b>Password not match!</b>
            });
            loginPromise.then(res => {
                let { token } = res.data;
                localStorage.setItem("token", token);
                let a = localStorage.getItem('token');
                navigate("/profile", { replace: true });
            })
        }
    });
    return (
        <div className="loginContainer">
        <Toaster position="top-center" reverseOrder={false}></Toaster>
            <div className="login">
            <h1>Login</h1>
            <p>Login to explore the horizone.</p>
                <form onSubmit={formik.handleSubmit}>
                    <input {...formik.getFieldProps("username")} type="text" placeholder="Username" />
                    <input {...formik.getFieldProps("password")} type="password" placeholder="Password" />
                    <button>Login</button>
                    <p>{"Forgot password? "}<Link to="/reset">reset</Link> now</p>
                </form>
            </div>
        </div>
    );
}