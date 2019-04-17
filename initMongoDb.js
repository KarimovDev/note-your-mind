const MongoClient = require('mongodb').MongoClient;
const serverIP = '78.155.218.226';
const serverPort = '27017';
const baseName = 'nym';

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
                    .collection('desks')
                    .insertMany(
                        [
                            {
                                name: 'desk_1',
                            },
                            {
                                name: 'desk_2',
                            },
                            {
                                name: 'desk_3',
                            },
                        ],
                        () => {
                            console.log('Desks inited');
                            initTasks(client.db(baseName));
                        }
                    )
            );
    });
};

const initTasks = db => {
    let counter = 1;
    return db
        .collection('desks')
        .find()
        .forEach(el => {
            db.collection('tasks').insertMany(
                [
                    {
                        _deskId: el._id,
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
                () => {
                    console.log(`Tasks inited`);
                }
            );
            counter++;
        });
};

initDb();
