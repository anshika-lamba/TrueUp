// components/MarketingFooter.tsx
const COLUMNS: { title: string; links: { label: string; href: string }[] }[] = [
    {
      title: 'Product',
      links: [
        { label: 'Studio', href: '/studio' },
        { label: 'Templates', href: '#features' },
        { label: 'Pricing', href: '#pricing' },
        { label: 'Security', href: '#security' },
      ],
    },
    {
      title: 'Developers',
      links: [
        { label: 'Documentation', href: '#docs' },
        { label: 'API Reference', href: '#api' },
        { label: 'GitHub', href: 'https://github.com' },
        { label: 'Changelog', href: '#changelog' },
      ],
    },
    {
      title: 'Company',
      links: [
        { label: 'About', href: '#about' },
        { label: 'Blog', href: '#blog' },
        { label: 'Twitter / X', href: 'https://twitter.com' },
        { label: 'Contact', href: '#contact' },
      ],
    },
  ]
  
  export function MarketingFooter() {
    return (
      <footer className="border-t border-[var(--marketing-border)] bg-[var(--marketing-bg)] px-8 py-20">
        <div className="mx-auto max-w-[1280px]">
          <div className="grid gap-12 md:grid-cols-4">
            <div>
              <div className="flex items-center gap-2">
                <span
                  className="flex h-8 w-8 items-center justify-center rounded-md bg-[var(--marketing-emerald)] font-bold text-black"
                  aria-hidden="true"
                >
                  T
                </span>
                <span className="text-[15px] font-semibold text-[var(--marketing-text)]">
                  trueup
                </span>
              </div>
              <p className="mt-4 max-w-[240px] text-sm leading-relaxed text-[var(--marketing-text-muted)]">
                The billing engine your finance team will thank you for.
              </p>
            </div>
  
            {COLUMNS.map((col) => (
              <div key={col.title}>
                <h3 className="mb-4 font-mono text-[11px] font-semibold uppercase tracking-widest text-[var(--marketing-text-subtle)]">
                  {col.title}
                </h3>
                <ul className="flex flex-col gap-3">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="text-[13px] text-[var(--marketing-text-muted)] transition-colors hover:text-[var(--marketing-text)]"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
  
          <div className="mt-20 flex flex-col items-start justify-between gap-4 border-t border-[var(--marketing-border)] pt-8 sm:flex-row sm:items-center">
            <span className="font-mono text-[11px] text-[var(--marketing-text-subtle)]">
              © 2024 TrueUp. Built for the Unlayer Elements Challenge.
            </span>
            <span className="font-mono text-[11px] text-[var(--marketing-text-subtle)]">
              Powered by @unlayer/react-elements v0.1.20
            </span>
          </div>
        </div>
      </footer>
    )
  }