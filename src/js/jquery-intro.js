(function ($) {
	var el;
	var td;

	$("<div><span class='Item'></span></div>")
		.addClass()
		.appendTo(parent);

	td.style.display = "";
	$(el).css("display");
	$(el).click(function (e) {
	});
	$(el).submit(function (e) {
	});


	var removeBtn = document.createElement("button");
	removeBtn.type = "button";
	removeBtn.classList.add("removeBtn");
	removeBtn.setAttribute("data-target", todo.id);
	removeBtn.innerText = "Remove";
	controlsCell.appendChild(removeBtn);

	$("<button type='button'>Remove</button>")
		.addClass("removeBtn")
		.attr("data-target", todo.id)
		.appendTo(controlsCell);

	var ajaxSettings = {
		url: "/api/todo/" + todo.id,
		dataType: "json",
		type: "delete",
		data: $(form).serialize()
	};
	if(true) {
		ajaxSettings.type = "put";
	}

	$.ajax(ajaxSettings).done(function (data) {

	}).fail(function (err) {

	});

	var toCreate = {
		id: this.elements.id.value,
		title: this.title.value,
		desc: this.desc.value
	};
	$.post("/api/todo", toCreate, function (data) {

	});

	$.getJSON("/api/todo", function (data) {
		for (var i = 0; i < data.length; i++) {
			addRow(data[i], table);
		}
	}).fail(function (err) {

	});

	var $table = $("#users-table");

	/*
		GET /user
	*/
	$.getJSON("/user", function(usersList) {
		for (var i = 0; usersList.length; i++) {
			var $tr = $("<tr></tr>")
				.appendTo($table);

			$("<td></td>")
				.text(usersList[i].fullName)
				.appendTo($tr);
		}
	});

})(jQuery);