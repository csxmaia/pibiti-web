// var state={
var resultCount = 0;
var theme = ["is-primary", "is-warning", "is-info"];
// }

export function output(msg) {
  // outputEnable()
  let output = document.getElementById("output");
  let textElement = document.createElement("H4");
  let text = document.createTextNode(msg.data);

  textElement.appendChild(text);
  output.appendChild(textElement);
}

export function outputEnable() {
  let output = document.getElementById("output");
  output.classList.remove("is-hidden");
}

export function outputDisable() {
  let output = document.getElementById("output");
  output.classList.add("is-hidden");
  output.innerHTML = "";
}

export function resultBox(status) {
  let result = document.getElementById("result");
  if (status === true) result.classList.remove("is-hidden");
  else {
    result.classList.add("is-hidden");
    removeResult();
  }
}

export function addResult(act) {
  let splitter = act.split(" &value& ");

  let tile = document.createElement("DIV");
  tile.setAttribute("id", `result-item-${resultCount}`);
  tile.classList.add("result-item", "notification", theme[resultCount]);

  let subtitleElement = document.createElement("P");
  subtitleElement.classList.add("subtitle");
  let subtitleText = document.createTextNode(splitter[0]);
  subtitleElement.appendChild(subtitleText);

  let titleElement = document.createElement("P");
  titleElement.classList.add("title");
  let titleText = document.createTextNode(splitter[1]);
  titleElement.appendChild(titleText);

  tile.appendChild(subtitleElement);
  tile.appendChild(titleElement);

  let resultDiv = document.getElementById("result");
  resultDiv.append(tile);

  resultCount += 1;
}

export function removeResult() {
  resultCount = 0;
  let removeResult = document.getElementById("result");
  removeResult.innerHTML = "";
}

export function buttonDisabledProp(hasTwoFiles, disable, first = false) {
  var allButtons = document.getElementsByName("class-button");
  if (hasTwoFiles === true) {
    //Only Fusão
    for (var x = 0; x < allButtons.length; x++) {
      if (allButtons[x].value == 4) allButtons[x].disabled = disable;
    }
    if (first === true) {
      for (var x = 0; x < ["0", "1", "2", "3"].length; x++) {
        allButtons[x].disabled = !disable;
      }
    }
  } else {
    for (var x = 0; x < allButtons.length; x++) {
      if (["0", "1", "2", "3"].includes(allButtons[x].value)) {
        allButtons[x].disabled = disable;
      }
    }
    if (first === true) allButtons[4].disabled = !disable;
  }
}
