const http = require("http");
const https = require("https");
const Koa = require("koa");
const app = new Koa({ proxy: false });
const koaBody = require("koa-body");

// Set up body parsing middleware
app.use(koaBody());

const initDB = require("./database");

initDB();

const User = require("./models/user");

app.use(async (ctx, next) => {
  const ipAddress =
    (ctx.headers["x-forwarded-for"] &&
      ctx.headers["x-forwarded-for"].split(",")[0]) ||
    ctx.ip;
  ctx.user = await User.findOne({ ip: ipAddress });
  if (!ctx.user) {
    ctx.user = new User({
      ip: ipAddress,
    });
  }
  await next();

  ctx.user.save();
});

// Use the Router on the sub route /books
app.use(require("./api.js").routes());
/* 
http.createServer(app.callback()).listen(3000);*/
//https.createServer(app.callback()).listen(8080);
app.listen(3000);
