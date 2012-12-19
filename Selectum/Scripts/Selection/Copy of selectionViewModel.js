var selectionViewModel = function (data) {

    var self = this;
    self.debugLevel = 1;    

    // validation, make sure the vm is initialized correctly
    if (isNaN(data.maxBetForAnyOneGame)) throw Error("data.maxBetForAnyOneGame cannot be NaN");
    if (isNaN(data.minSpentPointsForAnyOneWeek)) throw Error("data.minSpentPointsForAnyOneWeek cannot be NaN");
    if (isNaN(data.extraPointFactorPerBetOverMin)) throw Error("data.extraPointFactorPerBetOverMin cannot be NaN");
    if (isNaN(data.possibleBets)) throw Error("data.possibleBets cannot be NaN");
    if (isNaN(data.placedBets)) throw Error("data.placedBets cannot be NaN");
    if (isNaN(data.bonusPoints)) throw Error("data.bonusPoints cannot be NaN");
    if (isNaN(data.spentPoints)) throw Error("data.spentPoints cannot be NaN");
    if (isNaN(data.gameRowsHaveBeenSaved)) throw Error("data.gameRowsHaveBeenSaved cannot be NaN");
    if (isNaN(data.selectionDisabledForThisGameFilter)) throw Error("data.selectionDisabledForThisGameFilter cannot be NaN");

    console.log(data.gameRows[0]);

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
    self.userGameSelectionsHaveBeenSaved = data.gameRowsHaveBeenSaved;
    self.selectionDisabledForThisGameFilter = data.selectionDisabledForThisGameFilter;

    console.log(self);

    // validation, make sure the vm is initialized correctly
    if (isNaN(self.MAXBETFORANYONEGAME)) throw Error("self.MAXBETFORANYONEGAME cannot be NaN");
    if (isNaN(self.MINSPENTPOINTSFORANYONEWEEK)) throw Error("self.MINSPENTPOINTSFORANYONEWEEK cannot be NaN");
    if (isNaN(self.EXTRAPOINTFACTORPERBETOVERMIN)) throw Error("self.EXTRAPOINTFACTORPERBETOVERMIN cannot be NaN");
    if (isNaN(self.maxPossibleAdditionalBetForAnyGameThisWeek())) throw Error("self.maxPossibleAdditionalBetForAnyGameThisWeek() cannot be NaN");
    if (isNaN(self.possibleBets())) throw Error("self.possibleBets() cannot be NaN");
    if (isNaN(self.placedBets())) throw Error("self.placedBets() cannot be NaN");
    if (isNaN(self.bonusPoints())) throw Error("self.bonusPoints() cannot be NaN");
    if (isNaN(self.spentPoints())) throw Error("self.spentPoints() cannot be NaN");

    self.test = function (id, viewModel) {
        self.betPickersActive(!self.betPickersActive());
        self.betPickersDisabled(!self.betPickersDisabled());
        self.betPickersToggled(!self.betPickersToggled());

        console.log(self.betPickersActive());
        console.log(self.betPickersDisabled());
        console.log(self.betPickersToggled());
    };

    self.userMadeSelection = function (selection, selectionClass, rowClass, viewModel, gameRow, event) {
        if (self.debugLevel > 0) console.log("userMadeSelection");
        //alert(ko.toJSON(userGameSelection));
        //alert(ko.toJSON(selection));

        var userGameSelection = gameRow.userGameSelection;
        var selectionDisabled = viewModel.selectionDisabledForThisGameFilter || userGameSelection.saved;

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
            this.initializeBet(gameRow.userGameSelection, gameRow.betPickers, selectionDisabled);  // first time picking a team, initialize the bet
            this.initializeAllOtherVariables(gameRow, viewModel, selectionDisabled);
        }
        else if (selection === "underdog") {
            userGameSelection.pickTeamId = userGameSelection.gameSpread.underdogTeamId;
            userGameSelection.pickTeam = userGameSelection.gameSpread.underdogTeam;
            this.updateDomYourSelectionPicker(userGameSelection, event.target, toggleUnderdogClass, toggleNoBetClass, toggleFavoriteClass, toggleUnderdogRowClass, toggleFavoriteRowClass, toggleNoBetRowClass);
            this.initializeBet(gameRow.userGameSelection, gameRow.betPickers, selectionDisabled); // first time picking a team, initialize the bet
            this.initializeAllOtherVariables(gameRow, viewModel, selectionDisabled);
        }
        else {

            // TODO fix the hardcoded nobet team
            userGameSelection.pickTeamId = 1;
            userGameSelection.pickTeam = { teamId: 1, teamShortName: "X  ", teamLongName: "No Bet" };
            this.updateDomYourSelectionPicker(userGameSelection, event.target, toggleNoBetClass, toggleFavoriteClass, toggleUnderdogClass, toggleNoBetRowClass, toggleFavoriteRowClass, toggleUnderdogRowClass);
            this.removeBet(gameRow); // remove bet if selected no bet
            this.resetAllOtherBetsToOne(viewModel.gameRows, toggleBetClass);  // since remove one bet can affect bonus points and thus spent points, just reset any bets to 1
            this.initializeAllOtherVariables(gameRow, viewModel, selectionDisabled);
        }
    };

    self.userMadeBet = function (bet, viewModel, userGameSelection, event) {
        if (self.debugLevel > 0) console.log("userMadeBet");
        var toggleBetClass = "btn-info";

        this.changeBet(gameRow.userGameSelection, gameRow.betPickers, bet, viewModel.selectionDisabledForThisGameFilter || userGameSelection.saved);
        this.calculateAllOtherVariables(userGameSelection, viewModel, toggleBetClass);
    };

    /**
    */
    self.initializeBet = function (userGameSelection, betPickers, selectionDisabled) {
        if (self.debugLevel > 0) console.log("initializeBet");

        // set the bet to 1 and enable it
        userGameSelection.bet = 1;
        self.enableBetPicker(betPickers[userGameSelection.bet - 1], userGameSelection.bet, selectionDisabled);
    };

    /**
    */
    self.removeBet = function (gameRow) {
        if (self.debugLevel > 0) console.log("removeBet");

        // disable the picker itself
        self.disableAllBetPickers(gameRow.betPickers);

        // set the bet to 0
        gameRow.userGameSelection.bet = 0;
    };

    /**
    */
    self.changeBet = function (userGameSelection, betPickers, newBet, selectionDisabled) {
        if (self.debugLevel > 0) console.log("changeBet");

        userGameSelection.bet = newBet;

        self.enableAllBetPickers(betPickers, userGameSelection.bet, selectionDisabled);
    };

    self.initializeAllOtherVariables = function (gameRow, viewModel, selectionDisabled) {
        if (self.debugLevel > 0) console.log("initializeAllOtherVariables");

        console.log(gameRow);

        self.initializeMinMaxBet(gameRow.userGameSelection);
        self.initializeBetPicker(gameRow.userGameSelection, gameRow.betPickers, selectionDisabled);
        self.calculateAllOtherVariables(viewModel);
    };

    /**
    */
    self.calculateAllOtherVariables = function (viewModel) {
        if (self.debugLevel > 0) console.log("calculateAllOtherVariables");

        self.calculateTotalValues(viewModel.gameRows, viewModel.MINSPENTPOINTSFORANYONEWEEK, viewModel.EXTRAPOINTFACTORPERBETOVERMIN);
        self.calculateMaxPossibleAdditionalBetForAnyGameThisWeek(viewModel.gameRows, viewModel.bonusPoints(), viewModel.spentPoints(), viewModel.placedBets(), viewModel.MAXBETFORANYONEGAME);
        self.calculateMaxPossibleBetForThisGame(viewModel.gameRows, viewModel.MAXBETFORANYONEGAME);

        if (self.debugLevel > 0) console.log("enableBetPicker for every row/every bet");
        for (var i = 0; i < viewModel.gameRows.length; i++) {
            var ugs = viewModel.gameRows[i].userGameSelection;
            var betPickers = viewModel.gameRows[i].betPickers;
            var selectionDisabled = viewModel.selectionDisabledForThisGameFilter || ugs.saved;

            // first just disable all bet pickers just in case
            this.disableAllBetPickers(betPickers);

            if (self.debugLevel > 0) console.log("ugs.bet, ugs.maxGameBet:" + ugs.bet + "," + ugs.maxGameBet);
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
    self.initializeBetPicker = function (userGameSelection, betPickers, selectionDisabled) {
        if (self.debugLevel > 0) console.log("initializeBetPicker");

        if (userGameSelection.bet === 0) {
            if (self.debugLevel > 1) console.log("disabling all bets");
            self.disableAllYourBetPickers(betPickers);
        }
        else {
            if (self.debugLevel > 1) console.log("enabling bet 1");
            self.enableBetPicker(betPickers[userGameSelection.bet - 1], userGameSelection.bet, selectionDisabled);
        }
    };

    /**
    */
    self.resetAllOtherBetsToOne = function (gameRows, toggleBetClass, selectionDisabledForThisGameFilter) {
        if (self.debugLevel > 0) console.log("resetAllOtherBetsToOne");

        for (var i = 0; i < gameRows.length; i++) {
            var ugs = gameRows[i].userGameSelection;
            var betPickers = gameRows[i].betPickers;

            var selectionDisabled = selectionDisabledForThisGameFilter || ugs.saved;

            // first just disable all bet pickers
            self.disableAllBetPickers(betPickers);

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
        if (self.debugLevel > 0) console.log("initializeMinMaxBet");

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
        if (self.debugLevel > 0) console.log("calculateTotalValues");

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
     * @param gameRows    List of game row selections and their bets
     * @param bonusPoints  The number of bonus points not spent already
     * @param spentPoints  The number of spent points (spent bonus points + bets)
     * @param placedBets  The number of placed bets
     * @param MAXBETFORANYONEGAME  The max bet allowed for any one game (CONSTANT)
     * @output  sets the following:
     *              self.maxPossibleAdditionalBetForAnyGameThisWeek;
     */
    self.calculateMaxPossibleAdditionalBetForAnyGameThisWeek = function (gameRows, bonusPoints, spentPoints, placedBets, MAXBETFORANYONEGAME) {
        if (self.debugLevel > 0) console.log("calculateMaxPossibleAdditionalBetForAnyGameThisWeek");

        var maxPossibleAdditionalBetForAnyGameThisWeekLocal = 0;

        for (var i = 0; i < gameRows.length; i++) {
            var ugs = gameRows[i].userGameSelection;

            //if (spentPointsLocal <= viewModel.MINSPENTPOINTSFORANYONEWEEK) {
            if (bonusPoints <= 0) {
                // if you haven't spent the required minumum points, 
                // then there will not be any bonus points to spend, 
                // set max possible bet for any game this week to 1
                maxPossibleAdditionalBetForAnyGameThisWeekLocal = 1;
            }
            else if (bonusPoints >= MAXBETFORANYONEGAME) {
                // if you have more bonus points to spend on a bet than what is allowed on any one game, 
                // then set max possible bet for any game this week to game max bet for any one game
                maxPossibleAdditionalBetForAnyGameThisWeekLocal = MAXBETFORANYONEGAME;
            }
            else {
                // else the max possible bet is set to the remaining bonus points (+ 1 since there is already a bet of 1)
                maxPossibleAdditionalBetForAnyGameThisWeekLocal = bonusPoints + 1;
            }

            self.maxPossibleAdditionalBetForAnyGameThisWeek(maxPossibleAdditionalBetForAnyGameThisWeekLocal);
        }
    };

    /**
     * calculateMaxPossibleBetForThisGame will calculate the max possible bet for each game based on business rules around how many 
     * points have been spent (betted) and the max possible bet for any game this week  
     * @param gameRows    List of game row selections and their bets
     * @param maxPossibleAdditionalBetForAnyGameThisWeek  The max possible bet for any game this week
     * @output  sets the following:
     *              userGameSelection.maxGameBet (for each userGameSelection)
     */
    self.calculateMaxPossibleBetForThisGame = function (gameRows, maxPossibleAdditionalBetForAnyGameThisWeek) {
        if (self.debugLevel > 0) console.log("calculateMaxPossibleBetForThisGame");

        var maxGameBetLocal = 0;

        for (var i = 0; i < gameRows.length; i++) {
            var ugs = gameRows[i].userGameSelection;

            var betLocal = ugs.bet;

            if (betLocal === 0) {
                // if there is no bet, then the max bet has to be 0
                maxGameBetLocal = 0;
            }
            else if (betLocal > maxPossibleAdditionalBetForAnyGameThisWeek) {
                // if any game is already higher than the max bet, then those spent points were already factored in to that max bet as spent already...so set the max game bet to the current bet
                maxGameBetLocal = betLocal;
            }
            else {
                // otherwise set to max bet of this week
                maxGameBetLocal = maxPossibleAdditionalBetForAnyGameThisWeek;
            }

            ugs.maxGameBet = maxGameBetLocal;
        }
    };

    // obsolete
    self.determineYourBetPicker = function (userGameSelection, betToUpdate, toggleBetClass, disable, selectionDisabled) {
        if (self.debugLevel > 4) console.log("determineYourBetPicker");

        if (disable || selectionDisabled) {
            // if the bet should be disabled due to current selection (disable) or due to the data has been saved already (selectionDisabled)
            userGameSelection.disable = true;
        };

        // if it is supposed to be enabled (disable == false) then check the bet amount and set that bet to active
        if (!disable) {
            if (betToUpdate === userGameSelection.bet) {
                // if it equals the current bet

                // set to active by toggling it
                userGameSelection.toggle = true;
                userGameSelection.active = true;
            };
        };

        var betElement = $("#yourBetB" + betToUpdate + "G" + userGameSelection.userGameSelectionId);

        this.updateDomYourBetPicker(betElement, userGameSelection.disable, userGameSelection.active, userGameSelection.toggle, toggleBetClass);

    };

    self.disableAllBetPickers = function (betPickers) {
        if (self.debugLevel > 0) console.log("disableAllBetPickers");

        for (var i = 0; i < betPickers.length; i++) {
            var betPicker = betPickers[i];

            self.disableBetPicker(betPicker);
        };
    };

    self.disableBetPicker = function (betPicker) {
        if (self.debugLevel > 0) console.log("disableBetPicker");

        console.log(betPicker);
        betPicker.activated(false);
        betPicker.disabled(true);
        betPicker.toggled(false);
    };

    self.enableAllBetPickers = function (betPickers, bet, selectionDisabled) {
        if (self.debugLevel > 0) console.log("enableAllBetPickers");

        for (var i = 0; i < betPickers.length; i++) {
            var betPicker = betPickers[i];

            self.enableBetPicker(betPicker, bet);
        };
    };

    self.enableBetPicker = function (betPicker, bet, selectionDisabled) {
        if (self.debugLevel > 0) console.log("enableBetPicker");

        console.log(betPicker);

        // only activate/toggle it if it matches the bet value
        // TODO move that to KO Computed 
        if (bet === betPicker.betValue) {
            betPicker.activated(true);
            betPicker.toggled(true);
        };
        
        if (selectionDisabled) {
            // its supposed to stay disabled, so keep it disabled
            betPicker.disabled(true);
        } else {
            betPicker.disabled(false);
        }
    };

    // obsolete
    self.updateDomYourBetPicker = function (betElement, disable, active, toggle, toggleBetClass) {
        if (self.debugLevel > 4) console.log("updateDomYourBetPicker");

        var domElement = $(betElement);

        if (disable) {
            $(domElement).attr("disabled", "disabled");
        } else {
            $(domElement).removeAttr("disabled");
        };

        if (active) {
            // add the active class, if it doesnt exist already
            if (!$(domElement).hasClass("active")) {
                $(domElement).addClass("active");
            }
        } else {
            // remove the active class, if it exist already
            if ($(domElement).hasClass("active")) {
                $(domElement).removeClass("active");
            }

        };

        if (toggle) {
            // set to active by toggling it
            //$(domElement).button('toggle');

            // add the toggle class, if it doesn't exist already
            if (!$(domElement).hasClass(toggleBetClass)) {
                $(domElement).addClass(toggleBetClass);
            }
        } else {
            // remove the toggle class, if it exist already
            if ($(domElement).hasClass(toggleBetClass)) {
                $(domElement).removeClass(toggleBetClass);
            }
        };
    };

    self.updateDomYourSelectionPicker = function (userGameSelection, element, toggleEnableClass, toggleDisableClass1, toggleDisableClass2, toggleRowClass, toggleDisableRowClass1, toggleDisableRowClass2) {
        if (self.debugLevel > 0) console.log("updateDomYourSelectionPicker");

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
        if (self.debugLevel > 0) console.log("userSelectedSave");

        $.ajax("/Selection/Save", {
            data: ko.toJSON({ selection: self }),
            type: "post", contentType: "application/json",
            success: function (result) { alert(result) }
        });
    };

    self.initializeAfterDataLoad = function () {
        for (var i = 0; i < self.gameRows.length; i++) {
            var ugs = self.gameRows[i].userGameSelection;

            self.calculateAllOtherVariables(ugs, self, self.toggleBetClass);
        };
    };

    //self.initializeAfterDataLoad();
}


var selectionGameRowsViewModel = function (data) {

    var self = this;
    self.gameRows = [];
    for (var i = 0; i < data.length; i++) {
        self.gameRows.push(new gameRow(data[i]));
    };
};

var gameRow = function (data) {

    var self = this;

    self.userGameSelection = data.userGameSelection;
    self.selectionPicker = new selectionPicker(data.selectionPicker);
    self.betPickers = [];
    
    for (var i=0; i<data.betPickers.length; i++) {
        self.betPickers.push(new betPicker(data.betPickers[i]));
    };
};

var betPicker = function (data) {

    var self = this;
    self.disabled = ko.observable(data.disabled);
    self.toggled = ko.observable(data.toggled);
    self.betValue = data.betValue;
};

var selectionPicker = function (data) {

    var self = this;
    self.disabled = ko.observable(data.disabled);
    self.toggled = ko.observable(data.toggled);
    self.selectionValue = ko.observable(data.selectionValue);
};