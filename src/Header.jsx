import { useEffect, useRef } from "react";

export default function Header({ theme, onThemeToggle }) {
  const logoRef = useRef(null);
  useEffect(() => {
    if (logoRef.current) {
      logoRef.current.classList.add("logo-animate");
    }
  }, []);

  return (
    <header>
      <img ref={logoRef} src="/Chef Claude Icon.png" alt="Chef Claude Logo" />
      <h1>Chef Claude</h1>
      <button
        className="theme-toggle-btn"
        aria-label="Toggle dark mode"
        onClick={onThemeToggle}
        title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      >
        {theme === "dark" ? (
          <span role="img" aria-label="Light mode">🌞</span>
        ) : (
          <span role="img" aria-label="Dark mode">🌙</span>
        )}
      </button>
    </header>
  );
}