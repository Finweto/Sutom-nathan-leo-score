const express = require('express')
const session = require('express-session')
const jwt = require('jsonwebtoken')


const app = express()
// when running 'PORT=5000 node index
const port = process.env.PORT || 3000 
const fs = require('fs')
const os =require('os')

app.use(session({
  secret: 'nathan-leo',
  name: 'sessionId',
  saveUninitialized:true,
  resave:true,
  cookie: { 
    secure: false,
    httpOnly: true
  }
}))

// REDIRECT_URI from authorize (loginAPI)
app.get('/callback',(req,res)=>{
  // getting code from loginAPI & creating a session for user
  req.session.code = req.query.code
  req.session.name = req.query.name

  /* // redirecting to /token
  res.redirect(`/token?code=${req.query.code}`)*/
  // redirecting to /index
  res.redirect('/')
})

// token API
app.get('/token',(req,res)=>{
  // taking code from url params
  const code = req.query.code

  // creatin token with key nathan-leo
  const token = jwt.sign(code, 'nathan-leo')
  res.send(token)
})

// auto redirecting if not authentified
app.use((req,res,next)=>{ 
  if(req.session && req.session.name){
    // continue executing other script in this file ** 
    next()
  }else{
    console.log('session does not exist -> redirecting to login')
    res.redirect('http://localhost:5000/authorize?client_id=Sutom-nathan-leo&scope=openid,profile&redirect_uri=http://localhost:3000/callback&nounce=XXXX')
  }
})

// ** like this
// use public files
app.use(express.static(__dirname+'/public'));

// send public index file
app.get('/', (req, res) => {
  res.sendFile(__dirname+'/public/index.html')
})

// send word of the day to app
app.get('/text', (req, res) => {
  path = "./data/liste_francais_utf8.txt"
  const words = fs.readFileSync(path,'utf8')
  const tabOfWords = words.split(/\r?\n/);

  // get seed of the day
  const date = new Date()
  const seed = date.getDay()

  // choose word of the day
  const index = seed % tabOfWords.length * 599
  const todaysWord = tabOfWords[index]

  res.json({todaysWord})
})

// API to show current port
app.get('/port', (req,res)=>{
  const ourOs = os.hostname()
  res.send(`MOTUS APP LISTENING ON ${ourOs} on ${port}`)
})

// score
app.get('/score', (req,res)=>{
  res.send('/score.html')
})

// show simple message to server terminal
app.listen(port, () => {
  console.log(`listening on http://localhost:${port}`)
})

