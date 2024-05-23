import React, { useState } from "react";
import useFetch from "../hooks/fetch.hook";
import { getAnswerSheet } from "../helper/helper";
const username = localStorage.getItem('username');

export default function PublishResult(){
    const [selectedexam,setSelectedexam] = useState();
    const exam = useFetch('listexam/admin/admin/none/all');
    const handleExamClick = (name) => {
        setSelectedexam(name);
        const answerSheet = getAnswerSheet(name,username);
    }
    return(
        <div className="ResultContainer">
            <div className="body">
                <aside className="aside">
                        {
                            exam[0]?.apiData?.map((data,index) => (
                                <span onClick={()=>handleExamClick(data.examname)} key={index}>{data.examname}</span>
                            ))
                        }
                </aside>
                <section>
                    {selectedexam ? (
                        <div className="yesContainer">
                            <div></div>
                            <div></div>
                            <div></div>
                        </div>
                    ):(
                        <div className="noContainer">
                            <span>Please Click On Exam To View Result</span>
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}

