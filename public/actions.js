import {
  handleFileName,
  resultBox,
  addResult,
  outputEnable,
  outputClear,
  outputDisable,
  buttonDisabledProp,
} from "./functions.js";

var twoFiles = false;
var nameFiles = [];

export function getAction(act) {
  switch (true) {
    //class disable
    case act[1] === "1file":
      nameFiles.push(act[2]);
      handleFileName(nameFiles);
      buttonDisabledProp(twoFiles, false, true);
      break;
    case act[1] === "2file":
      twoFiles = true;
      nameFiles.push(act[2], act[3]);
      handleFileName(nameFiles);
      buttonDisabledProp(twoFiles, false, true);
      break;

    case act[1] === "class":
      let classification = document.getElementById("select");
      classification.classList.remove("is-hidden");
      outputClear();
      outputEnable();
      resultBox(false);
      break;

    //loading enable n disable
    case act[1] === "loading" && act[2] === "false":
      let loading_add = document.getElementById("loading");
      loading_add.classList.add("is-hidden");
      break;

    case act[1] === "loading" && act[2] === "true":
      let loading_remove = document.getElementById("loading");
      loading_remove.classList.remove("is-hidden");
      outputEnable();
      break;

    case act[1] === "result":
      addResult(act[2]);
      break;

    case act[1] === "final":
      let loading = document.getElementById("loading");
      let result = document.getElementById("result");
      loading.classList.add("is-hidden");
      result.classList.remove("is-hidden");
      buttonDisabledProp(twoFiles, false);
      outputDisable();
      break;

    default:
      console.log("comando desconhecido");
      break;
  }
}
