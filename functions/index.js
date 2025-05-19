//#####################################################################################
//                  PRODUCTION READY VERSION - Uses Secret Manager                    #
//          Requires secrets named 'STRIPE_SECRET_KEY' and 'STRIPE_WEBHOOK_SECRET'    #
//          Currently the keys used within this code connect to the stripe Test mode, #
//                                                                                    #  
//          THIS IS A CLOUD FUNCTION, WORKS ONLY WHEN DEPLOYED TO CLOUD!              #
//#####################################################################################

const functions = require("firebase-functions/v2"); // Use v2 imports

const { getFirestore } = require("firebase-admin/firestore");
//############################################################a
const { HttpsError, onCall } = require("firebase-functions/v2/https");
const { onRequest } = require("firebase-functions/v2/https");
const admin = require("firebase-admin");
const stripe = require("stripe");
const { logger } = require("firebase-functions"); // Use v2 logger

// Initialize Firebase Admin SDK
admin.initializeApp();
// ####### IMPORTANT -  this specifically connects to the centre-connect database, since its not named (default) ########
const db = getFirestore('centre-connect');
//#######################################################################################################################

// Define secrets needed by the functions (these names MUST match Secret Manager)
// Must change once ready for live stripe use.
const STRIPE_SECRETS = { secrets: ["STRIPE_SECRET", "STRIPE_WEBHOOK_SECRET"] };

//###########Cloud Function 1: Create Stripe Checkout Session (Callable V2)###########
// Referenced secrets using runWith
exports.createCheckoutSession = onCall(STRIPE_SECRETS, async (request) => {
    logger.log("--- [createCheckoutSession Func] Execution started (using secrets) ---");
    logger.log("[createCheckoutSession Func] Received request data:", request.data);

    //###### Initialize Stripe Client using Secret ######
    // Read the secret value
    const ssKey = process.env.STRIPE_SECRET;
    if (!ssKey) {
        logger.error("[createCheckoutSession Func] Stripe Secret Key not found in environment secrets. Check Secret Manager setup and function IAM permissions.");
        // Do not reveal internal config issues to the client
        throw new HttpsError("internal", "Server configuration error. Please try again later.");
    }
    // Creates a Stripe API client instance using the secret key
    const stripeInstance = stripe(ssKey);
    logger.log("[createCheckoutSession Func] Stripe client initialized using secret.");
    //###### End Stripe Init ######

    //###### AUTH CHECK ######
    if (!request.auth) {
        logger.error("[createCheckoutSession Func] Authentication check FAILED. User is not authenticated.");
        throw new HttpsError("unauthenticated", "Authentication required. You must be logged in to make a purchase.");
    }
    const userId = request.auth.uid;
    const userEmail = request.auth.token?.email;
    logger.log(`[createCheckoutSession Func] User authenticated successfully: UID=${userId}, Email=${userEmail || 'N/A'}`);
    //###### End Auth Check######

    //###### Validate Input Data ######
    const priceId = request.data?.priceId;
    if (!priceId || typeof priceId !== 'string') {
        logger.error("[createCheckoutSession Func] Missing or invalid priceId in request data:", request.data);
        throw new HttpsError("invalid-argument", "Invalid request: A valid 'priceId' string must be provided.");
    }
    logger.log(`[createCheckoutSession Func] Received valid priceId: ${priceId}`);
    //###### End Validate Data ######

    //###### URLs ######

    //NOTE: Got to setup app base URL once deployed live, Must also create page to thank user for purchase

    // Read App URL from regular env var (set via `config:set app.url=...` or hardcoded fallback)
    const appBaseUrl = process.env.APP_URL || 'http://localhost:5173'; // Use configured or default
    const successUrl = `${appBaseUrl}/purchase-success?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${appBaseUrl}/token-management`;
    logger.log(`[createCheckoutSession Func] Using Success URL: ${successUrl}, Cancel URL: ${cancelUrl}`);
    //###### End URLs ######

    try {
        //###### USER TYPE CHECK ######
        const userDocRef = db.collection('users').doc(userId); // db targets 'centre-connect'
        const userDoc = await userDocRef.get();
        if (!userDoc.exists() || userDoc.data()?.userType !== 'business') {
            logger.warn(`[createCheckoutSession V2] User ${userId} is not a business user or doc doesn't exist.`);
            throw new HttpsError('permission-denied', 'Only business users are permitted to purchase tokens.');
        }
        logger.log(`[createCheckoutSession V2] Business user check passed for ${userId}.`);
        //###### End user type check ######

        //###### Create Stripe Checkout Session ######
        logger.log("[createCheckoutSession Func] Creating Stripe checkout session...");
        const session = await stripeInstance.checkout.sessions.create({
            payment_method_types: ["card"], mode: "payment",
            line_items: [{ price: priceId, quantity: 1 }],
            client_reference_id: userId, customer_email: userEmail || undefined,
            success_url: successUrl, cancel_url: cancelUrl,
            metadata: { firebaseUserId: userId }
        });
        logger.log(`[createCheckoutSession Func] Stripe session created successfully: ${session.id}`);
        //###### End Create Stripe Session ######

        //###### Return session ID ######
        return { id: session.id };

    } catch (error) {
        //###### Stripe Error Handling ######
        logger.error("[createCheckoutSession Func] Error creating Stripe checkout session:", error);
        let userMessage = "Failed to create checkout session.";
        if (error.type === 'StripeInvalidRequestError' && error.message.includes("No such price")) {
            userMessage = `Invalid package selected (Price ID: ${priceId} not found in Stripe).`;
        }
        else if (error.type === 'StripeAuthenticationError') {
            userMessage = "Stripe authentication failed. Check Secret Key config.";
        }
        else if (error.type) {
            userMessage = `Stripe Error: ${error.message}`;
        }
        else {
            userMessage = `An unexpected error occurred: ${error.message}`;
        }
        logger.error("[createCheckoutSession Func] Full Stripe Error details:", JSON.stringify(error, null, 2));
        throw new HttpsError("internal", userMessage, { originalErrorCode: error.code, stripeErrorType: error.type });
        //###### End Stripe Error Handling ######
    }
});


//###### Cloud Function 2: Stripe Webhook Handler (HTTPS Request) ######
// Reference secrets using runWith
exports.stripeWebhook = onRequest(STRIPE_SECRETS, async (request, response) => {
    logger.log("--- [stripeWebhook Func] Execution started (using secrets) ---");

    //###### Retrieve Secrets/Config ######
    const stripeSecretKey = process.env.STRIPE_SECRET;
    const liveWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!stripeSecretKey || !liveWebhookSecret) {
        logger.error("[stripeWebhook Func] Stripe keys/secrets not found in environment secrets. Check Secret Manager config & function IAM permissions.");
        response.status(500).send("Server configuration error [Stripe Secrets].");
        return;
    }
    // Initialize Stripe client *inside* the function scope when using secrets
    const stripeInstance = stripe(stripeSecretKey);
    logger.log("[stripeWebhook Func] Stripe client initialized using secret.");
    //###### End Retrieve Secrets ######

    //###### Verify Signature ######
    const sig = request.headers["stripe-signature"];
    let event;
    if (!sig || !request.rawBody) {
        logger.error("[stripeWebhook Func] Missing signature header or raw body.");
        response.status(400).send("Webhook Error: Missing signature or body.");
        return;
    }
    try {
        // Verify using the secret read from process.env
        event = stripeInstance.webhooks.constructEvent(request.rawBody, sig, liveWebhookSecret);
        logger.log(`[stripeWebhook Func] Webhook event verified: ${event.id}, Type: ${event.type}`);
    } catch (err) {
        logger.error("⚠️ [stripeWebhook Func] Webhook signature verification failed.", err.message);
        response.status(400).send(`Webhook Error: ${err.message}`);
        return;
    }
    //###### End Verify Signature ######

    //###### Process Event ######
    if (event.type === "checkout.session.completed") {
        const session = event.data.object;
        logger.log(`[stripeWebhook Func Processing checkout.session.completed for session: ${session.id}`);
        if (session.payment_status !== 'paid') { logger.log("Not paid"); response.status(200).send("OK - Not Paid"); return; } // Acknowledge but exit
        const userId = session.client_reference_id;
        if (!userId) { logger.error("Missing client_id"); response.status(400).send("Missing client_id"); return; } // Acknowledge but exit
        logger.log(`[stripeWebhook Func] Found userId: ${userId}`);

        try {
            //###### Get Line Items & Price Details ######
            logger.log(`[stripeWebhook Func] Listing line items for session: ${session.id}`);
            // Use the local stripeInstance initialized with the secret
            const lineItems = await stripeInstance.checkout.sessions.listLineItems(session.id, { limit: 1 });
            if (!lineItems.data?.length || !lineItems.data[0].price) {
                throw new Error("Cannot get price details from Stripe.");
            }
            const priceId = lineItems.data[0].price.id;
            const price = await stripeInstance.prices.retrieve(priceId, { expand: ['product'] });
            //###### End Get Line Items & Price ######

            //###### Get Token Amount ######
            const tokenAmountStr = price.metadata?.tokenAmount || price.product?.metadata?.tokenAmount;
            logger.log(`[stripeWebhook Func] Found tokenAmount metadata string: ${tokenAmountStr}`);
            if (!tokenAmountStr) {
                throw new Error(`Missing tokenAmount metadata for Price ID: ${priceId}`);
            }
            const tokensToAdd = parseInt(tokenAmountStr, 10);
            if (isNaN(tokensToAdd) || tokensToAdd <= 0) {
                throw new Error(`Invalid tokenAmount metadata value: '${tokenAmountStr}'`);
            }
            logger.log(`[stripeWebhook Func] Parsed tokensToAdd: ${tokensToAdd}`);
            //###### End Get Token Amount ######

            //###### Update Firestore in 'centre-connect' DB ######
            // 'db' variable points to 'centre-connect'
            const userRef = db.collection("users").doc(userId);
            logger.log(`[stripeWebhook Func] Attempting to set/merge tokenBalance in DB 'centre-connect' for user ${userId}`);
            // Use set with merge for safety against race conditions or missing docs
            await userRef.set({
                tokenBalance: admin.firestore.FieldValue.increment(tokensToAdd)
            }, { merge: true });
            logger.log(`[stripeWebhook Func] ✅ Successfully set/merged tokenBalance for user ${userId}`);
            //###### End Update Firestore ######

            ////###### Optional Transaction Logging ######
            try {
                const transactionRef = userRef.collection('transactions').doc(session.id); // Use session ID for idempotency
                await transactionRef.set({
                    type: 'purchase', amount: tokensToAdd, description: price.product?.name || `Purchase (${tokensToAdd} tokens)`,
                    stripePriceId: priceId, stripeSessionId: session.id, status: 'completed',
                    purchaseDate: admin.firestore.FieldValue.serverTimestamp()
                }, { merge: true });
                logger.log(`[stripeWebhook Func] Transaction log created/updated for session ${session.id}`);
            }
            catch (transactionError) {
                logger.error(`[stripeWebhook Func] Error creating transaction log:`, transactionError);
            }
            //###### End Optional Transaction Logging ######

        }
        catch (error) {
            // Catch errors from Stripe API calls or Firestore updates
            logger.error(`[stripeWebhook Func] Handler error processing session ${session.id}, user ${userId}:`, error);
            // Respond with 500 so Stripe retries (if appropriate for the error)
            response.status(500).send(`Webhook handler processing error: ${error.message}`);
            return; // Exit after sending error response
        }
    }
    else {
        logger.log(`[stripeWebhook Func] Unhandled event type received: ${event.type}`);
    }
    //###### End Process Event ######

    //###### Acknowledge Stripe ######
    logger.log(`[stripeWebhook Func] Acknowledging event: ${event.id} Type: ${event.type}`);
    response.status(200).send("Acknowledged"); // Send success response to Stripe
    //######End Acknowledge Stripe ######
});