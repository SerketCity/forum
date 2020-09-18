const express = require('express');
const router = express.Router();
const Board = require('../models/Board');
const Post = require('../models/Post');
const User = require('../models/User');

//express kept registering "favicon.ico" as a req.param during sequelize queries. put this here to avoid that
router.get('/favicon.ico', (req, res) => {
    res.status(204)
});

router.get('/', (req, res) => {
    req.session.username = req.session.username || "";
    req.session.password = req.session.password || "";
    req.session.cookie.expires = req.session.cookie.expires || new Date(Date.now() + (7 * 86400 * 1000));
    var threadCounts = [];
    var postCounts = [];
    Board.findAll()
    .then((boards) => {
        boards.forEach((board, index) => {
            Post.findAndCountAll({
                where: {
                    boardId: board.id,
                    thread: true
                }
            })
            .then((result) => {
                threadCounts.push(result.count);
                Post.findAndCountAll({
                    where: {
                        boardId: board.id
                    }
                })
                .then((result) => {
                    postCounts.push(result.count);
                    if(index == boards.length - 1)
                    {
                        res.render('index', {
                            boards: boards,
                            threadCounts: threadCounts, 
                            postCounts: postCounts,
                            currUser: req.session.username
                        });
                    }
                });
            });
        });
    })
    .catch((err) => {
        console.log('Error getting boards: ', err);
    });
});

router.get("/register", (req, res) => {
    req.session.username = req.session.username || "";
    req.session.password = req.session.password || "";
    req.session.cookie.expires = req.session.cookie.expires || new Date(Date.now() + (7 * 86400 * 1000));
    if(req.session.username != "")
    {
        res.redirect("/");
    }
    else
    {
        res.render('register');
    }
});

router.post("/register", (req, res) => {
    if(req.session.username != "")
    {
        res.json({ success: " " });
    }
    if(req.body.username.length < 4)
    {
        res.json({ reply: "Username too short!"});
    } 
    else if(req.body.password.length < 8)
    {
        res.json({ reply: "Password too short!"});
    }
    else
    {
        User.findOne({
            where: {
                username: req.body.username
            }
        })
        .then((user) => {
            if(!user)
            {
                User.create({
                    username: req.body.username,
                    password: req.body.password
                })
                .then(() => {
                    res.json({ success: " " });
                });
            }
            else
            {
                res.json({ reply: "Username is taken!" });
            }
        });
    }
});

router.get("/login", (req, res) => {
    req.session.username = req.session.username || "";
    req.session.password = req.session.password || "";
    req.session.cookie.expires = req.session.cookie.expires || new Date(Date.now() + (7 * 86400 * 1000));
    if(req.session.username != "")
    {
        res.redirect("/");
    }
    else
    {
        res.render('login');
    }
});

router.post("/login", (req, res) => {
    if(req.session.username != "")
    {
        res.json({ success: " " });
    }
    if(req.body.username.length < 4)
    {
        res.json({ reply: "Username too short!"});
    } 
    else if(req.body.password.length < 8)
    {
        res.json({ reply: "Password too short!"});
    }
    else
    {
        User.findOne({
            where: {
                username: req.body.username
            }
        })
        .then((user) => {
            if(user)
            {
                if(req.body.password == user.password)
                {
                    req.session.username = user.username;
                    req.session.password = user.password;
                    res.json({ success: " "});
                }
                else
                {
                    res.json({ reply: "Incorrect password!"});
                }
            }
            else
            {
                res.json({ reply: "Username doesn't exist!" });
            }
        });
    }
});

router.get("/logout", (req, res) => {
    req.session.username = "";
    req.session.password = "";
    res.redirect("/");
});

router.get('/:board', (req, res) => {
    req.session.username = req.session.username || "";
    req.session.password = req.session.password || "";
    req.session.cookie.expires = req.session.cookie.expires || new Date(Date.now() + (7 * 86400 * 1000));
    if(req.session.username == "")
    {
        res.redirect("/login");
    }
    else
    {
        var users = [];
        Board.findOne({
            where: {
                name: req.params.board
            }
        })
        .then((board) => {
            board.getPosts({
                where: {
                    thread: true
                }
            })
            .then((posts) => {
                if(posts[0])
                {
                    posts.forEach((post, index) => {
                        post.getUser()
                        .then((user) => {
                            users.push(user.username);
                            if(index == posts.length - 1)
                            {
                                res.render('board', {
                                    board: board,
                                    posts: posts,
                                    users: users,
                                    currUser: req.session.username
                                });
                            }
                        });
                    });
                }
                else
                {
                    res.render('board', {
                        board: board,
                        currUser: req.session.username
                    });
                }
            });
        });
    }
});

router.post('/:board/new', (req, res) => {
    Post.create({
        name: req.body.name,
        content: req.body.content,
        thread: true
    })
    .then((post) => {
        Board.findOne({
            where: {
                name: req.params.board
            }
        })
        .then((board) => {
            board.addPost(post)
            .then(() => {
                User.findOne({
                    where: {
                        username: req.session.username
                    }
                })
                .then((user) => {
                    user.addPost(post)
                    .then(() => {
                        res.redirect('/' + req.params.board + '/thread/' + post.id);
                    });
                });
            });
        });
    });
});

router.get('/:board/thread/:id', (req, res) => {
    req.session.username = req.session.username || "";
    req.session.password = req.session.password || "";
    req.session.cookie.expires = req.session.cookie.expires || new Date(Date.now() + (7 * 86400 * 1000));
    if(req.session.username == "")
    {
        res.redirect("/login");
    }
    else
    {  
        var users = [];
        Post.findByPk(req.params.id)
        .then((originalPost) => {
            Post.findAll({
                where: {
                    threadNum: req.params.id
                }
            })
            .then((comments) => {
                Board.findOne({
                    where: {
                        name: req.params.board
                    }
                })
                .then((board) => {
                    originalPost.getUser()
                    .then((op) => {
                        users.push(op.username)
                        if(comments[0])
                        {
                            comments.forEach((comment, index) => {
                                comment.getUser()
                                .then((user) => {
                                    users.push(user.username)
                                    if(index == comments.length - 1)
                                    {
                                        res.render('thread', {
                                            originalPost: originalPost,
                                            comments: comments,
                                            users: users,
                                            board: board,
                                            currUser: req.session.username
                                        });
                                    }
                                })
                            });
                        }
                        else
                        {
                            res.render('thread', {
                                originalPost: originalPost,
                                users: users,
                                board: board,
                                currUser: req.session.username
                            });
                        }
                    });
                });
            });
        });
    }
});

router.post('/:board/thread/:id/new', (req, res) => {
    Board.findOne({
        where: {
            name: req.params.board
        }
    })
    .then((board) => {
        Post.create({
            content: req.body.content,
            thread: false,
            threadNum: req.params.id
        })
        .then((post) => {
            board.addPost(post)
            .then(() => {
                User.findOne({
                    where: {
                        username: req.session.username
                    }
                })
                .then((user) => {
                    user.addPost(post)
                    .then(() => {
                        res.redirect('/' + req.params.board + '/thread/' + req.params.id);
                    });
                });
            });
        });
    });
});

module.exports = router;