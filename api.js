const Router = require("koa-router");
const router = new Router();
const User = require("./models/user");
const Notification = require("./models/notification");

router.get("/", async (ctx, next) => {
  const todayWebsiteVisits = await User.countDocuments({
    websiteAccess: { $gte: new Date().setHours(0, 0, 0, 0) },
  });
  const allWebsiteVisits = await User.countDocuments({
    websiteAccess: { $exists: true },
  });
  const todayShellVisits = await User.countDocuments({
    shellAccess: { $gte: new Date().setHours(0, 0, 0, 0) },
  });
  const allShellVisits = await User.countDocuments({
    shellAccess: { $exists: true },
  });
  ctx.body = JSON.stringify({
    website: {
      today: todayWebsiteVisits,
      allTime: allWebsiteVisits,
    },
    shell: {
      today: todayShellVisits,
      allTime: allShellVisits,
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
