const Router = require("koa-router");
const router = new Router();

router.get("/", (ctx, next) => {
  ctx.body = JSON.stringify(ctx.user.ip);
  next();
});

router.get("/website", async (ctx, next) => {
  ctx.user.websiteAccess = Date.now();
  ctx.status = 200;
  next();
});

router.get("/shell", async (ctx, next) => {
  ctx.user.shellAccess = Date.now();
  ctx.status = 200;
  next();
});

router.get("/github", async (ctx, next) => {
  ctx.user.githubAccess = Date.now();
  ctx.status = 200;
  next();
});

module.exports = router;
