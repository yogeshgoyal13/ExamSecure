const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const moment = require("moment"); // To parse date and time to IST
const alert = require("alert");

const app = express();
require("dotenv").config();

// To use static css files on server
app.use(express.static(__dirname + '/public'));

// To use body-parser to access form data
app.use(bodyParser.urlencoded({ extended: true }));

// To use ejs
app.set('view engine', 'ejs');

// mongoose connection, database -> examsecureDB
mongoose.connect('mongodb+srv://yogeshgoyal:yogeshdce123@examsecure.v5ibl.mongodb.net/examsecureDB?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true});

// all database schemas here
// studentSchema
const studentSchema = new mongoose.Schema({
    name: String,
    rollNo: String,
    branch: String,
    email: String,
    password: String
});

const Student = mongoose.model("Student", studentSchema); 

// adminSchema
const adminSchema = new mongoose.Schema({
    name: String,
    branch: String,
    adminId: String,
    email: String,
    password: String
});

const Admin = mongoose.model("Admin", adminSchema);

// examSchema
const examSchema = new mongoose.Schema({
    examId: String,
    adminId: String,
    description: String,
    branch: String,
    date: String,
    time: String,
    questions: [],
    marks: Number
});

const Exam = mongoose.model("Exam", examSchema); 

// resultSchema
const resultSchema = new mongoose.Schema({
    rollNo: String,
    adminId: String,
    examId: String,
    scoredMarks: Number,
    totalMarks: Number,
    description: String,
    date: String,
    time: String
});

const Result = mongoose.model("Result", resultSchema);

// Home route
app.get("/", (req, res)=>{
    res.sendFile(__dirname + "/HTML/index.html");
});

// login route
app.get("/login", (req, res)=>{
    res.sendFile(__dirname + "/HTML/login.html");
});

// signup for student
app.get("/signup", (req, res)=>{
    res.sendFile(__dirname + "/HTML/signup.html");
});

// request admin access for faculty
app.get("/requestadminaccess", (req, res)=>{
    res.sendFile(__dirname + "/HTML/adminAccess.html");
});

// student login form submission
app.post("/studentlogin", (req, res)=>{
    const loginEmail = req.body.email;
    const loginPassword = req.body.password;

    Student.findOne({email: loginEmail}, (err, currStudent)=>{
        if(err){
            console.log(err);
        }else{
            if(currStudent){
                if(currStudent.password === loginPassword){
                    Exam.find({branch: currStudent.branch}, (errExam, examsArray)=>{
                        if(errExam){
                            console.log(errExam);
                        }else{
                            res.render("studentDashboard", {user: currStudent, examsArray: examsArray});
                        }
                    });
                }else{
                    console.log("Incorrect Password");
                    alert("Incorrect Password");
                    res.redirect("login");
                }
            }else{
                console.log("User doesn't exist!");
                alert("User doesn't exist");
                res.redirect("login");
            }
        }
    });
});

// /studentdashboardButton in studentDashboard
app.post("/studentdashboardButton", (req, res)=>{
    const loginEmail = req.body.dashboardButton;

    Student.findOne({email: loginEmail}, (err, currStudent)=>{
        Exam.find({branch: currStudent.branch}, (errExam, examsArray)=>{
            if(errExam){
                console.log(errExam);
            }else{
                res.render("studentDashboard", {user: currStudent, examsArray: examsArray});
            }
        });
    });
});

// admin login form submission
app.post("/adminlogin", (req, res)=>{
    const loginEmail = req.body.email;
    const loginPassword = req.body.password;

    Admin.findOne({email: loginEmail}, (err, currAdmin)=>{
        if(err){
            console.log(err);
        }else{
            if(currAdmin){
                if(currAdmin.password === loginPassword){
                    res.render("adminPortal", {user: currAdmin});
                }else{
                    console.log("Incorrect Password");
                    alert("Incorrect Password");
                    res.redirect("login");
                }
            }else{
                console.log("User doesn't exist!");
                alert("User doesn't exist!");
                res.redirect("login");
            }
        }
    });
});

// student signup form submission
app.post("/signup", (req, res)=>{
    Student.findOne({email: req.body.email}, (err, user)=>{
        if(err){
            console.log(err);
        }else{
            if(user){
                console.log("User with same email address already exists!");
                alert("User with same email address already exists!");
            }else{
                let newStudent = new Student({
                    name: req.body.name,
                    rollNo: req.body.rollNo,
                    branch: req.body.branch,
                    email: req.body.email,
                    password: req.body.password
                });
            
                newStudent.save();
                alert("Sign Up Successful");
            }
        }
    });

    res.redirect("login");
});

// admin requested access - form submission
app.post("/requestadminaccess", (req, res)=>{
    Admin.findOne({email: req.body.email}, (err, user)=>{
        if(err){
            console.log(err);
        }else{
            if(user){
                console.log("User with same email address already exists!");
                alert("User with same email address already exists!");
            }else{
                let newAdmin = new Admin({
                    name: req.body.name,
                    adminId: req.body.adminId,
                    branch: req.body.branch,
                    email: req.body.email,
                    password: req.body.password
                });
            
                newAdmin.save();
                alert("Access Granted Successfully");
            }
        }
    });

    res.redirect("login");
});

// create new exam button clicked => form submission 
app.post("/createExam", (req, res)=>{
    Admin.findOne({adminId: req.body.submitButton}, (err, user)=>{
        if(err){
            console.log(err);
        }else{
            if(!user){
                console.log("User is having null value -> /createExam post request");
            }else{
                res.render("createExam", {user: user});
            }
        }
    });
});

app.post("/adminResults", (req, res)=>{
    Admin.findOne({adminId: req.body.submitButton}, (err, user)=>{
        if(err){
            console.log(err);
        }else{
            if(!user){
                console.log("User is having null value -> /createExam post request");
            }else{
                Result.find({examId: req.body.examID}, (errResult, resultsArray)=>{
                    if(errResult){
                        console.log(errResult);
                    }else{
                        //console.log(resultsArray);
                        if(resultsArray.length > 0){

                            let namesArray = [];
                            for(let i=0;i<resultsArray.length;i++){
                                Student.findOne({rollNo: resultsArray[i].rollNo}, (errstudentName, studentName)=>{
                                    //console.log(studentName.name);
                                    namesArray.push(studentName.name);
                                });
                            }

                            setTimeout(()=>{
                                res.render("adminResults", {user: user, resultsArray: resultsArray, namesArray: namesArray});
                            },1500); 
                        }else{
                            alert("Invalid Exam ID /or This exam has not been conducted yet!");
                        }
                    }
                });
            }
        }
    });
});

// admin created exam paper and submitted the create new exam form => handled here
app.post("/handleExamQuestions", (req, res)=>{
    let questionPaper = [];
    
    let questionNumber = 1;
    let numberOfQuestions =  (Object.keys(req.body).length - 5)/6;

    if(numberOfQuestions == 0){
        console.log("Exam with 0 questions cannot be scheduled!");
        alert("Exam with 0 questions cannot be scheduled!");
    }else{
        while(numberOfQuestions>0){
            let questionId = req.body['question' + questionNumber];
            let option1Id = req.body['question' + questionNumber + '_option1'];
            let option2Id = req.body['question' + questionNumber + '_option2'];
            let option3Id = req.body['question' + questionNumber + '_option3'];
            let option4Id = req.body['question' + questionNumber + '_option4'];
            let correctAnswerId = req.body['question' + questionNumber + '_ca'];
    
            let newQuestion = {
                question: questionId,
                optionA: option1Id,
                optionB: option2Id,
                optionC: option3Id,
                optionD: option4Id,
                correctOption: correctAnswerId
            };
    
            questionPaper.push(newQuestion);
    
            questionNumber++;
            numberOfQuestions--;
        }
    
        const dateTime = moment(req.body.dateAndTime).format('MMMM Do YYYY, h:mm:ss a');
        const dateTimeArray = dateTime.split(",");

        let updatedTime = dateTimeArray[1];
        let secondColonIndex = 0,ct=0;
        while(ct<2){
            if(updatedTime[secondColonIndex]==':'){
                ct++;
            }
            secondColonIndex++;
        }

        updatedTime = updatedTime.substring(0,secondColonIndex-1);
        secondColonIndex+=2;
        updatedTime += dateTimeArray[1].substr(secondColonIndex,dateTimeArray[1].length);
        
        //console.log(updatedTime);

        let newExam = new Exam({
            examId: req.body.examId,
            adminId: req.body.adminId,
            description: req.body.description,
            branch: req.body.branch,
            date: dateTimeArray[0],
            time: updatedTime,
            questions: questionPaper,
            marks: (questionPaper.length)*4
        });
    
        newExam.save();
        alert("Exam Scheduled Successfully!");
    }
    
    Admin.findOne({adminId: req.body.adminId}, (err, currAdmin)=>{
        if(err){
            console.log(err);
        }else{
            if(currAdmin){
                res.render("adminPortal", {user: currAdmin});
            }else{
                console.log("currAdmin is having null value -> /handleexamques post request");
            }
        }
    });
});

// Attempt exam
app.post("/attemptExam", (req, res)=>{
    let examId_rollNo = req.body.startTestButton;
    let examId_rollNo_Array = examId_rollNo.split(" ");
    // console.log(examId_rollNo_Array);
    
    Student.findOne({rollNo: examId_rollNo_Array[1]}, (err, user)=>{
        if(err){
            console.log(err);
        }else{
            if(user){
                Exam.findOne({examId: examId_rollNo_Array[0]}, (examErr, exam)=>{
                    if(examErr){
                        console.log(examErr);
                    }else{
                        if(exam){
                            res.render("exam", {user: user, exam: exam});
                        }else{
                            console.log("exam is null at /attemptexam post req");
                        }
                    }
                });
            }else{
                console.log("User is null at /attemptExam post req");
            }
        }
    });
});

// exam is submitted here
app.post("/examSubmitted", (req, res)=>{
    // console.log(req.body.ans1); A
    // console.log(req.body.ans2); undefined if not attempted that ques

    let examId_rollNo = req.body.submitExamButton;
    let examId_rollNo_Array = examId_rollNo.split(" ");

    Student.findOne({rollNo: examId_rollNo_Array[1]}, (err, user)=>{
        if(err){
            console.log(err);
        }else{
            if(user){
                Exam.findOne({examId: examId_rollNo_Array[0]}, (examErr, exam)=>{
                    if(examErr){
                        console.log(examErr);
                    }else{
                        if(exam){
                            let score = 0;
                            for(let i=0; i<exam.questions.length; i++){
                                let currAnswer = req.body['ans' + (i+1)];

                                if(currAnswer){
                                    if(currAnswer === exam.questions[i].correctOption){
                                        score += 4;
                                    }else{
                                        score--;
                                    }
                                }
                            }

                            let newResult = new Result({
                                rollNo: user.rollNo,
                                adminId: exam.adminId,
                                examId: exam.examId,
                                scoredMarks: score,
                                totalMarks: (exam.questions.length)*4,
                                description: exam.description,
                                date: exam.date,
                                time: exam.time
                            });

                            newResult.save();
                            alert("Exam is submitted successfully!")
                            
                            Exam.find({branch: user.branch}, (errExam, examsArray)=>{
                                if(errExam){
                                    console.log(errExam);
                                }else{
                                    res.render("studentDashboard", {user: user, examsArray: examsArray});
                                }
                            });
                        }else{
                            console.log("exam is null at /attemptexam post req");
                        }
                    }
                });
            }else{
                console.log("User is null at /attemptExam post req");
            }
        }
    });
});

// results post request from sidebar on student dashboard page
app.post("/studentResult", (req, res)=>{
    const userEmail = req.body.resultButton;

    Student.findOne({email: userEmail}, (err, currStudent)=>{
        if(err){
            console.log(err);
        }else{
            if(currStudent){
                Result.find({rollNo: currStudent.rollNo}, (resultErr, resultArray)=>{
                    res.render("studentResult", {user: currStudent, examsArray: resultArray});
                });
            }else{
                console.log("currStudent is having null value -> /studentResult post request");
            }
        }
    });
});

// Setup server
app.listen(process.env.PORT || 3000, (req, res)=>{
    console.log("Server started at port 3000");
});