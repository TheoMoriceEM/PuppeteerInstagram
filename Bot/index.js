class InstagramBot {

    constructor() {
        this.firebase = require('./firebase_db')
        this.config = require('./config/puppeteer.json')
    }

    async initPuppeteer() {
        const puppeteer = require('puppeteer')
        this.browser = await puppeteer.launch({
            headless: this.config.settings.headless
        })
        this.page = await this.browser.newPage()
        await this.page.setViewport({width: 1500, height: 764})
    }

    async connectToInstagram() {
        await this.page.goto(this.config.base_url)
        await this.page.waitForSelector(this.config.selectors.submit_button)
        await this.page.click(this.config.selectors.username_field)
        await this.page.keyboard.type(this.config.username)
        await this.page.click(this.config.selectors.password_field)
        await this.page.keyboard.type(this.config.password)
        await this.page.click(this.config.selectors.submit_button)
        await this.page.waitForSelector(this.config.selectors.store_later_button)
        await this.page.click(this.config.selectors.store_later_button)
        await this.page.waitForSelector(this.config.selectors.enable_notifications_later_button)
        await this.page.click(this.config.selectors.enable_notifications_later_button)
    }

    async likeAndFollowForAHashtag(hashtag) {
        await this.page.goto(this.config.tags_search_url + hashtag)
        for (let i = 0; i < this.config.settings.likes_amount; i++) {
            const row = Math.floor(i / 3) + 1
            const column = (i % 3) + 1
            const thumbnailSelector = this.config.selectors.publications.replace('ROW', row).replace('COLUMN', column)
            await this.page.waitForSelector(thumbnailSelector)
            await this.page.click(thumbnailSelector)
            await this.page.waitForSelector(this.config.selectors.like_button)
            const liked = await this.page.evaluate(x => {
                return document.querySelector(x + ' svg').getAttribute('fill') === '#ed4956'
            }, this.config.selectors.like_button)
            if (!liked) await this.page.click(this.config.selectors.like_button)
            await this.page.waitForSelector(this.config.selectors.follow_button)
            const followed = await this.page.evaluate(x => {
                return document.querySelector(x).innerHTML === 'Abonné(e)'
            }, this.config.selectors.follow_button)
            if (!followed) await this.page.click(this.config.selectors.follow_button)
            //await this.page.waitForSelector(this.config.selectors.account_name)
            //const accountName = await this.page.click(this.config.selectors.account_name)
            //await this.firebase.storeInDatabase(accountName)
            //Stockage dans la base de données provoque un bug donc je le laisse commenté
            await this.page.waitForSelector(this.config.selectors.close_modal_button)
            await this.page.click(this.config.selectors.close_modal_button)
        }
    }

    async closeBrowser() {
        await this.browser.close()
    }

}

module.exports = InstagramBot
