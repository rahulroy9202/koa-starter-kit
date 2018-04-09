const Router = require('koa-router');
const router = new Router();
const api = new Router();

const users = require('./users-router');

api.use(users);

router.use('/api', api.routes());

module.exports = router;
