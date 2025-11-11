import { appConfig } from '@/config';

const currentYear = new Date().getFullYear();

const socialEntries = Object.entries(appConfig.social).filter(([, url]) => !!url);

const formatNetwork = (network: string) =>
  network
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

export default function Footer() {
  const { name, tagline, contact } = appConfig;
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="container footer-grid">
          <div className="footer-brand-block">
            <div className="footer-brand">{name}</div>
            <p className="footer-tagline">{tagline}</p>
          </div>
          <div className="footer-column">
            <div className="footer-heading">Contact</div>
            <ul className="footer-list">
              <li>{contact.email}</li>
              <li>{contact.phone}</li>
              <li>{contact.address}</li>
            </ul>
          </div>
          {socialEntries.length > 0 && (
            <div className="footer-column">
              <div className="footer-heading">Social</div>
              <ul className="footer-list">
                {socialEntries.map(([network, url]) => (
                  <li key={network}>
                    <a href={url} target="_blank" rel="noopener noreferrer">
                      {formatNetwork(network)}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container footer-bottom-inner">
          <span>© {currentYear} {name}. All rights reserved.</span>
          <a href={`mailto:${contact.email}`}>Need help? {contact.email}</a>
        </div>
      </div>
    </footer>
  );
}
