$(document).ready(function () {
    console.log("start");
    $('[name=createRoom]').click(function () {
        let workingObject = $(this).parent().parent();
        let problemId = workingObject.find('input').val();
        $('#roomModal').modal({
            backdrop: 'static',
            keyboard: false
        })
        $('#roomProblemId').val(problemId);
        $('#roomModal').modal('show');
    });

    $('#room').click(function () {
        const userName = $('#userName').val();
        $(window).attr("location", "/admin/" + userName + "/rooms");
    })

    $('#submitRoom').click(function () {
        let roomName = $('#roomName').val();
        let problemId = $('#roomProblemId').val();
        let userName = $('#userName').val();
        if (roomName == "") {
            alert("Room Name Cant Be Empty");
            return;
        }

        $.ajax({
            type: "POST",
            data: {
                roomName: roomName,
                _id: problemId
            },
            url: "/admin/" + userName + "/rooms",
            success: function (msg) {
                alert(msg);
                $('#roomModal').modal('toggle');
            },
            error: function (e) {
                alert("Error: " + JSON.stringify(e));
            }
        });
        alert("room  " + roomName + " pid " + problemId);
    });
});