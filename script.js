// script.js

var plainText;
var key;
var cipherKey;
var currentIndex = 0;

var minASCII = 65; // Minimum ASCII value
var maxASCII = 91; // Maximum ASCII value

function startDecryptAnimation() {
    initialize();
    printTable();
    decryptNextCharacter();
}

function startEncryptAnimation() {
    initialize();
    printTable();
    encryptNextCharacter();
}

function refresh() {
    var plainTextDisplay = document.querySelector("#plainTextDisplay");
    var keyDisplay = document.querySelector("#keyDisplay");
    var encryptedTextDisplay = document.querySelector("#encryptedTextDisplay");
	clearTableHighlights();
    plainTextDisplay.innerHTML = "";
    keyDisplay.innerHTML = "";
    encryptedTextDisplay.innerHTML = "";

    currentIndex = 0;
}

function initialize() {
    plainText = document.querySelector("#plainText").value;
    key = document.querySelector("#key").value;
    cipherKey = document.querySelector("#cipherKey").value;
    currentIndex = 0;
}

function encryptNextCharacter() {
	if (currentIndex < plainText.length) {
	  var plainChar = plainText[currentIndex];
	  var keyChar = key[currentIndex % key.length];
	  var encryptedChar = encryptChar(plainChar, keyChar);
  
	  cipherKey.value += encryptedChar;
  
	  var plainTextDisplay = document.querySelector("#plainTextDisplay");
	  var keyDisplay = document.querySelector("#keyDisplay");
	  var encryptedTextDisplay = document.querySelector("#encryptedTextDisplay");
  
	  plainTextDisplay.innerHTML += "<div class='box'>" + plainChar + "</div>";
	  keyDisplay.innerHTML += "<div class='box'>" + keyChar + "</div>";
	  encryptedTextDisplay.innerHTML += "<div class='box'>" + encryptedChar + "</div>";
  
	  currentIndex++;
  
	  highlightTableCharacters(plainChar, keyChar);
	}
  }
  
  function encryptChar(plainChar, keyChar) {
	var plainCharCode = plainChar.charCodeAt(0) - 65; // Convert to 0-25 range
	var keyCharCode = keyChar.charCodeAt(0) - 65; // Convert to 0-25 range
	var encryptedCharCode = (plainCharCode + keyCharCode) % 26 + 65; // Convert back to ASCII range
	return String.fromCharCode(encryptedCharCode);
  }

function stringToIntList(string) {
    var s = new Array();
    for (var i = 0; i < string.length; i++) {
        s[i] = string.charCodeAt(i);
    }
    return s;
}

function intsToCharList(integers) {
    var ints = new Array();
    for (var i = 0; i < integers.length; i++) {
        ints[i] = String.fromCharCode(integers[i]);
    }
    return ints;
}

function encrypt() {
    var plainText = document.querySelector("#plainText");
    var key = document.querySelector("#key");
    const cipher = document.querySelector("#cipherKey");
    plainText = stringToIntList(plainText.value);
    key = stringToIntList(key.value);
    var table = makeTable();
    var keyChar = 0;
    var message = new Array();
    while (message.length < plainText.length) {
        for (var i = 0; i < plainText.length; i++) {
            var row = table[0].indexOf(key[keyChar]);
            var col = table[0].indexOf(plainText[i]);
            message[message.length] = table[row][col];
            if (keyChar < key.length - 1) {
                keyChar++;
            } else {
                keyChar = 0;
            }
        }
    }
    message = intsToCharList(message).join("");
    cipher.value = message;
}

function decrypt() {
    var cipher = document.querySelector("#cipherKey");
    var key = document.querySelector("#key");
    const plainText = document.querySelector("#plainText");
    cipher = stringToIntList(cipher.value);
    key = stringToIntList(key.value);
    var table = makeTable();
    var keyChar = 0;
    var message = new Array();
    while (message.length < cipher.length) {
        for (var i = 0; i < cipher.length; i++) {
            var row = table[0].indexOf(key[keyChar]);
            var col = table[row].indexOf(cipher[i]);
            message[message.length] = table[0][col];
            if (keyChar < key.length - 1) {
                keyChar++;
            } else {
                keyChar = 0;
            }
        }
    }
    message = intsToCharList(message).join("");
    plainText.value = message;
}

function makeTable() {
    var table = new Array();
    var i = 0;
    while (i + minASCII < maxASCII) {
        var line = new Array();
        for (var j = 0; j < maxASCII - minASCII; j++) {
            if (j + i + minASCII >= maxASCII) {
                line[line.length] = (j + i) - (maxASCII - minASCII) + minASCII;
            } else {
                line[line.length] = j + i + minASCII;
            }
        }
        table[table.length] = line;
        i++;
    }
    return table;
}

function printTable() {
    var t = makeTable();
    var table = document.getElementById("ascii");
    table.innerHTML = "";

    var headerRow = document.createElement("tr");
    var headerCell = document.createElement("td");
    headerRow.appendChild(headerCell);
    
    for (var i = 65; i <= 90; i++) {
        var cell = document.createElement("td");
        cell.textContent = String.fromCharCode(i);
        headerRow.appendChild(cell);
    }

    table.appendChild(headerRow);

    for (var i = 0; i < t.length; i++) {
        var row = document.createElement("tr");
        var firstCell = document.createElement("td");
        firstCell.textContent = String.fromCharCode(i + 65);
        row.appendChild(firstCell);

        for (var j = 0; j < t[i].length; j++) {
            var cell = document.createElement("td");
            cell.textContent = String.fromCharCode(t[i][j]);
            row.appendChild(cell);
        }

        table.appendChild(row);
    }
}
function highlightTableCharacters(plainChar, keyChar, ) {
	clearTableHighlights();
	var table = document.getElementById("ascii");
	var rows = table.getElementsByTagName("tr");
  
	for (var i = 1; i < rows.length; i++) {
	  var cells = rows[i].getElementsByTagName("td");
  
	  for (var j = 1; j < cells.length; j++) {
		var cell = cells[j];
		cell.classList.remove("highlight", "highlight-row", "highlight-column");

		
  
		if (cell.textContent === encryptChar(plainChar, keyChar) && rows[i].firstElementChild.textContent === keyChar ) {
		  cell.classList.add("highlight");
		  rows[i].classList.add("highlight-row");
		  for (var i = 0; i < rows.length; i++) {
			table.rows[i].cells[cell.cellIndex].classList.add("highlight-column");
		  }
		}

	  }
	}
  }
  
 function clearTableHighlights() {
  var table = document.getElementById("ascii");
  var rows = table.getElementsByTagName("tr");

  for (var i = 0; i < rows.length; i++) {
    var cells = rows[i].getElementsByTagName("td");

    for (var j = 0; j < cells.length; j++) {
      var cell = cells[j];
      cell.classList.remove("highlight", "highlight-column");
    }
    rows[i].classList.remove("highlight-row");
  }
}

function decryptNextCharacter() {
    if (currentIndex < cipherKey.length) {
        var encryptedChar = cipherKey[currentIndex];
        var keyChar = key[currentIndex % key.length];
        var decryptedChar = decryptChar(encryptedChar, keyChar);

        plainText.value += decryptedChar;

        var plainTextDisplay = document.querySelector("#plainTextDisplay");
        var keyDisplay = document.querySelector("#keyDisplay");
        var encryptedTextDisplay = document.querySelector("#encryptedTextDisplay");

        plainTextDisplay.innerHTML += "<div class='box'>" + decryptedChar + "</div>";
        keyDisplay.innerHTML += "<div class='box'>" + keyChar + "</div>";
        encryptedTextDisplay.innerHTML += "<div class='box'>" + encryptedChar + "</div>";

        currentIndex++;

        highlightTableCharacters(decryptedChar, keyChar);
    }
}

function decryptChar(encryptedChar, keyChar) {
    var encryptedCharCode = encryptedChar.charCodeAt(0) - 65; // Convert to 0-25 range
    var keyCharCode = keyChar.charCodeAt(0) - 65; // Convert to 0-25 range
    var decryptedCharCode = (encryptedCharCode - keyCharCode + 26) % 26 + 65; // Convert back to ASCII range
    return String.fromCharCode(decryptedCharCode);
}



// Add the following code inside the encrypt() function, after the encryptNextCharacter() function call


  
