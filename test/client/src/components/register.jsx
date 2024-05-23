import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { registerValidate } from "../helper/validate";
import toast, { Toaster } from "react-hot-toast";
import "./style.scss";
import { registerUser } from "../helper/helper";

export default function Register(props) {
    const navigate = useNavigate();
    const formik = useFormik({
        initialValues: {
            type: "",
            username: "",
            email: "",
            password: "",
            confirm_pwd: "",
            degree: "",
            college_name: "",
            position:"",
            designation:"",
            subject:"",


        },
        validate: registerValidate,
        validateOnBlur: false,
        validateOnChange: false,
        onSubmit: async values => {
            let registerPromise = registerUser(values);
            toast.promise(registerPromise, {
                loading: 'Creating...',
                success: <b>Register successfully...!</b>,
                error: <b>Could not register.</b>
            })
            registerPromise.then(function () { navigate("/", { replace: true }) });
        }
    });
    return (
        <div className="registerContainer componentContainer">
            <Toaster position="top-center" reverseOrder={false}></Toaster>
            <h1>Register</h1>
            <div className="register">
                <form onSubmit={formik.handleSubmit}>
                    <select {...formik.getFieldProps("type")}>
                        <option value="">Type</option>
                        <option value="QSetter">Question Setter</option>
                        <option value="Student">Student</option>
                        <option value="Evaluator">Evaluator</option>
                    </select>
                    <input {...formik.getFieldProps("username")} type="text" placeholder="Username" />
                    <input {...formik.getFieldProps("email")} type="mail" placeholder="Email" />
                    <input {...formik.getFieldProps("password")} type="password" placeholder="Password" />
                    <input {...formik.getFieldProps("confirm_pwd")} type="password" placeholder="Confirm password" />

                    {formik.values.type === "QSetter" || formik.values.type === "Evaluator" ? (
                        <>
                            <input {...formik.getFieldProps("degree")} type="text" placeholder="Degree" />
                            <input {...formik.getFieldProps("college_name")} type="text" placeholder="College Name" />
                            <input {...formik.getFieldProps("position")} type="text" placeholder="Position" />
                            <input {...formik.getFieldProps("designation")} type="text" placeholder="Designation" />
                            <input {...formik.getFieldProps("subject")} type="text" placeholder="Subject" />
                            {/* <input {...formik.getFieldProps("certificate")} type="file" placeholder="Certificate"/> */}
                        </>
                    ) : null}

                    <button>Register</button>
                </form>
                <p>
                    Already have an account? <Link to="/login">Login</Link> now
                </p>
            </div>

        </div>
    );
}