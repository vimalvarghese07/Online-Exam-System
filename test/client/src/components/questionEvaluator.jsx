import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import useFetch from "../hooks/fetch.hook";
import { saveExam, submitExamEvaluator } from "../helper/helper";
import toast, { Toaster } from "react-hot-toast";
import './style.scss';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';

const username = localStorage.getItem('username');

export default function Eset() {
    const { examList, admin } = useParams();
    const [tab, setTab] = useState("addNew");
    const [questions, setQuestions] = useState([]);
    const formik = useFormik({
        initialValues: {
            question: '',
            optionRadio: '',
            options: ''
        },
        enableReinitialize: true,
        validateOnBlur: false,
        validateOnChange: false,
        onSubmit: async values => {
            const saveExamPromise = saveExam({ username: username, questions: questions, admin: admin, examname: examList });
            toast.promise(saveExamPromise, {
                loading: "Submitting...",
                success: <b>Submitted Succesfully</b>,
                error: <b>Submission Failed</b>
            });

        }
    });

    const handleSavedButton = () => {
        setTab(tab === "addNew" ? "viewSaved" : "addNew");
    }



    const handleFinalSubmit = async () => {
        console.log(questions);
        let submitPromise = submitExamEvaluator({ username: username, admin: admin, exam: examList, questionPaper:questions })
        toast.promise(submitPromise, {
            loading: "Submitting...",
            success: <b>Submitted Succesfully</b>,
            error: <b>Submission Failed</b>
        });
    }
    

    return (
        <div className="EvaluatorContainer">
                                <Toaster position="top-center" reverseOrder={false}></Toaster>
            <div className="upperBody">
                <span>{examList}</span>
                <span>Set Questions</span>
                <span>{admin}</span>
            </div>
            <div className="middleBody">
                {tab == "addNew" && <EvaluateQuestion 
                handleSelectedQuestions={setQuestions}
                selectedQuestions = {questions}
                />}
                {tab == "viewSaved" && <SavedQuestion />}
            </div>
            <div className="lowerBody">
                <button type="submit" onClick={handleSavedButton}>{tab === "addNew" ? "View Saved Questions" : "Back"}</button>
                {tab === "addNew" && (
                    <button type="submit" onClick={formik.handleSubmit}>
                        Save
                    </button>
                )}
                {tab === "viewSaved" && (
                    ''
                )}
                {
                    tab === 'viewSaved' && (
                        ''
                    )
                }
                {
                    tab === "addNew" && (
                        <button type="submit" onClick={() => handleFinalSubmit()}>Submit </button>

                    )
                }
            </div>
        </div>
    );
}

export function EvaluateQuestion(props){
    const {admin, examList} = useParams();
    const Questions = useFetch(`/listexamEvaluator/${username}/${admin}/${examList}`);
    const questionpaper = Questions[0]?.apiData;

    const handleSelect = (questions, options, answer) => {
        const selectedQuestionExists = props.selectedQuestions.some(
          (question) => question.questions === questions
        );
      
        if (selectedQuestionExists) {
          const updatedSelectedQuestions = props.selectedQuestions.filter(
            (question) => question.questions !== questions
          );
          props.handleSelectedQuestions(updatedSelectedQuestions);
        } else {
          const newSelectedQuestion = { questions, options, answer };
          props.handleSelectedQuestions([...props.selectedQuestions, newSelectedQuestion]);
        }
      };
      


    return(
        <div className="questionE">
                                <Toaster position="top-center" reverseOrder={false}></Toaster>

            {
                questionpaper ? (
                    <div>
                        {
                           questionpaper?.map((data,index) => (
                            <div key={index}>
                                {
                                data.questionPaper.map((data2,index2) => (
                                    <div key={index2} className="questionBox">
                                        {
                                        data2.questions.map((question,indexQ) => (
                                            <div key={indexQ}  className={`questionBoxInside ${props.selectedQuestions.some(
                                                (selectedQuestion) => selectedQuestion.questions === question.question
                                              ) ? 'selected' : ''}`} onClick={() => handleSelect(question.question,question.options,question.answer)}>
                                                <div>
                                                {indexQ + 1}. &nbsp;{question.question}
                                                
                                                {
                                                question.options.map((option,indexO) =>(
                                                    <div key={indexO} className={indexO == question.answer ? 'correct' : ''} >
                                                        {indexO + 1}. &nbsp;{option}
                                                    </div>
                                                ))
                                                }
                                                </div>
                                            </div>
                                        ))
                                        }
                                    </div>
                                ))
                                }
                            </div>
                           ))
                        }
                    </div>
                ) : (
                    <div></div>
                )
            }
        </div>
    );
}

export function SavedQuestion() {
    const { examList, admin } = useParams();
    const questionsListSaved = useFetch(`/listexam/QSetter/${username}/saved/${examList}`)
    const [{ isLoading, apiData = [], serverError }] = questionsListSaved;
    console.log(questionsListSaved[0]?.apiData)
    return (
        <div className="SavedQuestions">
            {questionsListSaved[0]?.apiData?.questionPaper?.map((question, index) => (
                <div className="savedContainer" key={index}>
                    {question?.questions.map((qp, index2) => (
                        <div key={index2} className="questionsSaved">
                            {index2 + 1}. &nbsp;{qp.questions}
                            <div className="optionsSaved">
                                {qp.options.map((option, index3) => (
                                    <div
                                        key={index3}
                                        className={`option ${index3 === Number(qp.answer) ? 'correct' : ''
                                            }`}
                                            >
                                        {option}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            ))}
        </div>

    );
}


