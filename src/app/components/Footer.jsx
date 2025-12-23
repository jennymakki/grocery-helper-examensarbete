export default function Footer() {
  return (
    <footer className="footer-premium">
      <div className="footer-inner">
        <span className="footer-brand">
          Grocery <span>Helper</span>
        </span>

        <span className="footer-copy">
          © {new Date().getFullYear()} Grocery Helper. All rights reserved.
        </span>
      </div>
    </footer>
  );
}