
const connection = require('./Database'); 

exports.deleteTeacher = (req, res) => {
  try {
    connection.query(
      'DELETE FROM teachers WHERE teacher_id=?',
      [req.params.id],
      (err, rows) => {
        if (err) {
          console.log(err);
          return res.status(500).send({ message: 'Something went wrong' });
        } else {
          //console.log(rows)
          res.send(rows);
          console.log('Success');
        }
      }
    );
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: 'Something went wrong' });
  }
};



