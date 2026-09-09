export default function Icon({ name, size = 20, strokeWidth = 1.9 }) {
  const common = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true };
  const paths = {
    home: <><path d="m3 10 9-7 9 7"/><path d="M5 9v11h14V9"/><path d="M9 20v-6h6v6"/></>,
    grid: <><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></>,
    plus: <><path d="M12 5v14"/><path d="M5 12h14"/></>,
    message: <><path d="M21 11.5a8 8 0 0 1-8.5 8A9.6 9.6 0 0 1 7 18l-4 1 1.3-3.6A8.2 8.2 0 1 1 21 11.5Z"/></>,
    bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M10 21h4"/></>,
    search: <><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></>,
    user: <><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></>,
    settings: <><path d="M12 15.2a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4Z"/><path d="m19.4 15 .1.1 1.2 1.9-2 2-1.9-1.2-.1.1a8.2 8.2 0 0 1-2.2.9L14 21h-4l-.5-2.2a8.2 8.2 0 0 1-2.2-.9l-.1-.1-1.9 1.2-2-2 1.2-1.9.1-.1a8.2 8.2 0 0 1-.9-2.2L1.5 12l2.2-.5a8.2 8.2 0 0 1 .9-2.2l-.1-.1-1.2-1.9 2-2 1.9 1.2.1-.1a8.2 8.2 0 0 1 2.2-.9L10 3h4l.5 2.2a8.2 8.2 0 0 1 2.2.9l.1.1 1.9-1.2 2 2-1.2 1.9-.1.1a8.2 8.2 0 0 1 .9 2.2l2.2.5-2.2.5a8.2 8.2 0 0 1-.9 2.2Z"/></>,
    logout: <><path d="M10 17l5-5-5-5"/><path d="M15 12H3"/><path d="M21 3v18"/></>,
    heart: <path d="M20.8 8.7c0 5-8.8 10.3-8.8 10.3S3.2 13.7 3.2 8.7A4.7 4.7 0 0 1 12 6.3a4.7 4.7 0 0 1 8.8 2.4Z"/>,
    comment: <path d="M20 11.5a7.5 7.5 0 0 1-8 7.5 9 9 0 0 1-4.7-1.3L3 19l1.2-3.8A7.5 7.5 0 1 1 20 11.5Z"/>,
    share: <><path d="m21 3-7 18-3.5-7.5L3 10l18-7Z"/><path d="m10.5 13.5 4-4"/></>,
    image: <><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="8.5" cy="9" r="1.5"/><path d="m21 15-5-5L5 20"/></>,
    more: <><circle cx="5" cy="12" r="1" fill="currentColor"/><circle cx="12" cy="12" r="1" fill="currentColor"/><circle cx="19" cy="12" r="1" fill="currentColor"/></>,
    arrow: <><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></>,
    back: <><path d="m15 18-6-6 6-6"/></>,
    check: <path d="m5 12 4 4L19 6"/>,
    shield: <><path d="M12 3 20 6v5c0 5-3.4 8.2-8 10-4.6-1.8-8-5-8-10V6l8-3Z"/><path d="m9 12 2 2 4-4"/></>,
    palette: <><circle cx="12" cy="12" r="8"/><circle cx="8" cy="10" r="1" fill="currentColor"/><circle cx="12" cy="7" r="1" fill="currentColor"/><circle cx="16" cy="10" r="1" fill="currentColor"/><path d="M15 18c-.4-2 1.2-3 3-2.5"/></>,
    close: <><path d="m6 6 12 12"/><path d="m18 6-12 12"/></>,
    sun: <><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></>,
    moon: <path d="M20 15.2A8.5 8.5 0 0 1 8.8 4a8.5 8.5 0 1 0 11.2 11.2Z"/>,
    eye: <><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z"/><circle cx="12" cy="12" r="2.5"/></>,
    lock: <><rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></>,
    info: <><circle cx="12" cy="12" r="9"/><path d="M12 11v5"/><path d="M12 8h.01"/></>,
    refresh: <><path d="M20 11a8 8 0 0 0-14.7-4L3 10"/><path d="M3 5v5h5"/><path d="M4 13a8 8 0 0 0 14.7 4L21 14"/><path d="M21 19v-5h-5"/></>,
  };
  return <svg {...common}>{paths[name] || paths.info}</svg>;
}
