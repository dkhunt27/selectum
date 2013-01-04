var selectionViewModel = function (data) {
    var self = this;

    if (typeof data === "undefined") throw new Error("data passed to selectionViewModel is undefined");
    if (data === null) throw new Error("data passed to selectionViewModel is null");

    self.debugLevel = 0;    

    if (self.debugLevel > 0) log.info(data);



    // validation, make sure the vm is initialized correctly
    /*if (isNaN(data.maxBetForAnyOneGame)) throw Error("data.maxBetForAnyOneGame cannot be NaN");
    if (isNaN(data.minSpentPointsForAnyOneWeek)) throw Error("data.minSpentPointsForAnyOneWeek cannot be NaN");
    if (isNaN(data.extraPointFactorPerBetOverMin)) throw Error("data.extraPointFactorPerBetOverMin cannot be NaN");
    if (isNaN(data.possibleBets)) throw Error("data.possibleBets cannot be NaN");
    if (isNaN(data.placedBets)) throw Error("data.placedBets cannot be NaN");
    if (isNaN(data.bonusPoints)) throw Error("data.bonusPoints cannot be NaN");
    if (isNaN(data.spentPoints)) throw Error("data.spentPoints cannot be NaN");
    if (isNaN(data.gameRowsHaveBeenSaved)) throw Error("data.gameRowsHaveBeenSaved cannot be NaN");
    if (isNaN(data.selectionDisabledForThisGameFilter)) throw Error("data.selectionDisabledForThisGameFilter cannot be NaN");*/

    self.toggleBetClass = "btn-info";
    self.toggleNoBetClass = "btn-warning";
    self.toggleFavoriteClass = "btn-success";
    self.toggleUnderdogClass = "btn-danger";
    self.toggleNoBetRowClass = "warning";
    self.toggleFavoriteRowClass = "success";
    self.toggleUnderdogRowClass = "error";

    //alert(ko.toJSON(data.userGameSelection));
    self.MAXBETFORANYONEGAME = data.maxBetForAnyOneGame;    // this is a const, should not change
    self.MINSPENTPOINTSFORANYONEWEEK = data.minSpentPointsForAnyOneWeek;  // this is a const
    self.EXTRAPOINTFACTORPERBETOVERMIN = data.extraPointFactorPerBetOverMin;  // this is a const
    self.maxPossibleAdditionalBetForAnyGameThisWeek = ko.observable(0);  // this is calculated in calculateMaxPossibleAdditionalBetForAnyGameThisWeek
    self.possibleBets = ko.observable(data.possibleBets);
    self.placedBets = ko.observable(data.placedBets);
    self.bonusPoints = ko.observable(data.bonusPoints);
    self.spentPoints = ko.observable(data.spentPoints);
    self.gameRows = new selectionGameRowsViewModel(data.gameRows);
    self.gameRowsHaveBeenSaved = data.gameRowsHaveBeenSaved;
    self.selectionDisabledForThisGameFilter = data.selectionDisabledForThisGameFilter;
    self.selectionDisabled = false; //TODO, make KO computed

    // validation, make sure the vm is initialized correctly
    /*if (isNaN(self.MAXBETFORANYONEGAME)) throw Error("self.MAXBETFORANYONEGAME cannot be NaN");
    if (isNaN(self.MINSPENTPOINTSFORANYONEWEEK)) throw Error("self.MINSPENTPOINTSFORANYONEWEEK cannot be NaN");
    if (isNaN(self.EXTRAPOINTFACTORPERBETOVERMIN)) throw Error("self.EXTRAPOINTFACTORPERBETOVERMIN cannot be NaN");
    if (isNaN(self.maxPossibleAdditionalBetForAnyGameThisWeek())) throw Error("self.maxPossibleAdditionalBetForAnyGameThisWeek() cannot be NaN");
    if (isNaN(self.possibleBets())) throw Error("self.possibleBets() cannot be NaN");
    if (isNaN(self.placedBets())) throw Error("self.placedBets() cannot be NaN");
    if (isNaN(self.bonusPoints())) throw Error("self.bonusPoints() cannot be NaN");
    if (isNaN(self.spentPoints())) throw Error("self.spentPoints() cannot be NaN");*/

    self.test = function (id, viewModel) {
        self.betPickersActive(!self.betPickersActive());
        self.betPickersDisabled(!self.betPickersDisabled());
        self.betPickersToggled(!self.betPickersToggled());

        log.trace(self.betPickersActive());
        log.trace(self.betPickersDisabled());
        log.trace(self.betPickersToggled());
    };

    self.userMadeSelection = function (selection, selectionClass, rowClass, viewModel, gameRow, event) {
        if (self.debugLevel > 0) log.info("userMadeSelection");
        self.assertNotUndefinedOrNull(selection, "userMadeSelection", "selection");
        self.assertNotUndefinedOrNull(selectionClass, "userMadeSelection", "selectionClass");
        self.assertNotUndefinedOrNull(rowClass, "userMadeSelection", "rowClass");
        self.assertNotUndefinedOrNull(viewModel, "userMadeSelection", "viewModel");
        self.assertNotUndefinedOrNull(gameRow, "userMadeSelection", "gameRow");
        self.assertNotUndefinedOrNull(event, "userMadeSelection", "event");

        var userGameSelection = gameRow.userGameSelection;
        var selectionDisabled = viewModel.gameRowsHaveBeenSaved || viewModel.selectionDisabledForThisGameFilter || userGameSelection.saved;

        var toggleBetClass = "btn-info";
        var toggleNoBetClass = "btn-warning";
        var toggleFavoriteClass = "btn-success";
        var toggleUnderdogClass = "btn-danger";
        var toggleNoBetRowClass = "warning";
        var toggleFavoriteRowClass = "success";
        var toggleUnderdogRowClass = "error";

        if (selection === "favorite") {
            userGameSelection.pickTeamId = userGameSelection.gameSpread.favoriteTeamId;
            userGameSelection.pickTeam = userGameSelection.gameSpread.favoriteTeam;
            this.updateDomYourSelectionPicker(userGameSelection, event.target, toggleFavoriteClass, toggleNoBetClass, toggleUnderdogClass, toggleFavoriteRowClass, toggleUnderdogRowClass, toggleNoBetRowClass);
            //if (userGameSelection.bet === 0) {
                // first time picking a team, initialize the bet
                this.initializeBet(gameRow.userGameSelection, gameRow.betPickers, selectionDisabled);
                this.initializeAllOtherVariables(gameRow, viewModel, selectionDisabled);
            //}
        }
        else if (selection === "underdog") {
            userGameSelection.pickTeamId = userGameSelection.gameSpread.underdogTeamId;
            userGameSelection.pickTeam = userGameSelection.gameSpread.underdogTeam;
            this.updateDomYourSelectionPicker(userGameSelection, event.target, toggleUnderdogClass, toggleNoBetClass, toggleFavoriteClass, toggleUnderdogRowClass, toggleFavoriteRowClass, toggleNoBetRowClass);
            //if (userGameSelection.bet === 0) {
                // first time picking a team, initialize the bet
                this.initializeBet(gameRow.userGameSelection, gameRow.betPickers, selectionDisabled); 
                this.initializeAllOtherVariables(gameRow, viewModel, selectionDisabled);
            //}
        }
        else {

            // TODO fix the hardcoded nobet team
            userGameSelection.pickTeamId = 1;
            userGameSelection.pickTeam = { teamId: 1, teamShortName: "X  ", teamLongName: "No Bet" };
            this.updateDomYourSelectionPicker(userGameSelection, event.target, toggleNoBetClass, toggleFavoriteClass, toggleUnderdogClass, toggleNoBetRowClass, toggleFavoriteRowClass, toggleUnderdogRowClass);
            this.removeBet(gameRow); // remove bet if selected no bet
            this.resetAllOtherBetsToOne(viewModel.gameRows.gameRows, toggleBetClass, selectionDisabled);  // since remove one bet can affect bonus points and thus spent points, just reset any bets to 1
            this.initializeAllOtherVariables(gameRow, viewModel, selectionDisabled);
        }
    };

    self.userMadeBet = function (bet, viewModel, gameRow, event) {
        if (self.debugLevel > 0) log.info("userMadeBet");
        self.assertNotUndefinedOrNull(bet, "userMadeBet", "bet");
        self.assertNotUndefinedOrNull(viewModel, "userMadeBet", "viewModel");
        self.assertNotUndefinedOrNull(gameRow, "userMadeBet", "gameRow");
        self.assertNotUndefinedOrNull(event, "userMadeBet", "event");


        var toggleBetClass = "btn-info";

        this.changeBet(gameRow.userGameSelection, gameRow.betPickers, bet, viewModel.selectionDisabledForThisGameFilter || gameRow.userGameSelection.saved);
        this.calculateAllOtherVariables(viewModel);
    };

    /**
    */
    self.initializeBet = function (userGameSelection, betPickers, selectionDisabled) {
        if (self.debugLevel > 0) log.info("initializeBet");
        self.assertNotUndefinedOrNull(userGameSelection, "initializeBet", "userGameSelection");
        self.assertNotUndefinedOrNull(betPickers, "initializeBet", "betPickers");
        self.assertNotUndefinedOrNull(selectionDisabled, "initializeBet", "selectionDisabled");

        // set the bet to 1 and enable it
        userGameSelection.bet = 1;
        self.enableBetPicker(betPickers[userGameSelection.bet - 1], userGameSelection.bet, selectionDisabled);
    };

    /**
    */
    self.removeBet = function (gameRow) {
        if (self.debugLevel > 0) log.info("removeBet");
        self.assertNotUndefinedOrNull(gameRow, "removeBet", "gameRow");

        // disable the picker itself
        self.disableAllBetPickers(gameRow.betPickers, gameRow.userGameSelection.gameSpread.game.gameId);

        // set the bet to 0
        gameRow.userGameSelection.bet = 0;
    };

    /**
    */
    self.changeBet = function (userGameSelection, betPickers, newBet, selectionDisabled) {
        if (self.debugLevel > 0) log.info("changeBet");
        self.assertNotUndefinedOrNull(userGameSelection, "changeBet", "userGameSelection");
        self.assertNotUndefinedOrNull(betPickers, "changeBet", "betPickers");
        self.assertNotUndefinedOrNull(newBet, "changeBet", "newBet");
        self.assertNotUndefinedOrNull(selectionDisabled, "changeBet", "selectionDisabled");

        userGameSelection.bet = newBet;

        self.enableAllBetPickers(betPickers, userGameSelection.bet, selectionDisabled);
    };

    self.initializeAllOtherVariables = function (gameRow, viewModel, selectionDisabled) {
        if (self.debugLevel > 0) log.info("initializeAllOtherVariables");
        self.assertNotUndefinedOrNull(gameRow, "initializeAllOtherVariables", "gameRow");
        self.assertNotUndefinedOrNull(viewModel, "initializeAllOtherVariables", "viewModel");
        self.assertNotUndefinedOrNull(selectionDisabled, "initializeAllOtherVariables", "selectionDisabled");

        self.initializeMinMaxBet(gameRow.userGameSelection);
        //self.initializeBetPicker(gameRow.userGameSelection.bet, gameRow.betPickers, selectionDisabled);
        self.calculateAllOtherVariables(viewModel);
    };

    /**
    */
    self.calculateAllOtherVariables = function (viewModel) {
        if (self.debugLevel > 0) log.info("calculateAllOtherVariables");
        self.assertNotUndefinedOrNull(viewModel, "calculateAllOtherVariables", "viewModel");

        self.calculateTotalValues(viewModel.gameRows.gameRows, viewModel.MINSPENTPOINTSFORANYONEWEEK, viewModel.EXTRAPOINTFACTORPERBETOVERMIN);
        self.calculateMaxPossibleAdditionalBetForAnyGameThisWeek(viewModel.bonusPoints(), viewModel.MAXBETFORANYONEGAME);
        self.calculateMaxPossibleBetForEachGame(viewModel.gameRows.gameRows, viewModel.maxPossibleAdditionalBetForAnyGameThisWeek(), viewModel.MAXBETFORANYONEGAME);

        for (var i = 0; i < viewModel.gameRows.gameRows.length; i++) {
            var gameRow = viewModel.gameRows.gameRows[i];
            var ugs = gameRow.userGameSelection;
            var betPickers = gameRow.betPickers;
            var selectionDisabled = viewModel.selectionDisabledForThisGameFilter || ugs.saved;
            
            // first just disable all bet pickers just in case
            self.disableAllBetPickers(betPickers, gameRow.userGameSelection.gameSpread.game.gameId);

            if (ugs.bet > 0) {

                // loop through the bet pickers enabling them all up to the max game bet for that game row
                for (var x = 0; x < ugs.maxGameBet; x++) {
                    self.enableBetPicker(betPickers[x], ugs.bet, selectionDisabled);
                }
            }
        }
    };

    /**
    */
    self.initializeBetPicker = function (bet, betPickers, selectionDisabled) {
        if (self.debugLevel > 0) log.info("initializeBetPicker");
        self.assertNotUndefinedOrNull(bet, "initializeBetPicker", "bet");
        self.assertNotUndefinedOrNull(betPickers, "initializeBetPicker", "betPickers");
        self.assertNotUndefinedOrNull(selectionDisabled, "initializeBetPicker", "selectionDisabled");

        // verify the state of the data
        if (bet != 1) throw new Error("initializeBetPicker must have a bet = 1; bet:" + bet);

        for (var i = 0; i < betPickers.length; i++) {
            if (betPickers[i].toggled() === true) throw new Error("initializeBetPicker cannot have a betPicker with toggled = true; betPickerIndex:" + i);
            if (betPickers[i].disabled() === false) throw new Error("initializeBetPicker cannot have a betPicker with disabled = false; betPickerIndex:" + i);
        }

        self.enableBetPicker(betPickers[bet - 1], bet, selectionDisabled);
    };

    /**
    */
    self.resetAllOtherBetsToOne = function (gameRows, toggleBetClass, selectionDisabledForThisGameFilter) {
        if (self.debugLevel > 0) log.info("resetAllOtherBetsToOne");
        self.assertNotUndefinedOrNull(gameRows, "resetAllOtherBetsToOne", "gameRows");
        self.assertNotUndefinedOrNull(toggleBetClass, "resetAllOtherBetsToOne", "toggleBetClass");
        self.assertNotUndefinedOrNull(selectionDisabledForThisGameFilter, "resetAllOtherBetsToOne", "selectionDisabledForThisGameFilter");

        for (var i = 0; i < gameRows.length; i++) {
            var gameRow = gameRows[i];
            var ugs = gameRow.userGameSelection;
            var betPickers = gameRow.betPickers;

            var selectionDisabled = selectionDisabledForThisGameFilter || ugs.saved;

            // first just disable all bet pickers
            self.disableAllBetPickers(betPickers, gameRow.userGameSelection.gameSpread.game.gameId);

            // then set any game row that had a bet back to 1
            if (ugs.bet > 0) {
                ugs.bet = 1;
                self.enableBetPicker(betPickers[ugs.bet - 1], ugs.bet, selectionDisabled);
            }
        }
    };

    /**
     * initializeMinMaxBet initializes the min/max bet to either 0 if there is no bet or 1 if there is a bet 
     * @param userGameSelection    The user game selection and its bet
     * @output  sets the following:
     *              userGameSelection.minGameBet;
     *              userGameSelection.maxGameBet;
     */
    self.initializeMinMaxBet = function (userGameSelection) {
        if (self.debugLevel > 0) log.info("initializeMinMaxBet");
        self.assertNotUndefinedOrNull(userGameSelection, "initializeMinMaxBet", "userGameSelection");

        if (userGameSelection.bet === 0) {
            userGameSelection.minGameBet = 0;
            userGameSelection.maxGameBet = 0;
        }
        else {
            userGameSelection.minGameBet = 1;
            userGameSelection.maxGameBet = 1;
        }
    };

    /**
     * calculateTotalValues will calculate the total values (spentPoints, placeBets, bonusPoints, totalPoints) based on the bets places.  
     * @param gameRows    List of game row selections and their bets
     * @param MINSPENTPOINTSFORANYONEWEEK  The minimum points needed to be spent for a week (CONSTANT)
     * @param EXTRAPOINTFACTORPERBETOVERMIN  The extra point factor added to bonusPoints when spent over the minimum (CONSTANT)
     * @output  sets the following:
     *              self.placedBets;
     *              self.spentPoints;
     *              self.bonusPoints;
     */
    self.calculateTotalValues = function (gameRows, MINSPENTPOINTSFORANYONEWEEK, EXTRAPOINTFACTORPERBETOVERMIN) {
        if (self.debugLevel > 0) log.info("calculateTotalValues");
        self.assertNotUndefinedOrNull(gameRows, "calculateTotalValues", "gameRows");
        self.assertNotUndefinedOrNull(MINSPENTPOINTSFORANYONEWEEK, "calculateTotalValues", "MINSPENTPOINTSFORANYONEWEEK");
        self.assertNotUndefinedOrNull(EXTRAPOINTFACTORPERBETOVERMIN, "calculateTotalValues", "EXTRAPOINTFACTORPERBETOVERMIN");

        var spentPointsLocal = 0;
        var placedBetsLocal = 0;
        var bonusPointsLocal = 0;
        var totalPointsLocal = 0;

        for (var i = 0; i < gameRows.length; i++) {

            var ugs = gameRows[i].userGameSelection;
            var betLocal = ugs.bet;

            spentPointsLocal = spentPointsLocal + betLocal;
            if (betLocal > 0) {
                placedBetsLocal = placedBetsLocal + 1;
            }
        }

        // there must be more bets than the min required to consider giving bonus points
        if (spentPointsLocal > MINSPENTPOINTSFORANYONEWEEK) {
            // if there are the minumum bets already, then add bonus points
            totalPointsLocal = placedBetsLocal + (placedBetsLocal - MINSPENTPOINTSFORANYONEWEEK) * EXTRAPOINTFACTORPERBETOVERMIN;
        } else {
            // otherwise bonus points still equal 0
            totalPointsLocal = placedBetsLocal;
        }

        bonusPointsLocal = totalPointsLocal - spentPointsLocal;

        self.placedBets(placedBetsLocal);
        self.spentPoints(spentPointsLocal);
        self.bonusPoints(bonusPointsLocal);
    };

    /**
     * calculateMaxPossibleAdditionalBetForAnyGameThisWeek will calculate the max possible bet for any game this week based on business rules around how many 
     * bonus points there are relative to the max bet for any one game.  
     * @param bonusPoints  The number of bonus points not spent already
     * @param MAXBETFORANYONEGAME  The max bet allowed for any one game (CONSTANT)
     * @output  sets the following:
     *              self.maxPossibleAdditionalBetForAnyGameThisWeek;
     */
    self.calculateMaxPossibleAdditionalBetForAnyGameThisWeek = function (bonusPoints, MAXBETFORANYONEGAME) {
        if (self.debugLevel > 0) log.info("calculateMaxPossibleAdditionalBetForAnyGameThisWeek");
        self.assertNotUndefinedOrNull(bonusPoints, "calculateMaxPossibleAdditionalBetForAnyGameThisWeek", "bonusPoints");
        self.assertNotUndefinedOrNull(MAXBETFORANYONEGAME, "calculateMaxPossibleAdditionalBetForAnyGameThisWeek", "MAXBETFORANYONEGAME");

        var maxPossibleAdditionalBetForAnyGameThisWeekLocal = 0;

        //if (spentPointsLocal <= viewModel.MINSPENTPOINTSFORANYONEWEEK) {
        if (bonusPoints <= 0) {
            // if you haven't spent the required minumum points, 
            // then there will not be any bonus points to spend, 
            // set max possible bet for any game this week to 1
            maxPossibleAdditionalBetForAnyGameThisWeekLocal = 0;
        } else if (bonusPoints >= MAXBETFORANYONEGAME) {
            // if you have more bonus points to spend on a bet than what is allowed on any one game, 
            // then set max possible bet for any game this week to game max bet for any one game
            maxPossibleAdditionalBetForAnyGameThisWeekLocal = MAXBETFORANYONEGAME;
        /*} else if ( {
            // else the max possible bet is set to the remaining bonus points (+ 1 since there is already a bet of 1)
            maxPossibleAdditionalBetForAnyGameThisWeekLocal = bonusPoints + 1;*/
        } else {
            // else the max possible bet is set to the remaining bonus points (+ 1 since there is already a bet of 1)
                maxPossibleAdditionalBetForAnyGameThisWeekLocal = bonusPoints;
        }

        self.maxPossibleAdditionalBetForAnyGameThisWeek(maxPossibleAdditionalBetForAnyGameThisWeekLocal);
    };

    /**
     * calculateMaxPossibleBetForEachGame will calculate the max possible bet for each game based on business rules around how many 
     * points have been spent (betted) and the max possible bet for any game this week  
     * @param gameRows    List of game row selections and their bets
     * @param maxPossibleAdditionalBetForAnyGameThisWeek  The max possible additional bet (beyond any existing bet) for any game this week
     * @output  sets the following:
     *              userGameSelection.maxGameBet (for each userGameSelection)
     */
    self.calculateMaxPossibleBetForEachGame = function (gameRows, maxPossibleAdditionalBetForAnyGameThisWeek, MAXBETFORANYONEGAME) {
        if (self.debugLevel > 0) log.info("calculateMaxPossibleBetForEachGame");
        self.assertNotUndefinedOrNull(gameRows, "calculateMaxPossibleBetForEachGame", "gameRows");
        self.assertNotUndefinedOrNull(maxPossibleAdditionalBetForAnyGameThisWeek, "calculateMaxPossibleBetForEachGame", "maxPossibleAdditionalBetForAnyGameThisWeek");
        self.assertNotUndefinedOrNull(MAXBETFORANYONEGAME, "calculateMaxPossibleBetForEachGame", "MAXBETFORANYONEGAME");

        //log.trace("maxPossibleAdditionalBetForAnyGameThisWeek:" + maxPossibleAdditionalBetForAnyGameThisWeek);
        //log.trace("MAXBETFORANYONEGAME:" + MAXBETFORANYONEGAME);
        var maxGameBetLocal = 0;

        for (var i = 0; i < gameRows.length; i++) {
            var ugs = gameRows[i].userGameSelection;

            self.calculateMaxPossibleBetForOneGame(ugs, maxPossibleAdditionalBetForAnyGameThisWeek, MAXBETFORANYONEGAME);
        }
    };

    self.calculateMaxPossibleBetForOneGame = function (userGameSelection, maxPossibleAdditionalBetForAnyGameThisWeek, MAXBETFORANYONEGAME) {
        if (self.debugLevel > 0) log.info("calculateMaxPossibleBetForOneGame");
        self.assertNotUndefinedOrNull(userGameSelection, "calculateMaxPossibleBetForOneGame", "userGameSelection");
        self.assertNotUndefinedOrNull(maxPossibleAdditionalBetForAnyGameThisWeek, "calculateMaxPossibleBetForOneGame", "maxPossibleAdditionalBetForAnyGameThisWeek");
        self.assertNotUndefinedOrNull(MAXBETFORANYONEGAME, "calculateMaxPossibleBetForOneGame", "MAXBETFORANYONEGAME");
        
        var maxGameBetLocal = 0;
        var betLocal = userGameSelection.bet;

        if (betLocal === 0) {
            // if there is no bet, then the max bet has to be 0
            maxGameBetLocal = 0;
        } else if (betLocal + maxPossibleAdditionalBetForAnyGameThisWeek > MAXBETFORANYONEGAME) {
            // if the possible additional points would put the bet pass the max for any one game, then set to max for any one game
            maxGameBetLocal = MAXBETFORANYONEGAME;
        /*} else if (betLocal > maxPossibleAdditionalBetForAnyGameThisWeek) {
            // if any game is already higher than the max bet, then those spent points were already factored in to that max bet as spent already...so set the max game bet to the current bet
            maxGameBetLocal = betLocal;*/
        } else {
            // otherwise set to max additional points plus any already spent
            maxGameBetLocal = betLocal + maxPossibleAdditionalBetForAnyGameThisWeek;
        };

        userGameSelection.maxGameBet = maxGameBetLocal;
    };

    /** 
    * disableAllBetPickers will disable all bet pickers
    * @param betPickers The data that represents the betting min to max range for the particular game
    * @output   Disabled bet pickers 
    */
    self.disableAllBetPickers = function (betPickers, gameRowId) {
        if (self.debugLevel > 0) log.info("disableAllBetPickers for gameRow:" + gameRowId);
        self.assertNotUndefinedOrNull(betPickers, "disableAllBetPickers", "betPickers");

        for (var i = 0; i < betPickers.length; i++) {
            var betPicker = betPickers[i];

            self.disableBetPicker(betPicker);
        };
    };

    /** 
     * disableBetPicker will disable the bet picker
     * @param betPicker The data that represents a specific betting min to max range for the particular game
     * @output   Disabled bet picker
     */
    self.disableBetPicker = function (betPicker) {
        if (self.debugLevel > 1) log.info("disableBetPicker");
        self.assertNotUndefinedOrNull(betPicker, "disableBetPicker", "betPicker");

        betPicker.disabled(true);
        betPicker.toggled(false);
    };

    /** 
    * enableAllBetPickers will enable all bet pickers unless the selection is disabled; it will also toggle the bet picker that
    * matches the current bet
    * @param betPickers The data that represents the betting min to max range for the particular game
    * @param bet    The current bet to toggle
    * @param selectionDisabled  A flag indicating whether all bet pickers should be disabled (when true) or enabled (when false)
    * @output   Toggles bet picker matching the bet and enables or disables the bet pickers based on selectionDisabled 
    */
    self.enableAllBetPickers = function (betPickers, bet, selectionDisabled) {
        if (self.debugLevel > 0) log.info("enableAllBetPickers");
        self.assertNotUndefinedOrNull(betPickers, "enableAllBetPickers", "betPickers");
        self.assertNotUndefinedOrNull(bet, "enableAllBetPickers", "bet");
        self.assertNotUndefinedOrNull(selectionDisabled, "enableAllBetPickers", "selectionDisabled");

        var betFound = false;

        for (var i = 0; i < betPickers.length; i++) {

            if (betPickers[i].betValue === bet) betFound = true;

            var betPicker = betPickers[i];

            if (self.debugLevel = 1) {
                // remove the additional logging since already going to enable entire week 
                self.debugLevel = 0;
                self.enableBetPicker(betPicker, bet, selectionDisabled);
                self.debugLevel = 1;
            } else {
                self.enableBetPicker(betPicker, bet, selectionDisabled);
            }
        };

        if (betFound === false) throw new Error("bet does not exist in betPickers; bet:" + bet);
    };

    /** 
    * enableBetPicker will enable the bet picker unless the selection is disabled; it will also toggle the bet picker if it
    * matches the current bet
    * @param betPicker The data that represents a specific betting min to max range for the particular game
    * @param bet    The current bet to toggle
    * @param selectionDisabled  A flag indicating whether all bet pickers should be disabled (when true) or enabled (when false)
    * @output   Toggles bet picker matching the bet and enables or disables the bet picker based on selectionDisabled 
    */
    self.enableBetPicker = function (betPicker, bet, selectionDisabled) {
        if (self.debugLevel > 0) log.info("enableBetPicker for bet:" + bet);
        self.assertNotUndefinedOrNull(betPicker, "enableBetPicker", "betPicker");
        self.assertNotUndefinedOrNull(bet, "enableBetPicker", "bet");
        self.assertNotUndefinedOrNull(selectionDisabled, "enableBetPicker", "selectionDisabled");

        // TODO move that to KO Computed 
        if (bet === betPicker.betValue) {
            // only activate/toggle it if it matches the bet value
            betPicker.toggled(true);
        } else {
            betPicker.toggled(false);
        };
        
        if (selectionDisabled) {
            // its supposed to be disabled, so disable it
            betPicker.disabled(true);
        } else {
            betPicker.disabled(false);
        }
    };

    self.updateDomYourSelectionPicker = function (userGameSelection, element, toggleEnableClass, toggleDisableClass1, toggleDisableClass2, toggleRowClass, toggleDisableRowClass1, toggleDisableRowClass2) {
        if (self.debugLevel > 0) log.info("updateDomYourSelectionPicker");

        // toggle the target element
        $(element).button('toggle');

        // add the toggle class, if it doesn't exist already
        if (!$(element).hasClass(toggleEnableClass)) {
            $(element).addClass(toggleEnableClass);
        }

        // untoggle the other button(s)...visually...if active
        var btnGroup = element.parentElement;
        var otherToggledButtons = $(btnGroup).find(".active").filter(function (index) {
            return $(this).attr("id") != $(element).attr("id");
        });
        for (var i = 0; i < otherToggledButtons.length; i++) {
            var otherButton = otherToggledButtons[i];
            $(otherButton).button('toggle');

            // remove the toggle class, if it exist already
            if ($(otherButton).hasClass(toggleDisableClass1)) {
                $(otherButton).removeClass(toggleDisableClass1);
            }

            // remove the toggle class, if it exist already
            if ($(otherButton).hasClass(toggleDisableClass2)) {
                $(otherButton).removeClass(toggleDisableClass2);
            }
        }

        var row = btnGroup.parentElement.parentElement;

        // add the toggle class, if it doesn't exist already
        if (!$(row).hasClass(toggleRowClass)) {
            $(row).addClass(toggleRowClass);
        }

        // remove the toggle class, if it exist already
        if ($(row).hasClass(toggleDisableRowClass1)) {
            $(row).removeClass(toggleDisableRowClass1);
        }
        // remove the toggle class, if it exist already
        if ($(row).hasClass(toggleDisableRowClass2)) {
            $(row).removeClass(toggleDisableRowClass2);
        }


    };

    self.userSelectedSave = function (data, event) {
        if (self.debugLevel > 0) log.info("userSelectedSave");

        // make sure they spent the correct amount
        if (data.spentPoints() < data.MINSPENTPOINTSFORANYONEWEEK) {
            alert("You haven't spent the required minimum bets.  You have placed " + data.placedBets() + " bet(s) and you need to place " + data.MINSPENTPOINTSFORANYONEWEEK + ".  YOU CAN DO IT!");
        } else if (data.bonusPoints() > 0) {
            // make sure they spent all their bonus points
            alert("You haven't spent all your bonus points.  You have " + data.bonusPoints() + " remaining.  YOU CAN DO IT!");

        } else {

            var goOn;
            goOn = confirm("Are you sure you want to save your current selections?  You have placed " + data.placedBets() + " bet(s)");

            if (goOn) {

                var realGameRows = data.gameRows.gameRows;
                delete data.gameRows.gameRows;
                delete data.gameRows;
                data.gameRows = realGameRows;

                //log.trace(data);

                $.ajax("/Selection/Save", {
                    data: ko.toJSON({ selection: self }),
                    type: "post", contentType: "application/json",
                    success: function (result) {
                        alert("Saved the results to the database (" + result + " records).  Make sure to check the 'Weekly Results' Tab to ensure they saved correctly.");

                        window.location = "/Selection";
                    },
                    fail: function (err) {
                        alert("Error occurred trying to save to the database.  Error:" + err);
                    }
                });
            };
        };
    };

    self.initializeAfterDataLoad = function () {
        self.calculateAllOtherVariables(self);
    };

    self.calculateSelectionDisabled = function (gameRowsHaveBeenSaved, selectionDisabledForThisGameFilter, userGameSelectionSaved) {
        var disabled = gameRowsHaveBeenSaved || selectionDisabledForThisGameFilter || userGameSelectionSaved;
        self.selectionDisabled(disabled);
    };
    self.assertNotUndefinedOrNull = function (toTest, functionName, variableName) {

        if (typeof toTest === "undefined") throw new Error(variableName + " passed to " + functionName + " is undefined");
        if (toTest === null) throw new Error(variableName + " passed to " + functionName + " is null");
    };

    //self.initializeAfterDataLoad();
}


var resultsByGameGameRowsViewModel = function (data) {
    var self = this;

    if (typeof data === "undefined") throw new Error("data passed to selectionGameRowsViewModel is undefined");
    if (data === null) throw new Error("data passed to selectionGameRowsViewModel is null");

    self.gameRows = [];

    for (var i = 0; i < data.length; i++) {
        self.gameRows.push(new gameRow(data[i]));
    };
};

var gameRow = function (data) {
    var self = this;

    if (typeof data === "undefined") throw new Error("data passed to gameRow is undefined");
    if (data === null) throw new Error("data passed to gameRow is null");

    self.favorite = data.gameSpread.favoriteTeam.teamLongName;
    self.underdog = data.gameSpread.underdogTeam.teamLongName;
    self.spread = data.gameSpread.spread;
    self.winner = data.gameResult.winnerTeam.teamLongName;
    self.usersData = [];
    
    for (var i=0; i<data.userGameSelections.length; i++) {
        self.usersData.push(new usersData(data.userGameSelections[i]));
    };
};

var usersData = function (data, favoriteTeamId, underdogTeamId, noBetTeamId, noPicksTeamId) {
    var self = this;
    var found = false;

    if (typeof data === "undefined") throw new Error("data passed to betPicker is undefined");
    if (data === null) throw new Error("data passed to betPicker is null");
    if (favoriteTeamId === underdogTeamId) throw new Error("favoriteTeamId (" + favoriteTeamId + ") cannot equal underdogTeamId (" + underdogTeamId + ")");
    if (favoriteTeamId === noBetTeamId) throw new Error("favoriteTeamId (" + favoriteTeamId + ") cannot equal noBetTeamId (" + noBetTeamId + ")");
    if (favoriteTeamId === noPicksTeamId) throw new Error("favoriteTeamId (" + favoriteTeamId + ") cannot equal noPicksTeamId (" + noPicksTeamId + ")");
    if (underdogTeamId === noBetTeamId) throw new Error("underdogTeamId (" + underdogTeamId + ") cannot equal noBetTeamId (" + noBetTeamId + ")");
    if (underdogTeamId === noPicksTeamId) throw new Error("underdogTeamId (" + underdogTeamId + ") cannot equal noPicksTeamId (" + noPicksTeamId + ")");
    if (noBetTeamId === noPicksTeamId) throw new Error("noBetTeamId (" + noBetTeamId + ") cannot equal noPicksTeamId (" + noPicksTeamId + ")");

    self.pickedFavorite = false;
    self.pickedUnderdog = false;
    self.pickedNoBet = false; 
    self.pickedNoPicks = false;
    self.pick = data.PickTeam.teamShortName;
    self.bet = data.bet;
    self.result = data.result;
    self.potentialGain = data.potentialGain;
    self.potentialLoss = data.potentialLoss;

    if (data.pickTeamId === favoriteTeamId) {
        self.pickedFavorite = true;
        found = true;
    } else if (data.pickTeamId === underdogTeamId) {
        self.pickedUnderdog = true;
        found = true;
    } else if (data.pickTeamId === noBetTeamId) {
        self.pickedNoBet = true;
        found = true;
    } else if (data.pickTeamId === noPicksTeamId) {
        self.pickedNoPicks = true;
        found = true;
    };

    if (found === false) throw new Error("pickTeamId (" + data.pickTeamId + ") not found");
};