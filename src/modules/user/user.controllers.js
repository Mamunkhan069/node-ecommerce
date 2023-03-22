const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("./user.model");

const users = [];

async function createUser(req, res) {
    try {
        const { firstName, lastName, email, password, confirmPassword } =
            req.body;

        const existUser = await User.findOne({
            where: { email },
        });
        if (existUser) return res.status(400).send("Already registered");

        const user = await User.create({
            firstName,
            lastName,
            email,
            password,
        });
        res.status(201).send(user);
    } catch (err) {
        console.log(err);
        res.status(500).send("Internal server error");
    }
}

async function getUsers(req, res) {
    try {
        const users = await User.findAll({
            attributes: { exclude: ["password"] },
        });
        res.status(200).send(users);
    } catch (err) {
        console.log(err);
        res.status(500).send("Internal server error");
    }
}

function deleteUser(req, res) {
    const email = req.params.email;

    const user = users.find((user) => user.email === email);

    if (!user) return res.send("User not found!");

    const index = users.findIndex((user) => user.email === email);

    users.splice(index, 1);
    res.send(user);
}

// async function updateUser(req, res) {
//     try {
//         const { firstName, lastName } = req.body;

//         const user = await User.findOne({
//             where: { email },
//             attributes: { exclude: ["password"] },
//         });

//         if (!user) return res.status(404).send("User not available!");

//         const token = jwt.sign(
//             {
//                 id: user.id,
//                 email: user.email,
//                 firstName: user.firstName,
//                 lastName: user.lastName,
//             },
//             process.env.TOKEN_SECRET,
//             { expiresIn: "1h", issuer: user.email }
//         );

//         res.cookie("access_token", token, {
//             httpOnly: true,
//         });
//         res.status(200).send(user);
//     } catch (err) {
//         console.log(err);
//         res.status(500).send("Internal server error");
//     }

//     const { firstName, lastName } = req.body;
//     const email = req.user.email;
//     const user = users.find((user) => user.email === email);

//     user.firstName = firstName;
//     user.lastName = lastName;

//     res.send(user);
// }

// async function updateUser(req, res) {
//     try {
//         const { firstName, lastName, email, password } = req.body;
//         const userId = req.params.id; // assuming you are passing user id as a parameter

// const user = await User.findOne({
//     where: { id: userId },
// });

//         if (!user) return res.status(404).send("User not found");

//         user.firstName = firstName !== undefined ? firstName : user.firstName;
//         user.lastName = lastName !== undefined ? lastName : user.lastName;
//         user.email = email !== undefined ? email : user.email;
//         user.password = password !== undefined ? password : user.password;

//         await user.save();

//         res.status(200).send("updated");
//     } catch (err) {
//         console.log(err);
//         res.status(500).send("Internal server error");
//     }
// }
async function updateUser(req, res) {
    try {
        const { firstName, lastName, email, password } = req.body;
        const user = req.user;

        user.firstName = firstName !== undefined ? firstName : user.firstName;
        user.lastName = lastName !== undefined ? lastName : user.lastName;
        user.email = email !== undefined ? email : user.email;
        user.password = password !== undefined ? password : user.password;

        await user.save();

        res.status(200).send(user);
    } catch (err) {
        console.log(err);
        res.status(500).send("Internal server error");
    }
}

function getUser(req, res) {
    const email = req.params.email;

    const user = users.find((user) => user.email === email);

    if (!user) return res.send("User not available!");

    res.send(user);
}

async function login(req, res) {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({
            where: { email },
            // attributes: { exclude: ["password"] },
        });

        if (!user || !user.password || !user.validPassword(password))
            return res.status(400).send("Invalid Credintials");

        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
            },
            process.env.TOKEN_SECRET,
            { expiresIn: "1h", issuer: user.email }
        );

        res.cookie("access_token", token, {
            httpOnly: true,
        });
        res.status(200).send(user);
    } catch (err) {
        console.log(err);
        res.status(500).send("Internal server error");
    }
}

async function findUser(id) {
    console.log("find user is called");
    try {
        const user = await User.findOne({
            where: { id: id },
        });
        return user;
    } catch (err) {
        console.log(err);
        res.status(500).send("Internal server error");
    }
}

module.exports.createUser = createUser;
module.exports.getUsers = getUsers;
module.exports.deleteUser = deleteUser;
module.exports.updateUser = updateUser;
module.exports.getUser = getUser;
module.exports.login = login;
module.exports.findUser = findUser;
