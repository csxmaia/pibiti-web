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

var custom = "";
var templateCustom = ["action", "result"];

var fusao = ["Soma", "Produto", "Max"];
var fusaoCount = 0;

//static files in public folder
app.use(express.static(__dirname + "/public"));

//index; select a file to upload
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/pages/index.html");
});

app.get("/classificador-base", function (req, res) {
  res.sendFile(__dirname + "/pages/base-intro.html");
});

app.get("/classificador-pessoa", function (req, res) {
  res.sendFile(__dirname + "/pages/pessoa-intro.html");
});

app.get("/classificador-pessoa/upload/:id", function (req, res) {
  
  res.sendFile(__dirname + "/pages/pessoa_upload.html");
});

app.get("/classificador-pessoa/:id", function (req, res) {
  //2 - incluir pessoa por gravação 3 - gravar uma amostra para teste
  res.sendFile(__dirname + "/pages/pessoa_gravacao.html");
});

app.post("/classificador-pessoa/:id", function (req, res) {
  const {id} = req.params;
  //1 - incluir pessoa por upload 4 - upar uma amostra já gravada para teste
  if(id==1 || id==4){
    var formidable = require("formidable");
    var fs = require("fs");
    var form = new formidable({multiples: true})
    const arquivos = fs.readdirSync(`${process.env.MAIN_SCRIPT_PATH}/PIBITI/brSD_audiofeat_audios`);
    const total_pessoas = arquivos.length;
    const ultimo_audio = total_pessoas*5;

    try {
      fs.rmdir(`${process.env.MAIN_SCRIPT_PATH}/PIBITI/audios_gravados`, { recursive: true }, (err) => {
        if (err) {
          throw err;
        }
      })
      console.log("dir audios_gravados excluido")
    } catch (error) {
      console.log("Error deletar dir audios_gravados " + error)      
    }
    console.log(ultimo_audio)

    try {
      fs.unlinkSync(`${process.env.MAIN_SCRIPT_PATH}/audios_upados_teste/entrada_upada_teste.wav`)
    } catch (error) {
      console.log("entrada_upada_teste nao existe para exclusao")
    }

    form.parse(req, function (err, fields, files) {
      if(id==1){
        var oldPath = {
          audio1: files.audio1.path,
          audio2: files.audio2.path,
          audio3: files.audio3.path,
          audio4: files.audio4.path,
          audio5: files.audio5.path,
        }
        var newPath = {}
        Object.keys(oldPath).map(function(name, index) {
          newPath = {...newPath, [name]:`${process.env.MAIN_SCRIPT_PATH}/PIBITI/audios_gravados/${(ultimo_audio+1)+index}.wav`}
        });
        
        Object.keys(newPath).map(function(name, index) {
          fs.rename(oldPath[name], newPath[name], function (err) {
            if (err) throw err;
          });
        })
        res.sendFile(__dirname + "/pages/pessoa.html");
      }
      if(id==4){
        var oldPath = files.audio1.path
        var newPath = `${process.env.MAIN_SCRIPT_PATH}/audios_upados_teste/entrada_upada_teste.wav`
        fs.rename(oldPath, newPath, function (err) {
          if (err) throw err;
        });
        res.sendFile(__dirname + "/pages/pessoa.html");
      }
    })

  }
});

//File upload
app.post("/run", function (req, res, next) {
  fileOne = undefined;
  fileTwo = undefined;
  var formidable = require("formidable");
  var fs = require("fs");
  var form = new formidable.IncomingForm();
  try {
    fs.unlinkSync(`${process.env.MAIN_SCRIPT_PATH}/features/data1.txt`)
  } catch (error) {
    console.log("data 1 nao existe para exclusao")
  }
  try {
    fs.unlinkSync(`${process.env.MAIN_SCRIPT_PATH}/features/data2.txt`)
  } catch (error) {
    console.log("data 2 nao existe para exclusao")
  }
  form.parse(req, function (err, fields, files) {
    if (files.feature1.name !== '') {
      var oldPath = files.feature1.path;
      var newPath = `${process.env.MAIN_SCRIPT_PATH}/features/` + "data1.txt";
      fs.rename(oldPath, newPath, function (err) {
        if (err) throw err;
      });
      fileOne = files.feature1.name;
    }
    if (files.feature2.name !== '') {
      var fileName = "";
      if (files.feature1.name !== "") {
        //caso feature 1 exista setar como data2, normal
        fileTwo = files.feature2.name;
        fileName = "data2";
      } else {
        fileOne = files.feature2.name;
        fileName = "data1";
      }
      var oldPath = files.feature2.path;
      var newPath = `${process.env.MAIN_SCRIPT_PATH}/features/${fileName}.txt`;
      fs.rename(oldPath, newPath, function (err) {
        if (err) throw err;
      });
    }
    custom = "";
    console.log("Special: " + custom);
    // fs.access(`${process.env.MAIN_SCRIPT_PATH}/features/data1.txt`, fs.F_OK, (err) => {
    //   if (err) {
    //     console.error(err)
    //     return
    //   }
    //   console.log("existe")
    // })
    res.sendFile(__dirname + "/pages/base.html");
  });
});

io.of("/pessoa-gravacao").on("connection", function (socket) {
  console.log("a user connected");

  var options = {
    mode: 'text',
    // pythonPath: 'C:/Python38/python',
  }

  var shell = new PythonShell(
    `${process.env.MAIN_SCRIPT_PATH}/rec_voz.py`,
    options
  );

  shell.on("message", function (message) {
    output = String(message);
    isAction = output.split(" && ");
    console.log(output)
    // console.log(isAction);
    //if action emit action to action, perform with the data (the real action)

    if (isAction[0] === "action") {

      if(isAction[1] === "text_without"){
        socket.emit("text_without", {
          data: isAction[2],
        });
      }

      if(isAction[1] === "loading"){
        socket.emit("loading", {
          loading: isAction[2],
          data: isAction[3],
        });
      }

      if(isAction[1] === "result"){
        socket.emit("loading", {
          loading: isAction[2],
          data: isAction[3],
        });
      }

      if (isAction[1] === "text") {
        socket.emit("etapa-text", {
          data: isAction[2],
        });
      }

    }
  })

  socket.once("envia-comando", function (id) {
    shell.send(parseInt(id));
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
    shell.childProcess.kill("SIGINT");
  });
});

io.of("/pessoa-upload").on("connection", function (socket) {
  console.log("a user connected");

  var options = {
    mode: 'text',
    // pythonPath: 'C:/Python38/python',
  }

  var shell = new PythonShell(
    `${process.env.MAIN_SCRIPT_PATH}/rec_voz.py`,
    options
  );

  shell.on("message", function (message) {
    output = String(message);
    isAction = output.split(" && ");
    console.log(output)
    // console.log(isAction);
    //if action emit action to action, perform with the data (the real action)

    if (isAction[0] === "action") {
      if (isAction[1] === "result") {
        socket.emit("output", {
          data: isAction[2],
        });
      }
    }
  })

  socket.once("envia-comando", function (id) {
    shell.send(parseInt(id));
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
    shell.childProcess.kill("SIGINT");
  });
});

io.of("/run").on("connection", function (socket) {
  console.log("a user connected");

  //Initial context
  socket.emit("output", {
    data: "Separando as amostras de treino e de teste...",
  });

  if (!fileTwo) {
    socket.emit("action", {
      data: ["action", "1file", fileOne],
    });
  } else {
    socket.emit("action", {
      data: ["action", "2file", fileOne, fileTwo],
    });
  }

  var options = {
    mode: 'text',
    // pythonPath: 'C:/Python38/python',
  }

  var shell = new PythonShell(
    `${process.env.MAIN_SCRIPT_PATH}/importar_arquivo.py`,
    options
  );

  shell.on("message", function (message) {
    output = String(message);
    isAction = output.split(" && ");
    // console.log(isAction);
    //if action emit action to action, perform with the data (the real action)

    if (isAction[0] === "exec") {
      if (isAction[2] === "init") {
        socket.emit("output", {
          data: "Gerando arquivos de treino e teste...",
        });
        custom = isAction[1];
      }
      if (isAction[2] === "end") {
        custom = "";
      }
    }

    if (custom === "svm") {
      var isResult = output.split(" ");
      // console.log(isResult);
      if (isResult[0] === "Accuracy") {
        templateCustom[2] = `Accuracy &value& ${isResult[2]} ${isResult[3]}`;
        socket.emit("action", { data: templateCustom });
      }
    }

    if (custom === "fusao") {
      var isResult = output.split(" ");
      console.log(isResult);
      if (isResult[0] === "Total" && (isResult[6] !== null && isResult[6] !== undefined)) {
        console.log(isResult[6]);
        console.log(typeof (isResult[6]));
        templateCustom[2] = `${fusao[fusaoCount]} &value& ${isResult[6]}(${isResult[3]})`;
        fusaoCount += 1;
        console.log(templateCustom)
        socket.emit("action", { data: templateCustom });
        if (fusaoCount === 3) {
          fusaoCount = 0;
        }
      }
    }

    if (isAction[0] === "action") {
      socket.emit("action", { data: isAction });
      if (isAction[1] === "class" || isAction[1] === "while") {
        socket.once("class-select", function (id) {
          shell.send(id);
        });
      }
      //if false; return the print as output text
    } else if (custom === "") {
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
