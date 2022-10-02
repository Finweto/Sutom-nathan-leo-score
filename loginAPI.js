const express = require('express')
const session = require('express-session')

const app = express()
const fs = require('fs')
const port = 5000

let redirect_uri
// make req.body from POST usefull
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
        if(foundCode){
            // only change the code
            foundCode.code = randomCode
        }
        else {
            // add new user & code to json file
            const newUser_Code = { login: foundUser.login, code: randomCode }
            logins.codes.push(newUser_Code)
        }
        // change logins.json file
        fs.writeFileSync('./logins.json', JSON.stringify(logins))

        // redirection
        console.log(`redirection to motus using ${redirect_uri}`)
        data = {name:foundUser.login,code:randomCode.toString(),}
        res.send(data)
    }
    // wrong name or password
    else {
        console.log('wrong inputs')
        res.send(null)
    }
})

app.get('/redirect', (req, res) => {
    userName = req.query.name
    code = req.query.code
    // redirect to main server with callback URL and this User code
    res.redirect(`${redirect_uri}?name=${userName}&code=${code}`)
})

app.listen(port, () => {
    console.log(`listening on http://localhost:${port}`)
})