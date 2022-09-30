const express = require('express')
const app = express()
// when running 'PORT=5000 node index
const port = process.env.PORT || 3001 
const fs = require('fs')
const os =require('os')

// index.html
app.use(express.static(__dirname+'/public'));

app.get('/score', (req, res) => {
    res.sendFile(__dirname+'/public/index.html')
})

app.listen(port, () => {
  console.log(`listening on http://localhost:${port}`)
})

