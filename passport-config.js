const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");

function initialize(passport, getUserByEmail, getUserById) {
  const authenticateUsers = async (email, password, done) => {
    const user = await getUserByEmail(email);
    if (user == null) {
      return done(null, false, { message: "No user found with that email" }); 
    }
    try {
      if (await bcrypt.compare(password, user.Password)) {
        return done(null, user);
      } else {
        return done(null, false, {
          message: "Password is incorrect",
        });
      }
    } catch (error) {
      return done(error);
    }
  };
  passport.use(
    new LocalStrategy({ usernameField: "email" }, authenticateUsers)
  );
  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser((id, done) => {
    return done(null, getUserById(id));
  });
}
module.exports = initialize;
