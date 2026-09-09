import { useMemo } from "react";
import sphereIcon from "../assets/story-sphere-icon.png";
import { useLocation, useNavigate } from "react-router-dom";
import Avatar from "./Avatar";
import Icon from "./Icons";
import { getCurrentUser, getUserId } from "../lib";

export default function Layout({ children, title, subtitle = "" }) {
  const navigate = useNavigate();
  const location = useLocation();
  const user = getCurrentUser();
  const userId = getUserId(user);
  const nav = [
    ["/home", "home", "Home"],
    ["/posts", "grid", "Stories"],
    ["/messages", "message", "Messages"],
    ["/notifications", "bell", "Alerts"],
    ["/search", "search", "Discover"],
  ];
  const active = useMemo(() => location.pathname, [location.pathname]);

  const logout = () => {
    localStorage.removeItem("storySphereToken");
    localStorage.removeItem("storySphereUser");
    navigate("/login", { replace: true });
  };

  return <div className="app-shell">
    <header className="topbar">
      <div className="topbar-inner">
        <button className="brand" onClick={() => navigate("/home")} aria-label="Story Sphere home">
          <span className="brand-mark"><img src={sphereIcon} alt="" /></span>
          <span className="brand-name">Story<span>Sphere</span></span>
        </button>
        <div className="topbar-title">
          <strong>{title}</strong>
          {subtitle && <span>{subtitle}</span>}
        </div>
        <div className="top-actions">
          <button className="icon-btn" onClick={() => navigate("/search")} title="Search"><Icon name="search" /></button>
          <button className="icon-btn" onClick={() => navigate("/settings")} title="Settings"><Icon name="settings" /></button>
          <button className="profile-mini" onClick={() => navigate(`/profile/${userId}`)}><Avatar user={user} size="sm" /><span>{user?.name || "Vikash"}</span></button>
        </div>
      </div>
    </header>

    <aside className="sidebar">
      <div className="sidebar-user" onClick={() => navigate(`/profile/${userId}`)}>
        <Avatar user={user} size="lg" />
        <div><strong>{user?.name || "Vikash"}</strong><span>@{user?.username || "storylover"}</span></div>
      </div>
      <nav className="side-nav">
        {nav.map(([path, icon, label]) => <button key={path} className={active === path || (path !== "/home" && active.startsWith(path)) ? "nav-item active" : "nav-item"} onClick={() => navigate(path)}><Icon name={icon} /><span>{label}</span></button>)}
      </nav>
      <div className="sidebar-bottom">
        <button className="nav-item" onClick={() => navigate(`/profile/${userId}`)}><Icon name="user" /><span>My Profile</span></button>
        <button className="nav-item" onClick={() => navigate("/settings")}><Icon name="settings" /><span>Settings</span></button>
        <button className="nav-item danger-text" onClick={logout}><Icon name="logout" /><span>Sign out</span></button>
      </div>
    </aside>

    <main className="page-content">{children}</main>

    <nav className="mobile-nav">
      {nav.slice(0, 4).map(([path, icon, label]) => <button key={path} className={active === path ? "mobile-nav-item active" : "mobile-nav-item"} onClick={() => navigate(path)}><Icon name={icon} size={21} /><span>{label}</span></button>)}
      <button className="mobile-nav-item" onClick={() => navigate(`/profile/${userId}`)}><Avatar user={user} size="xs" /><span>Profile</span></button>
    </nav>
  </div>;
}
