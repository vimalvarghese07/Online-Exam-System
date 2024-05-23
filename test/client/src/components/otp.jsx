import React,{ useState } from "react";
import toast,{ Toaster } from "react-hot-toast";
import { useAuthStore } from "../store/store";
import { useNavigate } from "react-router-dom";
import { generateOTP, verifyOTP } from "../helper/helper";
import "./style.scss";

export default function OTP(props) {
    const { username } = useAuthStore(state => state.auth);
    const [OTP, setOTP] = useState();
    const navigate = useNavigate();

    async function onSubmit(e) {
        e.preventDefault();
        try {
            let { status } = await verifyOTP({ username, code: OTP })
            if(status === 201) {
                toast.success("verified successfully");
                return navigate("/password", { replace: true });
            }
        } catch (error) {
            return toast.error("Wrong OTP, Check email again!");
        }        
    }

    function resendOTP() {
        let sendPromise = generateOTP(username);
        toast.promise(sendPromise,{
            loading : "Sending...",
            success : <b>OTP has sent to your email</b>,
            error : <b>Could not send it!</b>
        });
    }
    return(
        <div className="otpContainer componentContainer">
            <Toaster position="top-center" reverseOrder={false}></Toaster>
        <div className="otp">
        <h1>OTP</h1>
        <p>Enter the OTP to reset your password.</p>
            <form>
                <input onChange={(e) => setOTP(e.target.value)} type="phone" placeholder="OTP" />
                <button onClick={onSubmit}>Verify</button>
            </form>
                <p>{"Didn't get the OTP? "}<button onClick={resendOTP} type="button">Resend OTP</button></p>
        </div>
    </div>
    );
}