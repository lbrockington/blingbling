const {expect} = require("playwright/test");
const scaleLocators = require('../locators/scaleLocators');

class ScalesPage {

    constructor(page) {
        this.page = page;
        this.scaleLocators = scaleLocators;
    }

    async resetScale(){
        await this.page.locator(scaleLocators.reset).click();
    }

    async weighTheBars(firstGroup, secondGroup, thirdGroup) {
        const firstNumberBlock = firstGroup, secondNumberBlock = secondGroup, thirdNumberBlock = thirdGroup;
        await this.firstTry('L', firstNumberBlock);
        await this.firstTry('R', secondNumberBlock);
        await this.weighTheScale();

        let results = await this.checkBalance(0);
        if (results.includes('>')) {
            results = await this.secondTry(secondNumberBlock);
            results = results.includes('=') ? secondNumberBlock[2] :
                results.includes('<') ? secondNumberBlock[1] : secondNumberBlock[0];
        } else if (results.includes('<')) {
            results = await this.secondTry(firstNumberBlock);
            results = results.includes('=') ? firstNumberBlock[2] :
                results.includes('<') ? firstNumberBlock[1] : firstNumberBlock[0];
        } else {
            results = await this.secondTry(thirdNumberBlock);
            results = results.includes('=') ? thirdNumberBlock[2] :
                results.includes('<') ? thirdNumberBlock[1] : thirdNumberBlock[0];
        }
        await this.selectCoin(results);
    }

    async selectCoin(coin) {
        let alertMessage;
        this.page.on('dialog', async dialog => {
            alertMessage = dialog.message();
            await this.page.waitForTimeout(5000) // Adding this await for a visual confirmation for the reviewer
            await dialog.accept();
        });
        console.log(`The coin was ${coin}`)
        await this.page.locator(scaleLocators.coins).nth(coin).click()
        expect(alertMessage).toEqual('Yay! You find it!')
    }

    async firstTry(side, numbers) {
        const sideLocator = side === 'R' ? scaleLocators.right : scaleLocators.left;
        for (let i = 0; i < numbers.length; i++) {
            await this.page.locator(sideLocator).nth(i).type(numbers[i].toString());
        }
    }

    async secondTry(numbers) {
        for (let i = 0; i < 2; i++) {
            const sideLocator = i % 2 === 0 ? scaleLocators.right : scaleLocators.left;
            await this.page.locator(sideLocator).nth(i).type(numbers[i].toString());
        }
        await this.weighTheScale();
        return await this.checkBalance(1);
    }

    async checkBalance(checkNumber){
        let balance =  await this.page.locator(scaleLocators.results).nth(checkNumber).textContent();
        await this.resetScale();
        return balance;
    }

    async goto() {
        await this.page.goto('/');
    }

    async weighTheScale() {
        await this.page.locator(scaleLocators.weigh).click();
    }
}

module.exports = ScalesPage;