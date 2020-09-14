const Router = require("koa-router");
const router = new Router();

router.get("/", (ctx, next) => {
  ctx.body = JSON.stringify(ctx.headers["x-forwarded-for"] || ctx.ip);
  next();
});

router.get("/website", async (ctx, next) => {
  ctx.user.websiteAccess = Date.now();
  next();
});

router.get("/shell", async (ctx, next) => {
  ctx.user.shellAccess = Date.now();
  next();
});

router.get("/github", async (ctx, next) => {
  ctx.user.githubAccess = Date.now();
  next();
});

module.exports = router;
