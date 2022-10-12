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
    console.log(req.query)
    scores = req.query
    
    res.sendFile(__dirname + '/public/score.html')
})

// send user's data
app.get('/scores', (req,res)=> {
    
    // simple solution for test
    
    res.json(scores)
})

app.listen(port, () => {
    console.log(`listening on http://localhost:${port}`)
})
