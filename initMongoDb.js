const MongoClient = require('mongodb').MongoClient;
const serverIP = '78.155.218.226';
const serverPort = '27017';
const baseName = 'nym';
const ObjectId = require('mongodb').ObjectId;

const connection = closure => {
    return MongoClient.connect(
        `mongodb://${serverIP}:${serverPort}`,
        { useNewUrlParser: true },
        (err, client) => {
            if (err) return console.log(err);

            console.log('Connection established');
            closure(client);
        }
    );
};

const initDb = () => {
    connection(client => {
        client
            .db(baseName)
            .dropDatabase()
            .then(
                console.log('DB droped'),
                client
                    .db(baseName)
                    .collection('users')
                    .insertOne(
                        {
                            email: 'test@test.test',
                            pass: 'test123',
                        },
                        () => {
                            console.log('User inited');
                            client
                                .db(baseName)
                                .collection('users')
                                .find()
                                .toArray()
                                .then(res => {
                                    client
                                        .db(baseName)
                                        .collection('desks')
                                        .insertMany(
                                            [
                                                {
                                                    _userId: res[0]._id,
                                                    name: 'desk_1',
                                                },
                                                {
                                                    _userId: res[0]._id,
                                                    name: 'desk_2',
                                                },
                                                {
                                                    _userId: res[0]._id,
                                                    name: 'desk_3',
                                                },
                                            ],
                                            () => {
                                                console.log('Desks inited');
                                                client
                                                    .db(baseName)
                                                    .collection('desks')
                                                    .stats()
                                                    .then(stats => {
                                                        client.close();
                                                        //initTasks(
                                                        //    client.db(baseName),
                                                        //    client,
                                                        //    stats.count
                                                        //);
                                                    });
                                            }
                                        );
                                });
                        }
                    )
            );
    });
};

const initTasks = (db, client, count) => {
    let counter = 1;
    new Promise((resolve, reject) => {
        console.log(count);
        const checkDone = () => {
            count -= 1;
            console.log(count);
            if (count === 0) {
                resolve('Job is done');
            }
        };

        db.collection('desks')
            .find()
            .forEach(el => {
                new Promise((resolve, reject) => {
                    db.collection('tasks').insertMany(
                        [
                            {
                                _deskId: ObjectId(el._id),
                                name: `Tasks ${counter}`,
                                tasks: [
                                    {
                                        name: `Do ${counter}${counter}`,
                                        date: new Date('10.04.2015'),
                                    },
                                    {
                                        name: `Do ${counter}${counter}`,
                                        date: new Date('10.01.2015'),
                                    },
                                    {
                                        name: `Do ${counter}${counter}`,
                                        date: new Date('10.23.2018'),
                                    },
                                ],
                                top: `${150 * counter}px`,
                                left: `${50 * counter}px`,
                            },
                        ],
                        (err, res) => {
                            console.log(`Tasks inited`);
                            if (err) reject(err);
                            resolve(res);
                        }
                    );
                }).then(checkDone);
                counter++;
            });
    }).then(result => {
        console.log(result);
        client.close();
    });
};

initDb();
