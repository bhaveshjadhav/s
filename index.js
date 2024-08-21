const express = require('express');
require('express-async-errors');
const compress = require('compression');
const async = require('async');
const Logger = require('./utils/logger');

const routes = require('./routes');
const bodyParser = require('body-parser');
const homeService = require('./funds/services/homeService');
const stocksService = require('./funds/services/stocksService');
const emailHelper = require('./utils/emailHelper');


require('dotenv').config();

Logger.addFileTransport((process.env.SERVICE_NAME || 'server') + '.log');

const app = express();
app.use(bodyParser.json({type: 'application/json'}));
app.use(compress());
app.set('trust proxy', true);

// All requests to this router will first hit this middleware.
// This will handle CORS requests.
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Credentials', true);
    // if (config.ENVIRONMENT === 'development' ||
    //     config.ENVIRONMENT === 'qa') {
    //     res.header('Access-Control-Allow-Origin', '*');
    // }
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, cache-control, x-requested-with');
    res.header('Access-Control-Allow-Origin', '*');

    if (req.method === "OPTIONS") {
        res.status(200);
        res.end();
    } else {
        Logger.createRequestContext();
        next();
    }
});

// let tracingMiddleware = TracingHelper.retrieveMiddleware();
// if (tracingMiddleware) {
//     app.use(tracingMiddleware);
// }
// app.use(RequestInterceptor.interceptAllRequest);
routes.addAllRoutes(app);
// app.use(RequestInterceptor.handleNoRoutes);
// app.use(RequestInterceptor.catchAllErrors);

process.on('uncaughtException', (err) => {
    Logger.error('*********** Uncaught Exception ***********');
    Logger.error('uncaughtException in processing  ' + err + ' message:' + err.message + ' stack:' + err.stack);
});

process.on('unhandledRejection', (err) => {
    Logger.error('*********** Uncaught Rejection ***********');
    Logger.error('unhandledRejection in processing  ' + err + ' message:' + err.message + ' stack:' + err.stack);
});

// set port, listen for requests
const PORT = process.env.PORT || 10217;

const preprocessingTasks = [];
preprocessingTasks.push(callback => stocksService.initMarketCapForStocks(callback));
preprocessingTasks.push(callback => homeService.initFundHouseCache(callback));
preprocessingTasks.push(callback => homeService.initFundCache(callback));
preprocessingTasks.push(callback => homeService.initStockCache(callback));
preprocessingTasks.push(callback => homeService.initIndustryCache(callback));
preprocessingTasks.push(callback => homeService.initMonthlyTrendCache(callback));
preprocessingTasks.push(callback => homeService.initDimensionCache(callback));
preprocessingTasks.push(callback => homeService.initOverviewCache(callback));
preprocessingTasks.push(callback => emailHelper.init(callback));

async.series(preprocessingTasks, (err) => {
    if (err) {
        Logger.error('*********** Application Server is not started ***********');
        Logger.error('Error in executing init functions :' + err.message);
        return;
    }
    // Start the express App and listen on port 8081
    app.listen(PORT, () => {
        Logger.info(`*********** Application Server is listening on Port ${PORT} ***********`);
    });
});