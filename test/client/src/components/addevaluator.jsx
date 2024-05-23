import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useFetch from "../hooks/fetch.hook";
import { useFormik } from "formik";
import toast, { Toaster } from "react-hot-toast";
import './style.scss';
import { updateEvaluator } from "../helper/helper";
import { exam2Validate } from "../helper/validate";

const username = localStorage.getItem('username');

export default function EvaluatorAdd() {
  const navigate = useNavigate();
  const [checkedList, setCheckedList ] = useState([]);
  const [currentListItem, setCurrentListItem] = useState([]);
  const [examList, setExamList] = useState([]);
  const evaluator = useFetch('list/Evaluator');
  const examL = useFetch(`listexam/Evaluator/${username}/add/none`);
  const examLi = examL[0].apiData;
  function getListData(data) {
    if (data == 'Evaluator') {
      if (evaluator[0]?.apiData?.length == 0) {
        alert("No Evaluators Registered in the system");
      }
      const [{ isLoading, apiData, serverError }] = evaluator;
      setCurrentListItem(apiData);
    }
  }
  
  const formik = useFormik({
    initialValues: {
      exam: ""
    },
    validate: exam2Validate,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async values => {
      if (checkedList.length === 0) {
        toast.error("Choose Atleast One Question Paper Setter")
      }
      else{
        let user = localStorage.getItem("username");
        let updateEvaluatorPromise = updateEvaluator({...values,user:user,evals:checkedList},"exam");
        toast.promise(updateEvaluatorPromise, {
            loading : "Checking...",
            success : <b>Update success...!</b>,
            error : <b>Coudn't Add Evaluator</b>
        });
        updateEvaluatorPromise.then(res => {
          window.location.reload(false);
          navigate('/profile');
        })
      }
     
    }
  });



  const HandleListItemClick = (endpoint) => {
    getListData(endpoint);
    setExamList(examLi);
  }
  function CheckList(params) {
    if (params.target.checked) {
      setCheckedList(prev => [...prev, params.value]);
      return ;
    }
    setCheckedList(checkedList.filter(item => item !== params.value));
    
  }


  return (
    <div className="addContainer">
      <Toaster position="top-center" reverseOrder={false}></Toaster>
      {
        currentListItem.length ? (
          <div className="yesContent">
            <h1>Evaluator</h1>
            <span>
              <form onSubmit={formik.handleSubmit}>
                <select {...formik.getFieldProps("exam")}>
                  <option value="">Select Exam</option>
                  {
                    examLi.map((name, index) => (
                      <option value={name._doc.examname} key={index}>
                        {name._doc.examname}
                      </option>
                    ))}
                </select>
                {currentListItem.map((name, index) => (
                  <label key={index} className="list-item">
                    {name._doc.username}
                    <input {...formik.getFieldProps("evaluator")} type="checkbox" onChange={(e) => CheckList({...e,value:name._doc.username})}/>
                  </label>
                ))}
                <input type="submit" value="Add" />
              </form>
            </span>
          </div>

        ) : (
          <div className="noContent">
            <h1><button onClick={() => HandleListItemClick('Evaluator')}>Fetch List</button></h1>
          </div>
        )
      }

    </div>
  );
}