# AUREVIA Global Advisory

A fictional premium consulting website built as a frontend portfolio showcase. It is an ordinary Next.js project with no deployment integration, account login, API keys, external runtime image service, or backend requirement.

## Run locally

Requires Node.js 20.9 or newer.

```bash
npm install
npm run dev
```

Open **http://localhost:3000**. For a production check, run `npm run build` followed by `npm start`. `npm run lint` runs TypeScript validation.

No Git remote is configured by this project. You can add one yourself later. No hosting configuration or AI-platform authentication is included.

## Experience

- The opening is a scroll-controlled 3D Earth, spatial network, and signal-convergence sequence. Drag the Earth to turn it through full revolutions or double-click to zoom in through three steps, then reset to the original view. The scroll-led camera and scene progression continue from the chosen angle. The global presence Earth supports the same controls.
- The editorial introduction includes an animated signal diagram whose routes converge on a single direction.
- Capabilities are five editorial chapters with a changing route diagram.
- Industries and global locations respond to hover, focus, click, and touch.
- Case studies and perspectives open accessible local editorial views.
- The contact form validates locally and shows an honest demonstration state. It never sends or stores information.
- Motion, globe geometry, connection count, and pixel density adjust for compact screens and reduced-motion preferences. Offscreen canvases unmount.

## Structure

| Directory | Purpose |
| --- | --- |
| `app/` | Page structure, metadata, design system, responsive styles |
| `components/experience/` | Globe, network, scroll film, closing scene |
| `components/ui/` | Navigation, scroll effects, cursor, contact form, editorial overlay |
| `sections/` | Capabilities, industries, locations, work, perspectives |
| `data/` | Replaceable capabilities, sectors, fictional work, editorial content, fictional people and location copy |
| `hooks/` | Responsive, visibility and reduced-motion helpers |
| `public/assets/` | Bundled, optimized photographs and Earth texture |

## Connecting a .NET API later

The form's `submit` function is in `components/ui/ContactForm.tsx`. Replace the local demo success transition with a `fetch` to your own API endpoint, handle pending/error/success states, and perform server-side validation in the .NET API. Keep endpoint URLs in ordinary environment configuration for your own deployment. The current site requires none.

The fictional office, leadership, case-study and editorial content is held in `data/`. Replace it with verified client content before representing a real organization. The footer and content views disclose that this build is a portfolio concept.

## Asset sources

Photographs were downloaded from [Unsplash](https://unsplash.com/license) and bundled as optimized WebP assets. The source IDs are:

| Local asset | Unsplash photo ID |
| --- | --- |
| architecture | `photo-1486406146926-c627a92ad1ab` |
| structure | `photo-1511818966892-d7d671e672a2` |
| city | `photo-1477959858617-67f85cf4f1df` |
| office | `photo-1497366811353-6870744d04b2` |
| industrial | `photo-1567789884554-0b844b597180` |
| landscape | `photo-1464822759023-fed622ff2c3b` |
| monument | `photo-1518005020951-eccb494ad742` |
| leader-mara | `photo-1573496359142-b8d87734a5a2` |
| leader-daniel | `photo-1560250097-0b93528c311a` |
| leader-anika | `photo-1580489944761-15a19d654956` |

The Earth texture is the [earth_atmos_2048.jpg example texture](https://github.com/mrdoob/three.js/blob/master/examples/textures/planets/earth_atmos_2048.jpg) from three.js, color graded in the site's shader. The OpenGraph placeholder is a crop of the bundled city photograph. No asset is fetched by the site at runtime.

## Notes

The scroll film is intentionally a one-page story. Modal editorial views and local form behavior demonstrate interaction without inventing a backend or published research. If you later deploy it under a real domain, set `NEXT_PUBLIC_SITE_URL` to the public origin so OpenGraph image URLs use that origin; it is not a credential.
