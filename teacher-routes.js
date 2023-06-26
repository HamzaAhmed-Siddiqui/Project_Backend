

const express = require('express');
const router = express.Router();
const teacherController = require('./teacher-controller');

router.delete('/:id', teacherController.deleteTeacher);


module.exports = router;
