const express = require('express');
const router = express.Router();



const authorController = require("../controllers/authorController")
const blogController = require("../controllers/blogController")
const mController = require("../middleware/middleware")




router.post("/createAuthor", authorController.createAuthor)

router.post("/createBlog", blogController.createBlog)

router.get("/getBlogsData", mController.authenticate,blogController.getBlogsData)

router.put("/updateBlog/:blogId",mController.authorize,  blogController.updateBlog)

router.delete("/deleteBlog/:blogId", mController.authorize, blogController.deleteBlog)

router.delete("/deleteBlogQuery",mController.authenticate, blogController.deleteBlogQuery)

router.post("/loginAuthor", authorController.loginAuthor)

router.all("/**", function (req, res) {
    res.status(404).send({
        status: false,
        msg: "The api you request is not available"
    })
})



module.exports = router;



