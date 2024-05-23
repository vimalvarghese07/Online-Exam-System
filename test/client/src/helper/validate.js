import toast from "react-hot-toast";
import { verifyUsername } from "./helper";

export async function loginValidate(values) {
    const errors = {};
    if(!values.username) {
        errors.username = toast.error("Username cannot be empty.");
    } else if(!values.password) {
        errors.password = toast.error("Password cannot be empty.");
    }
    return errors;
}

export async function registerValidate(values) {
    const errors = {}
    const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    if(!values.username) {
        errors.username = toast.error("Username equired....!");
    } else if(values.username.includes(" ")) {
        errors.username = toast.error("Username cannot include spaces....!");
    } else if(values.password !== values.confirm_pwd) {
        errors.exist = toast.error("Password not match...!");
    
    } else if(!values.type) {
        errors.exist = toast.error("Type cannot be empty...!");
    }
     else if(!values.password) {
        errors.password = toast.error("Password Required....!");
    }else if(values.password.includes(" ")) {
        errors.password = toast.error("Wrong Password....!");
    }else if(values.password.length < 4) {
        errors.password = toast.error("Password must be more than 4 characters..!");
    }else if(!specialChars.test(values.password)) {
        errors.password = toast.error("Password must contain atleast on special char..!");
    } else if(!values.email) {
        errors.email = toast.error("Email Required....!");
    }else if(values.email.includes(" ")) {
        errors.email = toast.error ("Wrong Email....!");
    }else if(!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
        errors.email = toast.error("Invalid email address....!")
    }
    return errors;
}

export async function resetValidation(values) {
    const errors = {};
    const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    if(!values.password) {
        errors.password = toast.error("Password cannot be empty..");
    } else if(values.password.includes(" ")) {
        errors.password = toast.error("Password cannot contain spaces");
    } else if(values.password.length < 4) {
        errors.password = toast.error("Password must be more than 4 characters..!");
    }else if(!specialChars.test(values.password)) {
        errors.password = toast.error("Password must contain atleast on special char..!");
    } else if(values.password !== values.confirm_pwd) {
        errors.exist = toast.error("Password not match...!");
    }
    return errors;
}

export async function usernameVerify(values) {
    const errors = {};
    if(!values.username) {
        errors.username = toast.error("Username cannot be empty...!");
    } else if(values.username) {
        const { status } = await verifyUsername(values.username);
        if(status !== 200) {
            errors.exist = toast.error("User does not exist...!");
        }
    }
    return errors;
}

export async function studentVerify(values) {
    const errors = {};
    errors.reg = toast.error("error occured");
    return errors;
}

function passwordVarify(error = {}, values) {

    const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/

    if(!values.password) {
        error.password = toast.error("Password Required....!");
    }else if(values.password.includes(" ")) {
        error.password = toast.error("Wrong Password....!");
    }else if(values.password.length < 4) {
        error.password = toast.error("Password must be more than 4 characters..!");
    }else if(!specialChars.test(values.password)) {
        error.password = toast.error("Password must contain atleast on special char..!");
    }
    return error;
}

function validateEmail(error = {}, values) {
    if(!values.email) {
        error.email = toast.error("Email Required....!");
    }else if(values.email.includes(" ")) {
        error.email = toast.error ("Wrong Email....!");
    }else if(!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
        error.email = toast.error("Invalid email address....!")
    }
    return error;
}

export async function examValidate(values){
    const errors = {};
    if(!values.examname){
        errors.examname = toast.error("Exam Name is Required");
    } else if(!values.examdate){
        errors.examdate = toast.error("Exam Date is Required");
    }else if(!values.examfee){
        errors.examfee = toast.error("Exam Fee is Required");

    }
    return errors;
}

export async function exam2Validate(values){
    const errors = {};
    if(!values.exam){
        errors.examname = toast.error("Exam Name is Required");
    }
    return errors;
}

export async function QsetterValidate(values){
    const errors = {};
    if(!values.username){
        errors.username = toast.error("Please Login Again And Try");
    }
    if (!values.fname) {
        errors.fname = toast.error("First Name Required");
    } else if(!values.lname){
        errors.fname = toast.error("Last Name Required");
    }
    return errors;
}