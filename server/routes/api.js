const express = require('express');
const router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const mongoIp = '78.155.218.226';
const mongoPort = '27017';
const baseName = 'nym';

const connection = closure => {
    return MongoClient.connect(
        `mongodb://${mongoIp}:${mongoPort}`,
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
    resAns = response();
    resAns.status = 520;
    resAns.message = typeof err == 'object' ? err.message : err;
    res.status(520).json(resAns);
};

const response = () => {
    return {
        result: { ok: 1 },
        status: 200,
        data: [],
        message: null,
    };
};

router.get('/users', (req, res) => {
    connection(db => {
        db.collection('users')
            .find({
                email: req.query.email,
                pass: req.query.pass,
            })
            .toArray()
            .then(users => {
                resAns = response();
                if (users.length === 0) {
                    resAns.status = 404;
                    resAns.message = 'Unknown username or bad password';
                }
                resAns.data = users;
                res.json(resAns);
            })
            .catch(err => {
                sendError(err, res);
            });
    });
});

router.get('/desks', (req, res) => {
    connection(db => {
        db.collection('desks')
            .find({
                _userId: ObjectId(req.query.id),
            })
            .toArray()
            .then(desks => {
                resAns = response();
                if (desks.length === 0) resAns.status = 204;
                resAns.data = desks;
                res.json(resAns);
            })
            .catch(err => {
                sendError(err, res);
            });
    });
});

router.post('/desks', (req, res) => {
    connection(db => {
        db.collection('desks').insertMany(
            [{ _userId: ObjectId(req.body._userId), name: req.body.name }],
            function(err, result) {
                if (err) sendError(err, res);
                else {
                    resAns = response();
                    resAns.data = result.ops;
                    resAns.result = result.result;
                    res.json(resAns);
                }
            }
        );
    });
});

router.post('/users', (req, res) => {
    connection(db => {
        db.collection('users')
            .find({ email: req.body.email })
            .toArray()
            .then(user => {
                if (user.length === 0) {
                    connection(db => {
                        db.collection('users').insertMany(
                            [{ email: req.body.email, pass: req.body.pass }],
                            function(err, result) {
                                if (err) sendError(err, res);
                                else {
                                    resAns = response();
                                    resAns.data = result.ops;
                                    resAns.result = result.result;
                                    res.json(resAns);
                                }
                            }
                        );
                    });
                } else {
                    resAns = response();
                    resAns.message = 'Such user is already exists';
                    resAns.status = 409;
                    res.json(resAns);
                }
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
            resAns = response();
            resAns.status = 200;
            resAns.data = result;
            res.json(resAns);
        });
    });
});

router.get('/tasks', (req, res) => {
    connection(db => {
        const result = {
            taskCards: [],
            connectedTaskCards: [],
        };
        new Promise((resolve, reject) => {
            let count = 2;
            const checkDone = () => {
                count -= 1;
                if (count === 0) {
                    resolve(result);
                }
            };

            new Promise((resolve, reject) => {
                db.collection('tasks')
                    .find({
                        _deskId: ObjectId(req.query.id),
                    })
                    .toArray()
                    .then(x => {
                        if (x) result.taskCards = x;
                    })
                    .then(checkDone);
            });
            new Promise((resolve, reject) => {
                db.collection('connections')
                    .find({
                        _deskId: ObjectId(req.query.id),
                    })
                    .toArray()
                    .then(x => {
                        if (x) result.connectedTaskCards = x;
                    })
                    .then(checkDone);
            });
        }).then(result => {
            resAns = response();
            if (result.taskCards.length === 0) {
                resAns.status = 204;
            } else {
                resAns.status = 200;
            }
            resAns.data = result;
            res.json(resAns);
        });
    });
});

router.post('/tasks', (req, res) => {
    connection(db => {
        const result = {
            insert: [],
            delete: [],
            insertConn: [],
            deleteConn: [],
        };
        new Promise((resolve, reject) => {
            let count =
                req.body.taskCards.length +
                req.body.deletedCardsIds.length +
                req.body.connectedTaskCards.length +
                req.body.deletedConnIds.length;
            const checkDone = () => {
                count -= 1;
                if (count === 0) {
                    resolve(result);
                }
            };

            req.body.taskCards.forEach((el, i) => {
                new Promise((resolve, reject) => {
                    db.collection('tasks').updateOne(
                        { _id: el._id },
                        {
                            $set: {
                                _id: el._id,
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
                    db.collection('tasks').deleteOne({ _id: el }, function(
                        err,
                        res
                    ) {
                        if (err) reject(err);
                        resolve(res);
                    });
                })
                    .catch(err => {
                        result.delete[i] = { error: err.toString() };
                    })
                    .then(x => {
                        if (x) result.delete[i] = x;
                    })
                    .then(checkDone);
            });
            req.body.connectedTaskCards.forEach((el, i) => {
                new Promise((resolve, reject) => {
                    db.collection('connections').updateOne(
                        { _id: el._id },
                        {
                            $set: {
                                _id: el._id,
                                _deskId: ObjectId(el._deskId),
                                el1: el.el1,
                                coords1: el.coords1,
                                el2: el.el2,
                                coords2: el.coords2,
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
                        result.insertConn[i] = { error: err.toString() };
                    })
                    .then(x => {
                        if (x) result.insert[i] = x;
                    })
                    .then(checkDone);
            });
            req.body.deletedConnIds.forEach((el, i) => {
                new Promise((resolve, reject) => {
                    db.collection('connections').deleteOne(
                        { _id: el },
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
                        if (x) result.deleteConn[i] = x;
                    })
                    .then(checkDone);
            });
        }).then(result => {
            resAns = response();
            resAns.status = 200;
            resAns.data = result;
            res.json(resAns);
        });
    });
});

module.exports = router;
