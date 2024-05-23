import React,{useEffect, useState} from "react";
import { useParams } from "react-router-dom";
import "./style.scss";
import toast, { Toaster } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import useFetch from "../hooks/fetch.hook";
import axios from "axios";
import { registerExam } from "../helper/helper";
const username = localStorage.getItem('username');

export default function RegisterExam() {
    const { exam } = useParams();
    const navigate = useNavigate();
    const user = useFetch(`getUser/${username}/Student`);
    const examReg = useFetch(`/listexam/Student/${username}/reg/${exam}`);

    const [error, setError] = useState(false);

    const res = async () =>{
        const data = await axios.get(`api/verify/registerExam/${username}/${exam}`);
        return data;
    }
    useEffect(() => {
        const fetchExam = async () => {
            try {
                const { data } = await axios.get(`api/verify/registerExam/${username}/${exam}/check`);
                console.log(data);
                if (data.msg === "exam Registered Already") {
                    setError(true);
                }
            } catch (err) {
                console.error(err);
                setError(true);
            }
        };
        fetchExam();
    }, [exam]);

    if(error){
        return <AlreadyRegistered />
    }
  
    const handlePay = () => {
        let credentials = { username: username, fname: user[0]?.apiData?.fname, lname: user[0]?.apiData?.lname, email: user[0]?.apiData?.email, clg: user[0]?.apiData?.clg, reg: user[0]?.apiData?.reg, uni: user[0]?.apiData?.uni, dob: user[0]?.apiData?.dob,exam:exam };
        if (credentials.username === '' || credentials.firstname === '' || credentials.lastname === '' || credentials.email === '' || credentials.college === '' || credentials.reg === '' || credentials.uni === '' || credentials.dob === '' || credentials.exam === '') {
            toast.error('Required Field Is Missing')
        }
        let registerExamPromise = registerExam(credentials);
        toast.promise(registerExamPromise,{
            error:<b>Coudn't Register</b>,
            loading:<b>Registering</b>,
            success:<b>Succesfully Registered!!</b>
        });
        registerExamPromise.then(res => {
            if(res.data.message != 'Exam data saved successfully'){
                toast.error(res.data.message);
            }else{
                navigate('/profile');
            }
        });
    }
    return (
        <div className="registerExam">
            <Toaster position="top-center" reverseOrder={false}></Toaster>
            <div className="top"><span>{exam}</span></div>
            <div className="mid">
                <div className="contentBox">
                    <form>
                        <span>
                            {
                                user[0]?.apiData?.fname ? <div>{user[0].apiData.fname} {user[0].apiData.lname}</div> : <input type="text" placeholder="Full Name" />
                            }
                        </span>
                        <span>
                            {
                                user[0]?.apiData?.email ? user[0].apiData.email : <input type="text" placeholder="Email" />
                            }
                        </span>
                        <span>
                            {
                                user[0]?.apiData?.clg ? user[0].apiData.clg : <input type="text" placeholder="College Name" />
                            }
                        </span>
                        <span>
                            {
                                user[0]?.apiData?.reg ? user[0].apiData.reg : <input type="text" placeholder="Register Number" />
                            }
                        </span>
                        <span>
                            {
                                user[0]?.apiData?.uni ? user[0].apiData.uni : <input type="text" placeholder="University" />
                            }
                        </span>
                        <span>
                            {
                                user[0]?.apiData?.dob ? user[0].apiData.dob : <input type="date" placeholder="DOB" />
                            }
                        </span>
                        <span className="feebtn">
                            {
                                examReg[0]?.apiData?.map((examfee, index) => (
                                    <div key={index} onClick={() => handlePay()}>
                                        {/* Pay : {examfee._doc.examfee} */}
                                        Register Now
                                        </div>
                                ))
                            }
                        </span>
                    </form>
                </div>
            </div>
        </div>
    );
}

export function AlreadyRegistered(){
    return(
        <div className="AlreadyRegisteredContainer">
            <span>Already Registered</span>
        </div>
    );
}