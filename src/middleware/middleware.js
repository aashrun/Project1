const jwt = require("jsonwebtoken");
const blogModel = require("../models/blogModel")

const authenticate = function (req, res, next) {
  try {
    let token = req.headers["x-api-key"];
    if (!token) return res.status(400).send({ status: false, msg: "token must be present" });
    let decodedToken = jwt.verify(token, "Excellence Over Success");

    if (!decodedToken) return res.status(401).send({ status: false, msg: "token is invalid" });

    next()
  }
  catch (error) {
    res.status(500).send({ msg: error.message })
  }
}


const authorize = async function (req, res, next) {
  try {
    let token = req.headers["x-api-key"];
    let inputId = req.params.blogId
    let newInput = req.query.authorId
    let userTobeModified
    if (!token) return res.status(400).send({ status: false, msg: "token must be present" });
    let decodedToken = jwt.verify(token, "Excellence Over Success");
    if (!decodedToken)
      return res.status(401).send({ status: false, msg: "token is invalid" });
    let userLoggedIn = decodedToken.authorId

    if (inputId) {
      let author = await blogModel.findOne({ _id: inputId })
      if (!author) return res.status(404).send({ status: false, msg: "No Blog found" });
       userTobeModified = author.authorId.toString()
    }

    else {
       userTobeModified = newInput
    }

    if (userTobeModified != userLoggedIn) return res.status(403).send({ status: false, msg: "You are not Authorized" })

    next()
  } catch (error) {
    res.status(500).send({ msg: error.message })
  }
}









module.exports.authenticate = authenticate
module.exports.authorize = authorize