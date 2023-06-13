const bcrypt = require("bcrypt");
const LocalStrategy = require("passport-local").Strategy;
const db = require("../db");

module.exports = function (passport) {
  passport.use(
    new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
      const sqlSelect = "SELECT * FROM Users WHERE email = ?";
      db.query(sqlSelect, [email], async (err, result) => {
        if (err) {
          return done(err);
        }
        if (result.length === 0) {
          return done(null, false, { message: "Invalid email or password" });
        }
        const user = result[0];
        try {
          const passwordMatch = await bcrypt.compare(password, user.password);
          if (passwordMatch) {
            return done(null, user);
          } else {
            return done(null, false, { message: "Invalid email or password" });
          }
        } catch (error) {
          return done(error);
        }
      });
    })
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    const sqlSelect = "SELECT * FROM Users WHERE id = ?";
    db.query(sqlSelect, [id], (err, result) => {
      if (err) {
        return done(err);
      }
      if (result.length === 0) {
        return done(null, false);
      }
      const user = result[0];
      return done(null, user);
    });
  });
};
