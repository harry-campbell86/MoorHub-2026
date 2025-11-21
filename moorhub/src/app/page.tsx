const strikes = [
  "Search moorings by marina, region, and fit for your vessel.",
  "See berth specs, pricing bands, and availability signals at a glance.",
  "Message marinas directly from MoorHub and keep your shortlists organised.",
];

const marinaWins = [
  "Get in front of serious owners searching for long-stay berths.",
  "Highlight services, depth, power, and contracts in a structured listing.",
  "Low-friction onboarding with our team helping tidy your listing.",
];

const steps = [
  "Tell us about your boat or marina (draft, beam, power, term).",
  "We set up your profile so owners can browse and compare easily.",
  "Owners connect and book through you; we keep the directory clean and current.",
];

const listings = [
  {
    title: "Riverside Marina, Bath",
    type: "Pontoon & serviced berths",
    price: "From £420 / mo",
    tags: ["Shore power", "Pump-out", "Secure access"],
    image:
      "https://images.unsplash.com/photo-1505761682-2ae287317ff2?auto=format&fit=crop&w=1200&q=80",
    badge: "Available now",
    distance: "City centre • Canal",
  },
  {
    title: "Grand Union Moorings, Leighton Buzzard",
    type: "Residential & leisure",
    price: "From £360 / mo",
    tags: ["Wi-Fi", "Parking", "Water"],
    image:
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80",
    badge: "Few spots left",
    distance: "Towpath access • Grand Union",
  },
  {
    title: "Limehouse Basin, London",
    type: "Marina berths",
    price: "From £890 / mo",
    tags: ["Shore power", "Security", "Facilities"],
    image:
      "https://images.unsplash.com/photo-1518831959414-44c0b8b0c0b1?auto=format&fit=crop&w=1200&q=80",
    badge: "Waitlist open",
    distance: "Docklands • Thames link",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen">
      <div className="mx-auto flex max-w-5xl flex-col gap-12 px-6 py-10 sm:px-10">
        <section className="rounded-3xl border border-[color:var(--border)] bg-white p-5 shadow-[0_16px_38px_rgba(17,64,111,0.08)]">
          <h2 className="text-lg font-semibold text-[color:var(--ink)]">Find a mooring</h2>
          <p className="mt-1 text-sm text-[color:var(--muted)]">
            Start with a location and a radius to see marinas and moorings nearby.
          </p>
          <form className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
            <label className="flex-1 space-y-1 text-sm text-[color:var(--muted)]">
              <span className="font-semibold text-[color:var(--ink)]">Search location</span>
              <input
                className="mt-1 w-full rounded-full border border-[color:var(--border)] bg-white px-4 py-3 text-[color:var(--ink)] shadow-inner shadow-[rgba(17,64,111,0.04)] focus:border-[color:var(--accent)] focus:outline-none"
                type="text"
                placeholder="City, marina, canal, or region"
                name="location"
              />
            </label>
            <label className="w-full space-y-1 text-sm text-[color:var(--muted)] sm:w-44">
              <span className="font-semibold text-[color:var(--ink)]">Radius</span>
              <select
                className="mt-1 w-full rounded-full border border-[color:var(--border)] bg-white px-4 py-3 text-[color:var(--ink)] shadow-inner shadow-[rgba(17,64,111,0.04)] focus:border-[color:var(--accent)] focus:outline-none"
                name="radius"
                defaultValue="25"
              >
                {["5", "10", "25", "50", "100"].map((km) => (
                  <option key={km} value={km}>
                    {km} km
                  </option>
                ))}
              </select>
            </label>
            <button
              className="w-full rounded-full bg-[color:var(--accent)] px-5 py-3 text-sm font-semibold text-white shadow-sm shadow-[rgba(30,124,200,0.3)] transition hover:-translate-y-0.5 hover:shadow sm:w-auto"
              type="button"
            >
              Search moorings
            </button>
          </form>
        </section>

        <section className="space-y-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.26em] text-[color:var(--accent-2)]">Featured moorings</p>
              <h1 className="text-3xl font-semibold leading-tight text-[color:var(--ink)] sm:text-4xl">
                Wherever floats your boat.
              </h1>
              <p className="text-base text-[color:var(--muted)]">
                Browse marinas and canal moorings like a property search—photos, prices, and fit for your vessel.
              </p>
            </div>
            <button className="rounded-full bg-[color:var(--accent)] px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-[rgba(5,167,159,0.3)]">
              View all moorings
            </button>
          </div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {listings.map((listing) => (
              <article
                key={listing.title}
                className="overflow-hidden rounded-2xl border border-[color:var(--border)] bg-white shadow-[0_14px_34px_rgba(10,47,100,0.08)]"
              >
                <div
                  className="relative h-44 bg-cover bg-center"
                  style={{ backgroundImage: `url(${listing.image})` }}
                  role="img"
                  aria-label={listing.title}
                >
                  <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-[color:var(--accent-2)]">
                    {listing.badge}
                  </span>
                </div>
                <div className="space-y-2 p-5">
                  <div className="flex items-center justify-between text-xs uppercase tracking-[0.18em] text-[color:var(--muted)]">
                    <span>{listing.type}</span>
                    <span className="font-semibold text-[color:var(--accent-2)]">{listing.price}</span>
                  </div>
                  <h2 className="text-lg font-semibold text-[color:var(--ink)]">{listing.title}</h2>
                  <p className="text-sm text-[color:var(--muted)]">{listing.distance}</p>
                  <div className="flex flex-wrap gap-2 pt-2 text-xs text-[color:var(--muted)]">
                    {listing.tags.map((tag) => (
                      <span key={tag} className="rounded-full border border-[color:var(--border)] px-3 py-1 bg-[color:var(--bg-mid)]/40">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-3xl border border-[color:var(--border)] bg-white p-7 shadow-[0_16px_40px_rgba(17,64,111,0.08)]">
            <p className="text-xs uppercase tracking-[0.22em] text-[color:var(--accent-2)]">For boat owners</p>
            <h2 className="mt-2 text-2xl font-semibold text-[color:var(--ink)]">Search moorings like property listings.</h2>
            <ul className="mt-4 space-y-3 text-sm text-[color:var(--muted)]">
              {strikes.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-1 inline-block h-2 w-2 rounded-full bg-[color:var(--accent)]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-5 flex flex-wrap gap-3">
              <button className="rounded-full bg-[color:var(--accent)] px-5 py-2 text-sm font-semibold text-white shadow-sm shadow-[rgba(5,167,159,0.3)]">
                Browse marinas
              </button>
              <button className="rounded-full border border-[color:var(--border)] px-5 py-2 text-sm text-[color:var(--muted)] hover:border-[color:var(--accent)] hover:text-[color:var(--ink)]">
                Save my boat details
              </button>
            </div>
          </div>

          <div className="rounded-3xl border border-[color:var(--border)] bg-white p-7 shadow-[0_16px_40px_rgba(17,64,111,0.08)]">
            <p className="text-xs uppercase tracking-[0.22em] text-[color:var(--accent-2)]">For marinas & moorings</p>
            <h2 className="mt-2 text-2xl font-semibold text-[color:var(--ink)]">List once, meet the right long-stay owners.</h2>
            <div
              className="mt-4 h-32 w-full overflow-hidden rounded-2xl border border-[color:var(--border)] bg-cover bg-center"
              style={{
                backgroundImage:
                  "url(https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1200&q=80)",
              }}
              role="img"
              aria-label="Canal marina with moored boats"
            />
            <ul className="mt-4 space-y-3 text-sm text-[color:var(--muted)]">
              {marinaWins.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-1 inline-block h-2 w-2 rounded-full bg-[color:var(--accent)]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm font-semibold text-[color:var(--ink)]">Paid listings. We help you set it up.</p>
          </div>
        </section>

        <section className="grid gap-6 rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface)] p-8 text-sm text-[color:var(--muted)] md:grid-cols-[1.1fr_0.9fr] shadow-[0_14px_36px_rgba(17,64,111,0.06)]">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-[color:var(--accent-2)]">How it works</p>
            <h3 className="mt-2 text-xl font-semibold text-[color:var(--ink)]">
              A clean directory with real details and owners ready to berth.
            </h3>
            <p className="mt-3 text-[color:var(--muted)]">
              We keep listings structured and current. Boat owners browse with filters that match how
              marinas think—depth, beam, services, contract terms.
            </p>
          </div>
          <div className="grid gap-3">
            {steps.map((step, index) => (
              <div
                key={step}
                className="flex items-start gap-3 rounded-2xl border border-[color:var(--border)] bg-white p-4 shadow-[0_10px_24px_rgba(17,64,111,0.05)]"
              >
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[color:var(--accent)] text-sm font-semibold text-white">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <p className="leading-relaxed text-[color:var(--ink)]">{step}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-[color:var(--border)] bg-gradient-to-r from-white via-[#f4f8fc] to-[#e8f1fa] p-8 shadow-[0_18px_40px_rgba(17,64,111,0.08)]">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-[color:var(--accent-2)]">Ready to start?</p>
              <h3 className="mt-2 text-xl font-semibold text-[color:var(--ink)]">Tell us your boat or add your marina listing.</h3>
              <p className="mt-2 max-w-2xl text-[color:var(--muted)]">We will onboard you in a quick call and make sure your details are live and easy to find.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button className="rounded-full bg-[color:var(--accent)] px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-[rgba(30,124,200,0.35)]">
                Book a call
              </button>
              <button className="rounded-full border border-[color:var(--accent)] px-4 py-2 text-sm text-[color:var(--accent-2)]">
                Send your details
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}












