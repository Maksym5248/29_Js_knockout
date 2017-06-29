(function ($) {
    var $nav = $(".navigation");
    var $navNum = $(".navigation-num");
    var $formAllUsers = $("#form-allUsers");
    var $ulParent = $("#ul-parent");
    var $navInsertBefore = $("#nav-insertBefore");
    var $navigationParent = $("#navigation-parent");
    var $pag = 1;
    var $allPage;
    var $btnAddUser = $("#btn-create");
    var $formCreate = $("#form-hide");
    var $btnCancel = $("#btn-cancel");
    var $type;
    var $liUser;

    hide();
    country();
    getUser(1,6);

    lisenerDeleteEdit();
    remove();
    lisenerNav(6);
    btnAddUser();
    btnCancel();
    createUser();

    function getUser(numberPages, numberUsers) {

        $.getJSON("api/users/" + numberPages + "/" + numberUsers, function (usersList) {
        $ulParent.empty();
        $allPage = usersList.totalPages;
        for (var i = 0; i < usersList.data.length; i++) {
            addUser(usersList.data[i])
        }

        for (var j = 1; j <= usersList.totalPages; j++) {
            addNavNum(j);
        }
        acttivNav(usersList.totalPages)
    });
}

    function addUser(user){
        var $li;
            $li = $("<li></li>")
                .appendTo($ulParent)
                .addClass("media list-group-item list-user")
                .attr("id", user.id);

        var $div1 = $("<div></div>")
                .addClass("media-left")
                .appendTo($li);
        var $a = $("<a></a>")
                .addClass("media-left")
                .attr("href", "#")
                .appendTo($div1);
        $("<img>")
            .addClass("media-object listImg thumbnail")
            .attr("src", user.photo)
            .appendTo($div1);
        var $div2 = $("<div></div>")
                .addClass("media-body")
                .appendTo($li);
        var $h4 = $("<h4></h4>")
                .addClass("media-heading")
                .appendTo($div2);
        $("<span></span>")
                .addClass("badge pull-right")
                .text(user.profession)
                .appendTo($h4);
        $("<span></span>")
                .addClass("text--capital")
                .text(user.fullName)
                .appendTo($h4);
        $("<span></span>")
            .addClass("label label-warning")
            .text("Запит на публікацію")
            .appendTo($div2);
    }

   function addNavNum(j) {
       var $li = $("<li></li>")
           .addClass("navigation-num")
           .attr("id", j)
           .insertBefore($navInsertBefore)
           .hide();
       var $a = $("<a></a>")
           .attr("href", "#")
           .text(j)
           .appendTo($li);
   }
   
   function lisenerNav(user) {
       $($navigationParent).click(function(e){
           e.preventDefault();
           var $target = e.target;
           var $parentTarget = $($target).parent("li");
           var $pag1 = $target.textContent;
           $pag = getId($pag1,$pag);
           $("li.navigation-num").remove();
           getUser($pag,user);
       })
   }

   function acttivNav(pages) {
       var $active = $("#" + $pag);
       $active.addClass("active")
              .show();
       var $m;
       var $n;
       console.log($pag);
       for (var i = 0; i < 5; i++) {

            if ($pag > 2 && $pag < pages - 1 ) {
              $m = +$pag - 2 +i;
            }
            else if($pag == 1) {
              $m = +$pag + i;
            }
            else if($pag == 2) {
              $m = +$pag - 1 + i;
            }
            else if($pag == pages - 1) {
               $m = +$pag + 1 - i;
            }
            else if($pag == pages) {
                $m = +$pag - i;
            }
           var $show = $("#" + $m);
           $($show).show();
       }
   }

   function getId(pag1,pag) {
       var result;
       if (pag1 === "«"){
           result = +pag - 1;
       }else if (pag1 === "»"){
           result = +pag + 1;
       }else {
           result = pag1;
        }
        if (result < 1) {
            return 1;
        }else if(result > $allPage){
            return $allPage;
        }else {
            return result
        }
   }

   function btnAddUser() {
       $($btnAddUser).click(function (e) {
           e.preventDefault();
           clearForm();
           show();
       })
   }
    function btnCancel() {
        $($btnCancel).click(function (e) {
            e.preventDefault();
            clearForm();
            hide();
        })
    }

    function createUser() {
        $($formCreate).submit(function (e) {
            e.preventDefault();

            var toCreate = {
                "id": $formCreate[0][0].value,
                "fullName": $formCreate[0][1].value,
                "birthday": $formCreate[0][2].value,
                "country": $formCreate[0][3].value,
                "profession": $formCreate[0][4].value,
                "address": $formCreate[0][5].value,
                "email": $formCreate[0][6].value,
                "shortInfo": $formCreate[0][7].value,
                "fullInfo": $formCreate[0][8].value
            };

            $type = toCreate.id === "" ? "POST" : "PUT";
            console.dir(toCreate);
            $.ajax({
                type: $type,
                url: "/api/users",
                contentType: "application/json",
                dataType: "JSON",
                data: JSON.stringify(toCreate)
            }).done(function(user) {
                clearForm();
                getUser($pag,6);
                hide();
                console.dir(user)
            });
        })
    }

    function lisenerDeleteEdit() {
        $($formAllUsers).click(function (e) {
            $($liUser).css("background","#fcfcfc");
            $liUser = $(e.target).parents(".list-user")[0];
            $($liUser).css("background","#c7c1c1");

            if ($liUser){
                $.getJSON("api/users/" + $liUser.id, function(user) {
                    show();
                    $formCreate[0][0].value = user.id;
                    $formCreate[0][1].value = user.fullName;
                    $formCreate[0][2].value = user.birthday;
                    $formCreate[0][3].value = user.country;
                    $formCreate[0][4].value = user.profession;
                    $formCreate[0][5].value = user.address;
                    $formCreate[0][6].value = user.email;
                    $formCreate[0][7].value = user.shortInfo;
                    $formCreate[0][8].value = user.fullInfo;
                    $("#img-photo")[0].src = user.photo;
                });
            }
    })}

    function remove() {
        $($("#delete")).click(function(e){
            e.preventDefault();
            $.ajax({
                type: "delete",
                url: "api/users/" + $liUser.id,
                contentType: "application/json",
                dataType: "json"
                }).done(function(user) {
                clearForm();
                getUser($pag,6);
                hide();
            });
        })
    }

    function country() {
        $.getJSON("api/countries", function (data) {
            for (var i = 0; i < data.length; i++) {
                $("<option></option>")
                    .appendTo("#type")
                    .text(data[i])
                    .value = data[i];
            }
        });
    }

   function hide(){
       $formCreate.hide();
   }

    function show(){
        $formCreate.show();
    }

    function clearForm() {

        for ( var i = 0; i < $formCreate[0].length; i++){
            $formCreate[0][i].value = "";
        }
     } //$formCreate[0][0].value

}(jQuery));

