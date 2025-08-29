import Resource from "../models/resource.model.js";
import User from "../models/user.model.js";
import Admin from "../models/admin.model.js";

// Controller for creating a new resource
const createResource = async (req, res) => {
  try {
    const { title, description, link, category, tags, thumbnail } = req.body;
    const authorId = req.user._id;

    if (!title || !description || !link || !category) {
      return res.status(400).json({ message: "Title, description, link, and category are required." });
    }

    const user = await User.findById(authorId);
    if (!user) {
      return res.status(404).json({ message: "Author not found." });
    }

    // CORRECTION: Check if the user is an admin directly in the controller
    const adminUser = await Admin.findOne({ admin: authorId });
    const createdByAdmin = !!adminUser;

    const newResource = new Resource({
      title,
      description,
      link,
      category,
      tags: typeof tags === 'string'
          ? tags.split(',').map(tag => tag.trim()).filter(t => t !== '')
          : tags || [],
      thumbnail,
      author: authorId,
      createdByAdmin,
      // If created by an admin, automatically approve it.
      // Otherwise, status is pending by default.
      status: createdByAdmin ? "approved" : "pending",
      approvedBy: createdByAdmin ? authorId : null,
    });

    await newResource.save();

    // Notify the users about the resources
    const users = await User.find({});

      for(let user of users){
        const notification = new Notification({
          user: user._id,
          message: `New resource created by ${req.user.username}: ${title}`
        });
        await notification.save();
        const io = req.app.get('io');
        io.to(user._id).emit('notification', notification);
      }

    res.status(201).json({ message: "Resource created successfully.", resource: newResource });
  } catch (error) {
    console.error("Error creating resource:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Controller to get all resources with pagination and filters
const getAllResources = async (req, res) => {
  try {
    // Default values
    const page = Math.max(1, parseInt(req.query.page)) || 1;
    const limit = Math.max(1, parseInt(req.query.limit)) || 10;
    const { category, search, adminOnly } = req.query; // Added adminOnly

    const skip = (page - 1) * limit;

    const query = { status: "approved" };

    if (category && category !== 'All') {
      query.category = category;
    }
    if (search) {
      query.$text = { $search: search };
    }
    // New: Filter for only admin-created resources
    if (adminOnly === 'true') {
        query.createdByAdmin = true;
    }

    // Count total resources
    const totalResources = await Resource.countDocuments(query);
    const totalPages = Math.ceil(totalResources / limit);

    // Fetch paginated resources
    const resources = await Resource.find(query)
      .populate('author', 'fullName username profilePicture')
      .populate('approvedBy', 'fullName username')
      .sort({ upvotes: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      message: "Resources fetched successfully.",
      resources,
      pagination: {
        totalResources,
        currentPage: page,
        totalPages,
        hasMore: page < totalPages,
      },
    });
  } catch (error) {
    console.error("Error fetching resources:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Controller to update a resource (admin or author)
const updateResource = async (req, res) => {
  try {
    const { resourceId } = req.params;
    const userId = req.user._id;
    const { title, description, link, category, tags, thumbnail } = req.body;

    const resource = await Resource.findById(resourceId);
    if (!resource) {
      return res.status(404).json({ message: "Resource not found." });
    }

    const isAuthor = resource.author.equals(userId);
    
    // Correctly check if the user is an admin
    const adminRecord = await Admin.findOne({ admin: userId });
    const isAdmin = !!adminRecord;

    if (!isAuthor && !isAdmin) {
      return res.status(403).json({ message: "Unauthorized. You can only edit your own resources." });
    }

    // Update fields
    resource.title = title || resource.title;
    resource.description = description || resource.description;
    resource.link = link || resource.link;
    resource.category = category || resource.category;
    resource.tags = typeof tags === 'string'
          ? tags.split(',').map(tag => tag.trim()).filter(t => t !== '')
          : tags || [],
    resource.thumbnail = thumbnail || resource.thumbnail;

    await resource.save();

    res.status(200).json({ message: "Resource updated successfully.", resource });
  } catch (error) {
    console.error("Error updating resource:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Controller to delete a resource (admin or author)
const deleteResource = async (req, res) => {
  try {
    const { resourceId } = req.params;
    const userId = req.user._id;

    const resource = await Resource.findById(resourceId);
    if (!resource) {
      return res.status(404).json({ message: "Resource not found." });
    }

    const isAuthor = resource.author.equals(userId);
    const isAdmin = req.isAdmin;

    if (!isAuthor && !isAdmin) {
      return res.status(403).json({ message: "Unauthorized. You can only delete your own resources or as an admin." });
    }

    await Resource.deleteOne({ _id: resourceId });

    res.status(200).json({ message: "Resource deleted successfully." });
  } catch (error) {
    console.error("Error deleting resource:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Controller to upvote a resource
const upvoteResource = async (req, res) => {
  try {
    const { resourceId } = req.params;
    const userId = req.user._id;

    const resource = await Resource.findById(resourceId);
    if (!resource) {
      return res.status(404).json({ message: "Resource not found." });
    }

    const alreadyUpvoted = resource.upvotes.includes(userId);

    if (alreadyUpvoted) {
      resource.upvotes.pull(userId);
    } else {
      resource.upvotes.push(userId);
    }

    await resource.save();

    res.status(200).json({
      message: "Resource upvote status updated successfully.",
      upvotes: resource.upvotes.length,
      upvoters: resource.upvotes, // Send the full array to the frontend
    });
  } catch (error) {
    console.error("Error upvoting resource:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Admin-only functions
const getPendingResources = async (req, res) => {
  try {
    const pendingResources = await Resource.find({ status: "pending" })
      .populate('author', 'fullName username')
      .sort({ createdAt: -1 });

    res.status(200).json({ message: "Pending resources fetched successfully.", resources: pendingResources });
  } catch (error) {
    console.error("Error fetching pending resources:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
// This will approve the resources
const approveResource = async (req, res) => {
  try {
    const { resourceId } = req.params;
    const adminId = req.user._id;

    const resource = await Resource.findById(resourceId);
    if (!resource) {
      return res.status(404).json({ message: "Resource not found." });
    }

    if (resource.status !== "pending") {
      return res.status(400).json({ message: "Resource is not pending approval." });
    }

    resource.status = "approved";
    resource.approvedBy = adminId;
    await resource.save();

    res.status(200).json({ message: "Resource approved successfully.", resource });
  } catch (error) {
    console.error("Error approving resource:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// this will reject the resources
const rejectResource = async (req, res) => {
  try {
    const { resourceId } = req.params;

    const resource = await Resource.findByIdAndUpdate(
      resourceId,
      { status: "rejected", approvedBy: null },
      { new: true }
    );

    if (!resource) {
      return res.status(404).json({ message: "Resource not found." });
    }

    res.status(200).json({ message: "Resource rejected successfully.", resource });
  } catch (error) {
    console.error("Error rejecting resource:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
// this will get the resources by user id
const getResourcesByUserId = async (req, res) => {
    try {
        const { userId } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const { search } = req.query; // New: Get search query from URL

        const skip = (page - 1) * limit;

        // Only fetch approved resources for a public profile view
        const query = { author: userId, status: "approved" };

        // Add search filtering if a search query is present
        if (search) {
            query.$text = { $search: search };
        }

        const resources = await Resource.find(query)
            .populate('author', 'fullName username profilePicture')
            .populate('approvedBy', 'fullName username')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const totalResources = await Resource.countDocuments(query);
        const totalPages = Math.ceil(totalResources / limit);

        res.status(200).json({
            message: "User resources fetched successfully.",
            resources,
            pagination: {
                totalResources,
                currentPage: page,
                totalPages,
                hasMore: page < totalPages,
            },
        });
    } catch (error) {
        console.error("Error fetching user resources:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export {
  createResource,
  getAllResources,
  updateResource,
  deleteResource,
  upvoteResource,
  getPendingResources,
  approveResource,
  rejectResource,
  getResourcesByUserId,
};