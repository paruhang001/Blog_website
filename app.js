const express = require("express");
const app = express();
const db = require("./database/data");
const bcrypt = require("bcrypt");
const cookieparser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const verify = require("./middleware/verify");

app.use(cookieparser());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.redirect("/login");
});
app.get("/login", (req, res) => {
  const token = req.cookies.token;
  if (token) {
    try {
      jwt.verify(token, "mysecretkey");
      return res.redirect("/home");
    } catch (err) {
    }
  }
  res.render("authen/login.ejs");
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await db.user.findAll({ where: { email } });

  if (user.length === 0) {
    return res.send("Not registered");
  }

  const isPassmatch = bcrypt.compareSync(password, user[0].password);
  if (isPassmatch) {
    const token = jwt.sign({ id: user[0].id }, "mysecretkey", {
      expiresIn: "1d",
    });
    res.cookie("token", token);
    res.redirect("/home");
  } else {
    res.send("Incorrect password");
  }
});

app.get("/register", (req, res) => {
  res.render("authen/register.ejs");
});

app.post("/register", async (req, res) => {
  const { username, email, password, confirm_password } = req.body;

  if (password !== confirm_password) {
    return res.send("Passwords do not match");
  }

  await db.user.create({
    username,
    email,
    password: bcrypt.hashSync(password, 10),
  });

  res.redirect("/login");
});


app.get("/home",verify, async (req, res) => {
  const posts = await db.post.findAll();
  res.render("blog/home.ejs", { posts });
});

app.get("/add", verify, (req, res) => {
  res.render("blog/add.ejs");
});

app.post ("/post", async (req, res) => {
  const userId = req.userId;
  const { Title, description, date } = req.body;
  await db.post.create({ Title, description, date, userId });
  res.redirect("/home");
});


app.get("/edit/:id", verify, async (req, res) => {
  const id = req.params.id;
  const post = await db.post.findOne({ where: { id } }); 
  res.render("blog/update.ejs", { post });
});


app.post("/edit/:id", verify, async (req, res) => {
  const id = req.params.id;
  const { Title, description } = req.body;
  await db.post.update({ Title, description}, { where: { id } });
  res.redirect("/home");
});


app.get("/delete/:id", async (req, res) => {
  const id = req.params.id;
  await db.post.destroy({ where: { id } });
  res.redirect("/home");
});

app.get("/post/:id", async (req, res) => {
  const post = await db.post.findByPk(req.params.id);
  if (!post) return res.status(404).send("Post not found");
  res.render("blog/view.ejs", { post });
});


app.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.redirect("/login");
});

app.listen(4000,()=>{
    console.log("backend started")
})


