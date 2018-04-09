const Router = require('koa-router');
const ctrl = require('controllers').users;
const router = new Router();

const auth = require('middlewares/auth-required-middleware');
const user = require('middlewares/user-middleware');

router.post('/user/login', ctrl.login);
router.post('/user', ctrl.post);

router.get('/user', user, auth, ctrl.get);

module.exports = router.routes();