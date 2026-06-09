import './Footer.css';
import { useConfig } from '../hooks/useConfig';

export default function Footer() {
  const { config } = useConfig();
  const email = config.contactEmail;
  return (
    <footer className="th-footer" id="contact">
      <div className="container">
        <div className="cols">
          <div className="col">
            {email ? (
              <a className="ft-link" href={`mailto:${email}`}>{email}</a>
            ) : null}
          </div>
        </div>
      </div>
    </footer>
  );
}
