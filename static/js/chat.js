$(document).ready(function () {
	function setCookie() {
		var rows = $("#userName").val();
		cname = 'userName';
		cvalue = rows;
		var d = new Date();
		d.setTime(d.getTime() + (1 * 24 * 60 * 60 * 1000));
		var expires = "expires=" + d.toUTCString();
		document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
	}

	//make connection
	var socket = io.connect('localhost:3000')
	setCookie();

	var message = $("#message")
	var send_message = $("#btn")
	// var chatroom = $("#chatroom")
	var feedback = $("#feedback")

	var getUrlParameter = function getUrlParameter(sParam) {
		var sPageURL = window.location.search.substring(1),
			sURLVariables = sPageURL.split('&'),
			sParameterName,
			i;

		for (i = 0; i < sURLVariables.length; i++) {
			sParameterName = sURLVariables[i].split('=');

			if (sParameterName[0] === sParam) {
				return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
			}
		}
	};
	const roomId = getUrlParameter('room');

	socket.emit('create', {
		room: roomId
	})
	//Emit message
	send_message.click(function () {
		socket.emit('new_message', {
			message: message.val(),
			userName: $("#userName").val() || 'Unknown',
			room: roomId
		})
	})

	//Listen on new_message
	socket.on("new_message", (data) => {
		feedback.html('');
		message.val('');
		$("#temp").before(mine(data.userName, data.message));
		//	chatroom.append(firstPart + data.username + ": " + data.message + "</p>")
	})

	//Emit a username
	// send_username.click(function () {

	// })

	//Emit typing
	message.bind("keypress", () => {
		socket.emit('typing')
	})

	//Listen on typing
	socket.on('typing', (data) => {
		feedback.html("<p><i>" + data.username + " is typing a message..." + "</i></p>")
	})

	function getCookie(cname) {
		var name = cname + "=";
		var ca = document.cookie.split(';');
		for (var i = 0; i < ca.length; i++) {
			var c = ca[i];
			while (c.charAt(0) == ' ') {
				c = c.substring(1);
			}
			if (c.indexOf(name) == 0) {
				return c.substring(name.length, c.length);
			}
		}
		return "";
	}

	function mine(username, chatMessage) {
		let name = '<ul class="chat">' +
			'<li class="right clearfix"><span class="chat-img pull-left">' +
			'</span>' +
			'<div class="chat-body clearfix">' +
			'<div class="header">' +
			'<small class=" text-muted"></small>' +
			'<h5>' + username + '</h5>' +
			'	</div>' +
			'	<p>' + chatMessage + '</p>' +
			'</div>' +
			'	</li>' +
			'	</ul>';
		return name;
	}
});