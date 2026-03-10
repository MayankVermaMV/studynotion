const express = require("express");
const router = express.Router();

const { searchCourses } = require("./search.controller");

router.get("/courses", searchCourses);

module.exports = router;
