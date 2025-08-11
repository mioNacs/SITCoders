import React, { useRef, useState, useCallback } from "react";
import {
  FaUser,
  FaCamera,
  FaSpinner,
  FaTimes,
  FaCheck,
  FaCrop,
} from "react-icons/fa";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { useAuth } from "../../context/AuthContext";

const ProfilePicture = ({ user: profileUser, updateUser, showDialog, isOwnProfile = true }) => {
  const { user: currentUser } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [openPicture, setOpenPicture] = useState(false);
  const [showCropModal, setShowCropModal] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({
    unit: "px",
    width: 200,
    height: 200,
    x: 5,
    y: 5,
    aspect: 1, // Square aspect ratio
  });
  const [completedCrop, setCompletedCrop] = useState(null);
  const imgRef = useRef(null);
  const previewCanvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);

  // Use profileUser (passed as prop) instead of currentUser from auth
  const displayUser = profileUser || currentUser;

  const viewProfilePicture = () => {
    if (displayUser?.profilePicture?.url) {
      setOpenPicture(true);
    }
  };

  const closePictureModal = () => {
    setOpenPicture(false);
  };

  const closeCropModal = () => {
    setShowCropModal(false);
    resetCrop();
    setImageSrc(null);
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleFileSelect = (event) => {
    // Only allow file selection for own profile
    if (!isOwnProfile) return;

    const file = event.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
      ];
      if (!allowedTypes.includes(file.type)) {
        showDialog(
          "Invalid File Type",
          "Please select a valid image file (JPEG, JPG, PNG, or WebP).",
          "error"
        );
        return;
      }

      // Validate file size (10MB for cropping)
      const maxSize = 10 * 1024 * 1024;
      if (file.size > maxSize) {
        showDialog(
          "File Too Large",
          "Please select an image smaller than 10MB.",
          "error"
        );
        return;
      }

      setSelectedFile(file);

      // Read file as data URL for cropping
      const reader = new FileReader();
      reader.onload = () => {
        setImageSrc(reader.result);
        setShowCropModal(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const onImageLoad = useCallback((img) => {
    imgRef.current = img;
  }, []);

  const generateCroppedImage = useCallback(async () => {
    if (!completedCrop || !imgRef.current || !previewCanvasRef.current) {
      return;
    }

    const image = imgRef.current;
    const canvas = previewCanvasRef.current;
    const crop = completedCrop;

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const ctx = canvas.getContext("2d");

    // Set canvas size to crop size
    canvas.width = crop.width;
    canvas.height = crop.height;

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    return new Promise((resolve) => {
      canvas.toBlob(
        (blob) => {
          resolve(blob);
        },
        "image/jpeg",
        0.9
      );
    });
  }, [completedCrop]);

  const resetCrop = () => {
    setCrop({
      unit: "px",
      width: 200,
      height: 200,
      x: 5,
      y: 5,
      aspect: 1, // Square aspect ratio
    });
  };

  const handleCropConfirm = async () => {
    try {
      const croppedBlob = await generateCroppedImage();
      if (croppedBlob) {
        // Create File object from blob
        const croppedFile = new File([croppedBlob], selectedFile.name, {
          type: "image/jpeg",
          lastModified: Date.now(),
        });

        closeCropModal();
        resetCrop();
        uploadProfilePicture(croppedFile);
      }
    } catch (error) {
      console.error("Error cropping image:", error);
      showDialog(
        "Crop Failed",
        "Failed to crop image. Please try again.",
        "error"
      );
    }
  };

  const uploadProfilePicture = async (file) => {
    // Only allow upload for own profile
    if (!isOwnProfile) return;

    setUploading(true);
    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('profilePicture', file);

      // Pass FormData directly to updateUser
      const result = await updateUser(formData);

      if (result.success) {
        showDialog("Success", "Profile picture updated successfully!", "success");
      } else {
        showDialog(
          "Upload Failed",
          result.message || "Failed to update profile picture. Please try again.",
          "error"
        );
      }
    } catch (error) {
      console.error("Error updating profile picture:", error);
      showDialog(
        "Upload Failed",
        error.message || "Failed to update profile picture. Please try again.",
        "error"
      );
    } finally {
      setUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const triggerFileInput = () => {
    // Only allow triggering file input for own profile
    if (!isOwnProfile) return;
    
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <>
      <div className="absolute -top-16 left-4 w-32 h-32 rounded-full bg-white p-1 shadow-md">
        <div className="relative w-full h-full">
          {displayUser?.profilePicture?.url ? (
            <img
              key={displayUser.profilePicture.url} // Add key to force re-render when URL changes
              src={displayUser.profilePicture.url}
              alt="profile"
              className="w-full h-full rounded-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
              onClick={viewProfilePicture}
              title="Click to view full size"
              onError={(e) => {
                // If image fails to load, you can add a fallback here
                console.log("Image failed to load:", e.target.src);
              }}
            />
          ) : (
            <div 
              className="w-full h-full rounded-full bg-orange-100 flex items-center justify-center cursor-pointer"
              onClick={viewProfilePicture}
            >
              {displayUser?.fullName ? (
                <span className="text-orange-400 text-2xl font-semibold">
                  {displayUser.fullName.charAt(0).toUpperCase()}
                </span>
              ) : (
                <FaUser className="text-orange-400" size={50} />
              )}
            </div>
          )}

          {/* Camera/Upload Button - Only show for own profile */}
          {isOwnProfile && (
            <button
              onClick={triggerFileInput}
              disabled={uploading}
              className="absolute bottom-2 right-2 bg-orange-500 hover:bg-orange-600 text-white p-2 rounded-full shadow-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Update profile picture"
            >
              {uploading ? (
                <FaSpinner className="animate-spin" size={14} />
              ) : (
                <FaCamera size={14} />
              )}
            </button>
          )}

          {/* Hidden file input - Only for own profile */}
          {isOwnProfile && (
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handleFileSelect}
              className="hidden"
            />
          )}
        </div>
      </div>

      {/* Profile Picture View Modal */}
      {openPicture && displayUser?.profilePicture?.url && (
        <div className="fixed inset-0 flex justify-center items-center bg-black/60 z-50">
          <div onClick={closePictureModal} className="fixed inset-0"></div>
          <div className="relative">
            <button
              onClick={closePictureModal}
              className="absolute top-4 right-4 bg-white hover:bg-white/30 text-black p-2 rounded-full transition-colors z-10 cursor-pointer"
              title="Close"
            >
              <FaTimes size={20} />
            </button>
            <img
              key={displayUser.profilePicture.url} // Add key here too
              className="h-fit w-[75vw] sm:w-[60vw] md:w-[50vw] lg:w-[40vw] z-10 rounded-lg shadow-md outline-2 outline-orange-500 outline-offset-2"
              src={displayUser.profilePicture.url}
              alt="profile"
            />
          </div>
        </div>
      )}

      {/* Image Crop Modal - Only show for own profile */}
      {isOwnProfile && showCropModal && imageSrc && (
        <div className="fixed inset-0 flex justify-center items-center bg-black/80 z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center space-x-2">
                <FaCrop className="text-orange-500" size={20} />
                <h2 className="text-lg font-semibold text-gray-800">
                  Crop Profile Picture
                </h2>
              </div>
              <button
                onClick={closeCropModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FaTimes size={20} />
              </button>
            </div>

            {/* Crop Area */}
            <div className="p-4 max-h-[70vh] overflow-auto">
              <div className="flex justify-center">
                <ReactCrop
                  crop={crop}
                  onChange={(c) => setCrop(c)}
                  onComplete={(c) => setCompletedCrop(c)}
                  aspect={1}
                  minWidth={100}
                  minHeight={100}
                  keepSelection
                  ruleOfThirds
                >
                  <img
                    ref={imgRef}
                    alt="Crop me"
                    src={imageSrc}
                    style={{ maxHeight: "60vh", maxWidth: "100%" }}
                    onLoad={(e) => onImageLoad(e.currentTarget)}
                  />
                </ReactCrop>
              </div>

              {/* Instructions */}
              <div className="mt-4 text-center text-sm text-gray-600">
                <p>
                  Drag the corners to adjust the crop area. The image will be
                  cropped to a square.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end space-x-3 p-4 border-t border-gray-200 bg-gray-50">
              <button
                onClick={closeCropModal}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCropConfirm}
                disabled={!completedCrop}
                className="flex items-center space-x-2 px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <FaCheck size={14} />
                <span>Crop & Upload</span>
              </button>
            </div>
          </div>

          {/* Hidden canvas for generating cropped image */}
          <canvas ref={previewCanvasRef} style={{ display: "none" }} />
        </div>
      )}
    </>
  );
};

export default ProfilePicture;
