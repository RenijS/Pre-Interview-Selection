const LocalStrategy = require("passport-local").Strategy;
const passport = require("passport");
const pool = require("./db");
const bcrypt = require("bcrypt");

function initialize(passport) {
  const authenticateUser = (email, password, done) => {
    pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email],
      (err, result) => {
        if (err) return done(err);

        console.log(result.rows);

        if (result.rows.length > 0) {
          const user = result.rows[0];

          bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) return done(err);

            if (isMatch) {
              return done(null, user);
            } else {
              return done(null, false, { message: "Password is not correct" });
            }
          });
        } else {
          return done(null, false, { message: "Email is not registered" });
        }
      }
    );
  };

  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
      },
      authenticateUser
    )
  );
}

passport.serializeUser((user, done) => done(null, user.id));

passport.deserializeUser((id, done) => {
  pool.query("SELECT * FROM users WHERE id = $1", [id], (err, result) => {
    if (err) return done(err);

    return done(null, result.rows[0]);
  });
});

module.exports = initialize;
