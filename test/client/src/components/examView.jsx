import React, { useState } from "react";
import axios from "axios";
import useFetch from "../hooks/fetch.hook";
const username = localStorage.getItem('username');

export default function ExamView() {
    const ExamList = useFetch(`/listexam/admin/${username}/none/all`);

    const [registeredStudents,setRegisterdStudents] = useState([]);
    const [ExamArray,setExamArray] = useState([]);

    const handleAsideClick = async (examname,index) => {
        setExamArray(ExamList[0]?.apiData[index]);
        if (!ExamArray.questionPaper) {
            ExamArray.questionPaper = [];
        }
        const regLength = await axios.get(`api/getRegisteredStudents/${examname}`);
        setRegisterdStudents(regLength.data);
    }



    return (
        <div className="ExamViewContainer">
            <aside>
                <div className="sqare">
                    {
                        ExamList[0]?.apiData?.map((exam, index) => (
                            <div className="sqare-items" key={index} onClick={() => {handleAsideClick(exam.examname,index)}}>{exam.examname}</div>
                        ))
                    }
                </div>
            </aside>
            <section>
                <div className="body">
                    {
                        ExamArray?.length != 0 ? (
                            <div className="yesContainer">
                                <span className="title">{ExamArray.examname}</span>
                                <span className="date">{ExamArray.examdate}</span>
                                <span className="ExamFee">Exam Fee : {ExamArray.examfee}</span>
                                <span className="ExamCenters">Exam Centers :{ExamArray?.center?.map((center,index) => (
                                    <div className="centername" key={index}>{center}</div>
                                ))}</span>
                                {/* <span className="qsetter">Question Paper Setters :{ExamArray?.questionPaper?.map((qsetter,index) => (
                                    <div className="QsettersList" key={index}>{qsetter.username}</div>
                                ))}</span> */}
                                <span className="nofregstds">Number Of Registered Students :&nbsp;{registeredStudents?.length}</span>
                            </div>
                        ) : (
                            <div className="noContainer">Click On Any Exam To View Details</div>
                        )
                    }
                </div>
            </section>
        </div>
    );
}