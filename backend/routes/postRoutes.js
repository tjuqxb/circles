const express = require('express');
const router = express.Router();
const log4js = require('log4js');
const logger = log4js.getLogger();

const {checkPostCache, addToCache, appendToKey } = require('../cache/CacheManager');
const searchController = require('../controller/SearchController');
const userController = require('../controller/UserController');
const { processTags } = require('../utils/util');

logger.level = 'off';

const PostController = require('../controller/PostController');

// With Cache
// router.get("/", checkPostCache, (req, res, next) => {
//     logger.info("getting");
//     return PostController.loadAllPosts().then((posts) => {
//         logger.info(posts);
//         redis_client.setex("posts", 3600, JSON.stringify(posts));
//         res.status(200).json(posts);
//     }).catch((err) => {
//         logger.error(err);
//         res.status(500).end();
//     });
// });

// Without Cache
// router.get("/", async (req, res, next) => {
//     logger.info("getting");
//     const { tags } = req.body;
//     return PostController.loadAllPosts().then((posts) => {
//         logger.info(posts);
//         res.status(200).json(posts);
//     }).catch((err) => {
//         logger.error(err);
//         res.status(500).end();
//     });
// });

// With Recommend and Cache
router.get("/", checkPostCache, async (req, res, next) => {
    logger.info("getting");
    const userId = req.session.userId;
    const user = await userController.findUserByUserId(userId);
    const tags = processTags(user.tags);
    logger.info(tags);
    const postIds = await searchController.searchPostByKeyword(tags);
    logger.info(postIds);
    return PostController.loadPostsByIds(postIds).then((posts) => {
        logger.info(posts);
        addToCache(userId, posts);
        res.status(200).json(posts);
    }).catch((err) => {
        logger.error(err);
        res.status(500).end();
    });
});

// With Recommend 
// router.get("/", async (req, res) => {
//     logger.info("getting");
//     const userId = req.session.userId;
//     const user = await userController.findUserByUserId(userId);
//     const tags = processTags(user.tags);
//     logger.info(tags);
//     const postIds = await searchController.searchPostByKeyword(tags);
//     logger.info(postIds);
//     return PostController.loadPostsByIds(postIds).then((posts) => {
//         logger.info(posts);
//         res.status(200).json(posts);
//     }).catch((err) => {
//         logger.error(err);
//         res.status(500).end();
//     });
// });

router.post("/", (req, res, next) => {
    logger.info("posting");
    let { content, date, userId, tags, imgLink } = req.body;
    logger.info(date);
    logger.info(typeof date);
    date = new Date(date);
    logger.info(date);
    logger.info(typeof date);
    return PostController.addPost(content, date, userId, tags, imgLink).then((post) => {
        searchController.addPostToCluster(post._id, tags, content);
        appendToKey(userId, post);
        res.status(200).json(post);
    }).catch((err) => {
        logger.error(err);
        res.status(500).end();
    });
});

router.put("/l/:id", (req, res, next) => {
    const postId = req.params.id;
    const userId = req.session.userId;
    logger.info("userId is" + userId);
    return PostController.likePost(userId, postId).then((numLikes) => {
        res.status(200).send(numLikes.toString());
    }).catch((err) => {
        logger.error(err);
        res.status(500).end();
    });
});

router.put("/c/:id", (req, res, next) => {
    const postId = req.params.id;
    const userId = req.session.userId;
    const { content, date } = req.body;
    return PostController.addComment(content, new Date(date), userId, postId).then((comment) => {
        res.status(200).json(comment);
    }).catch((err) => {
        logger.error(err);
        res.status(500).end();
    })
})

// delete remains to be changed
router.delete("/:postId", (req, res, next) => {
    const postId = req.params.postId;
    const userId = req.session.userId;
    return PostController.deletePost(userId, postId).then(() => {
        res.status(200).end();
    }).catch((err) => {
        logger.error(err);
        res.status(500).end();
    });
});

module.exports = router;