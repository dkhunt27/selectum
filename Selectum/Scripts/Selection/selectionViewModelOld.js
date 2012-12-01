function SelectionViewModel() {
    var self = this;
    self.maxBetForAnyOneGame = ko.observable(5);
    self.minSpentPointsForAnyOneWeek = ko.observable(6);
    self.extraPointFactorPerBetOverMin = ko.observable(2);
    self.possibleBets = ko.observable(14);
    self.placedBets = ko.observable(14);
    self.availablePoints = ko.observable(14);
    self.spentPoints = ko.observable(14);
    self.selection = new Selection({
        maxBetForAnyOneGame: 5,
        minSpentPointsForAnyOneWeek: 6,
        extraPointFactorPerBetOverMin: 2,
        possibleBets: 14,
        placedBets: 0,
        availablePoints: 6,
        spentPoints: 0,
        currentGameFilter: { gameFilterId: 5, gameFilterName: "Week 05", gameFilterStartDate: "2012-10-02 00:00:00.000", gameFilterEndDate: "2012-10-08 23:59:59.997" },
        gameFilters: [{ gameFilterId: 4, gameFilterName: "Week 04", gameFilterStartDate: "2012-09-25 00:00:00.000", gameFilterEndDate: "2012-10-01 23:59:59.997" },
                   { gameFilterId: 5, gameFilterName: "Week 05", gameFilterStartDate: "2012-10-02 00:00:00.000", gameFilterEndDate: "2012-10-08 23:59:59.997" },
                   { gameFilterId: 6, gameFilterName: "Week 06", gameFilterStartDate: "2012-10-09 00:00:00.000", gameFilterEndDate: "2012-10-15 23:59:59.997" }
        ],
        userGameSelections: [{ userGameSelectionId: 189, userId: 1, gameId: 48, bet: 0, pickTeamId: 1 },
                         { userGameSelectionId: 190, userId: 1, gameId: 49, bet: 0, pickTeamId: 1 },
                         { userGameSelectionId: 191, userId: 1, gameId: 50, bet: 0, pickTeamId: 1 },
                         { userGameSelectionId: 192, userId: 1, gameId: 51, bet: 0, pickTeamId: 1 },
                         { userGameSelectionId: 193, userId: 1, gameId: 52, bet: 0, pickTeamId: 1 },
                         { userGameSelectionId: 194, userId: 1, gameId: 53, bet: 0, pickTeamId: 1 },
                         { userGameSelectionId: 195, userId: 1, gameId: 54, bet: 0, pickTeamId: 1 },
                         { userGameSelectionId: 196, userId: 1, gameId: 55, bet: 0, pickTeamId: 1 },
                         { userGameSelectionId: 197, userId: 1, gameId: 56, bet: 0, pickTeamId: 1 },
                         { userGameSelectionId: 198, userId: 1, gameId: 57, bet: 0, pickTeamId: 1 },
                         { userGameSelectionId: 199, userId: 1, gameId: 58, bet: 0, pickTeamId: 1 },
                         { userGameSelectionId: 200, userId: 1, gameId: 59, bet: 0, pickTeamId: 1 },
                         { userGameSelectionId: 201, userId: 1, gameId: 60, bet: 0, pickTeamId: 1 },
                         { userGameSelectionId: 202, userId: 1, gameId: 61, bet: 0, pickTeamId: 1 }
        ]
    });

    alert(self.maxBetForAnyOneGame());
    // load the initial state from server, convert to selection instance, then populate self
    //$.getJSON("/SelectionData", function (dataFromServer) {
    //    var mappedData = $.map(dataFromServer, function (item) { return new Selection(item) });
    //    self.selection = mappedData;
    //});
};

ko.applyBindings(SelectionViewModel2);

function Selection(data) {
    this.maxBetForAnyOneGame = data.maxBetForAnyOneGame;
    this.minSpentPointsForAnyOneWeek = data.minSpentPointsForAnyOneWeek;
    this.extraPointFactorPerBetOverMin = data.extraPointFactorPerBetOverMin;
    this.possibleBets = data.possibleBets;
    this.placedBets = ko.observable(data.placedBets);
    this.availablePoints = ko.observable(data.availablePoints);
    this.spentPoints = ko.observable(data.spentPoints);

    this.currentGameFilter = data.currentGameFilter;
    this.gameFilters = data.gameFilters;
    this.userGameSelections = ko.observableArray(data.userGameSelections);
};

function GameFilter(data) {
    this.gameFilterId = ko.observable(data.gameFilterId);
    this.gameFilterName = ko.observable(data.gameFilterName);
    this.gameFilterStartDate = ko.observable(data.gameFilterStartDate);
    this.gameFilterEndDate = ko.observable(data.gameFilterEndDate);
};

function UserGameSelection(data) {
    this.userGameSelectionId = ko.observable(data.userGameSelectionId);
    this.userId = ko.observable(data.userId);
    this.gameId = ko.observable(data.gameId);
    this.bet = ko.observable(data.bet);
    this.pickTeamId =ko.observable(data.pickTeamId);
};

function BuildDummySelectionData2() {
    this.maxBetForAnyOneGame= 5;
        this.minSpentPointsForAnyOneWeek= 6;
        this.extraPointFactorPerBetOverMin= 2;
        this.possibleBets = 14;
        this.placedBets= 0;
        this.availablePoints= 6;
        this.spentPoints= 0;
        this.currentGameFilter= { gameFilterId: 5, gameFilterName: "Week 05", gameFilterStartDate: "2012-10-02 00:00:00.000", gameFilterEndDate: "2012-10-08 23:59:59.997" };
        this.gameFilters = [{ gameFilterId: 4, gameFilterName: "Week 04", gameFilterStartDate: "2012-09-25 00:00:00.000", gameFilterEndDate: "2012-10-01 23:59:59.997" },
                   { gameFilterId: 5, gameFilterName: "Week 05", gameFilterStartDate: "2012-10-02 00:00:00.000", gameFilterEndDate: "2012-10-08 23:59:59.997" },
                   { gameFilterId: 6, gameFilterName: "Week 06", gameFilterStartDate: "2012-10-09 00:00:00.000", gameFilterEndDate: "2012-10-15 23:59:59.997" }
        ];
}

var SelectionViewModel2 = {
   maxBetForAnyOneGame: ko.observable(5),
   minSpentPointsForAnyOneWeek: ko.observable(6),
   extraPointFactorPerBetOverMin: ko.observable(2),
   possibleBets: ko.observable(14),
   placedBets: ko.observable(14),
   availablePoints: ko.observable(14),
   spentPoints: ko.observable(14)
}
var SelectionViewModel2 = {
        maxBetForAnyOneGame: 5,
        minSpentPointsForAnyOneWeek: 6,
        extraPointFactorPerBetOverMin: 2,
        possibleBets: 14,
        placedBets: 0,
        availablePoints: 6,
        spentPoints: 0,
        currentGameFilter: { gameFilterId: 5, gameFilterName: "Week 05", gameFilterStartDate: "2012-10-02 00:00:00.000", gameFilterEndDate: "2012-10-08 23:59:59.997" },
        gameFilters: [{ gameFilterId: 4, gameFilterName: "Week 04", gameFilterStartDate: "2012-09-25 00:00:00.000", gameFilterEndDate: "2012-10-01 23:59:59.997" },
                   { gameFilterId: 5, gameFilterName: "Week 05", gameFilterStartDate: "2012-10-02 00:00:00.000", gameFilterEndDate: "2012-10-08 23:59:59.997" },
                   { gameFilterId: 6, gameFilterName: "Week 06", gameFilterStartDate: "2012-10-09 00:00:00.000", gameFilterEndDate: "2012-10-15 23:59:59.997" }
        ],
        userGameSelections: [{ userGameSelectionId: 189, userId: 1, gameId: 48, bet: 0, pickTeamId: 1 },
                         { userGameSelectionId: 190, userId: 1, gameId: 49, bet: 0, pickTeamId: 1 },
                         { userGameSelectionId: 191, userId: 1, gameId: 50, bet: 0, pickTeamId: 1 },
                         { userGameSelectionId: 192, userId: 1, gameId: 51, bet: 0, pickTeamId: 1 },
                         { userGameSelectionId: 193, userId: 1, gameId: 52, bet: 0, pickTeamId: 1 },
                         { userGameSelectionId: 194, userId: 1, gameId: 53, bet: 0, pickTeamId: 1 },
                         { userGameSelectionId: 195, userId: 1, gameId: 54, bet: 0, pickTeamId: 1 },
                         { userGameSelectionId: 196, userId: 1, gameId: 55, bet: 0, pickTeamId: 1 },
                         { userGameSelectionId: 197, userId: 1, gameId: 56, bet: 0, pickTeamId: 1 },
                         { userGameSelectionId: 198, userId: 1, gameId: 57, bet: 0, pickTeamId: 1 },
                         { userGameSelectionId: 199, userId: 1, gameId: 58, bet: 0, pickTeamId: 1 },
                         { userGameSelectionId: 200, userId: 1, gameId: 59, bet: 0, pickTeamId: 1 },
                         { userGameSelectionId: 201, userId: 1, gameId: 60, bet: 0, pickTeamId: 1 },
                         { userGameSelectionId: 202, userId: 1, gameId: 61, bet: 0, pickTeamId: 1 }
        ]
    });
}