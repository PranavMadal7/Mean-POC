const express = require('express');
const router = express.Router();

const checkAuth = require('../middleware/check-auth');
const extractFile = require('../middleware/file');
const PostController = require('../controller/posts');


router.post('', checkAuth, extractFile, PostController.createPosts);

router.get('/:id', PostController.getPost);

router.put('/:id', checkAuth, extractFile, PostController.editPost);

router.get('', PostController.getPosts);

router.delete('/:id', checkAuth, PostController.deletePost);

module.exports = router;
