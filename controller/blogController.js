const Blog = require('./../model/blogModel');
const {mongo} = require("mongoose");


function convertQueryToMongoQuery(query) {
    const mongoQuery = {};
    console.log(query)
    for (const key in query) {
        if (query.hasOwnProperty(key)) {
            mongoQuery[key] = { $in: [query[key]] };
        }
    }
    return mongoQuery;
}




// console.log(mongoQuery); // Output: { category: { $in: ['technology'] }, source: { $in: ['punchng'] } }

exports.postBlog = async (req, res) => {
    try{
        const newBlog = await Blog.create({
            title: req.body.title,
            category: req.body.category.split(', '),
            content: req.body.content,
            source: req.body.source.split(', '),
            createdAt: Date.now(),
            user: req.user.id
        })
        req.user.blog.push(newBlog._id)
        req.user.save({validateBeforeSave: false})


        res.status(200).json({
            status: 'success',
            data : {
                blog: newBlog
            }
        })
    }catch(err){
        res.status(404).json({
            status: 'failed',
            data: {
                err: err.message
            }
        })
    }

}

exports.getAllBlog = async (req, res) => {

    try{
        const excludedField = ['sort', 'page','limit', 'fields']

        const queryStr = {...req.query};
        excludedField.forEach((el) => {
            delete queryStr[el]
        })

        const mongoQuery = convertQueryToMongoQuery(queryStr);

        let allBlogs;


        allBlogs = Blog.find(mongoQuery);
        if(req.query.sort) {
            console.log(req.query.sort)
            allBlogs = allBlogs.sort(req.query.sort.split(',').join(' '))
        }else{
            allBlogs = allBlogs.sort('-createdAt')
        }

        if(req.query.fields){
            allBlogs = allBlogs.select(req.query.fields.split(',').join(' '))
        }else{
            allBlogs = allBlogs.select('-__v')
        }
        if(req.query.page){
            const page = +req.query.page
            const limit = +req.query.limit
            allBlogs = allBlogs.skip(page-1).limit(limit)

        }else{
            const page = 1;
            const limit = 100
            allBlogs = allBlogs.skip(page-1).limit(limit)

        }
        allBlogs = await allBlogs

        res.status(200).json({
            status: 'success',
            data: {
                blogs: allBlogs
            }
        })
    }catch (err){
        res.status(404).json({
            status:'fail',
            data: {
                err:err.message
            }
        })
    }

}


exports.deletePost = async (req, res) => {
    try{
        if(!req.user.blog.includes(req.params.id)) throw new Error('you do not have access to delete this blog');
        const deleted = await Blog.findByIdAndDelete(req.params.id);
        res.status(200).json({
            status: 'success',
            data: {

            }
        })
    }catch(err){
        res.status(400).json({
            status: 'failed',
            err: err.message
        })
    }

}


exports.getAPost = async (req, res) => {
    try{
        const post = await Blog.findById(req.params.id)
        res.status(200).json({
            status: 'success',
            data: {
                post
            }
        })
    }catch(err){
        res.status(200).json({
            status: 'failed',
            err: err.message

        })
    }
}


exports.updateBlog =async (req, res) => {
    try{
        const toUpdate = {
            title: req.body.title,
            category: req.body.category,
            content: req.body.content,
            source: req.body.source,
        }
        const updated = await Blog.findByIdAndUpdate(req.params.id, toUpdate);
        res.status(200).json({
            status: 'success',
            data:{
                blog: updated
            }
        })
    }catch(err){
        res.status(200).json({
            status: 'failed',
            err: err.message

        })
    }
}