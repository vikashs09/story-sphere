import logoIcon from "../assets/story-sphere-icon.png";

export default function Loader({ full = false, label = "Loading your space…" }) {
  return <div className={full ? "loader-screen" : "loader-inline"}>
    <div className="loader-orbit"><img src={logoIcon} alt="Story Sphere" /></div>
    <span>{label}</span>
  </div>;
}
