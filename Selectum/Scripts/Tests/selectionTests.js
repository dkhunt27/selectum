/// <reference path="../Selection/selectionViewModel.js"/>

module('Selection Tests', {
    setup: function () {
        //document.write('<script type="text/javascript" language="javascript" src="../Selection/selectionViewModel.js"></script>');
        //alert("here");
    }
});
test('test1', function () {
    expect(1);
    alert(selectionViewModel);
    equal(2, selectionViewModel.placedBets);
});
test('test2', function () {
    expect(2);
    equal(true, false);
});