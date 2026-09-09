import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

function Comments({ postId }) {
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState("");
  const [replyTo, setReplyTo] = useState(null);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem(
    "storySphereToken"
  );

  const currentUser = JSON.parse(
    localStorage.getItem(
      "storySphereUser"
    ) || "null"
  );

  // ==========================================
  // FETCH COMMENTS
  // ==========================================

  const fetchComments = async () => {
    if (!postId || !token) {
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/comments/${postId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            "Unable to fetch comments."
        );
      }

      setComments(
        result.data?.comments || []
      );
    } catch (err) {
      console.error(
        "Fetch comments error:",
        err
      );

      setError(
        err.message ||
          "Unable to load comments."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // INITIAL FETCH
  // ==========================================

  useEffect(() => {
    fetchComments();
  }, [postId]);

  // ==========================================
  // ADD COMMENT / REPLY
  // ==========================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    const text = content.trim();

    if (!text) {
      return;
    }

    if (!token) {
      setError(
        "Authentication required."
      );
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const response = await fetch(
        `${API_URL}/comments/${postId}`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            content: text,

            parentComment:
              replyTo?.id ||
              replyTo?._id ||
              null,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            "Unable to add comment."
        );
      }

      setContent("");
      setReplyTo(null);

      await fetchComments();

    } catch (err) {
      console.error(
        "Add comment error:",
        err
      );

      setError(
        err.message ||
          "Unable to add comment."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ==========================================
  // DELETE COMMENT
  // ==========================================

  const handleDelete = async (
    commentId
  ) => {
    const confirmed = window.confirm(
      "Delete this comment?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      const response = await fetch(
        `${API_URL}/comments/${commentId}`,
        {
          method: "DELETE",

          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            "Unable to delete comment."
        );
      }

      await fetchComments();

    } catch (err) {
      console.error(
        "Delete comment error:",
        err
      );

      setError(
        err.message ||
          "Unable to delete comment."
      );
    }
  };

  // ==========================================
  // GET USER
  // ==========================================

  const getCommentUser = (comment) => {
    return (
      comment.user ||
      comment.author ||
      comment.createdBy ||
      {}
    );
  };

  // ==========================================
  // GET COMMENT ID
  // ==========================================

  const getCommentId = (comment) => {
    return (
      comment._id ||
      comment.id
    );
  };

  // ==========================================
  // CHECK OWNER
  // ==========================================

  const isCommentOwner = (comment) => {
    const user =
      getCommentUser(comment);

    const commentUserId =
      user._id ||
      user.id ||
      comment.userId ||
      comment.createdBy;

    return (
      commentUserId?.toString() ===
      currentUser?.id?.toString()
    );
  };

  // ==========================================
  // USER NAME
  // ==========================================

  const getUserName = (comment) => {
    const user =
      getCommentUser(comment);

    return (
      user.name ||
      comment.userName ||
      "User"
    );
  };

  // ==========================================
  // USERNAME
  // ==========================================

  const getUsername = (comment) => {
    const user =
      getCommentUser(comment);

    return (
      user.username ||
      comment.username ||
      ""
    );
  };

  // ==========================================
  // CONTENT
  // ==========================================

  const getContent = (comment) => {
    return (
      comment.content ||
      comment.text ||
      ""
    );
  };

  // ==========================================
  // RENDER COMMENT
  // ==========================================

  const renderComment = (
    comment,
    isReply = false
  ) => {
    const commentId =
      getCommentId(comment);

    const username =
      getUsername(comment);

    return (
      <div
        key={commentId}
        className={
          isReply
            ? "ml-10 mt-3"
            : "mt-4"
        }
      >

        <div className="flex gap-3">

          {/* AVATAR */}

          <div className="w-9 h-9 shrink-0 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">

            {getUserName(comment)
              ?.charAt(0)
              ?.toUpperCase() || "U"}

          </div>


          {/* COMMENT */}

          <div className="flex-1">

            <div className="bg-gray-100 rounded-2xl px-4 py-3">

              <div className="flex items-center gap-2">

                <span className="font-semibold text-gray-900">
                  {getUserName(comment)}
                </span>

                {username && (
                  <span className="text-xs text-gray-500">
                    @{username}
                  </span>
                )}

              </div>

              <p className="mt-1 text-gray-700 whitespace-pre-wrap">
                {getContent(comment)}
              </p>

            </div>


            {/* ACTIONS */}

            <div className="flex items-center gap-4 mt-1 ml-3">

              {!isReply && (
                <button
                  type="button"
                  onClick={() =>
                    setReplyTo({
                      id: commentId,
                      name: getUserName(
                        comment
                      ),
                    })
                  }
                  className="text-xs font-medium text-gray-500 hover:text-blue-600"
                >
                  Reply
                </button>
              )}

              {isCommentOwner(comment) && (
                <button
                  type="button"
                  onClick={() =>
                    handleDelete(
                      commentId
                    )
                  }
                  className="text-xs font-medium text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              )}

            </div>

          </div>

        </div>

      </div>
    );
  };

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="border-t border-gray-200 px-5 py-5">

      {/* TITLE */}

      <h3 className="font-semibold text-gray-900">
        Comments
      </h3>


      {/* ERROR */}

      {error && (
        <div className="mt-3 rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-600">
          {error}
        </div>
      )}


      {/* REPLY INDICATOR */}

      {replyTo && (
        <div className="mt-4 flex items-center justify-between rounded-lg bg-blue-50 px-4 py-2 text-sm">

          <span className="text-blue-700">
            Replying to{" "}
            <strong>
              {replyTo.name}
            </strong>
          </span>

          <button
            type="button"
            onClick={() =>
              setReplyTo(null)
            }
            className="text-blue-600 font-semibold"
          >
            Cancel
          </button>

        </div>
      )}


      {/* FORM */}

      <form
        onSubmit={handleSubmit}
        className="mt-4"
      >

        <div className="flex gap-2">

          <input
            type="text"
            value={content}
            onChange={(event) =>
              setContent(
                event.target.value
              )
            }
            placeholder={
              replyTo
                ? "Write a reply..."
                : "Write a comment..."
            }
            maxLength={1000}
            className="flex-1 rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />

          <button
            type="submit"
            disabled={
              submitting ||
              !content.trim()
            }
            className="px-5 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting
              ? "..."
              : replyTo
              ? "Reply"
              : "Comment"}
          </button>

        </div>

      </form>


      {/* COMMENTS */}

      {loading ? (

        <div className="py-6 text-center text-gray-500">
          Loading comments...
        </div>

      ) : comments.length === 0 ? (

        <div className="py-6 text-center text-gray-500">
          No comments yet.
          <br />
          <span className="text-sm">
            Be the first to comment.
          </span>
        </div>

      ) : (

        <div className="mt-4">

          {comments.map((comment) =>
            renderComment(comment)
          )}

        </div>

      )}

    </div>
  );
}

export default Comments;