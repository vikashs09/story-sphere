import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/story-sphere-logo.png";

export default function Splash() {
  const navigate = useNavigate();
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate(localStorage.getItem("storySphereToken") ? "/home" : "/login", { replace: true });
    }, 2300);
    return () => clearTimeout(timer);
  }, [navigate]);
  return <div className="splash-screen">
    <div className="splash-glow one" /><div className="splash-glow two" />
    <div className="splash-content">
      <div className="splash-logo-wrap"><img src={logo} alt="Story Sphere" /></div>
      <div className="splash-loader"><span /><span /><span /></div>
      <p>Where every story finds its sphere.</p>
    </div>
  </div>;
}
