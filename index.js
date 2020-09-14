const Koa = require("koa");
const app = new Koa();
const koaBody = require("koa-body");

// Set up body parsing middleware
app.use(koaBody());

const initDB = require("./database");

initDB();

const User = require("./models/user");

app.use(async (ctx, next) => {
  ctx.user = await User.findOne({ ip: ctx.ip });
  console.log(ctx.user, ctx.request.ip);
  if (!ctx.user) {
    ctx.user = new User({
      ip: ctx.ip,
    });
  }
  await next();

  ctx.user.save();
});

// Use the Router on the sub route /books
app.use(require("./api.js").routes());

app.listen(3000);
