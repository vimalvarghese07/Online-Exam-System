import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/store";
import jwt_decode from 'jwt-decode';
export const AuthorizeAdmin = ({ children }) => {
    const token = localStorage.getItem("token");
    if(!token) {
        return <Navigate to={"/login"} replace={true}></Navigate>
    }
    let { type } = jwt_decode(token);
    if (type !== "Admin") {
      return <Navigate to={"/login"} replace={true}></Navigate>;
    }
    return children;
}

export const AuthorizeStudent = ({ children }) => {
    const token = localStorage.getItem("token");
    if(!token) {
        return <Navigate to={"/login"} replace={true}></Navigate>
    }
    let { type } = jwt_decode(token);
    if (type !== "Student") {
      return <Navigate to={"/login"} replace={true}></Navigate>;
    }
    return children;
}
export const AuthorizeEvaluator = ({ children }) => {
    const token = localStorage.getItem("token");
    if(!token) {
        return <Navigate to={"/login"} replace={true}></Navigate>
    }
    let { type } = jwt_decode(token);
    if (type !== "Evaluator") {
      return <Navigate to={"/login"} replace={true}></Navigate>;
    }
    return children;
}
export const AuthorizeQsetter = ({ children }) => {
    const token = localStorage.getItem("token");
    if(!token) {
        return <Navigate to={"/login"} replace={true}></Navigate>
    }
    let { type } = jwt_decode(token);
    if (type !== "QSetter") {
      return <Navigate to={"/login"} replace={true}></Navigate>;
    }
    return children;
}
export const AuthorizeUser = ({ children }) => {
    const token = localStorage.getItem("token");
    if(!token) {
        return <Navigate to={"/login"} replace={true}></Navigate>
    }
    return children;
}

export const ProtectRoute = ({ children }) => {
    const username = useAuthStore.getState().auth.username;
    if(!username){
    return <Navigate to={"/reset"} replace={true}></Navigate>;
    }
    return children;
}