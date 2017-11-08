const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
    res.contentType("html").send("<h2>There's nothing for you here</h2>");
});

module.exports = router;
