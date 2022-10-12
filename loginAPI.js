const express = require('express')

const app = express()
const fs = require('fs')
const port = 5000
const jwt = require('jsonwebtoken')

let redirect_uri
// make req.body from POST usefull
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// use public files (img, css) withoug triggering index distribution
app.use(express.static('public', { index: false }))

// serving public login file
app.get('/authorize', (req, res) => {
    // get all openId params (in query)
    const client_id = req.query.client_id
    const scope = req.query.scope
    redirect_uri = req.query.redirect_uri
    const nounce = req.query.nounce

    // verify authorize URL
    if ((client_id == 'Sutom-nathan-leo')
        && (scope == 'openid,profile')
        && (redirect_uri == 'http://localhost:3000/callback')
        && (nounce == 'XXXX')) {

        console.log('OPENID SUCCESS')
        // display login form
        res.sendFile(__dirname + '/public/login.html')
    } else {
        console.log('OPENID FAIL')
        res.send('wrong clientid => error')
    }
})

// POST login form data
app.post('/verifyLogin', (req, res) => {
    let logins = JSON.parse(fs.readFileSync('./logins.json'))
    let data = JSON.parse(fs.readFileSync('./data.json'))

    // verify name & password
    foundUser = logins.users.find(user =>
        (user.login == req.body.name && user.password == req.body.password))

    // correct name & password
    if (foundUser) {
        console.log('good inputs')
        // create Code
        const randomCode = Math.floor(Math.random() * 100000)

        // verify if login already exist
        foundCode = logins.codes.find(user => user.login == foundUser.login)
        if (foundCode) {
            // only change the code
            foundCode.code = randomCode
        }
        else {
            // add new user & code to json file
            const newUser_Code = { login: foundUser.login, code: randomCode }
            logins.codes.push(newUser_Code)
        }

        // verify if data already exist
        foundData = data.userData.find(user => user.name == foundUser.login)
        if(foundData){
        }
        else {
            // add new user and set up data
            const newUser_data = { name: foundUser.login, data: [{score : 0, previousWord : "", avgTry : 0, nbTry : 0, scores :[{mot: "", tries: 0}]}] }
            data.userData.push(newUser_data)
        }

        // change logins.json and data.json file
        fs.writeFileSync('./logins.json', JSON.stringify(logins))
        fs.writeFileSync('./data.json', JSON.stringify(data))

        // redirection
        console.log(`redirection to motus using ${redirect_uri}`)
        data = { name: foundUser.login, code: randomCode.toString(), }
        res.send(data)
    }
    // wrong name or password
    else {
        console.log('wrong inputs')
        res.send(null)
    }
})

// POST register form data
app.post('/verifyRegister', (req, res) => {
    let logins = JSON.parse(fs.readFileSync('./logins.json'))

    // verify if name & password already taken
    foundUser = logins.users.find(user =>
        (user.login == req.body.name))

    // credential already taken
    if (foundUser) {
        console.log('input already taken')
        res.send(null)
    }
    // add new user & code to json file
    else {
        const newUser = { login: req.body.name, password: req.body.password }
        logins.users.push(newUser)

        // change logins.json file
        fs.writeFileSync('./logins.json', JSON.stringify(logins))

        // redirection
        res.send('ok')
    }
})

app.get('/redirect', (req, res) => {
    userName = req.query.name
    code = req.query.code
    // redirect to main server with callback URL and this User code
    res.redirect(`${redirect_uri}?name=${userName}&code=${code}`)
})

// token API
app.get('/token',(req,res)=>{
   
    // taking code from url params
    const codeReceived = req.query.code

    // read json logins file
    let logins = JSON.parse(fs.readFileSync('./logins.json'))

    // search throught logins.json to see if code is somewhere
    foundCode = logins.codes.find( codeName => (codeName.code == codeReceived))

    // if foundCode is not null, code exist in logins file
    if(foundCode){
        
        // creatin token with key nathan-leo
        const token = jwt.sign(`${foundCode.login}`, 'nathan-leo')

        // returning token to caller
        res.send(token)
    }
    
  })

app.listen(port, () => {
    console.log(`listening on http://localhost:${port}`)
})