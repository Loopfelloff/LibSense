import { useContext, useEffect, useState } from "react";
import { X, Upload } from "lucide-react";
import { changeProfilePic } from "../apis/profile";
import { toast } from "react-toastify";
import { UserContext } from "../context/UserContext";

interface ModelValue {
  isOpen: boolean;
  onClose: () => void;
  currentPic: string | undefined;
}

function ChangeProfilePicModal({ isOpen, onClose, currentPic }: ModelValue) {
  const [preview, setPreview] = useState<string | null>(currentPic || null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState("");
  const authContext = useContext(UserContext)?.setContextState;

  useEffect(() => {
    return () => {
      if (preview && preview !== currentPic) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview, currentPic]);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB");
      return;
    }

    setError("");
    setSelectedFile(file);

    if (preview && preview !== currentPic) {
      URL.revokeObjectURL(preview);
    }
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      setError("Please select an image");
      return;
    }
    const formData = new FormData();
    formData.append("profilePic", selectedFile);

    setSubmitting(true);

    const uploadResult = await changeProfilePic(formData);
    if (uploadResult) {
      toast.success("Profile Picture changed successfully!");
      onClose();
    }

    setPreview(null);
    setSelectedFile(null);
  };

  const handleClose = () => {
    setPreview(currentPic || null);
    setSelectedFile(null);
    setError("");
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 backdrop-blur-sm z-60" onClick={onClose} />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white border border-gray-300 z-70">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-300">
          <h2 className="text-gray-900 font-semibold">
            Change Profile Picture
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-700 hover:text-gray-900"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-4">
          {error && (
            <div className="mb-4 px-3 py-2 bg-red-50 border border-red-300 text-red-700 text-sm">
              {error}
            </div>
          )}
          <div className="flex flex-col items-center">
            <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-gray-300 mb-4">
              {preview ? (
                <img
                  src={preview}
                  alt="Profile preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500 text-3xl">
                  ?
                </div>
              )}
            </div>
            <label className="cursor-pointer px-4 py-2 border border-gray-300 text-gray-900 hover:bg-gray-100 flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Choose Image
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
            <p className="text-gray-600 text-xs mt-2">Max size: 5MB</p>
          </div>
          <div className="flex gap-2 mt-6">
            <button
              onClick={handleClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-900 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="flex-1 px-4 py-2 bg-gray-900 text-white hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-gray-900"
            >
              {submitting ? "Uploading..." : "Upload"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
export default ChangeProfilePicModal;
