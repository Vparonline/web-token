const express = require('express');
const ejs = require('ejs');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
const cors = require("cors");
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const cfg = require("./cfg.json")
const User = require("./models/user")
const MongoDBURI = cfg.Mongo

mongoose.connect(MongoDBURI, {
  useUnifiedTopology: true,
  useNewUrlParser: true
});
/*
const yeniKullanici = new User({
  email: 'elchavopy@gmail.com',
  username: 'elchavopy',
  password: '123',
});

yeniKullanici.save((err) => {
  if (err) {
    console.error('Hataoc', err);
  } else {
    console.log('Kullanıcı başarıyla kaydedildi.');
  }
});*/

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
});

app.use(session({
  secret: 'work hard',
  resave: true,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: db
  })
}));

app.set('trust proxy', true);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(__dirname + '/views'));
app.use('/assets', express.static(path.join(__dirname, './views/assets')));

app.use(express.static(__dirname + '/uploads'));
app.use('/uploads', express.static(path.join(__dirname, './uploads')));

const index = require('./routes/index');
const { error } = require('console');
app.use('/', index);

app.use((req, res, next) => {
  const err = new Error('Selam guest, klasör yollarını araştırmayı bıraksan mı?');
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send(err.message);
});


app.listen(cfg.Port, () => {
  console.log(`Sunucu ${cfg.WebAdress}:${cfg.Port} adresinde çalışıyor`);
  });
