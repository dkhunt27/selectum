function calculateMaxBetForThisGame(games, maxBetForAnyGameThisWeek) {
    if (games.yourBetValue === 0)
    {// if there is no bet, then the max bet has to be 0
        games.maxGameBet = 0;
    }
    else if (games.yourBetValue > maxBetForAnyGameThisWeek)
    {// if any game is already higher than the max bet, then those spent points were already factored in to that max bet as spent already...so set the max game bet to the current bet
        games.maxGameBet = games.yourBetValue;
    }
    else
    {// otherwise set to max bet of this week
        games.maxGameBet = maxBetForAnyGameThisWeek;
    }
}

function calculateMaxPossibleBetForAnyGameThisWeek(totals, config) {

    if (totals.availablePoints <= config.minSpentPointsForAnyOneWeek)
    {// if you haven't spent the required minumum points, then there will not be any extra points to spend, set max possible bet for this game to 1
        maxBetForAnyGameThisWeek = 1;
    }
    else if (totals.availablePoints - totals.spentPoints >= config.maxBetForAnyOneGame)
    {// if you have more points to spend on a bet (total points - spent points) than what is allowed on any one game, then set max possible bet for any game to game max bet master setting
        maxBetForAnyGameThisWeek = config.maxBetForAnyOneGame;
    }
    else
    {// else the max possible bet is set to the remaining points to spend
        maxBetForAnyGameThisWeek = totals.availablePoints - totals.spentPoints + 1;
    }

    return maxBetForAnyGameThisWeek;
}

function calculateGameValuesOnBtnClick(games, gameRowClass, yourBetText, yourBetClass) {

    if (yourBetText != "No Bet")
    {  // if adding a bet 

        // set row has a bet
        games.hasBet = 1;

        // set your bet to 1
        games.yourBetValue = 1;

        // set the min bet to 1
        games.minGameBet = 1;

        // set max game bet to 1 (this will be recalculated for all rows next)
        games.maxGameBet = 1;
    }
    else if (yourBetText === "No Bet")
    {  // if removing a bet  

        // set row doesnt have a bet
        games.hasBet = 0;

        // set your bet to 0
        games.yourBetValue = 0;

        // set min bet to 0
        games.minGameBet = 0;

        // set max bet to 0
        games.maxGameBet = 0;
    }
    
    // set the items based on the button click
    games.gameRowClass = gameRowClass;
    games.yourBetText = yourBetText;
    games.yourBetClass = yourBetClass;
}

function calculateAndSetAllTheMaxBets(totals, week, config) {

    games = new gameValues();
    
    for (i=0; i < week.possibleBets; i++)
    {
        games.getValuesFromHtml(i);

        maxPossibleBetForAnyGameThisWeek = calculateMaxPossibleBetForAnyGameThisWeek(totals, config);
        calculateMaxBetForThisGame(games, maxPossibleBetForAnyGameThisWeek);

        games.setMaxGameBet(i);
    }
}