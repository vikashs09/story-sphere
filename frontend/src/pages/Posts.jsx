import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import Avatar from "../components/Avatar";
import Icon from "../components/Icons";
import Loader from "../components/Loader";
import PostCard from "../components/PostCard";
import { api, getCurrentUser, getUserId } from "../lib";

export default function Posts() {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const [posts, setPosts] = useState([]); const [loading, setLoading] = useState(true); const [error, setError] = useState("");
  const load = async () => { try { setLoading(true); const r = await api("/posts"); setPosts(r.data?.posts || []); } catch (e) { setError(e.message); } finally { setLoading(false); } };
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { void load(); }, []);
  const like = async (id, liked) => { try { const r = await api(`/posts/${id}/like`, { method: liked ? "DELETE" : "POST" }); setPosts(p => p.map(x => (getUserId(x) === id ? x : x._id === id ? { ...x, ...r.data?.post } : x))); await load(); } catch (e) { setError(e.message); } };
  const remove = async (id) => { await api(`/posts/${id}`, { method: "DELETE" }); setPosts(p => p.filter(x => (x._id || x.id) !== id)); };
  return <Layout title="Stories" subtitle="A separate home for every post">
    <div className="posts-page">
      <section className="posts-head"><div><span className="eyebrow">THE SPHERE</span><h1>Stories worth stopping for.</h1><p>Read, react and join conversations from across your community.</p></div><button className="primary-btn" onClick={() => navigate("/create-post")}><Icon name="plus" /> Share a story</button></section>
      <section className="composer-strip panel"><Avatar user={user} size="md" /><button onClick={() => navigate("/create-post")}><strong>{user?.name || "Vikash"}</strong><span>What would you like to share today?</span></button><button className="composer-icon" onClick={() => navigate("/create-post")}><Icon name="image" /></button></section>
      {error && <div className="error-banner">{error}</div>}
      {loading ? <Loader full /> : posts.length === 0 ? <div className="empty-state panel"><span>✦</span><h2>No stories yet</h2><p>Be the first person to put something into the sphere.</p><button className="primary-btn" onClick={() => navigate("/create-post")}>Create the first story</button></div> : <div className="feed-list">{posts.map(post => <PostCard key={post._id || post.id} post={post} currentUserId={getUserId(user)} onDelete={remove} onLike={like} />)}</div>}
    </div>
  </Layout>;
}
