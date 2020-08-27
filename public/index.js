// var socket = io()
const socket = io("http://localhost:3000/run");
// $(function (){
// var socket = io.connect("http://localhost:3000/run")
// socket.connect("http://localhost:3000/run");
// io.connect("http://localhost:3000/run");

var twoFiles = false;

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
    case act[1] === "1file":
      buttonDisabledProp(twoFiles, false, true);
      break;

    case act[1] === "2file":
      twoFiles = true;
      buttonDisabledProp(twoFiles, false, true);
      break;

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
      buttonDisabledProp(twoFiles, false);
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

function buttonDisabledProp(hasTwoFiles, disable, first = false) {
  if (hasTwoFiles === true) {
    //Only Fusão
    $("#select .buttons .button[value='4']").prop("disabled", disable);
    if (first === true) {
      $("#select .buttons .button[value='0']").prop("disabled", !disable);
      $("#select .buttons .button[value='1']").prop("disabled", !disable);
      $("#select .buttons .button[value='2']").prop("disabled", !disable);
      $("#select .buttons .button[value='3']").prop("disabled", !disable);
    }
  } else {
    $("#select .buttons .button[value='0']").prop("disabled", disable);
    $("#select .buttons .button[value='1']").prop("disabled", disable);
    $("#select .buttons .button[value='2']").prop("disabled", disable);
    $("#select .buttons .button[value='3']").prop("disabled", disable);
    if (first === true) {
      $("#select .buttons .button[value='4']").prop("disabled", !disable);
    }
  }
}

function outputDisable() {
  // $('.body #output').addClass('is-hidden');
  $(".body #output h4").remove();
}

function output(msg) {
  // outputEnable()
  $(".body #output").append($("<h4>").text(msg.data));
}

socket.on("output-update", function (msg) {
  console.log(msg);
  output(msg);
});

// });
