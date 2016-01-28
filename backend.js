'use latest';

const express = require('express');
const bodyParser = require('body-parser');

const Bluebird = require('bluebird');
const MongoClient = require('mongodb');

const PORT = process.env.PORT || 3001;
const MONGO_URL = "mongodb://localhost:27017/todo";

const app = express();

Bluebird.promisifyAll(MongoClient);

var allowCrossDomain = function (req, res, next) {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
};

app.use(bodyParser.json());
app.use(allowCrossDomain);

app.post('/', function (req, res) {
    const time = req.body.time;
    const text = req.body.text;

    MongoClient.connectAsync(MONGO_URL)
        .then(db => {
            db
                .collection('todos')
                .insertOne({todo: text, done: false, createdAt: time, updatedAt: null}, e => {
                    if (e) throw e;

                    res.json({
                        todo: text,
                        done: false,
                        createdAt: time,
                        updatedAt: null
                    });
                });
        })
        .catch(e => {
            console.error(e);
            res.status(500).end('Error saving to DB');
        });
});

app.put('/:id', function (req, res) {
    const id = req.params.id;
    const time = req.body.time;
    const text = req.body.text;
    const done = req.body.done;

    const upd = {updateadAt: time};
    if (text && text.length > 0) {
        upd.todo = text;
    }
    if (done === false && done === true) {
        upd.done = done;
    }


    MongoClient.connectAsync(MONGO_URL)
        .then(db => {
            db
                .collection('todos')
                .updateOne({_id: id}, {$set: upd}, e => {
                    if (e) throw e;
                    res.json(upd);
                });
        })
        .catch(e => {
            console.error(e);
            res.status(500).end('Error saving to DB');
        });
});

app.delete('/:id', function (req, res) {
    const id = req.params.id;

    MongoClient.connectAsync(MONGO_URL)
        .then(db => {
            db
                .collection('todos')
                .deleteOne({_id: id}, e => {
                    if (e) throw e;
                    res.json({
                        _id: id
                    });
                });
        })
        .catch(e => {
            console.error(e);
            res.status(500).end('Error saving to DB');
        });
});

app.get('/', function (req, res) {
    MongoClient.connectAsync(MONGO_URL)
        .then(db => {
            db
                .collection('todos')
                .find()
                .toArray((e, a) => {
                    if (e) throw e;
                    res.json(a);
                });
        })
        .catch(e => {
            console.error(e);

            res.status(500).end('Error loading from DB');
        })
});

app.listen(PORT, function () {
    console.log('Server listening on: ' + PORT);
});

