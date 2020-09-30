const firebase = require("firebase-admin");
const config = require('./config/db_config.json')

firebase.initializeApp({
    credential: firebase.credential.cert(config),
    databaseURL: "https://puppeteer-instagram.firebaseio.com"
});

let database = firebase.database()

const storeInDatabase = async (accountName) => {
    await database.ref('followed_accounts/' + accountName).set({
        account_name: accountName
    })
}

module.exports = {
    storeInDatabase
}
