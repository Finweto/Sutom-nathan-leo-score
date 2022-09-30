const express = require('express')
const session = require('express-session')

const app = express()
const fs = require('fs')
const os = require('os')
const cors = require('cors')
const port = 5000

let redirect_uri
// make req.body from POST usefull
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// login
app.get('/authorize', (req, res) => {
    const client_id = req.query.client_id
    const scope = req.query.scope
    redirect_uri = req.query.redirect_uri
    console.log(redirect_uri)
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

// post login data, verify
app.post('/verifyLogin', (req, res) => {
    let logins = JSON.parse(fs.readFileSync('./logins.json'))
    // verify
    const randomCode = Math.floor(Math.random() * 100000)
    logins.users.forEach((user) => {
        
        if (user.login == req.body.name && user.password == req.body.password) {

            // correct login and password
            
            const res = { login: user.login, code: randomCode }
            console.log('good inputs')
            logins.code.push(res)
        }
    })
    fs.writeFileSync('./logins.json', JSON.stringify(logins))

    // redirection
    console.log(`redirection to motus using ${redirect_uri}`)
    res.send('ok')
})

app.get('/redirect',(req,res)=>{
    var randomCode = "XXXX"
    res.redirect(`${redirect_uri}?code=${randomCode}`)
})


app.listen(port, () => {
    console.log(`listening on http://localhost:${port}`)
})