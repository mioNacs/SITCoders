import React, { useRef, useState, useCallback } from "react";
import { FaUser, FaCamera, FaSpinner, FaTimes, FaCheck } from "react-icons/fa";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { useAuth } from "../../context/AuthContext";

const ProfilePicture = ({ user: profileUser, updateUser, showDialog, isOwnProfile = true }) => {
  const { user: currentUser, isSuspended } = useAuth();
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
    aspect: 1,
  });
  const [completedCrop, setCompletedCrop] = useState(null);
  const imgRef = useRef(null);
  const previewCanvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);

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

  const resetCrop = () => {
    setCrop({
      unit: "px",
      width: 200,
      height: 200,
      x: 5,
      y: 5,
      aspect: 1,
    });
    setCompletedCrop(null);
  };

  const handleFileSelect = (e) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

    if (!validTypes.includes(file.type)) {
      showDialog(
        "Invalid File Type",
        "Please select a valid image file (JPEG, PNG, or WebP).",
        "error"
      );
      return;
    }

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

    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result);
      setShowCropModal(true);
    };
    reader.readAsDataURL(file);
  };

  const getCroppedImg = useCallback((image, crop) => {
    const canvas = previewCanvasRef.current;
    if (!canvas || !crop || !image) {
      console.error("Missing required parameters for cropping");
      return null;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      console.error("Unable to get 2D context from canvas");
      return null;
    }

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const pixelRatio = window.devicePixelRatio || 1;

    canvas.width = crop.width * pixelRatio;
    canvas.height = crop.height * pixelRatio;

    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.imageSmoothingQuality = "high";

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
        0.95
      );
    });
  }, []);

  const handleCropConfirm = async () => {
    if (!completedCrop || !imgRef.current) {
      console.error("No crop area selected or image reference not found");
      return;
    }

    try {
      setUploading(true);
      const croppedImageBlob = await getCroppedImg(imgRef.current, completedCrop);

      if (!croppedImageBlob) {
        throw new Error("Failed to generate cropped image");
      }

      const formData = new FormData();
      formData.append("profilePicture", croppedImageBlob, "profile.jpg");

      const result = await updateUser(formData);

      if (result.success) {
        setShowCropModal(false);
        resetCrop();
        setImageSrc(null);
        setSelectedFile(null);
        showDialog(
          "Profile Picture Updated",
          "Your profile picture has been updated successfully!",
          "success"
        );
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
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
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const triggerFileInput = () => {
    if (!isOwnProfile) return;
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <>
      <div className="relative w-32 h-32 mx-auto">
        <div className="relative w-full h-full">
          {displayUser?.profilePicture?.url ? (
            <img
              key={displayUser.profilePicture.url}
              src={displayUser.profilePicture.url}
              alt="profile"
              className="w-full h-full rounded-full object-cover cursor-pointer hover:scale-105 transition-transform duration-300 shadow-lg ring-4 ring-white"
              onClick={viewProfilePicture}
              title="Click to view full size"
              onError={(e) => {
                console.log("Image failed to load:", e.target.src);
              }}
            />
          ) : (
            <div 
              className="w-full h-full rounded-full bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center cursor-pointer hover:scale-105 transition-transform duration-300 shadow-lg ring-4 ring-white"
              onClick={viewProfilePicture}
            >
              {displayUser?.fullName ? (
                <span className="text-3xl font-bold text-orange-600">
                  {displayUser.fullName.charAt(0).toUpperCase()}
                </span>
              ) : (
                <FaUser size={32} className="text-orange-600" />
              )}
            </div>
          )}

          {isOwnProfile && !isSuspended && (
            <button
              onClick={triggerFileInput}
              disabled={uploading}
              className="absolute bottom-0 right-0 w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-orange-600 transition-colors disabled:opacity-50"
              title="Change profile picture"
            >
              {uploading ? (
                <FaSpinner className="animate-spin" size={16} />
              ) : (
                <FaCamera size={16} />
              )}
            </button>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {/* Full Size Image Modal */}
      {openPicture && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={closePictureModal}
        >
          <div className="relative max-w-2xl max-h-[80vh] bg-white rounded-2xl shadow-2xl overflow-hidden">
            <button
              onClick={closePictureModal}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
            >
              <FaTimes size={16} />
            </button>
            <img
              src={displayUser?.profilePicture?.url}
              alt="Profile"
              className="w-full h-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}

      {/* Crop Modal */}
      {showCropModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[80vh] overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Crop Profile Picture</h3>
                <button
                  onClick={closeCropModal}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <FaTimes size={16} />
                </button>
              </div>
            </div>

            <div className="p-6 max-h-96 overflow-auto">
              <div className="flex justify-center">
                <ReactCrop
                  crop={crop}
                  onChange={(newCrop) => setCrop(newCrop)}
                  onComplete={(newCrop) => setCompletedCrop(newCrop)}
                  aspect={1}
                  className="max-w-full"
                >
                  <img
                    ref={imgRef}
                    src={imageSrc}
                    alt="Crop preview"
                    className="max-w-full h-auto"
                  />
                </ReactCrop>
              </div>

              <div className="mt-4 text-center text-sm text-gray-600">
                <p>Drag the corners to adjust the crop area. The image will be cropped to a square.</p>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 p-4 border-t border-gray-200 bg-gray-50">
              <button
                onClick={closeCropModal}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCropConfirm}
                disabled={!completedCrop || uploading}
                className="flex items-center space-x-2 px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {uploading ? (
                  <>
                    <FaSpinner className="animate-spin" size={14} />
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <FaCheck size={14} />
                    <span>Crop & Upload</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <canvas ref={previewCanvasRef} style={{ display: "none" }} />
        </div>
      )}
    </>
  );
};

export default ProfilePicture;
