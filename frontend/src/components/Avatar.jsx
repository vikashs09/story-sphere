import { imageUrl, initials } from "../lib";

export default function Avatar({ user, size = "md", className = "" }) {
  const sizes = { xs: 30, sm: 40, md: 48, lg: 72, xl: 112 };
  const px = sizes[size] || sizes.md;
  const name = user?.name || user?.username || "User";
  const src = imageUrl(user?.profilePicture);
  return src ? (
    <img className={`avatar avatar-${size} ${className}`} src={src} alt={name} style={{ width: px, height: px }} />
  ) : (
    <div className={`avatar avatar-${size} avatar-fallback ${className}`} style={{ width: px, height: px }} aria-label={name}>
      {initials(name)}
    </div>
  );
}
