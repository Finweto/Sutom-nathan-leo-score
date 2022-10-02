const express = require('express')
const session = require('express-session')

const app = express()
const fs = require('fs')
const os = require('os')
const port = 5000

let redirect_uri
// make req.body from POST usefull
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// login
app.get('/authorize', (req, res) => {
    // get all openId params (in query)
    const client_id = req.query.client_id
    const scope = req.query.scope
    redirect_uri = req.query.redirect_uri
    const nounce = req.query.nounce

    // verify OPENID
    if ((client_id == 'Sutom-nathan-leo')
        && (scope == 'openid,profile')
        && (redirect_uri == 'http://localhost:3000/callback')
        && (nounce == 'XXXX')) {
        console.log('OPENID SUCCESS')
        res.sendFile(__dirname + '/public/login.html')
    } else {
        console.log('OPENID FAIL')
    }
})



// POST login form data
app.post('/verifyLogin', (req, res) => {
    let logins = JSON.parse(fs.readFileSync('./logins.json'))
    // verify name & password
    foundUser = logins.users.find(user =>
        (user.login == req.body.name && user.password == req.body.password))

    // correct name & password
    if (foundUser) {
        const randomCode = Math.floor(Math.random() * 100000)
        const newUser_Code = { login: foundUser.login, code: randomCode }
        console.log('good inputs')
        logins.code.push(newUser_Code)
        // add new user & code to json file
        fs.writeFileSync('./logins.json', JSON.stringify(logins))

        // redirection
        console.log(`redirection to motus using ${redirect_uri}`)
        res.send(randomCode.toString())
    }
    // wrong name or password
    else {
        console.log('wrong inputs')
        res.send()
    }
})

app.get('/redirect', (req, res) => {
    code = req.query.code
    // redirect to main server with callback URL and this User code
    res.redirect(`${redirect_uri}?code=${code}`)
})

app.listen(port, () => {
    console.log(`listening on http://localhost:${port}`)
})