const cors = require("cors");
const express = require("express");
const mysql = require("mysql2/promise");

const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
	res.send("Working");
});

app.listen(3000, () => console.log("Port is working on port 3000"));
