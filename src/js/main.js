var viewModel = {
    previews: ko.observableArray([]),
    selectedUser: ko.observable(null),
    currentPage: ko.observable(1),
    totalPages: ko.observable(0),
    countries: ko.observableArray([]),
    pagesNumbers: ko.pureComputed(function () {
        var pageNumbers = [];

        for (var i = 1; i <= viewModel.totalPages(); i++ ){
            if (i <= 5 && viewModel.currentPage() <=2){
                pageNumbers.push(i);
            }else if (i >= viewModel.totalPages()-4 && viewModel.currentPage() >=viewModel.totalPages()-1){
                pageNumbers.push(i);
            }else if (viewModel.currentPage()-2 <= i && viewModel.currentPage()+2 >= i){
                pageNumbers.push(i);
            }
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
            viewModel.selectedUser(new User(user));
        });
    },
    loadCountries: function () {
        $.getJSON("/api/countries").done(function (c) {
            viewModel.countries(c);
        })
    },
    handleSaveUser: function () {
        var type = viewModel.selectedUser().id() ? "put": "post";
        console.dir(viewModel.selectedUser());
        $.ajax({
            url: "/api/users",
            type: type,
            data: ko.toJSON(viewModel.selectedUser()),
            contentType: "application/json"
        }).done(function (savedData) {
            viewModel.loadPreviews();
            viewModel.selectedUser(null);
            //viewModel.editUser(savedData);
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
            url: "/api/users/" + viewModel.selectedUser().id(),
            type: "delete"
        }).done(function() {
            viewModel.loadPreviews();
            viewModel.selectedUser(null);
        });
    },
    addNewUser: function () {
        viewModel.selectedUser(new User([]));
        console.log(viewModel.selectedUser());
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
    this.fullName = ko.observable(json.fullName || "");
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
viewModel.selectedUser.subscribe(function(newUser) {
   if (newUser) {
       $('#birthday').datetimepicker().data('DateTimePicker').date(new Date(newUser.birthday()));
   }
});

