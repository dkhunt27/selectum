var candidateModel = {
    FirstName: ko.observable('abc'),
    LastName: ko.observable('def'),
    Email: ko.observable('adfdsfsdfds'),
    Experience: ko.observable(0),
    Technologies: ko.observableArray([]),
    TechnologyToAdd: ko.observable('')
};

candidateModel.Name = ko.dependentObservable(function () {
    return candidateModel.FirstName() +
    " " + candidateModel.LastName();
});

candidateModel.addTechnology = function () {
    if (candidateModel.TechnologyToAdd() !== '') {
        candidateModel.Technologies.push(candidateModel.TechnologyToAdd());
        candidateModel.TechnologyToAdd('');
    }
};

ko.applyBindings(candidateModel);

candidateModel.addCandidate = function () {
    $.ajax({
        url: "/Home/Create/",
        type: 'post',
        data: ko.toJSON(this),
        contentType: 'application/json',
        success: function (result) {
            alert(result);
        }
    });
};