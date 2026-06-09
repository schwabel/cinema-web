import './Header.css';
import { useConfig } from '../hooks/useConfig';

export default function Header() {
  const { config } = useConfig();
  return (
    <header className="th-header">
      <div className="container">
        <div className="brand">
          <div className="brand-mark" aria-hidden="true">🎬</div>
          <div className="brand-text">
            <div className="brand-title">{config.siteName}</div>
            <div className="brand-sub">{config.tagline}</div>
          </div>
        </div>
        <nav className="nav">
          <a href="#now-playing">Now Playing</a>
          <a href="#coming-soon">Coming Soon</a>
        </nav>
      </div>
    </header>
  );
}
