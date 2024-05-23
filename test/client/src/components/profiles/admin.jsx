import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import useFetch from "../../hooks/fetch.hook";
import CancelIcon from '@mui/icons-material/Cancel';
import "./style.scss";
import { getProfileInfos } from "../../helper/helper";

const username = localStorage.getItem('username');

export default function Admin(props) {

  const evaluator = useFetch('list/Evaluator');
  const student = useFetch('list/Student');
  const center = useFetch('list/center');
  const qsetter = useFetch('list/QSetter');
  const user = useFetch(`getUser/${username}/Admin`);

  const [serverError,apiData=[],status] = user;
  const [userdata,setUserdata] = useState();
  const navigate = useNavigate();

  const [currentListItem, setCurrentListItem] = useState([]);
  const [centerList, setCenterList] = useState([]);

  function getListData(data) {
    if (data == 'QSetter') {
      setCenterList([]);
      const [{ isLoading, apiData, serverError }] = qsetter;
      setCurrentListItem(apiData);
    }
    else if (data == 'Evaluator') {
      setCenterList([]);
      const [{ isLoading, apiData, serverError }] = evaluator;
      setCurrentListItem(apiData);
      
      
    }
    else if (data == 'Student') {
      setCenterList([]);
      const [{ isLoading, apiData, serverError }] = student;
      setCurrentListItem(apiData);

    }
    else if (data == 'center') {
      const [{ isLoading, apiData, serverError }] = center;
      setCenterList(apiData[0]?._doc.Center);
      setCurrentListItem(apiData);

    }
  }


  const list = [
    { name: "Question Paper Setter", endpoint: 'QSetter' },
    { name: "Evaluator", endpoint: 'Evaluator' },
    { name: "Student", endpoint: 'Student' },
    { name: "Center", endpoint: 'center' },
  ];

  const userLogout = () => {
    localStorage.removeItem("token");
    navigate("/", { replace: true });
  }

  const defaultLabelStyle = {
    color: 'white',
    fontFamily: 'sans-serif',
  };

  const HandleListItemClick = (endpoint) => {
    getListData(endpoint);
  }

  const getProfileInfo = () => {
    let dialogueBox = document.getElementById('dialoguebox');
    dialogueBox.classList.remove("dontshow");
    dialogueBox.classList.add("show");
  }

  const getDetails = (data) => {
    let element = document.getElementById('profileBox');
    element.classList.add('show');
    let cred = data._doc.type;
    let cred2 = data._doc.username;
    let getDetailsPromise = getProfileInfos({cred:cred,cred2:cred2});
    getDetailsPromise.then(res => {
      setUserdata(res.data);
    })
  }

  const handleClose = () => {
    let dialogueBox = document.getElementById('dialoguebox');
    let dialogueBox2 = document.getElementById('profileBox');
    dialogueBox.classList.remove("show");
    dialogueBox2.classList.remove("show");
    dialogueBox.classList.add("dontshow");
    dialogueBox2.classList.add("dontshow");
  }
  
  function handleAsideClick(pageName) {
    switch (pageName) {
      case 'QSetter':
        navigate('qsetter');
        break;
      case 'Evaluator':
        navigate('evaluator');
        break;
      case 'Exam':
        navigate('exam');
        break;
      case 'Center':
        navigate('center');
        break;
      case 'HallTicket':
        navigate('hallticket');
        break;
      case 'ViewExam':
        navigate('examdetails');
        break;
      case 'Profile':
        getProfileInfo();
        break;
      case 'ViewRegisteredStudents':
        navigate('registeredstudents');
        break;
      case 'publishresult':
        navigate('publishresult');
        break;
      default:
        break;
    }
  }

  

  return (
    <div className="admin">
      <Toaster position="top-center" reverseOrder={false}></Toaster>
      <div className="dialoguebox dontshow" id="dialoguebox">
        <CancelIcon className="cancelbtn" onClick={() => handleClose() } />
        <div className="contentBox">
          <table>
            <tr>
              <td>Username</td>
              <td> {user[0]?.apiData?.username}</td>
            </tr>
            <tr>
              <td>Email</td>
              <td>{user[0]?.apiData?.email}</td>
            </tr>
          </table>
        </div>
      </div>
      <section>
        <div className="list">
          <h2>List</h2>
          {list.map((item, index) => (
            <div key={index} className="list-item" onClick={() => HandleListItemClick(item.endpoint)}>
              <div>{item.name}</div>
            </div>
          ))}
        </div>
        <div className="restBody">
          <div className="ListView">
            {
              currentListItem.length ? (
                <div className="yesContent">
                  {
                    centerList.length ? (
                      <span>
                        {centerList.map((name, index) => (
                      <span key={index} className="list-item">{name.centername}<span>Capacity : {name.capacity}</span></span>
                    ))}
                      </span>
                    ) : (
                    <span>
                    {currentListItem.map((name, index) => (
                      <div>
                        <span onClick={() => getDetails(name)} key={index} className="list-item">{name._doc.username}</span>
                      </div>
                    ))}
                  </span>
                  )
                  }
                </div>

              ) : (
                <div className="noContent">
                  <h1>Nothing to Show Here</h1>
                </div>
              )
            }

          </div>
        </div>
      </section>
      <aside>
        <div className="top">
          <button className="logout" onClick={userLogout} type="button">Logout</button>
          <div className="sqare">
            <div className="sqare-items headingaAside"><b>ADD</b></div>
            <div className="sqare-items" onClick={() => handleAsideClick('QSetter')} >Q Setter</div>
            <div className="sqare-items" onClick={() => handleAsideClick('Evaluator')} >Evaluator</div>
            <div className="sqare-items" onClick={() => handleAsideClick('Center')} >Center</div>
            <div className="sqare-items" onClick={() => handleAsideClick('Exam')} >Exam</div>
            <div className="sqare-items" onClick={() => handleAsideClick('HallTicket')} >Hall Ticket</div>
          </div>
        </div>
        <div className="bottom">
          <div className="sqare">
            <div className="sqare-items headingaAside"><b>DETAILS</b></div>
            <div className="sqare-items" onClick={() => handleAsideClick('Profile')}>Profile</div>
            <div className="sqare-items" onClick={() => handleAsideClick('ViewExam')}>Exam</div>
            <div className="sqare-items" onClick={() => handleAsideClick('ViewRegisteredStudents')}>Registered Students</div>
            <div className="sqare-items" onClick={() => handleAsideClick('publishresult')}>Publish Result</div>
          </div>
        </div>
      </aside>
      <div className="profileBox" id="profileBox">
        <div className="inside">
          <span>Username: {userdata?.username}</span>
          <span>First name:  {userdata?.fname}</span>
          <span>Last name:  {userdata?.lname}</span>
          <span>Email ID: {userdata?.email}</span>
          <span>Date of birth:  {userdata?.dob}</span>
          <span>Registration number: {userdata?.reg}</span>
          <span>Collage: {userdata?.clg}</span>
        </div>
      <CancelIcon className="cancelbtn" onClick={() => handleClose() } />
      </div>
    </div>
  );
}
