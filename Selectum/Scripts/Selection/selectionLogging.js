
function logButtonClickInputs(game, yourSelectionText, yourSelectionClass, gameRowClass)
{
    var inputs = {};

    inputs = buildJsonObject(inputs, "game", game );
    inputs = buildJsonObject(inputs, "yourSelectionText", yourSelectionText );
    inputs = buildJsonObject(inputs, "yourSelectionClass", yourSelectionClass );
    inputs = buildJsonObject(inputs, "gameRowClass", gameRowClass );
        
    myLog("Inputs: " + JSON.stringify(inputs));
}
function logButtonClickOtherVars(placedBets, availablePoints, spentPoints, requiredMinSpentPoints, maxPossibleBet)
{
    var otherVars = {};

    otherVars = buildJsonObject(otherVars, "placedBets", placedBets );
    otherVars = buildJsonObject(otherVars, "availablePoints", availablePoints );
    otherVars = buildJsonObject(otherVars, "spentPoints", spentPoints );
    otherVars = buildJsonObject(otherVars, "requiredMinSpentPoints", requiredMinSpentPoints );
    otherVars = buildJsonObject(otherVars, "maxPossibleBet", maxPossibleBet );

    myLog(JSON.stringify(otherVars));
}
function logUpdateRowBasedOnBetChange(game, placedBet, rowHasBet, yourBet, maxBet, requiredMinSpentPoints, availablePoints, spentPoints)
{
    var inputs = {};

    inputs = buildJsonObject(inputs, "game", game );
    inputs = buildJsonObject(inputs, "placedBet", placedBet );
    inputs = buildJsonObject(inputs, "rowHasBet", rowHasBet );
    inputs = buildJsonObject(inputs, "yourBet", yourBet );
    inputs = buildJsonObject(inputs, "maxBet", maxBet );
    inputs = buildJsonObject(inputs, "requiredMinSpentPoints", requiredMinSpentPoints );
    inputs = buildJsonObject(inputs, "availablePoints", availablePoints );
    inputs = buildJsonObject(inputs, "spentPoints", spentPoints );
        
    myLog("Inputs: " + JSON.stringify(inputs));
}
function logUpdateYourBetInputs(index)
{
    var inputs = {};
      
    inputs = buildJsonObject(inputs, "index", index );
        
    myLog("Inputs: " + JSON.stringify(inputs));
}
function logUpdateYourBetOtherVars(possibleBets, placedBets, availablePoints, spentPoints, requiredMinSpentPoints, maxPossibleBet, yourBet)
{
    var otherVars = {};
      
    otherVars = buildJsonObject(otherVars, "possibleBets", possibleBets );
    otherVars = buildJsonObject(otherVars, "placedBets", placedBets );
    otherVars = buildJsonObject(otherVars, "availablePoints", availablePoints );
    otherVars = buildJsonObject(otherVars, "spentPoints", spentPoints );
    otherVars = buildJsonObject(otherVars, "requiredMinSpentPoints", requiredMinSpentPoints );
    otherVars = buildJsonObject(otherVars, "maxPossibleBet", maxPossibleBet );
    otherVars = buildJsonObject(otherVars, "yourBet", yourBet );
        
    myLog(JSON.stringify(otherVars));
}
function logUpdateYourBetOtherVars2(maxPossibleMaxBet, maxBet)
{
    var otherVars2 = {};
          
    otherVars2 = buildJsonObject(otherVars2, "maxPossibleMaxBet", maxPossibleMaxBet );  
    otherVars2 = buildJsonObject(otherVars2, "maxBet", maxBet ); 
       
    myLog(JSON.stringify(otherVars2));
}
function logDetermineMaxPossibleMaxBetInputs(availablePoints, requiredMinSpentPoints, spentPoints, maxPossibleBet)
{
    var inputs = {};

    inputs = buildJsonObject(inputs, "availablePoints", availablePoints ); 
    inputs = buildJsonObject(inputs, "requiredMinSpentPoints", requiredMinSpentPoints ); 
    inputs = buildJsonObject(inputs, "spentPoints", spentPoints ); 
    inputs = buildJsonObject(inputs, "maxPossibleBet", maxPossibleBet );  
      
    myLog(JSON.stringify(inputs));
}
function logDetermineMaxBetInputs(yourBet, availablePoints, requiredMinSpentPoints, spentPoints, maxPossibleBet)
{
    var inputs = {};

    inputs = buildJsonObject(inputs, "yourBet", yourBet );
    inputs = buildJsonObject(inputs, "availablePoints", availablePoints ); 
    inputs = buildJsonObject(inputs, "requiredMinSpentPoints", requiredMinSpentPoints ); 
    inputs = buildJsonObject(inputs, "spentPoints", spentPoints ); 
    inputs = buildJsonObject(inputs, "maxPossibleBet", maxPossibleBet );  
      
    myLog(JSON.stringify(inputs));
}


function myLog(msg) {
    // attempt to send a message to the console
    try {
        console.log(msg);
    }
    // fail gracefully if it does not exist
    catch (e) { }
}

function buildJsonObject(jsonObject, propertyName, propertyValue) {
    jsonObject[propertyName] = propertyValue;
    return jsonObject;
}