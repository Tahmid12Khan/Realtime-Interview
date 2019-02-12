module.exports = (app) => {
    const users = require('../controller/user.controller');
    const problems = require('../controller/problem.controller');
    const rooms = require('../controller/room.controller');

    app.post('/users', users.create);
    app.get('/users', users.findAll);
    app.get('/users/:userName', users.findOne);
    app.post('/admin/home', users.login);
    app.get('/logout', users.logout);

    app.get('/admin/home', users.renderAdminHome);
    app.get('/problems', problems.findAllProblem);

    app.post('/admin/:userName/problems', problems.createProblem);
    app.get('/admin/:userName/problems/:problemId', users.getProblem);
    app.put('/admin/:userName/problems/:problemId', problems.editProblem);

    app.post('/admin/:userName/rooms', rooms.createRoom);

    app.get('/admin/:userName/rooms', rooms.showAllRooms);

    app.get('/', (req, res) => {
        //res.render("view-rooms");
        res.render("login");
        //res.render("viewProblem");
        // res.render("welcome", {
        //     'name': "hello df"
        // });
    });

    app.get('/register', (req, res) => {
        res.render("register");
    });

    app.get('/room', rooms.goToRoom);

    app.post('/submission', rooms.getResult);
    app.get('/room/:id', rooms.getAllMessages);

}