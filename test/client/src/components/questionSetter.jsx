import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import useFetch from "../hooks/fetch.hook";
import { saveExam, submitExamQsetter } from "../helper/helper";
import toast, { Toaster } from "react-hot-toast";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import './style.scss'

const username = localStorage.getItem('username');

export default function Qset() {
    const { examList, admin } = useParams();
    const [tab, setTab] = useState("addNew");
    const [questions, setQuestions] = useState([]);
    const navigate = useNavigate();

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

    const handleUpdate = () => {
        console.log('hello');
    }

    const handleFinalSubmit = async () => {
        let submitPromise = submitExamQsetter({ username: username, admin: admin, exam: examList })
        toast.promise(submitPromise, {
            loading: "Submitting...",
            success: <b>Submitted Succesfully</b>,
            error: <b>Submission Failed</b>
        });
    }
    return (
        <div className="QsetterContainer">
            <Toaster position="top-center" reverseOrder={false}></Toaster>
            <div className="upperBody">
                <span>{examList}</span>
                <span>Set Questions</span>
                <span>{admin}</span>
            </div>
            <div className="middleBody">
                {tab == "addNew" && <FormQuestion
                    questions={questions}
                    setQuestions={setQuestions}
                    initialValues={formik.values}
                    onSubmit={formik.handleSubmit} />}
                {tab == "viewSaved" && <SavedQuestion />}

            </div>
            <div className="lowerBody">
                <button type="submit" onClick={handleSavedButton}>{tab === "addNew" ? "View Saved Questions" : "Add Questions"}</button>
                {tab === "addNew" && (
                    <button type="submit" onClick={formik.handleSubmit}>
                        Save
                    </button>
                )}
                {tab === "viewSaved" && (
                    <button type="submit" onClick={handleUpdate}>
                        Update
                    </button>
                )}
                <button type="submit" onClick={handleFinalSubmit}>Submit </button>
            </div>
        </div>
    );
}

export function FormQuestion({ questions, setQuestions, initialValues, onSubmit }) {
    const { examList, admin } = useParams();
    const navigate = useNavigate();
    const [addORupload,setAddorUpload] = useState(false);

    const formik = useFormik({
        initialValues: initialValues,
        enableReinitialize: true,
        validateOnBlur: false,
        validateOnChange: false,
        onSubmit: async values => {
            setQuestions([...questions, values]);
            formik.resetForm();
        }
    });

    const handleUpload = (e) => {
        const file = e.target.files[0];
        if (file.type === "text/xml") {
        } else {
          alert("Please select an XML file.");
        }
    }

    const handleAddQuestion = () => {
        const newQuestion = { question: "", options: ["", "", "", ""], answer: "" };
        setQuestions([...questions, newQuestion]);
    };

    const handleDeleteQuestion = (index) => {
        const updatedQuestions = [...questions];
        updatedQuestions.splice(index, 1);
        setQuestions(updatedQuestions);
    };

    const handleQuestionChange = (event, index) => {
        const { name, value } = event.target;
        const updatedQuestions = [...questions];
        updatedQuestions[index][name] = value;
        setQuestions(updatedQuestions);
    };

    const handleOptionChange = (event, questionIndex, optionIndex) => {
        const { value } = event.target;
        const updatedQuestions = [...questions];
        updatedQuestions[questionIndex].options[optionIndex] = value;
        setQuestions(updatedQuestions);
    };

    const handleAnswerChange = (event, index, optionIndex) => {
        const { value } = event.target;
        const updatedQuestions = [...questions];
        updatedQuestions[index].answer = `${optionIndex}`;
        setQuestions(updatedQuestions);
    };
    return (
        <div className="middleBody2">
            <form onSubmit={formik.handleSubmit}>
                {questions.map((question, index) => (
                    <div className="form" key={index}>
                        <div className="question-number">
                            <span>Question {index + 1}:</span>
                            < DeleteForeverIcon onClick={() => handleDeleteQuestion(index)} />
                        </div>
                        <textarea {...formik.getFieldProps("question")}
                            name="question"
                            value={question.question}
                            onChange={(event) => handleQuestionChange(event, index)}
                        />
                        <div className="options">
                            {question.options.map((option, optionIndex) => (
                                <div className="option" key={optionIndex}>
                                    <input {...formik.getFieldProps("optionRadio")}
                                        type="radio"
                                        name={`answer-${index}`}
                                        value={`${optionIndex}`}
                                        checked={question.answer === `${optionIndex}`}
                                        onChange={(event) => handleAnswerChange(event, index, optionIndex)}
                                    />
                                    <input {...formik.getFieldProps("options")}
                                        type="text"
                                        value={option}
                                        onChange={(event) => handleOptionChange(event, index, optionIndex)}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </form>
            {questions.length ===  0 ? (
           <div>
            <form>
             <label htmlFor="fileUpload">
             <div className="uploadBtn"><span>Upload</span></div>
             </label>
            <input type="file" name="fileUpload" id="fileUpload" onChange={(e) => handleUpload(e)} accept=".xml"/>
            </form>
           </div>
            )
 : (
    <span></span>
    )}
            <button className="addBtn" onClick={handleAddQuestion}>Add Question</button>
        </div>
    );
}

export function SavedQuestion() {
    const { examList, admin } = useParams();
    const questionsListSaved = useFetch(`listexam/QSetter/${username}/saved/${examList}`)
    const [{ isLoading, apiData = [], serverError }] = questionsListSaved;

    const handleDeleteQuestion = (index) => {
        // const updatedQuestions = [...questions];
        // updatedQuestions.splice(index, 1);
        // setQuestions(updatedQuestions);
    };
    return (
        <div className="SavedQuestions">
            {questionsListSaved[0]?.apiData?.questionPaper?.map((question, index) => (
                <div className="savedContainer" key={index}>
                    {question?.questions.map((qp, index2) => (
                        <div key={index2} className="questionsSaved">
                            <div className="question">
                            {qp.question}<DeleteForeverIcon onClick={() => handleDeleteQuestion(index)} />
                            </div>
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