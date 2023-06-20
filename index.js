const bodyParser = require("body-parser");
const connection = require("./Database");

const express = require("express");

var app = express();

app.get("/", (req, res) => {
    res.json({ message: "ok" });
});

app.use(bodyParser.json());

app.get("/user", (req, res) => {
    connection.query("SELECT * FROM users", (err, rows) => {
        if (err) {
            console.log(err);
        } else {
            //console.log(rows)
            res.send(rows);
        }
    });
});

app.get("/user/:id", (req, res) => {
    connection.query(
        "SELECT * FROM users WHERE user_id=?",
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


app.delete("/user/:id", (req, res) => {
    connection.query(
        "DELETE FROM users WHERE user_id=?",
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
//name class email password 

app.post("/teacher", async (req, res) => {
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



app.listen(6000, () => console.log("Server Started"));