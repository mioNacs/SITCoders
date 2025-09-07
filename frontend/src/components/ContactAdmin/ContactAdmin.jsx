import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FiArrowRight,
  FiSend,
  FiUser,
  FiMail,
  FiMessageSquare,
  FiChevronDown,
  FiChevronUp,
} from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { getAllAdmins, sendEmailToAdmin } from "../../services/contactApi";
import Loading from "../UI/Loading";
import FAQ from "../ContactAdmin/FAQ";

function ContactAdmin() {
  const { user, isAuthenticated } = useAuth();
  const [admins, setAdmins] = useState([]);
  const [selectedAdmin, setSelectedAdmin] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [adminsLoading, setAdminsLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [isAdminSelectionOpen, setIsAdminSelectionOpen] = useState(false);

  useEffect(() => {
    fetchAdmins();
  }, []);

  useEffect(() => {
    if (admins.length > 0 && !selectedAdmin) {
      setSelectedAdmin(admins[0]._id);
    }
  }, [admins, selectedAdmin]);

  const fetchAdmins = async () => {
    try {
      setAdminsLoading(true);
      const response = await getAllAdmins();
      setAdmins(response.admins || []);
    } catch (error) {
      console.error("Error fetching admins:", error);
      setError("Failed to load admins. Please try again.");
    } finally {
      setAdminsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedAdmin || !message.trim()) {
      setError("Please select an admin and enter a message.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await sendEmailToAdmin(selectedAdmin, message.trim());

      setSuccess(true);
      setMessage("");
      setSelectedAdmin(admins[0]?._id || "");

      setTimeout(() => setSuccess(false), 5000);
    } catch (error) {
      console.error("Error sending message:", error);
      setError(
        error.response?.data?.message ||
          "Failed to send message. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="pt-20 h-screen bg-orange-50">
        <div className="md:max-w-[90%] h-full lg:max-w-[80%] mx-auto">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mt-4 text-4xl font-bold text-gray-900 sm:text-5xl">
              Please Login First
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              You need to be logged in to contact our administrators.
            </p>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 rounded-lg bg-orange-600 px-4 py-2.5 text-white shadow hover:bg-orange-700 active:scale-[0.99]"
              >
                Login <FiArrowRight />
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 min-h-screen bg-orange-50 pb-4 md:pb-8">
      <div className="md:max-w-[90%] xl:max-w-[80%] mx-auto px-2 md:px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 mx-auto gap-2">
          <div className="w-full md:pr-6">
            <div className="text-center my-2 md:my-8 border-gray-200">
              <h2 className="text-lg text-gray-800 md:hidden">
                Have a question? or a suggestion. <br /> Send us a message !! or{" "}
                <button
                  type="button"
                  onClick={() => {
                    const faqSection = document.getElementById("faq-section");
                    if (faqSection) {
                      faqSection.scrollIntoView({ behavior: "smooth" });
                    }
                  }}
                  className="font-medium text-orange-400 hover:text-orange-500 hover:underline transition-colors"
                >
                  View FAQ
                </button>
              </h2>
            </div>

            {success && (
              <div className="mb-6 px-2 py-4 md:px-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                <p className="font-medium">
                  Message sent successfully! We'll get back to you soon.
                </p>
              </div>
            )}

            {error && (
              <div className="mb-6 px-2 py-4 md:px-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                <p className="font-medium">{error}</p>
              </div>
            )}

            <div className="bg-white rounded-lg shadow-lg p-4 md:p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* User Info Display */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <FiUser className="text-orange-600 text-xl" />
                    <span className="font-medium text-gray-700">From:</span>
                  </div>
                  <div className="ml-8">
                    <p className="text-gray-900 font-medium">
                      {user?.fullName}
                    </p>
                    <p className="text-gray-600 text-sm">{user?.email}</p>
                  </div>
                </div>

                {/* Admin Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FiMail className="inline mr-2 text-orange-600" />
                    Select Administrator
                  </label>

                  {adminsLoading ? (
                    <div className="flex items-center justify-center p-4">
                      <Loading size="sm" />
                    </div>
                  ) : admins.length === 0 ? (
                    <div className="text-center p-6 bg-gray-50 rounded-lg border border-gray-200">
                      <p className="text-gray-500 mb-2">
                        No administrators available at the moment.
                      </p>
                      <p className="text-sm text-gray-400">
                        Please try again later or contact support directly.
                      </p>
                    </div>
                  ) : (
                    <div>
                      {selectedAdmin && (
                        <div className="mb-3">
                          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 mr-3">
                                  {(() => {
                                    const admin = admins.find(
                                      (a) => a._id === selectedAdmin
                                    );
                                    if (admin?.user.profilePicture?.url) {
                                      return (
                                        <img
                                          src={admin.user.profilePicture.url}
                                          alt={admin.user.fullName}
                                          className="w-10 h-10 rounded-full object-cover border-2 border-orange-200"
                                        />
                                      );
                                    } else {
                                      return (
                                        <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center border-2 border-orange-200">
                                          <span className="text-orange-600 font-semibold text-base">
                                            {admin?.user.fullName
                                              ?.charAt(0)
                                              ?.toUpperCase() || "A"}
                                          </span>
                                        </div>
                                      );
                                    }
                                  })()}
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-900">
                                    <span className="text-orange-700">
                                      ✓ Selected:
                                    </span>{" "}
                                    {
                                      admins.find(
                                        (a) => a._id === selectedAdmin
                                      )?.user.fullName
                                    }
                                  </p>
                                  <p className="text-xs text-gray-600">
                                    @
                                    {
                                      admins.find(
                                        (a) => a._id === selectedAdmin
                                      )?.user.username
                                    }{" "}
                                    •{" "}
                                    {
                                      admins.find(
                                        (a) => a._id === selectedAdmin
                                      )?.role
                                    }
                                  </p>
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() =>
                                  setIsAdminSelectionOpen(!isAdminSelectionOpen)
                                }
                                className="text-orange-600 hover:text-orange-700 text-sm font-medium hover:bg-orange-100 px-2 py-1 rounded transition-colors"
                              >
                                Change
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                      <div
                        className={`transition-all duration-200 ease-in-out ${
                          isAdminSelectionOpen
                            ? "max-h-96 opacity-100"
                            : "max-h-0 opacity-0 overflow-hidden"
                        }`}
                      >
                        <div className="space-y-3 border border-gray-200 rounded-lg p-3 sm:p-4 bg-gray-50">
                          <div className="flex items-center justify-between mb-3">
                            <p className="text-sm text-gray-600">
                              Choose an administrator to contact:
                            </p>
                            <button
                              type="button"
                              onClick={() => setIsAdminSelectionOpen(false)}
                              className="text-gray-400 hover:text-gray-600 text-sm"
                            >
                              ✕
                            </button>
                          </div>
                          {admins.map((admin) => (
                            <div
                              key={admin._id}
                              className={`relative flex items-center p-3 border rounded-lg cursor-pointer transition-all ${
                                selectedAdmin === admin._id
                                  ? "border-orange-500 bg-white shadow-sm"
                                  : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
                              }`}
                              onClick={() => {
                                setSelectedAdmin(admin._id);
                                setIsAdminSelectionOpen(false);
                              }}
                            >
                              <input
                                type="radio"
                                id={`admin-${admin._id}`}
                                name="admin"
                                value={admin._id}
                                checked={selectedAdmin === admin._id}
                                onChange={() => {
                                  setSelectedAdmin(admin._id);
                                  setIsAdminSelectionOpen(false);
                                }}
                                className="sr-only"
                              />
                              <div className="flex-shrink-0 mr-3">
                                {admin.user.profilePicture?.url ? (
                                  <img
                                    src={admin.user.profilePicture.url}
                                    alt={admin.user.fullName}
                                    className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                                  />
                                ) : (
                                  <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center border-2 border-gray-200">
                                    <span className="text-orange-600 font-semibold text-lg">
                                      {admin.user.fullName
                                        ?.charAt(0)
                                        ?.toUpperCase() || "A"}
                                    </span>
                                  </div>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="text-sm font-medium text-gray-900 truncate">
                                      {admin.user.fullName}
                                    </p>
                                    <p className="text-xs text-gray-500 truncate">
                                      @{admin.user.username}
                                    </p>
                                  </div>
                                  <span
                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                      admin.role === "superadmin"
                                        ? "bg-purple-100 text-purple-800"
                                        : "bg-blue-100 text-blue-800"
                                    }`}
                                  >
                                    {admin.role}
                                  </span>
                                </div>
                              </div>
                              <div
                                className={`flex-shrink-0 ml-3 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                  selectedAdmin === admin._id
                                    ? "border-orange-500 bg-orange-500"
                                    : "border-gray-300"
                                }`}
                              >
                                {selectedAdmin === admin._id && (
                                  <div className="w-2 h-2 rounded-full bg-white"></div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Message Input */}
                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    <FiMessageSquare className="inline mr-2 text-orange-600" />
                    Your Message
                  </label>
                  <textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 resize-none"
                    placeholder="Type your message here..."
                    required
                  />
                </div>

                {/* Submit Button */}
                <div className="flex items-center justify-between">
                  <button
                    type="submit"
                    disabled={loading || adminsLoading || admins.length === 0}
                    className="inline-flex items-center gap-2 rounded-lg bg-orange-600 px-6 py-3 text-white font-medium shadow hover:bg-orange-700 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <Loading size="sm" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <FiSend />
                        Send Message
                      </>
                    )}
                  </button>

                  <Link
                    to="/home"
                    className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50 active:scale-[0.99]"
                  >
                    Cancel
                  </Link>
                </div>
              </form>
            </div>
          </div>

          <div className="my-8" id="faq-section">
            <FAQ />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactAdmin;
