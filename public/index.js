// var socket = io()
const socket = io("http://localhost:3000/run");
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
socket.on("action", function (msg) {
  console.log(msg.data);
  getAction(msg.data);
});

function getAction(act) {
  switch (true) {
    case act[1] === "class":
      $(".body #select").removeClass("is-hidden");
      outputDisable();
      break;

    case act[1] === "loading" && act[2] === "false":
      $("#loading").addClass("is-hidden");
      break;

    case act[1] === "loading" && act[2] === "true":
      $("#loading").removeClass("is-hidden");
      break;

    case act[1] === "final":
      $("#loading").addClass("is-hidden");
      $("#select .buttons .button").prop("disabled", false);
      // outputEnable()
      break;

    default:
      console.log("comando desconhecido");
      break;
  }
}

// OUTPUT
// function outputEnable(){
// $('.body #output').removeClass('is-hidden');
// }

function outputDisable() {
  // $('.body #output').addClass('is-hidden');
  $(".body #output h4").remove();
}

function output(msg) {
  // outputEnable()
  $(".body #output").append($("<h4>").text(msg.data));
}

socket.on("output-update", function (msg) {
  output(msg);
});

// });
