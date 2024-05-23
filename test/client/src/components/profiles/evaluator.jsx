import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./style.scss";
import { useFormik } from "formik";
import { getProfile, updateEvaluator } from "../../helper/helper";
import toast, { Toaster } from "react-hot-toast";
import { acceptOrdeny, updateStudent } from "../../helper/helper";
import avatar from "../../assets/avatar.jpg";
import useFetch from "../../hooks/fetch.hook";
import convertToBase64 from "../../helper/convert";
import CancelIcon from '@mui/icons-material/Cancel';

const username = localStorage.getItem("username");

export default function Evaluator() {
    const user = useFetch(`getUser/${username}/QSetter`);
    const adminReq = useFetch(`getExamReq/evaluator/${username}`);
    const bottomReq = useFetch(`getAcceptedExamRequest/evaluator/${username}`);
    const [file, setFile] = useState();
    const [listE, setListE] = useState([]);
    const [{ isLoading, apiData = [], serverError }] = adminReq;
    const apiData2 = user && user[0].apiData;
    const [acceptedList, setAcceptedList] = useState({});
    const [acceptedBottomList, setAcceptedBottomList] = useState({});
    const [deniedList, setDeniedList] = useState({});
    const [showNotification, setShowNotification] = useState(false);
    const formik = useFormik({
        initialValues: {
            username: username,
            fname: "" || apiData2?.fname,
            lname: "" || apiData2?.lname,
            clg: "",
            reg: "",
            uni: "",
            dob: "" || apiData2?.dob,
        },
        enableReinitialize: true,
        validateOnBlur: false,
        validateOnChange: false,
        onSubmit: async values => {
            values = await Object.assign(values, { profile: file || "" });
            const response = updateEvaluator(values, "profile");
            toast.promise(response, {
                loading: "Updating...",
                success: <b>Updated successfully...!</b>,
                error: <b>Could not update!</b>
            });
        }
    });
    const onUpload = async e => {
        const base64 = await convertToBase64(e.target.files[0]);
        setFile(base64);
    }
    const navigate = useNavigate();
    
    const userLogout = () => {
        localStorage.removeItem("token");
        navigate("/");
    };

    const getProfileInfo = () => {
        let dialogueBox = document.getElementById('dialoguebox');
        dialogueBox.classList.remove("dontshow");
        dialogueBox.classList.add("show");
      }
  
      const handleClose = () => {
        let dialogueBox = document.getElementById('dialoguebox');
        dialogueBox.classList.remove("show");
        dialogueBox.classList.add("dontshow");
      }

    const handleAcceptOrDeny = (adminName, examName, isAccepted, index) => {
        if (isAccepted) {
            setAcceptedList({ adminName: adminName, examName: examName });
            window.location.reload(false);
            listE.splice(index, 1)
            return listE;
        } else if (!isAccepted) {
            setDeniedList({ adminName: adminName, examName: examName });
            window.location.reload(false);
            listE.splice(index, 1);
            return listE;
        }
    }
    useEffect(() => {
        const user = localStorage.getItem('username');
        if (Object.keys(acceptedList).length > 0) {
            acceptOrdeny({ 'acceptedList': acceptedList, 'isAccepted': true, 'username': user });
        }
    }, [acceptedList]);

    useEffect(() => {
        const user = localStorage.getItem('username');
        if (Object.keys(deniedList).length > 0) {
            acceptOrdeny({ 'deniedList': deniedList, 'isAccepted': false, 'username': user });
        }
    }, [deniedList]);
    
    useEffect(() => {

    }, [acceptedBottomList]);

    const handleClickExam = (examList, admin) => {
        navigate(`/EvaluateQuestion/${examList}/${admin}`);
    }

    return (
        <div className="evaluator">
             <div className="dialoguebox dontshow" id="dialoguebox">
        <CancelIcon className="cancelbtn" onClick={() => handleClose() } />
        <div className="contentBox">
          <table>
            <tr>
              <td>Username</td>
              <td> {user[0]?.apiData?.username}</td>
            </tr>
            <tr>
              <td>Email</td>
              <td>{user[0]?.apiData?.email}</td>
            </tr>
            <tr>
                <td>First Name</td>
                <td>{user[0]?.apiData?.fname}</td>
            </tr>
            <tr>
                <td>Last Name</td>
                <td>{user[0]?.apiData?.lname}</td>
            </tr>
          </table>
        </div>
      </div>
            <Toaster position="top-center" reverseOrder={false}></Toaster>
            <div className="UpperBody">
                <div className="leftSide">
                    <div className="Qsetter">
                        <div className="body">
                            <form onSubmit={formik.handleSubmit}>
                                <label htmlFor="avatar">
                                    <img className="avatar" src={file || apiData2?.profile || avatar} alt="profile" />
                                </label>
                                <div className="fields">
                                    <input onChange={onUpload} type="file" id="avatar" name="avatar" />
                                    {apiData2?.fname ? <span >{user[0]?.apiData?.fname}&nbsp;{user[0]?.apiData?.lname}</span>   : <input {...formik.getFieldProps("fname")} type="text" id="firstName" placeholder="First name" />}
                                    {apiData2?.lname  ? ''  : <input {...formik.getFieldProps("lname")} type="text" id="lastName" placeholder="Last name" />}
                                    {apiData2?.dob  ? <span>{user[0]?.apiData?.dob}</span>  : <input {...formik.getFieldProps("dob")} type="text" id="dob" placeholder="Date of birth" onFocus={(e) => { e.target.type = 'date' }} onBlur={(e) => { e.target.type = 'text' }} />}
                                    {apiData2?.fname ? <span className="viewProfilebtn" onClick={() => getProfileInfo()}> View Profile </span> : <button type="submit">Update</button>}
                                </div>
                            </form>
                        </div>
                        <button className="logout" onClick={userLogout} type="button">Logout</button>
                    </div>
                </div>
                <div className="RightSide">
                    <h1>Notification</h1>
                    {
                        <div className="insideR">
                            {adminReq[0]?.apiData?.map((item, index) => (
                                <div key={index} className="contentBox">
                                    <span><b className="adminName">{item.admin}</b> has assigned you as the Evaluator for the Exam <b className="listExam">{item.examList}</b> </span>
                                    <div className="btns">
                                        <button className="Yes" onClick={() => handleAcceptOrDeny(item.admin, item.examList, true, index)}>Accept</button>
                                        <button className="No" onClick={() => handleAcceptOrDeny(item.admin, item.examList, false, index)}>Deny</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    }
                </div>
            </div>
            <div className="BottomBody">
                {
                    bottomReq[0].apiData?.length > 0 ? (
                        <div className="yesContainer">
                            {bottomReq[0].apiData.map((item, index) => (
                                <div key={index} className="contentBox" onClick={() => handleClickExam(item.examList, item.admin)}>
                                    <span>
                                        <b className="listExam">{item.examList}</b>
                                        <br />
                                        <b className="adminName">({item.admin})</b>
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="noContainer">
                            Nothing to Show Here
                        </div>
                    )
                }
            </div>

        </div>
    );
}

{/* <div className="top">
                <h2>Evaluator portal</h2>
                <div className="buttom-container">
                    <button type="button">hour</button>
                    <button onClick={userLogout}>Logout</button>
                </div>
            </div>
            
            <div className="bottom">
                <div className="left">left</div>
                <div className="right">
                    <button type="button">submit</button>
                    <button type="button">save</button>
                </div>
            </div> */}