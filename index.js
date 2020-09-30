const Bot = require('./Bot')
const config = require('./Bot/config/puppeteer.json')

const run = async () => {

    const bot = new Bot()

    await bot.initPuppeteer().then(() => console.log('Puppeteer a été exécuté'))

    await bot.connectToInstagram().then(() => console.log('Connexion à Instagram effectuée'))

    //config.searchTags.forEach(await function(tag) {
    //    bot.likeAndFollowForAHashtag(tag)
    //})
    await bot.likeAndFollowForAHashtag('tennis')
    //Ne fonctionne pas avec plusieurs hashtags donc je laisse commenté

    await bot.closeBrowser().then(() => console.log('Navigateur fermé'))

}

run().catch(e => console.log(e.message))
