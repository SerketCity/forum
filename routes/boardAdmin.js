const express = require('express');
const router = express.Router();
const Sequelize = require('sequelize');
const sequelize = require('../utils/sequelize');
const Board = require('../models/Board');

router.get('/', (req, res) => {
    req.session.username = req.session.username || "";
    req.session.password = req.session.password || "";
    req.session.cookie.expires = req.session.cookie.expires || new Date(Date.now() + (7 * 86400 * 1000));
    if(req.session.username != "john")
    {
        res.redirect("/");
    }
    else
    {
        Board.findAll()
        .then((boards) => {
            res.render('admin/board/index', {boards: boards});
        })
        .catch((err) => {
            console.log('Error getting boards: ', err);
        });
    }
});

router.get('/new', (req, res) => {
    req.session.username = req.session.username || "";
    req.session.password = req.session.password || "";
    req.session.cookie.expires = req.session.cookie.expires || new Date(Date.now() + (7 * 86400 * 1000));
    if(req.session.username != "john")
    {
        res.redirect("/");
    }
    else
    {
        res.render('admin/board/new');
    }
});

router.post('/new', (req, res) => {
    Board.create({
        name: req.body.name,
        description: req.body.description
    })
    .then(() => {
        res.redirect('/admin/board');
    })
    .catch((err) => {
        console.log('Error saving board: ', err);
    });
});

router.get('/:id', (req, res) => {
    req.session.username = req.session.username || "";
    req.session.password = req.session.password || "";
    req.session.cookie.expires = req.session.cookie.expires || new Date(Date.now() + (7 * 86400 * 1000));
    if(req.session.username != "john")
    {
        res.redirect("/");
    }
    else
    {
        const id = req.params.id;
        Board.findByPk(id)
        .then((board) => {
            res.render('admin/board/board', {board: board});
        });
    }
});

router.get('/edit/:id', (req, res) => {
    req.session.username = req.session.username || "";
    req.session.password = req.session.password || "";
    req.session.cookie.expires = req.session.cookie.expires || new Date(Date.now() + (7 * 86400 * 1000));
    if(req.session.username != "john")
    {
        res.redirect("/");
    }
    else
    {
        const id = req.params.id;
        Board.findByPk(id)
        .then((board) => {
            res.render('admin/board/edit', {
                board: board
            });
        });
    }
});
  
router.post('/edit/:id', (req, res) => {
    const id = req.params.id;
    Board.findByPk(id)
    .then((board) => {
        board.name = req.body.name;
        board.description = req.body.description;
        board.save()
        .then(() => {
            res.redirect('/admin/board/' + id);
        });
    });
});

router.post('/delete', (req, res) => {
    const id = req.body.id;
    Board.findByPk(id)
    .then((board) => {
    board.destroy()
        .then(() => {
            res.redirect('/admin/board');
        });
    });
});

module.exports = router;