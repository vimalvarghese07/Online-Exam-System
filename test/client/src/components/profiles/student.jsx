import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import convertToBase64 from "../../helper/convert";
import toast, { Toaster } from "react-hot-toast";
import { getHallticket, updateStudent } from "../../helper/helper";
import avatar from "../../assets/avatar.jpg";
import useFetch from "../../hooks/fetch.hook";
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import "./style.scss";
import { saveAs } from 'file-saver';

const username = localStorage.getItem("username");

export default function Student(props) {
    const navigate = useNavigate();
    const [file, setFile] = useState();
    const [tab, setTab] = useState("register");
    const user = useFetch(`getUser/${username}/Student`);

    const userLogout = () => {
        localStorage.removeItem("token");
        navigate("/", { replace: true });
    }

    const formik = useFormik({
        initialValues: {
            username: username,
            fname: "" || user[0]?.apiData?.fname,
            lname: "" || user[0]?.apiData?.lname,
            clg: "" || user[0]?.apiData?.clg,
            reg: "" || user[0]?.apiData?.reg,
            uni: "" || user[0]?.apiData?.uni,
            dob: "" || user[0]?.apiData?.dob,
        },
        enableReinitialize: true,
        validateOnBlur: false,
        validateOnChange: false,
        onSubmit: async values => {
            values = await Object.assign(values, { profile: file || "" || user[0]?.apiData?.profile });
            console.log(values);
            const response = updateStudent(values, "update");
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

    

    return (
        <div className="studentContainer">
            <Toaster position="top-center" reverseOrder={false}></Toaster>
            <div className="student">
                <div className="body">
                    <form onSubmit={formik.handleSubmit}>
                        <label htmlFor="avatar">
                            <img className="avatar" src={file ||user[0]?.apiData?.profile || avatar  } alt="profile" />
                        </label>
                        <div className="fields">
                        <span>
                            {
                                user[0]?.apiData?.fname ? <div>{user[0].apiData.fname} &nbsp; {user[0].apiData.lname}</div> : <div><input {...formik.getFieldProps("fname")} type="text" id="firstName" placeholder="First name" /><input {...formik.getFieldProps("lname")} type="text" id="lastName" placeholder="Last name" /> </div>
                            }
                        </span>
                        <span>
                            {
                                user[0]?.apiData?.email ? user[0].apiData.email : <input type="text" placeholder="Email" />
                            }
                        </span>
                        <span>
                            {
                                user[0]?.apiData?.clg ? user[0].apiData.clg : <input {...formik.getFieldProps("clg")} type="text" id="clgName" placeholder="Collage name" />
                            }
                        </span>
                        <span>
                            {
                                user[0]?.apiData?.reg ? user[0].apiData.reg : <input {...formik.getFieldProps("reg")} type="text" id="regNo" placeholder="Register number" />
                            }
                        </span>
                        <span>
                            {
                                user[0]?.apiData?.uni ? user[0].apiData.uni : <input {...formik.getFieldProps("uni")} type="text" id="uniName" placeholder="Univercity name" />
                            }
                        </span>
                        <span>
                            {
                                user[0]?.apiData?.dob ? user[0].apiData.dob : <input {...formik.getFieldProps("dob")} type="text" id="dob" placeholder="Date of birth" onFocus={(e) => { e.target.type = 'date'}} onBlur={(e) => {e.target.type = 'text'}}/>
                            }
                        </span>
                            <input onChange={onUpload} type="file" id="avatar" name="avatar" />
                            <button type="submit">Update</button>
                        </div>
                    </form>
                </div>
                <button className="logout" onClick={userLogout} type="button">Logout</button>
            </div>
            <div className="restBody">
                <fieldset>
                    <legend>{username}</legend>
                    <div className="bo">
                        <div className="topNav">
                            <button onClick={() => {setTab("register")}}>Register For Exam</button>
                            <button onClick={() => {setTab("viewRegistered")}}>View Registered Exam</button>
                            <button onClick={() => {setTab("hallticket")}}>Hall Ticket</button>
                        </div>
                        <div className="restB">
                            {
                                tab == "register" && <Register/>
                            }
                            {
                            tab == "viewRegistered" && <ViewRegister />
                            }
                            {
                            tab == "hallticket" && <HallTicket />
                            }
                        </div>
                    </div>
                </fieldset>
            </div>
        </div>
    );
}

function Register() {
    const navigate = useNavigate();

    const handleExamClick = (exam) => {
        navigate(`/profile/student/register/${exam}`);
    }
    const username = localStorage.getItem('username');
    const ExamList = useFetch(`listexam/Student/${username}/show/all`);
    const [{isLoading, apiData, serverError }] = ExamList;
    return(
        <div className="RegisterContent">
            {
                apiData?.length ? (
            <div className="yesContainer">
            {apiData?.map((name, index) => (
                            <div  key={index} className="contentBox" onClick={() => handleExamClick(name._doc.examname)}>
                <span className="listExam">{name._doc.examname}</span> 
                <span>{`(${name._doc.examdate})`}</span>          
                 </div>

              ))}
            </div>):(
                <div className="noContainer">
                    Nothing to Show Here
                </div>
            )
}
        </div>
    );
}
function ViewRegister() {

    const ExamList = useFetch(`/verify/registerExam/${username}/all/list`)
    const [{isLoading, apiData, serverError }] = ExamList;

    return(
        <div className="RegisterContent">
        {
            apiData?.length ? (
        <div className="yesContainer">
        {apiData?.map((name, index) => (
                        <div className="contentBox"  key={index} >
            <span className="listExam">{name}</span> 
             </div>

          ))}
        </div>):(
            <div className="noContainer">
                Nothing to Show Here
            </div>
        )
}
    </div>
    );
}
function HallTicket() {
    const [hallticket, setHallticket] = useState(null);
    const ExamList = useFetch(`/verify/registerExam/${username}/all/list`);
    const [{ isLoading, apiData, serverError }] = ExamList;
    const [name2, setName] = useState();
    const [pdfURL, setPdfURL] = useState('');
  
    // const getcHallticket = (name, username) => {
    //   getHallticket({ examname: name, username: username })
    //     .then(response => {
    //         console.log(response.data)
    //         const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
    //       const blobUrl = URL.createObjectURL(pdfBlob);
    //       setHallticket(response.data);
    //       setBlobUrl(blobUrl);

          


    //     })
    //     .catch(error => {
    //       console.error(error);
    //     });
    // };
  
    // const downloadHallticket = () => {
    //   if (blobUrl) {
    //     window.open(blobUrl, '_blank');
    //   }
    // };
  
    
      const downloadPdf = async (examname) => {
        try {
            setName(examname);7
          const response = await fetch('http://127.0.0.1:8000/api/getHallticket/${examname}/${username}`, {
            method: 'GET',
            responseType: 'blob',
          });
          if (response.ok) {
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            setPdfURL(url);
          } else {
            alert('Hallticket Not Generated');
            console.error('Error while fetching PDF:', response.status);
          }
        } catch (error) {
          console.error('Error while fetching PDF:', error);
        }
      };

      const download = () => {
        const link = document.createElement('a');
        link.href = pdfURL;
        link.download = 'hallticket.pdf';
        link.click();
        window.location.reload(false);
      }

    return (
      <div className="RegisterContent">
        {apiData?.length ? (
          <div className="yesContainer">
            {apiData.map((name, index) => (
              <div className="contentBox" onClick={() => downloadPdf(name)} key={index}>
                <span className="listExam">{name}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="noContainer">Nothing to Show Here</div>
        )}
  
        {pdfURL && (
          <div className="popUp">
            <PictureAsPdfIcon className="ico" />
            <button onClick={download}>Download Hall Ticket for {name2} </button>
          </div>
        )}
      </div>
    );
  }
  
  

