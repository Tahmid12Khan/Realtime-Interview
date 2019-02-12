const Room = require('../model/room.model');
const Problem = require('../model/problem.model');

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
    console.log("Params: " + req.query.room);
    var roomProblem;

    Room.findOne({
            _id: req.query.room,
            status: true
        })
        .then(room => {
            console.log('Room: ' + room);

            Problem.findOne({
                    _id: room.problemId,
                    status: true
                })
                .then(problem => {
                    console.log("Problem: " + problem);
                    console.log("user : ")
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

    // res.render('welcome', {
    //     name: 'related'
    // });
    // Room.find({
    //         _id: req.body._id
    //     })
    //     .then(rooms => {
    //         res.render("viewRooms", {
    //             rooms: rooms
    //         });
    //     }).catch(err => {

    //     });

};