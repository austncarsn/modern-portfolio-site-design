import { Mail, ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";
import { useStaggerVariants } from "./motion-variants";

const NAV_LINKS = [
  { label: "Case Studies", href: "#/projects" },
  { label: "Gallery", href: "#/gallery" },
  { label: "Flashcards", href: "#/flashcards" },
  { label: "Notebook", href: "#/prompt-notebook" },
  { label: "Info", href: "#/info" },
] as const;

const SOCIAL_LINKS = [
  { label: "GitHub", href: "https://github.com/austncarsn" },
  { label: "LinkedIn", href: "https://linkedin.com/in/austin-carson" },
  { label: "Dribbble", href: "https://dribbble.com/austincarson" },
] as const;

export function Footer() {
  const { container, item } = useStaggerVariants();
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <style>{`
        .footer {
          width: 100%;
          background: #121212;
          border-top: 1px solid rgba(255,255,255,0.12);
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.06),
            inset 0 12px 24px rgba(0,0,0,0.35);
        }

        .footerInner {
          max-width: 1120px;
          margin: 0 auto;
          padding: var(--sp-24) var(--sp-4) var(--sp-20);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--sp-10);
          text-align: center;
        }

        .tagline {
          font-family: var(--font-display);
          font-size: var(--ts-h2);
          font-weight: 400;
          line-height: 1.45;
          letter-spacing: -0.02em;
          color: rgba(249,249,247,0.95);
          max-width: 680px;
          margin: 0;
        }

        .cta {
          display: inline-flex;
          align-items: center;
          gap: var(--sp-2);
          padding: 18px var(--sp-8);
          background: var(--selected-bg);
          color: var(--selected-fg);
          font-family: var(--font-body);
          font-size: var(--ts-body);
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          text-decoration: none;
          transition: transform 140ms ease, opacity 140ms ease;
        }

        .cta:hover { opacity: 0.95; transform: translateY(-1px); }
        .cta:active { transform: translateY(0); }

        .divider {
          width: 100%;
          max-width: 560px;
          height: 1px;
          background: rgba(255,255,255,0.2);
        }

        .nav,
        .social {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: var(--sp-8);
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .navLink {
          font-family: var(--font-body);
          font-size: var(--ts-body);
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: rgba(245,245,243,0.86);
          text-decoration: none;
        }

        .navLink:hover,
        .socialLink:hover {
          color: rgba(255,255,255,0.97);
        }

        .social {
          gap: var(--sp-6);
        }

        .socialLink {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-family: var(--font-body);
          font-size: var(--ts-body);
          color: rgba(245,245,243,0.8);
          text-decoration: none;
        }

        .copyright {
          margin-top: var(--sp-4);
          font-family: var(--font-body);
          font-size: var(--ts-small);
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.55);
        }

        .footer a:focus-visible {
          outline: 2px solid rgba(255,255,255,0.9);
          outline-offset: 3px;
        }
      `}</style>

      <motion.div
        className="footerInner"
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <motion.p className="tagline" variants={item}>
          Design engineer with a bias for clarity, utility, and craft. Building at
          the intersection of web development, AI fluency, and experience design.
        </motion.p>

        <motion.a
          variants={item}
          href="mailto:austncarsn@gmail.com"
          className="cta"
          aria-label="Email Austin Carson"
        >
          <Mail size={16} strokeWidth={1.5} />
          Contact Austin
        </motion.a>

        <motion.div className="divider" variants={item} aria-hidden="true" />

        <motion.nav variants={item} aria-label="Footer navigation">
          <ul className="nav">
            {NAV_LINKS.map((link) => (
              <li key={link.label}>
                <a className="navLink" href={link.href}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </motion.nav>

        <motion.nav variants={item} aria-label="Social links">
          <ul className="social">
            {SOCIAL_LINKS.map((link) => (
              <li key={link.label}>
                <a
                  className="socialLink"
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {link.label}
                  <ArrowUpRight size={12} strokeWidth={1.5} />
                </a>
              </li>
            ))}
          </ul>
        </motion.nav>

        <span className="copyright">
          &copy; {year} Austin Carson
        </span>
      </motion.div>
    </footer>
  );
}
