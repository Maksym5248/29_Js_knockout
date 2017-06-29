/**
 * Created by Максим on 14.06.2017.
 */

(function ($) {
    var $table = $("#users-table");

    function get() {
        $.getJSON("/user", function(usersList) {
            for (var i = 0;  i < usersList.length; i++) {
                var $tr = $("<tr></tr>")
                    .appendTo($table)
                    .addClass("row")
                    .attr("id", usersList[i].id);
                $("<td></td>")
                    .text(usersList[i].fullName)
                    .appendTo($tr);
                $("<td></td>")
                    .text(usersList[i].profession)
                    .appendTo($tr);
                $("<td></td>")
                    .text(usersList[i].shortInfo)
                    .appendTo($tr);
                var $td = $("<td></td>")
                    .appendTo($tr);
                $("<button></button>")
                    .text("Remove")
                    .appendTo($td);
                $("<button></button>")
                    .text("Edit")
                    .appendTo($td);
            }
        });
    }
    get();

    $("#create").click( function(e) {
        $("#users-edit-id").removeClass("users-edit-hidden");
        $.getJSON("/countries", function (data) {
            for (var i = 0; i < data.length; i++) {
                $("<option></option>")
                    .appendTo("#country")
                    .text(data[i])
                    .value = data[i];
            }
        });
        e.preventDefault();
    });

    $("#cancel").click( function(e) {
        $("#users-edit-id").addClass("users-edit-hidden");
        e.preventDefault();
    });


    $("#users-edit-id").submit( function(e) {
        e.preventDefault();
        $(this).addClass("users-edit-hidden");

        var toCreate = {
            "id": "",
            "fullName": this.fullname.value,
            "birthday": this.birthday.value,   // не записує birthday
            "profession": this.profession.value,
            "email": "",
            "address": this.address.value,
            "country": this.country.value,
            "shortInfo": this.short_info.value,
            "fullInfo": this.full_info.value
        };

        $.ajax({
            type: "POST",
            url: "/user",
            contentType: "application/json",
            dataType: "JSON",
            data: JSON.stringify(toCreate)
        }).done(function(data) {
            console.log(data);

        });
        return false;

    });

    $table.click(function (e) {
        $row = $(e.target).parents(".row")[0];
        if (e.target.textContent === "Remove"){
            $.ajax({
                type: "delete",
                url: "user?id=" + $row.id,
                dataType: "json",
                complete: function(result){  // чому не запускаэть на функції success ???
                    $($row).remove();      // як видалити елемент що повернувся
                    console.log(result);
                }});
        }
        if (e.target.textContent === "Edit"){
            $.getJSON("user?id=" + $row.id, function(usersList) {
                console.log(usersList.fullName);
                $("#users-edit-id").removeClass("users-edit-hidden");
                /*
                 $("#users-edit-id").fullname = usersList.fullName;

                 //* this
                 /*
                 .fullname.attr("value",usersList.fullName);
                 .birthday = usersList.birthday
                 .profession = usersList.profession
                 .address = usersList.address
                 .country = usersList.country
                 .short_info = usersList.shortInfo
                 .full_info =  usersList.fullInfo;*/

            });
        };
    })


    /*  $.ajax({
     type: "put",
     url: "/user",
     dataType: "json",
     complete: function(result){
     console.log(result);
     }});*/



}(jQuery));








