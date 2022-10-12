const express = require('express')
const app = express()
const session = require('express-session')
const fs = require('fs')
const port = 5001

// make req.body from POST usefull
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// use public files (img, css) withoug triggering index distribution
app.use(express.static('public',{index:false}))

app.use(session({
    secret: 'nathan-leo',
    name: 'sessionId',
    saveUninitialized:true,
    resave:false,
    cookie: { 
      secure: false,
      httpOnly: true
    }
  }))


// serving public score file
app.get('/', (req, res) => {
    req.session.name = req.query.name
        
    res.sendFile(__dirname + `/public/score.html`)
})

// send user's data
app.get('/scores', (req,res)=> {
    
    // Use the data.json file
    let data = JSON.parse(fs.readFileSync('./data.json'))
    // Check if user is in file
    foundData = data.userData.find(user => user.name == req.session.name)
    if(foundData){
        scores= foundData.data.scores
        res.json(scores)
    }
})

// go to index
app.get('/index', (req,res)=>{
    res.redirect('http://localhost:3000/') 
  })

app.listen(port, () => {
    console.log(`listening on http://localhost:${port}`)
})
