var selectionViewModel = function(data) {
    var self = this;
    self.maxBetForAnyOneGame = ko.observable(5);
    self.minSpentPointsForAnyOneWeek = ko.observable(6);
    self.bonusPointsAllottedPerBetOverMin = ko.observable(1);
    self.maxPossibleBetForAnyGameThisWee = ko.observable(0);
    self.possibleBets = ko.observable(13);
    self.placedBets = ko.observable(0);
    self.bonusPoints = ko.observable(0);
    self.spentPoints = ko.observable(0);
    self.gameFilters = [{ gameFilterId: 4, gameFilterName: "Week 04", gameFilterStartDate: "2012-09-25 00:00:00.000", gameFilterEndDate: "2012-10-01 23:59:59.997" },
               { gameFilterId: 5, gameFilterName: "Week 05", gameFilterStartDate: "2012-10-02 00:00:00.000", gameFilterEndDate: "2012-10-08 23:59:59.997" },
               { gameFilterId: 6, gameFilterName: "Week 06", gameFilterStartDate: "2012-10-09 00:00:00.000", gameFilterEndDate: "2012-10-15 23:59:59.997" }
    ],
    self.currentGameFilter: ko.observable(self.gameFilters[1]),
    /*userGameSelections: ko.observableArray([
                     { userGameSelectionId: 190, userId: 1, gameId: 49, game: {
                         }, spread: 3, favoriteTeam: "Atlanta", underdogTeam: "Washington", bet: 0, pickTeamId: 1, pickTeam: ko.observable("No Bet"), gameDateTime: "Oct  7 2012  1:00PM", homeTeam: "U", minGameBet: 0, maxGameBet: 0 },
                     { userGameSelectionId: 191, userId: 1, gameId: 50, spread: 3.5, favoriteTeam: "Pittsburgh", underdogTeam: "Philadelphia", bet: 0, pickTeamId: 1, pickTeam: "No Bet", gameDateTime: "Oct  7 2012  1:00PM", homeTeam: "F", minGameBet: 0, maxGameBet: 0 },
                     { userGameSelectionId: 192, userId: 1, gameId: 51, spread: 7, favoriteTeam: "Green Bay", underdogTeam: "Indianapolis", bet: 0, pickTeamId: 1, pickTeam: "No Bet", gameDateTime: "Oct  7 2012  1:00PM", homeTeam: "U", minGameBet: 0, maxGameBet: 0 },
                     { userGameSelectionId: 193, userId: 1, gameId: 52, spread: 9, favoriteTeam: "NY Giants", underdogTeam: "Cleveland", bet: 0, pickTeamId: 1, pickTeam: "No Bet", gameDateTime: "Oct  7 2012  1:00PM", homeTeam: "F", minGameBet: 0, maxGameBet: 0 },
                     { userGameSelectionId: 194, userId: 1, gameId: 53, spread: 5.5, favoriteTeam: "Minnesota", underdogTeam: "Tennessee", bet: 0, pickTeamId: 1, pickTeam: "No Bet", gameDateTime: "Oct  7 2012  4:25PM", homeTeam: "F", minGameBet: 0, maxGameBet: 0 },
                     { userGameSelectionId: 195, userId: 1, gameId: 54, spread: 3.5, favoriteTeam: "Cincinnati", underdogTeam: "Miami", bet: 0, pickTeamId: 1, pickTeam: "No Bet", gameDateTime: "Oct  7 2012  1:00PM", homeTeam: "F", minGameBet: 0, maxGameBet: 0 },
                     { userGameSelectionId: 196, userId: 1, gameId: 55, spread: 6, favoriteTeam: "Baltimore", underdogTeam: "Kansas City", bet: 0, pickTeamId: 1, pickTeam: "No Bet", gameDateTime: "Oct  7 2012  1:00PM", homeTeam: "U", minGameBet: 0, maxGameBet: 0 },
                     { userGameSelectionId: 197, userId: 1, gameId: 56, spread: 3, favoriteTeam: "Carolina", underdogTeam: "Seattle", bet: 0, pickTeamId: 1, pickTeam: "No Bet", gameDateTime: "Oct  7 2012  4:05PM", homeTeam: "F", minGameBet: 0, maxGameBet: 0 },
                     { userGameSelectionId: 198, userId: 1, gameId: 57, spread: 6, favoriteTeam: "Chicago", underdogTeam: "Jacksonville", bet: 0, pickTeamId: 1, pickTeam: "No Bet", gameDateTime: "Oct  7 2012  4:05PM", homeTeam: "U", minGameBet: 0, maxGameBet: 0 },
                     { userGameSelectionId: 199, userId: 1, gameId: 58, spread: 6.5, favoriteTeam: "New England", underdogTeam: "Denver", bet: 0, pickTeamId: 1, pickTeam: "No Bet", gameDateTime: "Oct  7 2012  4:25PM", homeTeam: "F", minGameBet: 0, maxGameBet: 0 },
                     { userGameSelectionId: 200, userId: 1, gameId: 59, spread: 9.5, favoriteTeam: "San Francisco", underdogTeam: "Buffalo", bet: 0, pickTeamId: 1, pickTeam: "No Bet", gameDateTime: "Oct  7 2012  8:30PM", homeTeam: "F", minGameBet: 0, maxGameBet: 0 },
                     { userGameSelectionId: 201, userId: 1, gameId: 60, spread: 3.5, favoriteTeam: "New Orleans", underdogTeam: "San Diego", bet: 0, pickTeamId: 1, pickTeam: "No Bet", gameDateTime: "Oct  8 2012  8:35PM", homeTeam: "U", minGameBet: 0, maxGameBet: 0 },
                     { userGameSelectionId: 202, userId: 1, gameId: 61, spread: 8, favoriteTeam: "Houston", underdogTeam: "NY Jets", bet: 0, pickTeamId: 1, pickTeam: "No Bet", gameDateTime: "Oct 11 2012  8:25PM", homeTeam: "U", minGameBet: 0, maxGameBet: 0 }
    ]),*/
    self.userGameSelections = ko.observableArray([
{ userGameSelectionId: 190, userId: 1, gameId: 49, game: { gameId: 49, gameFilterId: 5, gameDateTime: "Oct  7 2012  1:00PM", favoriteTeamId: 16, favoriteTeam: { teamId: 16, teamShortName: "ATL", teamLongName: "Atlanta" }, underdogTeamId: 12, underdogTeam: { teamId: 12, teamShortName: "WAS", teamLongName: "Washington" }, spread: 3.00, homeTeam: "U" }, bet: 1, pickTeamId: 1, pickTeam: { teamId: 1, teamShortName: "X  ", teamLongName: "No Bet" } },
{ userGameSelectionId: 191, userId: 1, gameId: 50, game: { gameId: 50, gameFilterId: 5, gameDateTime: "Oct  7 2012  1:00PM", favoriteTeamId: 13, favoriteTeam: { teamId: 13, teamShortName: "PIT", teamLongName: "Pittsburgh" }, underdogTeamId: 7, underdogTeam: { teamId: 7, teamShortName: "PHI", teamLongName: "Philadelphia" }, spread: 3.50, homeTeam: "F" }, bet: 1, pickTeamId: 1, pickTeam: { teamId: 1, teamShortName: "X  ", teamLongName: "No Bet" } },
{ userGameSelectionId: 192, userId: 1, gameId: 51, game: { gameId: 51, gameFilterId: 5, gameDateTime: "Oct  7 2012  1:00PM", favoriteTeamId: 33, favoriteTeam: { teamId: 33, teamShortName: "GB ", teamLongName: "Green Bay" }, underdogTeamId: 21, underdogTeam: { teamId: 21, teamShortName: "IND", teamLongName: "Indianapolis" }, spread: 7.00, homeTeam: "U" }, bet: 1, pickTeamId: 1, pickTeam: { teamId: 1, teamShortName: "X  ", teamLongName: "No Bet" } },
{ userGameSelectionId: 193, userId: 1, gameId: 52, game: { gameId: 52, gameFilterId: 5, gameDateTime: "Oct  7 2012  1:00PM", favoriteTeamId: 2, favoriteTeam: { teamId: 2, teamShortName: "NYG", teamLongName: "NY Giants" }, underdogTeamId: 29, underdogTeam: { teamId: 29, teamShortName: "CLE", teamLongName: "Cleveland" }, spread: 9.00, homeTeam: "F" }, bet: 1, pickTeamId: 1, pickTeam: { teamId: 1, teamShortName: "X  ", teamLongName: "No Bet" } },
{ userGameSelectionId: 194, userId: 1, gameId: 53, game: { gameId: 53, gameFilterId: 5, gameDateTime: "Oct  7 2012  4:25PM", favoriteTeamId: 4, favoriteTeam: { teamId: 4, teamShortName: "MIN", teamLongName: "Minnesota" }, underdogTeamId: 32, underdogTeam: { teamId: 32, teamShortName: "TEN", teamLongName: "Tennessee" }, spread: 5.50, homeTeam: "F" }, bet: 1, pickTeamId: 1, pickTeam: { teamId: 1, teamShortName: "X  ", teamLongName: "No Bet" } },
{ userGameSelectionId: 195, userId: 1, gameId: 54, game: { gameId: 54, gameFilterId: 5, gameDateTime: "Oct  7 2012  1:00PM", favoriteTeamId: 9, favoriteTeam: { teamId: 9, teamShortName: "CIN", teamLongName: "Cincinnati" }, underdogTeamId: 28, underdogTeam: { teamId: 28, teamShortName: "MIA", teamLongName: "Miami" }, spread: 3.50, homeTeam: "F" }, bet: 1, pickTeamId: 1, pickTeam: { teamId: 1, teamShortName: "X  ", teamLongName: "No Bet" } },
{ userGameSelectionId: 196, userId: 1, gameId: 55, game: { gameId: 55, gameFilterId: 5, gameDateTime: "Oct  7 2012  1:00PM", favoriteTeamId: 22, favoriteTeam: { teamId: 22, teamShortName: "BAL", teamLongName: "Baltimore" }, underdogTeamId: 23, underdogTeam: { teamId: 23, teamShortName: "KC ", teamLongName: "Kansas City" }, spread: 6.00, homeTeam: "U" }, bet: 1, pickTeamId: 1, pickTeam: { teamId: 1, teamShortName: "X  ", teamLongName: "No Bet" } },
{ userGameSelectionId: 197, userId: 1, gameId: 56, game: { gameId: 56, gameFilterId: 5, gameDateTime: "Oct  7 2012  4:05PM", favoriteTeamId: 17, favoriteTeam: { teamId: 17, teamShortName: "CAR", teamLongName: "Carolina" }, underdogTeamId: 24, underdogTeam: { teamId: 24, teamShortName: "SEA", teamLongName: "Seattle" }, spread: 3.00, homeTeam: "F" }, bet: 1, pickTeamId: 1, pickTeam: { teamId: 1, teamShortName: "X  ", teamLongName: "No Bet" } },
{ userGameSelectionId: 198, userId: 1, gameId: 57, game: { gameId: 57, gameFilterId: 5, gameDateTime: "Oct  7 2012  4:05PM", favoriteTeamId: 18, favoriteTeam: { teamId: 18, teamShortName: "CHI", teamLongName: "Chicago" }, underdogTeamId: 30, underdogTeam: { teamId: 30, teamShortName: "JAC", teamLongName: "Jacksonville" }, spread: 6.00, homeTeam: "U" }, bet: 1, pickTeamId: 1, pickTeam: { teamId: 1, teamShortName: "X  ", teamLongName: "No Bet" } },
{ userGameSelectionId: 199, userId: 1, gameId: 58, game: { gameId: 58, gameFilterId: 5, gameDateTime: "Oct  7 2012  4:25PM", favoriteTeamId: 3, favoriteTeam: { teamId: 3, teamShortName: "NE ", teamLongName: "New England" }, underdogTeamId: 26, underdogTeam: { teamId: 26, teamShortName: "DEN", teamLongName: "Denver" }, spread: 6.50, homeTeam: "F" }, bet: 1, pickTeamId: 1, pickTeam: { teamId: 1, teamShortName: "X  ", teamLongName: "No Bet" } },
{ userGameSelectionId: 200, userId: 1, gameId: 59, game: { gameId: 59, gameFilterId: 5, gameDateTime: "Oct  7 2012  4:25PM", favoriteTeamId: 15, favoriteTeam: { teamId: 15, teamShortName: "SF ", teamLongName: "San Francisco" }, underdogTeamId: 6, underdogTeam: { teamId: 6, teamShortName: "BUF", teamLongName: "Buffalo" }, spread: 9.50, homeTeam: "F" }, bet: 5, pickTeamId: 1, pickTeam: { teamId: 1, teamShortName: "X  ", teamLongName: "No Bet" } },
{ userGameSelectionId: 201, userId: 1, gameId: 60, game: { gameId: 60, gameFilterId: 5, gameDateTime: "Oct  7 2012  8:30PM", favoriteTeamId: 5, favoriteTeam: { teamId: 5, teamShortName: "NO ", teamLongName: "New Orleans" }, underdogTeamId: 14, underdogTeam: { teamId: 14, teamShortName: "SD ", teamLongName: "San Diego" }, spread: 3.50, homeTeam: "F" }, bet: 1, pickTeamId: 1, pickTeam: { teamId: 1, teamShortName: "X  ", teamLongName: "No Bet" } },
{ userGameSelectionId: 202, userId: 1, gameId: 61, game: { gameId: 61, gameFilterId: 5, gameDateTime: "Oct  8 2012  8:35PM", favoriteTeamId: 10, favoriteTeam: { teamId: 10, teamShortName: "HOU", teamLongName: "Houston" }, underdogTeamId: 20, underdogTeam: { teamId: 20, teamShortName: "NYJ", teamLongName: "NY Jets" }, spread: 8.00, homeTeam: "U" }, bet: 1, pickTeamId: 1, pickTeam: { teamId: 1, teamShortName: "X  ", teamLongName: "No Bet" } }

    ]),
    self.userMadeSelection = function (selection, selectionClass, rowClass, viewModel, userGameSelection, event) {
        //alert(ko.toJSON(userGameSelection));
        //alert(ko.toJSON(selection));
        var toggleBetClass = "btn-info";
        var toggleNoBetClass = "btn-warning";
        var toggleFavoriteClass = "btn-success";
        var toggleUnderdogClass = "btn-danger";
        var toggleNoBetRowClass = "warning";
        var toggleFavoriteRowClass = "success";
        var toggleUnderdogRowClass = "error";

        if (selection === "favorite") {
            userGameSelection.pickTeamId = userGameSelection.game.favoriteTeamId;
            userGameSelection.pickTeam = userGameSelection.game.favoriteTeam;
            this.updateDomYourSelectionPicker(userGameSelection, event.target, toggleFavoriteClass, toggleNoBetClass, toggleUnderdogClass, toggleFavoriteRowClass, toggleUnderdogRowClass, toggleNoBetRowClass);
            this.initializeBet(userGameSelection, toggleBetClass);  // first time picking a team, initialize the bet
            this.initializeAllOtherVariables(userGameSelection, viewModel, toggleBetClass);
        }
        else if (selection === "underdog") {
            userGameSelection.pickTeamId = userGameSelection.game.underdogTeamId;
            userGameSelection.pickTeam = userGameSelection.game.underdogTeam;
            this.updateDomYourSelectionPicker(userGameSelection, event.target, toggleUnderdogClass, toggleNoBetClass, toggleFavoriteClass, toggleUnderdogRowClass, toggleFavoriteRowClass, toggleNoBetRowClass);
            this.initializeBet(userGameSelection, toggleBetClass); // first time picking a team, initialize the bet
            this.initializeAllOtherVariables(userGameSelection, viewModel, toggleBetClass);
        }
        else {
            userGameSelection.pickTeamId = 1;
            userGameSelection.pickTeam = { teamId: 1, teamShortName: "X  ", teamLongName: "No Bet" };
            this.updateDomYourSelectionPicker(userGameSelection, event.target, toggleNoBetClass, toggleFavoriteClass, toggleUnderdogClass, toggleNoBetRowClass, toggleFavoriteRowClass, toggleUnderdogRowClass);
            this.removeBet(userGameSelection, toggleBetClass); // remove bet if selected no bet
            this.resetAllOtherBetsToOne(viewModel, toggleBetClass);  // since remove one bet can affect bonus points and thus spent points, just reset any bets to 1
            this.initializeAllOtherVariables(userGameSelection, viewModel, toggleBetClass);
        }

        // todo, update this to use observable
        $("#yourSelection" + userGameSelection.userGameSelectionId).text(userGameSelection.pickTeam);
        $("#yourSelection" + userGameSelection.userGameSelectionId).css(selectionClass);
        $("#gameRow" + userGameSelection.userGameSelectionId).css(rowClass);
    },

    self.userMadeBet = function (bet, viewModel, userGameSelection, event) {
        var toggleBetClass = "btn-info";

        this.changeBet(userGameSelection, bet, toggleBetClass);
        this.calculateAllOtherVariables(userGameSelection, viewModel, toggleBetClass);
    },

    self.initializeBet = function (userGameSelection, toggleBetClass) {
        userGameSelection.bet = 1;
        //this.updateDomYourBet(userGameSelection);// todo, update this to use observable
        this.updateDomYourBetPicker(userGameSelection, userGameSelection.bet, -1, toggleBetClass);
    },

    self.removeBet = function (userGameSelection, toggleBetClass) {
        this.updateDomYourBetPicker(userGameSelection, -1, userGameSelection.bet, toggleBetClass);
        userGameSelection.bet = 0;
        //this.updateDomYourBet(userGameSelection);// todo, update this to use observablev
    },

    self.changeBet = function (userGameSelection, changeBetAmount, toggleBetClass) {
        userGameSelection.bet = changeBetAmount;
        //this.updateDomYourBet(userGameSelection);// todo, update this to use observable
        //this.updateDomToggledButtonElement($("#yourBetB" + userGameSelection.bet + "G" + userGameSelection.userGameSelectionId), toggleClass);
        this.updateDomYourBetPicker(userGameSelection, userGameSelection.bet, -1, toggleBetClass);
    },

    self.initializeAllOtherVariables = function (userGameSelection, viewModel, toggleBetClass) {
        this.calculateInitialMinMaxBet(userGameSelection);
        this.calculateInitialBetPicker(userGameSelection, toggleBetClass);
        this.calculateAllOtherVariables(userGameSelection, viewModel, toggleBetClass);
    },

    self.calculateAllOtherVariables = function (userGameSelection, viewModel, toggleBetClass) {
        this.calculateTotalValues(viewModel);
        this.calculateMaxPossibleBetForAnyGameThisWeek(viewModel);
        this.calculateMaxPossibleBetForThisGame(userGameSelection, viewModel);

        for (var i = 0; i < viewModel.userGameSelections().length; i++) {
            var ugs = viewModel.userGameSelections()[i];

            // first just disable all bet pickers just in case
            this.updateDomYourBetPicker(ugs, -1, 1, toggleBetClass);
            this.updateDomYourBetPicker(ugs, -1, 2, toggleBetClass);
            this.updateDomYourBetPicker(ugs, -1, 3, toggleBetClass);
            this.updateDomYourBetPicker(ugs, -1, 4, toggleBetClass);
            this.updateDomYourBetPicker(ugs, -1, 5, toggleBetClass);

            if (ugs.bet > 0) {
                for (var x = 0; x <= ugs.maxGameBet; x++) {
                    this.updateDomYourBetPicker(ugs, x, -1, toggleBetClass);
                }
            }
        }
    },

    self.calculateInitialBetPicker = function (userGameSelection, toggleClass) {
        if (userGameSelection.bet === 0) {
            this.updateDomYourBetPicker(userGameSelection, -1, 1, toggleClass);
            this.updateDomYourBetPicker(userGameSelection, -1, 2, toggleClass);
            this.updateDomYourBetPicker(userGameSelection, -1, 3, toggleClass);
            this.updateDomYourBetPicker(userGameSelection, -1, 4, toggleClass);
            this.updateDomYourBetPicker(userGameSelection, -1, 5, toggleClass);
        }
        else {
            this.updateDomYourBetPicker(userGameSelection, 1, -1, toggleClass);
            //this.updateDomYourBetPicker(userGameSelection, 2, -1, toggleClass);
            //this.updateDomYourBetPicker(userGameSelection, 3, -1, toggleClass);
            //this.updateDomYourBetPicker(userGameSelection, 4, -1, toggleClass);
            //this.updateDomYourBetPicker(userGameSelection, 5, -1, toggleClass);
        }
    },

    self.resetAllOtherBetsToOne = function (viewModel, toggleBetClass) {
        for (var i = 0; i < viewModel.userGameSelections().length; i++) {
            var ugs = viewModel.userGameSelections()[i];

            // first just disable all bet pickers just in case
            this.updateDomYourBetPicker(ugs, -1, 1, toggleBetClass);
            this.updateDomYourBetPicker(ugs, -1, 2, toggleBetClass);
            this.updateDomYourBetPicker(ugs, -1, 3, toggleBetClass);
            this.updateDomYourBetPicker(ugs, -1, 4, toggleBetClass);
            this.updateDomYourBetPicker(ugs, -1, 5, toggleBetClass);

            if (ugs.bet > 0) {
                ugs.bet = 1;
                for (var x = 0; x <= ugs.maxGameBet; x++) {
                    this.updateDomYourBetPicker(ugs, x, -1, toggleBetClass);
                }
            }
        }
    },

    self.calculateInitialMinMaxBet = function (userGameSelection) {
        if (userGameSelection.bet === 0) {
            userGameSelection.minGameBet = 0;
            userGameSelection.maxGameBet = 0;
        }
        else {
            userGameSelection.minGameBet = 1;
            userGameSelection.maxGameBet = 1;
        }

        //this.updateDomYourMinGameBet(userGameSelection);// todo, update this to use observable
        //this.updateDomYourMaxGameBet(userGameSelection);// todo, update this to use observable
    },

    self.calculateTotalValues = function (viewModel) {
        var spentPointsLocal = 0;
        var placedBetsLocal = 0;
        var bonusPointsLocal = 0;
        var totalPointsLocal = 0;

        var minSpentPointsForAnyOneWeekLocal = viewModel.minSpentPointsForAnyOneWeek();
        var bonusPointsAllottedPerBetOverMinLocal = viewModel.bonusPointsAllottedPerBetOverMin();



        for (var i = 0; i < viewModel.userGameSelections().length; i++) {

            var ugs = viewModel.userGameSelections()[i];
            var betLocal = ugs.bet;

            spentPointsLocal = spentPointsLocal + betLocal;
            if (betLocal > 0) {
                placedBetsLocal = placedBetsLocal + 1;
            }

            // determine bonus points
            if (betLocal > 0) {
                // there must be a bet to consider giving bonus points
                if (spentPointsLocal > minSpentPointsForAnyOneWeekLocal) {
                    // if there are the minumum bets already, then add bonus points
                    bonusPointsLocal = bonusPointsLocal + bonusPointsAllottedPerBetOverMinLocal;
                }
                else {
                    // otherwise bonus points still equal 0
                    bonusPointsLocal = 0;
                }
            }
            //else {
            //    if (placedBetsLocal <= minSpentPointsForAnyOneWeekLocal) {
            //        bonusPointsLocal = minSpentPointsForAnyOneWeekLocal;
            //    }
            //}
        }

        // there must be more bets than the min required to consider giving bonus points
        if (spentPointsLocal > minSpentPointsForAnyOneWeekLocal) {
            // if there are the minumum bets already, then add bonus points
            totalPointsLocal = placedBetsLocal + (placedBetsLocal - minSpentPointsForAnyOneWeekLocal) * bonusPointsAllottedPerBetOverMinLocal;
        }
        else {
            // otherwise bonus points still equal 0
            totalPointsLocal = placedBetsLocal;
        }

        bonusPointsLocal = totalPointsLocal - spentPointsLocal;

        viewModel.placedBets(placedBetsLocal);
        viewModel.spentPoints(spentPointsLocal);
        viewModel.bonusPoints(bonusPointsLocal);
    },

    self.calculateMaxPossibleBetForAnyGameThisWeek = function (viewModel) {

        var bonusPointsLocal = viewModel.bonusPoints();
        var spentPointsLocal = viewModel.spentPoints();
        var placedBetsLocal = viewModel.placedBets();
        var bonusPointsLocal = viewModel.bonusPoints();
        var maxBetForAnyOneGameLocal = viewModel.maxBetForAnyOneGame();
        var minSpentPointsForAnyOneWeekLocal = viewModel.minSpentPointsForAnyOneWeek();
        var bonusPointsAllottedPerBetOverMinLocal = viewModel.bonusPointsAllottedPerBetOverMin();
        var maxPossibleBetForAnyGameThisWeekLocal = 0;

        for (var i = 0; i < viewModel.userGameSelections().length; i++) {
            var ugs = viewModel.userGameSelections()[i];

            //if (spentPointsLocal <= minSpentPointsForAnyOneWeekLocal) {
            if (bonusPointsLocal <= 0) {
                // if you haven't spent the required minumum points, 
                // then there will not be any bonus points to spend, 
                // set max possible bet for any game this week to 1
                maxPossibleBetForAnyGameThisWeekLocal = 1;
            }
            else if (bonusPointsLocal  >= maxBetForAnyOneGameLocal) {
                // if you have more bonus points to spend on a bet than what is allowed on any one game, 
                // then set max possible bet for any game this week to game max bet for any one game
                maxPossibleBetForAnyGameThisWeekLocal = maxBetForAnyOneGameLocal;
            }
            else {
                // else the max possible bet is set to the remaining bonus points
                maxPossibleBetForAnyGameThisWeekLocal = bonusPointsLocal + 1;
            }

            viewModel.maxPossibleBetForAnyGameThisWeek(maxPossibleBetForAnyGameThisWeekLocal);
        }
    },

    self.calculateMaxPossibleBetForThisGame = function (userGameSelection, viewModel) {

        var maxGameBetLocal = 0;
        var maxPossibleBetForAnyGameThisWeekLocal = viewModel.maxPossibleBetForAnyGameThisWeek();

        for (var i = 0; i < viewModel.userGameSelections().length; i++) {
            var ugs = viewModel.userGameSelections()[i];

            var betLocal = ugs.bet;

            if (betLocal === 0) {
                // if there is no bet, then the max bet has to be 0
                maxGameBetLocal = 0;
            }
            else if (betLocal > maxPossibleBetForAnyGameThisWeekLocal) {
                // if any game is already higher than the max bet, then those spent points were already factored in to that max bet as spent already...so set the max game bet to the current bet
                maxGameBetLocal = betLocal;
            }
            else {
                // otherwise set to max bet of this week
                maxGameBetLocal = maxPossibleBetForAnyGameThisWeekLocal;
            }
            ugs.maxGameBet = maxGameBetLocal;
            //this.updateDomYourMaxGameBet(ugs);
        }
    };
    self.updateDomToggledButtonElement = function (element, toggledClass) {

        var isToggled = $(element).hasClass("active");

        if (isToggled) {
            // there is nothing to do since it is already toggled
        }
        else {
            // toggle the button...visually
            $(element).button('toggle');
            $(element).addClass(toggledClass);

            // untoggle the other button(s)...visually...if active
            var btnGroup = element.parentElement;
            var otherToggledButtons = $(btnGroup).find(".active").filter(function(index){
                return $(this).attr("id") != $(element).attr("id");
            });
            for (var i = 0; i < otherToggledButtons.length; i++) {
                var otherButton = otherToggledButtons[i];
                $(otherButton).button('toggle');
                $(otherButton).removeClass(toggledClass);
            }
        }
    };
    self.updateDomYourBetPicker = function (userGameSelection, betToEnable, betToDisable, toggleBetClass) {

        if (betToEnable > -1) {
            var betEnableElement = $("#yourBetB" + betToEnable + "G" + userGameSelection.userGameSelectionId);

            // first enable the bet
            $(betEnableElement).removeAttr("disabled");

            if (betToEnable === userGameSelection.bet) {
                // if it equals the current bet

                // set to active by toggling it
                $(betEnableElement).button('toggle');

                // add the toggle class, if it doesn't exist already
                if (!$(betEnableElement).hasClass(toggleBetClass)) {
                    $(betEnableElement).addClass(toggleBetClass);
                }
            }
        }


        if (betToDisable > -1) {
            var betDisableElement = $("#yourBetB" + betToDisable + "G" + userGameSelection.userGameSelectionId);

            // first disable the bet
            $(betDisableElement).attr("disabled", "disabled");

            // remove the toggle class, if it exist already
            if ($(betDisableElement).hasClass(toggleBetClass)) {
                $(betDisableElement).removeClass(toggleBetClass);
            }

            // remove the active class, if it exist already
            if ($(betDisableElement).hasClass("active")) {
                $(betDisableElement).removeClass("active");
            }
        }
    };
    self.updateDomYourSelectionPicker = function (userGameSelection, element, toggleEnableClass, toggleDisableClass1, toggleDisableClass2, toggleRowClass, toggleDisableRowClass1, toggleDisableRowClass2) {

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
        $.ajax("/Selection/Save", {
            data: ko.toJSON({ userGameSelections: this.userGameSelections }),
            type: "post", contentType: "application/json",
            success: function(result) { alert(result) }
        });
    };
}
