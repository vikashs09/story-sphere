import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

function CreatePost() {
  const navigate = useNavigate();

  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem(
    "storySphereToken"
  );

  // ==========================================
  // IMAGE SELECT
  // ==========================================

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setImage(file);

    const previewUrl =
      URL.createObjectURL(file);

    setPreview(previewUrl);
  };

  // ==========================================
  // REMOVE IMAGE
  // ==========================================

  const removeImage = () => {
    setImage(null);
    setPreview("");

    const fileInput =
      document.getElementById("post-image");

    if (fileInput) {
      fileInput.value = "";
    }
  };

  // ==========================================
  // CREATE POST
  // ==========================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (!token) {
      navigate("/login");
      return;
    }

    if (!content.trim() && !image) {
      setError(
        "Please write something or select an image."
      );
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append(
        "content",
        content.trim()
      );

      if (image) {
        formData.append("image", image);
      }

      const response = await fetch(
        `${API_URL}/posts`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            "Unable to create post."
        );
      }

      // Go back to home after successful post
      navigate("/home");

    } catch (err) {
      console.error(
        "Create post error:",
        err
      );

      setError(
        err.message ||
          "Unable to create post."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="min-h-screen bg-gray-100">

      {/* ======================================
          NAVBAR
      ====================================== */}

      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">

        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">

          <button
            onClick={() => navigate("/home")}
            className="text-2xl font-bold text-blue-600"
          >
            Story Sphere
          </button>

          <button
            onClick={() => navigate("/home")}
            className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition"
          >
            ← Home
          </button>

        </div>

      </nav>


      {/* ======================================
          MAIN
      ====================================== */}

      <main className="max-w-2xl mx-auto px-4 py-8">

        <div className="mb-6">

          <h1 className="text-3xl font-bold text-gray-900">
            Create Post
          </h1>

          <p className="mt-1 text-gray-500">
            Share something with the Story Sphere
            community.
          </p>

        </div>


        {/* ======================================
            CARD
        ====================================== */}

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">

          <form onSubmit={handleSubmit}>

            {/* CONTENT */}

            <div className="mb-5">

              <label
                htmlFor="post-content"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                What's on your mind?
              </label>

              <textarea
                id="post-content"
                value={content}
                onChange={(event) =>
                  setContent(
                    event.target.value
                  )
                }
                placeholder="Write your story..."
                rows={6}
                maxLength={5000}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 resize-none outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

              <p className="mt-1 text-right text-xs text-gray-400">
                {content.length}/5000
              </p>

            </div>


            {/* IMAGE */}

            <div className="mb-5">

              <label
                htmlFor="post-image"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Add Image
              </label>

              <input
                id="post-image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full text-sm text-gray-600"
              />

            </div>


            {/* PREVIEW */}

            {preview && (

              <div className="mb-5">

                <div className="relative">

                  <img
                    src={preview}
                    alt="Post preview"
                    className="w-full max-h-[500px] object-cover rounded-xl border border-gray-200"
                  />

                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-3 right-3 px-3 py-2 rounded-lg bg-black/70 text-white text-sm hover:bg-black/80"
                  >
                    Remove
                  </button>

                </div>

              </div>

            )}


            {/* ERROR */}

            {error && (

              <div className="mb-5 bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-600">
                {error}
              </div>

            )}


            {/* BUTTONS */}

            <div className="flex gap-3">

              <button
                type="button"
                onClick={() => navigate("/home")}
                className="flex-1 py-3 rounded-xl bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {loading
                  ? "Posting..."
                  : "Create Post"}
              </button>

            </div>

          </form>

        </div>

      </main>

    </div>
  );
}

export default CreatePost;