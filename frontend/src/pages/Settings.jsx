import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import Avatar from "../components/Avatar";
import Icon from "../components/Icons";
import { getCurrentUser } from "../lib";

const themes = [
  ["light", "Light", "☀️"], ["dark", "Dark", "🌙"], ["green", "Forest", "🌿"], ["purple", "Royal", "🔮"],
  ["neon-green", "Neon Green", "🟢"], ["neon-red", "Neon Red", "🔴"], ["sphere", "Sphere Glow", "🌈"]
];

function SettingRow({ icon, title, desc, children }) {
  return <div className="setting-row"><div className="setting-icon"><Icon name={icon} /></div><div className="setting-copy"><strong>{title}</strong><span>{desc}</span></div>{children}</div>;
}

export default function Settings() {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const [theme, setTheme] = useState(localStorage.getItem("storySphereTheme") || "sphere");
  const [compact, setCompact] = useState(localStorage.getItem("storySphereCompact") === "true");
  const [reducedMotion, setReducedMotion] = useState(localStorage.getItem("storySphereReducedMotion") === "true");
  const [notifications, setNotifications] = useState(localStorage.getItem("storySphereNotifications") !== "false");
  const [sound, setSound] = useState(localStorage.getItem("storySphereSound") !== "false");
  const [privateMode, setPrivateMode] = useState(localStorage.getItem("storySpherePrivate") === "true");

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.classList.toggle("compact-mode", compact);
    document.documentElement.classList.toggle("reduced-motion", reducedMotion);
    localStorage.setItem("storySphereTheme", theme);
  }, [theme, compact, reducedMotion]);
  const toggle = (setter, key, value) => { setter(value); localStorage.setItem(key, String(value)); };

  return <Layout title="Settings" subtitle="Make Story Sphere feel like yours">
    <div className="settings-page">
      <section className="settings-hero panel">
        <div><span className="eyebrow">YOUR SPACE</span><h1>Personalize your experience</h1><p>Choose your look, comfort, privacy and notification preferences.</p></div>
        <Avatar user={user} size="xl" />
      </section>

      <section className="panel settings-section">
        <div className="section-heading"><div><h2>Appearance</h2><p>Pick one of seven polished themes.</p></div><Icon name="palette" /></div>
        <div className="theme-grid">{themes.map(([id, name, emoji]) => <button key={id} className={`theme-card ${theme === id ? "selected" : ""} theme-preview-${id}`} onClick={() => setTheme(id)}><span>{emoji}</span><strong>{name}</strong>{theme === id && <small><Icon name="check" size={14} /> Active</small>}</button>)}</div>
      </section>

      <section className="panel settings-section">
        <div className="section-heading"><div><h2>Experience</h2><p>Small controls that make everyday use smoother.</p></div><Icon name="settings" /></div>
        <SettingRow icon="grid" title="Compact layout" desc="Tighter cards and denser feeds on desktop."><label className="switch"><input type="checkbox" checked={compact} onChange={(e) => toggle(setCompact, "storySphereCompact", e.target.checked)} /><span /></label></SettingRow>
        <SettingRow icon="refresh" title="Reduce motion" desc="Use calmer transitions and fewer animations."><label className="switch"><input type="checkbox" checked={reducedMotion} onChange={(e) => toggle(setReducedMotion, "storySphereReducedMotion", e.target.checked)} /><span /></label></SettingRow>
        <SettingRow icon="bell" title="Notifications" desc="Show in-app notification badges and alerts."><label className="switch"><input type="checkbox" checked={notifications} onChange={(e) => toggle(setNotifications, "storySphereNotifications", e.target.checked)} /><span /></label></SettingRow>
        <SettingRow icon="message" title="Message sounds" desc="Allow a subtle sound cue for new messages."><label className="switch"><input type="checkbox" checked={sound} onChange={(e) => toggle(setSound, "storySphereSound", e.target.checked)} /><span /></label></SettingRow>
      </section>

      <section className="panel settings-section">
        <div className="section-heading"><div><h2>Privacy & safety</h2><p>Control how your local experience behaves.</p></div><Icon name="shield" /></div>
        <SettingRow icon="lock" title="Private mode preview" desc="Keeps privacy-first UI defaults enabled on this device."><label className="switch"><input type="checkbox" checked={privateMode} onChange={(e) => toggle(setPrivateMode, "storySpherePrivate", e.target.checked)} /><span /></label></SettingRow>
        <button className="setting-action" onClick={() => alert("Your login security is handled by the Story Sphere API. Use a strong password and sign out on shared devices.")}><Icon name="shield" /><span><strong>Security tips</strong><small>Review simple account-safety guidance</small></span><Icon name="arrow" size={18} /></button>
      </section>

      <section className="panel settings-section">
        <div className="section-heading"><div><h2>Account</h2><p>Quick access to your profile and support.</p></div><Icon name="user" /></div>
        <button className="setting-action" onClick={() => navigate(`/profile/${user?.id || user?._id}`)}><Avatar user={user} size="sm" /><span><strong>{user?.name || "Vikash"}</strong><small>@{user?.username || "storylover"}</small></span><Icon name="arrow" size={18} /></button>
        <button className="setting-action" onClick={() => alert("Story Sphere Help: use Search to discover people, Stories to publish, and Messages for live chat.")}><Icon name="info" /><span><strong>Help & about</strong><small>Learn how Story Sphere works</small></span><Icon name="arrow" size={18} /></button>
      </section>
    </div>
  </Layout>;
}
