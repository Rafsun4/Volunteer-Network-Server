const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@volunteer-network-clust.1khvz.mongodb.net/volunteer-network?retryWrites=true&w=majority`;



app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const userList = client.db("volunteer-network").collection("userEvents");
    const eventsList = client.db("volunteer-network").collection("allEvents");
    console.log("db connected")


    // load event
    app.get('/loadEvents', (req, res) => {
        eventsList.find({})
            .toArray((err, docs) => {
                res.send(docs);
            })
    });

    //register
    app.post('/addEvent', (req, res) => {
        const user = req.body;
        userList.insertOne(user)
            .then(result => res.send(result.insertedCount > 0))
    });

    // ADDING TASKS BY USER
    app.post('/addEvent', (req, res) => {
        const task = req.body;
        userList.insertOne(task)
            .then(result => {
                console.log(result)
                res.status(200).send(result.insertedCount > 0);
            })
    })

    // GETTING ADDED TASKS BY USER
    app.get('/addEvent', (req, res) => {
        userList.find({})
            .toArray((err, documents) => {
                res.status(200).send(documents);
            })
    })
    // GETTING TASK BY EMAIL
    app.get('/addEvent/:email', (req, res) => {
        userList.find({ email: req.params.email })
            .toArray((err, documents) => {
                res.status(200).send(documents);
            })

    });
    //   DELETE
    // delete register volunteer
    app.delete('/delete/:id', (req, res) => {
        userList.deleteOne({ _id: req.params.id })
            .then(result => {
                res.status(200).send(result.deletedCount > 0);
            })
    })

})

app.get('/', (req, res) => {
    res.send('Database is really working!!!');
})

const server = app.listen(process.env.PORT || 5000, function () {
    let port = server.address().port;
    console.log("Express is working on port " + port);
});