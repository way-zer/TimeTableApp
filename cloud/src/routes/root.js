const Router = require('koa-router');

const router = new Router();

router.get('/about', async (ctx) => {
    await ctx.render('about.ejs')
});

module.exports = router;
