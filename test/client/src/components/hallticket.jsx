import React, { useState } from "react";
import useFetch from "../hooks/fetch.hook";
import NotificationAddIcon from '@mui/icons-material/NotificationAdd';
import "./style.scss";
import toast,{ Toaster } from "react-hot-toast";
import { generateHallticket } from "../helper/helper";
const username = localStorage.getItem('username');

export default function Hallticket() {

    const exams = useFetch(`listexam/admin/${username}/show/all`);

    const [{ isLoading, apiData, serverError }] = exams;
    const [selectedExam, setSelectedExam] = useState();
    const evqs = useFetch(`evqs/${selectedExam}`);
    const handleExamClick = (name) => {
        setSelectedExam(name);
    }
    const generate = () => {
        generateHallticket(selectedExam);
        toast.success('Generated Successfully')
    }
    return (
        <div className="Hallticket">
                    <Toaster position="top-center" reverseOrder={false}></Toaster>
            <div className="top">
                <div className="topContainer">
                    {
                        exams[0]?.apiData?.length ? (
                            <div className="YesContainer">
                                {exams[0]?.apiData?.map((name, index) => (
                                    <div className="contentBox" key={index}>
                                        <span className="listExam" onClick={() => { handleExamClick(name.examname) }}>{name.examname}</span>
                                        <span>{`(${name.examdate})`}</span>
                                    </div>

                                ))}
                            </div>) : (
                            <div className="noContainer">
                                <span>Nothing to Show Here</span>
                            </div>
                        )
                    }
                </div>
            </div>
            <div className="mid">
                <div className="midContainer">
                    {
                        selectedExam?.length ? (
                            <div className="yesContainer">
                                <span>Number of Students Registered : 0</span>
                                <span>Question Paper Status : Not Completed</span>
                                <span>Center Updated Status : Completed</span>
                                <button onClick={generate}>Generate Hall Ticket for {selectedExam}</button>
                            </div>
                        ) : (
                            <div className="noContainer">
                                <span>Nothing To Show Here</span>
                            </div>
                        )
                    }

                </div>
            </div>
            <div className="bottom">
                <div className="bottomContainer">
                    {evqs[0]?.apiData?.map((name, index) => (
                        <span className="list-item" key={index}>{name.username} <NotificationAddIcon className="notifybtn" /></span>
                    ))}
                </div>
            </div>
        </div>
    );
}