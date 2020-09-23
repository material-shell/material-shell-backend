const Router = require("koa-router");
const router = new Router();
const User = require("./models/user");
const Notification = require("./models/notification");

router.get("/", async (ctx, next) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today.getTime()).setDate(today.getDate() - 1);
  const twoDaysAgo = new Date(today.getTime()).setDate(today.getDate() - 2);

  ctx.body = JSON.stringify({
    website: {
      twoDaysAgo: await User.countDocuments({
        websiteAccess: { $gte: twoDaysAgo, $lt: yesterday },
      }),
      yesterday: await User.countDocuments({
        websiteAccess: { $gte: yesterday, $lt: today },
      }),
      today: await User.countDocuments({
        websiteAccess: { $gte: today },
      }),
      allTime: await User.countDocuments({
        websiteAccess: { $exists: true },
      }),
    },
    shell: {
      twoDaysAgo: await User.countDocuments({
        shellAccess: { $gte: twoDaysAgo, $lt: yesterday },
      }),
      yesterday: await User.countDocuments({
        shellAccess: { $gte: yesterday, $lt: today },
      }),
      today: await User.countDocuments({
        shellAccess: { $gte: today },
      }),
      allTime: await User.countDocuments({
        shellAccess: { $exists: true },
      }),
    },
  });
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

router.get("/notifications", async (ctx, next) => {
  ctx.user.shellAccess = Date.now();
  let lastCheck = new Date(ctx.query.lastCheck) || new Date();
  const unreadNotifications = await Notification.find({
    date: { $gte: new Date(lastCheck) },
  });
  ctx.body = unreadNotifications;
  next();
});

router.get("/github", async (ctx, next) => {
  ctx.user.githubAccess = Date.now();
  ctx.status = 200;
  next();
});

module.exports = router;
