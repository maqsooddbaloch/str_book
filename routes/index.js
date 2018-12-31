const express = require('express');
const router = express.Router();
const {ensureAuthenticated, ensureGuest} = require('../helpers/auth');

router.get('/', ensureGuest, (req, res) => {
  res.render('index/welcome');
});

router.get('/dashboard', ensureAuthenticated, (req, res) => {
  res.render('index/dashboard');
});

router.get('/about', (req, res) => {
  res.render('index/about');
});

router.get('/', (req, res) => {
  res.render('index/sh_stories');
});

router.get('/add', ensureAuthenticated, (req, res) => {
  res.render('index/add');
});

router.get('/edit', ensureAuthenticated, (req, res) => {
  res.render('index/edit');
});

router.get('/show', ensureAuthenticated, (req, res) => {
  res.render('index/show');
});
router.get('/sh_stories', ensureAuthenticated, (req, res) => {
  res.render('index/sh_stories');
});






module.exports = router;