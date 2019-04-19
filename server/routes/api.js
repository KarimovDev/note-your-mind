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

            closure(db);

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
        db.collection('desks').insertMany([{ name: req.body.name }], function(
            err,
            result
        ) {
            if (err) sendError(err, res);
            else res.json(result);
        });
    });
});

router.delete('/desks', (req, res) => {
    connection(db => {
        const result = [];
        new Promise((resolve, reject) => {
            let count = 2;
            const checkDone = () => {
                count -= 1;
                if (count === 0) {
                    resolve(result);
                }
            };

            new Promise((resolve, reject) => {
                db.collection('desks').deleteOne(
                    {
                        _id: ObjectId(req.query.id),
                    },
                    function(err, res) {
                        if (err) reject(err);
                        resolve(res);
                    }
                );
            })
                .catch(err => {
                    result[i] = { error: err.toString() };
                })
                .then(x => {
                    if (x) result[0] = x;
                })
                .then(checkDone);

            new Promise((resolve, reject) => {
                db.collection('tasks').deleteMany(
                    {
                        _deskId: ObjectId(req.query.id),
                    },
                    function(err, res) {
                        if (err) reject(err);
                        resolve(res);
                    }
                );
            })
                .catch(err => {
                    result[i] = { error: err.toString() };
                })
                .then(x => {
                    if (x) result[1] = x;
                })
                .then(checkDone);
        }).then(result => {
            response.status = 200;
            response.data = result;
            res.json(response);
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

router.post('/tasks', (req, res) => {
    connection(db => {
        const result = { insert: [], delete: [] };
        new Promise((resolve, reject) => {
            let count =
                req.body.taskCards.length + req.body.deletedCardsIds.length;
            const checkDone = () => {
                count -= 1;
                if (count === 0) {
                    resolve(result);
                }
            };

            req.body.taskCards.forEach((el, i) => {
                new Promise((resolve, reject) => {
                    db.collection('tasks').updateOne(
                        { _id: ObjectId(el._id) },
                        {
                            $set: {
                                _deskId: ObjectId(el._deskId),
                                name: el.name,
                                top: el.top,
                                left: el.left,
                                tasks: el.tasks,
                            },
                        },
                        { upsert: true },
                        function(err, res) {
                            if (err) reject(err);
                            resolve(res);
                        }
                    );
                })
                    .catch(err => {
                        result.insert[i] = { error: err.toString() };
                    })
                    .then(x => {
                        if (x) result.insert[i] = x;
                    })
                    .then(checkDone);
            });
            req.body.deletedCardsIds.forEach((el, i) => {
                new Promise((resolve, reject) => {
                    db.collection('tasks').deleteOne(
                        { _id: ObjectId(el) },
                        function(err, res) {
                            if (err) reject(err);
                            resolve(res);
                        }
                    );
                })
                    .catch(err => {
                        result.delete[i] = { error: err.toString() };
                    })
                    .then(x => {
                        if (x) result.delete[i] = x;
                    })
                    .then(checkDone);
            });
        }).then(result => {
            response.status = 200;
            response.data = result;
            res.json(response);
        });
    });
});

module.exports = router;
