const express = require('express');
const axios = require('axios');
const multer = require('multer');
const path = require('path');
const mongoose = require('mongoose');
const router = express.Router(); 
const { Client } = require('discord.js-selfbot-v13');
const startAllBots = require('./start');

const User = require('../models/user');
const cfg = require("../cfg.json")

router.get('/', (req, res, next) => {
  res.render('home');
}); 

router.get('/login', (req, res, next) => {
    res.render('login.ejs');
});

router.post('/login', (req, res, next) => {
	User.findOne({ email: req.body.email }, (err, data) => {
	  if (data) {
		if (data.password == req.body.password) {
		  req.session.userId = data.unique_id;
          res.redirect('/dashboard');
		} else {
		  res.send({ "Pass": "Girilen Şifre Geçersiz!" });
		}
	  } else {
		res.send({ "Login": "Girilen Bilgiler Geçersiz!" });
	  }
	});
  });
  
  router.get('/dashboard', (req, res, next) => {
    User.findOne({ unique_id: req.session.userId }, (err, data) => {
      if (!data) {
      res.redirect('/');
      } else {
        startAllBots();
        res.render('dashboard.ejs', {data: data})
      }
    })
  });

  router.post('/api/saveusers', async (req, res) => {
    try {
    const { newtoken, newguildID, newchannelID, newStatus, newActivities } = req.body;
  
      const user = await User.findOne({unique_id: req.session.userId}).exec();
  
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
  
      if (!user.botTokens) {
        user.botTokens = [];
    }

      if (user.botTokens.length >= user.tokenLimit) {
        return res.status(400).json({ success: false, message: 'Token limitini geçmeorsbpucoug' });
      }
  
      user.botTokens.push({
        botToken: newtoken,
        serverId: newguildID,
        channelId: newchannelID,
        statusText: newStatus || "elchavopy web system",
        activitiesText: newActivities || "dnd"
      });
  
      await user.save();
      res.redirect('/dashboard')
      
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ success: false });
  }
    })  

    router.get('/logout', (req, res, next) => {
      if (req.session) {
        req.session.destroy((err) => {
          if (err) {
            return next(err);
          } else {
            return res.redirect('/');
          }
        });
      }
    });



module.exports = router;
