import React from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import toast,{ Toaster } from "react-hot-toast";
import './style.scss';
import { examValidate } from "../helper/validate";
import { updateExam, verifyExam } from "../helper/helper";
export default function ExamAdd(){
    const navigate = useNavigate();


    const formik = useFormik({
        initialValues: {
            examname: "",
            examdate: "",
            examfee: "",
        },
        validate: examValidate,
        validateOnBlur: false,
        validateOnChange: false,
        onSubmit: async values => {
            let verifyExamPromise = verifyExam({examname: values.examname, examdate: values.examdate});
            toast.promise(verifyExamPromise, {
                loading : "Checking...",
                success : <b>Verified Succesfully</b>,
                error : <b>Exam Exist</b>
            });
        let updateExamPromise = updateExam(values);
        toast.promise(updateExamPromise, {
            loading : "Checking...",
            success : <b>Exam Registered</b>,
            error : <b>Coudn't Register Exam</b>
        });
        updateExamPromise.then(res => {
            navigate('/profile');
        })
    }
    });
    
    return (
        <div className="addContainer">
                    <Toaster position="top-center" reverseOrder={false}></Toaster>
            <div className="ExamAdd">
                <h1>Register Exam</h1>
                <form onSubmit={formik.handleSubmit}>
                    <input {...formik.getFieldProps("examname")} type="text" placeholder="Name of Exam" ></input>
                    <input {...formik.getFieldProps("examdate")} type="date" placeholder="Last Date Of Registeration" />
                    <input {...formik.getFieldProps("examfee")} type="text" placeholder="Registeration Fee" />
                    <button>Add Exam</button>
                </form>
            </div>
        </div>
    );
}