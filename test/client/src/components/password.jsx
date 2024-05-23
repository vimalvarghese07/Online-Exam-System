import React from "react";
import toast,{ Toaster } from "react-hot-toast";
import { useFormik } from "formik";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuthStore } from "../store/store";
import { resetPassword } from "../helper/helper";
import { resetValidation } from "../helper/validate";
import useFetch from "../hooks/fetch.hook";
import "./style.scss";

export default function Password(props) {
    const { username } = useAuthStore(state => state.auth);
    const navigate = useNavigate();
    const [{ isLoading, apiData, status, serverError }] = useFetch("createResetSession");
    const formik = useFormik({
        initialValues: {
            password: '',
            confirm_pwd: ''
        },
        validate: resetValidation,
        validateOnBlur: false,
        validateOnChange: false,
        onSubmit: async values => {
            let resetPromise = resetPassword({ username, password : values.password });
            toast.promise(resetPromise, {
                loading : "Updating...!",
                success : <b>Reset successfully...!</b>,
                error : <b>Could not reset</b>
            });
             resetPromise.then(function() { navigate("/login", { replace: true }) });
        }
    });

    if(isLoading) return <h2 className="loading">Loading</h2>;
    if(serverError) return <h1 className="error">{serverError.message}</h1>;
    if(status && status !== 201) return <Navigate to={"/password"} replace={true}></Navigate>
    return(
        <div className="passwordContainer componentContainer">
            <Toaster position="top-center" reverseOrder={false}></Toaster>
            <div className="password">
                <h1>Reset password</h1>
                <p> Set a new password fro yoyr account</p>
                <form onSubmit={formik.handleSubmit}>
                    <input {...formik.getFieldProps("password")} type="password" placeholder="Password"/>
                    <input {...formik.getFieldProps("confirm_pwd")} type="password" placeholder="Confirm password"/>
                    <button>Change password</button>
                </form>
            </div>
        </div>
    );
}