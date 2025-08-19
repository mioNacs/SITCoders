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

const leaderBoard = async (req, res) =>{}

export { addPopularityOnPost, addPopularityOnProfile, addPopularityOnComment };