export function output(msg) {
  // outputEnable()
  $(".body #output").append($("<h4>").text(msg.data));
}

export function outputDisable() {
  // $('.body #output').addClass('is-hidden');
  $(".body #output h4").remove();
}

export function resultBox(status) {
  if (status === true) $("#result").removeClass("is-hidden");
  else $("#result").addClass("is-hidden");
}

export function addResult(act) {
  let splitter = act.split(" &value& ");
  $("#result-item-1").append($("<p class='subtitle'>").text(splitter[0]));
  $("#result-item-1").append($("<p class='title'>").text(splitter[1]));
}

export function removeResult() {
  console.log("calling");
  $(".result-item p").remove();
}

export function buttonDisabledProp(hasTwoFiles, disable, first = false) {
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
