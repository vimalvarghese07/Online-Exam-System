import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { usernameVerify } from "../helper/validate";
import toast,{ Toaster } from "react-hot-toast";
import { useAuthStore } from "../store/store";
import { generateOTP } from "../helper/helper";
import "./style.scss";

export default function Reset(props) {
    const navigate = useNavigate();
    const setUsername = useAuthStore(state => state.setUsername);
    const formik = useFormik({
        initialValues: {
            username: ''
        },
        validate: usernameVerify,
        validateOnBlur: false,
        validateOnChange: false,
        onSubmit: async values => {
            generateOTP(values.username).then((status) => {
                if(status === 201) return toast.success("OTP has been send to your email");
                return toast.error("Problem ehile generating OTP");
            })
            setUsername(values.username);
            navigate("/otp");
        }
    });
    return (
        <div className="resetContainer componentContainer">
            <Toaster position="top-center" reverseOrder={false}></Toaster>
            <div className="reset">
            <h1>Reset password</h1>
            <p>Enter your username to reset your password.</p>
                <form onSubmit={formik.handleSubmit}>
                    <input {...formik.getFieldProps('username')} type="text" placeholder="Username" />
                    <button>Send OTP</button>
                    <p>{"Don't have a username? "}<Link to="/register">register</Link> now</p>
                </form>
            </div>
        </div>
    );
}