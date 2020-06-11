const Post = require('../models/post');

exports.createPosts = (req, res, next) => {
  const url = req.protocol + '://' + req.get('host');
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + '/images/' + req.file.filename
  });
  post.save().then((post) => {
    res.status(201).json({
      message: 'Posted successful',
      post: {
        id: post._id,
        title: post.title,
        content: post.content,
        imagePath: post.imagePath
      }
    });
  });
}

exports.getPosts = (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const postQuery = Post.find();
  let fetchedPosts;
  if (pageSize && currentPage) {
    postQuery
      .skip(pageSize * (currentPage - 1))
      .limit(pageSize);
  }
  postQuery
  .then((documents) => {
    fetchedPosts = documents;
    return Post.countDocuments();
  })
  .then((count) => {
    res.status(200).json({
      message: 'Post fetched Successful',
      posts: fetchedPosts,
      maxPosts: count
    });
  }).catch(() => {console.log('error')});
}

exports.getPost = (req, res, next) => {
  Post.findById(req.params.id).then( post => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({
        message: 'Post not found'
      })
    }
  });
}

exports.editPost = (req, res, next) => {
  let imagePath = req.body.imagePath;
  if (req.file) {
    const url = req.protocol + '://' + req.get('host');
    imagePath = url + '/images/' + req.file.filename;
  }
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath
  });
  console.log(post);
  Post.updateOne({ _id: req.params.id }, post).then(result => {
    console.log(result);
    res.status(200).json({ message: 'Updated Successfully' });
  });
}

exports.deletePost = (req, res, next) => {
  Post.deleteOne({_id: req.params.id}).then( result => {
    console.log(result);
  });
  res.status(200).json({
    message: 'Deleted Successfully'
  })
}
