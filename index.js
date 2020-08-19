const express = require('express'); 
const {PythonShell} = require('python-shell');

const multer = require('multer');
const path = require('path');

const app = express()
http = require('http').createServer(app)
io = require('socket.io')(http);
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.post('/run', function(req, res, next){
  var formidable = require('formidable');
  var fs = require('fs');
  var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
      // console.log(files.feature.path)
      var oldpath = files.feature.path;
      var newpath = '../PIBITI/features/' + 'data.txt';
      fs.rename(oldpath, newpath, function (err) {
        if (err) throw err;
        // res.write('File uploaded and moved!');
        res.sendFile(__dirname + '/feature.html');
      });
    });
});
// io.of("/new").on("connection", function (socket) {
//   console.log("testeeeeeeeeeeeeeeeeeeeeeeee")
// });


io.of("/run").on('connection', (socket) => {
  
  console.log('a user connected');
  
  let shell = new PythonShell('../PIBITI/importar_arquivo.py', { mode: 'text'});
  // let shell = new PythonShell('../PIBITI/libsvm-3.24/tools/easy.py', { mode: 'text', args: ['vetTreino.txt', 'vetor_diss_teste.txt']});
  shell.on('message', function (message) {
    var output = String(message);
    var isget = output.split(" ")
    console.log(isget)
    if(isget[0] === "get") {
      io.sockets.emit('get', { data: isget[1]})
      if(isget[1] === "class"){
        socket.on('selector', function(id) {
          shell.send(id)
        })
      }
    }else{
      io.sockets.emit('output-update', { data: output });
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