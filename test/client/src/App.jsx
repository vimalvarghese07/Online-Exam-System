import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.scss";

import Home from "./components/home";
import Register from "./components/register";
import Login from "./components/login";
import Reset from "./components/reset";
import OTP from "./components/otp";
import Password from "./components/password";
import Profile from "./components/profile";
import PageNotFound from "./components/pageNotFound";
import Evaluator from "./components/profiles/evaluator";
import QSetter from "./components/profiles/qsetter";
import QSet from "./components/questionSetter";
import ESet from "./components/questionEvaluator";
import Student from "./components/profiles/student";
import Admin from "./components/profiles/admin";
import QsetterAdd from "./components/addqsetter";
import Hallticket from "./components/hallticket";
import { AuthorizeAdmin, AuthorizeEvaluator, AuthorizeQsetter, AuthorizeStudent, AuthorizeUser, ProtectRoute } from "./middleware/auth";
import EvaluatorAdd from "./components/addevaluator";
import ExamAdd from "./components/addEXAM";
import CenterAdd from "./components/addCenter";
import ExamView from "./components/examView";
import RegisterExam from "./components/registerExam";
import RegStudentView from "./components/registeredStudents"
import PublishResult from "./components/publishresult";

export default function App() {
    const router = createBrowserRouter([
        {
            path : "/",
            element : <Home/>
        },
        {
            path : "/login",
            element : <Login/>
        },
        {
            path : "/reset",
            element : <Reset/>
        },
        {
            path : "/otp",
            element : <ProtectRoute><OTP/></ProtectRoute>
        },
        {
            path : "/password",
            element : <Password/>
        },
        {
            path : "/profile",
            element : <AuthorizeUser><Profile/></AuthorizeUser>
        },
        {
            path : "/profile/admin",
            element : <Admin />
        },
        {
            path : "/profile/admin/qsetter",
            element : <AuthorizeAdmin><QsetterAdd /></AuthorizeAdmin>
        },
        {
            path : "/profile/admin/evaluator",
            element : <AuthorizeAdmin><EvaluatorAdd /></AuthorizeAdmin>
        },
        {
            path : "/profile/admin/exam",
            element : <AuthorizeAdmin><ExamAdd /></AuthorizeAdmin>
        },
        {
            path : "/profile/admin/center",
            element : <AuthorizeAdmin><CenterAdd /></AuthorizeAdmin>
        },
        {
            path : "/profile/admin/hallticket",
            element : <AuthorizeAdmin><Hallticket /></AuthorizeAdmin>
        },
        {
            path : "/profile/admin/examdetails",
            element : <AuthorizeAdmin><ExamView /></AuthorizeAdmin>
        },
        {
            path : "/profile/admin/registeredstudents",
            element :<AuthorizeAdmin><RegStudentView/></AuthorizeAdmin>
        },
        {
            path: "/profile/admin/publishresult",
            element: <AuthorizeAdmin><PublishResult/> </AuthorizeAdmin>
        },
        {
            path : "/profile/evaluator",
            element : <AuthorizeEvaluator><Evaluator /></AuthorizeEvaluator>
        },
        {
            path : "/profile/qsetter",
            element : <AuthorizeQsetter><QSetter /></AuthorizeQsetter>
        },
        {
            path: "/setQuestion/:examList/:admin",
            element: <AuthorizeQsetter> <QSet/> </AuthorizeQsetter>
        },
        {
            path: "/EvaluateQuestion/:examList/:admin",
            element: <AuthorizeEvaluator> <ESet/> </AuthorizeEvaluator>
        },
        {
            path : "/profile/student",
            element : <AuthorizeStudent><Student /></AuthorizeStudent>
        },
        {
            path : "/profile/student/register/:exam",
            element : <AuthorizeStudent><RegisterExam /></AuthorizeStudent>
        },
        {
            path : "/register",
            element : <Register/>
        },
        {
            path : "*",
            element : <PageNotFound/>
        }
    ]);
    return(
        <main className="main">
            <RouterProvider router={router}></RouterProvider>
        </main>
    );
}