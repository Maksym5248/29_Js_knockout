var viewModel = {
    previews: ko.observableArray([]),
    selectedUser: ko.observable(null),
    currentPage: ko.observable(1),
    totalPages: ko.observable(0),
    countries: ko.observableArray([]),
    pagesNumbers: ko.pureComputed(function () {
        var pageNumbers = [];

        for (var i = 1; i <= viewModel.totalPages(); i++ ){
            pageNumbers.push(i);
        }
        return pageNumbers;
    }),
    canRemoveSelectedUser: ko.pureComputed(function () {
        return viewModel.selectedUser() && viewModel.selectedUser().id;
    }),
    loadPreviews: function () {
        $.getJSON("/api/users/" + viewModel.currentPage() + "/10/preview").done(function (response) {
            viewModel.totalPages (response.totalPages);
            viewModel.previews(response.data);
        });
    },
    editUser: function (userToEdit) {
        $.getJSON("/api/users/" + userToEdit.id).done(function (user) {
            var use = new User(user);
            console.dir(use);
            viewModel.selectedUser(use);
        });
    },
    loadCountries: function () {
        $.getJSON("/api/countries").done(function (c) {
            viewModel.countries(c);
        })
    },
    handleSaveUser: function () {
        var type = viewModel.selectedUser().id ? "put": "post";

        $.ajax({
            url: "/api/users",
            type: type,
            data: ko.toJSON(viewModel.selectedUser()),
            contentType: "application/json"
        }).done(function (savedData) {
            viewModel.loadPreviews();
            viewModel.editUser(savedData);
        })
    },
    goToPrevPage: function () {
        if (viewModel.currentPage() <= 1){
            return;
        }
        viewModel.goToPage(viewModel.currentPage() - 1 );
    },
    goToNextPage: function () {
        if (viewModel.currentPage() >= viewModel.totalPages()){
            return;
        }
        viewModel.goToPage(viewModel.currentPage() + 1 );
    },
    goToPage: function (pageNum) {
        viewModel.currentPage(pageNum);
        viewModel.loadPreviews();
    },
    removeSelectedUser: function () {
        $.ajax({
            url: "/api/users/" + viewModel.selectedUser().id,
            type: "delete",
        }).done(function() {
            viewModel.loadPreviews();
            viewModel.selectedUser(null);
        });
    },
    addNewUser: function () {
        viewModel.selectedUser(new User());
    },
    cancelSelection: function () {
        viewModel.selectedUser(null);
    },
    openFileDialog: function () {
        document.getElementById("openFileDialogElement").click();
    },
    upLoadImg: function (ctx, e) {
        var fiels = e.target.files;
        if (!fiels.length){
            return;
        }
        var ourImg = fiels[0];

        var fileReader = new FileReader(); // дозволяэ завантажувати
        fileReader.readAsDataURL(ourImg);

        fileReader.onloadend = function () {
            var dataURI = fileReader.result;
            viewModel.selectedUser().photo(dataURI);
        };
    }

};

function User(json) {
    this.id = ko.observable(json.id);
    this.fullName = ko.observable(json.fullName);
    this.birthday = ko.observable(json.birthday);
    this.profession = ko.observable(json.profession);
    this.email = ko.observable(json.email);
    this.address = ko.observable(json.address);
    this.country = ko.observable(json.country);
    this.shortInfo = ko.observable(json.shortInfo);
    this.fullInfo = ko.observable(json.fullInfo);
    this.photo = ko.observable(json.photo)
}

ko.applyBindings(viewModel);
viewModel.loadCountries();
viewModel.loadPreviews();
