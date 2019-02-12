const Room = require('../model/room.model');
const Problem = require('../model/problem.model');
const Message = require('../model/message.model');
const Client = require('node-rest-client').Client;

exports.createRoom = (req, res) => {
    const room = new Room({
        roomName: req.body.roomName,
        problemId: req.body._id,
        setterName: req.params.userName
    });
    room.save()
        .then(roomData => {
            res.send(roomData);
        }).catch(err => {
            res.status(400).send({
                message: err.message || "Some error occurred while creating the Room."
            });
        });
};

exports.showAllRooms = (req, res) => {
    Room.find({
            setterName: req.params.userName
        })
        .then(rooms => {
            res.render("viewRooms", {
                rooms: rooms
            });
        }).catch(err => {

        });

};

exports.goToRoom = (req, res) => {
    // console.log("Params: " + req.query.room);
    // var roomProblem;

    Room.findOne({
            _id: req.query.room,
            status: true
        })
        .then(room => {
            // console.log('Room: ' + room);

            Problem.findOne({
                    _id: room.problemId,
                    status: true
                })
                .then(problem => {
                    // console.log("Problem: " + problem);
                    // console.log("user : ")
                    res.render("welcome", {
                        problem: problem,
                        name: problem.setterName
                    });
                }).catch(() => {
                    res.status(404).send({
                        message: "Problem has been deleted for this room."
                    })
                });
        }).catch(() => {
            res.status(404).send({
                message: "Room not found."
            })
        })




};

exports.getResult = (req, res) => {
    console.log("ID " + req.body._id + " source " + req.body.sourceCode)
    Problem.findOne({
        _id: req.body._id,
        status: true
    }).then(problem => {
        console.log(problem._id + " ... " + problem.problemTitle);
        console.log("URL ");
        var client = new Client();

        var args = {
            data: {
                "source_code": req.body.sourceCode,
                "language_id": 29,
                "expected_output": Buffer.from(problem.output).toString('base64'),
                "stdin": Buffer.from(problem.input).toString('base64'),
                "cpu_time_limit": problem.timeLimit
            },
            headers: {
                "Content-Type": "application/json"
            }

        };
        const url = "https://api.judge0.com/submissions";
        console.log("URL ");
        client.post(url + "?base64_encoded=true", args, function (data, response) {
            // parsed response body as js object
            console.log("Data: " + data + " " + JSON.stringify(data));

            // raw response
            console.log("RESP: " + response);

            setTimeout(function () {

                client.get(url + "/" + data.token, function (data, response) {
                    // parsed response body as js object
                    console.log("GET DATA " + JSON.stringify(data));
                    // raw response
                    console.log("RESP GET DATA" + response);
                    res.status(201).send(data);
                });



            }, 2000)
        });
    }).catch((err) => {
        console.log(err);
        res.status(500).send('Sorry. The compiler has faced an error')
    })
};

exports.getAllMessages = (req, res) => {
    console.log("room ------ " + req.params.id);
    Message.find({
            room: req.params.id
        }).sort({
            createdAt: -1
        })
        .then(messages => {
            console.log("mesggssss -- " + messages);
            res.send(messages);
        }).catch(err => {
            console.log(err);
        });
};