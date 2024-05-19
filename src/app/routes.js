
module.exports = (app) => {
  app.get("/", async (req, res) => {
    return res.render("index");
  });
};
