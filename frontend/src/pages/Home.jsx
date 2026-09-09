import { useEffect, useState } from "react";
import sphereIcon from "../assets/story-sphere-icon.png";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import Avatar from "../components/Avatar";
import Icon from "../components/Icons";
import Loader from "../components/Loader";
import { api, getCurrentUser, getUserId } from "../lib";

export default function Home() {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const [users, setUsers] = useState([]);
  const [unread, setUnread] = useState(0);
  const [messageUnread, setMessageUnread] = useState(0);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    Promise.allSettled([api("/users"), api("/notifications/unread"), api("/messages/unread")]).then(([u, n, m]) => {
      if (u.status === "fulfilled") setUsers((u.value.data?.users || []).filter(x => getUserId(x) !== getUserId(user)).slice(0, 5));
      if (n.status === "fulfilled") setUnread(Number(n.value.data?.count || 0));
      if (m.status === "fulfilled") setMessageUnread(Number(m.value.data?.count || 0));
      setLoading(false);
    });
  }, []);
  const first = user?.name?.split(" ")[0] || "Vikash";
  return <Layout title="Home" subtitle="Your Story Sphere dashboard">
    {loading ? <Loader full /> : <div className="dashboard">
      <section className="welcome-card">
        <div className="welcome-orb"><img src={sphereIcon} alt="" /></div>
        <div><span className="eyebrow">WELCOME BACK</span><h1>Hey {first}, <em>what's your story?</em></h1><p>Your space is ready. Share something, catch up with people, or jump into a conversation.</p><div className="welcome-actions"><button className="primary-btn" onClick={() => navigate("/create-post")}><Icon name="plus" /> Create a story</button><button className="ghost-btn" onClick={() => navigate("/posts")}><Icon name="grid" /> Explore stories</button></div></div>
      </section>
      <section className="stat-grid">
        <button className="stat-card" onClick={() => navigate("/posts")}><span className="stat-icon blue"><Icon name="grid" /></span><strong>Stories</strong><b>Explore feed</b></button>
        <button className="stat-card" onClick={() => navigate("/messages")}><span className="stat-icon violet"><Icon name="message" /></span><strong>{messageUnread}</strong><b>Unread messages</b></button>
        <button className="stat-card" onClick={() => navigate("/notifications")}><span className="stat-icon pink"><Icon name="bell" /></span><strong>{unread}</strong><b>New alerts</b></button>
        <button className="stat-card" onClick={() => navigate(`/profile/${getUserId(user)}`)}><span className="stat-icon green"><Icon name="user" /></span><strong>Profile</strong><b>Manage your sphere</b></button>
      </section>
      <div className="dashboard-grid">
        <section className="panel quick-panel"><div className="section-heading"><div><h2>Quick actions</h2><p>Everything important, one tap away.</p></div><Icon name="arrow" /></div><div className="quick-grid"><button onClick={() => navigate("/create-post")}><span>✦</span><strong>Write a story</strong><small>Share text, photos & ideas</small></button><button onClick={() => navigate("/search")}><span>⌕</span><strong>Discover people</strong><small>Find your next connection</small></button><button onClick={() => navigate("/messages")}><span>◌</span><strong>Open messages</strong><small>Chat in real time</small></button><button onClick={() => navigate("/settings")}><span>⚙</span><strong>Personalize</strong><small>7 beautiful themes & controls</small></button></div></section>
        <section className="panel people-panel"><div className="section-heading"><div><h2>People you may know</h2><p>Start building your sphere.</p></div><button className="text-btn" onClick={() => navigate("/search")}>See all</button></div>{users.length === 0 ? <div className="empty-small">Search for people to grow your circle.</div> : users.map(person => <button className="person-row" key={getUserId(person)} onClick={() => navigate(`/profile/${getUserId(person)}`)}><Avatar user={person} size="sm" /><span><strong>{person.name}</strong><small>@{person.username}</small></span><Icon name="arrow" size={17} /></button>)}</section>
      </div>
    </div>}
  </Layout>;
}
