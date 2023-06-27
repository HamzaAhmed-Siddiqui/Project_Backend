const connection = require("./Database");
const bcrypt = require('bcryptjs');
const teacherRoutes = require('./teacher-routes');

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");

const express = require("express");


var app = express();

const cors = require("cors");
app.use(cors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST"],
    credentials: true
})
);

app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: true }));


app.use(session({
    key: "userId",
    secret: "subscribe",
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 60 * 60 * 24,
    }
}
))

app.get("/", (req, res) => {
    res.json({ message: "ok" });
});


app.use(bodyParser.json());

//LOGIN
app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        connection.query(
            "SELECT email, password FROM student " +
            "UNION " +
            "SELECT email, password FROM teachers",
            (err, rows) => {
                if (err) {
                    console.log(err); // Log the error details
                    res.status(500).send("Internal Server Error");
                } else {
                    const loginuser = rows.find(
                        (row) => row.email === email && row.password === password
                    );
                    if (loginuser) {
                        //console.log(student)
                        res.json({ status: true, message: "Login successful", data: loginuser });
                    } else {
                        res.status(401).json({ status: false, message: "Invalid credentials" });
                    }
                }
            }
        );
    }
    catch (error) {
        console.log(error);
        return res.status(500).send({ message: "Something went wrong" });
    }
});




//ALL TEACHER
app.get("/teacher", async (req, res) => {
    try {
        connection.query("SELECT teachername ,teacherclass,email,course1,course2,course3,course4,course5,course6 FROM teachers INNER JOIN courses where teacher_id = tch_id;", (err, rows) => {
            if (err) {
                console.log(err);
            } else {
                res.send(rows);
            }
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).send({ message: "Something went wrong" });
    }
});


//ALL STUDENT
app.get("/student", async (req, res) => {
    try {
        connection.query("SELECT id,studentclass,studentname,physics,maths,science,urdu,computer,chemistry FROM student", (err, rows) => {
            if (err) {
                console.log(err);
            } else {
                console.log(rows)
                res.status(200).send(rows);
            }
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: "Something went wrong" });
    }
});


//SINGLE TEACHER
app.get("/teacher/:id", async (req, res) => {
    try {
        connection.query(
            "SELECT * FROM teachers WHERE teacher_id=?",
            [req.params.id],
            (err, rows) => {
                if (err) {
                    console.log(err);
                } else {
                    res.send(rows);
                }
            }
        );
    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: "Something went wrong" });
    }
});


//SINGLE STUDENT
app.get("/student/:id", async (req, res) => {
    try {
        connection.query(
            "SELECT * FROM student WHERE id=?",
            [req.params.id],
            (err, rows) => {
                if (err) {
                    console.log(err);
                } else {
                    res.send(rows);
                }
            }
        );
    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: "Something went wrong" });
    }
});
//update student
app.patch("/student", async (req, res) => {
    try {
        const emp = req.body;
        connection.query(
            "UPDATE student SET ? WHERE id=" + emp.id,
            [emp],
            (err, rows) => {
                if (err) {
                    console.log(err);
                } else {
                    //console.log(rows)
                    res.json({ status: true, message: "updated succesfully", data: rows });

                    //res.send(rows);
                }
            }
        );
    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: "Something went wrong" });
    }

});

//SINGLE STUDENT
app.get("/student/:id", async (req, res) => {
    try {
        connection.query(
            "SELECT id,studentclass,studentname,physics,maths,science,urdu,computer,chemistry FROM student WHERE id=?; ",
            [req.params.id],
            (err, rows) => {
                if (err) {
                    console.log(err);
                } else {
                    //console.log(rows)
                    res.send(rows);
                }
            }
        );
    }
    catch (error) {
        console.log(error);
        return res.status(500).send({ message: "Something went wrong" });
    }
});




//DELETE A SPECIFIC TEACHER
// app.delete("/teacher/:id", async (req, res) => {
//     try {
//         connection.query(
//             "DELETE FROM teachers WHERE teacher_id=?",
//             [req.params.id],
//             (err, rows) => {
//                 if (err) {
//                     console.log(err);
//                 } else {
//                     //console.log(rows)
//                     res.send(rows);
//                     console.log("Success");
//                 }
//             }
//         );
//     } catch (error) {
//         console.log(error);
//         return res.status(500).send({ message: "Something went wrong" });
//     }
// });
// app.js or index.js



app.use('/teacher', teacherRoutes);



//DELETE SPECIFIC STUDENT
app.delete("/student/:id", async (req, res) => {
    try {
        connection.query(
            "DELETE FROM student WHERE id=?",
            [req.params.id],
            (err, rows) => {
                if (err) {
                    console.log(err);
                } else {
                    //console.log(rows)
                    res.send(rows);
                    console.log("Success");
                }
            }
        );
    }
    catch (error) {
        console.log(error);
        return res.status(500).send({ message: "Something went wrong" });
    }
});


//COURSES ADD FOR TEACHER


app.post("/courses", async (req, res) => {
    try {
        const emp = req.body;
        // console.log("BOdu========================================",emp)
        var empData = [emp.course1, emp.course2, emp.course3, emp.course4, emp.course5, emp.course6, emp.tch_id];
        connection.query(
            "INSERT INTO courses (course1,course2,course3,course4,course5,course6,tch_id) values(?)",
            [empData],
            (err, rows) => {
                if (err) {
                    console.log(err);
                } else {
                    //console.log(rows)
                    res.send(rows);
                }
            }
        );
    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: "Something went wrong" });
    }
});


//TEACHER SIGNUP API
app.post("/teacherSignup", async (req, res) => {
    try {
        const emp = req.body;
        console.log(req.body);
        const empData = [emp.name, emp.class, emp.email, emp.password];
        // const password = await bcrypt.hash(password,5)


        // Check if the name already exists in the database
        connection.query(
            "SELECT * FROM teachers WHERE teachername = ?",
            [emp.teachername],
            (err, rows) => {
                if (err) {
                    console.log(err);
                    return res.status(500).send({ message: "Something went wrong" });
                }


                if (rows.length > 0) {
                    // Name already exists in the database
                    return res.status(400).send({ message: "Name already exists" });
                    res.json({ message: "name already in db" });
                }


                // Insert the new record
                connection.query(
                    "INSERT INTO teachers(teachername ,teacherclass, email, password ) VALUES(?)",
                    [empData],
                    (err, result) => {
                        if (err) {
                            console.log(err);
                            return res.status(500).send({ message: "Something went wrong" });
                        }
                        // res.send(result);
                        res.status(200).json("All GOOD..!!")
                    }
                );
            }
        );
    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: "Something went wrong" });
    }
});




//STUDENT SIGNUP API
app.post("/studentSignup", async (req, res) => {
    try {
        const emp = req.body;
        const empData = [emp.name, emp.email, emp.password];


        // Check if the name already exists in the database
        connection.query(
            "SELECT * FROM student WHERE name = ?",
            [emp.name],
            (err, rows) => {
                if (err) {
                    console.log(err);
                    return res.status(500).send({ message: "Something went wrong" });
                }


                if (rows.length > 0) {
                    // Name already exists in the database
                    return res.status(400).send({ message: "Name already exists" });
                    res.json({ message: "name already in db" });
                }


                // Insert the new record
                connection.query(
                    "INSERT INTO student(name, email, password ) VALUES(?)",
                    [empData],
                    (err, result) => {
                        if (err) {
                            console.log(err);
                            return res.status(500).send({ message: "Something went wrong" });
                        }
                        res.send(result);
                    }
                );
            }
        );
    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: "Something went wrong" });
    }
});


//STUDENTS MARKS API
app.post("/studentMarks/:id", async (req, res) => {
    try {
        const mark = req.body;
        console.log(req.body)
        console.log(req.id)
        const markData = [mark.physics, mark.maths, mark.science, mark.urdu, mark.computer, mark.chemistry];
        const studentId = req.params.id; // Retrieve the student's ID from the URL parameter


        connection.query(
            "UPDATE student SET physics = ?, maths = ?, science = ?, urdu = ?, computer = ?, chemistry = ? WHERE id = ?",
            [...markData, studentId],
            (err, result) => {
                if (err) {
                    console.log(err);
                    return res.status(500).send({ message: "Something went wrong" });
                }
                res.send(result);
            }
        );
    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: "Something went wrong" });
    }
});




app.listen(4000, () => console.log("Server Started"));



