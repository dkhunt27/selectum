function configValues() {

    this.maxBetForAnyOneGame = 5;
    this.minSpentPointsForAnyOneWeek = 2;
    this.pointsPerBetUnderMinSpentPoints = 1;
    this.pointsPerBetAfterMinSpentPoints = 2;
}

function weekValues() {

    this.possibleBets = 0;
}

weekValues.prototype.getValuesFromHtml = function() {
    
    this.possibleBets = getPossibleBets();
}

function totalValues() {

    this.placedBets = 0;
    this.availablePoints = 0;
    this.spentPoints = 0;
}

totalValues.prototype.getValuesFromHtml = function() {
    
    this.placedBets = getPlacedBets();
    this.availablePoints = getAvailablePoints();
    this.spentPoints = getSpentPoints();
}

totalValues.prototype.setValuesInHtml = function() {
    
    setPlacedBets(this.placedBets);
    setAvailablePoints(this.availablePoints);
    setSpentPoints(this.spentPoints);
}

totalValues.prototype.calculateTotalValues = function (gameList, config) {
    //console.log("calculateTotalValues");

    this.placedBets = 0;
    this.availablePoints = 0;
    this.spentPoints = 0;

    for (i = 0; i < gameList.length; i++) {
        //console.log(gameList[i]);
        this.spentPoints = this.spentPoints + gameList[i].yourBetValue;
        this.placedBets = this.placedBets + gameList[i].hasBet;

        // add additional points to total points...only if over the min required pts since total points is originally set at min spent points
        if (gameList[i].hasBet === 1) {
            if (this.placedBets > config.minSpentPointsForAnyOneWeek) {
                this.availablePoints = this.availablePoints + config.pointsPerBetAfterMinSpentPoints;
            }
            else {
                this.availablePoints = config.minSpentPointsForAnyOneWeek;
            }
        }
        else
        {
            if (this.placedBets <= config.minSpentPointsForAnyOneWeek) {
                this.availablePoints = config.minSpentPointsForAnyOneWeek;
            }
        }

        //console.log(this);
    }
}

function buildGameList(week) {
    gameList = [];

    for (i=0; i<week.possibleBets; i++)
    {
        game = new gameValues();
        game.getValuesFromHtml(i);
        //console.log(game.gameRowClass);
        gameList.push(game);
    }

    //console.log(gameList[0]);
    //console.log(gameList[0].gameRowClass);
    return gameList;
}

function gameValues() {
    this.hasBet = 0;
    this.yourBetValue = 0;
    this.minGameBet = 0;
    this.maxGameBet = 0;
    this.gameRowClass = "alert";
    this.yourBetText = "No Bet";
    this.yourBetClass = "label label-warning";
}

gameValues.prototype.getValuesFromHtml = function (rowId) {
    
    this.hasBet = getRowHasBet(rowId);
    this.yourBetValue = getYourBetValue(rowId);
    this.minGameBet = getYourBetMinBet(rowId);
    this.maxGameBet = getYourBetMaxBet(rowId);
    this.gameRowClass = getGameRowClassName(rowId);
    this.yourBetText = getYourBetText(rowId);
    this.yourBetClass = getYourBetClassName(rowId);

}

gameValues.prototype.setValuesInHtml = function (rowId) {
    //console.log("setValuesInHtml");
    //console.log(this.gameRowClass);
    setRowHasBet(rowId, this.hasBet);

    // hidden values...mostly for debugging purposes
    setYourBetValue(rowId, this.yourBetValue);
    setYourBetMinBet(rowId, this.minGameBet);
    setYourBetMaxBet(rowId, this.maxGameBet);

    setGameRowClassName(rowId, this.gameRowClass);
    setYourBetText(rowId, this.yourBetText);
    setYourBetClassName(rowId, this.yourBetClass);

    setYourBetRadio(rowId, this.yourBetValue, this.maxGameBet);
}

gameValues.prototype.setMaxGameBet = function (rowId) {

    setYourBetRadioMaxBet(rowId, this.maxGameBet);

    // hidden values...mostly for debugging purposes
    setYourBetMaxBet(rowId, this.maxGameBet);
}