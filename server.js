const express = require('express');
const bodyParser = require('body-parser');
var methodOverride = require('method-override');
var session = require('express-session');



// create express app
const app = express();

app.use(methodOverride('_method'));
app.use(session({
    secret: 'ssshhhhh'
}));

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(express.static('static'));
// parse requests of content-type - application/json
app.use(bodyParser.json())
app.set('view engine', 'ejs');

const dbConfig = require('./config/database.config.js');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

mongoose.connect(dbConfig.url, {
    useNewUrlParser: true
}).then(() => {
    console.log("Successfully connected to the database");
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
});

require('./routes/user.routes.js')(app);

server = app.listen(3000, () => {
    console.log("Server is listening on port 3000");
});


//socket.io instantiation
const io = require("socket.io")(server)

//listen on every connection
io.on('connection', (socket) => {
    console.log('New user connected')

    //default username
    //socket.username = "Anonymous"

    //listen on change_username
    socket.on('change_username', (data) => {
        console.log('Name Changed: ' + data.username);
        socket.username = data.username
    })

    //listen on new_message
    socket.on('new_message', (data) => {
        //broadcast the new message
        io.sockets.emit('new_message', {
            message: data.message,
            username: socket.username,
            type: 'problem-setter'
        });
    })

    //listen on typing
    socket.on('typing', (data) => {
        socket.broadcast.emit('typing', {
            username: socket.username
        })
    })
})