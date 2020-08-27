export function outputDisable() {
  // $('.body #output').addClass('is-hidden');
  $(".body #output h4").remove();
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
