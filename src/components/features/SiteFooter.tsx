import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="footer-demo site-footer">
      <div className="page">
        <div className="cols">
          <div className="fbrand">
            <div className="wordmark">⬖ Kiri</div>
            <div className="tag">The fastest way to track, value, and trade your collection.</div>
          </div>
          <div className="fcol">
            <div className="h">Product</div>
            <Link href="/pricing">Pricing</Link>
            <Link href="/signin">Login</Link>
          </div>
          <div className="fcol">
            <div className="h">Cards</div>
            <Link href="/cards">Card database</Link>
            <Link href="/watchlist">Watchlist</Link>
          </div>
          <div className="fcol">
            <div className="h">Account</div>
            <Link href="/portfolio">Portfolio</Link>
            <Link href="/settings">Settings</Link>
          </div>
        </div>
        <div className="fbottom">© Kiri. All rights reserved.</div>
      </div>
    </footer>
  );
}
