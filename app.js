const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const path = require('path');
const port = 8000;
const sequelize = require('./utils/sequelize');
const session = require('express-session');
const FileStore = require('session-file-store')(session);

const Post = require('./models/Post');
const Board = require('./models/Board');
const User = require('./models/User');

app.use(session({
    store: new FileStore(),
    secret: "nqbrpi2ouqwe3PFQOEN2kfqpoeur1325",
    expires: new Date(Date.now() + (7 * 86400 * 1000)),
    resave: false,
    saveUninitialized: false
}));

const indexRouter = require('./routes/index');
const adminBoardRouter = require('./routes/boardAdmin');

app.use(express.urlencoded({extended: false}));
app.use(cookieParser());

app.use('/', express.static('public'));

app.set('views', path.join(__dirname, "views"));
app.set('view engine', 'pug');

app.use('/', indexRouter);
app.use('/admin/board', adminBoardRouter);

var count = 0;
io.on('connection', (socket) => {
    count++;
    io.emit('newConnect', {
        count: count
    });

    socket.on('disconnect', (socket) => {
        count--;
        io.emit('newDisconnect', {
            count: count
        });
    });
});

sequelize.authenticate()
.then(() => {
    console.log("Successfully authenticated.");
    sequelize.sync()
    .then(() => {
        console.log("Successfully synced the model");
        http.listen(port);
    })
    .catch((err) => {
        console.log("Unable to sync model: ", err);
    })
})
.catch((err) => {
    console.log("Could not authenticate: ", err);
});