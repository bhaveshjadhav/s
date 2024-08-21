//Sample routes defination

// const routename = require('routePath')
const homeRoute = require('./funds/routes/homeRoute');
const stocksRoute = require('./funds/routes/stocksRoute');
const fundHouseRoute = require('./funds/routes/fundHouseRoute');
const fundRoute = require('./funds/routes/fundRoute');
const industryRoute = require('./funds/routes/industryRoute');
const mediaRoute = require('./funds/routes/mediaRoute');
const userRoute = require('./user/routes/userRoute');
const moneyFlow = require('./funds/routes/moneyFlowRoute');
const contactRoute = require('./contact/routes/contactRoute');
const moneyFlowRoute = require('./funds/routes/moneyFlowRoute');
const operationsUsersRoute = require('./operationsUsers/routes/operationsUsersRoute');

exports.addAllRoutes = (app) => {
    // app.use('/service/reporting/{baseUrl}', {routeName});
    app.use('/service/home', homeRoute);
    app.use('/service/moneyFlow', moneyFlowRoute);
    app.use('/service/stocks', stocksRoute);
    app.use('/service/fundHouse', fundHouseRoute);
    app.use('/service/fund', fundRoute);
    app.use('/service/sector', industryRoute);
    app.use('/service/media', mediaRoute);
    app.use('/service/user', userRoute);
    app.use('/service/support', contactRoute);
    app.use('/service/user', userRoute);
    app.use('/service/operations/users', operationsUsersRoute);
};
