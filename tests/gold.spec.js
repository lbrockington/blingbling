import {test} from "playwright/test";
import ScalesPage from "../page/scales.page";

test.describe('Fools Good', () => {
    let scalesPage;

    test.beforeEach(async ({page}) => {
        scalesPage = new ScalesPage(page);
        await scalesPage.goto();
    });

    test('Find Gold', async ({page}) =>{
        // Please enter 3 arrays, of 3 numbers 0 - 8. With no duplicates in the arrays.
        const firstGroup = [6,5,1]
        const secondGroup = [3,2,4]
        const thirdGroup = [0,8,7]
        await scalesPage.weighTheBars(firstGroup,secondGroup,thirdGroup);
    });
});