import axios from "axios";
import jwt_decode from "jwt-decode";
import ENV from "../config";


axios.defaults.baseURL = ENV.SERVER_ADD;

export async function getProfile() {
    try {
        const token = await localStorage.getItem("token");
        if(!token) return Promise.reject("Cannot find token");
        let { username } = jwt_decode(token);
        const { data } = await axios.post(`/api/profile/${username}`, {}, { headers: { "Authorization": `Beare ${token}`}});
        return { data };
    } catch (error) {
        return error;
    }
}

export async function verifyUsername(username) {
    try {
        return await axios.post("/api/authenticate", { username });
    } catch (error) {
        return { error : "Username doesn't exist....!" };
    }
}

export async function verifyPassword({ username, password }) {
    try {
        if(username) {
            const { data } = await axios.post('/api/login', { username, password });
            return Promise.resolve({ data });
        }
    } catch (error) {
        return Promise.reject(error);
    }
}

export async function registerUser(credentials) {
    try {
        const { data: { msg }, status } = await axios.post(`/api/register`, credentials);
        return Promise.resolve(msg);
    } catch (error) {
        return Promise.reject({ error })
    }
}

export async function generateOTP(username) {
    try {
        const { data, status } = await axios.get('/api/generateOTP', { params: { username }});
        return Promise.resolve(status);
    } catch (error) {
        return Promise.reject({ error });
    }
}

export async function verifyOTP({ username, code }) {
    try {
        const { data, status } = await axios.get('/api/verifyOTP', { params: { username, code }});
        return { data, status };
    } catch (error) {
        return Promise.reject(error);
    }
}

export async function resetPassword({ username, password }) {
    try {
        const { data, status } = await axios.put('/api/resetPassword',{ username, password });
        return Promise.resolve({ data, status });
    } catch (error) {
        return Promise.reject({ error });
    }
}

export async function updateStudent(data,type) {
    try {
        const token = await localStorage.getItem("token");
        const { data: { msg }} = await axios.put(`/api/updatestudent?x=${type}`, data, { headers: { "Authorization": `Beare ${token}`}});
        return Promise.resolve(msg);
    } catch (error) {
        return Promise.reject("Couldn't update data");
    }
}

export async function verifyExam(examname, examdate){
    try{
        const { data } = await axios.get('/api/examVerify', {params: {examname, examdate}});
        return Promise.resolve( data );
    }catch (error) {
        return Promise.reject("Coudn't Update Exam")
    }
}

export async function updateExam(value){
    try {
        let token = localStorage.getItem('token');
        let user = localStorage.getItem('username');
        const { data } = await axios.put('/api/updateExam',{value, user}, { headers: {"Authorization": `Beare ${token}`}});
        return Promise.resolve( data );
    } catch (error) {
        return Promise.reject("Couldn't update data");
    }
}

export async function updateEvaluator(credentials,type){
    try {
        const token = await localStorage.getItem("token");
        const { data: { msg }} = await axios.put(`/api/updateEvaluator?x=${type}`, credentials, { headers: { "Authorization": `Beare ${token}`}});
        return Promise.resolve(msg);
    } catch (error) {
        return Promise.reject("Couldn't update data");
    }
}

export async function updateQSetter(credentials,type){
    try {
        const token = await localStorage.getItem("token");
        const { data: { msg }} = await axios.put(`/api/updateQsetter?x=${type}`, credentials, { headers: { "Authorization": `Beare ${token}`}});
        return Promise.resolve(msg);
    } catch (error) {
        return Promise.reject("Couldn't update data");
    }
}

export async function acceptOrdeny(credentials){
    try {
        const token = localStorage.getItem("token");
        const user = localStorage.getItem("username");
        const data = await axios.put('api/acceptOrdeny',credentials, { headers: { "Authorization": `Beare ${token}`}});
        return Promise.resolve(data);
    } catch (error) {
        return Promise.reject("Couldn't Process Request");
    }
}

export async function saveExam(credentials){
    try {
        const token = localStorage.getItem("token");
        const data = await axios.put('api/saveQuestionPaper',credentials, { headers: { "Authorization": `Beare ${token}`}});
        return Promise.resolve(data);
        
    } catch (error) {
        return Promise.reject("Couldn't Process Request");
    }
}

export async function submitExamQsetter(credentials){
    try {
        const token = localStorage.getItem("token");
        const data = await axios.put('api/submitQuestionPaper/qsetter',credentials, { headers: { "Authorization": `Beare ${token}`}});
        return Promise.resolve(data);

    } catch (error) {
        return Promise.reject("Couldn't Process Request");
    }
}

export async function submitExamEvaluator(credentials){
    try {
        const token = localStorage.getItem("token");
        const data = axios.put('api/submitQuestionPaper/evaluator',credentials, { headers: { "Authorization": `Beare ${token}`}});
        return Promise.resolve(data);
    } catch (error) {
        return Promise.reject("coudn't Resolve Data");
    }
}

export async function updateExamCenter(credentials){
    try {
        const token = localStorage.getItem("token");
        const data = await axios.put('api/addCenter/Exam',credentials, { headers: { "Authorization": `Beare ${token}`}});
        return Promise.resolve(data);
        
    } catch (error) {
        return Promise.reject("Couldn't Process Request");
    }
}

export async function registerExam(credentials){
    try {
        const token = localStorage.getItem("token");
        const data = await axios.put(`api/registerExam`,credentials, {headers: { "Authorization": `Beare ${token}`}});
        return Promise.resolve(data);
    } catch (error) {
        return Promise.reject("Couldn't Process Request")
    }
}

export async function generateHallticket(credentials){
    try {
        const data = axios.get(`/api/generatehallticket/${credentials}`);
        console.log(data);
        return Promise.resolve(data);
    } catch (error) {
        return Promise.reject('coudnt generate')
    }
}

export async function getHallticket(credentials){
    try {
        const {examname,username} = credentials;
        const data = axios.get(`/api/getHallticket/${examname}/${username}`,{

              responseType: 'application/pdf'
        });
        return Promise.resolve(data);
    } catch (error) {
        return Promise.reject('coudnt get hallticket');
    }
}

export async function getAnswerSheet(credentials, username){
    try {
        const data = axios.get(`api/getAnswerSheet/${credentials}/${username}`)
    } catch (error) {
        return Promise.reject('error occured')
    }
}

export async function getProfileInfos(credentials){
    try {
        const data = axios.get(`api/getProfilek/${credentials.cred}/${credentials.cred2}`);
        return Promise.resolve(data);
    } catch (error) {
        return Promise.reject('error occured');
    }
}