import {
  resultBox,
  addResult,
  removeResult,
  outputDisable,
  buttonDisabledProp,
} from "./functions.js";

var twoFiles = false;

export function getAction(act) {
  switch (true) {
    //class disable
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
      resultBox(false);
      break;

    //loading enable n disable
    case act[1] === "loading" && act[2] === "false":
      $("#loading").addClass("is-hidden");
      break;

    case act[1] === "loading" && act[2] === "true":
      $("#loading").removeClass("is-hidden");
      break;

    case act[1] === "result":
      addResult(act[2]);
      break;

    case act[1] === "final":
      $("#loading").addClass("is-hidden");
      $("#result").removeClass("is-hidden");
      buttonDisabledProp(twoFiles, false);
      // outputEnable();
      break;

    default:
      console.log("comando desconhecido");
      break;
  }
}
