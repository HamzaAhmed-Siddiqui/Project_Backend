const bodyParser = require("body-parser");
const connection = require("./Database");

const express = require("express");

var app = express();
const cors = require("cors");
app.use(
    cors({
        origin: "http://localhost:5173",
    })
);

app.get("/", (req, res) => {
    res.json({ message: "ok" });

});

app.use(bodyParser.json());

// app.get("/login", (req, res) => {
//     connection.query(
//       "SELECT * FROM users " +
//       "UNION " +
//       "SELECT * FROM teachers",
//       (err, rows) => {
//         if (err) {
//           console.log(err); // Log the error details
//           res.status(500).send("Internal Server Error");
//         } else {
//           res.send(rows);
//         }
//       }
//     );
//   });

//   app.get('/students', (req, res) => {
//     res.json(students);
//   });
//   app.post('/login', (req, res) => {
//     const { email, password } = req.body;
//     const student = students.find(
//       student => student.email === email && student.password === password
//     );
//     if (student) {
//       res.json({ message: 'Login successful' });
//     } else {
//       res.status(401).json({ message: 'Invalid credentials' });
//     }
//   });

app.post("/login", (req, res) => {
    const { email, password } = req.body;
    connection.query(
         "SELECT * FROM student" +
         "UNION " +
        "SELECT * FROM teachers",
        (err, rows) => {
            if (err) {
                console.log(err); // Log the error details
                res.status(500).send("Internal Server Error");
            } else {
                const student = rows.find(
                    (row) => row.email === email && row.password === password
                );
                if (student) {
                    res.json({ message: "Login successful" });
                } else {
                    res.status(401).json({ message: "Invalid credentials" });
                }
            }
        }
    );
});

app.get("/teacher", (req, res) => {
    connection.query("SELECT * FROM teachers", (err, rows) => {
        if (err) {
            console.log(err);
        } else {
            //console.log(rows)
            res.send(rows);
        }
    });
});

app.get("/teacher/:id", (req, res) => {
    connection.query(
        "SELECT * FROM teachers WHERE teacher_id=?",
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
});

app.delete("/teacher/:id", (req, res) => {
    connection.query(
        "DELETE FROM teachers WHERE teacher_id=?",
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
});

app.delete("/teacher/:id", (req, res) => {
    connection.query(
        "DELETE FROM teachers WHERE teacher_id=?",
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
});


//name class email password
//TEACHER SIGNUP API
app.post("/teacherSignup", async (req, res) => {
    try {
        const emp = req.body;
        const empData = [emp.name, emp.class, emp.email, emp.password];

        // Check if the name already exists in the database
        connection.query(
            "SELECT * FROM teachers WHERE name = ?",
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
                    "INSERT INTO teachers(name ,class, email, password ) VALUES(?)",
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
