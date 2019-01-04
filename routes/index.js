const express = require('express');
const router = express.Router();
const {ensureAuthenticated, ensureGuest} = require('../helpers/auth');
const mongoose = require('mongoose');
const story = mongoose.model('stories');
const user = mongoose.model('users');


router.get('/', ensureGuest, (req, res) => {
  res.render('index/welcome');
});


router.get('/dashboard', ensureAuthenticated, (req, res) => {
  story.find({user:req.user.id})
  .then(stories => {
    res.render('index/dashboard', {
      stories: stories
    });
  }); 
});

router.get('/about', (req, res) => {
  res.render('index/about');
});

router.get('/sh_stories', (req, res) => {
  story.find({status:'public'})
    .populate('user')
    .then(stories => {
      res.render('index/sh_stories', {
        stories: stories
      });
    });
});



router.get('/add', ensureAuthenticated, (req, res) => {
  res.render('index/add');
});

// Edit Story Form
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
  story.findOne({
    _id: req.params.id
  })
  .then(story => {
    res.render('index/edit', {
      story: story
    });
  });
});

router.get('/show/:id', (req, res) => {
  story.findOne({
    _id: req.params.id
  })
  .populate('user')
  .then(story => {
    res.render('index/show', {
      story: story
    });
  });
});



router.post('/stories', (req, res) => {
	let allowComments;

  	if(req.body.allowComments)
  	{
  		allowComments = true;
  	}
  	else
  	{
  		allowComments = false;
  	}

 	const newStory = {

 		title: req.body.title,
 		body: req.body.txt,
 		status: req.body.status,
 		allowComments:allowComments,
 		user: req.user.id
 	}


 	new story(newStory)
 	.save()
 	.then(story => {
 		res.redirect(`/show/${story.id}`);
 	});


});


router.put('/stories/:id', (req, res) => {
 story.findOne({
    _id: req.params.id
  })

 .then(story => {

let allowComments;

    if(req.body.allowComments)
    {
      allowComments = true;
    }
    else
    {
      allowComments = false;
    }

    story.title = req.body.title;
    story.body = req.body.txt;
    story.status = req.body.status;
    story.allowComments = allowComments;
   story.save()
  .then(story => {
    res.redirect('/dashboard');
  });

 });

});



router.delete('/stories/:id',(req,res) =>{
  story.remove({_id:req.params.id})
  .then(() => {
    res.redirect('/dashboard');
  });

});











module.exports = router;