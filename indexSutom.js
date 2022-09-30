const express = require('express')
const app = express()
// when running 'PORT=5000 node index
const port = process.env.PORT || 3000 
const fs = require('fs')
const os =require('os')

// index.html
app.use(express.static(__dirname+'/public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname+'/public/index.html')
})

// send tab of wordsList to app
app.get('/text', (req, res) => {
  path = "./data/liste_francais_utf8.txt"
  const words = fs.readFileSync(path,'utf8')
  const tabOfWords = words.split(/\r?\n/);
  res.json({tabOfWords})
})


app.get('/port', (req,res)=>{
  const ourOs = os.hostname()
  res.send(`MOTUS APP LISTENING ON ${ourOs} on ${port}`)
})

// login
app.get('/login', (req,res)=>{
  res.send('/login.html')
})

// score
app.get('/score', (req,res)=>{
  res.send('/score.html')
})

// Week 2 auth TD
// add express session
const session = require('express-session')
app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 's3Cur3',
  name: 'sessionId'
}))

// session
app.get('/session', (req,res)=>{
  res.send(req.session)
})


app.listen(port, () => {
  console.log(`listening on http://localhost:${port}`)
})

