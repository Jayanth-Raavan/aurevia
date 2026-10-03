export default function ManifestoSignal() {
  return (
    <div className="manifesto-signal" aria-hidden="true">
      <svg viewBox="0 0 360 360" fill="none" focusable="false">
        <circle className="signal-guide" cx="180" cy="180" r="146" />
        <circle className="signal-guide signal-guide-inner" cx="180" cy="180" r="96" />
        <path className="signal-axis" d="M180 17v326M17 180h326" />
        <path className="signal-tick" d="M180 9v16M180 335v16M9 180h16M335 180h16" />
        <g className="signal-orbit signal-orbit-one">
          <circle cx="180" cy="180" r="122" strokeDasharray="180 587" />
          <circle className="signal-orbit-dot" cx="180" cy="58" r="3.5" />
        </g>
        <g className="signal-orbit signal-orbit-two">
          <circle cx="180" cy="180" r="69" strokeDasharray="82 352" />
          <circle className="signal-orbit-dot" cx="180" cy="111" r="2.5" />
        </g>
        <path className="signal-tributary" d="M32 251C95 238 115 153 188 180S278 207 326 180" />
        <path className="signal-tributary" d="M31 180C98 174 125 224 188 180S282 172 326 180" />
        <path className="signal-tributary" d="M35 107C96 126 126 128 188 180S282 187 326 180" />
        <path className="signal-route" d="M32 251C95 238 115 153 188 180S278 207 326 180" />
        <circle className="signal-origin" cx="32" cy="251" r="3" />
        <circle className="signal-origin" cx="31" cy="180" r="3" />
        <circle className="signal-origin" cx="35" cy="107" r="3" />
        <circle className="signal-destination-halo" cx="326" cy="180" r="13" />
        <circle className="signal-destination" cx="326" cy="180" r="4.5" />
      </svg>
      <div className="manifesto-signal-meta"><span>01 / SIGNAL</span><span>02 / DIRECTION</span></div>
    </div>
  );
}
