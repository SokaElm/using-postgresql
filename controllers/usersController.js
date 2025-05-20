// controllers/usersController.js
const usersStorage = require("../storages/usersStorage");
const { body, query, validationResult } = require("express-validator");

exports.usersListGet = (req, res) => {
  res.render("index", {
    title: "User list",
    users: usersStorage.getUsers(),
  });
};

exports.usersCreateGet = (req, res) => {
  res.render("createUser", {
    title: "Create user",
  });
};

// exports.usersCreatePost = (req, res) => {
//   const { firstName, lastName } = req.body;
//   usersStorage.addUser({ firstName, lastName });
//   res.redirect("/");
// };

// This just shows the new stuff we're adding to the existing contents

const alphaErr = "must only contain letters.";
const lengthErr = "must be between 1 and 10 characters.";

const validateUser = [
  body("firstName")
    .trim()
    .isAlpha()
    .withMessage(`First name ${alphaErr}`)
    .isLength({ min: 1, max: 10 })
    .withMessage(`First name ${lengthErr}`),
  body("lastName")
    .trim()
    .isAlpha()
    .withMessage(`Last name ${alphaErr}`)
    .isLength({ min: 1, max: 10 })
    .withMessage(`Last name ${lengthErr}`),
  body("email").trim().isEmail().withMessage(`Email format is invalid`),
  body("age")
    .optional({ checkFalsy: true }) // permet de laisser le champ vide
    .isInt({ min: 18, max: 120 })
    .withMessage("Age must be a number between 18 and 120"),
  body("bio")
    .optional({ checkFalsy: true }) // permet de laisser le champ vide
    .trim()
    .isLength({ max: 200 })
    .withMessage(`bio must contain maximum 200 characters`),
];

// We can pass an entire array of middleware validations to our controller.
exports.usersCreatePost = [
  validateUser,
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("createUser", {
        title: "Create user",
        errors: errors.array(),
      });
    }
    const { firstName, lastName, email, age, bio } = req.body;
    usersStorage.addUser({ firstName, lastName, email, age, bio });
    res.redirect("/");
  },
];

exports.usersUpdateGet = (req, res) => {
  const user = usersStorage.getUser(req.params.id);
  res.render("updateUser", {
    title: "Update user",
    user: user,
  });
};

exports.usersUpdatePost = [
  validateUser,
  (req, res) => {
    const user = usersStorage.getUser(req.params.id);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("updateUser", {
        title: "Update user",
        user: user,
        errors: errors.array(),
      });
    }
    const { firstName, lastName } = req.body;
    usersStorage.updateUser(req.params.id, { firstName, lastName });
    res.redirect("/");
  },
];

exports.usersDeletePost = (req, res) => {
  usersStorage.deleteUser(req.params.id);
  res.redirect("/");
};

exports.usersSearchGet = [
  query("email")
    .optional({ checkFalsy: true })
    .trim()
    .isEmail()
    .withMessage("Email format is invalid"),
  (req, res) => {
    const searchedEmail = req.query.email;
    const errors = validationResult(req);

    if (!searchedEmail) {
      return res.render("search", {
        title: "Search for a user",
        user: null,
        errors: [],
      });
    }

    if (!errors.isEmpty()) {
      return res.status(400).render("search", {
        title: "Search for a user",
        user: null,
        errors: errors.array(),
      });
    }

    const users = usersStorage.getUsers();
    const isFound = users.find((user) => user.email === searchedEmail);

    if (isFound) {
      res.render("search", {
        title: "Search for a user",
        user: isFound,
        errors: [],
      });
    } else {
      res.status(400).render("search", {
        title: "Search for a user",
        user: null,
        errors: [{ msg: `No user found with email: ${searchedEmail}` }],
      });
    }
  },
];
