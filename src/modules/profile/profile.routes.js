const {
    createProfile,
    getProfiles,
    getProfile,
    updateProfile,
    deleteProfile,
} = require("./profile.controller");
const validate = require("../core/middlewires/validate");
const { createProfileSchema } = require("./profile.schema");
const AuthStrategy = require("../user/user-authentication.middleware");

module.exports = (app) => {
    app.route("/profiles")
        .post(validate(createProfileSchema), createProfile)
        .get(getProfiles);

    app.route("/profile/:id")
        .patch(AuthStrategy, updateProfile)
        .delete(deleteProfile);

    app.route("/profiles/:profile_name").get(AuthStrategy, getProfile);
};
