/// <reference path="../Selection/selectionViewModel.js"/>

pavlov.specify("selectionViewModel tests", function () {

    describe("when a populated data variable is passed", function () {
        var data = {};
        before(function () {
            data = {};
            data.maxBetForAnyOneGame = 1;
            data.minSpentPointsForAnyOneWeek = 2;
            data.extraPointFactorPerBetOverMin = 3;
            data.possibleBets = 4;
            data.placedBets = 5;
            data.bonusPoints = 6;
            data.spentPoints = 7;
            data.gameRows = [
                { userGameSelection: { userGameSelectionId: 1 }, selectionPicker: { selectionValue: "a" }, betPickers: [{ betValue: 1 }, { betValue: 2 }, { betValue: 3 }] },
                { userGameSelection: { userGameSelectionId: 2 }, selectionPicker: { selectionValue: "b" }, betPickers: [{ betValue: 4 }, { betValue: 5 }, { betValue: 6 }] },
                { userGameSelection: { userGameSelectionId: 3 }, selectionPicker: { selectionValue: "c" }, betPickers: [{ betValue: 7 }, { betValue: 8 }, { betValue: 9 }] }
            ],
            data.gameRowsHaveBeenSaved = true;
            data.selectionDisabledForThisGameFilter = false;
        });
        after(function () {
            data = null;
        });

        it("it should populate correctly", function () {
            var vm = new selectionViewModel(data);
            assert(vm.MAXBETFORANYONEGAME).equals(1);
            assert(vm.MINSPENTPOINTSFORANYONEWEEK).equals(2);
            assert(vm.EXTRAPOINTFACTORPERBETOVERMIN).equals(3);
            assert(vm.possibleBets()).equals(4);
            assert(vm.placedBets()).equals(5);
            assert(vm.bonusPoints()).equals(6);
            assert(vm.spentPoints()).equals(7);
            assert(vm.gameRows.gameRows.length).equals(3);
            assert(vm.gameRows.gameRows[0].userGameSelection.userGameSelectionId).equals(1);
            assert(vm.gameRows.gameRows[0].selectionPicker.selectionValue()).equals("a");
            assert(vm.gameRows.gameRows[0].betPickers.length).equals(3);
            assert(vm.gameRows.gameRows[0].betPickers[0].betValue).equals(1);
            assert(vm.gameRows.gameRows[0].betPickers[1].betValue).equals(2);
            assert(vm.gameRows.gameRows[0].betPickers[2].betValue).equals(3);
            assert(vm.gameRows.gameRows[1].userGameSelection.userGameSelectionId).equals(2);
            assert(vm.gameRows.gameRows[1].selectionPicker.selectionValue()).equals("b");
            assert(vm.gameRows.gameRows[1].betPickers.length).equals(3);
            assert(vm.gameRows.gameRows[1].betPickers[0].betValue).equals(4);
            assert(vm.gameRows.gameRows[1].betPickers[1].betValue).equals(5);
            assert(vm.gameRows.gameRows[1].betPickers[2].betValue).equals(6);
            assert(vm.gameRows.gameRows[2].userGameSelection.userGameSelectionId).equals(3);
            assert(vm.gameRows.gameRows[2].selectionPicker.selectionValue()).equals("c");
            assert(vm.gameRows.gameRows[2].betPickers.length).equals(3);
            assert(vm.gameRows.gameRows[2].betPickers[0].betValue).equals(7);
            assert(vm.gameRows.gameRows[2].betPickers[1].betValue).equals(8);
            assert(vm.gameRows.gameRows[2].betPickers[2].betValue).equals(9);
            assert(vm.gameRowsHaveBeenSaved).equals(true);
            assert(vm.selectionDisabledForThisGameFilter).equals(false);
        });
    });

    describe("initializeMinMaxBet tests", function () {
        var vm = {};
        before(function () {
            vm = {};
            var data = {};
            data.maxBetForAnyOneGame = 5;
            data.minSpentPointsForAnyOneWeek = 6;
            data.extraPointFactorPerBetOverMin = 1;
            data.possibleBets = 16;
            data.placedBets = 0;
            data.bonusPoints = 0;
            data.spentPoints = 0;
            data.gameRows = [];
            data.gameRowsHaveBeenSaved = false;
            data.selectionDisabledForThisGameFilter = false;
            vm = new selectionViewModel(data);
        });
        after(function () {
            vm = null;
        });
        describe("when bet picker is undefined", function () {
            it("should return error", function () {
                var userGameSelection;
                try {
                    vm.initializeMinMaxBet(userGameSelection);
                    assert(false).equals(true, "expected an error to be thrown");
                } catch (err) {
                    assert(err.message).equals("userGameSelection passed to initializeMinMaxBet is undefined");
                };
            });
        });
        describe("when bet picker is null", function () {
            it("should return error", function () {
                var userGameSelection = null;
                try {
                    vm.initializeMinMaxBet(userGameSelection);
                    assert(false).equals(true, "expected an error to be thrown");
                } catch (err) {
                    assert(err.message).equals("userGameSelection passed to initializeMinMaxBet is null");
                };
            });
        });
        describe("when bet is 0", function () {
            it("should return Mix/Max = 0", function () {
                var userGameSelection = { "bet": 0, "minGameBet": -1, "maxGameBet": -1 };
                vm.initializeMinMaxBet(userGameSelection);
                assert(userGameSelection.bet).equals(0, "bet");
                assert(userGameSelection.minGameBet).equals(0, "minGameBet");
                assert(userGameSelection.maxGameBet).equals(0, "maxGameBet");
            });
        });
        describe("when bet is 1", function () {
            it("should return Mix/Max = 1", function () {
                var userGameSelection = { "bet": 1, "minGameBet": -1, "maxGameBet": -1 };
                vm.initializeMinMaxBet(userGameSelection);
                assert(userGameSelection.bet).equals(1, "bet");
                assert(userGameSelection.minGameBet).equals(1, "minGameBet");
                assert(userGameSelection.maxGameBet).equals(1, "maxGameBet");
            });
        });
        describe("when bet is greater than 1", function () {
            it("should return Mix/Max = 1", function () {
                var userGameSelection = { "bet": 5, "minGameBet": -1, "maxGameBet": -1 };
                vm.initializeMinMaxBet(userGameSelection);
                assert(userGameSelection.bet).equals(5, "bet");
                assert(userGameSelection.minGameBet).equals(1, "minGameBet");
                assert(userGameSelection.maxGameBet).equals(1, "maxGameBet");
            });
        });

    });

    describe("initializeBetPicker tests", function () {
        var data = {};
        before(function () {
            data = {};
            data.maxBetForAnyOneGame = 5;
            data.minSpentPointsForAnyOneWeek = 6;
            data.extraPointFactorPerBetOverMin = 1;
            data.possibleBets = 16;
            data.placedBets = 0;
            data.bonusPoints = 0;
            data.spentPoints = 0;
        });
        after(function () {
            data = null;
        });
        describe("when in not expected state (bet = 0)", function () {
            it("should throw an error", function () {

                data.gameRowsHaveBeenSaved = false;
                data.selectionDisabledForThisGameFilter = false;
                data.gameRows = [
                    {
                        userGameSelection: { bet: 0, saved: false },
                        selectionPicker: { disabled: true, toggle: false, selectionValue: null },
                        betPickers: [
                            { disabled: true, toggled: false, betValue: 1 },
                            { disabled: true, toggled: false, betValue: 2 },
                            { disabled: true, toggled: false, betValue: 3 },
                            { disabled: true, toggled: false, betValue: 4 },
                            { disabled: true, toggled: false, betValue: 5 }
                        ]
                    }
                ];
                var vm = new selectionViewModel(data);
                var bet = vm.gameRows.gameRows[0].userGameSelection.bet;
                var betPickers = vm.gameRows.gameRows[0].betPickers;
                var selectionDisabled = vm.gameRowsHaveBeenSaved || vm.selectionDisabledForThisGameFilter || vm.gameRows.gameRows[0].userGameSelection.saved;

                try {
                    vm.initializeBetPicker(vm.gameRows.gameRows[0].userGameSelection.bet, betPickers, selectionDisabled);
                    assert(false).equals(true, "expected an error to be thrown");
                } catch (err) {
                    assert(err.message).equals("initializeBetPicker must have a bet = 1; bet:0");
                };
            });
        });
        describe("when in not expected state (bet > 1)", function () {
            it("should throw an error", function () {

                data.gameRowsHaveBeenSaved = false;
                data.selectionDisabledForThisGameFilter = false;
                data.gameRows = [
                    {
                        userGameSelection: { bet: 3, saved: false },
                        selectionPicker: { disabled: true, toggle: false, selectionValue: null },
                        betPickers: [
                            { disabled: true, toggled: false, betValue: 1 },
                            { disabled: true, toggled: false, betValue: 2 },
                            { disabled: true, toggled: false, betValue: 3 },
                            { disabled: true, toggled: false, betValue: 4 },
                            { disabled: true, toggled: false, betValue: 5 }
                        ]
                    }
                ];
                var vm = new selectionViewModel(data);
                var bet = vm.gameRows.gameRows[0].userGameSelection.bet;
                var betPickers = vm.gameRows.gameRows[0].betPickers;
                var selectionDisabled = vm.gameRowsHaveBeenSaved || vm.selectionDisabledForThisGameFilter || vm.gameRows.gameRows[0].userGameSelection.saved;

                try {
                    vm.initializeBetPicker(vm.gameRows.gameRows[0].userGameSelection.bet, betPickers, selectionDisabled);
                    assert(false).equals(true, "expected an error to be thrown");
                } catch (err) {
                    assert(err.message).equals("initializeBetPicker must have a bet = 1; bet:3");
                };
            });
        });
        describe("when in not expected state (a betpicker is toggled)", function () {
            it("should throw an error", function () {

                data.gameRowsHaveBeenSaved = false;
                data.selectionDisabledForThisGameFilter = false;
                data.gameRows = [
                    {
                        userGameSelection: { bet: 1, saved: false },
                        selectionPicker: { disabled: true, toggle: false, selectionValue: null },
                        betPickers: [
                            { disabled: true, toggled: false, betValue: 1 },
                            { disabled: true, toggled: false, betValue: 2 },
                            { disabled: true, toggled: true, betValue: 3 },
                            { disabled: true, toggled: false, betValue: 4 },
                            { disabled: true, toggled: false, betValue: 5 }
                        ]
                    }
                ];
                var vm = new selectionViewModel(data);
                var bet = vm.gameRows.gameRows[0].userGameSelection.bet;
                var betPickers = vm.gameRows.gameRows[0].betPickers;
                var selectionDisabled = vm.gameRowsHaveBeenSaved || vm.selectionDisabledForThisGameFilter || vm.gameRows.gameRows[0].userGameSelection.saved;

                try {
                    vm.initializeBetPicker(vm.gameRows.gameRows[0].userGameSelection.bet, betPickers, selectionDisabled);
                    assert(false).equals(true, "expected an error to be thrown");
                } catch (err) {
                    assert(err.message).equals("initializeBetPicker cannot have a betPicker with toggled = true; betPickerIndex:2");
                };
            });
        });
        describe("when in not expected state (a betpicker is enabled)", function () {
            it("should throw an error", function () {

                data.gameRowsHaveBeenSaved = false;
                data.selectionDisabledForThisGameFilter = false;
                data.gameRows = [
                    {
                        userGameSelection: { bet: 1, saved: false },
                        selectionPicker: { disabled: true, toggle: false, selectionValue: null },
                        betPickers: [
                            { disabled: true, toggled: false, betValue: 1 },
                            { disabled: true, toggled: false, betValue: 2 },
                            { disabled: true, toggled: false, betValue: 3 },
                            { disabled: false, toggled: false, betValue: 4 },
                            { disabled: true, toggled: false, betValue: 5 }
                        ]
                    }
                ];
                var vm = new selectionViewModel(data);
                var bet = vm.gameRows.gameRows[0].userGameSelection.bet;
                var betPickers = vm.gameRows.gameRows[0].betPickers;
                var selectionDisabled = vm.gameRowsHaveBeenSaved || vm.selectionDisabledForThisGameFilter || vm.gameRows.gameRows[0].userGameSelection.saved;

                try {
                    vm.initializeBetPicker(vm.gameRows.gameRows[0].userGameSelection.bet, betPickers, selectionDisabled);
                    assert(false).equals(true, "expected an error to be thrown");
                } catch (err) {
                    assert(err.message).equals("initializeBetPicker cannot have a betPicker with disabled = false; betPickerIndex:3");
                };
            });
        });
        describe("when in expected state and selectionDisabled is false", function () {
            it("should return bet picker[0] toggled/enabled, rest still disabled/not toggled", function () {

                data.gameRowsHaveBeenSaved = false;
                data.selectionDisabledForThisGameFilter = false;
                data.gameRows = [
                    {
                        userGameSelection: { bet: 1, saved: false },
                        selectionPicker: { disabled: true, toggle: false, selectionValue: null },
                        betPickers: [
                            { disabled: true, toggled: false, betValue: 1 },
                            { disabled: true, toggled: false, betValue: 2 },
                            { disabled: true, toggled: false, betValue: 3 },
                            { disabled: true, toggled: false, betValue: 4 },
                            { disabled: true, toggled: false, betValue: 5 }
                        ]
                    }
                ];
                var vm = new selectionViewModel(data);
                var bet = vm.gameRows.gameRows[0].userGameSelection.bet;
                var betPickers = vm.gameRows.gameRows[0].betPickers;
                var selectionDisabled = vm.gameRowsHaveBeenSaved || vm.selectionDisabledForThisGameFilter || vm.gameRows.gameRows[0].userGameSelection.saved;

                vm.initializeBetPicker(vm.gameRows.gameRows[0].userGameSelection.bet, betPickers, selectionDisabled);

                assert(vm.gameRows.gameRows[0].betPickers[0].disabled()).equals(false);
                assert(vm.gameRows.gameRows[0].betPickers[0].toggled()).equals(true);
                assert(vm.gameRows.gameRows[0].betPickers[0].betValue).equals(1);
                assert(vm.gameRows.gameRows[0].betPickers[1].disabled()).equals(true);
                assert(vm.gameRows.gameRows[0].betPickers[1].toggled()).equals(false);
                assert(vm.gameRows.gameRows[0].betPickers[1].betValue).equals(2);
                assert(vm.gameRows.gameRows[0].betPickers[2].disabled()).equals(true);
                assert(vm.gameRows.gameRows[0].betPickers[2].toggled()).equals(false);
                assert(vm.gameRows.gameRows[0].betPickers[2].betValue).equals(3);
                assert(vm.gameRows.gameRows[0].betPickers[3].disabled()).equals(true);
                assert(vm.gameRows.gameRows[0].betPickers[3].toggled()).equals(false);
                assert(vm.gameRows.gameRows[0].betPickers[3].betValue).equals(4);
                assert(vm.gameRows.gameRows[0].betPickers[4].disabled()).equals(true);
                assert(vm.gameRows.gameRows[0].betPickers[4].toggled()).equals(false);
                assert(vm.gameRows.gameRows[0].betPickers[4].betValue).equals(5);
            });
        });
        describe("when in expected state and selectionDisabled is true (gameRowsHaveBeenSaved=true)", function () {
            it("should return bet picker[0] toggled/disabled, rest still disabled/not toggled", function () {

                data.gameRowsHaveBeenSaved = true;
                data.selectionDisabledForThisGameFilter = false;
                data.gameRows = [
                    {
                        userGameSelection: { bet: 1, saved: false },
                        selectionPicker: { disabled: true, toggle: false, selectionValue: null },
                        betPickers: [
                            { disabled: true, toggled: false, betValue: 1 },
                            { disabled: true, toggled: false, betValue: 2 },
                            { disabled: true, toggled: false, betValue: 3 },
                            { disabled: true, toggled: false, betValue: 4 },
                            { disabled: true, toggled: false, betValue: 5 }
                        ]
                    }
                ];
                var vm = new selectionViewModel(data);
                var bet = vm.gameRows.gameRows[0].userGameSelection.bet;
                var betPickers = vm.gameRows.gameRows[0].betPickers;
                var selectionDisabled = vm.gameRowsHaveBeenSaved || vm.selectionDisabledForThisGameFilter || vm.gameRows.gameRows[0].userGameSelection.saved;

                vm.initializeBetPicker(vm.gameRows.gameRows[0].userGameSelection.bet, betPickers, selectionDisabled);

                assert(vm.gameRows.gameRows[0].betPickers[0].disabled()).equals(true);
                assert(vm.gameRows.gameRows[0].betPickers[0].toggled()).equals(true);
                assert(vm.gameRows.gameRows[0].betPickers[0].betValue).equals(1);
                assert(vm.gameRows.gameRows[0].betPickers[1].disabled()).equals(true);
                assert(vm.gameRows.gameRows[0].betPickers[1].toggled()).equals(false);
                assert(vm.gameRows.gameRows[0].betPickers[1].betValue).equals(2);
                assert(vm.gameRows.gameRows[0].betPickers[2].disabled()).equals(true);
                assert(vm.gameRows.gameRows[0].betPickers[2].toggled()).equals(false);
                assert(vm.gameRows.gameRows[0].betPickers[2].betValue).equals(3);
                assert(vm.gameRows.gameRows[0].betPickers[3].disabled()).equals(true);
                assert(vm.gameRows.gameRows[0].betPickers[3].toggled()).equals(false);
                assert(vm.gameRows.gameRows[0].betPickers[3].betValue).equals(4);
                assert(vm.gameRows.gameRows[0].betPickers[4].disabled()).equals(true);
                assert(vm.gameRows.gameRows[0].betPickers[4].toggled()).equals(false);
                assert(vm.gameRows.gameRows[0].betPickers[4].betValue).equals(5);
            });
        });
        describe("when in expected state and selectionDisabled is true (selectionDisabledForThisGameFilter=true)", function () {
            it("should return bet picker[0] toggled/disabled, rest still disabled/not toggled", function () {

                data.gameRowsHaveBeenSaved = false;
                data.selectionDisabledForThisGameFilter = true;
                data.gameRows = [
                    {
                        userGameSelection: { bet: 1, saved: false },
                        selectionPicker: { disabled: true, toggle: false, selectionValue: null },
                        betPickers: [
                            { disabled: true, toggled: false, betValue: 1 },
                            { disabled: true, toggled: false, betValue: 2 },
                            { disabled: true, toggled: false, betValue: 3 },
                            { disabled: true, toggled: false, betValue: 4 },
                            { disabled: true, toggled: false, betValue: 5 }
                        ]
                    }
                ];
                var vm = new selectionViewModel(data);
                var bet = vm.gameRows.gameRows[0].userGameSelection.bet;
                var betPickers = vm.gameRows.gameRows[0].betPickers;
                var selectionDisabled = vm.gameRowsHaveBeenSaved || vm.selectionDisabledForThisGameFilter || vm.gameRows.gameRows[0].userGameSelection.saved;

                vm.initializeBetPicker(vm.gameRows.gameRows[0].userGameSelection.bet, betPickers, selectionDisabled);

                assert(vm.gameRows.gameRows[0].betPickers[0].disabled()).equals(true);
                assert(vm.gameRows.gameRows[0].betPickers[0].toggled()).equals(true);
                assert(vm.gameRows.gameRows[0].betPickers[0].betValue).equals(1);
                assert(vm.gameRows.gameRows[0].betPickers[1].disabled()).equals(true);
                assert(vm.gameRows.gameRows[0].betPickers[1].toggled()).equals(false);
                assert(vm.gameRows.gameRows[0].betPickers[1].betValue).equals(2);
                assert(vm.gameRows.gameRows[0].betPickers[2].disabled()).equals(true);
                assert(vm.gameRows.gameRows[0].betPickers[2].toggled()).equals(false);
                assert(vm.gameRows.gameRows[0].betPickers[2].betValue).equals(3);
                assert(vm.gameRows.gameRows[0].betPickers[3].disabled()).equals(true);
                assert(vm.gameRows.gameRows[0].betPickers[3].toggled()).equals(false);
                assert(vm.gameRows.gameRows[0].betPickers[3].betValue).equals(4);
                assert(vm.gameRows.gameRows[0].betPickers[4].disabled()).equals(true);
                assert(vm.gameRows.gameRows[0].betPickers[4].toggled()).equals(false);
                assert(vm.gameRows.gameRows[0].betPickers[4].betValue).equals(5);
            });
        });
        describe("when in expected state and selectionDisabled is true (saved=true)", function () {
            it("should return bet picker[0] toggled/disabled, rest still disabled/not toggled", function () {

                data.gameRowsHaveBeenSaved = false;
                data.selectionDisabledForThisGameFilter = false;
                data.gameRows = [
                    {
                        userGameSelection: { bet: 1, saved: true },
                        selectionPicker: { disabled: true, toggle: false, selectionValue: null },
                        betPickers: [
                            { disabled: true, toggled: false, betValue: 1 },
                            { disabled: true, toggled: false, betValue: 2 },
                            { disabled: true, toggled: false, betValue: 3 },
                            { disabled: true, toggled: false, betValue: 4 },
                            { disabled: true, toggled: false, betValue: 5 }
                        ]
                    }
                ];
                var vm = new selectionViewModel(data);
                var bet = vm.gameRows.gameRows[0].userGameSelection.bet;
                var betPickers = vm.gameRows.gameRows[0].betPickers;
                var selectionDisabled = vm.gameRowsHaveBeenSaved || vm.selectionDisabledForThisGameFilter || vm.gameRows.gameRows[0].userGameSelection.saved;

                vm.initializeBetPicker(vm.gameRows.gameRows[0].userGameSelection.bet, betPickers, selectionDisabled);

                assert(vm.gameRows.gameRows[0].betPickers[0].disabled()).equals(true);
                assert(vm.gameRows.gameRows[0].betPickers[0].toggled()).equals(true);
                assert(vm.gameRows.gameRows[0].betPickers[0].betValue).equals(1);
                assert(vm.gameRows.gameRows[0].betPickers[1].disabled()).equals(true);
                assert(vm.gameRows.gameRows[0].betPickers[1].toggled()).equals(false);
                assert(vm.gameRows.gameRows[0].betPickers[1].betValue).equals(2);
                assert(vm.gameRows.gameRows[0].betPickers[2].disabled()).equals(true);
                assert(vm.gameRows.gameRows[0].betPickers[2].toggled()).equals(false);
                assert(vm.gameRows.gameRows[0].betPickers[2].betValue).equals(3);
                assert(vm.gameRows.gameRows[0].betPickers[3].disabled()).equals(true);
                assert(vm.gameRows.gameRows[0].betPickers[3].toggled()).equals(false);
                assert(vm.gameRows.gameRows[0].betPickers[3].betValue).equals(4);
                assert(vm.gameRows.gameRows[0].betPickers[4].disabled()).equals(true);
                assert(vm.gameRows.gameRows[0].betPickers[4].toggled()).equals(false);
                assert(vm.gameRows.gameRows[0].betPickers[4].betValue).equals(5);
            });
        });
        describe("when in expected state and selectionDisabled is true (gameRowsHaveBeenSaved=true & selectionDisabledForThisGameFilter=true)", function () {
            it("should return bet picker[0] toggled/disabled, rest still disabled/not toggled", function () {

                data.gameRowsHaveBeenSaved = true;
                data.selectionDisabledForThisGameFilter = true;
                data.gameRows = [
                    {
                        userGameSelection: { bet: 1, saved: false },
                        selectionPicker: { disabled: true, toggle: false, selectionValue: null },
                        betPickers: [
                            { disabled: true, toggled: false, betValue: 1 },
                            { disabled: true, toggled: false, betValue: 2 },
                            { disabled: true, toggled: false, betValue: 3 },
                            { disabled: true, toggled: false, betValue: 4 },
                            { disabled: true, toggled: false, betValue: 5 }
                        ]
                    }
                ];
                var vm = new selectionViewModel(data);
                var bet = vm.gameRows.gameRows[0].userGameSelection.bet;
                var betPickers = vm.gameRows.gameRows[0].betPickers;
                var selectionDisabled = vm.gameRowsHaveBeenSaved || vm.selectionDisabledForThisGameFilter || vm.gameRows.gameRows[0].userGameSelection.saved;

                vm.initializeBetPicker(vm.gameRows.gameRows[0].userGameSelection.bet, betPickers, selectionDisabled);

                assert(vm.gameRows.gameRows[0].betPickers[0].disabled()).equals(true);
                assert(vm.gameRows.gameRows[0].betPickers[0].toggled()).equals(true);
                assert(vm.gameRows.gameRows[0].betPickers[0].betValue).equals(1);
                assert(vm.gameRows.gameRows[0].betPickers[1].disabled()).equals(true);
                assert(vm.gameRows.gameRows[0].betPickers[1].toggled()).equals(false);
                assert(vm.gameRows.gameRows[0].betPickers[1].betValue).equals(2);
                assert(vm.gameRows.gameRows[0].betPickers[2].disabled()).equals(true);
                assert(vm.gameRows.gameRows[0].betPickers[2].toggled()).equals(false);
                assert(vm.gameRows.gameRows[0].betPickers[2].betValue).equals(3);
                assert(vm.gameRows.gameRows[0].betPickers[3].disabled()).equals(true);
                assert(vm.gameRows.gameRows[0].betPickers[3].toggled()).equals(false);
                assert(vm.gameRows.gameRows[0].betPickers[3].betValue).equals(4);
                assert(vm.gameRows.gameRows[0].betPickers[4].disabled()).equals(true);
                assert(vm.gameRows.gameRows[0].betPickers[4].toggled()).equals(false);
                assert(vm.gameRows.gameRows[0].betPickers[4].betValue).equals(5);
            });
        });
        describe("when in expected state and selectionDisabled is true (gameRowsHaveBeenSaved=true & saved=true)", function () {
            it("should return bet picker[0] toggled/disabled, rest still disabled/not toggled", function () {

                data.gameRowsHaveBeenSaved = true;
                data.selectionDisabledForThisGameFilter = false;
                data.gameRows = [
                    {
                        userGameSelection: { bet: 1, saved: true },
                        selectionPicker: { disabled: true, toggle: false, selectionValue: null },
                        betPickers: [
                            { disabled: true, toggled: false, betValue: 1 },
                            { disabled: true, toggled: false, betValue: 2 },
                            { disabled: true, toggled: false, betValue: 3 },
                            { disabled: true, toggled: false, betValue: 4 },
                            { disabled: true, toggled: false, betValue: 5 }
                        ]
                    }
                ];
                var vm = new selectionViewModel(data);
                var bet = vm.gameRows.gameRows[0].userGameSelection.bet;
                var betPickers = vm.gameRows.gameRows[0].betPickers;
                var selectionDisabled = vm.gameRowsHaveBeenSaved || vm.selectionDisabledForThisGameFilter || vm.gameRows.gameRows[0].userGameSelection.saved;

                vm.initializeBetPicker(vm.gameRows.gameRows[0].userGameSelection.bet, betPickers, selectionDisabled);

                assert(vm.gameRows.gameRows[0].betPickers[0].disabled()).equals(true);
                assert(vm.gameRows.gameRows[0].betPickers[0].toggled()).equals(true);
                assert(vm.gameRows.gameRows[0].betPickers[0].betValue).equals(1);
                assert(vm.gameRows.gameRows[0].betPickers[1].disabled()).equals(true);
                assert(vm.gameRows.gameRows[0].betPickers[1].toggled()).equals(false);
                assert(vm.gameRows.gameRows[0].betPickers[1].betValue).equals(2);
                assert(vm.gameRows.gameRows[0].betPickers[2].disabled()).equals(true);
                assert(vm.gameRows.gameRows[0].betPickers[2].toggled()).equals(false);
                assert(vm.gameRows.gameRows[0].betPickers[2].betValue).equals(3);
                assert(vm.gameRows.gameRows[0].betPickers[3].disabled()).equals(true);
                assert(vm.gameRows.gameRows[0].betPickers[3].toggled()).equals(false);
                assert(vm.gameRows.gameRows[0].betPickers[3].betValue).equals(4);
                assert(vm.gameRows.gameRows[0].betPickers[4].disabled()).equals(true);
                assert(vm.gameRows.gameRows[0].betPickers[4].toggled()).equals(false);
                assert(vm.gameRows.gameRows[0].betPickers[4].betValue).equals(5);
            });
        });
        describe("when in expected state and selectionDisabled is true (selectionDisabledForThisGameFilter=true & saved=true)", function () {
            it("should return bet picker[0] toggled/disabled, rest still disabled/not toggled", function () {

                data.gameRowsHaveBeenSaved = false;
                data.selectionDisabledForThisGameFilter = true;
                data.gameRows = [
                    {
                        userGameSelection: { bet: 1, saved: true },
                        selectionPicker: { disabled: true, toggle: false, selectionValue: null },
                        betPickers: [
                            { disabled: true, toggled: false, betValue: 1 },
                            { disabled: true, toggled: false, betValue: 2 },
                            { disabled: true, toggled: false, betValue: 3 },
                            { disabled: true, toggled: false, betValue: 4 },
                            { disabled: true, toggled: false, betValue: 5 }
                        ]
                    }
                ];
                var vm = new selectionViewModel(data);
                var bet = vm.gameRows.gameRows[0].userGameSelection.bet;
                var betPickers = vm.gameRows.gameRows[0].betPickers;
                var selectionDisabled = vm.gameRowsHaveBeenSaved || vm.selectionDisabledForThisGameFilter || vm.gameRows.gameRows[0].userGameSelection.saved;

                vm.initializeBetPicker(vm.gameRows.gameRows[0].userGameSelection.bet, betPickers, selectionDisabled);

                assert(vm.gameRows.gameRows[0].betPickers[0].disabled()).equals(true);
                assert(vm.gameRows.gameRows[0].betPickers[0].toggled()).equals(true);
                assert(vm.gameRows.gameRows[0].betPickers[0].betValue).equals(1);
                assert(vm.gameRows.gameRows[0].betPickers[1].disabled()).equals(true);
                assert(vm.gameRows.gameRows[0].betPickers[1].toggled()).equals(false);
                assert(vm.gameRows.gameRows[0].betPickers[1].betValue).equals(2);
                assert(vm.gameRows.gameRows[0].betPickers[2].disabled()).equals(true);
                assert(vm.gameRows.gameRows[0].betPickers[2].toggled()).equals(false);
                assert(vm.gameRows.gameRows[0].betPickers[2].betValue).equals(3);
                assert(vm.gameRows.gameRows[0].betPickers[3].disabled()).equals(true);
                assert(vm.gameRows.gameRows[0].betPickers[3].toggled()).equals(false);
                assert(vm.gameRows.gameRows[0].betPickers[3].betValue).equals(4);
                assert(vm.gameRows.gameRows[0].betPickers[4].disabled()).equals(true);
                assert(vm.gameRows.gameRows[0].betPickers[4].toggled()).equals(false);
                assert(vm.gameRows.gameRows[0].betPickers[4].betValue).equals(5);
            });
        });
        describe("when in expected state and selectionDisabled is true (gameRowsHaveBeenSaved=true & selectionDisabledForThisGameFilter=true & saved=true)", function () {
            it("should return bet picker[0] toggled/disabled, rest still disabled/not toggled", function () {

                data.gameRowsHaveBeenSaved = true;
                data.selectionDisabledForThisGameFilter = true;
                data.gameRows = [
                    {
                        userGameSelection: { bet: 1, saved: true },
                        selectionPicker: { disabled: true, toggle: false, selectionValue: null },
                        betPickers: [
                            { disabled: true, toggled: false, betValue: 1 },
                            { disabled: true, toggled: false, betValue: 2 },
                            { disabled: true, toggled: false, betValue: 3 },
                            { disabled: true, toggled: false, betValue: 4 },
                            { disabled: true, toggled: false, betValue: 5 }
                        ]
                    }
                ];
                var vm = new selectionViewModel(data);
                var bet = vm.gameRows.gameRows[0].userGameSelection.bet;
                var betPickers = vm.gameRows.gameRows[0].betPickers;
                var selectionDisabled = vm.gameRowsHaveBeenSaved || vm.selectionDisabledForThisGameFilter || vm.gameRows.gameRows[0].userGameSelection.saved;

                vm.initializeBetPicker(vm.gameRows.gameRows[0].userGameSelection.bet, betPickers, selectionDisabled);

                assert(vm.gameRows.gameRows[0].betPickers[0].disabled()).equals(true);
                assert(vm.gameRows.gameRows[0].betPickers[0].toggled()).equals(true);
                assert(vm.gameRows.gameRows[0].betPickers[0].betValue).equals(1);
                assert(vm.gameRows.gameRows[0].betPickers[1].disabled()).equals(true);
                assert(vm.gameRows.gameRows[0].betPickers[1].toggled()).equals(false);
                assert(vm.gameRows.gameRows[0].betPickers[1].betValue).equals(2);
                assert(vm.gameRows.gameRows[0].betPickers[2].disabled()).equals(true);
                assert(vm.gameRows.gameRows[0].betPickers[2].toggled()).equals(false);
                assert(vm.gameRows.gameRows[0].betPickers[2].betValue).equals(3);
                assert(vm.gameRows.gameRows[0].betPickers[3].disabled()).equals(true);
                assert(vm.gameRows.gameRows[0].betPickers[3].toggled()).equals(false);
                assert(vm.gameRows.gameRows[0].betPickers[3].betValue).equals(4);
                assert(vm.gameRows.gameRows[0].betPickers[4].disabled()).equals(true);
                assert(vm.gameRows.gameRows[0].betPickers[4].toggled()).equals(false);
                assert(vm.gameRows.gameRows[0].betPickers[4].betValue).equals(5);
            });
        });
    });

    describe("disableBetPicker tests", function () {
        var vm = {};
        before(function () {
            vm = {};
            var data = {};
            data.maxBetForAnyOneGame = 5;
            data.minSpentPointsForAnyOneWeek = 6;
            data.extraPointFactorPerBetOverMin = 1;
            data.possibleBets = 16;
            data.placedBets = 0;
            data.bonusPoints = 0;
            data.spentPoints = 0;
            data.gameRowsHaveBeenSaved = false;
            data.selectionDisabledForThisGameFilter = false;
            data.gameRows = [
                {
                    userGameSelection: { bet: 0, saved: false },
                    selectionPicker: { disabled: true, toggle: false, selectionValue: null },
                    betPickers: [
                        { disabled: true, toggled: false, betValue: 1 },
                        { disabled: true, toggled: false, betValue: 2 },
                        { disabled: true, toggled: false, betValue: 3 },
                        { disabled: true, toggled: false, betValue: 4 },
                        { disabled: true, toggled: false, betValue: 5 }
                    ]
                }
            ];
            vm = new selectionViewModel(data);
        });
        after(function () {
            vm = null;
        });
        describe("when bet picker is undefined", function () {
            it("should return error", function () {
                delete vm.gameRows.gameRows[0].betPickers[4];

                try {
                    vm.disableBetPicker(vm.gameRows.gameRows[0].betPickers[4]);
                    assert(false).equals(true, "expected an error to be thrown");
                } catch (err) {
                    assert(err.message).equals("betPicker passed to disableBetPicker is undefined");
                };
            });
        });
        describe("when bet picker is null", function () {
            it("should return error", function () {
                vm.gameRows.gameRows[0].betPickers[4] = null;

                try {
                    vm.disableBetPicker(vm.gameRows.gameRows[0].betPickers[4]);
                    assert(false).equals(true, "expected an error to be thrown");
                } catch (err) {
                    assert(err.message).equals("betPicker passed to disableBetPicker is null");
                };
            });
        });
        describe("when bet picker is disabled/not toggled", function () {
            it("should return disabled/not toggled", function () {
                vm.gameRows.gameRows[0].betPickers[0].disabled(true);
                vm.gameRows.gameRows[0].betPickers[0].toggled(false);

                vm.disableBetPicker(vm.gameRows.gameRows[0].betPickers[0]);

                assert(vm.gameRows.gameRows[0].betPickers[0].disabled()).equals(true);
                assert(vm.gameRows.gameRows[0].betPickers[0].toggled()).equals(false);
            });
        });
        describe("when bet picker is enabled/not toggled", function () {
            it("should return disabled/not toggled", function () {
                vm.gameRows.gameRows[0].betPickers[0].disabled(false);
                vm.gameRows.gameRows[0].betPickers[0].toggled(false);

                vm.disableBetPicker(vm.gameRows.gameRows[0].betPickers[0]);

                assert(vm.gameRows.gameRows[0].betPickers[0].disabled()).equals(true);
                assert(vm.gameRows.gameRows[0].betPickers[0].toggled()).equals(false);
            });
        });
        describe("when bet picker is enabled/toggled", function () {
            it("should return disabled/not toggled", function () {
                vm.gameRows.gameRows[0].betPickers[0].disabled(false);
                vm.gameRows.gameRows[0].betPickers[0].toggled(true);

                vm.disableBetPicker(vm.gameRows.gameRows[0].betPickers[0]);

                assert(vm.gameRows.gameRows[0].betPickers[0].disabled()).equals(true);
                assert(vm.gameRows.gameRows[0].betPickers[0].toggled()).equals(false);
            });
        });
        describe("when bet picker is disabled/toggled", function () {
            it("should return disabled/not toggled", function () {
                vm.gameRows.gameRows[0].betPickers[0].disabled(true);
                vm.gameRows.gameRows[0].betPickers[0].toggled(true);

                vm.disableBetPicker(vm.gameRows.gameRows[0].betPickers[0]);

                assert(vm.gameRows.gameRows[0].betPickers[0].disabled()).equals(true);
                assert(vm.gameRows.gameRows[0].betPickers[0].toggled()).equals(false);
            });
        });
    });

    describe("disableAllBetPickers tests", function () {
        var vm = {};
        before(function () {
            vm = {};
            var data = {};
            data.maxBetForAnyOneGame = 5;
            data.minSpentPointsForAnyOneWeek = 6;
            data.extraPointFactorPerBetOverMin = 1;
            data.possibleBets = 16;
            data.placedBets = 0;
            data.bonusPoints = 0;
            data.spentPoints = 0;
            data.gameRowsHaveBeenSaved = false;
            data.selectionDisabledForThisGameFilter = false;
            data.gameRows = [
                {
                    userGameSelection: { bet: 0, saved: false },
                    selectionPicker: { disabled: true, toggle: false, selectionValue: null },
                    betPickers: [
                        { disabled: true, toggled: false, betValue: 1 },
                        { disabled: true, toggled: false, betValue: 2 },
                        { disabled: true, toggled: false, betValue: 3 },
                        { disabled: true, toggled: false, betValue: 4 },
                        { disabled: true, toggled: false, betValue: 5 }
                    ]
                }
            ];
            vm = new selectionViewModel(data);
        });
        after(function () {
            vm = null;
        });

        function assertAllBetPickersAreDisabledAndNotToggled() {
            assert(vm.gameRows.gameRows[0].betPickers[0].disabled()).equals(true);
            assert(vm.gameRows.gameRows[0].betPickers[0].toggled()).equals(false);
            assert(vm.gameRows.gameRows[0].betPickers[1].disabled()).equals(true);
            assert(vm.gameRows.gameRows[0].betPickers[1].toggled()).equals(false);
            assert(vm.gameRows.gameRows[0].betPickers[2].disabled()).equals(true);
            assert(vm.gameRows.gameRows[0].betPickers[2].toggled()).equals(false);
            assert(vm.gameRows.gameRows[0].betPickers[3].disabled()).equals(true);
            assert(vm.gameRows.gameRows[0].betPickers[3].toggled()).equals(false);
            assert(vm.gameRows.gameRows[0].betPickers[4].disabled()).equals(true);
            assert(vm.gameRows.gameRows[0].betPickers[4].toggled()).equals(false);
        };

        describe("when bet pickers is undefined", function () {
            it("should return error", function () {
                delete vm.gameRows.gameRows[0].betPickers;

                try {
                    vm.disableAllBetPickers(vm.gameRows.gameRows[0].betPickers);
                    assert(false).equals(true, "expected an error to be thrown");
                } catch (err) {
                    assert(err.message).equals("betPickers passed to disableAllBetPickers is undefined");
                };
            });
        });
        describe("when bet pickers is null", function () {
            it("should return error", function () {
                vm.gameRows.gameRows[0].betPickers = null;

                try {
                    vm.disableAllBetPickers(vm.gameRows.gameRows[0].betPickers);
                    assert(false).equals(true, "expected an error to be thrown");
                } catch (err) {
                    assert(err.message).equals("betPickers passed to disableAllBetPickers is null");
                };
            });
        });
        describe("when bet pickers are all disabled/not toggled", function () {
            it("should return all disabled/not toggled", function () {

                for (var i = 0; i < vm.gameRows.gameRows[0].betPickers.length; i++) {
                    vm.gameRows.gameRows[0].betPickers[i].disabled(true);
                    vm.gameRows.gameRows[0].betPickers[i].toggled(false);
                };

                vm.disableAllBetPickers(vm.gameRows.gameRows[0].betPickers);

                assertAllBetPickersAreDisabledAndNotToggled();
            });
        });
        describe("when bet pickers are all disabled/toggled", function () {
            it("should return all disabled/not toggled", function () {

                for (var i = 0; i < vm.gameRows.gameRows[0].betPickers.length; i++) {
                    vm.gameRows.gameRows[0].betPickers[i].disabled(true);
                    vm.gameRows.gameRows[0].betPickers[i].toggled(true);
                };

                vm.disableAllBetPickers(vm.gameRows.gameRows[0].betPickers);

                assertAllBetPickersAreDisabledAndNotToggled();
            });
        });
        describe("when bet pickers are enabled/not toggled", function () {
            it("should return all disabled/not toggled", function () {
                for (var i = 0; i < vm.gameRows.gameRows[0].betPickers.length; i++) {
                    vm.gameRows.gameRows[0].betPickers[i].disabled(false);
                    vm.gameRows.gameRows[0].betPickers[i].toggled(false);
                };

                vm.disableAllBetPickers(vm.gameRows.gameRows[0].betPickers);

                assertAllBetPickersAreDisabledAndNotToggled();
            });
        });
        describe("when bet pickers are enabled/toggled", function () {
            it("should return all disabled/not toggled", function () {
                for (var i = 0; i < vm.gameRows.gameRows[0].betPickers.length; i++) {
                    vm.gameRows.gameRows[0].betPickers[i].disabled(false);
                    vm.gameRows.gameRows[0].betPickers[i].toggled(true);
                };

                vm.disableAllBetPickers(vm.gameRows.gameRows[0].betPickers);

                assertAllBetPickersAreDisabledAndNotToggled();
            });
        });
    });

    describe("enableBetPicker tests", function () {
        var vm = {};
        before(function () {
            vm = {};
            var data = {};
            data.maxBetForAnyOneGame = 5;
            data.minSpentPointsForAnyOneWeek = 6;
            data.extraPointFactorPerBetOverMin = 1;
            data.possibleBets = 16;
            data.placedBets = 0;
            data.bonusPoints = 0;
            data.spentPoints = 0;
            data.gameRowsHaveBeenSaved = false;
            data.selectionDisabledForThisGameFilter = false;
            data.gameRows = [
                {
                    userGameSelection: { bet: 0, saved: false },
                    selectionPicker: { disabled: true, toggle: false, selectionValue: null },
                    betPickers: [
                        { disabled: true, toggled: false, betValue: 1 },
                        { disabled: true, toggled: false, betValue: 2 },
                        { disabled: true, toggled: false, betValue: 3 },
                        { disabled: true, toggled: false, betValue: 4 },
                        { disabled: true, toggled: false, betValue: 5 }
                    ]
                }
            ];
            vm = new selectionViewModel(data);
        });
        after(function () {
            vm = null;
        });
        describe("when bet picker is undefined", function () {
            it("should return error", function () {
                var betPicker;
                var bet = vm.gameRows.gameRows[0].userGameSelection.bet;
                var selectionDisabled = false;
                try {
                    vm.enableBetPicker(betPicker, bet, selectionDisabled);
                    assert(false).equals(true, "expected an error to be thrown");
                } catch (err) {
                    assert(err.message).equals("betPicker passed to enableBetPicker is undefined");
                };
            });
        });
        describe("when bet picker is null", function () {
            it("should return error", function () {
                var betPicker = null;
                var bet = vm.gameRows.gameRows[0].userGameSelection.bet;
                var selectionDisabled = false;
                try {
                    vm.enableBetPicker(betPicker, bet, selectionDisabled);
                    assert(false).equals(true, "expected an error to be thrown");
                } catch (err) {
                    assert(err.message).equals("betPicker passed to enableBetPicker is null");
                };
            });
        });
        describe("when bet is undefined", function () {
            it("should return error", function () {
                var betPicker = vm.gameRows.gameRows[0].betPickers[4];
                var bet;
                var selectionDisabled = false;
                try {
                    vm.enableBetPicker(betPicker, bet, selectionDisabled);
                    assert(false).equals(true, "expected an error to be thrown");
                } catch (err) {
                    assert(err.message).equals("bet passed to enableBetPicker is undefined");
                };
            });
        });
        describe("when bet is null", function () {
            it("should return error", function () {
                var betPicker = vm.gameRows.gameRows[0].betPickers[4];
                var bet = null;
                var selectionDisabled = false;
                try {
                    vm.enableBetPicker(betPicker, bet, selectionDisabled);
                    assert(false).equals(true, "expected an error to be thrown");
                } catch (err) {
                    assert(err.message).equals("bet passed to enableBetPicker is null");
                };
            });
        });
        describe("when selectionDisabled is undefined", function () {
            it("should return error", function () {
                var betPicker = vm.gameRows.gameRows[0].betPickers[4];
                var bet = vm.gameRows.gameRows[0].userGameSelection.bet;
                var selectionDisabled;
                try {
                    vm.enableBetPicker(betPicker, bet, selectionDisabled);
                    assert(false).equals(true, "expected an error to be thrown");
                } catch (err) {
                    assert(err.message).equals("selectionDisabled passed to enableBetPicker is undefined");
                };
            });
        });
        describe("when selectionDisabled is null", function () {
            it("should return error", function () {
                var betPicker = vm.gameRows.gameRows[0].betPickers[4];
                var bet = vm.gameRows.gameRows[0].userGameSelection.bet;;
                var selectionDisabled = null;
                try {
                    vm.enableBetPicker(betPicker, bet, selectionDisabled);
                    assert(false).equals(true, "expected an error to be thrown");
                } catch (err) {
                    assert(err.message).equals("selectionDisabled passed to enableBetPicker is null");
                };
            });
        });
        describe("when bet matches and selectionDisabled false", function () {
            it("should return enabled/toggled", function () {

                //set to opposite state of the expected to prove that the function is updating to expected
                vm.gameRows.gameRows[0].betPickers[1].disabled(true);
                vm.gameRows.gameRows[0].betPickers[1].toggled(false);
                vm.gameRows.gameRows[0].betPickers[1].betValue = 2;

                var betPicker = vm.gameRows.gameRows[0].betPickers[1];
                var bet = 2;
                var selectionDisabled = false;

                vm.enableBetPicker(betPicker, bet, selectionDisabled);

                assert(vm.gameRows.gameRows[0].betPickers[1].disabled()).equals(false);
                assert(vm.gameRows.gameRows[0].betPickers[1].toggled()).equals(true);
            });
        });
        describe("when bet matches and selectionDisabled true", function () {
            it("should return disabled/toggled", function () {

                //set to opposite state of the expected to prove that the function is updating to expected
                vm.gameRows.gameRows[0].betPickers[1].disabled(false);
                vm.gameRows.gameRows[0].betPickers[1].toggled(false);
                vm.gameRows.gameRows[0].betPickers[1].betValue = 2;

                var betPicker = vm.gameRows.gameRows[0].betPickers[1];
                var bet = 2;
                var selectionDisabled = true;

                vm.enableBetPicker(betPicker, bet, selectionDisabled);

                assert(vm.gameRows.gameRows[0].betPickers[1].disabled()).equals(true);
                assert(vm.gameRows.gameRows[0].betPickers[1].toggled()).equals(true);
            });
        });
        describe("when bet does not match and selectionDisabled false", function () {
            it("should return enabled/not toggled", function () {

                //set to opposite state of the expected to prove that the function is updating to expected
                vm.gameRows.gameRows[0].betPickers[1].disabled(true);
                vm.gameRows.gameRows[0].betPickers[1].toggled(true);
                vm.gameRows.gameRows[0].betPickers[1].betValue = 2;

                var betPicker = vm.gameRows.gameRows[0].betPickers[1];
                var bet = 4;
                var selectionDisabled = false;

                vm.enableBetPicker(betPicker, bet, selectionDisabled);

                assert(vm.gameRows.gameRows[0].betPickers[1].disabled()).equals(false);
                assert(vm.gameRows.gameRows[0].betPickers[1].toggled()).equals(false);
            });
        });
        describe("when bet does not match and selectionDisabled true", function () {
            it("should return disabled/not toggled", function () {

                //set to opposite state of the expected to prove that the function is updating to expected
                vm.gameRows.gameRows[0].betPickers[1].disabled(false);
                vm.gameRows.gameRows[0].betPickers[1].toggled(true);
                vm.gameRows.gameRows[0].betPickers[1].betValue = 2;

                var betPicker = vm.gameRows.gameRows[0].betPickers[1];
                var bet = 4;
                var selectionDisabled = true;

                vm.enableBetPicker(betPicker, bet, selectionDisabled);

                assert(vm.gameRows.gameRows[0].betPickers[1].disabled()).equals(true);
                assert(vm.gameRows.gameRows[0].betPickers[1].toggled()).equals(false);
            });
        });
    });

    describe("enableAllBetPickers tests", function () {
        var vm = {};
        before(function () {
            vm = {};
            var data = {};
            data.maxBetForAnyOneGame = 5;
            data.minSpentPointsForAnyOneWeek = 6;
            data.extraPointFactorPerBetOverMin = 1;
            data.possibleBets = 16;
            data.placedBets = 0;
            data.bonusPoints = 0;
            data.spentPoints = 0;
            data.gameRowsHaveBeenSaved = false;
            data.selectionDisabledForThisGameFilter = false;
            data.gameRows = [
                {
                    userGameSelection: { bet: 0, saved: false },
                    selectionPicker: { disabled: true, toggle: false, selectionValue: null },
                    betPickers: [
                        { disabled: true, toggled: false, betValue: 1 },
                        { disabled: true, toggled: false, betValue: 2 },
                        { disabled: true, toggled: false, betValue: 3 },
                        { disabled: true, toggled: false, betValue: 4 },
                        { disabled: true, toggled: false, betValue: 5 }
                    ]
                }
            ];
            vm = new selectionViewModel(data);
        });
        after(function () {
            vm = null;
        });

        function assertAllBetPickersAreDisabledAndNotToggled(disabled) {
            assert(vm.gameRows.gameRows[0].betPickers[0].disabled()).equals(disabled);
            assert(vm.gameRows.gameRows[0].betPickers[0].toggled()).equals(false);
            assert(vm.gameRows.gameRows[0].betPickers[1].disabled()).equals(disabled);
            assert(vm.gameRows.gameRows[0].betPickers[1].toggled()).equals(false);
            assert(vm.gameRows.gameRows[0].betPickers[2].disabled()).equals(disabled);
            assert(vm.gameRows.gameRows[0].betPickers[2].toggled()).equals(true);
            assert(vm.gameRows.gameRows[0].betPickers[3].disabled()).equals(disabled);
            assert(vm.gameRows.gameRows[0].betPickers[3].toggled()).equals(false);
            assert(vm.gameRows.gameRows[0].betPickers[4].disabled()).equals(disabled);
            assert(vm.gameRows.gameRows[0].betPickers[4].toggled()).equals(false);
        };

        describe("when bet picker is undefined", function () {
            it("should return error", function () {
                var betPickers;
                var bet = vm.gameRows.gameRows[0].userGameSelection.bet;
                var selectionDisabled = false;
                try {
                    vm.enableAllBetPickers(betPickers, bet, selectionDisabled);
                    assert(false).equals(true, "expected an error to be thrown");
                } catch (err) {
                    assert(err.message).equals("betPickers passed to enableAllBetPickers is undefined");
                };
            });
        });
        describe("when bet picker is null", function () {
            it("should return error", function () {
                var betPickers = null;
                var bet = vm.gameRows.gameRows[0].userGameSelection.bet;
                var selectionDisabled = false;
                try {
                    vm.enableAllBetPickers(betPickers, bet, selectionDisabled);
                    assert(false).equals(true, "expected an error to be thrown");
                } catch (err) {
                    assert(err.message).equals("betPickers passed to enableAllBetPickers is null");
                };
            });
        });
        describe("when bet is undefined", function () {
            it("should return error", function () {
                var betPickers = vm.gameRows.gameRows[0].betPickers;
                var bet;
                var selectionDisabled = false;
                try {
                    vm.enableAllBetPickers(betPickers, bet, selectionDisabled);
                    assert(false).equals(true, "expected an error to be thrown");
                } catch (err) {
                    assert(err.message).equals("bet passed to enableAllBetPickers is undefined");
                };
            });
        });
        describe("when bet is null", function () {
            it("should return error", function () {
                var betPickers = vm.gameRows.gameRows[0].betPickers;
                var bet = null;
                var selectionDisabled = false;
                try {
                    vm.enableAllBetPickers(betPickers, bet, selectionDisabled);
                    assert(false).equals(true, "expected an error to be thrown");
                } catch (err) {
                    assert(err.message).equals("bet passed to enableAllBetPickers is null");
                };
            });
        });
        describe("when selectionDisabled is undefined", function () {
            it("should return error", function () {
                var betPickers = vm.gameRows.gameRows[0].betPickers;
                var bet = vm.gameRows.gameRows[0].userGameSelection.bet;
                var selectionDisabled;
                try {
                    vm.enableAllBetPickers(betPickers, bet, selectionDisabled);
                    assert(false).equals(true, "expected an error to be thrown");
                } catch (err) {
                    assert(err.message).equals("selectionDisabled passed to enableAllBetPickers is undefined");
                };
            });
        });
        describe("when selectionDisabled is null", function () {
            it("should return error", function () {
                var betPickers = vm.gameRows.gameRows[0].betPickers;
                var bet = vm.gameRows.gameRows[0].userGameSelection.bet;
                var selectionDisabled = null;
                try {
                    vm.enableAllBetPickers(betPickers, bet, selectionDisabled);
                    assert(false).equals(true, "expected an error to be thrown");
                } catch (err) {
                    assert(err.message).equals("selectionDisabled passed to enableAllBetPickers is null");
                };
            });
        });
        describe("when bet is out of range of bet pickers", function () {
            it("should return error", function () {
                var betPickers = vm.gameRows.gameRows[0].betPickers;
                var bet = 10;
                var selectionDisabled = false;
                try {
                    vm.enableAllBetPickers(betPickers, bet, selectionDisabled);
                    assert(false).equals(true, "expected an error to be thrown");
                } catch (err) {
                    assert(err.message).equals("bet does not exist in betPickers; bet:10");
                };
            });
        });
        describe("when selectionDisabled false", function () {
            it("should return enabled for all and toggled for the bet match", function () {

                for (var i = 0; i < vm.gameRows.gameRows[0].betPickers.length; i++) {
                    //set to opposite state of the expected to prove that the function is updating to expected
                    vm.gameRows.gameRows[0].betPickers[i].disabled(true);
                    vm.gameRows.gameRows[0].betPickers[i].toggled(false);
                };

                var betPickers = vm.gameRows.gameRows[0].betPickers;
                var bet = 3;
                var selectionDisabled = false;

                vm.enableAllBetPickers(betPickers, bet, selectionDisabled);

                assertAllBetPickersAreDisabledAndNotToggled(disabled = false);
            });
        });
        describe("when selectionDisabled true", function () {
            it("should return disabled for all and toggled for the bet match", function () {

                for (var i = 0; i < vm.gameRows.gameRows[0].betPickers.length; i++) {
                    //set to opposite state of the expected to prove that the function is updating to expected
                    vm.gameRows.gameRows[0].betPickers[i].disabled(true);
                    vm.gameRows.gameRows[0].betPickers[i].toggled(false);
                };

                var betPickers = vm.gameRows.gameRows[0].betPickers;
                var bet = 3;
                var selectionDisabled = true;

                vm.enableAllBetPickers(betPickers, bet, selectionDisabled);

                assertAllBetPickersAreDisabledAndNotToggled(disabled = true);
            });
        });
    });

    describe("calculateMaxPossibleAdditionalBetForAnyGameThisWeek tests", function () {
        var vm = {};
        before(function () {
            vm = {};
            var data = {};
            data.maxBetForAnyOneGame = 5;
            data.minSpentPointsForAnyOneWeek = 6;
            data.extraPointFactorPerBetOverMin = 1;
            data.possibleBets = 16;
            data.placedBets = 0;
            data.bonusPoints = 0;
            data.spentPoints = 0;
            data.gameRowsHaveBeenSaved = false;
            data.selectionDisabledForThisGameFilter = false;
            data.gameRows = [
                {
                    userGameSelection: { bet: 0, saved: false },
                    selectionPicker: { disabled: true, toggle: false, selectionValue: null },
                    betPickers: [
                        { disabled: true, toggled: false, betValue: 1 },
                        { disabled: true, toggled: false, betValue: 2 },
                        { disabled: true, toggled: false, betValue: 3 },
                        { disabled: true, toggled: false, betValue: 4 },
                        { disabled: true, toggled: false, betValue: 5 }
                    ]
                }
            ];
            vm = new selectionViewModel(data);
        });
        after(function () {
            vm = null;
        });

        describe("when bonusPoints is undefined", function () {
            it("should return error", function () {
                var bonusPoints;
                var MAXBETFORANYONEGAME = 5;
                try {
                    vm.calculateMaxPossibleAdditionalBetForAnyGameThisWeek(bonusPoints, MAXBETFORANYONEGAME);
                    assert(false).equals(true, "expected an error to be thrown");
                } catch (err) {
                    assert(err.message).equals("bonusPoints passed to calculateMaxPossibleAdditionalBetForAnyGameThisWeek is undefined");
                };
            });
        });
        describe("when bonusPoints is null", function () {
            it("should return error", function () {
                var bonusPoints = null;
                var MAXBETFORANYONEGAME = 5;
                try {
                    vm.calculateMaxPossibleAdditionalBetForAnyGameThisWeek(bonusPoints, MAXBETFORANYONEGAME);
                    assert(false).equals(true, "expected an error to be thrown");
                } catch (err) {
                    assert(err.message).equals("bonusPoints passed to calculateMaxPossibleAdditionalBetForAnyGameThisWeek is null");
                };
            });
        });
        describe("when MAXBETFORANYONEGAME is undefined", function () {
            it("should return error", function () {
                var bonusPoints = 0;
                var MAXBETFORANYONEGAME;
                try {
                    vm.calculateMaxPossibleAdditionalBetForAnyGameThisWeek(bonusPoints, MAXBETFORANYONEGAME);
                    assert(false).equals(true, "expected an error to be thrown");
                } catch (err) {
                    assert(err.message).equals("MAXBETFORANYONEGAME passed to calculateMaxPossibleAdditionalBetForAnyGameThisWeek is undefined");
                };
            });
        });
        describe("when MAXBETFORANYONEGAME is null", function () {
            it("should return error", function () {
                var bonusPoints = 0;
                var MAXBETFORANYONEGAME = null;
                try {
                    vm.calculateMaxPossibleAdditionalBetForAnyGameThisWeek(bonusPoints, MAXBETFORANYONEGAME);
                    assert(false).equals(true, "expected an error to be thrown");
                } catch (err) {
                    assert(err.message).equals("MAXBETFORANYONEGAME passed to calculateMaxPossibleAdditionalBetForAnyGameThisWeek is null");
                };
            });
        });
        describe("when bonus points 0 and max bet for any one game 5", function () {
            it("should calculate correctly", function () {
                vm.calculateMaxPossibleAdditionalBetForAnyGameThisWeek(bonusPoints = 0, MAXBETFORANYONEGAME = 5);
                assert(vm.maxPossibleAdditionalBetForAnyGameThisWeek()).equals(0, "maxPossibleAdditionalBetForAnyGameThisWeek");
            });
        });
        describe("when bonus points 1 and max bet for any one game 5", function () {
            it("should calculate correctly", function () {
                vm.calculateMaxPossibleAdditionalBetForAnyGameThisWeek(bonusPoints = 1, MAXBETFORANYONEGAME = 5);
                assert(vm.maxPossibleAdditionalBetForAnyGameThisWeek()).equals(1, "maxPossibleAdditionalBetForAnyGameThisWeek");
            });
        });
        describe("when bonus points 2 and max bet for any one game 5", function () {
            it("should calculate correctly", function () {
                vm.calculateMaxPossibleAdditionalBetForAnyGameThisWeek(bonusPoints = 2, MAXBETFORANYONEGAME = 5);
                assert(vm.maxPossibleAdditionalBetForAnyGameThisWeek()).equals(2, "maxPossibleAdditionalBetForAnyGameThisWeek");
            });
        });
        describe("when bonus points 3 and max bet for any one game 5", function () {
            it("should calculate correctly", function () {
                vm.calculateMaxPossibleAdditionalBetForAnyGameThisWeek(bonusPoints = 3, MAXBETFORANYONEGAME = 5);
                assert(vm.maxPossibleAdditionalBetForAnyGameThisWeek()).equals(3, "maxPossibleAdditionalBetForAnyGameThisWeek");
            });
        });
        describe("when bonus points 4 and max bet for any one game 5", function () {
            it("should calculate correctly", function () {
                vm.calculateMaxPossibleAdditionalBetForAnyGameThisWeek(bonusPoints = 4, MAXBETFORANYONEGAME = 5);
                assert(vm.maxPossibleAdditionalBetForAnyGameThisWeek()).equals(4, "maxPossibleAdditionalBetForAnyGameThisWeek");
            });
        });
        describe("when bonus points 5 and max bet for any one game 5", function () {
            it("should calculate correctly", function () {
                vm.calculateMaxPossibleAdditionalBetForAnyGameThisWeek(bonusPoints = 5, MAXBETFORANYONEGAME = 5);
                assert(vm.maxPossibleAdditionalBetForAnyGameThisWeek()).equals(5, "maxPossibleAdditionalBetForAnyGameThisWeek");
            });
        });
        describe("when bonus points 6 and max bet for any one game 5", function () {
            it("should calculate correctly", function () {
                vm.calculateMaxPossibleAdditionalBetForAnyGameThisWeek(bonusPoints = 6, MAXBETFORANYONEGAME = 5);
                assert(vm.maxPossibleAdditionalBetForAnyGameThisWeek()).equals(5, "maxPossibleAdditionalBetForAnyGameThisWeek");
            });
        });
        describe("when bonus points > 5 and max bet for any one game 5", function () {
            it("should calculate correctly", function () {
                vm.calculateMaxPossibleAdditionalBetForAnyGameThisWeek(bonusPoints = 15, MAXBETFORANYONEGAME = 5);
                assert(vm.maxPossibleAdditionalBetForAnyGameThisWeek()).equals(5, "maxPossibleAdditionalBetForAnyGameThisWeek");
            });
        });

    });

    describe("calculateMaxPossibleBetForOneGame tests", function () {
        var vm = {};
        var data = {};
        before(function () {
            vm = {};
            data = {};
            data.maxBetForAnyOneGame = 5;
            data.minSpentPointsForAnyOneWeek = 6;
            data.extraPointFactorPerBetOverMin = 1;
            data.possibleBets = 16;
            data.placedBets = 0;
            data.bonusPoints = 0;
            data.spentPoints = 0;
            data.gameRowsHaveBeenSaved = false;
            data.selectionDisabledForThisGameFilter = false;
            data.gameRows = [
                {
                    userGameSelection: { bet: 0, saved: false },
                    selectionPicker: { disabled: true, toggle: false, selectionValue: null },
                    betPickers: [
                        { disabled: true, toggled: false, betValue: 1 },
                        { disabled: true, toggled: false, betValue: 2 },
                        { disabled: true, toggled: false, betValue: 3 },
                        { disabled: true, toggled: false, betValue: 4 },
                        { disabled: true, toggled: false, betValue: 5 }
                    ]
                }
            ];
            vm = new selectionViewModel(data);
        });
        after(function () {
            vm = null;
            data = null;
        });

        describe("when userGameSelection is undefined", function () {
            it("should return error", function () {
                var userGameSelection;
                var maxPossibleAdditionalBetForAnyGameThisWeek = 5;
                var MAXBETFORANYONEGAME = 5;
                try {
                    vm.calculateMaxPossibleBetForOneGame(userGameSelection, maxPossibleAdditionalBetForAnyGameThisWeek, MAXBETFORANYONEGAME);
                    assert(false).equals(true, "expected an error to be thrown");
                } catch (err) {
                    assert(err.message).equals("userGameSelection passed to calculateMaxPossibleBetForOneGame is undefined");
                };
            });
        });
        describe("when userGameSelection is null", function () {
            it("should return error", function () {
                var userGameSelection = null;
                var maxPossibleAdditionalBetForAnyGameThisWeek = 5;
                var MAXBETFORANYONEGAME = 5;
                try {
                    vm.calculateMaxPossibleBetForOneGame(userGameSelection, maxPossibleAdditionalBetForAnyGameThisWeek, MAXBETFORANYONEGAME);
                    assert(false).equals(true, "expected an error to be thrown");
                } catch (err) {
                    assert(err.message).equals("userGameSelection passed to calculateMaxPossibleBetForOneGame is null");
                };
            });
        });
        describe("when bet is 0", function () {
            it("maxGameBet should be 0", function () {
                data.gameRows = [
                        {
                            userGameSelection: { bet: 0, maxGameBet: 0 },
                            selectionPicker: { disabled: true, toggle: false, selectionValue: null },
                            betPickers: [
                                { disabled: true, toggled: false, betValue: 1 },
                                { disabled: true, toggled: false, betValue: 2 },
                                { disabled: true, toggled: false, betValue: 3 },
                                { disabled: true, toggled: false, betValue: 4 },
                                { disabled: true, toggled: false, betValue: 5 }
                            ]
                        }
                ];
                vm = new selectionViewModel(data);

                var userGameSelection = vm.gameRows.gameRows[0].userGameSelection;
                var maxPossibleAdditionalBetForAnyGameThisWeek = 5;
                var MAXBETFORANYONEGAME = 5;

                vm.calculateMaxPossibleBetForOneGame(userGameSelection, maxPossibleAdditionalBetForAnyGameThisWeek, MAXBETFORANYONEGAME);

                assert(vm.gameRows.gameRows[0].userGameSelection.maxGameBet).equals(0);
            });
        });
        describe("when bet (4) + max possible (2) > max bet 5", function () {
            it("maxGameBet should be max bet (5)", function () {
                data.gameRows = [
                        {
                            userGameSelection: { bet: 4, maxGameBet: 0 },
                            selectionPicker: { disabled: true, toggle: false, selectionValue: null },
                            betPickers: [
                                { disabled: true, toggled: false, betValue: 1 },
                                { disabled: true, toggled: false, betValue: 2 },
                                { disabled: true, toggled: false, betValue: 3 },
                                { disabled: true, toggled: false, betValue: 4 },
                                { disabled: true, toggled: false, betValue: 5 }
                            ]
                        }
                ];
                vm = new selectionViewModel(data);

                var userGameSelection = vm.gameRows.gameRows[0].userGameSelection;
                var maxPossibleAdditionalBetForAnyGameThisWeek = 2;
                var MAXBETFORANYONEGAME = 5;

                vm.calculateMaxPossibleBetForOneGame(userGameSelection, maxPossibleAdditionalBetForAnyGameThisWeek, MAXBETFORANYONEGAME);

                assert(vm.gameRows.gameRows[0].userGameSelection.maxGameBet).equals(5);
            });
        });
        describe("when bet (3) + max possible (2) = max bet 5", function () {
            it("maxGameBet should be max bet (5)", function () {
                data.gameRows = [
                        {
                            userGameSelection: { bet: 3, maxGameBet: 0 },
                            selectionPicker: { disabled: true, toggle: false, selectionValue: null },
                            betPickers: [
                                { disabled: true, toggled: false, betValue: 1 },
                                { disabled: true, toggled: false, betValue: 2 },
                                { disabled: true, toggled: false, betValue: 3 },
                                { disabled: true, toggled: false, betValue: 4 },
                                { disabled: true, toggled: false, betValue: 5 }
                            ]
                        }
                ];
                vm = new selectionViewModel(data);

                var userGameSelection = vm.gameRows.gameRows[0].userGameSelection;
                var maxPossibleAdditionalBetForAnyGameThisWeek = 2;
                var MAXBETFORANYONEGAME = 5;

                vm.calculateMaxPossibleBetForOneGame(userGameSelection, maxPossibleAdditionalBetForAnyGameThisWeek, MAXBETFORANYONEGAME);

                assert(vm.gameRows.gameRows[0].userGameSelection.maxGameBet).equals(5);
            });
        });
        describe("when bet (2) + max possible (2) < max bet 5", function () {
            it("maxGameBet should be bet + max possible (4)", function () {
                data.gameRows = [
                        {
                            userGameSelection: { bet: 2, maxGameBet: 0 },
                            selectionPicker: { disabled: true, toggle: false, selectionValue: null },
                            betPickers: [
                                { disabled: true, toggled: false, betValue: 1 },
                                { disabled: true, toggled: false, betValue: 2 },
                                { disabled: true, toggled: false, betValue: 3 },
                                { disabled: true, toggled: false, betValue: 4 },
                                { disabled: true, toggled: false, betValue: 5 }
                            ]
                        }
                ];
                vm = new selectionViewModel(data);

                var userGameSelection = vm.gameRows.gameRows[0].userGameSelection;
                var maxPossibleAdditionalBetForAnyGameThisWeek = 2;
                var MAXBETFORANYONEGAME = 5;

                vm.calculateMaxPossibleBetForOneGame(userGameSelection, maxPossibleAdditionalBetForAnyGameThisWeek, MAXBETFORANYONEGAME);

                assert(vm.gameRows.gameRows[0].userGameSelection.maxGameBet).equals(4);
            });
        });
    });
    
    describe("user bet interaction tests", function () {
        /*       describe("when 0 bets are selected", function () {
                   var vm = {};
                   before(function () {
                       vm = {};
                       var data = {};
                       data.maxBetForAnyOneGame = 5;
                       data.minSpentPointsForAnyOneWeek = 6;
                       data.extraPointFactorPerBetOverMin = 1;
                       data.possibleBets = 16;
                       data.placedBets = 0;
                       data.bonusPoints = 0;
                       data.spentPoints = 0;
                       data.gameRowsHaveBeenSaved = false;
                       data.selectionDisabledForThisGameFilter = false;
                       data.gameRows = [
                           { userGameSelection: { bet: 0, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                           { userGameSelection: { bet: 0, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                           { userGameSelection: { bet: 0, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                           { userGameSelection: { bet: 0, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                           { userGameSelection: { bet: 0, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                           { userGameSelection: { bet: 0, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                           { userGameSelection: { bet: 0, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                           { userGameSelection: { bet: 0, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                           { userGameSelection: { bet: 0, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                           { userGameSelection: { bet: 0, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                           { userGameSelection: { bet: 0, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                           { userGameSelection: { bet: 0, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                           { userGameSelection: { bet: 0, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                           { userGameSelection: { bet: 0, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                           { userGameSelection: { bet: 0, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                           { userGameSelection: { bet: 0, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                       ];
                       vm = new selectionViewModel(data);
                   });
                   after(function () {
                       vm = null;
                   });
                   function assertGameWeekConstants() {
                       assert(vm.MAXBETFORANYONEGAME).equals(5, "MAXBETFORANYONEGAME");
                       assert(vm.MINSPENTPOINTSFORANYONEWEEK).equals(6, "MINSPENTPOINTSFORANYONEWEEK");
                       assert(vm.EXTRAPOINTFACTORPERBETOVERMIN).equals(1, "EXTRAPOINTFACTORPERBETOVERMIN");
                   };
       
                   function assertUserGameSelectionsBet() {
                       assert(vm.gameRows.gameRows.length).equals(16, "gameRows.length");
                       assert(vm.gameRows.gameRows[0].userGameSelection.bet).equals(0, "userGameSelections[0]");
                       assert(vm.gameRows.gameRows[1].userGameSelection.bet).equals(0, "userGameSelections[1]");
                       assert(vm.gameRows.gameRows[2].userGameSelection.bet).equals(0, "userGameSelections[2]");
                       assert(vm.gameRows.gameRows[3].userGameSelection.bet).equals(0, "userGameSelections[3]");
                       assert(vm.gameRows.gameRows[4].userGameSelection.bet).equals(0, "userGameSelections[4]");
                       assert(vm.gameRows.gameRows[5].userGameSelection.bet).equals(0, "userGameSelections[5]");
                       assert(vm.gameRows.gameRows[6].userGameSelection.bet).equals(0, "userGameSelections[6]");
                       assert(vm.gameRows.gameRows[7].userGameSelection.bet).equals(0, "userGameSelections[7]");
                       assert(vm.gameRows.gameRows[8].userGameSelection.bet).equals(0, "userGameSelections[8]");
                       assert(vm.gameRows.gameRows[9].userGameSelection.bet).equals(0, "userGameSelections[9]");
                       assert(vm.gameRows.gameRows[10].userGameSelection.bet).equals(0, "userGameSelections[10]");
                       assert(vm.gameRows.gameRows[11].userGameSelection.bet).equals(0, "userGameSelections[11]");
                       assert(vm.gameRows.gameRows[12].userGameSelection.bet).equals(0, "userGameSelections[12]");
                       assert(vm.gameRows.gameRows[13].userGameSelection.bet).equals(0, "userGameSelections[13]");
                       assert(vm.gameRows.gameRows[14].userGameSelection.bet).equals(0, "userGameSelections[14]");
                       assert(vm.gameRows.gameRows[15].userGameSelection.bet).equals(0, "userGameSelections[15]");
                   };
       
                   function assertUserGameSelectionsMaxGameBet() {
                       assert(vm.gameRows.gameRows.length).equals(16, "userGameSelections.length");
                       assert(vm.gameRows.gameRows[0].userGameSelection.maxGameBet).equals(0, "userGameSelections[0]");
                       assert(vm.gameRows.gameRows[1].userGameSelection.maxGameBet).equals(0, "userGameSelections[1]");
                       assert(vm.gameRows.gameRows[2].userGameSelection.maxGameBet).equals(0, "userGameSelections[2]");
                       assert(vm.gameRows.gameRows[3].userGameSelection.maxGameBet).equals(0, "userGameSelections[3]");
                       assert(vm.gameRows.gameRows[4].userGameSelection.maxGameBet).equals(0, "userGameSelections[4]");
                       assert(vm.gameRows.gameRows[5].userGameSelection.maxGameBet).equals(0, "userGameSelections[5]");
                       assert(vm.gameRows.gameRows[6].userGameSelection.maxGameBet).equals(0, "userGameSelections[6]");
                       assert(vm.gameRows.gameRows[7].userGameSelection.maxGameBet).equals(0, "userGameSelections[7]");
                       assert(vm.gameRows.gameRows[8].userGameSelection.maxGameBet).equals(0, "userGameSelections[8]");
                       assert(vm.gameRows.gameRows[9].userGameSelection.maxGameBet).equals(0, "userGameSelections[9]");
                       assert(vm.gameRows.gameRows[10].userGameSelection.maxGameBet).equals(0, "userGameSelections[10]");
                       assert(vm.gameRows.gameRows[11].userGameSelection.maxGameBet).equals(0, "userGameSelections[11]");
                       assert(vm.gameRows.gameRows[12].userGameSelection.maxGameBet).equals(0, "userGameSelections[12]");
                       assert(vm.gameRows.gameRows[13].userGameSelection.maxGameBet).equals(0, "userGameSelections[13]");
                       assert(vm.gameRows.gameRows[14].userGameSelection.maxGameBet).equals(0, "userGameSelections[14]");
                       assert(vm.gameRows.gameRows[15].userGameSelection.maxGameBet).equals(0, "userGameSelections[15]");
                   };
       
                   describe("game/week constants", function () {
                       it("should remain the same", function () {
                           assertGameWeekConstants();
                       });
                   });
                   describe("userGameSelections", function () {
                       it("should remain the same", function () {
                           assertUserGameSelectionsBet();
                       });
                   });
                   describe("calculateTotalValues", function () {
                       it("should calculate correctly", function () {
                           vm.calculateTotalValues(vm.gameRows.gameRows, vm.MINSPENTPOINTSFORANYONEWEEK, vm.EXTRAPOINTFACTORPERBETOVERMIN);
       
                           assertGameWeekConstants();
                           assertUserGameSelectionsBet();
       
                           assert(vm.possibleBets()).equals(16, "possibleBets");
                           assert(vm.placedBets()).equals(0, "placedBets");
                           assert(vm.bonusPoints()).equals(0, "bonusPoints");
                           assert(vm.spentPoints()).equals(0, "spentPoints");
                       });
                   });
                   describe("calculateMaxPossibleBetForEachGame", function () {
                       it("should calculate correctly", function () {
                           vm.calculateMaxPossibleBetForEachGame(vm.gameRows.gameRows, maxPossibleAdditionalBetForAnyGameThisWeek = 0);
       
                           assertGameWeekConstants();
                           assertUserGameSelectionsBet();
       
                           assertUserGameSelectionsMaxGameBet();
       
                       });
                   });
               });
       
               describe("when 1 bet at 1", function () {
                   var vm = {};
                   before(function () {
                       vm = {};
                       var data = {};
                       data.maxBetForAnyOneGame = 5;
                       data.minSpentPointsForAnyOneWeek = 6;
                       data.extraPointFactorPerBetOverMin = 1;
                       data.possibleBets = 16;
                       data.placedBets = 0;
                       data.bonusPoints = 0;
                       data.spentPoints = 0;
                       data.gameRows =
                               [
                                   { userGameSelection: { bet: 0, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                                   { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                                   { userGameSelection: { bet: 0, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                                   { userGameSelection: { bet: 0, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                                   { userGameSelection: { bet: 0, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                                   { userGameSelection: { bet: 0, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                                   { userGameSelection: { bet: 0, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                                   { userGameSelection: { bet: 0, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                                   { userGameSelection: { bet: 0, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                                   { userGameSelection: { bet: 0, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                                   { userGameSelection: { bet: 0, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                                   { userGameSelection: { bet: 0, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                                   { userGameSelection: { bet: 0, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                                   { userGameSelection: { bet: 0, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                                   { userGameSelection: { bet: 0, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                                   { userGameSelection: { bet: 0, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] }
                               ];
                       data.gameRowsHaveBeenSaved = false;
                       data.selectionDisabledForThisGameFilter = false;
                       vm = new selectionViewModel(data);
                   });
                   after(function () {
                       vm = null;
                   });
                   function assertGameWeekConstants() {
                       assert(vm.MAXBETFORANYONEGAME).equals(5, "MAXBETFORANYONEGAME");
                       assert(vm.MINSPENTPOINTSFORANYONEWEEK).equals(6, "MINSPENTPOINTSFORANYONEWEEK");
                       assert(vm.EXTRAPOINTFACTORPERBETOVERMIN).equals(1, "EXTRAPOINTFACTORPERBETOVERMIN");
                   };
       
                   function assertUserGameSelectionsBet() {
                       assert(vm.gameRows.gameRows.length).equals(16, "userGameSelections.length");
                       assert(vm.gameRows.gameRows[0].userGameSelection.bet).equals(0, "userGameSelections[0]");
                       assert(vm.gameRows.gameRows[1].userGameSelection.bet).equals(1, "userGameSelections[1]");
                       assert(vm.gameRows.gameRows[2].userGameSelection.bet).equals(0, "userGameSelections[2]");
                       assert(vm.gameRows.gameRows[3].userGameSelection.bet).equals(0, "userGameSelections[3]");
                       assert(vm.gameRows.gameRows[4].userGameSelection.bet).equals(0, "userGameSelections[4]");
                       assert(vm.gameRows.gameRows[5].userGameSelection.bet).equals(0, "userGameSelections[5]");
                       assert(vm.gameRows.gameRows[6].userGameSelection.bet).equals(0, "userGameSelections[6]");
                       assert(vm.gameRows.gameRows[7].userGameSelection.bet).equals(0, "userGameSelections[7]");
                       assert(vm.gameRows.gameRows[8].userGameSelection.bet).equals(0, "userGameSelections[8]");
                       assert(vm.gameRows.gameRows[9].userGameSelection.bet).equals(0, "userGameSelections[9]");
                       assert(vm.gameRows.gameRows[10].userGameSelection.bet).equals(0, "userGameSelections[10]");
                       assert(vm.gameRows.gameRows[11].userGameSelection.bet).equals(0, "userGameSelections[11]");
                       assert(vm.gameRows.gameRows[12].userGameSelection.bet).equals(0, "userGameSelections[12]");
                       assert(vm.gameRows.gameRows[13].userGameSelection.bet).equals(0, "userGameSelections[13]");
                       assert(vm.gameRows.gameRows[14].userGameSelection.bet).equals(0, "userGameSelections[14]");
                       assert(vm.gameRows.gameRows[15].userGameSelection.bet).equals(0, "userGameSelections[15]");
                   };
       
                   function assertUserGameSelectionsMaxGameBet() {
                       assert(vm.gameRows.gameRows.length).equals(16, "userGameSelections.length");
                       assert(vm.gameRows.gameRows[0].userGameSelection.maxGameBet).equals(0, "userGameSelections[0]");
                       assert(vm.gameRows.gameRows[1].userGameSelection.maxGameBet).equals(1, "userGameSelections[1]");
                       assert(vm.gameRows.gameRows[2].userGameSelection.maxGameBet).equals(0, "userGameSelections[2]");
                       assert(vm.gameRows.gameRows[3].userGameSelection.maxGameBet).equals(0, "userGameSelections[3]");
                       assert(vm.gameRows.gameRows[4].userGameSelection.maxGameBet).equals(0, "userGameSelections[4]");
                       assert(vm.gameRows.gameRows[5].userGameSelection.maxGameBet).equals(0, "userGameSelections[5]");
                       assert(vm.gameRows.gameRows[6].userGameSelection.maxGameBet).equals(0, "userGameSelections[6]");
                       assert(vm.gameRows.gameRows[7].userGameSelection.maxGameBet).equals(0, "userGameSelections[7]");
                       assert(vm.gameRows.gameRows[8].userGameSelection.maxGameBet).equals(0, "userGameSelections[8]");
                       assert(vm.gameRows.gameRows[9].userGameSelection.maxGameBet).equals(0, "userGameSelections[9]");
                       assert(vm.gameRows.gameRows[10].userGameSelection.maxGameBet).equals(0, "userGameSelections[10]");
                       assert(vm.gameRows.gameRows[11].userGameSelection.maxGameBet).equals(0, "userGameSelections[11]");
                       assert(vm.gameRows.gameRows[12].userGameSelection.maxGameBet).equals(0, "userGameSelections[12]");
                       assert(vm.gameRows.gameRows[13].userGameSelection.maxGameBet).equals(0, "userGameSelections[13]");
                       assert(vm.gameRows.gameRows[14].userGameSelection.maxGameBet).equals(0, "userGameSelections[14]");
                       assert(vm.gameRows.gameRows[15].userGameSelection.maxGameBet).equals(0, "userGameSelections[15]");
                   };
       
                   describe("calculateTotalValues", function () {
                       it("should calculate correctly", function () {
                           vm.calculateTotalValues(vm.gameRows.gameRows, vm.MINSPENTPOINTSFORANYONEWEEK, vm.EXTRAPOINTFACTORPERBETOVERMIN);
       
                           assertGameWeekConstants();
                           assertUserGameSelectionsBet();
       
                           assert(vm.possibleBets()).equals(16, "possibleBets");
                           assert(vm.placedBets()).equals(1, "placedBets");
                           assert(vm.bonusPoints()).equals(0, "bonusPoints");
                           assert(vm.spentPoints()).equals(1, "spentPoints");
                       });
                   });
       
                   describe("calculateMaxPossibleBetForEachGame", function () {
       
                       it("should calculate correctly", function () {
                           vm.calculateMaxPossibleBetForEachGame(vm.gameRows.gameRows, maxPossibleAdditionalBetForAnyGameThisWeek = 1);
       
                           assertGameWeekConstants();
                           assertUserGameSelectionsBet();
       
                           assertUserGameSelectionsMaxGameBet();
       
                       });
                   });
               });
       
               describe("when 2 bets at 1", function () {
                   var vm = {};
                   before(function () {
                       vm = {};
                       var data = {};
                       data.maxBetForAnyOneGame = 5;
                       data.minSpentPointsForAnyOneWeek = 6;
                       data.extraPointFactorPerBetOverMin = 1;
                       data.possibleBets = 16;
                       data.placedBets = 0;
                       data.bonusPoints = 0;
                       data.spentPoints = 0;
                       data.gameRows =
                               [
                                   { userGameSelection: { bet: 0, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                                   { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                                   { userGameSelection: { bet: 0, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                                   { userGameSelection: { bet: 0, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                                   { userGameSelection: { bet: 0, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                                   { userGameSelection: { bet: 0, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                                   { userGameSelection: { bet: 0, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                                   { userGameSelection: { bet: 0, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                                   { userGameSelection: { bet: 0, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                                   { userGameSelection: { bet: 0, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                                   { userGameSelection: { bet: 0, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                                   { userGameSelection: { bet: 0, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                                   { userGameSelection: { bet: 0, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                                   { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                                   { userGameSelection: { bet: 0, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                                   { userGameSelection: { bet: 0, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] }
                               ];
                       data.gameRowsHaveBeenSaved = false;
                       data.selectionDisabledForThisGameFilter = false;
                       vm = new selectionViewModel(data);
                   });
                   after(function () {
                       vm = null;
                   });
                   function assertGameWeekConstants() {
                       assert(vm.MAXBETFORANYONEGAME).equals(5, "MAXBETFORANYONEGAME");
                       assert(vm.MINSPENTPOINTSFORANYONEWEEK).equals(6, "MINSPENTPOINTSFORANYONEWEEK");
                       assert(vm.EXTRAPOINTFACTORPERBETOVERMIN).equals(1, "EXTRAPOINTFACTORPERBETOVERMIN");
                   };
       
                   function assertUserGameSelectionsBet() {
                       assert(vm.gameRows.gameRows.length).equals(16, "userGameSelections.length");
                       assert(vm.gameRows.gameRows[0].userGameSelection.bet).equals(0, "userGameSelections[0]");
                       assert(vm.gameRows.gameRows[1].userGameSelection.bet).equals(1, "userGameSelections[1]");
                       assert(vm.gameRows.gameRows[2].userGameSelection.bet).equals(0, "userGameSelections[2]");
                       assert(vm.gameRows.gameRows[3].userGameSelection.bet).equals(0, "userGameSelections[3]");
                       assert(vm.gameRows.gameRows[4].userGameSelection.bet).equals(0, "userGameSelections[4]");
                       assert(vm.gameRows.gameRows[5].userGameSelection.bet).equals(0, "userGameSelections[5]");
                       assert(vm.gameRows.gameRows[6].userGameSelection.bet).equals(0, "userGameSelections[6]");
                       assert(vm.gameRows.gameRows[7].userGameSelection.bet).equals(0, "userGameSelections[7]");
                       assert(vm.gameRows.gameRows[8].userGameSelection.bet).equals(0, "userGameSelections[8]");
                       assert(vm.gameRows.gameRows[9].userGameSelection.bet).equals(0, "userGameSelections[9]");
                       assert(vm.gameRows.gameRows[10].userGameSelection.bet).equals(0, "userGameSelections[10]");
                       assert(vm.gameRows.gameRows[11].userGameSelection.bet).equals(0, "userGameSelections[11]");
                       assert(vm.gameRows.gameRows[12].userGameSelection.bet).equals(0, "userGameSelections[12]");
                       assert(vm.gameRows.gameRows[13].userGameSelection.bet).equals(1, "userGameSelections[13]");
                       assert(vm.gameRows.gameRows[14].userGameSelection.bet).equals(0, "userGameSelections[14]");
                       assert(vm.gameRows.gameRows[15].userGameSelection.bet).equals(0, "userGameSelections[15]");
                   };
       
                   function assertUserGameSelectionsMaxGameBet() {
                       assert(vm.gameRows.gameRows.length).equals(16, "userGameSelections.length");
                       assert(vm.gameRows.gameRows[0].userGameSelection.maxGameBet).equals(0, "userGameSelections[0]");
                       assert(vm.gameRows.gameRows[1].userGameSelection.maxGameBet).equals(1, "userGameSelections[1]");
                       assert(vm.gameRows.gameRows[2].userGameSelection.maxGameBet).equals(0, "userGameSelections[2]");
                       assert(vm.gameRows.gameRows[3].userGameSelection.maxGameBet).equals(0, "userGameSelections[3]");
                       assert(vm.gameRows.gameRows[4].userGameSelection.maxGameBet).equals(0, "userGameSelections[4]");
                       assert(vm.gameRows.gameRows[5].userGameSelection.maxGameBet).equals(0, "userGameSelections[5]");
                       assert(vm.gameRows.gameRows[6].userGameSelection.maxGameBet).equals(0, "userGameSelections[6]");
                       assert(vm.gameRows.gameRows[7].userGameSelection.maxGameBet).equals(0, "userGameSelections[7]");
                       assert(vm.gameRows.gameRows[8].userGameSelection.maxGameBet).equals(0, "userGameSelections[8]");
                       assert(vm.gameRows.gameRows[9].userGameSelection.maxGameBet).equals(0, "userGameSelections[9]");
                       assert(vm.gameRows.gameRows[10].userGameSelection.maxGameBet).equals(0, "userGameSelections[10]");
                       assert(vm.gameRows.gameRows[11].userGameSelection.maxGameBet).equals(0, "userGameSelections[11]");
                       assert(vm.gameRows.gameRows[12].userGameSelection.maxGameBet).equals(0, "userGameSelections[12]");
                       assert(vm.gameRows.gameRows[13].userGameSelection.maxGameBet).equals(1, "userGameSelections[13]");
                       assert(vm.gameRows.gameRows[14].userGameSelection.maxGameBet).equals(0, "userGameSelections[14]");
                       assert(vm.gameRows.gameRows[15].userGameSelection.maxGameBet).equals(0, "userGameSelections[15]");
                   };
       
                   describe("calculateTotalValues", function () {
                       it("should calculate correctly", function () {
                           vm.calculateTotalValues(vm.gameRows.gameRows, vm.MINSPENTPOINTSFORANYONEWEEK, vm.EXTRAPOINTFACTORPERBETOVERMIN);
                           assertGameWeekConstants();
                           assertUserGameSelectionsBet();
       
                           assert(vm.possibleBets()).equals(16, "possibleBets");
                           assert(vm.placedBets()).equals(2, "placedBets");
                           assert(vm.bonusPoints()).equals(0, "bonusPoints");
                           assert(vm.spentPoints()).equals(2, "spentPoints");
                       });
                   });
       
                   describe("calculateMaxPossibleBetForEachGame", function () {
                       it("should calculate correctly", function () {
                           vm.calculateMaxPossibleBetForEachGame(vm.gameRows.gameRows, maxPossibleAdditionalBetForAnyGameThisWeek = 1);
                           assertGameWeekConstants();
                           assertUserGameSelectionsBet();
       
                           assertUserGameSelectionsMaxGameBet();
                       });
                   });
               });
       
               describe("when 3 bets at 1", function () {
                   var vm = {};
                   before(function () {
                       vm = {};
                       var data = {};
                       data.maxBetForAnyOneGame = 5;
                       data.minSpentPointsForAnyOneWeek = 6;
                       data.extraPointFactorPerBetOverMin = 1;
                       data.possibleBets = 16;
                       data.placedBets = 0;
                       data.bonusPoints = 0;
                       data.spentPoints = 0;
                       data.gameRows =
                               [
                                   { userGameSelection: { bet: 0, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                                   { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                                   { userGameSelection: { bet: 0, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                                   { userGameSelection: { bet: 0, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                                   { userGameSelection: { bet: 0, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                                   { userGameSelection: { bet: 0, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                                   { userGameSelection: { bet: 0, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                                   { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                                   { userGameSelection: { bet: 0, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                                   { userGameSelection: { bet: 0, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                                   { userGameSelection: { bet: 0, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                                   { userGameSelection: { bet: 0, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                                   { userGameSelection: { bet: 0, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                                   { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                                   { userGameSelection: { bet: 0, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                                   { userGameSelection: { bet: 0, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] }
                               ];
                       data.gameRowsHaveBeenSaved = false;
                       data.selectionDisabledForThisGameFilter = false;
                       vm = new selectionViewModel(data);
                   });
                   after(function () {
                       vm = null;
                   });
                   function assertGameWeekConstants() {
                       assert(vm.MAXBETFORANYONEGAME).equals(5, "MAXBETFORANYONEGAME");
                       assert(vm.MINSPENTPOINTSFORANYONEWEEK).equals(6, "MINSPENTPOINTSFORANYONEWEEK");
                       assert(vm.EXTRAPOINTFACTORPERBETOVERMIN).equals(1, "EXTRAPOINTFACTORPERBETOVERMIN");
                   };
       
                   function assertUserGameSelectionsBet() {
                       assert(vm.gameRows.gameRows.length).equals(16, "userGameSelections.length");
                       assert(vm.gameRows.gameRows[0].userGameSelection.bet).equals(0, "userGameSelections[0]");
                       assert(vm.gameRows.gameRows[1].userGameSelection.bet).equals(1, "userGameSelections[1]");
                       assert(vm.gameRows.gameRows[2].userGameSelection.bet).equals(0, "userGameSelections[2]");
                       assert(vm.gameRows.gameRows[3].userGameSelection.bet).equals(0, "userGameSelections[3]");
                       assert(vm.gameRows.gameRows[4].userGameSelection.bet).equals(0, "userGameSelections[4]");
                       assert(vm.gameRows.gameRows[5].userGameSelection.bet).equals(0, "userGameSelections[5]");
                       assert(vm.gameRows.gameRows[6].userGameSelection.bet).equals(0, "userGameSelections[6]");
                       assert(vm.gameRows.gameRows[7].userGameSelection.bet).equals(1, "userGameSelections[7]");
                       assert(vm.gameRows.gameRows[8].userGameSelection.bet).equals(0, "userGameSelections[8]");
                       assert(vm.gameRows.gameRows[9].userGameSelection.bet).equals(0, "userGameSelections[9]");
                       assert(vm.gameRows.gameRows[10].userGameSelection.bet).equals(0, "userGameSelections[10]");
                       assert(vm.gameRows.gameRows[11].userGameSelection.bet).equals(0, "userGameSelections[11]");
                       assert(vm.gameRows.gameRows[12].userGameSelection.bet).equals(0, "userGameSelections[12]");
                       assert(vm.gameRows.gameRows[13].userGameSelection.bet).equals(1, "userGameSelections[13]");
                       assert(vm.gameRows.gameRows[14].userGameSelection.bet).equals(0, "userGameSelections[14]");
                       assert(vm.gameRows.gameRows[15].userGameSelection.bet).equals(0, "userGameSelections[15]");
                   };
       
                   function assertUserGameSelectionsMaxGameBet() {
                       assert(vm.gameRows.gameRows.length).equals(16, "userGameSelections.length");
                       assert(vm.gameRows.gameRows[0].userGameSelection.maxGameBet).equals(0, "userGameSelections[0]");
                       assert(vm.gameRows.gameRows[1].userGameSelection.maxGameBet).equals(1, "userGameSelections[1]");
                       assert(vm.gameRows.gameRows[2].userGameSelection.maxGameBet).equals(0, "userGameSelections[2]");
                       assert(vm.gameRows.gameRows[3].userGameSelection.maxGameBet).equals(0, "userGameSelections[3]");
                       assert(vm.gameRows.gameRows[4].userGameSelection.maxGameBet).equals(0, "userGameSelections[4]");
                       assert(vm.gameRows.gameRows[5].userGameSelection.maxGameBet).equals(0, "userGameSelections[5]");
                       assert(vm.gameRows.gameRows[6].userGameSelection.maxGameBet).equals(0, "userGameSelections[6]");
                       assert(vm.gameRows.gameRows[7].userGameSelection.maxGameBet).equals(1, "userGameSelections[7]");
                       assert(vm.gameRows.gameRows[8].userGameSelection.maxGameBet).equals(0, "userGameSelections[8]");
                       assert(vm.gameRows.gameRows[9].userGameSelection.maxGameBet).equals(0, "userGameSelections[9]");
                       assert(vm.gameRows.gameRows[10].userGameSelection.maxGameBet).equals(0, "userGameSelections[10]");
                       assert(vm.gameRows.gameRows[11].userGameSelection.maxGameBet).equals(0, "userGameSelections[11]");
                       assert(vm.gameRows.gameRows[12].userGameSelection.maxGameBet).equals(0, "userGameSelections[12]");
                       assert(vm.gameRows.gameRows[13].userGameSelection.maxGameBet).equals(1, "userGameSelections[13]");
                       assert(vm.gameRows.gameRows[14].userGameSelection.maxGameBet).equals(0, "userGameSelections[14]");
                       assert(vm.gameRows.gameRows[15].userGameSelection.maxGameBet).equals(0, "userGameSelections[15]");
                   };
       
                   describe("calculateTotalValues", function () {
                       it("should calculate correctly", function () {
                           vm.calculateTotalValues(vm.gameRows.gameRows, vm.MINSPENTPOINTSFORANYONEWEEK, vm.EXTRAPOINTFACTORPERBETOVERMIN);
                           assertGameWeekConstants();
                           assertUserGameSelectionsBet();
       
                           assert(vm.possibleBets()).equals(16, "possibleBets");
                           assert(vm.placedBets()).equals(3, "placedBets");
                           assert(vm.bonusPoints()).equals(0, "bonusPoints");
                           assert(vm.spentPoints()).equals(3, "spentPoints");
                       });
                   });
       
                   describe("calculateMaxPossibleBetForEachGame", function () {
                       it("should calculate correctly", function () {
                           vm.calculateMaxPossibleBetForEachGame(vm.gameRows.gameRows, maxPossibleAdditionalBetForAnyGameThisWeek = 1);
                           assertGameWeekConstants();
                           assertUserGameSelectionsBet();
       
                           assertUserGameSelectionsMaxGameBet();
                       });
                   });
               });
       
               describe("when 4 bets at 1", function () {
                   var vm = {};
                   before(function () {
                       vm = {};
                       var data = {};
                       data.maxBetForAnyOneGame = 5;
                       data.minSpentPointsForAnyOneWeek = 6;
                       data.extraPointFactorPerBetOverMin = 1;
                       data.possibleBets = 16;
                       data.placedBets = 0;
                       data.bonusPoints = 0;
                       data.spentPoints = 0;
                       data.gameRows =
                               [
                                   { userGameSelection: { bet: 0, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                                   { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                                   { userGameSelection: { bet: 0, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                                   { userGameSelection: { bet: 0, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                                   { userGameSelection: { bet: 0, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                                   { userGameSelection: { bet: 0, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                                   { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                                   { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                                   { userGameSelection: { bet: 0, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                                   { userGameSelection: { bet: 0, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                                   { userGameSelection: { bet: 0, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                                   { userGameSelection: { bet: 0, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                                   { userGameSelection: { bet: 0, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                                   { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                                   { userGameSelection: { bet: 0, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                                   { userGameSelection: { bet: 0, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] }
                               ];
                       data.gameRowsHaveBeenSaved = false;
                       data.selectionDisabledForThisGameFilter = false;
                       vm = new selectionViewModel(data);
                   });
                   after(function () {
                       vm = null;
                   });
                   function assertGameWeekConstants() {
                       assert(vm.MAXBETFORANYONEGAME).equals(5, "MAXBETFORANYONEGAME");
                       assert(vm.MINSPENTPOINTSFORANYONEWEEK).equals(6, "MINSPENTPOINTSFORANYONEWEEK");
                       assert(vm.EXTRAPOINTFACTORPERBETOVERMIN).equals(1, "EXTRAPOINTFACTORPERBETOVERMIN");
                   };
       
                   function assertUserGameSelectionsBet() {
                       assert(vm.gameRows.gameRows.length).equals(16, "userGameSelections.length");
                       assert(vm.gameRows.gameRows[0].userGameSelection.bet).equals(0, "userGameSelections[0]");
                       assert(vm.gameRows.gameRows[1].userGameSelection.bet).equals(1, "userGameSelections[1]");
                       assert(vm.gameRows.gameRows[2].userGameSelection.bet).equals(0, "userGameSelections[2]");
                       assert(vm.gameRows.gameRows[3].userGameSelection.bet).equals(0, "userGameSelections[3]");
                       assert(vm.gameRows.gameRows[4].userGameSelection.bet).equals(0, "userGameSelections[4]");
                       assert(vm.gameRows.gameRows[5].userGameSelection.bet).equals(0, "userGameSelections[5]");
                       assert(vm.gameRows.gameRows[6].userGameSelection.bet).equals(1, "userGameSelections[6]");
                       assert(vm.gameRows.gameRows[7].userGameSelection.bet).equals(1, "userGameSelections[7]");
                       assert(vm.gameRows.gameRows[8].userGameSelection.bet).equals(0, "userGameSelections[8]");
                       assert(vm.gameRows.gameRows[9].userGameSelection.bet).equals(0, "userGameSelections[9]");
                       assert(vm.gameRows.gameRows[10].userGameSelection.bet).equals(0, "userGameSelections[10]");
                       assert(vm.gameRows.gameRows[11].userGameSelection.bet).equals(0, "userGameSelections[11]");
                       assert(vm.gameRows.gameRows[12].userGameSelection.bet).equals(0, "userGameSelections[12]");
                       assert(vm.gameRows.gameRows[13].userGameSelection.bet).equals(1, "userGameSelections[13]");
                       assert(vm.gameRows.gameRows[14].userGameSelection.bet).equals(0, "userGameSelections[14]");
                       assert(vm.gameRows.gameRows[15].userGameSelection.bet).equals(0, "userGameSelections[15]");
                   };
       
                   function assertUserGameSelectionsMaxGameBet() {
                       assert(vm.gameRows.gameRows.length).equals(16, "userGameSelections.length");
                       assert(vm.gameRows.gameRows[0].userGameSelection.maxGameBet).equals(0, "userGameSelections[0]");
                       assert(vm.gameRows.gameRows[1].userGameSelection.maxGameBet).equals(1, "userGameSelections[1]");
                       assert(vm.gameRows.gameRows[2].userGameSelection.maxGameBet).equals(0, "userGameSelections[2]");
                       assert(vm.gameRows.gameRows[3].userGameSelection.maxGameBet).equals(0, "userGameSelections[3]");
                       assert(vm.gameRows.gameRows[4].userGameSelection.maxGameBet).equals(0, "userGameSelections[4]");
                       assert(vm.gameRows.gameRows[5].userGameSelection.maxGameBet).equals(0, "userGameSelections[5]");
                       assert(vm.gameRows.gameRows[6].userGameSelection.maxGameBet).equals(1, "userGameSelections[6]");
                       assert(vm.gameRows.gameRows[7].userGameSelection.maxGameBet).equals(1, "userGameSelections[7]");
                       assert(vm.gameRows.gameRows[8].userGameSelection.maxGameBet).equals(0, "userGameSelections[8]");
                       assert(vm.gameRows.gameRows[9].userGameSelection.maxGameBet).equals(0, "userGameSelections[9]");
                       assert(vm.gameRows.gameRows[10].userGameSelection.maxGameBet).equals(0, "userGameSelections[10]");
                       assert(vm.gameRows.gameRows[11].userGameSelection.maxGameBet).equals(0, "userGameSelections[11]");
                       assert(vm.gameRows.gameRows[12].userGameSelection.maxGameBet).equals(0, "userGameSelections[12]");
                       assert(vm.gameRows.gameRows[13].userGameSelection.maxGameBet).equals(1, "userGameSelections[13]");
                       assert(vm.gameRows.gameRows[14].userGameSelection.maxGameBet).equals(0, "userGameSelections[14]");
                       assert(vm.gameRows.gameRows[15].userGameSelection.maxGameBet).equals(0, "userGameSelections[15]");
                   };
       
                   describe("calculateTotalValues", function () {
                       it("should calculate correctly", function () {
                           vm.calculateTotalValues(vm.gameRows.gameRows, vm.MINSPENTPOINTSFORANYONEWEEK, vm.EXTRAPOINTFACTORPERBETOVERMIN);
                           assertGameWeekConstants();
                           assertUserGameSelectionsBet();
       
                           assert(vm.possibleBets()).equals(16, "possibleBets");
                           assert(vm.placedBets()).equals(4, "placedBets");
                           assert(vm.bonusPoints()).equals(0, "bonusPoints");
                           assert(vm.spentPoints()).equals(4, "spentPoints");
                       });
                   });
       
                   describe("calculateMaxPossibleBetForEachGame", function () {
                       it("should calculate correctly", function () {
                           vm.calculateMaxPossibleBetForEachGame(vm.gameRows.gameRows, maxPossibleAdditionalBetForAnyGameThisWeek = 1);
                           assertGameWeekConstants();
                           assertUserGameSelectionsBet();
       
                           assertUserGameSelectionsMaxGameBet();
                       });
                   });
               });
       
               describe("when 5 bets at 1", function () {
                   var vm = {};
                   before(function () {
                       vm = {};
                       var data = {};
                       data.maxBetForAnyOneGame = 5;
                       data.minSpentPointsForAnyOneWeek = 6;
                       data.extraPointFactorPerBetOverMin = 1;
                       data.possibleBets = 16;
                       data.placedBets = 0;
                       data.bonusPoints = 0;
                       data.spentPoints = 0;
                       data.gameRows =
                               [
                                   { userGameSelection: { bet: 0, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                                   { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                                   { userGameSelection: { bet: 0, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                                   { userGameSelection: { bet: 0, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                                   { userGameSelection: { bet: 0, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                                   { userGameSelection: { bet: 0, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                                   { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                                   { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                                   { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                                   { userGameSelection: { bet: 0, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                                   { userGameSelection: { bet: 0, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                                   { userGameSelection: { bet: 0, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                                   { userGameSelection: { bet: 0, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                                   { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                                   { userGameSelection: { bet: 0, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                                   { userGameSelection: { bet: 0, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] }
                               ];
                       data.gameRowsHaveBeenSaved = false;
                       data.selectionDisabledForThisGameFilter = false;
                       vm = new selectionViewModel(data);
                   });
                   after(function () {
                       vm = null;
                   });
                   function assertGameWeekConstants() {
                       assert(vm.MAXBETFORANYONEGAME).equals(5, "MAXBETFORANYONEGAME");
                       assert(vm.MINSPENTPOINTSFORANYONEWEEK).equals(6, "MINSPENTPOINTSFORANYONEWEEK");
                       assert(vm.EXTRAPOINTFACTORPERBETOVERMIN).equals(1, "EXTRAPOINTFACTORPERBETOVERMIN");
                   };
       
                   function assertUserGameSelectionsBet() {
                       assert(vm.gameRows.gameRows.length).equals(16, "userGameSelections.length");
                       assert(vm.gameRows.gameRows[0].userGameSelection.bet).equals(0, "userGameSelections[0]");
                       assert(vm.gameRows.gameRows[1].userGameSelection.bet).equals(1, "userGameSelections[1]");
                       assert(vm.gameRows.gameRows[2].userGameSelection.bet).equals(0, "userGameSelections[2]");
                       assert(vm.gameRows.gameRows[3].userGameSelection.bet).equals(0, "userGameSelections[3]");
                       assert(vm.gameRows.gameRows[4].userGameSelection.bet).equals(0, "userGameSelections[4]");
                       assert(vm.gameRows.gameRows[5].userGameSelection.bet).equals(0, "userGameSelections[5]");
                       assert(vm.gameRows.gameRows[6].userGameSelection.bet).equals(1, "userGameSelections[6]");
                       assert(vm.gameRows.gameRows[7].userGameSelection.bet).equals(1, "userGameSelections[7]");
                       assert(vm.gameRows.gameRows[8].userGameSelection.bet).equals(1, "userGameSelections[8]");
                       assert(vm.gameRows.gameRows[9].userGameSelection.bet).equals(0, "userGameSelections[9]");
                       assert(vm.gameRows.gameRows[10].userGameSelection.bet).equals(0, "userGameSelections[10]");
                       assert(vm.gameRows.gameRows[11].userGameSelection.bet).equals(0, "userGameSelections[11]");
                       assert(vm.gameRows.gameRows[12].userGameSelection.bet).equals(0, "userGameSelections[12]");
                       assert(vm.gameRows.gameRows[13].userGameSelection.bet).equals(1, "userGameSelections[13]");
                       assert(vm.gameRows.gameRows[14].userGameSelection.bet).equals(0, "userGameSelections[14]");
                       assert(vm.gameRows.gameRows[15].userGameSelection.bet).equals(0, "userGameSelections[15]");
                   };
       
                   function assertUserGameSelectionsMaxGameBet() {
                       assert(vm.gameRows.gameRows.length).equals(16, "userGameSelections.length");
                       assert(vm.gameRows.gameRows[0].userGameSelection.maxGameBet).equals(0, "userGameSelections[0]");
                       assert(vm.gameRows.gameRows[1].userGameSelection.maxGameBet).equals(1, "userGameSelections[1]");
                       assert(vm.gameRows.gameRows[2].userGameSelection.maxGameBet).equals(0, "userGameSelections[2]");
                       assert(vm.gameRows.gameRows[3].userGameSelection.maxGameBet).equals(0, "userGameSelections[3]");
                       assert(vm.gameRows.gameRows[4].userGameSelection.maxGameBet).equals(0, "userGameSelections[4]");
                       assert(vm.gameRows.gameRows[5].userGameSelection.maxGameBet).equals(0, "userGameSelections[5]");
                       assert(vm.gameRows.gameRows[6].userGameSelection.maxGameBet).equals(1, "userGameSelections[6]");
                       assert(vm.gameRows.gameRows[7].userGameSelection.maxGameBet).equals(1, "userGameSelections[7]");
                       assert(vm.gameRows.gameRows[8].userGameSelection.maxGameBet).equals(1, "userGameSelections[8]");
                       assert(vm.gameRows.gameRows[9].userGameSelection.maxGameBet).equals(0, "userGameSelections[9]");
                       assert(vm.gameRows.gameRows[10].userGameSelection.maxGameBet).equals(0, "userGameSelections[10]");
                       assert(vm.gameRows.gameRows[11].userGameSelection.maxGameBet).equals(0, "userGameSelections[11]");
                       assert(vm.gameRows.gameRows[12].userGameSelection.maxGameBet).equals(0, "userGameSelections[12]");
                       assert(vm.gameRows.gameRows[13].userGameSelection.maxGameBet).equals(1, "userGameSelections[13]");
                       assert(vm.gameRows.gameRows[14].userGameSelection.maxGameBet).equals(0, "userGameSelections[14]");
                       assert(vm.gameRows.gameRows[15].userGameSelection.maxGameBet).equals(0, "userGameSelections[15]");
                   };
       
                   describe("calculateTotalValues", function () {
                       it("should calculate correctly", function () {
                           vm.calculateTotalValues(vm.gameRows.gameRows, vm.MINSPENTPOINTSFORANYONEWEEK, vm.EXTRAPOINTFACTORPERBETOVERMIN);
                           assertGameWeekConstants();
                           assertUserGameSelectionsBet();
       
                           assert(vm.possibleBets()).equals(16, "possibleBets");
                           assert(vm.placedBets()).equals(5, "placedBets");
                           assert(vm.bonusPoints()).equals(0, "bonusPoints");
                           assert(vm.spentPoints()).equals(5, "spentPoints");
                       });
                   });
       
                   describe("calculateMaxPossibleBetForEachGame", function () {
                       it("should calculate correctly", function () {
                           vm.calculateMaxPossibleBetForEachGame(vm.gameRows.gameRows, maxPossibleAdditionalBetForAnyGameThisWeek = 1);
                           assertGameWeekConstants();
                           assertUserGameSelectionsBet();
       
                           assertUserGameSelectionsMaxGameBet();
                       });
                   });
               });
       
               describe("when 6 bets at 1", function () {
                   var vm = {};
                   before(function () {
                       vm = {};
                       var data = {};
                       data.maxBetForAnyOneGame = 5;
                       data.minSpentPointsForAnyOneWeek = 6;
                       data.extraPointFactorPerBetOverMin = 1;
                       data.possibleBets = 16;
                       data.placedBets = 0;
                       data.bonusPoints = 0;
                       data.spentPoints = 0;
                       data.gameRows =
                               [
                                   { userGameSelection: { bet: 0, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                                   { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                                   { userGameSelection: { bet: 0, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                                   { userGameSelection: { bet: 0, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                                   { userGameSelection: { bet: 0, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                                   { userGameSelection: { bet: 0, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                                   { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                                   { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                                   { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                                   { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                                   { userGameSelection: { bet: 0, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                                   { userGameSelection: { bet: 0, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                                   { userGameSelection: { bet: 0, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                                   { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                                   { userGameSelection: { bet: 0, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                                   { userGameSelection: { bet: 0, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] }
                               ];
                       data.gameRowsHaveBeenSaved = false;
                       data.selectionDisabledForThisGameFilter = false;
                       vm = new selectionViewModel(data);
                   });
                   after(function () {
                       vm = null;
                   });
                   function assertGameWeekConstants() {
                       assert(vm.MAXBETFORANYONEGAME).equals(5, "MAXBETFORANYONEGAME");
                       assert(vm.MINSPENTPOINTSFORANYONEWEEK).equals(6, "MINSPENTPOINTSFORANYONEWEEK");
                       assert(vm.EXTRAPOINTFACTORPERBETOVERMIN).equals(1, "EXTRAPOINTFACTORPERBETOVERMIN");
                   };
       
                   function assertUserGameSelectionsBet() {
                       assert(vm.gameRows.gameRows.length).equals(16, "userGameSelections.length");
                       assert(vm.gameRows.gameRows[0].userGameSelection.bet).equals(0, "userGameSelections[0]");
                       assert(vm.gameRows.gameRows[1].userGameSelection.bet).equals(1, "userGameSelections[1]");
                       assert(vm.gameRows.gameRows[2].userGameSelection.bet).equals(0, "userGameSelections[2]");
                       assert(vm.gameRows.gameRows[3].userGameSelection.bet).equals(0, "userGameSelections[3]");
                       assert(vm.gameRows.gameRows[4].userGameSelection.bet).equals(0, "userGameSelections[4]");
                       assert(vm.gameRows.gameRows[5].userGameSelection.bet).equals(0, "userGameSelections[5]");
                       assert(vm.gameRows.gameRows[6].userGameSelection.bet).equals(1, "userGameSelections[6]");
                       assert(vm.gameRows.gameRows[7].userGameSelection.bet).equals(1, "userGameSelections[7]");
                       assert(vm.gameRows.gameRows[8].userGameSelection.bet).equals(1, "userGameSelections[8]");
                       assert(vm.gameRows.gameRows[9].userGameSelection.bet).equals(1, "userGameSelections[9]");
                       assert(vm.gameRows.gameRows[10].userGameSelection.bet).equals(0, "userGameSelections[10]");
                       assert(vm.gameRows.gameRows[11].userGameSelection.bet).equals(0, "userGameSelections[11]");
                       assert(vm.gameRows.gameRows[12].userGameSelection.bet).equals(0, "userGameSelections[12]");
                       assert(vm.gameRows.gameRows[13].userGameSelection.bet).equals(1, "userGameSelections[13]");
                       assert(vm.gameRows.gameRows[14].userGameSelection.bet).equals(0, "userGameSelections[14]");
                       assert(vm.gameRows.gameRows[15].userGameSelection.bet).equals(0, "userGameSelections[15]");
                   };
       
                   function assertUserGameSelectionsMaxGameBet() {
                       assert(vm.gameRows.gameRows.length).equals(16, "userGameSelections.length");
                       assert(vm.gameRows.gameRows[0].userGameSelection.maxGameBet).equals(0, "userGameSelections[0]");
                       assert(vm.gameRows.gameRows[1].userGameSelection.maxGameBet).equals(1, "userGameSelections[1]");
                       assert(vm.gameRows.gameRows[2].userGameSelection.maxGameBet).equals(0, "userGameSelections[2]");
                       assert(vm.gameRows.gameRows[3].userGameSelection.maxGameBet).equals(0, "userGameSelections[3]");
                       assert(vm.gameRows.gameRows[4].userGameSelection.maxGameBet).equals(0, "userGameSelections[4]");
                       assert(vm.gameRows.gameRows[5].userGameSelection.maxGameBet).equals(0, "userGameSelections[5]");
                       assert(vm.gameRows.gameRows[6].userGameSelection.maxGameBet).equals(1, "userGameSelections[6]");
                       assert(vm.gameRows.gameRows[7].userGameSelection.maxGameBet).equals(1, "userGameSelections[7]");
                       assert(vm.gameRows.gameRows[8].userGameSelection.maxGameBet).equals(1, "userGameSelections[8]");
                       assert(vm.gameRows.gameRows[9].userGameSelection.maxGameBet).equals(1, "userGameSelections[9]");
                       assert(vm.gameRows.gameRows[10].userGameSelection.maxGameBet).equals(0, "userGameSelections[10]");
                       assert(vm.gameRows.gameRows[11].userGameSelection.maxGameBet).equals(0, "userGameSelections[11]");
                       assert(vm.gameRows.gameRows[12].userGameSelection.maxGameBet).equals(0, "userGameSelections[12]");
                       assert(vm.gameRows.gameRows[13].userGameSelection.maxGameBet).equals(1, "userGameSelections[13]");
                       assert(vm.gameRows.gameRows[14].userGameSelection.maxGameBet).equals(0, "userGameSelections[14]");
                       assert(vm.gameRows.gameRows[15].userGameSelection.maxGameBet).equals(0, "userGameSelections[15]");
                   };
       
                   describe("calculateTotalValues", function () {
                       it("should calculate correctly", function () {
                           vm.calculateTotalValues(vm.gameRows.gameRows, vm.MINSPENTPOINTSFORANYONEWEEK, vm.EXTRAPOINTFACTORPERBETOVERMIN);
                           assertGameWeekConstants();
                           assertUserGameSelectionsBet();
       
                           assert(vm.possibleBets()).equals(16, "possibleBets");
                           assert(vm.placedBets()).equals(6, "placedBets");
                           assert(vm.bonusPoints()).equals(0, "bonusPoints");
                           assert(vm.spentPoints()).equals(6, "spentPoints");
                       });
                   });
       
                   describe("calculateMaxPossibleBetForEachGame", function () {
                       it("should calculate correctly", function () {
                           vm.calculateMaxPossibleBetForEachGame(vm.gameRows.gameRows, maxPossibleAdditionalBetForAnyGameThisWeek = 1);
                           assertGameWeekConstants();
                           assertUserGameSelectionsBet();
       
                           assertUserGameSelectionsMaxGameBet();
                       });
                   });
               });
       
               describe("when 7 bets at 1", function () {
                   var vm = {};
                   before(function () {
                       vm = {};
                       var data = {};
                       data.maxBetForAnyOneGame = 5;
                       data.minSpentPointsForAnyOneWeek = 6;
                       data.extraPointFactorPerBetOverMin = 1;
                       data.possibleBets = 16;
                       data.placedBets = 7;
                       data.bonusPoints = 0;
                       data.spentPoints = 7;
                       data.gameRows =
                               [
                                   { userGameSelection: { bet: 0, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                                   { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                                   { userGameSelection: { bet: 0, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                                   { userGameSelection: { bet: 0, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                                   { userGameSelection: { bet: 0, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                                   { userGameSelection: { bet: 0, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                                   { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                                   { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                                   { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                                   { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                                   { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                                   { userGameSelection: { bet: 0, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                                   { userGameSelection: { bet: 0, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                                   { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                                   { userGameSelection: { bet: 0, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                                   { userGameSelection: { bet: 0, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] }
                               ];
                       data.gameRowsHaveBeenSaved = false;
                       data.selectionDisabledForThisGameFilter = false;
                       vm = new selectionViewModel(data);
                   });
                   after(function () {
                       vm = null;
                   });
                   function assertGameWeekConstants() {
                       assert(vm.MAXBETFORANYONEGAME).equals(5, "MAXBETFORANYONEGAME");
                       assert(vm.MINSPENTPOINTSFORANYONEWEEK).equals(6, "MINSPENTPOINTSFORANYONEWEEK");
                       assert(vm.EXTRAPOINTFACTORPERBETOVERMIN).equals(1, "EXTRAPOINTFACTORPERBETOVERMIN");
                   };
       
                   function assertUserGameSelectionsBet() {
                       assert(vm.gameRows.gameRows.length).equals(16, "userGameSelections.length");
                       assert(vm.gameRows.gameRows[0].userGameSelection.bet).equals(0, "userGameSelections[0]");
                       assert(vm.gameRows.gameRows[1].userGameSelection.bet).equals(1, "userGameSelections[1]");
                       assert(vm.gameRows.gameRows[2].userGameSelection.bet).equals(0, "userGameSelections[2]");
                       assert(vm.gameRows.gameRows[3].userGameSelection.bet).equals(0, "userGameSelections[3]");
                       assert(vm.gameRows.gameRows[4].userGameSelection.bet).equals(0, "userGameSelections[4]");
                       assert(vm.gameRows.gameRows[5].userGameSelection.bet).equals(0, "userGameSelections[5]");
                       assert(vm.gameRows.gameRows[6].userGameSelection.bet).equals(1, "userGameSelections[6]");
                       assert(vm.gameRows.gameRows[7].userGameSelection.bet).equals(1, "userGameSelections[7]");
                       assert(vm.gameRows.gameRows[8].userGameSelection.bet).equals(1, "userGameSelections[8]");
                       assert(vm.gameRows.gameRows[9].userGameSelection.bet).equals(1, "userGameSelections[9]");
                       assert(vm.gameRows.gameRows[10].userGameSelection.bet).equals(1, "userGameSelections[10]");
                       assert(vm.gameRows.gameRows[11].userGameSelection.bet).equals(0, "userGameSelections[11]");
                       assert(vm.gameRows.gameRows[12].userGameSelection.bet).equals(0, "userGameSelections[12]");
                       assert(vm.gameRows.gameRows[13].userGameSelection.bet).equals(1, "userGameSelections[13]");
                       assert(vm.gameRows.gameRows[14].userGameSelection.bet).equals(0, "userGameSelections[14]");
                       assert(vm.gameRows.gameRows[15].userGameSelection.bet).equals(0, "userGameSelections[15]");
                   };
       
                   function assertUserGameSelectionsMaxGameBet() {
                       assert(vm.gameRows.gameRows.length).equals(16, "userGameSelections.length");
                       assert(vm.gameRows.gameRows[0].userGameSelection.maxGameBet).equals(0, "userGameSelections[0]");
                       assert(vm.gameRows.gameRows[1].userGameSelection.maxGameBet).equals(2, "userGameSelections[1]");
                       assert(vm.gameRows.gameRows[2].userGameSelection.maxGameBet).equals(0, "userGameSelections[2]");
                       assert(vm.gameRows.gameRows[3].userGameSelection.maxGameBet).equals(0, "userGameSelections[3]");
                       assert(vm.gameRows.gameRows[4].userGameSelection.maxGameBet).equals(0, "userGameSelections[4]");
                       assert(vm.gameRows.gameRows[5].userGameSelection.maxGameBet).equals(0, "userGameSelections[5]");
                       assert(vm.gameRows.gameRows[6].userGameSelection.maxGameBet).equals(2, "userGameSelections[6]");
                       assert(vm.gameRows.gameRows[7].userGameSelection.maxGameBet).equals(2, "userGameSelections[7]");
                       assert(vm.gameRows.gameRows[8].userGameSelection.maxGameBet).equals(2, "userGameSelections[8]");
                       assert(vm.gameRows.gameRows[9].userGameSelection.maxGameBet).equals(2, "userGameSelections[9]");
                       assert(vm.gameRows.gameRows[10].userGameSelection.maxGameBet).equals(2, "userGameSelections[10]");
                       assert(vm.gameRows.gameRows[11].userGameSelection.maxGameBet).equals(0, "userGameSelections[11]");
                       assert(vm.gameRows.gameRows[12].userGameSelection.maxGameBet).equals(0, "userGameSelections[12]");
                       assert(vm.gameRows.gameRows[13].userGameSelection.maxGameBet).equals(2, "userGameSelections[13]");
                       assert(vm.gameRows.gameRows[14].userGameSelection.maxGameBet).equals(0, "userGameSelections[14]");
                       assert(vm.gameRows.gameRows[15].userGameSelection.maxGameBet).equals(0, "userGameSelections[15]");
                   };
       
                   describe("calculateTotalValues", function () {
                       it("should calculate correctly", function () {
                           vm.calculateTotalValues(vm.gameRows.gameRows, vm.MINSPENTPOINTSFORANYONEWEEK, vm.EXTRAPOINTFACTORPERBETOVERMIN);
                           assertGameWeekConstants();
                           assertUserGameSelectionsBet();
       
                           assert(vm.possibleBets()).equals(16, "possibleBets");
                           assert(vm.placedBets()).equals(7, "placedBets");
                           assert(vm.bonusPoints()).equals(1, "bonusPoints");
                           assert(vm.spentPoints()).equals(7, "spentPoints");
                       });
                   });
       
                   describe("calculateMaxPossibleBetForEachGame", function () {
                       it("should calculate correctly", function () {
                           vm.calculateMaxPossibleBetForEachGame(vm.gameRows.gameRows, maxPossibleAdditionalBetForAnyGameThisWeek = 2);
                           assertGameWeekConstants();
                           assertUserGameSelectionsBet();
       
                           assertUserGameSelectionsMaxGameBet();
                       });
                   });
               });
       
               describe("when 8 bets at 1", function () {
                   var data = {};
                   var vm = {};
                   data.maxBetForAnyOneGame = 5;
                   data.minSpentPointsForAnyOneWeek = 6;
                   data.extraPointFactorPerBetOverMin = 1;
                   data.possibleBets = 16;
                   data.placedBets = 0;
                   data.bonusPoints = 0;
                   data.spentPoints = 0;
                   data.gameRows =
                           [
                               { userGameSelection: { bet: 0, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                               { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                               { userGameSelection: { bet: 0, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                               { userGameSelection: { bet: 0, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                               { userGameSelection: { bet: 0, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                               { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                               { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                               { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                               { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                               { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                               { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                               { userGameSelection: { bet: 0, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                               { userGameSelection: { bet: 0, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                               { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                               { userGameSelection: { bet: 0, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                               { userGameSelection: { bet: 0, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] }
                           ];
                   data.gameRowsHaveBeenSaved = false;
                   data.selectionDisabledForThisGameFilter = false;
                   vm = new selectionViewModel(data);
       
                   function assertGameWeekConstants() {
                       assert(vm.MAXBETFORANYONEGAME).equals(5, "MAXBETFORANYONEGAME");
                       assert(vm.MINSPENTPOINTSFORANYONEWEEK).equals(6, "MINSPENTPOINTSFORANYONEWEEK");
                       assert(vm.EXTRAPOINTFACTORPERBETOVERMIN).equals(1, "EXTRAPOINTFACTORPERBETOVERMIN");
                   };
       
                   function assertUserGameSelectionsBet() {
                       assert(vm.gameRows.gameRows.length).equals(16, "userGameSelections.length");
                       assert(vm.gameRows.gameRows[0].userGameSelection.bet).equals(0, "userGameSelections[0]");
                       assert(vm.gameRows.gameRows[1].userGameSelection.bet).equals(1, "userGameSelections[1]");
                       assert(vm.gameRows.gameRows[2].userGameSelection.bet).equals(0, "userGameSelections[2]");
                       assert(vm.gameRows.gameRows[3].userGameSelection.bet).equals(0, "userGameSelections[3]");
                       assert(vm.gameRows.gameRows[4].userGameSelection.bet).equals(0, "userGameSelections[4]");
                       assert(vm.gameRows.gameRows[5].userGameSelection.bet).equals(1, "userGameSelections[5]");
                       assert(vm.gameRows.gameRows[6].userGameSelection.bet).equals(1, "userGameSelections[6]");
                       assert(vm.gameRows.gameRows[7].userGameSelection.bet).equals(1, "userGameSelections[7]");
                       assert(vm.gameRows.gameRows[8].userGameSelection.bet).equals(1, "userGameSelections[8]");
                       assert(vm.gameRows.gameRows[9].userGameSelection.bet).equals(1, "userGameSelections[9]");
                       assert(vm.gameRows.gameRows[10].userGameSelection.bet).equals(1, "userGameSelections[10]");
                       assert(vm.gameRows.gameRows[11].userGameSelection.bet).equals(0, "userGameSelections[11]");
                       assert(vm.gameRows.gameRows[12].userGameSelection.bet).equals(0, "userGameSelections[12]");
                       assert(vm.gameRows.gameRows[13].userGameSelection.bet).equals(1, "userGameSelections[13]");
                       assert(vm.gameRows.gameRows[14].userGameSelection.bet).equals(0, "userGameSelections[14]");
                       assert(vm.gameRows.gameRows[15].userGameSelection.bet).equals(0, "userGameSelections[15]");
                   };
       
                   function assertUserGameSelectionsMaxGameBet() {
                       assert(vm.gameRows.gameRows.length).equals(16, "userGameSelections.length");
                       assert(vm.gameRows.gameRows[0].userGameSelection.maxGameBet).equals(0, "userGameSelections[0]");
                       assert(vm.gameRows.gameRows[1].userGameSelection.maxGameBet).equals(3, "userGameSelections[1]");
                       assert(vm.gameRows.gameRows[2].userGameSelection.maxGameBet).equals(0, "userGameSelections[2]");
                       assert(vm.gameRows.gameRows[3].userGameSelection.maxGameBet).equals(0, "userGameSelections[3]");
                       assert(vm.gameRows.gameRows[4].userGameSelection.maxGameBet).equals(0, "userGameSelections[4]");
                       assert(vm.gameRows.gameRows[5].userGameSelection.maxGameBet).equals(3, "userGameSelections[5]");
                       assert(vm.gameRows.gameRows[6].userGameSelection.maxGameBet).equals(3, "userGameSelections[6]");
                       assert(vm.gameRows.gameRows[7].userGameSelection.maxGameBet).equals(3, "userGameSelections[7]");
                       assert(vm.gameRows.gameRows[8].userGameSelection.maxGameBet).equals(3, "userGameSelections[8]");
                       assert(vm.gameRows.gameRows[9].userGameSelection.maxGameBet).equals(3, "userGameSelections[9]");
                       assert(vm.gameRows.gameRows[10].userGameSelection.maxGameBet).equals(3, "userGameSelections[10]");
                       assert(vm.gameRows.gameRows[11].userGameSelection.maxGameBet).equals(0, "userGameSelections[11]");
                       assert(vm.gameRows.gameRows[12].userGameSelection.maxGameBet).equals(0, "userGameSelections[12]");
                       assert(vm.gameRows.gameRows[13].userGameSelection.maxGameBet).equals(3, "userGameSelections[13]");
                       assert(vm.gameRows.gameRows[14].userGameSelection.maxGameBet).equals(0, "userGameSelections[14]");
                       assert(vm.gameRows.gameRows[15].userGameSelection.maxGameBet).equals(0, "userGameSelections[15]");
                   };
       
                   describe("calculateTotalValues", function () {
                       vm.calculateTotalValues(vm.gameRows.gameRows, vm.MINSPENTPOINTSFORANYONEWEEK, vm.EXTRAPOINTFACTORPERBETOVERMIN);
       
                       it("should calculate correctly", function () {
                           assertGameWeekConstants();
                           assertUserGameSelectionsBet();
       
                           assert(vm.possibleBets()).equals(16, "possibleBets");
                           assert(vm.placedBets()).equals(8, "placedBets");
                           assert(vm.bonusPoints()).equals(2, "bonusPoints");
                           assert(vm.spentPoints()).equals(8, "spentPoints");
                       });
                   });
       
                   describe("calculateMaxPossibleBetForEachGame", function () {
                       vm.calculateMaxPossibleBetForEachGame(vm.gameRows.gameRows, maxPossibleAdditionalBetForAnyGameThisWeek = 3);
       
                       it("should calculate correctly", function () {
                           assertGameWeekConstants();
                           assertUserGameSelectionsBet();
       
                           assertUserGameSelectionsMaxGameBet();
       
                       });
                   });
               });
       
               describe("when 9 bets at 1", function () {
                   var data = {};
                   var vm = {};
                   data.maxBetForAnyOneGame = 5;
                   data.minSpentPointsForAnyOneWeek = 6;
                   data.extraPointFactorPerBetOverMin = 1;
                   data.possibleBets = 16;
                   data.placedBets = 0;
                   data.bonusPoints = 0;
                   data.spentPoints = 0;
                   data.gameRows =
                           [
                               { userGameSelection: { bet: 0, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                               { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                               { userGameSelection: { bet: 0, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                               { userGameSelection: { bet: 0, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                               { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                               { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                               { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                               { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                               { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                               { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                               { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                               { userGameSelection: { bet: 0, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                               { userGameSelection: { bet: 0, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                               { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                               { userGameSelection: { bet: 0, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                               { userGameSelection: { bet: 0, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] }
                           ];
                   data.gameRowsHaveBeenSaved = false;
                   data.selectionDisabledForThisGameFilter = false;
                   vm = new selectionViewModel(data);
       
                   function assertGameWeekConstants() {
                       assert(vm.MAXBETFORANYONEGAME).equals(5, "MAXBETFORANYONEGAME");
                       assert(vm.MINSPENTPOINTSFORANYONEWEEK).equals(6, "MINSPENTPOINTSFORANYONEWEEK");
                       assert(vm.EXTRAPOINTFACTORPERBETOVERMIN).equals(1, "EXTRAPOINTFACTORPERBETOVERMIN");
                   };
       
                   function assertUserGameSelectionsBet() {
                       assert(vm.gameRows.gameRows.length).equals(16, "userGameSelections.length");
                       assert(vm.gameRows.gameRows[0].userGameSelection.bet).equals(0, "userGameSelections[0]");
                       assert(vm.gameRows.gameRows[1].userGameSelection.bet).equals(1, "userGameSelections[1]");
                       assert(vm.gameRows.gameRows[2].userGameSelection.bet).equals(0, "userGameSelections[2]");
                       assert(vm.gameRows.gameRows[3].userGameSelection.bet).equals(0, "userGameSelections[3]");
                       assert(vm.gameRows.gameRows[4].userGameSelection.bet).equals(1, "userGameSelections[4]");
                       assert(vm.gameRows.gameRows[5].userGameSelection.bet).equals(1, "userGameSelections[5]");
                       assert(vm.gameRows.gameRows[6].userGameSelection.bet).equals(1, "userGameSelections[6]");
                       assert(vm.gameRows.gameRows[7].userGameSelection.bet).equals(1, "userGameSelections[7]");
                       assert(vm.gameRows.gameRows[8].userGameSelection.bet).equals(1, "userGameSelections[8]");
                       assert(vm.gameRows.gameRows[9].userGameSelection.bet).equals(1, "userGameSelections[9]");
                       assert(vm.gameRows.gameRows[10].userGameSelection.bet).equals(1, "userGameSelections[10]");
                       assert(vm.gameRows.gameRows[11].userGameSelection.bet).equals(0, "userGameSelections[11]");
                       assert(vm.gameRows.gameRows[12].userGameSelection.bet).equals(0, "userGameSelections[12]");
                       assert(vm.gameRows.gameRows[13].userGameSelection.bet).equals(1, "userGameSelections[13]");
                       assert(vm.gameRows.gameRows[14].userGameSelection.bet).equals(0, "userGameSelections[14]");
                       assert(vm.gameRows.gameRows[15].userGameSelection.bet).equals(0, "userGameSelections[15]");
                   };
       
                   function assertUserGameSelectionsMaxGameBet() {
                       assert(vm.gameRows.gameRows.length).equals(16, "userGameSelections.length");
                       assert(vm.gameRows.gameRows[0].userGameSelection.maxGameBet).equals(0, "userGameSelections[0]");
                       assert(vm.gameRows.gameRows[1].userGameSelection.maxGameBet).equals(4, "userGameSelections[1]");
                       assert(vm.gameRows.gameRows[2].userGameSelection.maxGameBet).equals(0, "userGameSelections[2]");
                       assert(vm.gameRows.gameRows[3].userGameSelection.maxGameBet).equals(0, "userGameSelections[3]");
                       assert(vm.gameRows.gameRows[4].userGameSelection.maxGameBet).equals(4, "userGameSelections[4]");
                       assert(vm.gameRows.gameRows[5].userGameSelection.maxGameBet).equals(4, "userGameSelections[5]");
                       assert(vm.gameRows.gameRows[6].userGameSelection.maxGameBet).equals(4, "userGameSelections[6]");
                       assert(vm.gameRows.gameRows[7].userGameSelection.maxGameBet).equals(4, "userGameSelections[7]");
                       assert(vm.gameRows.gameRows[8].userGameSelection.maxGameBet).equals(4, "userGameSelections[8]");
                       assert(vm.gameRows.gameRows[9].userGameSelection.maxGameBet).equals(4, "userGameSelections[9]");
                       assert(vm.gameRows.gameRows[10].userGameSelection.maxGameBet).equals(4, "userGameSelections[10]");
                       assert(vm.gameRows.gameRows[11].userGameSelection.maxGameBet).equals(0, "userGameSelections[11]");
                       assert(vm.gameRows.gameRows[12].userGameSelection.maxGameBet).equals(0, "userGameSelections[12]");
                       assert(vm.gameRows.gameRows[13].userGameSelection.maxGameBet).equals(4, "userGameSelections[13]");
                       assert(vm.gameRows.gameRows[14].userGameSelection.maxGameBet).equals(0, "userGameSelections[14]");
                       assert(vm.gameRows.gameRows[15].userGameSelection.maxGameBet).equals(0, "userGameSelections[15]");
                   };
       
                   describe("calculateTotalValues", function () {
                       vm.calculateTotalValues(vm.gameRows.gameRows, vm.MINSPENTPOINTSFORANYONEWEEK, vm.EXTRAPOINTFACTORPERBETOVERMIN);
       
                       it("should calculate correctly", function () {
                           assertGameWeekConstants();
                           assertUserGameSelectionsBet();
       
                           assert(vm.possibleBets()).equals(16, "possibleBets");
                           assert(vm.placedBets()).equals(9, "placedBets");
                           assert(vm.bonusPoints()).equals(3, "bonusPoints");
                           assert(vm.spentPoints()).equals(9, "spentPoints");
                       });
                   });
       
                   describe("calculateMaxPossibleBetForEachGame", function () {
                       vm.calculateMaxPossibleBetForEachGame(vm.gameRows.gameRows, maxPossibleAdditionalBetForAnyGameThisWeek = 4);
       
                       it("should calculate correctly", function () {
                           assertGameWeekConstants();
                           assertUserGameSelectionsBet();
       
                           assertUserGameSelectionsMaxGameBet();
       
                       });
                   });
               });
       
               describe("when 10 bets at 1", function () {
                   var data = {};
                   var vm = {};
                   data.maxBetForAnyOneGame = 5;
                   data.minSpentPointsForAnyOneWeek = 6;
                   data.extraPointFactorPerBetOverMin = 1;
                   data.possibleBets = 16;
                   data.placedBets = 0;
                   data.bonusPoints = 0;
                   data.spentPoints = 0;
                   data.gameRows =
                           [
                               { userGameSelection: { bet: 0, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                               { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                               { userGameSelection: { bet: 0, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                               { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                               { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                               { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                               { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                               { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                               { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                               { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                               { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                               { userGameSelection: { bet: 0, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                               { userGameSelection: { bet: 0, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                               { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                               { userGameSelection: { bet: 0, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                               { userGameSelection: { bet: 0, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] }
                           ];
                   data.gameRowsHaveBeenSaved = false;
                   data.selectionDisabledForThisGameFilter = false;
                   vm = new selectionViewModel(data);
       
                   function assertGameWeekConstants() {
                       assert(vm.MAXBETFORANYONEGAME).equals(5, "MAXBETFORANYONEGAME");
                       assert(vm.MINSPENTPOINTSFORANYONEWEEK).equals(6, "MINSPENTPOINTSFORANYONEWEEK");
                       assert(vm.EXTRAPOINTFACTORPERBETOVERMIN).equals(1, "EXTRAPOINTFACTORPERBETOVERMIN");
                   };
       
                   function assertUserGameSelectionsBet() {
                       assert(vm.gameRows.gameRows.length).equals(16, "userGameSelections.length");
                       assert(vm.gameRows.gameRows[0].userGameSelection.bet).equals(0, "userGameSelections[0]");
                       assert(vm.gameRows.gameRows[1].userGameSelection.bet).equals(1, "userGameSelections[1]");
                       assert(vm.gameRows.gameRows[2].userGameSelection.bet).equals(0, "userGameSelections[2]");
                       assert(vm.gameRows.gameRows[3].userGameSelection.bet).equals(1, "userGameSelections[3]");
                       assert(vm.gameRows.gameRows[4].userGameSelection.bet).equals(1, "userGameSelections[4]");
                       assert(vm.gameRows.gameRows[5].userGameSelection.bet).equals(1, "userGameSelections[5]");
                       assert(vm.gameRows.gameRows[6].userGameSelection.bet).equals(1, "userGameSelections[6]");
                       assert(vm.gameRows.gameRows[7].userGameSelection.bet).equals(1, "userGameSelections[7]");
                       assert(vm.gameRows.gameRows[8].userGameSelection.bet).equals(1, "userGameSelections[8]");
                       assert(vm.gameRows.gameRows[9].userGameSelection.bet).equals(1, "userGameSelections[9]");
                       assert(vm.gameRows.gameRows[10].userGameSelection.bet).equals(1, "userGameSelections[10]");
                       assert(vm.gameRows.gameRows[11].userGameSelection.bet).equals(0, "userGameSelections[11]");
                       assert(vm.gameRows.gameRows[12].userGameSelection.bet).equals(0, "userGameSelections[12]");
                       assert(vm.gameRows.gameRows[13].userGameSelection.bet).equals(1, "userGameSelections[13]");
                       assert(vm.gameRows.gameRows[14].userGameSelection.bet).equals(0, "userGameSelections[14]");
                       assert(vm.gameRows.gameRows[15].userGameSelection.bet).equals(0, "userGameSelections[15]");
                   };
       
                   function assertUserGameSelectionsMaxGameBet() {
                       assert(vm.gameRows.gameRows.length).equals(16, "userGameSelections.length");
                       assert(vm.gameRows.gameRows[0].userGameSelection.maxGameBet).equals(0, "userGameSelections[0]");
                       assert(vm.gameRows.gameRows[1].userGameSelection.maxGameBet).equals(5, "userGameSelections[1]");
                       assert(vm.gameRows.gameRows[2].userGameSelection.maxGameBet).equals(0, "userGameSelections[2]");
                       assert(vm.gameRows.gameRows[3].userGameSelection.maxGameBet).equals(5, "userGameSelections[3]");
                       assert(vm.gameRows.gameRows[4].userGameSelection.maxGameBet).equals(5, "userGameSelections[4]");
                       assert(vm.gameRows.gameRows[5].userGameSelection.maxGameBet).equals(5, "userGameSelections[5]");
                       assert(vm.gameRows.gameRows[6].userGameSelection.maxGameBet).equals(5, "userGameSelections[6]");
                       assert(vm.gameRows.gameRows[7].userGameSelection.maxGameBet).equals(5, "userGameSelections[7]");
                       assert(vm.gameRows.gameRows[8].userGameSelection.maxGameBet).equals(5, "userGameSelections[8]");
                       assert(vm.gameRows.gameRows[9].userGameSelection.maxGameBet).equals(5, "userGameSelections[9]");
                       assert(vm.gameRows.gameRows[10].userGameSelection.maxGameBet).equals(5, "userGameSelections[10]");
                       assert(vm.gameRows.gameRows[11].userGameSelection.maxGameBet).equals(0, "userGameSelections[11]");
                       assert(vm.gameRows.gameRows[12].userGameSelection.maxGameBet).equals(0, "userGameSelections[12]");
                       assert(vm.gameRows.gameRows[13].userGameSelection.maxGameBet).equals(5, "userGameSelections[13]");
                       assert(vm.gameRows.gameRows[14].userGameSelection.maxGameBet).equals(0, "userGameSelections[14]");
                       assert(vm.gameRows.gameRows[15].userGameSelection.maxGameBet).equals(0, "userGameSelections[15]");
                   };
       
                   describe("calculateTotalValues", function () {
                       vm.calculateTotalValues(vm.gameRows.gameRows, vm.MINSPENTPOINTSFORANYONEWEEK, vm.EXTRAPOINTFACTORPERBETOVERMIN);
       
                       it("should calculate correctly", function () {
                           assertGameWeekConstants();
                           assertUserGameSelectionsBet();
       
                           assert(vm.possibleBets()).equals(16, "possibleBets");
                           assert(vm.placedBets()).equals(10, "placedBets");
                           assert(vm.bonusPoints()).equals(4, "bonusPoints");
                           assert(vm.spentPoints()).equals(10, "spentPoints");
                       });
                   });
       
                   describe("calculateMaxPossibleBetForEachGame", function () {
                       vm.calculateMaxPossibleBetForEachGame(vm.gameRows.gameRows, maxPossibleAdditionalBetForAnyGameThisWeek = 5);
       
                       it("should calculate correctly", function () {
                           assertGameWeekConstants();
                           assertUserGameSelectionsBet();
       
                           assertUserGameSelectionsMaxGameBet();
                       });
                   });
               });
       
               describe("when 11 bets at 1", function () {
                   var data = {};
                   var vm = {};
                   data.maxBetForAnyOneGame = 5;
                   data.minSpentPointsForAnyOneWeek = 6;
                   data.extraPointFactorPerBetOverMin = 1;
                   data.possibleBets = 16;
                   data.placedBets = 7;
                   data.bonusPoints = 0;
                   data.spentPoints = 7;
                   data.gameRows =
                           [
                               { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                               { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                               { userGameSelection: { bet: 0, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                               { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                               { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                               { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                               { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                               { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                               { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                               { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                               { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                               { userGameSelection: { bet: 0, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                               { userGameSelection: { bet: 0, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                               { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                               { userGameSelection: { bet: 0, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                               { userGameSelection: { bet: 0, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] }
                           ];
                   data.gameRowsHaveBeenSaved = false;
                   data.selectionDisabledForThisGameFilter = false;
                   vm = new selectionViewModel(data);
       
                   function assertGameWeekConstants() {
                       assert(vm.MAXBETFORANYONEGAME).equals(5, "MAXBETFORANYONEGAME");
                       assert(vm.MINSPENTPOINTSFORANYONEWEEK).equals(6, "MINSPENTPOINTSFORANYONEWEEK");
                       assert(vm.EXTRAPOINTFACTORPERBETOVERMIN).equals(1, "EXTRAPOINTFACTORPERBETOVERMIN");
                   };
       
                   function assertUserGameSelectionsBet() {
                       assert(vm.gameRows.gameRows.length).equals(16, "userGameSelections.length");
                       assert(vm.gameRows.gameRows[0].userGameSelection.bet).equals(1, "userGameSelections[0]");
                       assert(vm.gameRows.gameRows[1].userGameSelection.bet).equals(1, "userGameSelections[1]");
                       assert(vm.gameRows.gameRows[2].userGameSelection.bet).equals(0, "userGameSelections[2]");
                       assert(vm.gameRows.gameRows[3].userGameSelection.bet).equals(1, "userGameSelections[3]");
                       assert(vm.gameRows.gameRows[4].userGameSelection.bet).equals(1, "userGameSelections[4]");
                       assert(vm.gameRows.gameRows[5].userGameSelection.bet).equals(1, "userGameSelections[5]");
                       assert(vm.gameRows.gameRows[6].userGameSelection.bet).equals(1, "userGameSelections[6]");
                       assert(vm.gameRows.gameRows[7].userGameSelection.bet).equals(1, "userGameSelections[7]");
                       assert(vm.gameRows.gameRows[8].userGameSelection.bet).equals(1, "userGameSelections[8]");
                       assert(vm.gameRows.gameRows[9].userGameSelection.bet).equals(1, "userGameSelections[9]");
                       assert(vm.gameRows.gameRows[10].userGameSelection.bet).equals(1, "userGameSelections[10]");
                       assert(vm.gameRows.gameRows[11].userGameSelection.bet).equals(0, "userGameSelections[11]");
                       assert(vm.gameRows.gameRows[12].userGameSelection.bet).equals(0, "userGameSelections[12]");
                       assert(vm.gameRows.gameRows[13].userGameSelection.bet).equals(1, "userGameSelections[13]");
                       assert(vm.gameRows.gameRows[14].userGameSelection.bet).equals(0, "userGameSelections[14]");
                       assert(vm.gameRows.gameRows[15].userGameSelection.bet).equals(0, "userGameSelections[15]");
                   };
       
                   function assertUserGameSelectionsMaxGameBet() {
                       assert(vm.gameRows.gameRows.length).equals(16, "userGameSelections.length");
                       assert(vm.gameRows.gameRows[0].userGameSelection.maxGameBet).equals(5, "userGameSelections[0]");
                       assert(vm.gameRows.gameRows[1].userGameSelection.maxGameBet).equals(5, "userGameSelections[1]");
                       assert(vm.gameRows.gameRows[2].userGameSelection.maxGameBet).equals(0, "userGameSelections[2]");
                       assert(vm.gameRows.gameRows[3].userGameSelection.maxGameBet).equals(5, "userGameSelections[3]");
                       assert(vm.gameRows.gameRows[4].userGameSelection.maxGameBet).equals(5, "userGameSelections[4]");
                       assert(vm.gameRows.gameRows[5].userGameSelection.maxGameBet).equals(5, "userGameSelections[5]");
                       assert(vm.gameRows.gameRows[6].userGameSelection.maxGameBet).equals(5, "userGameSelections[6]");
                       assert(vm.gameRows.gameRows[7].userGameSelection.maxGameBet).equals(5, "userGameSelections[7]");
                       assert(vm.gameRows.gameRows[8].userGameSelection.maxGameBet).equals(5, "userGameSelections[8]");
                       assert(vm.gameRows.gameRows[9].userGameSelection.maxGameBet).equals(5, "userGameSelections[9]");
                       assert(vm.gameRows.gameRows[10].userGameSelection.maxGameBet).equals(5, "userGameSelections[10]");
                       assert(vm.gameRows.gameRows[11].userGameSelection.maxGameBet).equals(0, "userGameSelections[11]");
                       assert(vm.gameRows.gameRows[12].userGameSelection.maxGameBet).equals(0, "userGameSelections[12]");
                       assert(vm.gameRows.gameRows[13].userGameSelection.maxGameBet).equals(5, "userGameSelections[13]");
                       assert(vm.gameRows.gameRows[14].userGameSelection.maxGameBet).equals(0, "userGameSelections[14]");
                       assert(vm.gameRows.gameRows[15].userGameSelection.maxGameBet).equals(0, "userGameSelections[15]");
                   };
       
                   describe("calculateTotalValues", function () {
                       vm.calculateTotalValues(vm.gameRows.gameRows, vm.MINSPENTPOINTSFORANYONEWEEK, vm.EXTRAPOINTFACTORPERBETOVERMIN);
       
                       it("should calculate correctly", function () {
                           assertGameWeekConstants();
                           assertUserGameSelectionsBet();
       
                           assert(vm.possibleBets()).equals(16, "possibleBets");
                           assert(vm.placedBets()).equals(11, "placedBets");
                           assert(vm.bonusPoints()).equals(5, "bonusPoints");
                           assert(vm.spentPoints()).equals(11, "spentPoints");
                       });
                   });
       
                   describe("calculateMaxPossibleBetForEachGame", function () {
                       vm.calculateMaxPossibleBetForEachGame(vm.gameRows.gameRows, maxPossibleAdditionalBetForAnyGameThisWeek = 5);
       
                       it("should calculate correctly", function () {
                           assertGameWeekConstants();
                           assertUserGameSelectionsBet();
       
                           assertUserGameSelectionsMaxGameBet();
       
                       });
                   });
               });
       
               describe("when 12 bets at 1", function () {
                   var data = {};
                   var vm = {};
                   data.maxBetForAnyOneGame = 5;
                   data.minSpentPointsForAnyOneWeek = 6;
                   data.extraPointFactorPerBetOverMin = 1;
                   data.possibleBets = 16;
                   data.placedBets = 7;
                   data.bonusPoints = 0;
                   data.spentPoints = 7;
                   data.gameRows =
                           [
                               { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                               { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                               { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                               { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                               { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                               { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                               { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                               { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                               { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                               { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                               { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                               { userGameSelection: { bet: 0, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                               { userGameSelection: { bet: 0, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                               { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                               { userGameSelection: { bet: 0, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                               { userGameSelection: { bet: 0, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] }
                           ];
                   data.gameRowsHaveBeenSaved = false;
                   data.selectionDisabledForThisGameFilter = false;
                   vm = new selectionViewModel(data);
       
                   function assertGameWeekConstants() {
                       assert(vm.MAXBETFORANYONEGAME).equals(5, "MAXBETFORANYONEGAME");
                       assert(vm.MINSPENTPOINTSFORANYONEWEEK).equals(6, "MINSPENTPOINTSFORANYONEWEEK");
                       assert(vm.EXTRAPOINTFACTORPERBETOVERMIN).equals(1, "EXTRAPOINTFACTORPERBETOVERMIN");
                   };
       
                   function assertUserGameSelectionsBet() {
                       assert(vm.gameRows.gameRows.length).equals(16, "userGameSelections.length");
                       assert(vm.gameRows.gameRows[0].userGameSelection.bet).equals(1, "userGameSelections[0]");
                       assert(vm.gameRows.gameRows[1].userGameSelection.bet).equals(1, "userGameSelections[1]");
                       assert(vm.gameRows.gameRows[2].userGameSelection.bet).equals(1, "userGameSelections[2]");
                       assert(vm.gameRows.gameRows[3].userGameSelection.bet).equals(1, "userGameSelections[3]");
                       assert(vm.gameRows.gameRows[4].userGameSelection.bet).equals(1, "userGameSelections[4]");
                       assert(vm.gameRows.gameRows[5].userGameSelection.bet).equals(1, "userGameSelections[5]");
                       assert(vm.gameRows.gameRows[6].userGameSelection.bet).equals(1, "userGameSelections[6]");
                       assert(vm.gameRows.gameRows[7].userGameSelection.bet).equals(1, "userGameSelections[7]");
                       assert(vm.gameRows.gameRows[8].userGameSelection.bet).equals(1, "userGameSelections[8]");
                       assert(vm.gameRows.gameRows[9].userGameSelection.bet).equals(1, "userGameSelections[9]");
                       assert(vm.gameRows.gameRows[10].userGameSelection.bet).equals(1, "userGameSelections[10]");
                       assert(vm.gameRows.gameRows[11].userGameSelection.bet).equals(0, "userGameSelections[11]");
                       assert(vm.gameRows.gameRows[12].userGameSelection.bet).equals(0, "userGameSelections[12]");
                       assert(vm.gameRows.gameRows[13].userGameSelection.bet).equals(1, "userGameSelections[13]");
                       assert(vm.gameRows.gameRows[14].userGameSelection.bet).equals(0, "userGameSelections[14]");
                       assert(vm.gameRows.gameRows[15].userGameSelection.bet).equals(0, "userGameSelections[15]");
                   };
       
                   function assertUserGameSelectionsMaxGameBet() {
                       assert(vm.gameRows.gameRows.length).equals(16, "userGameSelections.length");
                       assert(vm.gameRows.gameRows[0].userGameSelection.maxGameBet).equals(5, "userGameSelections[0]");
                       assert(vm.gameRows.gameRows[1].userGameSelection.maxGameBet).equals(5, "userGameSelections[1]");
                       assert(vm.gameRows.gameRows[2].userGameSelection.maxGameBet).equals(5, "userGameSelections[2]");
                       assert(vm.gameRows.gameRows[3].userGameSelection.maxGameBet).equals(5, "userGameSelections[3]");
                       assert(vm.gameRows.gameRows[4].userGameSelection.maxGameBet).equals(5, "userGameSelections[4]");
                       assert(vm.gameRows.gameRows[5].userGameSelection.maxGameBet).equals(5, "userGameSelections[5]");
                       assert(vm.gameRows.gameRows[6].userGameSelection.maxGameBet).equals(5, "userGameSelections[6]");
                       assert(vm.gameRows.gameRows[7].userGameSelection.maxGameBet).equals(5, "userGameSelections[7]");
                       assert(vm.gameRows.gameRows[8].userGameSelection.maxGameBet).equals(5, "userGameSelections[8]");
                       assert(vm.gameRows.gameRows[9].userGameSelection.maxGameBet).equals(5, "userGameSelections[9]");
                       assert(vm.gameRows.gameRows[10].userGameSelection.maxGameBet).equals(5, "userGameSelections[10]");
                       assert(vm.gameRows.gameRows[11].userGameSelection.maxGameBet).equals(0, "userGameSelections[11]");
                       assert(vm.gameRows.gameRows[12].userGameSelection.maxGameBet).equals(0, "userGameSelections[12]");
                       assert(vm.gameRows.gameRows[13].userGameSelection.maxGameBet).equals(5, "userGameSelections[13]");
                       assert(vm.gameRows.gameRows[14].userGameSelection.maxGameBet).equals(0, "userGameSelections[14]");
                       assert(vm.gameRows.gameRows[15].userGameSelection.maxGameBet).equals(0, "userGameSelections[15]");
                   };
       
                   describe("calculateTotalValues", function () {
                       vm.calculateTotalValues(vm.gameRows.gameRows, vm.MINSPENTPOINTSFORANYONEWEEK, vm.EXTRAPOINTFACTORPERBETOVERMIN);
       
                       it("should calculate correctly", function () {
                           assertGameWeekConstants();
                           assertUserGameSelectionsBet();
       
                           assert(vm.possibleBets()).equals(16, "possibleBets");
                           assert(vm.placedBets()).equals(12, "placedBets");
                           assert(vm.bonusPoints()).equals(6, "bonusPoints");
                           assert(vm.spentPoints()).equals(12, "spentPoints");
                       });
                   });
       
                   describe("calculateMaxPossibleBetForEachGame", function () {
                       vm.calculateMaxPossibleBetForEachGame(vm.gameRows.gameRows, maxPossibleAdditionalBetForAnyGameThisWeek = 5);
       
                       it("should calculate correctly", function () {
                           assertGameWeekConstants();
                           assertUserGameSelectionsBet();
       
                           assertUserGameSelectionsMaxGameBet();
       
                       });
                   });
               });
       
               describe("when 13 bets at 1", function () {
                   var data = {};
                   var vm = {};
                   data.maxBetForAnyOneGame = 5;
                   data.minSpentPointsForAnyOneWeek = 6;
                   data.extraPointFactorPerBetOverMin = 1;
                   data.possibleBets = 16;
                   data.placedBets = 7;
                   data.bonusPoints = 0;
                   data.spentPoints = 7;
                   data.gameRows =
                           [
                               { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                               { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                               { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                               { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                               { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                               { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                               { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                               { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                               { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                               { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                               { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                               { userGameSelection: { bet: 0, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                               { userGameSelection: { bet: 0, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                               { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                               { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                               { userGameSelection: { bet: 0, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] }
                           ];
                   data.gameRowsHaveBeenSaved = false;
                   data.selectionDisabledForThisGameFilter = false;
                   vm = new selectionViewModel(data);
       
                   function assertGameWeekConstants() {
                       assert(vm.MAXBETFORANYONEGAME).equals(5, "MAXBETFORANYONEGAME");
                       assert(vm.MINSPENTPOINTSFORANYONEWEEK).equals(6, "MINSPENTPOINTSFORANYONEWEEK");
                       assert(vm.EXTRAPOINTFACTORPERBETOVERMIN).equals(1, "EXTRAPOINTFACTORPERBETOVERMIN");
                   };
       
                   function assertUserGameSelectionsBet() {
                       assert(vm.gameRows.gameRows.length).equals(16, "userGameSelections.length");
                       assert(vm.gameRows.gameRows[0].userGameSelection.bet).equals(1, "userGameSelections[0]");
                       assert(vm.gameRows.gameRows[1].userGameSelection.bet).equals(1, "userGameSelections[1]");
                       assert(vm.gameRows.gameRows[2].userGameSelection.bet).equals(1, "userGameSelections[2]");
                       assert(vm.gameRows.gameRows[3].userGameSelection.bet).equals(1, "userGameSelections[3]");
                       assert(vm.gameRows.gameRows[4].userGameSelection.bet).equals(1, "userGameSelections[4]");
                       assert(vm.gameRows.gameRows[5].userGameSelection.bet).equals(1, "userGameSelections[5]");
                       assert(vm.gameRows.gameRows[6].userGameSelection.bet).equals(1, "userGameSelections[6]");
                       assert(vm.gameRows.gameRows[7].userGameSelection.bet).equals(1, "userGameSelections[7]");
                       assert(vm.gameRows.gameRows[8].userGameSelection.bet).equals(1, "userGameSelections[8]");
                       assert(vm.gameRows.gameRows[9].userGameSelection.bet).equals(1, "userGameSelections[9]");
                       assert(vm.gameRows.gameRows[10].userGameSelection.bet).equals(1, "userGameSelections[10]");
                       assert(vm.gameRows.gameRows[11].userGameSelection.bet).equals(0, "userGameSelections[11]");
                       assert(vm.gameRows.gameRows[12].userGameSelection.bet).equals(0, "userGameSelections[12]");
                       assert(vm.gameRows.gameRows[13].userGameSelection.bet).equals(1, "userGameSelections[13]");
                       assert(vm.gameRows.gameRows[14].userGameSelection.bet).equals(1, "userGameSelections[14]");
                       assert(vm.gameRows.gameRows[15].userGameSelection.bet).equals(0, "userGameSelections[15]");
                   };
       
                   function assertUserGameSelectionsMaxGameBet() {
                       assert(vm.gameRows.gameRows.length).equals(16, "userGameSelections.length");
                       assert(vm.gameRows.gameRows[0].userGameSelection.maxGameBet).equals(5, "userGameSelections[0]");
                       assert(vm.gameRows.gameRows[1].userGameSelection.maxGameBet).equals(5, "userGameSelections[1]");
                       assert(vm.gameRows.gameRows[2].userGameSelection.maxGameBet).equals(5, "userGameSelections[2]");
                       assert(vm.gameRows.gameRows[3].userGameSelection.maxGameBet).equals(5, "userGameSelections[3]");
                       assert(vm.gameRows.gameRows[4].userGameSelection.maxGameBet).equals(5, "userGameSelections[4]");
                       assert(vm.gameRows.gameRows[5].userGameSelection.maxGameBet).equals(5, "userGameSelections[5]");
                       assert(vm.gameRows.gameRows[6].userGameSelection.maxGameBet).equals(5, "userGameSelections[6]");
                       assert(vm.gameRows.gameRows[7].userGameSelection.maxGameBet).equals(5, "userGameSelections[7]");
                       assert(vm.gameRows.gameRows[8].userGameSelection.maxGameBet).equals(5, "userGameSelections[8]");
                       assert(vm.gameRows.gameRows[9].userGameSelection.maxGameBet).equals(5, "userGameSelections[9]");
                       assert(vm.gameRows.gameRows[10].userGameSelection.maxGameBet).equals(5, "userGameSelections[10]");
                       assert(vm.gameRows.gameRows[11].userGameSelection.maxGameBet).equals(0, "userGameSelections[11]");
                       assert(vm.gameRows.gameRows[12].userGameSelection.maxGameBet).equals(0, "userGameSelections[12]");
                       assert(vm.gameRows.gameRows[13].userGameSelection.maxGameBet).equals(5, "userGameSelections[13]");
                       assert(vm.gameRows.gameRows[14].userGameSelection.maxGameBet).equals(5, "userGameSelections[14]");
                       assert(vm.gameRows.gameRows[15].userGameSelection.maxGameBet).equals(0, "userGameSelections[15]");
                   };
       
                   describe("calculateTotalValues", function () {
                       vm.calculateTotalValues(vm.gameRows.gameRows, vm.MINSPENTPOINTSFORANYONEWEEK, vm.EXTRAPOINTFACTORPERBETOVERMIN);
       
                       it("should calculate correctly", function () {
                           assertGameWeekConstants();
                           assertUserGameSelectionsBet();
       
                           assert(vm.possibleBets()).equals(16, "possibleBets");
                           assert(vm.placedBets()).equals(13, "placedBets");
                           assert(vm.bonusPoints()).equals(7, "bonusPoints");
                           assert(vm.spentPoints()).equals(13, "spentPoints");
                       });
                   });
       
       
                   describe("calculateMaxPossibleBetForEachGame", function () {
                       vm.calculateMaxPossibleBetForEachGame(vm.gameRows.gameRows, maxPossibleAdditionalBetForAnyGameThisWeek = 5);
       
                       it("should calculate correctly", function () {
                           assertGameWeekConstants();
                           assertUserGameSelectionsBet();
       
                           assertUserGameSelectionsMaxGameBet();
       
                       });
                   });
               });
       
               describe("when 14 bets at 1", function () {
                   var data = {};
                   var vm = {};
                   data.maxBetForAnyOneGame = 5;
                   data.minSpentPointsForAnyOneWeek = 6;
                   data.extraPointFactorPerBetOverMin = 1;
                   data.possibleBets = 16;
                   data.placedBets = 7;
                   data.bonusPoints = 0;
                   data.spentPoints = 7;
                   data.gameRows =
                           [
                               { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                               { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                               { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                               { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                               { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                               { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                               { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                               { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                               { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                               { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                               { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                               { userGameSelection: { bet: 0, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                               { userGameSelection: { bet: 0, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                               { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                               { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                               { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] }
                           ];
                   data.gameRowsHaveBeenSaved = false;
                   data.selectionDisabledForThisGameFilter = false;
                   vm = new selectionViewModel(data);
       
                   function assertGameWeekConstants() {
                       assert(vm.MAXBETFORANYONEGAME).equals(5, "MAXBETFORANYONEGAME");
                       assert(vm.MINSPENTPOINTSFORANYONEWEEK).equals(6, "MINSPENTPOINTSFORANYONEWEEK");
                       assert(vm.EXTRAPOINTFACTORPERBETOVERMIN).equals(1, "EXTRAPOINTFACTORPERBETOVERMIN");
                   };
       
                   function assertUserGameSelectionsBet() {
                       assert(vm.gameRows.gameRows.length).equals(16, "userGameSelections.length");
                       assert(vm.gameRows.gameRows[0].userGameSelection.bet).equals(1, "userGameSelections[0]");
                       assert(vm.gameRows.gameRows[1].userGameSelection.bet).equals(1, "userGameSelections[1]");
                       assert(vm.gameRows.gameRows[2].userGameSelection.bet).equals(1, "userGameSelections[2]");
                       assert(vm.gameRows.gameRows[3].userGameSelection.bet).equals(1, "userGameSelections[3]");
                       assert(vm.gameRows.gameRows[4].userGameSelection.bet).equals(1, "userGameSelections[4]");
                       assert(vm.gameRows.gameRows[5].userGameSelection.bet).equals(1, "userGameSelections[5]");
                       assert(vm.gameRows.gameRows[6].userGameSelection.bet).equals(1, "userGameSelections[6]");
                       assert(vm.gameRows.gameRows[7].userGameSelection.bet).equals(1, "userGameSelections[7]");
                       assert(vm.gameRows.gameRows[8].userGameSelection.bet).equals(1, "userGameSelections[8]");
                       assert(vm.gameRows.gameRows[9].userGameSelection.bet).equals(1, "userGameSelections[9]");
                       assert(vm.gameRows.gameRows[10].userGameSelection.bet).equals(1, "userGameSelections[10]");
                       assert(vm.gameRows.gameRows[11].userGameSelection.bet).equals(0, "userGameSelections[11]");
                       assert(vm.gameRows.gameRows[12].userGameSelection.bet).equals(0, "userGameSelections[12]");
                       assert(vm.gameRows.gameRows[13].userGameSelection.bet).equals(1, "userGameSelections[13]");
                       assert(vm.gameRows.gameRows[14].userGameSelection.bet).equals(1, "userGameSelections[14]");
                       assert(vm.gameRows.gameRows[15].userGameSelection.bet).equals(1, "userGameSelections[15]");
                   };
       
                   function assertUserGameSelectionsMaxGameBet() {
                       assert(vm.gameRows.gameRows.length).equals(16, "userGameSelections.length");
                       assert(vm.gameRows.gameRows[0].userGameSelection.maxGameBet).equals(5, "userGameSelections[0]");
                       assert(vm.gameRows.gameRows[1].userGameSelection.maxGameBet).equals(5, "userGameSelections[1]");
                       assert(vm.gameRows.gameRows[2].userGameSelection.maxGameBet).equals(5, "userGameSelections[2]");
                       assert(vm.gameRows.gameRows[3].userGameSelection.maxGameBet).equals(5, "userGameSelections[3]");
                       assert(vm.gameRows.gameRows[4].userGameSelection.maxGameBet).equals(5, "userGameSelections[4]");
                       assert(vm.gameRows.gameRows[5].userGameSelection.maxGameBet).equals(5, "userGameSelections[5]");
                       assert(vm.gameRows.gameRows[6].userGameSelection.maxGameBet).equals(5, "userGameSelections[6]");
                       assert(vm.gameRows.gameRows[7].userGameSelection.maxGameBet).equals(5, "userGameSelections[7]");
                       assert(vm.gameRows.gameRows[8].userGameSelection.maxGameBet).equals(5, "userGameSelections[8]");
                       assert(vm.gameRows.gameRows[9].userGameSelection.maxGameBet).equals(5, "userGameSelections[9]");
                       assert(vm.gameRows.gameRows[10].userGameSelection.maxGameBet).equals(5, "userGameSelections[10]");
                       assert(vm.gameRows.gameRows[11].userGameSelection.maxGameBet).equals(0, "userGameSelections[11]");
                       assert(vm.gameRows.gameRows[12].userGameSelection.maxGameBet).equals(0, "userGameSelections[12]");
                       assert(vm.gameRows.gameRows[13].userGameSelection.maxGameBet).equals(5, "userGameSelections[13]");
                       assert(vm.gameRows.gameRows[14].userGameSelection.maxGameBet).equals(5, "userGameSelections[14]");
                       assert(vm.gameRows.gameRows[15].userGameSelection.maxGameBet).equals(5, "userGameSelections[15]");
                   };
       
                   describe("calculateTotalValues", function () {
                       vm.calculateTotalValues(vm.gameRows.gameRows, vm.MINSPENTPOINTSFORANYONEWEEK, vm.EXTRAPOINTFACTORPERBETOVERMIN);
       
                       it("should calculate correctly", function () {
                           assertGameWeekConstants();
                           assertUserGameSelectionsBet();
       
                           assert(vm.possibleBets()).equals(16, "possibleBets");
                           assert(vm.placedBets()).equals(14, "placedBets");
                           assert(vm.bonusPoints()).equals(8, "bonusPoints");
                           assert(vm.spentPoints()).equals(14, "spentPoints");
                       });
                   });
       
                   describe("calculateMaxPossibleBetForEachGame", function () {
                       vm.calculateMaxPossibleBetForEachGame(vm.gameRows.gameRows, maxPossibleAdditionalBetForAnyGameThisWeek = 5);
       
                       it("should calculate correctly", function () {
                           assertGameWeekConstants();
                           assertUserGameSelectionsBet();
       
                           assertUserGameSelectionsMaxGameBet();
       
                       });
                   });
               });
       
               describe("when 15 bets at 1", function () {
                   var data = {};
                   var vm = {};
                   data.maxBetForAnyOneGame = 5;
                   data.minSpentPointsForAnyOneWeek = 6;
                   data.extraPointFactorPerBetOverMin = 1;
                   data.possibleBets = 16;
                   data.placedBets = 7;
                   data.bonusPoints = 0;
                   data.spentPoints = 7;
                   data.gameRows =
                           [
                               { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                               { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                               { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                               { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                               { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                               { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                               { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                               { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                               { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                               { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                               { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                               { userGameSelection: { bet: 0, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                               { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                               { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                               { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                               { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] }
                           ];
                   data.gameRowsHaveBeenSaved = false;
                   data.selectionDisabledForThisGameFilter = false;
                   vm = new selectionViewModel(data);
       
                   function assertGameWeekConstants() {
                       assert(vm.MAXBETFORANYONEGAME).equals(5, "MAXBETFORANYONEGAME");
                       assert(vm.MINSPENTPOINTSFORANYONEWEEK).equals(6, "MINSPENTPOINTSFORANYONEWEEK");
                       assert(vm.EXTRAPOINTFACTORPERBETOVERMIN).equals(1, "EXTRAPOINTFACTORPERBETOVERMIN");
                   };
       
                   function assertUserGameSelectionsBet() {
                       assert(vm.gameRows.gameRows.length).equals(16, "userGameSelections.length");
                       assert(vm.gameRows.gameRows[0].userGameSelection.bet).equals(1, "userGameSelections[0]");
                       assert(vm.gameRows.gameRows[1].userGameSelection.bet).equals(1, "userGameSelections[1]");
                       assert(vm.gameRows.gameRows[2].userGameSelection.bet).equals(1, "userGameSelections[2]");
                       assert(vm.gameRows.gameRows[3].userGameSelection.bet).equals(1, "userGameSelections[3]");
                       assert(vm.gameRows.gameRows[4].userGameSelection.bet).equals(1, "userGameSelections[4]");
                       assert(vm.gameRows.gameRows[5].userGameSelection.bet).equals(1, "userGameSelections[5]");
                       assert(vm.gameRows.gameRows[6].userGameSelection.bet).equals(1, "userGameSelections[6]");
                       assert(vm.gameRows.gameRows[7].userGameSelection.bet).equals(1, "userGameSelections[7]");
                       assert(vm.gameRows.gameRows[8].userGameSelection.bet).equals(1, "userGameSelections[8]");
                       assert(vm.gameRows.gameRows[9].userGameSelection.bet).equals(1, "userGameSelections[9]");
                       assert(vm.gameRows.gameRows[10].userGameSelection.bet).equals(1, "userGameSelections[10]");
                       assert(vm.gameRows.gameRows[11].userGameSelection.bet).equals(0, "userGameSelections[11]");
                       assert(vm.gameRows.gameRows[12].userGameSelection.bet).equals(1, "userGameSelections[12]");
                       assert(vm.gameRows.gameRows[13].userGameSelection.bet).equals(1, "userGameSelections[13]");
                       assert(vm.gameRows.gameRows[14].userGameSelection.bet).equals(1, "userGameSelections[14]");
                       assert(vm.gameRows.gameRows[15].userGameSelection.bet).equals(1, "userGameSelections[15]");
                   };
       
                   function assertUserGameSelectionsMaxGameBet() {
                       assert(vm.gameRows.gameRows.length).equals(16, "userGameSelections.length");
                       assert(vm.gameRows.gameRows[0].userGameSelection.maxGameBet).equals(5, "userGameSelections[0]");
                       assert(vm.gameRows.gameRows[1].userGameSelection.maxGameBet).equals(5, "userGameSelections[1]");
                       assert(vm.gameRows.gameRows[2].userGameSelection.maxGameBet).equals(5, "userGameSelections[2]");
                       assert(vm.gameRows.gameRows[3].userGameSelection.maxGameBet).equals(5, "userGameSelections[3]");
                       assert(vm.gameRows.gameRows[4].userGameSelection.maxGameBet).equals(5, "userGameSelections[4]");
                       assert(vm.gameRows.gameRows[5].userGameSelection.maxGameBet).equals(5, "userGameSelections[5]");
                       assert(vm.gameRows.gameRows[6].userGameSelection.maxGameBet).equals(5, "userGameSelections[6]");
                       assert(vm.gameRows.gameRows[7].userGameSelection.maxGameBet).equals(5, "userGameSelections[7]");
                       assert(vm.gameRows.gameRows[8].userGameSelection.maxGameBet).equals(5, "userGameSelections[8]");
                       assert(vm.gameRows.gameRows[9].userGameSelection.maxGameBet).equals(5, "userGameSelections[9]");
                       assert(vm.gameRows.gameRows[10].userGameSelection.maxGameBet).equals(5, "userGameSelections[10]");
                       assert(vm.gameRows.gameRows[11].userGameSelection.maxGameBet).equals(0, "userGameSelections[11]");
                       assert(vm.gameRows.gameRows[12].userGameSelection.maxGameBet).equals(5, "userGameSelections[12]");
                       assert(vm.gameRows.gameRows[13].userGameSelection.maxGameBet).equals(5, "userGameSelections[13]");
                       assert(vm.gameRows.gameRows[14].userGameSelection.maxGameBet).equals(5, "userGameSelections[14]");
                       assert(vm.gameRows.gameRows[15].userGameSelection.maxGameBet).equals(5, "userGameSelections[15]");
                   };
       
                   describe("calculateTotalValues", function () {
                       vm.calculateTotalValues(vm.gameRows.gameRows, vm.MINSPENTPOINTSFORANYONEWEEK, vm.EXTRAPOINTFACTORPERBETOVERMIN);
       
                       it("should calculate correctly", function () {
                           assertGameWeekConstants();
                           assertUserGameSelectionsBet();
       
                           assert(vm.possibleBets()).equals(16, "possibleBets");
                           assert(vm.placedBets()).equals(15, "placedBets");
                           assert(vm.bonusPoints()).equals(9, "bonusPoints");
                           assert(vm.spentPoints()).equals(15, "spentPoints");
                       });
                   });
       
                   describe("calculateMaxPossibleBetForEachGame", function () {
                       vm.calculateMaxPossibleBetForEachGame(vm.gameRows.gameRows, maxPossibleAdditionalBetForAnyGameThisWeek = 5);
       
                       it("should calculate correctly", function () {
                           assertGameWeekConstants();
                           assertUserGameSelectionsBet();
       
                           assertUserGameSelectionsMaxGameBet();
       
                       });
                   });
               });
       
               describe("when 16 bets at 1", function () {
                   var data = {};
                   var vm = {};
                   data.maxBetForAnyOneGame = 5;
                   data.minSpentPointsForAnyOneWeek = 6;
                   data.extraPointFactorPerBetOverMin = 1;
                   data.possibleBets = 16;
                   data.placedBets = 7;
                   data.bonusPoints = 0;
                   data.spentPoints = 7;
                   data.gameRows =
                           [
                               { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                               { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                               { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                               { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                               { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                               { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                               { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                               { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                               { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                               { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                               { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                               { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                               { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                               { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                               { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                               { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] }
                           ];
                   data.gameRowsHaveBeenSaved = false;
                   data.selectionDisabledForThisGameFilter = false;
                   vm = new selectionViewModel(data);
       
                   function assertGameWeekConstants() {
                       assert(vm.MAXBETFORANYONEGAME).equals(5, "MAXBETFORANYONEGAME");
                       assert(vm.MINSPENTPOINTSFORANYONEWEEK).equals(6, "MINSPENTPOINTSFORANYONEWEEK");
                       assert(vm.EXTRAPOINTFACTORPERBETOVERMIN).equals(1, "EXTRAPOINTFACTORPERBETOVERMIN");
                   };
       
                   function assertUserGameSelectionsBet() {
                       assert(vm.gameRows.gameRows.length).equals(16, "userGameSelections.length");
                       assert(vm.gameRows.gameRows[0].userGameSelection.bet).equals(1, "userGameSelections[0]");
                       assert(vm.gameRows.gameRows[1].userGameSelection.bet).equals(1, "userGameSelections[1]");
                       assert(vm.gameRows.gameRows[2].userGameSelection.bet).equals(1, "userGameSelections[2]");
                       assert(vm.gameRows.gameRows[3].userGameSelection.bet).equals(1, "userGameSelections[3]");
                       assert(vm.gameRows.gameRows[4].userGameSelection.bet).equals(1, "userGameSelections[4]");
                       assert(vm.gameRows.gameRows[5].userGameSelection.bet).equals(1, "userGameSelections[5]");
                       assert(vm.gameRows.gameRows[6].userGameSelection.bet).equals(1, "userGameSelections[6]");
                       assert(vm.gameRows.gameRows[7].userGameSelection.bet).equals(1, "userGameSelections[7]");
                       assert(vm.gameRows.gameRows[8].userGameSelection.bet).equals(1, "userGameSelections[8]");
                       assert(vm.gameRows.gameRows[9].userGameSelection.bet).equals(1, "userGameSelections[9]");
                       assert(vm.gameRows.gameRows[10].userGameSelection.bet).equals(1, "userGameSelections[10]");
                       assert(vm.gameRows.gameRows[11].userGameSelection.bet).equals(1, "userGameSelections[11]");
                       assert(vm.gameRows.gameRows[12].userGameSelection.bet).equals(1, "userGameSelections[12]");
                       assert(vm.gameRows.gameRows[13].userGameSelection.bet).equals(1, "userGameSelections[13]");
                       assert(vm.gameRows.gameRows[14].userGameSelection.bet).equals(1, "userGameSelections[14]");
                       assert(vm.gameRows.gameRows[15].userGameSelection.bet).equals(1, "userGameSelections[15]");
                   };
       
                   function assertUserGameSelectionsMaxGameBet() {
                       assert(vm.gameRows.gameRows.length).equals(16, "userGameSelections.length");
                       assert(vm.gameRows.gameRows[0].userGameSelection.maxGameBet).equals(5, "userGameSelections[0]");
                       assert(vm.gameRows.gameRows[1].userGameSelection.maxGameBet).equals(5, "userGameSelections[1]");
                       assert(vm.gameRows.gameRows[2].userGameSelection.maxGameBet).equals(5, "userGameSelections[2]");
                       assert(vm.gameRows.gameRows[3].userGameSelection.maxGameBet).equals(5, "userGameSelections[3]");
                       assert(vm.gameRows.gameRows[4].userGameSelection.maxGameBet).equals(5, "userGameSelections[4]");
                       assert(vm.gameRows.gameRows[5].userGameSelection.maxGameBet).equals(5, "userGameSelections[5]");
                       assert(vm.gameRows.gameRows[6].userGameSelection.maxGameBet).equals(5, "userGameSelections[6]");
                       assert(vm.gameRows.gameRows[7].userGameSelection.maxGameBet).equals(5, "userGameSelections[7]");
                       assert(vm.gameRows.gameRows[8].userGameSelection.maxGameBet).equals(5, "userGameSelections[8]");
                       assert(vm.gameRows.gameRows[9].userGameSelection.maxGameBet).equals(5, "userGameSelections[9]");
                       assert(vm.gameRows.gameRows[10].userGameSelection.maxGameBet).equals(5, "userGameSelections[10]");
                       assert(vm.gameRows.gameRows[11].userGameSelection.maxGameBet).equals(5, "userGameSelections[11]");
                       assert(vm.gameRows.gameRows[12].userGameSelection.maxGameBet).equals(5, "userGameSelections[12]");
                       assert(vm.gameRows.gameRows[13].userGameSelection.maxGameBet).equals(5, "userGameSelections[13]");
                       assert(vm.gameRows.gameRows[14].userGameSelection.maxGameBet).equals(5, "userGameSelections[14]");
                       assert(vm.gameRows.gameRows[15].userGameSelection.maxGameBet).equals(5, "userGameSelections[15]");
                   };
       
                   describe("calculateTotalValues", function () {
                       vm.calculateTotalValues(vm.gameRows.gameRows, vm.MINSPENTPOINTSFORANYONEWEEK, vm.EXTRAPOINTFACTORPERBETOVERMIN);
       
                       it("should calculate correctly", function () {
                           assertGameWeekConstants();
                           assertUserGameSelectionsBet();
       
                           assert(vm.possibleBets()).equals(16, "possibleBets");
                           assert(vm.placedBets()).equals(16, "placedBets");
                           assert(vm.bonusPoints()).equals(10, "bonusPoints");
                           assert(vm.spentPoints()).equals(16, "spentPoints");
                       });
                   });
       
                   describe("calculateMaxPossibleBetForEachGame", function () {
                       vm.calculateMaxPossibleBetForEachGame(vm.gameRows.gameRows, maxPossibleAdditionalBetForAnyGameThisWeek = 5);
       
                       it("should calculate correctly", function () {
                           assertGameWeekConstants();
                           assertUserGameSelectionsBet();
       
                           assertUserGameSelectionsMaxGameBet();
       
                       });
                   });
               });
       
               describe("when 15 bets at 1, 1 bet 2", function () {
                   var data = {};
                   var vm = {};
                   data.maxBetForAnyOneGame = 5;
                   data.minSpentPointsForAnyOneWeek = 6;
                   data.extraPointFactorPerBetOverMin = 1;
                   data.possibleBets = 16;
                   data.placedBets = 7;
                   data.bonusPoints = 0;
                   data.spentPoints = 7;
                   data.gameRows =
                           [
                               { userGameSelection: { bet: 2, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 2 }] },
                               { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                               { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                               { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                               { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                               { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                               { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                               { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                               { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                               { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                               { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                               { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                               { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                               { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                               { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                               { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] }
                           ];
                   data.gameRowsHaveBeenSaved = false;
                   data.selectionDisabledForThisGameFilter = false;
                   vm = new selectionViewModel(data);
       
                   function assertGameWeekConstants() {
                       assert(vm.MAXBETFORANYONEGAME).equals(5, "MAXBETFORANYONEGAME");
                       assert(vm.MINSPENTPOINTSFORANYONEWEEK).equals(6, "MINSPENTPOINTSFORANYONEWEEK");
                       assert(vm.EXTRAPOINTFACTORPERBETOVERMIN).equals(1, "EXTRAPOINTFACTORPERBETOVERMIN");
                   };
       
                   function assertUserGameSelectionsBet() {
                       assert(vm.gameRows.gameRows.length).equals(16, "userGameSelections.length");
                       assert(vm.gameRows.gameRows[0].userGameSelection.bet).equals(2, "userGameSelections[0]");
                       assert(vm.gameRows.gameRows[1].userGameSelection.bet).equals(1, "userGameSelections[1]");
                       assert(vm.gameRows.gameRows[2].userGameSelection.bet).equals(1, "userGameSelections[2]");
                       assert(vm.gameRows.gameRows[3].userGameSelection.bet).equals(1, "userGameSelections[3]");
                       assert(vm.gameRows.gameRows[4].userGameSelection.bet).equals(1, "userGameSelections[4]");
                       assert(vm.gameRows.gameRows[5].userGameSelection.bet).equals(1, "userGameSelections[5]");
                       assert(vm.gameRows.gameRows[6].userGameSelection.bet).equals(1, "userGameSelections[6]");
                       assert(vm.gameRows.gameRows[7].userGameSelection.bet).equals(1, "userGameSelections[7]");
                       assert(vm.gameRows.gameRows[8].userGameSelection.bet).equals(1, "userGameSelections[8]");
                       assert(vm.gameRows.gameRows[9].userGameSelection.bet).equals(1, "userGameSelections[9]");
                       assert(vm.gameRows.gameRows[10].userGameSelection.bet).equals(1, "userGameSelections[10]");
                       assert(vm.gameRows.gameRows[11].userGameSelection.bet).equals(1, "userGameSelections[11]");
                       assert(vm.gameRows.gameRows[12].userGameSelection.bet).equals(1, "userGameSelections[12]");
                       assert(vm.gameRows.gameRows[13].userGameSelection.bet).equals(1, "userGameSelections[13]");
                       assert(vm.gameRows.gameRows[14].userGameSelection.bet).equals(1, "userGameSelections[14]");
                       assert(vm.gameRows.gameRows[15].userGameSelection.bet).equals(1, "userGameSelections[15]");
                   };
       
                   function assertUserGameSelectionsMaxGameBet() {
                       assert(vm.gameRows.gameRows.length).equals(16, "userGameSelections.length");
                       assert(vm.gameRows.gameRows[0].userGameSelection.maxGameBet).equals(5, "userGameSelections[0]");
                       assert(vm.gameRows.gameRows[1].userGameSelection.maxGameBet).equals(5, "userGameSelections[1]");
                       assert(vm.gameRows.gameRows[2].userGameSelection.maxGameBet).equals(5, "userGameSelections[2]");
                       assert(vm.gameRows.gameRows[3].userGameSelection.maxGameBet).equals(5, "userGameSelections[3]");
                       assert(vm.gameRows.gameRows[4].userGameSelection.maxGameBet).equals(5, "userGameSelections[4]");
                       assert(vm.gameRows.gameRows[5].userGameSelection.maxGameBet).equals(5, "userGameSelections[5]");
                       assert(vm.gameRows.gameRows[6].userGameSelection.maxGameBet).equals(5, "userGameSelections[6]");
                       assert(vm.gameRows.gameRows[7].userGameSelection.maxGameBet).equals(5, "userGameSelections[7]");
                       assert(vm.gameRows.gameRows[8].userGameSelection.maxGameBet).equals(5, "userGameSelections[8]");
                       assert(vm.gameRows.gameRows[9].userGameSelection.maxGameBet).equals(5, "userGameSelections[9]");
                       assert(vm.gameRows.gameRows[10].userGameSelection.maxGameBet).equals(5, "userGameSelections[10]");
                       assert(vm.gameRows.gameRows[11].userGameSelection.maxGameBet).equals(5, "userGameSelections[11]");
                       assert(vm.gameRows.gameRows[12].userGameSelection.maxGameBet).equals(5, "userGameSelections[12]");
                       assert(vm.gameRows.gameRows[13].userGameSelection.maxGameBet).equals(5, "userGameSelections[13]");
                       assert(vm.gameRows.gameRows[14].userGameSelection.maxGameBet).equals(5, "userGameSelections[14]");
                       assert(vm.gameRows.gameRows[15].userGameSelection.maxGameBet).equals(5, "userGameSelections[15]");
                   };
       
                   describe("calculateTotalValues", function () {
                       vm.calculateTotalValues(vm.gameRows.gameRows, vm.MINSPENTPOINTSFORANYONEWEEK, vm.EXTRAPOINTFACTORPERBETOVERMIN);
       
                       it("should calculate correctly", function () {
                           assertGameWeekConstants();
                           assertUserGameSelectionsBet();
       
                           assert(vm.possibleBets()).equals(16, "possibleBets");
                           assert(vm.placedBets()).equals(16, "placedBets");
                           assert(vm.bonusPoints()).equals(9);
                           assert(vm.spentPoints()).equals(17, "spentPoints");
                       });
                   });
       
                   describe("calculateMaxPossibleBetForEachGame", function () {
                       vm.calculateMaxPossibleBetForEachGame(vm.gameRows.gameRows, maxPossibleAdditionalBetForAnyGameThisWeek = 5);
       
                       it("should calculate correctly", function () {
                           assertGameWeekConstants();
                           assertUserGameSelectionsBet();
       
                           assertUserGameSelectionsMaxGameBet();
       
                       });
                   });
               });
       
               describe("when 15 bets at 1, 1 bet 3", function () {
                   var data = {};
                   var vm = {};
                   data.maxBetForAnyOneGame = 5;
                   data.minSpentPointsForAnyOneWeek = 6;
                   data.extraPointFactorPerBetOverMin = 1;
                   data.possibleBets = 16;
                   data.placedBets = 7;
                   data.bonusPoints = 0;
                   data.spentPoints = 7;
                   data.gameRows =
                           [
                               { userGameSelection: { bet: 3, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                               { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                               { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                               { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                               { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                               { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                               { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                               { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                               { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                               { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                               { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                               { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                               { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                               { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                               { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                               { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] }
                           ];
                   data.gameRowsHaveBeenSaved = false;
                   data.selectionDisabledForThisGameFilter = false;
                   vm = new selectionViewModel(data);
       
                   function assertGameWeekConstants() {
                       assert(vm.MAXBETFORANYONEGAME).equals(5, "MAXBETFORANYONEGAME");
                       assert(vm.MINSPENTPOINTSFORANYONEWEEK).equals(6, "MINSPENTPOINTSFORANYONEWEEK");
                       assert(vm.EXTRAPOINTFACTORPERBETOVERMIN).equals(1, "EXTRAPOINTFACTORPERBETOVERMIN");
                   };
       
                   function assertUserGameSelectionsBet() {
                       assert(vm.gameRows.gameRows.length).equals(16, "userGameSelections.length");
                       assert(vm.gameRows.gameRows[0].userGameSelection.bet).equals(3, "userGameSelections[0]");
                       assert(vm.gameRows.gameRows[1].userGameSelection.bet).equals(1, "userGameSelections[1]");
                       assert(vm.gameRows.gameRows[2].userGameSelection.bet).equals(1, "userGameSelections[2]");
                       assert(vm.gameRows.gameRows[3].userGameSelection.bet).equals(1, "userGameSelections[3]");
                       assert(vm.gameRows.gameRows[4].userGameSelection.bet).equals(1, "userGameSelections[4]");
                       assert(vm.gameRows.gameRows[5].userGameSelection.bet).equals(1, "userGameSelections[5]");
                       assert(vm.gameRows.gameRows[6].userGameSelection.bet).equals(1, "userGameSelections[6]");
                       assert(vm.gameRows.gameRows[7].userGameSelection.bet).equals(1, "userGameSelections[7]");
                       assert(vm.gameRows.gameRows[8].userGameSelection.bet).equals(1, "userGameSelections[8]");
                       assert(vm.gameRows.gameRows[9].userGameSelection.bet).equals(1, "userGameSelections[9]");
                       assert(vm.gameRows.gameRows[10].userGameSelection.bet).equals(1, "userGameSelections[10]");
                       assert(vm.gameRows.gameRows[11].userGameSelection.bet).equals(1, "userGameSelections[11]");
                       assert(vm.gameRows.gameRows[12].userGameSelection.bet).equals(1, "userGameSelections[12]");
                       assert(vm.gameRows.gameRows[13].userGameSelection.bet).equals(1, "userGameSelections[13]");
                       assert(vm.gameRows.gameRows[14].userGameSelection.bet).equals(1, "userGameSelections[14]");
                       assert(vm.gameRows.gameRows[15].userGameSelection.bet).equals(1, "userGameSelections[15]");
                   };
       
                   function assertUserGameSelectionsMaxGameBet() {
                       assert(vm.gameRows.gameRows.length).equals(16, "userGameSelections.length");
                       assert(vm.gameRows.gameRows[0].userGameSelection.maxGameBet).equals(5, "userGameSelections[0]");
                       assert(vm.gameRows.gameRows[1].userGameSelection.maxGameBet).equals(5, "userGameSelections[1]");
                       assert(vm.gameRows.gameRows[2].userGameSelection.maxGameBet).equals(5, "userGameSelections[2]");
                       assert(vm.gameRows.gameRows[3].userGameSelection.maxGameBet).equals(5, "userGameSelections[3]");
                       assert(vm.gameRows.gameRows[4].userGameSelection.maxGameBet).equals(5, "userGameSelections[4]");
                       assert(vm.gameRows.gameRows[5].userGameSelection.maxGameBet).equals(5, "userGameSelections[5]");
                       assert(vm.gameRows.gameRows[6].userGameSelection.maxGameBet).equals(5, "userGameSelections[6]");
                       assert(vm.gameRows.gameRows[7].userGameSelection.maxGameBet).equals(5, "userGameSelections[7]");
                       assert(vm.gameRows.gameRows[8].userGameSelection.maxGameBet).equals(5, "userGameSelections[8]");
                       assert(vm.gameRows.gameRows[9].userGameSelection.maxGameBet).equals(5, "userGameSelections[9]");
                       assert(vm.gameRows.gameRows[10].userGameSelection.maxGameBet).equals(5, "userGameSelections[10]");
                       assert(vm.gameRows.gameRows[11].userGameSelection.maxGameBet).equals(5, "userGameSelections[11]");
                       assert(vm.gameRows.gameRows[12].userGameSelection.maxGameBet).equals(5, "userGameSelections[12]");
                       assert(vm.gameRows.gameRows[13].userGameSelection.maxGameBet).equals(5, "userGameSelections[13]");
                       assert(vm.gameRows.gameRows[14].userGameSelection.maxGameBet).equals(5, "userGameSelections[14]");
                       assert(vm.gameRows.gameRows[15].userGameSelection.maxGameBet).equals(5, "userGameSelections[15]");
                   };
       
                   describe("calculateTotalValues", function () {
                       vm.calculateTotalValues(vm.gameRows.gameRows, vm.MINSPENTPOINTSFORANYONEWEEK, vm.EXTRAPOINTFACTORPERBETOVERMIN);
       
                       it("should calculate correctly", function () {
                           assertGameWeekConstants();
                           assertUserGameSelectionsBet();
       
                           assert(vm.possibleBets()).equals(16, "possibleBets");
                           assert(vm.placedBets()).equals(16, "placedBets");
                           assert(vm.bonusPoints()).equals(8, "bonusPoints");
                           assert(vm.spentPoints()).equals(18, "spentPoints");
                       });
                   });
       
                   describe("calculateMaxPossibleBetForEachGame", function () {
                       vm.calculateMaxPossibleBetForEachGame(vm.gameRows.gameRows, maxPossibleAdditionalBetForAnyGameThisWeek = 5);
       
                       it("should calculate correctly", function () {
                           assertGameWeekConstants();
                           assertUserGameSelectionsBet();
       
                           assertUserGameSelectionsMaxGameBet();
       
                       });
                   });
               });
       
               describe("when 15 bets at 1, 1 bet 4", function () {
                   var data = {};
                   var vm = {};
                   data.maxBetForAnyOneGame = 5;
                   data.minSpentPointsForAnyOneWeek = 6;
                   data.extraPointFactorPerBetOverMin = 1;
                   data.possibleBets = 16;
                   data.placedBets = 7;
                   data.bonusPoints = 0;
                   data.spentPoints = 7;
                   data.gameRows =
                           [
                               { userGameSelection: { bet: 4, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                               { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                               { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                               { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                               { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                               { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                               { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                               { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                               { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                               { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                               { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                               { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                               { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                               { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                               { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                               { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] }
                           ];
                   data.gameRowsHaveBeenSaved = false;
                   data.selectionDisabledForThisGameFilter = false;
                   vm = new selectionViewModel(data);
       
                   function assertGameWeekConstants() {
                       assert(vm.MAXBETFORANYONEGAME).equals(5, "MAXBETFORANYONEGAME");
                       assert(vm.MINSPENTPOINTSFORANYONEWEEK).equals(6, "MINSPENTPOINTSFORANYONEWEEK");
                       assert(vm.EXTRAPOINTFACTORPERBETOVERMIN).equals(1, "EXTRAPOINTFACTORPERBETOVERMIN");
                   };
       
                   function assertUserGameSelectionsBet() {
                       assert(vm.gameRows.gameRows.length).equals(16, "userGameSelections.length");
                       assert(vm.gameRows.gameRows[0].userGameSelection.bet).equals(4, "userGameSelections[0]");
                       assert(vm.gameRows.gameRows[1].userGameSelection.bet).equals(1, "userGameSelections[1]");
                       assert(vm.gameRows.gameRows[2].userGameSelection.bet).equals(1, "userGameSelections[2]");
                       assert(vm.gameRows.gameRows[3].userGameSelection.bet).equals(1, "userGameSelections[3]");
                       assert(vm.gameRows.gameRows[4].userGameSelection.bet).equals(1, "userGameSelections[4]");
                       assert(vm.gameRows.gameRows[5].userGameSelection.bet).equals(1, "userGameSelections[5]");
                       assert(vm.gameRows.gameRows[6].userGameSelection.bet).equals(1, "userGameSelections[6]");
                       assert(vm.gameRows.gameRows[7].userGameSelection.bet).equals(1, "userGameSelections[7]");
                       assert(vm.gameRows.gameRows[8].userGameSelection.bet).equals(1, "userGameSelections[8]");
                       assert(vm.gameRows.gameRows[9].userGameSelection.bet).equals(1, "userGameSelections[9]");
                       assert(vm.gameRows.gameRows[10].userGameSelection.bet).equals(1, "userGameSelections[10]");
                       assert(vm.gameRows.gameRows[11].userGameSelection.bet).equals(1, "userGameSelections[11]");
                       assert(vm.gameRows.gameRows[12].userGameSelection.bet).equals(1, "userGameSelections[12]");
                       assert(vm.gameRows.gameRows[13].userGameSelection.bet).equals(1, "userGameSelections[13]");
                       assert(vm.gameRows.gameRows[14].userGameSelection.bet).equals(1, "userGameSelections[14]");
                       assert(vm.gameRows.gameRows[15].userGameSelection.bet).equals(1, "userGameSelections[15]");
                   };
       
                   function assertUserGameSelectionsMaxGameBet() {
                       assert(vm.gameRows.gameRows.length).equals(16, "userGameSelections.length");
                       assert(vm.gameRows.gameRows[0].userGameSelection.maxGameBet).equals(5, "userGameSelections[0]");
                       assert(vm.gameRows.gameRows[1].userGameSelection.maxGameBet).equals(5, "userGameSelections[1]");
                       assert(vm.gameRows.gameRows[2].userGameSelection.maxGameBet).equals(5, "userGameSelections[2]");
                       assert(vm.gameRows.gameRows[3].userGameSelection.maxGameBet).equals(5, "userGameSelections[3]");
                       assert(vm.gameRows.gameRows[4].userGameSelection.maxGameBet).equals(5, "userGameSelections[4]");
                       assert(vm.gameRows.gameRows[5].userGameSelection.maxGameBet).equals(5, "userGameSelections[5]");
                       assert(vm.gameRows.gameRows[6].userGameSelection.maxGameBet).equals(5, "userGameSelections[6]");
                       assert(vm.gameRows.gameRows[7].userGameSelection.maxGameBet).equals(5, "userGameSelections[7]");
                       assert(vm.gameRows.gameRows[8].userGameSelection.maxGameBet).equals(5, "userGameSelections[8]");
                       assert(vm.gameRows.gameRows[9].userGameSelection.maxGameBet).equals(5, "userGameSelections[9]");
                       assert(vm.gameRows.gameRows[10].userGameSelection.maxGameBet).equals(5, "userGameSelections[10]");
                       assert(vm.gameRows.gameRows[11].userGameSelection.maxGameBet).equals(5, "userGameSelections[11]");
                       assert(vm.gameRows.gameRows[12].userGameSelection.maxGameBet).equals(5, "userGameSelections[12]");
                       assert(vm.gameRows.gameRows[13].userGameSelection.maxGameBet).equals(5, "userGameSelections[13]");
                       assert(vm.gameRows.gameRows[14].userGameSelection.maxGameBet).equals(5, "userGameSelections[14]");
                       assert(vm.gameRows.gameRows[15].userGameSelection.maxGameBet).equals(5, "userGameSelections[15]");
                   };
       
                   describe("calculateTotalValues", function () {
                       vm.calculateTotalValues(vm.gameRows.gameRows, vm.MINSPENTPOINTSFORANYONEWEEK, vm.EXTRAPOINTFACTORPERBETOVERMIN);
       
                       it("should calculate correctly", function () {
                           assertGameWeekConstants();
                           assertUserGameSelectionsBet();
       
                           assert(vm.possibleBets()).equals(16, "possibleBets");
                           assert(vm.placedBets()).equals(16, "placedBets");
                           assert(vm.bonusPoints()).equals(7, "bonusPoints");
                           assert(vm.spentPoints()).equals(19, "spentPoints");
                       });
                   });
       
                   describe("calculateMaxPossibleBetForEachGame", function () {
                       vm.calculateMaxPossibleBetForEachGame(vm.gameRows.gameRows, maxPossibleAdditionalBetForAnyGameThisWeek = 5);
       
                       it("should calculate correctly", function () {
                           assertGameWeekConstants();
                           assertUserGameSelectionsBet();
       
                           assertUserGameSelectionsMaxGameBet();
       
                       });
                   });
               });
       
               describe("when 15 bets at 1, 1 bet 5", function () {
                   var data = {};
                   var vm = {};
                   data.maxBetForAnyOneGame = 5;
                   data.minSpentPointsForAnyOneWeek = 6;
                   data.extraPointFactorPerBetOverMin = 1;
                   data.possibleBets = 16;
                   data.placedBets = 7;
                   data.bonusPoints = 0;
                   data.spentPoints = 7;
                   data.gameRows =
                           [
                               { userGameSelection: { bet: 5, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                               { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                               { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                               { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                               { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                               { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                               { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                               { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                               { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                               { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                               { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                               { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                               { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                               { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                               { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                               { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] }
                           ];
                   data.gameRowsHaveBeenSaved = false;
                   data.selectionDisabledForThisGameFilter = false;
                   vm = new selectionViewModel(data);
       
                   function assertGameWeekConstants() {
                       assert(vm.MAXBETFORANYONEGAME).equals(5, "MAXBETFORANYONEGAME");
                       assert(vm.MINSPENTPOINTSFORANYONEWEEK).equals(6, "MINSPENTPOINTSFORANYONEWEEK");
                       assert(vm.EXTRAPOINTFACTORPERBETOVERMIN).equals(1, "EXTRAPOINTFACTORPERBETOVERMIN");
                   };
       
                   function assertUserGameSelectionsBet() {
                       assert(vm.gameRows.gameRows.length).equals(16, "userGameSelections.length");
                       assert(vm.gameRows.gameRows[0].userGameSelection.bet).equals(5, "userGameSelections[0]");
                       assert(vm.gameRows.gameRows[1].userGameSelection.bet).equals(1, "userGameSelections[1]");
                       assert(vm.gameRows.gameRows[2].userGameSelection.bet).equals(1, "userGameSelections[2]");
                       assert(vm.gameRows.gameRows[3].userGameSelection.bet).equals(1, "userGameSelections[3]");
                       assert(vm.gameRows.gameRows[4].userGameSelection.bet).equals(1, "userGameSelections[4]");
                       assert(vm.gameRows.gameRows[5].userGameSelection.bet).equals(1, "userGameSelections[5]");
                       assert(vm.gameRows.gameRows[6].userGameSelection.bet).equals(1, "userGameSelections[6]");
                       assert(vm.gameRows.gameRows[7].userGameSelection.bet).equals(1, "userGameSelections[7]");
                       assert(vm.gameRows.gameRows[8].userGameSelection.bet).equals(1, "userGameSelections[8]");
                       assert(vm.gameRows.gameRows[9].userGameSelection.bet).equals(1, "userGameSelections[9]");
                       assert(vm.gameRows.gameRows[10].userGameSelection.bet).equals(1, "userGameSelections[10]");
                       assert(vm.gameRows.gameRows[11].userGameSelection.bet).equals(1, "userGameSelections[11]");
                       assert(vm.gameRows.gameRows[12].userGameSelection.bet).equals(1, "userGameSelections[12]");
                       assert(vm.gameRows.gameRows[13].userGameSelection.bet).equals(1, "userGameSelections[13]");
                       assert(vm.gameRows.gameRows[14].userGameSelection.bet).equals(1, "userGameSelections[14]");
                       assert(vm.gameRows.gameRows[15].userGameSelection.bet).equals(1, "userGameSelections[15]");
                   };
       
                   function assertUserGameSelectionsMaxGameBet() {
                       assert(vm.gameRows.gameRows.length).equals(16, "userGameSelections.length");
                       assert(vm.gameRows.gameRows[0].userGameSelection.maxGameBet).equals(5, "userGameSelections[0]");
                       assert(vm.gameRows.gameRows[1].userGameSelection.maxGameBet).equals(5, "userGameSelections[1]");
                       assert(vm.gameRows.gameRows[2].userGameSelection.maxGameBet).equals(5, "userGameSelections[2]");
                       assert(vm.gameRows.gameRows[3].userGameSelection.maxGameBet).equals(5, "userGameSelections[3]");
                       assert(vm.gameRows.gameRows[4].userGameSelection.maxGameBet).equals(5, "userGameSelections[4]");
                       assert(vm.gameRows.gameRows[5].userGameSelection.maxGameBet).equals(5, "userGameSelections[5]");
                       assert(vm.gameRows.gameRows[6].userGameSelection.maxGameBet).equals(5, "userGameSelections[6]");
                       assert(vm.gameRows.gameRows[7].userGameSelection.maxGameBet).equals(5, "userGameSelections[7]");
                       assert(vm.gameRows.gameRows[8].userGameSelection.maxGameBet).equals(5, "userGameSelections[8]");
                       assert(vm.gameRows.gameRows[9].userGameSelection.maxGameBet).equals(5, "userGameSelections[9]");
                       assert(vm.gameRows.gameRows[10].userGameSelection.maxGameBet).equals(5, "userGameSelections[10]");
                       assert(vm.gameRows.gameRows[11].userGameSelection.maxGameBet).equals(5, "userGameSelections[11]");
                       assert(vm.gameRows.gameRows[12].userGameSelection.maxGameBet).equals(5, "userGameSelections[12]");
                       assert(vm.gameRows.gameRows[13].userGameSelection.maxGameBet).equals(5, "userGameSelections[13]");
                       assert(vm.gameRows.gameRows[14].userGameSelection.maxGameBet).equals(5, "userGameSelections[14]");
                       assert(vm.gameRows.gameRows[15].userGameSelection.maxGameBet).equals(5, "userGameSelections[15]");
                   };
       
                   describe("calculateTotalValues", function () {
                       vm.calculateTotalValues(vm.gameRows.gameRows, vm.MINSPENTPOINTSFORANYONEWEEK, vm.EXTRAPOINTFACTORPERBETOVERMIN);
       
                       it("should calculate correctly", function () {
                           assertGameWeekConstants();
                           assertUserGameSelectionsBet();
       
                           assert(vm.possibleBets()).equals(16, "possibleBets");
                           assert(vm.placedBets()).equals(16, "placedBets");
                           assert(vm.bonusPoints()).equals(6, "bonusPoints");
                           assert(vm.spentPoints()).equals(20, "spentPoints");
                       });
                   });
       
                   describe("calculateMaxPossibleBetForEachGame", function () {
                       vm.calculateMaxPossibleBetForEachGame(vm.gameRows.gameRows, maxPossibleAdditionalBetForAnyGameThisWeek = 5);
       
                       it("should calculate correctly", function () {
                           assertGameWeekConstants();
                           assertUserGameSelectionsBet();
       
                           assertUserGameSelectionsMaxGameBet();
       
                       });
                   });
               });
       */
        describe("when 14 bets at 1, 1 bet 5, 1 bet 2", function () {
            var vm = {};
            before(function () {
                vm = {};
                var data = {};
                data.maxBetForAnyOneGame = 5;
                data.minSpentPointsForAnyOneWeek = 6;
                data.extraPointFactorPerBetOverMin = 1;
                data.possibleBets = 16;
                data.placedBets = 7;
                data.bonusPoints = 0;
                data.spentPoints = 7;
                data.gameRows =
                        [
                            { userGameSelection: { bet: 5, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                            { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                            { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                            { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                            { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                            { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                            { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                            { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                            { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                            { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                            { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                            { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                            { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                            { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                            { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                            { userGameSelection: { bet: 2, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] }
                        ];
                data.gameRowsHaveBeenSaved = false;
                data.selectionDisabledForThisGameFilter = false;
                vm = new selectionViewModel(data);
            });
            after(function () {
                vm = null;
            });
            function assertGameWeekConstants() {
                assert(vm.MAXBETFORANYONEGAME).equals(5, "MAXBETFORANYONEGAME");
                assert(vm.MINSPENTPOINTSFORANYONEWEEK).equals(6, "MINSPENTPOINTSFORANYONEWEEK");
                assert(vm.EXTRAPOINTFACTORPERBETOVERMIN).equals(1, "EXTRAPOINTFACTORPERBETOVERMIN");
            };

            function assertUserGameSelectionsBet() {
                assert(vm.gameRows.gameRows.length).equals(16, "userGameSelections.length");
                assert(vm.gameRows.gameRows[0].userGameSelection.bet).equals(5, "userGameSelections[0]");
                assert(vm.gameRows.gameRows[1].userGameSelection.bet).equals(1, "userGameSelections[1]");
                assert(vm.gameRows.gameRows[2].userGameSelection.bet).equals(1, "userGameSelections[2]");
                assert(vm.gameRows.gameRows[3].userGameSelection.bet).equals(1, "userGameSelections[3]");
                assert(vm.gameRows.gameRows[4].userGameSelection.bet).equals(1, "userGameSelections[4]");
                assert(vm.gameRows.gameRows[5].userGameSelection.bet).equals(1, "userGameSelections[5]");
                assert(vm.gameRows.gameRows[6].userGameSelection.bet).equals(1, "userGameSelections[6]");
                assert(vm.gameRows.gameRows[7].userGameSelection.bet).equals(1, "userGameSelections[7]");
                assert(vm.gameRows.gameRows[8].userGameSelection.bet).equals(1, "userGameSelections[8]");
                assert(vm.gameRows.gameRows[9].userGameSelection.bet).equals(1, "userGameSelections[9]");
                assert(vm.gameRows.gameRows[10].userGameSelection.bet).equals(1, "userGameSelections[10]");
                assert(vm.gameRows.gameRows[11].userGameSelection.bet).equals(1, "userGameSelections[11]");
                assert(vm.gameRows.gameRows[12].userGameSelection.bet).equals(1, "userGameSelections[12]");
                assert(vm.gameRows.gameRows[13].userGameSelection.bet).equals(1, "userGameSelections[13]");
                assert(vm.gameRows.gameRows[14].userGameSelection.bet).equals(1, "userGameSelections[14]");
                assert(vm.gameRows.gameRows[15].userGameSelection.bet).equals(2, "userGameSelections[15]");
            };

            function assertUserGameSelectionsMaxGameBet() {
                assert(vm.gameRows.gameRows.length).equals(16, "userGameSelections.length");
                assert(vm.gameRows.gameRows[0].userGameSelection.maxGameBet).equals(5, "userGameSelections[0]");
                assert(vm.gameRows.gameRows[1].userGameSelection.maxGameBet).equals(5, "userGameSelections[1]");
                assert(vm.gameRows.gameRows[2].userGameSelection.maxGameBet).equals(5, "userGameSelections[2]");
                assert(vm.gameRows.gameRows[3].userGameSelection.maxGameBet).equals(5, "userGameSelections[3]");
                assert(vm.gameRows.gameRows[4].userGameSelection.maxGameBet).equals(5, "userGameSelections[4]");
                assert(vm.gameRows.gameRows[5].userGameSelection.maxGameBet).equals(5, "userGameSelections[5]");
                assert(vm.gameRows.gameRows[6].userGameSelection.maxGameBet).equals(5, "userGameSelections[6]");
                assert(vm.gameRows.gameRows[7].userGameSelection.maxGameBet).equals(5, "userGameSelections[7]");
                assert(vm.gameRows.gameRows[8].userGameSelection.maxGameBet).equals(5, "userGameSelections[8]");
                assert(vm.gameRows.gameRows[9].userGameSelection.maxGameBet).equals(5, "userGameSelections[9]");
                assert(vm.gameRows.gameRows[10].userGameSelection.maxGameBet).equals(5, "userGameSelections[10]");
                assert(vm.gameRows.gameRows[11].userGameSelection.maxGameBet).equals(5, "userGameSelections[11]");
                assert(vm.gameRows.gameRows[12].userGameSelection.maxGameBet).equals(5, "userGameSelections[12]");
                assert(vm.gameRows.gameRows[13].userGameSelection.maxGameBet).equals(5, "userGameSelections[13]");
                assert(vm.gameRows.gameRows[14].userGameSelection.maxGameBet).equals(5, "userGameSelections[14]");
                assert(vm.gameRows.gameRows[15].userGameSelection.maxGameBet).equals(5, "userGameSelections[15]");
            };

            describe("calculateTotalValues", function () {
                it("should calculate correctly", function () {
                    vm.calculateTotalValues(vm.gameRows.gameRows, vm.MINSPENTPOINTSFORANYONEWEEK, vm.EXTRAPOINTFACTORPERBETOVERMIN);
                    assertGameWeekConstants();
                    assertUserGameSelectionsBet();

                    assert(vm.possibleBets()).equals(16, "possibleBets");
                    assert(vm.placedBets()).equals(16, "placedBets");
                    assert(vm.bonusPoints()).equals(5, "bonusPoints");
                    assert(vm.spentPoints()).equals(21, "spentPoints");
                });
            });

            describe("calculateMaxPossibleBetForEachGame", function () {
                it("should calculate correctly", function () {
                    vm.calculateMaxPossibleBetForEachGame(vm.gameRows.gameRows, maxPossibleAdditionalBetForAnyGameThisWeek = 5, vm.MAXBETFORANYONEGAME);
                    assertGameWeekConstants();
                    assertUserGameSelectionsBet();

                    assertUserGameSelectionsMaxGameBet();
                });
            });
        });

        describe("when 14 bets at 1, 1 bet 5, 1 bet 3", function () {
            var vm = {};
            before(function () {
                vm = {};
                var data = {};
                data.maxBetForAnyOneGame = 5;
                data.minSpentPointsForAnyOneWeek = 6;
                data.extraPointFactorPerBetOverMin = 1;
                data.possibleBets = 16;
                data.placedBets = 7;
                data.bonusPoints = 0;
                data.spentPoints = 7;
                data.gameRows =
                        [
                            { userGameSelection: { bet: 5, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                            { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                            { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                            { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                            { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                            { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                            { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                            { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                            { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                            { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                            { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                            { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                            { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                            { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                            { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                            { userGameSelection: { bet: 3, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] }
                        ];
                data.gameRowsHaveBeenSaved = false;
                data.selectionDisabledForThisGameFilter = false;
                vm = new selectionViewModel(data);
            });
            after(function () {
                vm = null;
            });
            function assertGameWeekConstants() {
                assert(vm.MAXBETFORANYONEGAME).equals(5, "MAXBETFORANYONEGAME");
                assert(vm.MINSPENTPOINTSFORANYONEWEEK).equals(6, "MINSPENTPOINTSFORANYONEWEEK");
                assert(vm.EXTRAPOINTFACTORPERBETOVERMIN).equals(1, "EXTRAPOINTFACTORPERBETOVERMIN");
            };

            function assertUserGameSelectionsBet() {
                assert(vm.gameRows.gameRows.length).equals(16, "userGameSelections.length");
                assert(vm.gameRows.gameRows[0].userGameSelection.bet).equals(5, "userGameSelections[0]");
                assert(vm.gameRows.gameRows[1].userGameSelection.bet).equals(1, "userGameSelections[1]");
                assert(vm.gameRows.gameRows[2].userGameSelection.bet).equals(1, "userGameSelections[2]");
                assert(vm.gameRows.gameRows[3].userGameSelection.bet).equals(1, "userGameSelections[3]");
                assert(vm.gameRows.gameRows[4].userGameSelection.bet).equals(1, "userGameSelections[4]");
                assert(vm.gameRows.gameRows[5].userGameSelection.bet).equals(1, "userGameSelections[5]");
                assert(vm.gameRows.gameRows[6].userGameSelection.bet).equals(1, "userGameSelections[6]");
                assert(vm.gameRows.gameRows[7].userGameSelection.bet).equals(1, "userGameSelections[7]");
                assert(vm.gameRows.gameRows[8].userGameSelection.bet).equals(1, "userGameSelections[8]");
                assert(vm.gameRows.gameRows[9].userGameSelection.bet).equals(1, "userGameSelections[9]");
                assert(vm.gameRows.gameRows[10].userGameSelection.bet).equals(1, "userGameSelections[10]");
                assert(vm.gameRows.gameRows[11].userGameSelection.bet).equals(1, "userGameSelections[11]");
                assert(vm.gameRows.gameRows[12].userGameSelection.bet).equals(1, "userGameSelections[12]");
                assert(vm.gameRows.gameRows[13].userGameSelection.bet).equals(1, "userGameSelections[13]");
                assert(vm.gameRows.gameRows[14].userGameSelection.bet).equals(1, "userGameSelections[14]");
                assert(vm.gameRows.gameRows[15].userGameSelection.bet).equals(3, "userGameSelections[15]");
            };

            function assertUserGameSelectionsMaxGameBet() {
                assert(vm.gameRows.gameRows.length).equals(16, "userGameSelections.length");
                assert(vm.gameRows.gameRows[0].userGameSelection.maxGameBet).equals(5, "userGameSelections[0]");
                assert(vm.gameRows.gameRows[1].userGameSelection.maxGameBet).equals(5, "userGameSelections[1]");
                assert(vm.gameRows.gameRows[2].userGameSelection.maxGameBet).equals(5, "userGameSelections[2]");
                assert(vm.gameRows.gameRows[3].userGameSelection.maxGameBet).equals(5, "userGameSelections[3]");
                assert(vm.gameRows.gameRows[4].userGameSelection.maxGameBet).equals(5, "userGameSelections[4]");
                assert(vm.gameRows.gameRows[5].userGameSelection.maxGameBet).equals(5, "userGameSelections[5]");
                assert(vm.gameRows.gameRows[6].userGameSelection.maxGameBet).equals(5, "userGameSelections[6]");
                assert(vm.gameRows.gameRows[7].userGameSelection.maxGameBet).equals(5, "userGameSelections[7]");
                assert(vm.gameRows.gameRows[8].userGameSelection.maxGameBet).equals(5, "userGameSelections[8]");
                assert(vm.gameRows.gameRows[9].userGameSelection.maxGameBet).equals(5, "userGameSelections[9]");
                assert(vm.gameRows.gameRows[10].userGameSelection.maxGameBet).equals(5, "userGameSelections[10]");
                assert(vm.gameRows.gameRows[11].userGameSelection.maxGameBet).equals(5, "userGameSelections[11]");
                assert(vm.gameRows.gameRows[12].userGameSelection.maxGameBet).equals(5, "userGameSelections[12]");
                assert(vm.gameRows.gameRows[13].userGameSelection.maxGameBet).equals(5, "userGameSelections[13]");
                assert(vm.gameRows.gameRows[14].userGameSelection.maxGameBet).equals(5, "userGameSelections[14]");
                assert(vm.gameRows.gameRows[15].userGameSelection.maxGameBet).equals(5, "userGameSelections[15]");
            };

            describe("calculateTotalValues", function () {
                it("should calculate correctly", function () {
                    vm.calculateTotalValues(vm.gameRows.gameRows, vm.MINSPENTPOINTSFORANYONEWEEK, vm.EXTRAPOINTFACTORPERBETOVERMIN);
                    assertGameWeekConstants();
                    assertUserGameSelectionsBet();

                    assert(vm.possibleBets()).equals(16, "possibleBets");
                    assert(vm.placedBets()).equals(16, "placedBets");
                    assert(vm.bonusPoints()).equals(4, "bonusPoints");
                    assert(vm.spentPoints()).equals(22, "spentPoints");
                });
            });

            describe("calculateMaxPossibleBetForEachGame", function () {
                it("should calculate correctly", function () {
                    vm.calculateMaxPossibleBetForEachGame(vm.gameRows.gameRows, maxPossibleAdditionalBetForAnyGameThisWeek = 4, vm.MAXBETFORANYONEGAME);
                    assertGameWeekConstants();
                    assertUserGameSelectionsBet();

                    assertUserGameSelectionsMaxGameBet();
                });
            });
        });

        describe("when 14 bets at 1, 1 bet 5, 1 bet 4", function () {
            var vm = {};
            before(function () {
                vm = {};
                var data = {};
                data.maxBetForAnyOneGame = 5;
                data.minSpentPointsForAnyOneWeek = 6;
                data.extraPointFactorPerBetOverMin = 1;
                data.possibleBets = 16;
                data.placedBets = 7;
                data.bonusPoints = 0;
                data.spentPoints = 7;
                data.gameRows =
                        [
                            { userGameSelection: { bet: 5, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                            { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                            { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                            { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                            { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                            { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                            { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                            { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                            { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                            { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                            { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                            { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                            { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                            { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                            { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                            { userGameSelection: { bet: 4, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] }
                        ];
                data.gameRowsHaveBeenSaved = false;
                data.selectionDisabledForThisGameFilter = false;
                vm = new selectionViewModel(data);
            });
            after(function () {
                vm = null;
            });
            function assertGameWeekConstants() {
                assert(vm.MAXBETFORANYONEGAME).equals(5, "MAXBETFORANYONEGAME");
                assert(vm.MINSPENTPOINTSFORANYONEWEEK).equals(6, "MINSPENTPOINTSFORANYONEWEEK");
                assert(vm.EXTRAPOINTFACTORPERBETOVERMIN).equals(1, "EXTRAPOINTFACTORPERBETOVERMIN");
            };

            function assertUserGameSelectionsBet() {
                assert(vm.gameRows.gameRows.length).equals(16, "userGameSelections.length");
                assert(vm.gameRows.gameRows[0].userGameSelection.bet).equals(5, "userGameSelections[0]");
                assert(vm.gameRows.gameRows[1].userGameSelection.bet).equals(1, "userGameSelections[1]");
                assert(vm.gameRows.gameRows[2].userGameSelection.bet).equals(1, "userGameSelections[2]");
                assert(vm.gameRows.gameRows[3].userGameSelection.bet).equals(1, "userGameSelections[3]");
                assert(vm.gameRows.gameRows[4].userGameSelection.bet).equals(1, "userGameSelections[4]");
                assert(vm.gameRows.gameRows[5].userGameSelection.bet).equals(1, "userGameSelections[5]");
                assert(vm.gameRows.gameRows[6].userGameSelection.bet).equals(1, "userGameSelections[6]");
                assert(vm.gameRows.gameRows[7].userGameSelection.bet).equals(1, "userGameSelections[7]");
                assert(vm.gameRows.gameRows[8].userGameSelection.bet).equals(1, "userGameSelections[8]");
                assert(vm.gameRows.gameRows[9].userGameSelection.bet).equals(1, "userGameSelections[9]");
                assert(vm.gameRows.gameRows[10].userGameSelection.bet).equals(1, "userGameSelections[10]");
                assert(vm.gameRows.gameRows[11].userGameSelection.bet).equals(1, "userGameSelections[11]");
                assert(vm.gameRows.gameRows[12].userGameSelection.bet).equals(1, "userGameSelections[12]");
                assert(vm.gameRows.gameRows[13].userGameSelection.bet).equals(1, "userGameSelections[13]");
                assert(vm.gameRows.gameRows[14].userGameSelection.bet).equals(1, "userGameSelections[14]");
                assert(vm.gameRows.gameRows[15].userGameSelection.bet).equals(4, "userGameSelections[15]");
            };

            function assertUserGameSelectionsMaxGameBet() {
                assert(vm.gameRows.gameRows.length).equals(16, "userGameSelections.length");
                assert(vm.gameRows.gameRows[0].userGameSelection.maxGameBet).equals(5, "userGameSelections[0]");
                assert(vm.gameRows.gameRows[1].userGameSelection.maxGameBet).equals(4, "userGameSelections[1]");
                assert(vm.gameRows.gameRows[2].userGameSelection.maxGameBet).equals(4, "userGameSelections[2]");
                assert(vm.gameRows.gameRows[3].userGameSelection.maxGameBet).equals(4, "userGameSelections[3]");
                assert(vm.gameRows.gameRows[4].userGameSelection.maxGameBet).equals(4, "userGameSelections[4]");
                assert(vm.gameRows.gameRows[5].userGameSelection.maxGameBet).equals(4, "userGameSelections[5]");
                assert(vm.gameRows.gameRows[6].userGameSelection.maxGameBet).equals(4, "userGameSelections[6]");
                assert(vm.gameRows.gameRows[7].userGameSelection.maxGameBet).equals(4, "userGameSelections[7]");
                assert(vm.gameRows.gameRows[8].userGameSelection.maxGameBet).equals(4, "userGameSelections[8]");
                assert(vm.gameRows.gameRows[9].userGameSelection.maxGameBet).equals(4, "userGameSelections[9]");
                assert(vm.gameRows.gameRows[10].userGameSelection.maxGameBet).equals(4, "userGameSelections[10]");
                assert(vm.gameRows.gameRows[11].userGameSelection.maxGameBet).equals(4, "userGameSelections[11]");
                assert(vm.gameRows.gameRows[12].userGameSelection.maxGameBet).equals(4, "userGameSelections[12]");
                assert(vm.gameRows.gameRows[13].userGameSelection.maxGameBet).equals(4, "userGameSelections[13]");
                assert(vm.gameRows.gameRows[14].userGameSelection.maxGameBet).equals(4, "userGameSelections[14]");
                assert(vm.gameRows.gameRows[15].userGameSelection.maxGameBet).equals(5);
            };

            describe("calculateTotalValues", function () {
                it("should calculate correctly", function () {
                    vm.calculateTotalValues(vm.gameRows.gameRows, vm.MINSPENTPOINTSFORANYONEWEEK, vm.EXTRAPOINTFACTORPERBETOVERMIN);
                    assertGameWeekConstants();
                    assertUserGameSelectionsBet();

                    assert(vm.possibleBets()).equals(16, "possibleBets");
                    assert(vm.placedBets()).equals(16, "placedBets");
                    assert(vm.bonusPoints()).equals(3, "bonusPoints");
                    assert(vm.spentPoints()).equals(23, "spentPoints");
                });
            });

            describe("calculateMaxPossibleBetForEachGame", function () {
                it("should calculate correctly", function () {
                    console.log("here");
                    console.log(vm.MAXBETFORANYONEGAME);
                    vm.calculateMaxPossibleBetForEachGame(vm.gameRows.gameRows, maxPossibleAdditionalBetForAnyGameThisWeek = 3, vm.MAXBETFORANYONEGAME);
                    assertGameWeekConstants();
                    assertUserGameSelectionsBet();

                    assertUserGameSelectionsMaxGameBet();
                });
            });
        });

        describe("when 14 bets at 1, 1 bet 5, 1 bet 5", function () {
            var vm = {};
            before(function () {
                vm = {};
                var data = {};
                data.maxBetForAnyOneGame = 5;
                data.minSpentPointsForAnyOneWeek = 6;
                data.extraPointFactorPerBetOverMin = 1;
                data.possibleBets = 16;
                data.placedBets = 7;
                data.bonusPoints = 0;
                data.spentPoints = 7;
                data.gameRows =
                        [
                            { userGameSelection: { bet: 5, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                            { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                            { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                            { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                            { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                            { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                            { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                            { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                            { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                            { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                            { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                            { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                            { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                            { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                            { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                            { userGameSelection: { bet: 5, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] }
                        ];
                data.gameRowsHaveBeenSaved = false;
                data.selectionDisabledForThisGameFilter = false;
                vm = new selectionViewModel(data);
            });
            after(function () {
                vm = null;
            });
            function assertGameWeekConstants() {
                assert(vm.MAXBETFORANYONEGAME).equals(5, "MAXBETFORANYONEGAME");
                assert(vm.MINSPENTPOINTSFORANYONEWEEK).equals(6, "MINSPENTPOINTSFORANYONEWEEK");
                assert(vm.EXTRAPOINTFACTORPERBETOVERMIN).equals(1, "EXTRAPOINTFACTORPERBETOVERMIN");
            };

            function assertUserGameSelectionsBet() {
                assert(vm.gameRows.gameRows.length).equals(16, "userGameSelections.length");
                assert(vm.gameRows.gameRows[0].userGameSelection.bet).equals(5, "userGameSelections[0]");
                assert(vm.gameRows.gameRows[1].userGameSelection.bet).equals(1, "userGameSelections[1]");
                assert(vm.gameRows.gameRows[2].userGameSelection.bet).equals(1, "userGameSelections[2]");
                assert(vm.gameRows.gameRows[3].userGameSelection.bet).equals(1, "userGameSelections[3]");
                assert(vm.gameRows.gameRows[4].userGameSelection.bet).equals(1, "userGameSelections[4]");
                assert(vm.gameRows.gameRows[5].userGameSelection.bet).equals(1, "userGameSelections[5]");
                assert(vm.gameRows.gameRows[6].userGameSelection.bet).equals(1, "userGameSelections[6]");
                assert(vm.gameRows.gameRows[7].userGameSelection.bet).equals(1, "userGameSelections[7]");
                assert(vm.gameRows.gameRows[8].userGameSelection.bet).equals(1, "userGameSelections[8]");
                assert(vm.gameRows.gameRows[9].userGameSelection.bet).equals(1, "userGameSelections[9]");
                assert(vm.gameRows.gameRows[10].userGameSelection.bet).equals(1, "userGameSelections[10]");
                assert(vm.gameRows.gameRows[11].userGameSelection.bet).equals(1, "userGameSelections[11]");
                assert(vm.gameRows.gameRows[12].userGameSelection.bet).equals(1, "userGameSelections[12]");
                assert(vm.gameRows.gameRows[13].userGameSelection.bet).equals(1, "userGameSelections[13]");
                assert(vm.gameRows.gameRows[14].userGameSelection.bet).equals(1, "userGameSelections[14]");
                assert(vm.gameRows.gameRows[15].userGameSelection.bet).equals(5, "userGameSelections[15]");
            };

            function assertUserGameSelectionsMaxGameBet() {
                assert(vm.gameRows.gameRows.length).equals(16, "userGameSelections.length");
                assert(vm.gameRows.gameRows[0].userGameSelection.maxGameBet).equals(5, "userGameSelections[0]");
                assert(vm.gameRows.gameRows[1].userGameSelection.maxGameBet).equals(3, "userGameSelections[1]");
                assert(vm.gameRows.gameRows[2].userGameSelection.maxGameBet).equals(3, "userGameSelections[2]");
                assert(vm.gameRows.gameRows[3].userGameSelection.maxGameBet).equals(3, "userGameSelections[3]");
                assert(vm.gameRows.gameRows[4].userGameSelection.maxGameBet).equals(3, "userGameSelections[4]");
                assert(vm.gameRows.gameRows[5].userGameSelection.maxGameBet).equals(3, "userGameSelections[5]");
                assert(vm.gameRows.gameRows[6].userGameSelection.maxGameBet).equals(3, "userGameSelections[6]");
                assert(vm.gameRows.gameRows[7].userGameSelection.maxGameBet).equals(3, "userGameSelections[7]");
                assert(vm.gameRows.gameRows[8].userGameSelection.maxGameBet).equals(3, "userGameSelections[8]");
                assert(vm.gameRows.gameRows[9].userGameSelection.maxGameBet).equals(3, "userGameSelections[9]");
                assert(vm.gameRows.gameRows[10].userGameSelection.maxGameBet).equals(3, "userGameSelections[10]");
                assert(vm.gameRows.gameRows[11].userGameSelection.maxGameBet).equals(3, "userGameSelections[11]");
                assert(vm.gameRows.gameRows[12].userGameSelection.maxGameBet).equals(3, "userGameSelections[12]");
                assert(vm.gameRows.gameRows[13].userGameSelection.maxGameBet).equals(3, "userGameSelections[13]");
                assert(vm.gameRows.gameRows[14].userGameSelection.maxGameBet).equals(3, "userGameSelections[14]");
                assert(vm.gameRows.gameRows[15].userGameSelection.maxGameBet).equals(5, "userGameSelections[15]");
            };

            describe("calculateTotalValues", function () {
                it("should calculate correctly", function () {
                    vm.calculateTotalValues(vm.gameRows.gameRows, vm.MINSPENTPOINTSFORANYONEWEEK, vm.EXTRAPOINTFACTORPERBETOVERMIN);
                    assertGameWeekConstants();
                    assertUserGameSelectionsBet();

                    assert(vm.possibleBets()).equals(16, "possibleBets");
                    assert(vm.placedBets()).equals(16, "placedBets");
                    assert(vm.bonusPoints()).equals(2, "bonusPoints");
                    assert(vm.spentPoints()).equals(24, "spentPoints");
                });
            });

            describe("calculateMaxPossibleBetForEachGame", function () {
                it("should calculate correctly", function () {
                    console.log("here");
                    console.log(vm.MAXBETFORANYONEGAME);
                    vm.calculateMaxPossibleBetForEachGame(vm.gameRows.gameRows, maxPossibleAdditionalBetForAnyGameThisWeek = 2, vm.MAXBETFORANYONEGAME);
                    assertGameWeekConstants();
                    assertUserGameSelectionsBet();

                    assertUserGameSelectionsMaxGameBet();
                });
            });
        });

        describe("when 13 bets at 1, 1 bet 5, 1 bet 5, 1 bet 2", function () {
            var vm = {};
            before(function () {
                vm = {};
                var data = {};
                data.maxBetForAnyOneGame = 5;
                data.minSpentPointsForAnyOneWeek = 6;
                data.extraPointFactorPerBetOverMin = 1;
                data.possibleBets = 16;
                data.placedBets = 7;
                data.bonusPoints = 0;
                data.spentPoints = 7;
                data.gameRows =
                        [
                            { userGameSelection: { bet: 5, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                            { userGameSelection: { bet: 2, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                            { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                            { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                            { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                            { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                            { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                            { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                            { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                            { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                            { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                            { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                            { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                            { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                            { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                            { userGameSelection: { bet: 5, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] }
                        ];
                data.gameRowsHaveBeenSaved = false;
                data.selectionDisabledForThisGameFilter = false;
                vm = new selectionViewModel(data);
            });
            after(function () {
                vm = null;
            });
            function assertGameWeekConstants() {
                assert(vm.MAXBETFORANYONEGAME).equals(5, "MAXBETFORANYONEGAME");
                assert(vm.MINSPENTPOINTSFORANYONEWEEK).equals(6, "MINSPENTPOINTSFORANYONEWEEK");
                assert(vm.EXTRAPOINTFACTORPERBETOVERMIN).equals(1, "EXTRAPOINTFACTORPERBETOVERMIN");
            };

            function assertUserGameSelectionsBet() {
                assert(vm.gameRows.gameRows.length).equals(16, "userGameSelections.length");
                assert(vm.gameRows.gameRows[0].userGameSelection.bet).equals(5, "userGameSelections[0]");
                assert(vm.gameRows.gameRows[1].userGameSelection.bet).equals(2, "userGameSelections[1]");
                assert(vm.gameRows.gameRows[2].userGameSelection.bet).equals(1, "userGameSelections[2]");
                assert(vm.gameRows.gameRows[3].userGameSelection.bet).equals(1, "userGameSelections[3]");
                assert(vm.gameRows.gameRows[4].userGameSelection.bet).equals(1, "userGameSelections[4]");
                assert(vm.gameRows.gameRows[5].userGameSelection.bet).equals(1, "userGameSelections[5]");
                assert(vm.gameRows.gameRows[6].userGameSelection.bet).equals(1, "userGameSelections[6]");
                assert(vm.gameRows.gameRows[7].userGameSelection.bet).equals(1, "userGameSelections[7]");
                assert(vm.gameRows.gameRows[8].userGameSelection.bet).equals(1, "userGameSelections[8]");
                assert(vm.gameRows.gameRows[9].userGameSelection.bet).equals(1, "userGameSelections[9]");
                assert(vm.gameRows.gameRows[10].userGameSelection.bet).equals(1, "userGameSelections[10]");
                assert(vm.gameRows.gameRows[11].userGameSelection.bet).equals(1, "userGameSelections[11]");
                assert(vm.gameRows.gameRows[12].userGameSelection.bet).equals(1, "userGameSelections[12]");
                assert(vm.gameRows.gameRows[13].userGameSelection.bet).equals(1, "userGameSelections[13]");
                assert(vm.gameRows.gameRows[14].userGameSelection.bet).equals(1, "userGameSelections[14]");
                assert(vm.gameRows.gameRows[15].userGameSelection.bet).equals(5, "userGameSelections[15]");
            };

            function assertUserGameSelectionsMaxGameBet() {
                assert(vm.gameRows.gameRows.length).equals(16, "userGameSelections.length");
                assert(vm.gameRows.gameRows[0].userGameSelection.maxGameBet).equals(5, "userGameSelections[0]");
                assert(vm.gameRows.gameRows[1].userGameSelection.maxGameBet).equals(3, "userGameSelections[1]");
                assert(vm.gameRows.gameRows[2].userGameSelection.maxGameBet).equals(2, "userGameSelections[2]");
                assert(vm.gameRows.gameRows[3].userGameSelection.maxGameBet).equals(2, "userGameSelections[3]");
                assert(vm.gameRows.gameRows[4].userGameSelection.maxGameBet).equals(2, "userGameSelections[4]");
                assert(vm.gameRows.gameRows[5].userGameSelection.maxGameBet).equals(2, "userGameSelections[5]");
                assert(vm.gameRows.gameRows[6].userGameSelection.maxGameBet).equals(2, "userGameSelections[6]");
                assert(vm.gameRows.gameRows[7].userGameSelection.maxGameBet).equals(2, "userGameSelections[7]");
                assert(vm.gameRows.gameRows[8].userGameSelection.maxGameBet).equals(2, "userGameSelections[8]");
                assert(vm.gameRows.gameRows[9].userGameSelection.maxGameBet).equals(2, "userGameSelections[9]");
                assert(vm.gameRows.gameRows[10].userGameSelection.maxGameBet).equals(2, "userGameSelections[10]");
                assert(vm.gameRows.gameRows[11].userGameSelection.maxGameBet).equals(2, "userGameSelections[11]");
                assert(vm.gameRows.gameRows[12].userGameSelection.maxGameBet).equals(2, "userGameSelections[12]");
                assert(vm.gameRows.gameRows[13].userGameSelection.maxGameBet).equals(2, "userGameSelections[13]");
                assert(vm.gameRows.gameRows[14].userGameSelection.maxGameBet).equals(2, "userGameSelections[14]");
                assert(vm.gameRows.gameRows[15].userGameSelection.maxGameBet).equals(5, "userGameSelections[15]");
            };

            describe("calculateTotalValues", function () {
                it("should calculate correctly", function () {
                    vm.calculateTotalValues(vm.gameRows.gameRows, vm.MINSPENTPOINTSFORANYONEWEEK, vm.EXTRAPOINTFACTORPERBETOVERMIN);
                    assertGameWeekConstants();
                    assertUserGameSelectionsBet();

                    assert(vm.possibleBets()).equals(16, "possibleBets");
                    assert(vm.placedBets()).equals(16, "placedBets");
                    assert(vm.bonusPoints()).equals(1, "bonusPoints");
                    assert(vm.spentPoints()).equals(25, "spentPoints");
                });
            });

            describe("calculateMaxPossibleBetForEachGame", function () {
                it("should calculate correctly", function () {
                    console.log("here");
                    console.log(vm.MAXBETFORANYONEGAME);
                    vm.calculateMaxPossibleBetForEachGame(vm.gameRows.gameRows, maxPossibleAdditionalBetForAnyGameThisWeek = 1, vm.MAXBETFORANYONEGAME);
                    assertGameWeekConstants();
                    assertUserGameSelectionsBet();

                    assertUserGameSelectionsMaxGameBet();
                });
            });
        });

        describe("when 13 bets at 1, 1 bet 5, 1 bet 5, 1 bet 3", function () {
            var vm = {};
            before(function () {
                vm = {};
                var data = {};
                data.maxBetForAnyOneGame = 5;
                data.minSpentPointsForAnyOneWeek = 6;
                data.extraPointFactorPerBetOverMin = 1;
                data.possibleBets = 16;
                data.placedBets = 7;
                data.bonusPoints = 0;
                data.spentPoints = 7;
                data.gameRows =
                        [
                            { userGameSelection: { bet: 5, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                            { userGameSelection: { bet: 3, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                            { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                            { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                            { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                            { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                            { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                            { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                            { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                            { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                            { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                            { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                            { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                            { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                            { userGameSelection: { bet: 1, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] },
                            { userGameSelection: { bet: 5, saved: false }, selectionPicker: { disabled: true, toggle: false, selectionValue: null }, betPickers: [{ disabled: true, toggled: false, betValue: 1 }] }
                        ];
                data.gameRowsHaveBeenSaved = false;
                data.selectionDisabledForThisGameFilter = false;
                vm = new selectionViewModel(data);
            });
            after(function () {
                vm = null;
            });
            function assertGameWeekConstants() {
                assert(vm.MAXBETFORANYONEGAME).equals(5, "MAXBETFORANYONEGAME");
                assert(vm.MINSPENTPOINTSFORANYONEWEEK).equals(6, "MINSPENTPOINTSFORANYONEWEEK");
                assert(vm.EXTRAPOINTFACTORPERBETOVERMIN).equals(1, "EXTRAPOINTFACTORPERBETOVERMIN");
            };

            function assertUserGameSelectionsBet() {
                assert(vm.gameRows.gameRows.length).equals(16, "userGameSelections.length");
                assert(vm.gameRows.gameRows[0].userGameSelection.bet).equals(5, "userGameSelections[0]");
                assert(vm.gameRows.gameRows[1].userGameSelection.bet).equals(3, "userGameSelections[1]");
                assert(vm.gameRows.gameRows[2].userGameSelection.bet).equals(1, "userGameSelections[2]");
                assert(vm.gameRows.gameRows[3].userGameSelection.bet).equals(1, "userGameSelections[3]");
                assert(vm.gameRows.gameRows[4].userGameSelection.bet).equals(1, "userGameSelections[4]");
                assert(vm.gameRows.gameRows[5].userGameSelection.bet).equals(1, "userGameSelections[5]");
                assert(vm.gameRows.gameRows[6].userGameSelection.bet).equals(1, "userGameSelections[6]");
                assert(vm.gameRows.gameRows[7].userGameSelection.bet).equals(1, "userGameSelections[7]");
                assert(vm.gameRows.gameRows[8].userGameSelection.bet).equals(1, "userGameSelections[8]");
                assert(vm.gameRows.gameRows[9].userGameSelection.bet).equals(1, "userGameSelections[9]");
                assert(vm.gameRows.gameRows[10].userGameSelection.bet).equals(1, "userGameSelections[10]");
                assert(vm.gameRows.gameRows[11].userGameSelection.bet).equals(1, "userGameSelections[11]");
                assert(vm.gameRows.gameRows[12].userGameSelection.bet).equals(1, "userGameSelections[12]");
                assert(vm.gameRows.gameRows[13].userGameSelection.bet).equals(1, "userGameSelections[13]");
                assert(vm.gameRows.gameRows[14].userGameSelection.bet).equals(1, "userGameSelections[14]");
                assert(vm.gameRows.gameRows[15].userGameSelection.bet).equals(5, "userGameSelections[15]");
            };

            function assertUserGameSelectionsMaxGameBet() {
                assert(vm.gameRows.gameRows.length).equals(16, "userGameSelections.length");
                assert(vm.gameRows.gameRows[0].userGameSelection.maxGameBet).equals(5, "userGameSelections[0]");
                assert(vm.gameRows.gameRows[1].userGameSelection.maxGameBet).equals(3, "userGameSelections[1]");
                assert(vm.gameRows.gameRows[2].userGameSelection.maxGameBet).equals(1, "userGameSelections[2]");
                assert(vm.gameRows.gameRows[3].userGameSelection.maxGameBet).equals(1, "userGameSelections[3]");
                assert(vm.gameRows.gameRows[4].userGameSelection.maxGameBet).equals(1, "userGameSelections[4]");
                assert(vm.gameRows.gameRows[5].userGameSelection.maxGameBet).equals(1, "userGameSelections[5]");
                assert(vm.gameRows.gameRows[6].userGameSelection.maxGameBet).equals(1, "userGameSelections[6]");
                assert(vm.gameRows.gameRows[7].userGameSelection.maxGameBet).equals(1, "userGameSelections[7]");
                assert(vm.gameRows.gameRows[8].userGameSelection.maxGameBet).equals(1, "userGameSelections[8]");
                assert(vm.gameRows.gameRows[9].userGameSelection.maxGameBet).equals(1, "userGameSelections[9]");
                assert(vm.gameRows.gameRows[10].userGameSelection.maxGameBet).equals(1, "userGameSelections[10]");
                assert(vm.gameRows.gameRows[11].userGameSelection.maxGameBet).equals(1, "userGameSelections[11]");
                assert(vm.gameRows.gameRows[12].userGameSelection.maxGameBet).equals(1, "userGameSelections[12]");
                assert(vm.gameRows.gameRows[13].userGameSelection.maxGameBet).equals(1, "userGameSelections[13]");
                assert(vm.gameRows.gameRows[14].userGameSelection.maxGameBet).equals(1, "userGameSelections[14]");
                assert(vm.gameRows.gameRows[15].userGameSelection.maxGameBet).equals(5, "userGameSelections[15]");
            };

            describe("calculateTotalValues", function () {
                it("should calculate correctly", function () {
                    vm.calculateTotalValues(vm.gameRows.gameRows, vm.MINSPENTPOINTSFORANYONEWEEK, vm.EXTRAPOINTFACTORPERBETOVERMIN);
                    assertGameWeekConstants();
                    assertUserGameSelectionsBet();

                    assert(vm.possibleBets()).equals(16, "possibleBets");
                    assert(vm.placedBets()).equals(16, "placedBets");
                    assert(vm.bonusPoints()).equals(0, "bonusPoints");
                    assert(vm.spentPoints()).equals(26, "spentPoints");
                });
            });

            describe("calculateMaxPossibleBetForEachGame", function () {
                it("should calculate correctly", function () {
                    console.log("here");
                    console.log(vm.MAXBETFORANYONEGAME);
                    vm.calculateMaxPossibleBetForEachGame(vm.gameRows.gameRows, maxPossibleAdditionalBetForAnyGameThisWeek = 0, vm.MAXBETFORANYONEGAME);
                    assertGameWeekConstants();
                    assertUserGameSelectionsBet();

                    assertUserGameSelectionsMaxGameBet();
                });
            });
        });
    });
});