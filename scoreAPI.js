const express = require('express')
const app = express()
const fs = require('fs')
const port = 5001

// make req.body from POST usefull
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// use public files (img, css) withoug triggering index distribution
app.use(express.static('public',{index:false}))

// serving public score file
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/score.html')
})

// send user's data
app.get('/scores', (req,res)=> {
    /*
    HERE FIND THE CURRENT'S USER DATAS
    */

    // simple solution for test
    scores = [{mot:'oui',nbEssais:5},{mot:'non',nbEssais:9}]

    res.json(scores)
})

app.listen(port, () => {
    console.log(`listening on http://localhost:${port}`)
})
