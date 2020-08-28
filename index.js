const path = require("path");
const { PythonShell } = require("python-shell");
require("dotenv").config();

const express = require("express");
const app = express();
http = require("http").createServer(app);
io = require("socket.io")(http);

//state
var fileOne = undefined;
var fileTwo = undefined;
var classification = undefined;

var output = "";
var isAction = "";

//static files in public folder
app.use(express.static(__dirname + "/public"));

//index; select a file to upload
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

//File upload
app.post("/run", function (req, res, next) {
  var formidable = require("formidable");
  var fs = require("fs");
  var form = new formidable.IncomingForm();
  form.parse(req, function (err, fields, files) {
    //change file name and path
    var oldPath = files.feature1.path;
    var newPath = `${process.env.MAIN_SCRIPT_PATH}/features/` + "data1.txt";
    fs.rename(oldPath, newPath, function (err) {
      if (err) throw err;
    });
    fileOne = files.feature1.name;
    if (files.feature2) {
      var oldPath = files.feature2.path;
      var newPath = `${process.env.MAIN_SCRIPT_PATH}/features/` + "data2.txt";
      fs.rename(oldPath, newPath, function (err) {
        if (err) throw err;
      });
      fileTwo = files.feature2.name;
    }
    res.sendFile(__dirname + "/feature.html");
  });
});

io.of("/run").on("connection", function (socket) {
  console.log("a user connected");

  //Initial context
  socket.emit("output-update", {
    data: "Separando as amostras de treino e de teste...",
  });

  if (!fileTwo) {
    socket.emit("action", {
      data: ["action", "1file"],
    });
  } else {
    socket.emit("action", {
      data: ["action", "2file"],
    });
  }

  var shell = new PythonShell(
    `${process.env.MAIN_SCRIPT_PATH}/importar_arquivo.py`,
    { mode: "text" }
  );

  shell.on("message", function (message) {
    output = String(message);
    isAction = output.split(" && ");
    console.log(isAction);
    //if action emit action to action, perform with the data (the real action)
    if (isAction[0] === "action") {
      socket.emit("action", { data: isAction });
      if (isAction[1] === "class" || isAction[1] === "while") {
        socket.once("selector", function (id) {
          shell.send(id);
        });
      }
      //if false; return the print as output text
    } else {
      socket.emit("output", { data: output });
    }
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
    shell.childProcess.kill("SIGINT");
  });
});

http.listen(3000, () => {
  console.log("listening on *:3000");
});
// app.listen(process.env.PORT || 3000, () => console.log("localhost:"+process.env.PORT))
