const express = require('express')
const app = express()
const fs = require('fs')
const port = 5001

// make req.body from POST usefull
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// use public files (img, css) withoug triggering index distribution
app.use(express.static('public',{index:false}))

let name= null

// serving public score file
app.get('/', (req, res) => {
    name= req.query.name
        
    res.sendFile(__dirname + `/public/score.html`)
})

// send user's data
app.get('/scores', (req,res)=> {
    
    // Use the data.json file
    let data = JSON.parse(fs.readFileSync('./data.json'))
    // Check if user is in file
    foundData = data.userData.find(user => user.name == name)
    if(foundData){
        scores= foundData.data.scores
        res.json(scores)
    }
})

app.get('/success', (req,res)=>{
    const userName = req.query.name
    const data = JSON.parse(req.query.data)

      // Use the data.json file
    let dataFile = JSON.parse(fs.readFileSync('./data.json'))
    // Check if user is in file
    foundData = dataFile.userData.find(user => user.name == userName)
    if(foundData){
        // Save data in data.json
        foundData.data=data
        fs.writeFileSync('./data.json', JSON.stringify(dataFile))
        res.send("ok")
    }
    else {
        res.send("Error")
    }
        res.send()
})

app.get("/data", (req,res)=>{
    let tab = null
    // Use the data.json file
    let data = JSON.parse(fs.readFileSync('./data.json'))
    // Check if user is in file
    foundData = data.userData.find(user => user.name == req.query.name)
    if(foundData){
      res.json(foundData.data)
    }
    else {
      res.send("Erreur, data du user introuvable")
    }
})

// go to index
app.get('/index', (req,res)=>{
    res.redirect('http://localhost:3000/') 
  })

app.listen(port, () => {
    console.log(`listening on http://localhost:${port}`)
})
