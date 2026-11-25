import { expect, test } from '../fixtures/test-base';
import { credentials } from '@config/credentials';
import { DataGenerator } from '../utils/dataGenerator';
import { createLogger } from '../utils/logger';

const FIRST_ITEM_ID = 'test-allthethings-tshirt-red';
const log = createLogger('E2ECheckoutSpec');

test.describe('@p0 @regression @e2e End to End checkout feature', () => {
    test.beforeEach(async ({ loginPage }) => {
        log.info('Opening the login page');
        await loginPage.open();
        log.info('Login page opened');
    });

    test('completes checkout successfully', async ({
        loginPage,
        inventoryPage,
        cartPage,
        checkoutStepOnePage,
        checkoutStepTwoPage,
        checkoutCompletePage,
    }) => {
        const customer = DataGenerator.checkoutCustomer();

        await test.step('Log in as a standard user', async () => {
            log.info('Starting step: Log in as a standard user');
            await loginPage.loginAs(credentials.standardUser, credentials.password);
            log.info('Completed step: Log in as a standard user');
        });

        await test.step('Verify the inventory page after login', async () => {
            log.info('Starting step: Verify the inventory page after login');
            await inventoryPage.assertLoaded();
            log.info('Completed step: Verify the inventory page after login');
        });

        await test.step('Add one item to the cart', async () => {
            log.info(`Starting step: Add item ${FIRST_ITEM_ID} to the cart`);
            await inventoryPage.addToCart(FIRST_ITEM_ID);
            log.info('Completed step: Add one item to the cart');
        });

        await test.step('Open the cart and proceed to checkout', async () => {
            log.info('Starting step: Open the cart and proceed to checkout');
            await inventoryPage.openCart();
            await cartPage.assertLoaded();
            await expect(await cartPage.rowCount()).toBe(1);
            await cartPage.checkout();
            log.info('Completed step: Open the cart and proceed to checkout');
        });

        await test.step('Fill in the customer details', async () => {
            log.info('Starting step: Fill in the customer details');
            await checkoutStepOnePage.assertLoaded();
            await checkoutStepOnePage.fillGuest(customer);
            await checkoutStepOnePage.continue();
            log.info('Completed step: Fill in the customer details');
        });

        await test.step('Review and finish the order', async () => {
            log.info('Starting step: Review and finish the order');
            await checkoutStepTwoPage.assertLoaded();
            await checkoutStepTwoPage.finish();
            log.info('Completed step: Review and finish the order');
        });

        await test.step('Verify order completion', async () => {
            log.info('Starting step: Verify order completion');
            await checkoutCompletePage.assertOrderComplete();
            log.info('Completed step: Verify order completion');
        });
    });
});
