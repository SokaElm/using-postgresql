// controllers/usersController.js
const { body, query, validationResult } = require("express-validator");
const db = require("../db/queries");

async function getUsernames(req, res) {
  const searchedText = req.query.search || "";

  if (searchedText === "") {
    const usernames = await db.getAllUsernames();
    console.log("Usernames: ", usernames);
    res.send("Usernames: " + usernames.map((user) => user.username).join(", "));
  } else {
    const searchResult = await db.searchText(searchedText);
    console.log("Results: ", searchResult);
    res.send(
      "Results: " + searchResult.map((user) => user.username).join(", ")
    );
  }
}

async function createUsernameGet(req, res) {
  res.render("createUser", {
    title: "Create user",
  });
}

async function createUsernamePost(req, res) {
  const { username } = req.body;
  await db.insertUsername(username);
  res.redirect("/");
}

async function deleteUsernameGet(req, res) {
  await db.deleteUsername();
  res.redirect("/");
}

module.exports = {
  getUsernames,
  createUsernameGet,
  createUsernamePost,
  deleteUsernameGet,
};
