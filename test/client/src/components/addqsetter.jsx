import React,{useState} from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import useFetch from "../hooks/fetch.hook";
import { updateEvaluator, updateQSetter } from "../helper/helper";
import { exam2Validate } from "../helper/validate";
import { useFormik } from "formik";

import './style.scss';

export default function QsetterAdd(){
  const username = localStorage.getItem('username');
    const navigate = useNavigate();
    const [currentListItem, setCurrentListItem] = useState([]);
    const [checkedList, setCheckedList ] = useState([]);
    const [examList, setExamList] = useState([]);
    const qsetter  = useFetch('list/QSetter');
    const examL = useFetch(`listexam/QSetter/${username}/add/none`);
    const examLi = examL[0].apiData;
    function getListData(data){
        if (data == 'QSetter') {
          if (qsetter[0]?.apiData?.length == 0) {
            alert("No Question Paper Setter Registered in the system");
          }
          const [{isLoading, apiData, serverError }] = qsetter;
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
          let updateQSetterPromise = updateQSetter({...values,user:user,evals:checkedList},"exam");
          toast.promise(updateQSetterPromise, {
              loading : "Checking...",
              success : <b>Update success...!</b>,
              error : <b>Coudn't Add Question Paper Setter</b>
          });
          updateQSetterPromise.then(res => {
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
                    <h1>Question Paper Setter</h1>
                  <span>
                    <form onSubmit={formik.handleSubmit}>
                    <select {...formik.getFieldProps("exam")}>
                  <option value="">Select Exam</option>
                  {
                    examLi.map((name, index) => (
                      <option value={name._doc.examname} key={index} >
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
                  <h1><button  onClick={() => HandleListItemClick('QSetter')}>Fetch List</button></h1>
                </div>
              )
            }
        
        </div>
    );
}