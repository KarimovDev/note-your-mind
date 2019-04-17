const express = require('express');
const router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const serverIP = '78.155.218.226';
const serverPort = '27017';
const baseName = 'nym';

const connection = closure => {
    return MongoClient.connect(
        `mongodb://${serverIP}:${serverPort}`,
        { useNewUrlParser: true },
        (err, client) => {
            if (err) return console.log(err);

            const db = client.db(baseName);

            closure(db)

            client.close();
        }
    );
};

const sendError = (err, res) => {
    response.status = 501;
    response.message = typeof err == 'object' ? err.message : err;
    res.status(501).json(response);
};

let response = {
    status: 200,
    data: [],
    message: null,
};

router.get('/desks', (req, res) => {
    connection(db => {
        db.collection('desks')
            .find()
            .toArray()
            .then(desks => {
                if (desks.length === 0) {
                    response.status = 204;
                } else {
                    response.status = 200;
                }
                response.data = desks;
                res.json(response);
            })
            .catch(err => {
                sendError(err, res);
            });
    });
});

router.post('/desks', (req, res) => {
    connection(db => {
        db.collection('desks').insertMany([ { name: req.body.name } ], function(err, result) {
            if (err) sendError(err, res);
            else res.json(result);
        });
    });
});

router.get('/tasks', (req, res) => {
    connection(db => {
        db.collection('tasks')
            .find({
                _deskId: ObjectId(req.query.id),
            })
            .toArray()
            .then(tasks => {
                if (tasks.length === 0) {
                    response.status = 204;
                } else {
                    response.status = 200;
                }
                response.data = tasks;
                res.json(response);
            })
            .catch(err => {
                sendError(err, res);
            });
    });
});

module.exports = router;
