import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import Comment from "../models/comment.model.js";

const addPopularityOnPost = async (req, res) => {
    try {
        const postId = req.params.postId;
        const userId = req.user._id;

        if (!postId || !userId) {
            return res.status(400).json({ message: "Post ID and User ID are required." });
        }

        // Find the post and increment its popularity
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found." });
        }
        const alreadyLiked = post.popularity.includes(userId);
        
        if (alreadyLiked) {
            // User has already liked the post, remove their like
            post.popularity.pull(userId);
        } else {
            // User has not liked the post, add their like
            post.popularity.push(userId);
        }

        await post.save();

        res.status(200).json({ message: "Post popularity updated successfully.", popularity: post.popularity.length });
    } catch (error) {
        console.error("Error adding popularity to post:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const addPopularityOnProfile = async (req,res) => {
    try {
        const profileId = req.params.profileId;
        const userId = req.user._id;
        
        if(!profileId || !userId){
            return res.status(400).json({ message: "Profile ID and User ID are required." });
        }
        
        // Find the profile 
        const profile = await User.findById(profileId);

        if(!profile){
            return res.status(404).json({ message: "Profile not found." });
        }
         const alreadyLiked = profile.popularity.includes(userId);

        if (alreadyLiked) {
            // User has already liked the profile, remove their like
            profile.popularity.pull(userId);
        } else {
            // User has not liked the profile, add their like
            profile.popularity.push(userId);
        }

        await profile.save();

        res.status(200).json({ message: "Profile popularity updated successfully.", popularity: profile.popularity.length });
    } catch (error) {
        console.error("Error in addPopularityOnProfile:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}

const addPopularityOnComment = async (req, res) => {
    try {
        const commentId = req.params.commentId;
        const userId = req.user._id;
        
        if(!commentId || !userId){
            return res.status(400).json({ message: "Comment ID and User ID are required." });
        }
        
        // Find the comment 
        const comment = await Comment.findById(commentId);

        if(!comment){
            return res.status(404).json({ message: "Comment not found." });
        }
        
        const alreadyLiked = comment.popularity.includes(userId);

        if (alreadyLiked) {
            // User has already liked the comment, remove their like
            comment.popularity.pull(userId);
        } else {
            // User has not liked the comment, add their like
            comment.popularity.push(userId);
        }

        await comment.save();

        res.status(200).json({ message: "Comment popularity updated successfully.", popularity: comment.popularity.length });
    } catch (error) {
        console.error("Error in addPopularityOnComment:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}

const leaderBoard = async (req, res) => {
    try {
        // Aggregation pipeline to calculate reputation for all users
        const leaderboardData = await User.aggregate([
            {
                $lookup: {
                    from: "posts",
                    localField: "_id",
                    foreignField: "author",
                    as: "userPosts"
                }
            },
            {
                $lookup: {
                    from: "comments",
                    localField: "_id",
                    foreignField: "user",
                    as: "userComments"
                }
            },
            {
                $project: {
                    fullName: 1,
                    username: 1,
                    email: 1,
                    profilePicture: 1,
                    profilePopularity: { $size: { $ifNull: ["$popularity", []] } },
                    totalPostsPopularity: {
                        $sum: {
                            $map: {
                                input: "$userPosts",
                                as: "post",
                                in: { $size: { $ifNull: ["$$post.popularity", []] } }
                            }
                        }
                    },
                    totalCommentsPopularity: {
                        $sum: {
                            $map: {
                                input: "$userComments",
                                as: "comment",
                                in: { $size: { $ifNull: ["$$comment.popularity", []] } }
                            }
                        }
                    },
                }
            },
            {
                $addFields: {
                    totalReputation: {
                        $add: [
                            "$profilePopularity",
                            "$totalPostsPopularity",
                            "$totalCommentsPopularity"
                        ]
                    }
                }
            },
            { $sort: { totalReputation: -1 } },
            { $limit: 20 }
        ]);

        res.status(200).json({
            message: "Leaderboard fetched successfully.",
            leaderboard: leaderboardData
        });
    } catch (error) {
        console.error("Error fetching leaderboard:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}

const getReputation = async (req, res) => {
    try {
        const userId = req.params.userId;
        
        if (!userId) {
            return res.status(400).json({ message: "User ID is required." });
        }

        // Verify user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        // Use MongoDB aggregation pipeline for optimal performance
        // This runs entirely in the database, minimizing data transfer
        const reputationData = await User.aggregate([
            { 
                $match: { _id: user._id } 
            },
            {
                // Join with posts collection
                $lookup: {
                    from: "posts", 
                    localField: "_id",
                    foreignField: "author",
                    as: "userPosts"
                }
            },
            {
                // Join with comments collection  
                $lookup: {
                    from: "comments",
                    localField: "_id", 
                    foreignField: "user",
                    as: "userComments"
                }
            },
            {
                // Calculate all reputation metrics in one go
                $project: {
                    fullName: 1,
                    username: 1,
                    email: 1,
                    profilePicture: 1,
                    // Profile popularity (direct user likes)
                    profilePopularity: { 
                        $size: { $ifNull: ["$popularity", []] }
                    },
                    // Sum of all post popularities
                    totalPostsPopularity: {
                        $sum: {
                            $map: {
                                input: "$userPosts",
                                as: "post", 
                                in: { 
                                    $size: { $ifNull: ["$$post.popularity", []] }
                                }
                            }
                        }
                    },
                    // Sum of all comment popularities
                    totalCommentsPopularity: {
                        $sum: {
                            $map: {
                                input: "$userComments",
                                as: "comment",
                                in: { 
                                    $size: { $ifNull: ["$$comment.popularity", []] }
                                }
                            }
                        }
                    },
                    // Additional stats for context
                    totalPosts: { $size: "$userPosts" },
                    totalComments: { $size: "$userComments" }
                }
            },
            {
                // Calculate final reputation score
                $addFields: {
                    totalReputation: {
                        $add: [
                            "$profilePopularity",
                            "$totalPostsPopularity", 
                            "$totalCommentsPopularity"
                        ]
                    },
                    // Calculate average popularity per post/comment for insights
                    avgPostPopularity: {
                        $cond: {
                            if: { $gt: ["$totalPosts", 0] },
                            then: { $divide: ["$totalPostsPopularity", "$totalPosts"] },
                            else: 0
                        }
                    },
                    avgCommentPopularity: {
                        $cond: {
                            if: { $gt: ["$totalComments", 0] },
                            then: { $divide: ["$totalCommentsPopularity", "$totalComments"] },
                            else: 0
                        }
                    }
                }
            }
        ]);

        if (!reputationData.length) {
            return res.status(404).json({ message: "Unable to calculate reputation." });
        }

        const reputation = reputationData[0];

        res.status(200).json({ 
            message: "Reputation calculated successfully.",
            reputation: {
                userId: reputation._id,
                fullName: reputation.fullName,
                username: reputation.username,
                profilePicture: reputation.profilePicture,
                // Core reputation metrics
                profilePopularity: reputation.profilePopularity || 0,
                totalPostsPopularity: reputation.totalPostsPopularity || 0,
                totalCommentsPopularity: reputation.totalCommentsPopularity || 0,
                totalReputation: reputation.totalReputation || 0,
                // Additional stats
                totalPosts: reputation.totalPosts || 0,
                totalComments: reputation.totalComments || 0,
                avgPostPopularity: Math.round((reputation.avgPostPopularity || 0) * 100) / 100,
                avgCommentPopularity: Math.round((reputation.avgCommentPopularity || 0) * 100) / 100,
                // Calculated timestamp
                calculatedAt: new Date().toISOString()
            }
        });

    } catch (error) {
        console.error("Error calculating reputation:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}

export { addPopularityOnPost, addPopularityOnProfile, addPopularityOnComment, getReputation, leaderBoard };