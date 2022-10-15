const http = require("http");
const https = require("https");
const Koa = require("koa");
const app = new Koa({ proxy: false });
const koaBody = require("koa-body");
const cors = require("@koa/cors");
const cron = require("cron");
app.use(cors());

// Set up body parsing middleware
app.use(koaBody());

const initDB = require("./database");

initDB();

const User = require("./models/user");
const DailyRecord = require("./models/dailyRecord");
const MonthlyRecord = require("./models/monthlyRecord");

app.use(async (ctx, next) => {
  const uuid = ctx.query.uuid;
  const ipAddress =
    (ctx.headers["x-forwarded-for"] &&
      ctx.headers["x-forwarded-for"].split(",")[0]) ||
    ctx.ip;
  if (uuid) {
    ctx.user = await User.findOne({ uuid: ipAddress });
  }
  if (!ctx.user) {
    ctx.user = await User.findOne({ ip: ipAddress });
  }
  if (!ctx.user) {
    ctx.user = new User({
      ip: ipAddress,
      uuid: uuid,
    });
  }
  if (!ctx.user.uuid && uuid) {
    ctx.user.uuid = uuid;
  }
  if (ctx.query.gnomeVersion) {
    ctx.user.gnomeVersion = ctx.query.gnomeVersion;
  }
  if (ctx.query.version && ctx.query.version !== "undefined") {
    ctx.user.version = ctx.query.version;
  }
  if (ctx.query.commit) {
    ctx.user.commit = ctx.query.commit;
  }
  await next();
  ctx.user.save();
});

// Use the Router on the sub route /books
app.use(require("./api.js").routes());

app.listen(process.env.PORT || 80);

cron.job(
  "0 0 * * *",
  async () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (today.getDate() == 1) {
      const lastMonth = new Date(today.getTime()).setMonth(
        today.getMonth() - 1
      );
      const monthlyRecord = new MonthlyRecord({
        date: today,
        count: await User.countDocuments({
          shellAccess: { $gte: lastMonth },
        }),
      });

      monthlyRecord.save();
    }

    const yesterday = new Date(today.getTime()).setDate(today.getDate() - 1); // new month

    const dailyRecord = new DailyRecord({
      date: today,
      count: await User.countDocuments({
        shellAccess: { $gte: yesterday },
      }),
    });

    dailyRecord.save();
  },
  null,
  true
);
