import bcrypt from "bcryptjs";
import UserModel from "../models/user.model.js";
import StudentModel from "../models/student.model.js";
import ExamModel from "../models/exam.model.js";
import EvQsModel from "../models/EvQs.model.js";
import ExamTempModel from "../models/ExamTemp.model.js";
import CenterModel from "../models/center.model.js";
import registeredExamModel from "../models/stdsReg.model.js";
import logModel from "../models/log.model.js";
import answersheetModel from "../models/answerSheet.model.js";
import jwt from "jsonwebtoken";
const { sign } = jwt;
import otpGenerator from "otp-generator";
import ENV from "../config.js";
import { registerMail } from "./mailer.js";
import fs from 'fs';
import { PDFDocument, StandardFonts } from 'pdf-lib';
import path from 'path';
import studentModel from "../models/student.model.js";

export async function verifyUser(req, res, next) {
    try {
        const { username } = req.method == "GET" ? req.query : req.body;
        let exist = await UserModel.findOne({ username });
        if (!exist) return res.status(404).send({ error: "Can't find User!" });
        next();
    } catch (error) {
        return res.status(404).send({ error: "Authentication error" });
    }
}

export async function userRegister(req, res) {
    try {
        const { type, username, email, password } = req.body;
        const userExist = new Promise((resolve, reject) => {
            UserModel.findOne({ username }, function (err, user) {
                if (err) reject(new Error(err));
                if (user) reject({ error: "Username already exists" });
                resolve();
            });
        });
        const emailExist = new Promise((resolve, reject) => {
            UserModel.findOne({ email }, function (err, email) {
                if (err) reject(new Error(err));
                if (email) reject({ error: "Username already exists" });
                resolve();
            });
        });
        Promise.all([userExist, emailExist])
            .then(() => {
                if (password) {
                    bcrypt.hash(password, 10)
                        .then(hashedPassword => {
                            const user = UserModel({
                                type: type,
                                username: username,
                                email: email,
                                password: hashedPassword
                            });
                            user.save()
                                .then(result => {
                                    if (type === "QSetter" || type === "Evaluator") {
                                        const evqs = new EvQsModel({
                                            type: type,
                                            username: username,
                                            email: email
                                        });
                                        evqs.save().catch(error => console.log(error));
                                    } else if (type === "Student") {
                                        console.log('here');
                                        const stds = new StudentModel({
                                            username: username,
                                            email: email
                                        });
                                        stds.save().catch(error => console.log(error));
                                    }
                                    registerMail({
                                        body: {
                                            username: username,
                                            email: email
                                        }
                                    }, {});
                                    return res.status(201).send({ msg: "User registration successful" })
                                })
                                .catch(error => {
                                    console.log(error);
                                    res.status(500).send({ error })
                                });
                        }).catch(error => {
                            console.log(error)
                            return res.status(500).send({ error: "Unable to hash password" });
                        })
                }
            }).catch(error => {
                console.log(error);
                res.status(500).send({ error })
            });
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
}

export async function getUser(req, res) {
    try {
        const { username, type } = req.params;
        if (type === 'QSetter' || type === 'Evaluator') {
            EvQsModel.findOne({ username: username, type: type }, '-password', function (error, data) {
                if (error) {
                    return res.status(500).send(error);
                }
                if (!data) {
                    return res.status(404).send({ msg: 'User not found' });
                }
                return res.status(201).send(data);
            })
        } else if (type === 'Student') {
            StudentModel.findOne({ username: username }, '-password', function (error, data) {
                if (error) {
                    return res.status(500).send(error);
                }
                if (!data) {
                    return res.status(404).send({ msg: 'User not found' });
                }
                return res.status(201).send(data);
            })
        } else {
            UserModel.findOne({ username: username, type: type }, '-password', function (error, data) {
                if (error) {
                    return res.status(500).send(error);
                }
                if (!data) {
                    return res.status(404).send({ msg: 'User not found' });
                }
                return res.status(201).send(data);
            })
        }
    } catch (error) {
        return res.status(500).send(error);
    }
}

export async function login(req, res) {
    const { username, password } = req.body;
    try {
        UserModel.findOne({ username })
            .then(user => {
                bcrypt.compare(password, user.password)
                    .then(passwordCheck => {
                        if (!passwordCheck) return res.status(400).send({ error: "Don't have Password" });
                        const token = sign({
                            userId: user._id,
                            username: user.username,
                            type: user.type
                        }, ENV.JWT_SECRET, {
                            expiresIn: "24h",
                            allowInsecureKeySizes: true
                        });
                        return res.status(200).send({
                            msg: "Login Successful...!",
                            username: user.username,
                            token
                        });
                    })
                    .catch(error => {
                        return res.status(400).send({ error: "Password does not Match" })
                    })
            })
            .catch(error => {
                return res.status(404).send({ error: "Username not Found" });
            })

    } catch (error) {
        return res.status(500).send({ error });
    }
}

export async function profile(req, res) {
    try {
        const { username } = req.params;
        if (!username) return res.status(501).send({ error: "Invalid Username" });
        UserModel.findOne({ username }, function (err, user) {
            if (err) return res.status(500).send({ err });
            if (!user) return res.status(501).send({ error: "Couldn't find the User" });
            const { password, ...rest } = Object.assign({}, user.toJSON());
            return res.status(201).send(rest);
        })
    } catch (error) {
        return res.status(404).send(error);
    }
}

export async function generateOTP(req, res) {
    const { username } = req.method == "GET" ? req.query : req.body;
    let { email } = await UserModel.findOne({ username });
    req.app.locals.OTP = await otpGenerator.generate(6, { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false });
    let text = `Your password recovery OTP is ${req.app.locals.OTP}. Verify and recover your password`;
    await registerMail({
        body: {
            username: username,
            email: email,
            text: text,
            subject: "Password recovery OTP"
        }
    }, {});
    res.status(201).send({ msg: "OTP sent successfully" });
}

export async function verifyOTP(req, res) {
    const { code } = req.query;
    if (parseInt(req.app.locals.OTP) === parseInt(code)) {
        req.app.locals.OTP = null;
        req.app.locals.resetSession = true;
        return res.status(201).send({ msg: "Verified successfully!" });
    }
    return res.status(400).send({ error: "Invalid OTP" });
}

export async function createResetSession(req, res) {
    if (req.app.locals.resetSession) {
        return res.status(201).send({ flag: req.app.locals.resetSession });
    }
    return res.status(440).send({ error: "Session expired" });
}

export async function resetPassword(req, res) {
    try {
        if (!req.app.locals.resetSession) return res.status(440).send({ error: "Session expired!" });
        const { username, password } = req.body;
        try {
            UserModel.findOne({ username })
                .then(user => {
                    bcrypt.hash(password, 10)
                        .then(hashedPassword => {
                            UserModel.updateOne({ username: user.username }, { password: hashedPassword }, function (err, data) {
                                if (err) throw err;
                                req.app.locals.resetSession = false;
                                return res.status(201).send({ msg: "Record updated....!" });
                            });
                        })
                        .catch(e => {
                            return res.status(500).send({ error: "Unable to hash password" });
                        })
                })
                .catch(error => {
                    return res.status(404).send({ error: "Username not found" });
                })
        } catch (error) {
            return res.status(500).send({ error: "Database error" });
        }
    } catch (error) {
        return res.status(401).send({ error: "REquest errror" });
    }
}

export async function updateUser(req, res) {
    try {
        // const id = req.query.id;
        const { userId } = req.user;
        if (userId) {
            const body = req.body;
            UserModel.updateOne({ _id: userId }, body, function (err, data) {
                if (err) throw err;
                return res.status(201).send({ msg: "Record Updated...!" });
            });
        } else {
            return res.status(401).send({ error: "User not found" });
        }
    } catch (error) {
        return res.status(401).send({ error });
    }
}

export async function student(req, res) {
    try {
        if (req.query.x === "update") {
            return updateStudent(req, res);
        } else if (req.query.x === "register") {
            return registerStudent(req, res);
        }
        return res.status(404).send({ error: "Not found" });
    } catch (error) {
        return res.status(401).send({ error: "Not found" });
    }
}

export async function registerStudent(req, res) {
    try {
        const { profile, username, fname, lname, clg, reg, uni, dob } = req.body;
        const unameExist = new Promise((resolve, reject) => {
            StudentModel.findOne({ username: username }, function (err, uname) {
                if (err) reject(new Error(err));
                if (uname) reject({ error: "Username already exists" });
                resolve();
            });
        });
        const regExist = new Promise((resolve, reject) => {
            StudentModel.findOne({ reg: reg }, function (err, reg) {
                if (err) reject(new Error(err));
                if (reg) reject({ error: "Register number already exist" });
                resolve();
            });
        });
        Promise.all([unameExist, regExist])
            .then(() => {
                if (username) {
                    const student = StudentModel({
                        profile: profile,
                        username: username,
                        fname: fname,
                        lname: lname,
                        clg: clg,
                        reg: reg,
                        uni: uni,
                        dob: dob
                    });
                    student.save()
                        .then(result => {
                            return res.status(200).send({ msg: "updation successful..." });
                        })
                        .catch(error => {
                            console.log(error);
                            return res.status(501).send({ error: "Couldn't update student" });
                        });
                }
            })
            .catch(error => {
                console.log(error);
                return res.status(500).send({ error: "Record exist" });
            });
    } catch (error) {
        console.log(error);
        return res.status(502).send({ error: "Some error occured" });
    }
}

export async function updateStudent(req, res) {
    try {
        const { username } = req.body;
        if (username) {
            const body = req.body;
            StudentModel.updateOne({ username: username }, body, function (err, data) {
                if (err) throw err;
                return res.status(201).send({ msg: "Record updated successfully" });
            });
        } else {
            return res.status(401).send({ error: "User not found" });
        }
    } catch (error) {
        return res.status(500).send({ error: "Some error occured" });
    }
}

let stdInfo = {};

export async function allotSystem(req,res){
    try {
        const {studentname,regno,examname} =req.body;
        studentModel.findOne({username : studentname})
        .then(response => {
            stdInfo = {username: studentname, regno: regno, profileImage:response.profile,questionPaperCode: "CS001", university: "KTU", examname: examname};
            return res.status(200);
        })
    } catch (error) {
        return res.status(500).send(error)
    }
}

export async function getUserInfo(req, res) {
    try {
        console.log(stdInfo);
        res.status(201).send(stdInfo);
        // res.status(201).send({ username: "jeevan", regno: "cec19cs004", profileImage: "DemoImage", questionPaperCode: "CS001", university: "KTU", examname: "University Exam" });
    } catch (error) {
        console.log(error);
        return res.status(500).send({ error: "Some error occured" });
    }
}
//last group request
export async function getQuestion(req, res) {
    const questions = [
        {
            id: 1,
            question: "this is test question 1?",
            options: [
                { id: "a", text: "option1" },
                { id: "b", text: "option2" },
                { id: "c", text: "option3" },
                { id: "d", text: "option4" }
            ]
        },
        {
            id: 2,
            question: "this is test question 2?",
            options: [
                { id: "a", text: "option1" },
                { id: "b", text: "option2" },
                { id: "c", text: "option3" },
                { id: "d", text: "option4" }
            ]
        },
        {
            id: 3,
            question: "this is test question 3?",
            options: [
                { id: "a", text: "option1" },
                { id: "b", text: "option2" },
                { id: "c", text: "option3" },
                { id: "d", text: "option4" }
            ]
        },
        {
            id: 4,
            question: "this is test question 4?",
            options: [
                { id: "a", text: "opt1" },
                { id: "b", text: "opt2" },
                { id: "c", text: "opt3" },
                { id: "d", text: "opt4" }
            ]
        },
        {
            id: 5,
            question: "this is test question 5?",
            options: [
                { id: "a", text: "option1" },
                { id: "b", text: "option2" },
                { id: "c", text: "option3" },
                { id: "d", text: "option4" }
            ]
        }
    ];
        res.send({ data: questions });
}

export async function get2Question(req,res){
    try {
        const {examname} = req.params;
        ExamModel.findOne({examname:examname},function(error,data){
            if(error) return res.status(501).send({error:'error Occured'});
            if (data) {
                console.log(data.questionPaper[0].questionPaper);
                return res.status(201).send(data);
            }
        })
        
    } catch (error) {
        return res.status(500).send(error)
    }
}

export async function getLog(req, res) {
    try {
      const { username } = req.params;
      
      logModel.findOne({ username }, function (err, log) {
        if (err) {
          return res.status(500).send(err);
        }
  
        if (log) {
          res.status(200).json(log);
        } else {
          res.status(404).send("Log not found");
        }
      });
    } catch (error) {
      res.status(500).send(error);
    }
  }

export async function saveLog(req, res) {
    try {
      const data = req.body;
      console.log(data);
      
      logModel.findOne({ username: data.student }, function (err, uname) {
        if (err) {
          return res.status(500).send(err);
        }
  
        if (uname) {
          // Update the existing log document for the given username
          logModel.updateOne(
            { username: data.student },
            {
              answerArray: data.answerArray,
              markForReview: data.markForReview,
              timeLeft: data.timeLeft
            }
          )
            .then(() => {
              res.status(200).send("Log updated successfully");
            })
            .catch((error) => {
              res.status(500).send(error);
            });
        } else {
          // Create a new log document
          const log = new logModel({
            username: data.student,
            answerArray: data.answerArray,
            markForReview: data.markForReview,
            timeLeft: data.timeLeft
          });
  
          log.save()
            .then(() => {
              res.status(200).send("Log saved successfully");
            })
            .catch((error) => {
              res.status(500).send(error);
            });
        }
      });
    } catch (error) {
      res.status(500).send(error);
    }
}

export async function saveAnswersheet(req, res){
    const {student,answerSheet} = req.body;
    try {
        const answerSheetS = answersheetModel({
            username:student,
            answersheet:answerSheet
        });
        answerSheetS.save();
        return res.status(201);
    } catch (error) {
        return res.status(500).send(error);
    }
} 

export async function getListAdmin(req, res) {
    try {
        const { listItem } = req.params;
        if (listItem === 'center') {
            CenterModel.find({ type: listItem }, function (error, listI) {
                if (error) return res.status(500).send({ error });
                if (!listI) return res.status(501).send({ error: "No Center found" });
                const i = listI.map((ee) => {
                    const { password, ...rest } = Object.assign({}, ee);
                    return rest;
                })
                return res.status(201).send(i);
            })
        }
        else {
            UserModel.find({ type: listItem }, function (error, listI) {
                if (error) return res.status(500).send({ error });
                if (!listI) return res.status(501).send({ error: "No user found" });
                const i = listI.map((ee) => {
                    const { password, ...rest } = Object.assign({}, ee);
                    return rest;
                })
                return res.status(201).send(i);
            })
        }
    } catch (error) {
        return res.status(404).send(error);
    }
}

export async function verifyExam(req, res) {
    const { examname } = req.query;
    const exam = examname.examname;
    ExamModel.findOne({ examname: exam }, function (err, exam) {
        if (err) {
            return res.status(500).send(err)
        }
        if (exam) {
            return res.status(400).send("Exam Exist");
        }
        return res.send("Succesfully Verified").status(200);
    });
}

export async function createExam(req, res) {
    const { user, value } = req.body;
    const examm = value.examname;
    const examdate = value.examdate;
    const examfee = value.examfee;
    const exam = ExamModel({
        examname: examm,
        examdate: examdate,
        examfee: examfee,
        admin: user,
        notificationSent: false,
    });
    exam.save()
        .then(result => {
            return res.status(201).send({ msg: "updation successful..." });
        })
        .catch(error => {
            console.log(error);
            return res.status(500).send({ error: "Couldn't update Exam" });
        });
}
export async function getExam(req, res) {
    try {
        const { type, username, add, examname } = req.params;
        if (type === 'Student') {
            if (add === 'reg') {
                ExamModel.find({ examname: examname }, function (error, listExam) {
                    if (error) return res.status(500).send({ error });
                    if (!listExam) return res.status(501).send({ msg: 'No Exams' });
                    const i = listExam.map((ee) => {
                        const { admin, ...rest } = Object.assign({}, ee);
                        return rest;
                    });
                    return res.status(201).send(i);
                });
            } else {
                ExamModel.find({}, function (error, listExam) {
                    if (error) return res.status(500).send({ error });
                    if (!listExam) return res.status(501).send({ msg: 'No Exams' });
                    const i = listExam.map((ee) => {
                        const { admin, ...rest } = Object.assign({}, ee);
                        return rest;
                    });
                    return res.status(201).send(i);
                });
            }
        } else if (type === 'QSetter') {
            if (add === 'add') {
                ExamModel.find({}, function (error, listExam) {
                    if (error) return res.status(500).send({ error });
                    if (!listExam) return res.status(501).send({ msg: 'No Exams' });
                    const i = listExam.map((ee) => {
                        const { admin, ...rest } = Object.assign({}, ee);
                        return rest;
                    });
                    return res.status(201).send(i);
                });
            } else if (add === 'saved') {
                ExamTempModel.findOne({ username: username, examname: examname }, function (error, data) {
                    if (error) return res.status(500).send({ error });
                    if (!data) return res.status(501).send({ msg: 'No Exams' });
                    return res.status(201).send(data);
                });
            }
        } else if (type === 'Evaluator') {
            if (add === 'add') {
                ExamModel.find({}, function (error, listExam) {
                    if (error) return res.status(500).send({ error });
                    if (!listExam) return res.status(501).send({ msg: 'No Exams' });
                    const i = listExam.map((ee) => {
                        const { admin, ...rest } = Object.assign({}, ee);
                        return rest;
                    });
                    return res.status(201).send(i);
                });
            } else if (add === 'saved') {
                ExamTempModel.findOne({ username: username, examname: examname }, function (error, data) {
                    if (error) return res.status(500).send({ error });
                    console.log(data);
                    if (!data) return res.status(501).send({ msg: 'No Exams' });
                    return res.status(201).send(data);
                });
            }
        }
         else if (type === 'admin') {
            ExamModel.find({ admin: username }, function (error, listExam) {
                if (error) return res.status(500).send({ error });
                if (!listExam) return res.status(501).send({ msg: 'No Exams' });
                return res.status(201).send(listExam);
            });
        }
    } catch (error) {
        return res.status(404).send(error);
    }
}

export async function getExamEvaluator(req, res) {
    try {
        const { username, admin, exam } = req.params;
        if (username) {
            ExamModel.findOne({
                admin: admin,
                examname: exam
            }, function (error, listExam) {
                if (error) return res.status(500).send({ error });
                if (!listExam) return res.status(501).send({ msg: "No Exams" });
                console.log(listExam.questionPaper);
                if (!listExam.questionPaper) {
                    return res.status(201).send({ msg: "Evaluator not Submitted Question Paper" });
                }
                const i = listExam.questionPaper.map((ee) => {
                    const { admin, ...rest } = Object.assign({}, ee);
                    return rest;
                })
                return res.status(201).send(i);
            })
        }
    } catch (error) {
        return res.status(404).send(error);
    }
}

export async function updateEvQS(req, res) {
    try {
        if (req.query.x == 'profile') {
            const { username, fname, lname, dob, profile } = req.body;
            if (username) {
                EvQsModel.updateOne(
                    { username: username },
                    { $set: { fname: fname, lname: lname, dob: dob, profile: profile } },
                    function (err, result) {
                        if (err) {
                            return res.status(500).json({ error: err });
                        }
                        if (result.nModified === 0) {
                            return res.status(404).json({ message: "User not found" });
                        }
                        return res.status(200).json({ message: "User profile updated successfully" });
                    }
                );
            }
        }
        else if (req.query.x == 'exam') {
            const { exam, user, evals } = req.body;
            EvQsModel.updateMany(
                { username: { $in: evals } },
                {
                    $addToSet: { admin: user, exam: exam, examUpdate: { admin: user, examList: exam } },
                    reqStatus: false
                },
                function (err, result) {
                    if (err) {
                        return res.status(500).json({ error: err });
                    }
                    if (result.nModified === 0) {
                        return res.status(409).json({ message: "Admin has already added the exam for these evaluators" });
                    }
                    return res.status(200).json({ message: "Evaluators updated successfully" });
                }
            );
        }


    }
    catch (error) {
        return res.status(404).send(error);
    }
}

export async function getExamReq(req, res) {
    try {
        const { EvQs } = req.params;
        const { username } = req.params;
        if (EvQs == 'qsetter') {
            EvQsModel.findOne({ username: username, type: 'QSetter' }, function (error, data) {
                if (error) return res.status(500).send('coudnt Fetch Data');
                if(data){
                    const { exam, admin, examUpdate, reqStatus } = data;
                    if (exam.length === 0) {
                        res.status(201).send([]);
                    }
                    if (!reqStatus) {
                        res.status(201).send(examUpdate);
                    }
                    else {
                        res.status(201).send([]);
                    }

                }
            });
        }
        else if (EvQs == 'evaluator') {
            EvQsModel.findOne({ username: username, type: 'Evaluator' }, function (error, data) {
                if (error) return res.status(500).send('coudnt Fetch Data');
                if(data.exam.length){

                const { exam, admin, examUpdate, reqStatus } = data;
                if (exam.length === 0) {
                    res.status(201).send([]);
                }
                if (!reqStatus) {
                    res.status(201).send(examUpdate);
                }
                else {
                    res.status(201).send([]);
                }
            }
            });
        }
    } catch (error) {
        return res.status(404).send(error);
    }
}

export async function acceptOrdeny(req, res) {
    try {
        const { isAccepted, username, acceptedList, deniedList } = req.body;
        if (isAccepted) {
            await EvQsModel.updateOne(
                { username: username },
                {
                    $addToSet: {
                        examAccepted: {
                            admin: acceptedList.adminName,
                            examList: acceptedList.examName,
                        },
                    },
                    $pull: {
                        examUpdate: {
                            admin: acceptedList.adminName,
                            examList: acceptedList.examName,
                        },
                    },
                    reqStatus: true,
                }
            );
        } else {
            await EvQsModel.updateOne(
                { username: username },
                {
                    $pull: {
                        examUpdate: {
                            admin: deniedList.adminName,
                            examList: deniedList.examName,
                        },
                    },
                    reqStatus: true,
                }
            );
        }
        return res.status(201).send("Success");
    } catch (error) {
        return res.status(404).send(error);
    }
}

export async function getAcceptedExamReq(req, res) {
    try {
        const { EvQs } = req.params;
        const { username } = req.params;
        if (EvQs == 'qsetter') {
            EvQsModel.findOne({ username: username, type: 'QSetter' }, function (error, data) {
                if (error) return res.status(500).send('coudnt Fetch Data');
                const { examAccepted, reqStatus } = data;
                if (reqStatus) {
                    res.status(201).send(examAccepted);
                }
                else {
                    res.status(201).send([]);
                }
            });
        } else if (EvQs == 'evaluator') {
            EvQsModel.findOne({ username: username, type: 'Evaluator' }, function (error, data) {
                if (error) return res.status(500).send('coudnt Fetch Data');
                if (data) {
                    const { examAccepted, reqStatus } = data;    
                    if (reqStatus) {
                        res.status(201).send(examAccepted);
                    }
                    else {
                        res.status(201).send([]);
                    }
                }

            });
        }
    } catch (error) {
        return res.status(404).send(error);
    }
}

export async function saveExam(req, res) {
    try {
        const { username, questions, admin, examname } = req.body;
        const existingExam = await ExamTempModel.findOne({
            username:username,
            "questionPaper.admin": admin,
            "questionPaper.examname": examname,
        });
        if (existingExam) {
            console.log('here');
            const index = existingExam.questionPaper.findIndex(
                (paper) => paper.admin === admin && paper.examname === examname
            );
            const update = {
                $addToSet: {
                    [`questionPaper.${index}.questions`]: {
                        $each: questions.filter((question) => {
                            return !existingExam.questionPaper[index].questions.some(
                                (existingQuestion) => {
                                    return existingQuestion.question === question.question;
                                }
                            );
                        }),
                    },
                },
            };
            const options = { upsert: true };
            const result = await ExamTempModel.updateOne(
                { username: username },
                update,
                options
            );
            if (result) {
                return res.status(201).send({ msg: "Record updated successfully" });
            } else {
                return res.status(500).send({ msg: result });
            }
        } else {
            const ExamTemp = ExamTempModel({
                username: username,
                examname: examname,
                questionPaper: { questions: questions, admin: admin, examname: examname },
            });
            ExamTemp.save().then((result) => {
                return res.status(201).send({ msg: "User registration successful" });
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(404).send(error);
    }
}

export async function submitExam(req, res) {
    try {
        const { username, admin, exam } = req.body;
        const { type } = req.params;
        const existingExam = await ExamTempModel.findOne({
            username: username,
            "questionPaper.admin": admin,
            "questionPaper.examname": exam,
        });
        if (type == 'qsetter') {
            const options = { upsert: true };
            const update = {
                $push: {
                    Qsetter: username,
                    questionPaper: existingExam,
                },
            };

            const result = await ExamModel.updateOne(
                { examname: exam, admin: admin },
                update,
                options
            );

            if (result) {
                return res.status(201).send({ msg: "Record updated successfully" });
            } else {
                return res.status(500).send({ msg: result });
            }
        } else if (type == 'evaluator') {
            const options = { upsert: true };
            const update = {
                $push: {
                    evaluator: username,
                    questionPaper: existingExam,
                },
            };

            const result = await ExamModel.updateOne(
                { examname: exam, admin: admin },
                update,
                options
            );

            if (result) {
                return res.status(201).send({ msg: "Record updated successfully" });
            } else {
                return res.status(500).send({ msg: result });
            }
        }

    } catch (error) {
        return res.status(404).send(error);
    }
}

export async function getNotification(req, res) {
    try {
        const newExams = await ExamModel.find({ notificationSent: false }).exec();
        const notifications = newExams.map(exam => {
            const examDate = new Date(exam.examdate).toLocaleDateString();
            const msg = `Admin has added new exam ${exam.examname}. Last Date of Registration: ${examDate}`;
            return {
                msg: msg,
                examId: exam._id
            }
        });
        return res.status(201).send(notifications);
    } catch (error) {
        return res.status(404).send(error);
    }
}

export async function getCenter(req, res) {
    try {
        CenterModel.findOne({}, function (error, data) {
            if (error) return res.status(500).send("coudn\'t Fetch Data");
            return res.status(201).send(data);
        });

    } catch (error) {
        return res.status(404).send(error);
    }
}

export async function updateExam(req, res) {
    try {
        const { exam, admin, center } = req.body;
        const examExist = await ExamModel.findOne({ examname: exam, admin: admin });

        if (examExist) {
            const centers = examExist.center;
            const newCenters = [...new Set([...centers, ...center])]; // merging the existing and new centers and removing duplicates
            const updateQuery = { $set: { center: newCenters } }; // using $set to update the entire center array
            const options = { new: true };
            const updatedExam = await ExamModel.findOneAndUpdate({ examname: exam, admin: admin }, updateQuery, options);

            return res.status(200).send({ msg: "Exam center updated successfully" });
        } else {
            return res.status(404).send({ error: "Exam not found" });
        }
    } catch (error) {
        return res.status(500).send(error);
    }
}

export async function bottomHallticket(req, res) {
    try {
        const { examname } = req.params;
        EvQsModel.find({ reqStatus: true, examAccepted: { $elemMatch: { examList: examname } } }, function (error, data) {
            if (error) return res.status(501).send(error);
            return res.status(201).send(data);
        });
    } catch (error) {
        return res.status(500).send(error);
    }
}

export async function getUserInfoLogin(req, res) {
    try {
        const { username } = req.params;
        EvQsModel.findOne({ username }, function (error, user) {
            if (error) return res.status(501).send(error);
            if (!user) return res.status(405).send({ error: "Coudn't Find User" });
            return res.status(201).send(user);
        })

    } catch (error) {
        return res.status(500).send(error)
    }
}

export async function registerExam(req, res) {
    try {
        const { username, fname, lname, email, clg, reg, uni, dob, exam } = req.body;
        registeredExamModel.findOne({ username: username }, function (err, data) {
            if (err) return res.status(500).send(err);
            if (data) {
                if (data.exam.includes(exam)) {
                    return res.status(200).json({ message: "Exam already registered" });
                } else {
                    registeredExamModel.updateOne({ username: username }, { $push: { exam: exam } }, function (err, result) {
                        if (err) return res.status(500).send(err);
                        return res.status(200).json({ message: "Exam Registered" });
                    });
                }
            } else {
                const examData = new registeredExamModel({
                    username: username,
                    fname: fname,
                    lname: lname,
                    email: email,
                    clg: clg,
                    reg: reg,
                    uni: uni,
                    dob: dob,
                    exam: [exam],
                });
                examData.save(function (err, result) {
                    if (err) return res.status(500).send(err);
                    console.log("Exam data saved successfully");
                    return res.status(200).json({ message: "Exam data saved successfully" });
                });
            }
        });

    } catch (error) {
        return res.status(501).send(error);
    }
}

export async function verifyRegisterExam(req,res){
    try {
        const {username,exam,get} = req.params;
        if (get === 'check') {
            registeredExamModel.findOne({username:username},function(err,data){
                if(err) return res.status(500).send(err);
                if(data){
                    if(data.exam.includes(exam)){
                        return res.send({msg:'exam Registered Already'}).status(200)
                    }
                else{
                    return res.status(200);
                }
                }else{
                    return res.status(200)
                }
            })
        } else if (get === 'list') {
            registeredExamModel.findOne({username:username},function(err,data){
                if(err) return res.status(500).send(err);
                if (data) {
                    res.status(201).send(data.exam);
                }else{
                    res.status(201).send(['No Exam Registered'])
                }
            })
        }

    } catch (error) {
        return res.status(501).send(error)
    }
}

export async function getRegisteredStudents(req,res){
    try {
        const {examname} = req.params;
        registeredExamModel.find({exam:examname},function(error,data){
            if(error) return res.status(500).send(error)
            if(!data) return res.status(404).send({msg:"Not Found"});
            return res.status(201).send(data);
        })
    } catch (error) {
        return res.status(501).send(error)
    }
}

export async function updateExamEvaluator(req,res){
    try {
        console.log(req.body);

    } catch (error) {
        return res.status(500).send(error);
    }
}

export async function allotCenters(req, res) {
    try {
      const students = await StudentModel.find({});
      const centers = await CenterModel.find({});
      let centerIndex = 0;
  
      for (let student of students) {
        if (student.center) continue;
        const currentCenter = centers[0].Center[centerIndex]; 
        if (currentCenter.capacity == 0) {
          centerIndex = (centerIndex + 1) % centers[0].Center.length;
          continue;
        }
  
        student.center = currentCenter.centername;
  
        currentCenter.capacity--;
  
        await StudentModel.updateOne({ _id: student._id }, { center: currentCenter.centername },function(error,dat){
            if(error) console.log(error);
            if (dat) {
                console.log(dat);
            }
        });
        await CenterModel.updateOne({ _id: currentCenter._id }, { capacity: currentCenter.capacity });
  
        centerIndex = (centerIndex + 1) % centers[0].Center.length;
      }
  
      return res.status(200).send("Centers allotted successfully");
    } catch (error) {
      console.error(error);
      return res.status(500).send(error);
    }
}

export async function saveRecording(req, res) {
    try {
        const {username} = req.params;
        return res.status(200).send('video Saved');
    } catch (error) {
        return res.status(500).send({ error });
    }
}

export async function generateHallticket(req, res) {
  try {
    const students = await registeredExamModel.find({});
    const { examname } = req.params;

    for (const student of students) {
      const { username, email, fname, lname, clg, reg, uni, dob, exam } = student;

      // Create a new PDF document
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage();

      // Set the title
      page.drawText(`Hall Ticket`, {
        x: 50,
        y: page.getSize().height - 50,
        size: 24,
        font: await pdfDoc.embedFont(StandardFonts.HelveticaBold),
      });

      const textLines = [
        `Name: ${fname} ${lname}`,
        `Email: ${email}`,
        `College: ${clg}`,
        `Registration Number: ${reg}`,
        `University: ${uni}`,
        `Date of Birth: ${dob}`,
        `Exam: ${exam.join(', ')}`,
      ];

      const textSpacing = 20;
      const textStartY = page.getSize().height - 100;
      for (let i = 0; i < textLines.length; i++) {
        const text = textLines[i];
        page.drawText(text, {
          x: 50,
          y: textStartY - i * textSpacing,
          size: 12,
          font: await pdfDoc.embedFont(StandardFonts.Helvetica),
        });
      }

      const pdfBytes = await pdfDoc.save();

      const hallticketFolder = `halltickets/${examname}`;
      if (!fs.existsSync(hallticketFolder)) {
        fs.mkdirSync(hallticketFolder, { recursive: true });
      }

      const filePath = `${hallticketFolder}/${username}.pdf`;
      fs.writeFileSync(filePath, pdfBytes);

      console.log(`Generated hall ticket for ${username}`);
    }

    return res.status(200).send({ msg: 'Hall tickets generated successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
}

export async function getHallticket(req, res) {
  try {
    const { examname, username } = req.params;
    const filePath = path.join('halltickets', examname, `${username}.pdf`);

    // Check if the hallticket file exists
    if (fs.existsSync(filePath)) {
      // Read the file content
      const fileContent = fs.readFileSync(filePath);

      // Set the response headers
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `inline; filename=${username}.pdf`);

      // Send the file content as response
      res.send(fileContent).status(201);
    } else {
      // If the hallticket file does not exist, return 404 Not Found
      res.status(404).send({ error: 'Hall ticket not found' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
}

export async function getAnswerSheet(req, res){
    try {
        const {examname, adminame} = req.params;
        ExamModel.findOne({examname:examname, admin:adminame}, function (err,data){
            if(err) return res.status(501).send(err);
            if(data){
                console.log(data.questionPaper);
            }
        })
    } catch (error) {
        return res.status(500).send(error)
    }
}

export async function getProfilek(req, res){
    try {
        const {credential, name} = req.params;
        console.log(credential);
        if (credential === 'Student') {
            StudentModel.findOne({username:name})
            .then(result => {
                return res.status(201).send(result)
            })
        }
        if (credential === 'QSetter') {
            EvQsModel.findOne({username:name})
            .then(result => {
                return res.status(201).send(result)
            })
        }
        if (credential === 'Evaluator') {
            EvQsModel.findOne({username:name})
            .then(result => {
                return res.status(201).send(result)
            })
        }
    } catch (error) {
        return res.status(500).send(error);
    }
}

