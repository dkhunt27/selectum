function radioOnClick(id, gameNum, bet) {
    myLog("radioOnClick");
    myLog(id);
    myLog(gameNum);
    myLog(bet);

    config = new configValues();
    week = new weekValues();
    week.getValuesFromHtml();
    game = new gameValues();
    game.getValuesFromHtml(gameNum);

    // first set your bet value
    game.yourBetValue = bet;
    game.setValuesInHtml(gameNum);

    //build all the games into a list...this is to abstract the data from the display to ease testing
    gameList = buildGameList(week);

    // recalculate and set the total values based on the output of the button click
    totals.calculateTotalValues(gameList, config);
    totals.setValuesInHtml();

    // now based on the new totals, loop through all the games and set their max bets
    calculateAndSetAllTheMaxBets(totals, week, config);
}

function btnOnClick(rowId, yourSelectionText, yourSelectionClass, gameRowClass) {

    config = new configValues();
    week = new weekValues();
    week.getValuesFromHtml();
    games = new gameValues();
    games.getValuesFromHtml(rowId);
    totals = new totalValues();
    totals.getValuesFromHtml();
    gameList = [];

    // calculate and set this games values based on the button click
    calculateGameValuesOnBtnClick(games, gameRowClass, yourSelectionText, yourSelectionClass);
    games.setValuesInHtml(gameNum);

    //build all the games into a list...this is to abstract the data from the display to ease testing
    gameList = buildGameList(week);

    //console.log(gameList.length);
    //console.log(gameList[0]);
    // recalculate and set the total values based on the output of the button click
    totals.calculateTotalValues(gameList, config);
    totals.setValuesInHtml();

    // now based on the new totals, loop through all the games and set their max bets
    calculateAndSetAllTheMaxBets(totals, week, config);
}
