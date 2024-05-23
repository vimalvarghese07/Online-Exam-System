import React,{useState} from "react";
import axios from "axios";
import useFetch from "../hooks/fetch.hook";
const username = localStorage.getItem('username');

export default function RegStudentView(params) {
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
    return(
        <div className="ExamViewContainer">
                       <aside>

                <span className="regl">Registered Students : [{registeredStudents?.length}]</span>
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
                {ExamArray ? (
                    <div className="yesContainer">
                        {
                            registeredStudents?.length ? (
                                <div className="yes">
                                    {
                                        registeredStudents?.map((name,index) => (
                                            <div key={index} className="nameList"><span>{name.fname} {name.lname}</span></div>
                                        ))
                                    }
                                </div>
                            ) : (
                                <div className="no">
                                    <span>Click On Exam To View List</span>
                                </div>
                            )
                        }
                    </div>
                    ) : (
                        <div className="noContainer">
                            <span>Click On Exam To View List</span>
                        </div>
                    )
                }
                </div>
            </section>
        </div>
    );
}