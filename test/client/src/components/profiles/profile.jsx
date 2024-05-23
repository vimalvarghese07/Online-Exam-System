import React,{ useState } from "react";
import toast,{ Toaster } from "react-hot-toast";
import { useFormik } from "formik";
import { profileValidation } from "../helper/validate";
import convertToBase64 from "../helper/convert";
import avatar from "../assets/avatar.jpg";
import "./style.scss";
import useFetch from "../hooks/fetch.hook";
import { updateUser } from "../helper/helper";
import { useNavigate } from "react-router-dom";

export default function Profile(props) {

    const [file,setFile] = useState();
    const [{isLoading, apiData, serverError }] = useFetch();
    const navigate = useNavigate();
    const formik = useFormik({
        initialValues: {
            firstName: apiData?.firstName || "",
            lastName: apiData?.lastName || "",
            mobile: apiData?.mobile || "",
            email: apiData?.email || "",
            address: apiData?.address || ""
        },
        enableReinitialize: true,
        validate: profileValidation,
        validateOnBlur: false,
        validateOnChange: false,
        onSubmit: async values => {
            values = await Object.assign(values, { profile : file || apiData?.profile || "" });
            let updatePromise = updateUser(values);
            toast.promise(updatePromise, {
                loading : "Updating...",
                success : <b>Updated successfully...!</b>,
                errror : <b>Could not update!</b>
            });
        }
    });

    const onUpload = async e => {
        const base64 = await convertToBase64(e.target.files[0]);
        setFile(base64);
    }

    function userLogout() {
        localStorage.removeItem("token");
        navigate("/");
    }

    if(isLoading) return <h2 className="loading">Loading</h2>;
    if(serverError) return <h1 className="error">{serverError.message}</h1>;

    return(
        <div className="main username">
            <Toaster position="top-center" reverseOrder={false}></Toaster>
            <h1>Profile</h1>
            <div>You can update your details</div>
            <form onSubmit={formik.handleSubmit}>
                <div className="img-c">
                    <label htmlFor="profile">
                        <img style={{width: "50%"}} src={apiData?.profile || file || avatar} alt="avatar"/>
                    </label>
                    <input onChange={onUpload} type="file" id="profile" name="profile"/>
                </div>
                <div className="uname-c">
                    <input {...formik.getFieldProps("firstName")} type="text" placeholder="First name"/>
                    <input {...formik.getFieldProps("lastName")} type="text" placeholder="Last name"/>
                    <input {...formik.getFieldProps("mobile")} type="text" placeholder="Mobile"/>
                    <input {...formik.getFieldProps("email")} type="text" placeholder="Email*"/>
                    <input {...formik.getFieldProps("address")} type="text" placeholder="Address"/>
                    <button type="submitt">Update</button>
                </div>
                <div className="notMember">
                    <span>Come back later? <button onClick={userLogout}>Logout</button></span>
                </div>
            </form>
        </div>
    );
}