const authorModel = require("../models/authorModel")
const blogModel = require("../models/blogModel")
const mongoose = require('mongoose');


const createBlog = async (req, res) => {
    try {
        let Blog = req.body
        if (Object.keys(Blog).length == 0) {
            return res.status(400).send({ status: false, msg: "Invalid request Please provide valid Author  details" });
        }
        if (!Blog.title) return res.status(400).send({ msg: " title is required " })
        if (!Blog.body) return res.status(400).send({ msg: "body is required " })
        if (!Blog.authorId) return res.status(400).send({ msg: " authorId is required " })
        if (!Blog.category) return res.status(400).send({ msg: " category is require" })
        if (Blog.isPublished==true) return res.status(400).send({ msg: " isPublished should be false" })
        let isValid = mongoose.Types.ObjectId.isValid(Blog.authorId)
        if (!isValid) return res.status(400).send({ status: false, msg: "enter valid objectID" })

        let checkAuthor = await authorModel.findById(Blog.authorId)
        if (!checkAuthor) return res.status(404).send({ status: false, msg: "Author not found" })

        let blogCreated = await blogModel.create(Blog)

        res.status(201).send({ status: true, data: blogCreated })
    } catch (error) {
        res.status(500).send({ msg: error.message })
    }
}



// const getBlogsData = async (req, res) => {
//     try {

//         let input = req.query.authorId
//         let category = req.query.category
//         if (input) {
//             let isValid = mongoose.Types.ObjectId.isValid(input)
//             if (!isValid) return res.status(400).send({ status: false, msg: "enter valid objectID" })
//             let blogs = await blogModel.find({ authorId: input ,isDeleted: false, ispublished: true }).populate("authorId")

//             console.log(blogs)

//             if (blogs.length == 0) {
//                 return res.status(404).send({ status: false, msg: "Sorry , No data found" });
//             }
//             else return res.status(200).send({ status: true, data: blogs })
//         }
//         else {
//             let blogs = await blogModel.find({ isDeleted: false, ispublished:true}).populate("authorId")

//             if (blogs.length == 0) {
//                 return res.status(404).send({ status: false, msg: "Sorry , No data found" });
//             }

//             else return res.status(200).send({ status: true, data: blogs })
//         }

//     }
//     catch (error) {
//         res.status(500).send({ msg: error.message })
//     }
// }

const getBlogsData = async (req, res) => {
    try {

        let input = req.query
       if (input) {

            let blogsData = []
            let blogs = await blogModel.find(input).populate('authorId')
            if (!blogs || blogs.length==0) return res.status(404).send({ msg: "no blog found" })
            blogs.filter(n => {

                if (n.isDeleted == false && n.isPublished == true)
                    blogsData.push(n)
            })

            return res.status(200).send({ data: blogsData })
        }
        else {
            let blogs = await blogModel.find({ isDeleted: false, isPublished: true }).populate('authorId')
            if ( blogs.length==0) return res.status(404).send({ msg: "no blog found" })
            return res.status(200).send({ data: blogs })
        }

    }
    catch (error) {
        res.status(500).send({ msg: error.message })
    }
}



const updateBlog = async (req, res) => {
    try {
        let inputId = req.params.blogId
        let isValid = mongoose.Types.ObjectId.isValid(inputId)
        if (!isValid) return res.status(400).send({ status: false, msg: "enter valid objectID" })

        let author = req.body
        let title = req.body.title
        let body = req.body.body
        let tags = req.body.tags
        let subCategory = req.body.subCategory

        if (Object.keys(author).length == 0) {
            return res.status(400).send({ status: false, msg: "Invalid request Please provide valid  details in body" });
        }

        let date = Date.now()
        let alert1 = await blogModel.findById(inputId)
        if (!alert1) return res.status(404).send({ status: false, msg: " No Blog found" })
        let alert = await blogModel.findOne({ _id: inputId, isDeleted: true })
        if (alert) return res.status(400).send({ status: false, msg: "Blog already deleted" })

        let blogs = await blogModel.findOneAndUpdate({ _id: inputId },
            { $set: { title: title, body: body, isPublished: true, publishedAt: date }, $push: { tags: tags, subCategory: subCategory } }, { new: true })


        if (!blogs) return res.status(404).send({ status: false, msg: "no blog found" })
        res.status(200).send({ status: true, msg: blogs })
    }
    catch (error) {
        res.status(500).send({ msg: error.message })
    }
}


const deleteBlog = async (req, res) => {
    try {
        let inputId = req.params.blogId

        let isValid = mongoose.Types.ObjectId.isValid(inputId)
        if (!isValid) return res.status(400).send({ status: false, msg: "enter valid objectID" })
        let date = Date.now()

        let alert = await blogModel.findOne({ _id: inputId, isDeleted: true })
        if (alert) return res.status(409).send({ status: false, msg: "Blog already deleted" })

        let data = await blogModel.findOneAndUpdate({ _id: inputId },
            { $set: { isDeleted: true, deletedAt: date } }, { new: true })

        if (!data) return res.status(404).send({ status: false, msg: "no data found" })

        res.status(200).send({ status: true, msg: data })
    }
    catch (error) {
        res.status(500).send({ msg: error.message })
    }
}


const deleteBlogQuery = async (req, res) => {
    try {
        let inputData= req.query

        let isValid = mongoose.Types.ObjectId.isValid(authorId)
        if (!isValid) return res.status(400).send({ status: false, msg: "enter valid objectID" })
        // let input = req.query
        // let category = req.query.category
        // let tags = req.query.tags
        // let subCategory = req.query.subCategory
        // let isPublished = req.query.boolean
        let date = Date.now()

        if (Object.keys(input).length == 0) {
            return res.status(400).send({ status: false, msg: "Invalid request Please provide valid blog details in Query" });
        }

        let alert = await blogModel.find({ authorId: authorId, isDeleted: true })
        if (alert) return res.status(409).send({ status: false, msg: "Sorry ,all blogs of the selected author were already deleted" })

        let blogs = await blogModel.updateMany({inputData},
            { $set: { isDeleted: true, deletedAt: date } }, { new: true })

        if (!blogs) return res.status(404).send({ status: false, msg: "no data found" })
        res.status(200).send({ status: true, msg: blogs })
    }
    catch (error) {
        res.status(500).send({ msg: error.message })
    }
}

module.exports.createBlog = createBlog
module.exports.getBlogsData = getBlogsData
module.exports.updateBlog = updateBlog
module.exports.deleteBlog = deleteBlog
module.exports.deleteBlogQuery = deleteBlogQuery
