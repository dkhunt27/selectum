function getPossibleBets() {
    return parseInt(document.getElementById("possibleBets").innerHTML);
}
// no need for set

function getPlacedBets() {
    return parseInt(document.getElementById("placedBets").innerHTML);
}
function setPlacedBets(value) {
    document.getElementById("placedBets").innerHTML = value;
}
function getAvailablePoints() {
    return parseInt(document.getElementById("availablePoints").innerHTML);
}
function setAvailablePoints(value) {
    document.getElementById("availablePoints").innerHTML = value;
}
function getSpentPoints() {
    return parseInt(document.getElementById("spentPoints").innerHTML);
}
function setSpentPoints(value) {
    document.getElementById("spentPoints").innerHTML = value;
}
function getRequiredMinSpentPoints() {
    return parseInt(document.getElementById("requiredMinSpentPoints").value);
}
// no need for set

function getMaxPossibleBet() {
    return parseInt(document.getElementById("maxPossibleBet").value);
}
// no need for set



function getGameRowClassName(rowId) {
    return document.getElementById("gameRow" + rowId).className;
}
function setGameRowClassName(rowId, className) {
    document.getElementById("gameRow" + rowId).className = className;
}

function getYourBetText(rowId, value) {
    return document.getElementById("yourSelection" + rowId).innerHTML;
} 
function setYourBetText(rowId, value) {
    document.getElementById("yourSelection" + rowId).innerHTML = value;
}

function getYourBetClassName(rowId, className) {
    return document.getElementById("yourSelection" + rowId).className;
}
function setYourBetClassName(rowId, className) {
    document.getElementById("yourSelection" + rowId).className = className;
}

function getRowHasBet(rowId) {
    return parseInt(document.getElementById("rowHasBet" + rowId).value);
}
function setRowHasBet(rowId, value) {
    document.getElementById("rowHasBet" + rowId).value = value;
}

function getYourBetMaxBet(rowId) {
    return parseInt(document.getElementById("yourBetMaxBet" + rowId).value);
}
function setYourBetMaxBet(rowId, value) {
    document.getElementById("yourBetMaxBet" + rowId).value = value;
}

function getYourBetMinBet(rowId) {
    return parseInt(document.getElementById("yourBetMinBet" + rowId).value);
}
function setYourBetMinBet(rowId, value) {
    document.getElementById("yourBetMinBet" + rowId).value = value;
}

function getYourBetValue(rowId) {
    return parseInt(document.getElementById("yourBetValue" + rowId).value);
}
function setYourBetValue(rowId, value) {
    document.getElementById("yourBetValue" + rowId).value = value;

    // whenever we set the bet value, we also need to set the radio selection value
}

function getYourBetRadio(rowId) {
    return parseInt(document.getElementById("yourBetRadio" + rowId).value);
}
function setYourBetRadio(rowId, yourBet, maxBet) {
    if (yourBet > 0)
    {
        document.getElementById("radioYourBetG" + rowId + "B" + yourBet).checked = true;
    }
    else
    {
        for (x = 1; x <= 5; ++x) {
            document.getElementById("radioYourBetG" + rowId + "B" + x).checked = false;
        }
    }

    setYourBetRadioMaxBet(rowId, maxBet);
}

function setYourBetRadioMaxBet(rowId, maxBet) {
    for (x=1; x<=5; ++x)
    {
        if (x <= maxBet)
        {
            document.getElementById("radioYourBetG" + rowId + "B" + x).disabled = false;
        }
        else
        {
            document.getElementById("radioYourBetG" + rowId + "B" + x).disabled = true;
        }
    }
}

