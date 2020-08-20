const path = require('path');
const {PythonShell} = require('python-shell');
require('dotenv').config();

const express = require('express'); 
const app = express()
http = require('http').createServer(app)
io = require('socket.io')(http);

//static files in public folder
app.use(express.static(__dirname + '/public'));

//index; select a file to upload
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

//File upload
app.post('/run', function(req, res, next){
  var formidable = require('formidable');
  var fs = require('fs');
  var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
      // console.log(files.feature.path)
      //change file name and path
      var oldpath = files.feature.path;
      var newpath = `${process.env.MAIN_SCRIPT_PATH}/features/` + 'data.txt';
      console.log(newpath)
      fs.rename(oldpath, newpath, function (err) {
        if (err) throw err;
        // so throw feature script file
        res.sendFile(__dirname + '/feature.html');
      });
    });
});
// io.of("/new").on("connection", function (socket) {
//   console.log("testeeeeeeeeeeeeeeeeeeeeeeee")
//   io.sockets.emit('asd', { data: "saco" })
// });

// let shell = new PythonShell('../PIBITI/libsvm-3.24/tools/easy.py', { mode: 'text', args: ['vetTreino.txt', 'vetor_diss_teste.txt']});

io.of('/run').on('connection', function (socket) {
  
  console.log('a user connected');
  
  let shell = new PythonShell(`${process.env.MAIN_SCRIPT_PATH}/importar_arquivo.py`, { mode: 'text'});
  
  shell.on('message', function (message) {
    //get print ad turn into String
    var output = String(message);
    //Split print; to search Actions
    var isAction = output.split(" ")
    console.log(isAction)

    //if action emit action to action perform with the data (the real action)

    if(isAction[0] === "action") {
      console.log("emitindo "+isAction[1])
      socket.emit('action', { data: isAction})
      //class is the one of all who need input in script by web, so this special if
      if (isAction[1] === "class" || isAction[1] === "while") {
        socket.once('selector', function(id) {
          console.log(id)
          shell.send(id)
        })
      }
      //if false; return the print as output text
    }else{
      socket.emit('output-update', { data: output });
    }

  });
  
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

});


http.listen(3000, () => {
  console.log('listening on *:3000');
});
// app.listen(process.env.PORT || 3000, () => console.log("localhost:"+process.env.PORT))