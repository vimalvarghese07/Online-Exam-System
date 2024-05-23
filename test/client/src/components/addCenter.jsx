import React,{useState} from "react";
import { useNavigate, useParams } from "react-router-dom";
import useFetch from "../hooks/fetch.hook";
import toast, { Toaster } from "react-hot-toast";
import { useFormik } from "formik";
import { exam2Validate } from "../helper/validate";
import './style.scss';
import { updateExamCenter } from "../helper/helper";

const username = localStorage.getItem('username');

export default function CenterAdd(){
      const navigate = useNavigate();

    const centerList = useFetch("getCenter");
    const [checkedList, setCheckedList ] = useState([]);
    const examList = useFetch(`/listexam/admin/${username}/none/none`);
    const [{ isLoading, apiData = [], serverError }] = examList;

    const formik = useFormik({
        initialValues: {
          exam: "",
        },
        validate: exam2Validate,
        validateOnBlur: false,
        validateOnChange: false,
        onSubmit: async values => {
            if (checkedList.length === 0) {
                toast.error('Atleast Choose One Center')
            }else{
                let updateExamPromise = updateExamCenter({...values,admin:username,center:checkedList});
                toast.promise(updateExamPromise,{
                    loading:"Updating",
                    success : <b>Update success...!</b>,
                    error : <b>Coudn't Update Center</b>
                });
                updateExamPromise.then(res => {
                    navigate('/profile');
                  })
            }
        }
      });

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
            <div className="centerContainer">
                <form onSubmit={formik.handleSubmit}>
                <select {...formik.getFieldProps("exam")}>
                  <option value="">Select Exam</option>
                    {apiData?.map((examname, index) => (
                        <option key={index} value={examname.examname}>{examname.examname}</option>
                    ))}
                </select>
                {
                    centerList[0]?.apiData?.Center?.map((center, index) => (
                        <label key={index} className="list-item">
                            <span>{center.centername}</span>
                            <span>Seats Available :{center.capacity}</span>
                            <input type="checkbox" {...formik.getFieldProps("checkbox")} onChange={(e) => CheckList({...e, value:center.centername})}/>
                        </label>
                    ))
                }
                <input type="submit" value="Submit" />
                </form>
            </div>
        </div>
    );
}