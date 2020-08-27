// var socket = io()

// const socket = io("http://localhost:3000/run");

// $(function (){
// var socket = io.connect("http://localhost:3000/run")
// socket.connect("http://localhost:3000/run");
// io.connect("http://localhost:3000/run");

$("#select .buttons .button").click(function (e) {
  outputDisable();
  var valor = $(this).val();
  var nome = $(this).text();
  socket.emit("selector", valor);
  console.log(nome);
  $("#classificacao").text(nome);
  $("#select .buttons .button").prop("disabled", true);
});

// ACTION

// OUTPUT
// function outputEnable(){
// $('.body #output').removeClass('is-hidden');
// }

export function output(msg) {
  console.log("inside");
  // outputEnable()
  $(".body #output").append($("<h4>").text(msg.data));
}

// socket.on("output-update", function (msg) {
//   console.log(msg);
//   output(msg);
// });
// });
