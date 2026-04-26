// Shared UI primitives for TrustKYC
const { useState: useState_U, useEffect: useEffect_U, useRef: useRef_U, useMemo: useMemo_U } = React;

// ---------- Icons (hand-rolled minimal strokes) ----------
const Icon = ({ d, size = 18, className = '', stroke = 'currentColor', fill = 'none', strokeWidth = 1.6 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke} strokeWidth={strokeWidth}
    strokeLinecap="round" strokeLinejoin="round" className={className}>{d}</svg>
);
const Icons = {
  dashboard: <Icon d={<><rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/></>} />,
  customers: <Icon d={<><circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6"/><circle cx="17" cy="9" r="2.5"/><path d="M16 14c2.6 0 5 1.6 5 5"/></>} />,
  pipeline: <Icon d={<><rect x="3" y="4" width="5" height="16" rx="1.5"/><rect x="10" y="4" width="5" height="10" rx="1.5"/><rect x="17" y="4" width="4" height="14" rx="1.5"/></>} />,
  documents: <Icon d={<><path d="M4 6.5a2 2 0 0 1 2-2h5l2 2.5h5a2 2 0 0 1 2 2V18a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6.5Z"/></>} />,
  activity: <Icon d={<><circle cx="12" cy="12" r="9"/><path d="M12 7v5.5l3.5 2"/></>} />,
  workflows: <Icon d={<><circle cx="6" cy="5" r="2"/><circle cx="6" cy="19" r="2"/><circle cx="18" cy="12" r="2"/><path d="M6 7v10M8 5h6a4 4 0 0 1 4 4v1M8 19h6a4 4 0 0 0 4-4v-1"/></>} />,
  team: <Icon d={<><circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6"/><circle cx="17" cy="7" r="2.5"/><circle cx="19" cy="15" r="2.5"/></>} />,
  settings: <Icon d={<><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1A1.7 1.7 0 0 0 4.6 9a1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z"/></>} />,
  search: <Icon d={<><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></>} />,
  bell: <Icon d={<><path d="M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9Z"/><path d="M10 21a2 2 0 0 0 4 0"/></>} />,
  chevronDown: <Icon d={<path d="m6 9 6 6 6-6"/>} />,
  chevronRight: <Icon d={<path d="m9 6 6 6-6 6"/>} />,
  plus: <Icon d={<><path d="M12 5v14M5 12h14"/></>} />,
  filter: <Icon d={<path d="M3 5h18l-7 9v5l-4 2v-7L3 5Z"/>} />,
  upload: <Icon d={<><path d="M12 16V4M6 10l6-6 6 6"/><path d="M4 20h16"/></>} />,
  download: <Icon d={<><path d="M12 4v12M6 12l6 6 6-6"/><path d="M4 20h16"/></>} />,
  check: <Icon d={<path d="m5 12 5 5 9-11"/>} />,
  x: <Icon d={<><path d="M6 6l12 12M18 6 6 18"/></>} />,
  arrowUp: <Icon d={<path d="M12 20V5M6 11l6-6 6 6"/>} />,
  arrowDown: <Icon d={<path d="M12 5v15M6 13l6 6 6-6"/>} />,
  arrowRight: <Icon d={<path d="M5 12h14M13 5l7 7-7 7"/>} />,
  more: <Icon d={<><circle cx="5" cy="12" r="1.4"/><circle cx="12" cy="12" r="1.4"/><circle cx="19" cy="12" r="1.4"/></>} fill="currentColor" stroke="none" />,
  eye: <Icon d={<><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></>} />,
  flag: <Icon d={<><path d="M5 21V4h11l-2 4 2 4H5"/></>} />,
  alert: <Icon d={<><path d="M12 3 2 21h20L12 3Z"/><path d="M12 10v5M12 18v.01"/></>} />,
  signature: <Icon d={<><path d="M3 17c3 0 3-7 6-7s3 7 6 7 3-3 6-3"/><path d="M3 21h18"/></>} />,
  grip: <Icon d={<><circle cx="9" cy="6" r="1" fill="currentColor"/><circle cx="9" cy="12" r="1" fill="currentColor"/><circle cx="9" cy="18" r="1" fill="currentColor"/><circle cx="15" cy="6" r="1" fill="currentColor"/><circle cx="15" cy="12" r="1" fill="currentColor"/><circle cx="15" cy="18" r="1" fill="currentColor"/></>} />,
  logo: <Icon size={22} d={<><rect x="2" y="2" width="20" height="20" rx="5.5" fill="#2563EB" stroke="none"/><path d="M7 7.5h10M12 7.5v10" stroke="white" strokeWidth="2.2"/></>} stroke="none" />,
  logout: <Icon d={<><path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3"/><path d="M10 17l-5-5 5-5M5 12h11"/></>} />,
  columns: <Icon d={<><rect x="3" y="4" width="7" height="16" rx="1.5"/><rect x="14" y="4" width="7" height="16" rx="1.5"/></>} />,
  list: <Icon d={<><path d="M8 6h13M8 12h13M8 18h13M3.5 6h.01M3.5 12h.01M3.5 18h.01"/></>} />,
  doc: <Icon d={<><path d="M7 3h7l5 5v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z"/><path d="M14 3v5h5"/></>} />,
  calendar: <Icon d={<><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></>} />,
  user: <Icon d={<><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/></>} />,
};

window.Icons = Icons;

// ---------- Nav config ----------
const NAV = [
  { id: 'dashboard', label: 'Dashboard', icon: Icons.dashboard },
  { id: 'customers', label: 'Customers', icon: Icons.customers },
  { id: 'pipeline', label: 'Pipeline', icon: Icons.pipeline },
  { id: 'documents', label: 'Documents', icon: Icons.documents },
  { id: 'activity', label: 'Activity Log', icon: Icons.activity },
  { id: 'workflows', label: 'Workflows', icon: Icons.workflows, admin: true },
  { id: 'team', label: 'Team', icon: Icons.team, admin: true },
];

// ---------- Sidebar ----------
function Sidebar({ current, onNav }) {
  const [hover, setHover] = useState_U(false);
  const [settingsHover, setSettingsHover] = useState_U(false);
  return (
    <aside
      className="sidebar"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ width: hover ? 224 : 64 }}
    >
      <div className="sidebar-brand" onClick={() => onNav('dashboard')} style={{cursor:'pointer'}}>
        <img src="uploads/Asset 2.png" alt="TrustKYC" className="sidebar-logo-img" />
        <div className="sidebar-brand-text" style={{ opacity: hover ? 1 : 0 }}>
          <div className="sidebar-brand-name">TrustKYC</div>
          <div className="sidebar-brand-tag">CBAO · Sénégal</div>
        </div>
      </div>

      <div className="sidebar-section">
        {NAV.map((n) => (
          <button
            key={n.id}
            className={'nav-item' + (current === n.id ? ' is-active' : '')}
            onClick={() => onNav(n.id)}
            title={n.label}
          >
            <span className="nav-ico">{n.icon}</span>
            <span className="nav-label" style={{ opacity: hover ? 1 : 0 }}>{n.label}</span>
            {n.admin && hover && <span className="nav-badge">admin</span>}
          </button>
        ))}
      </div>

      <div className="sidebar-spacer" />

      <div className="sidebar-section sidebar-bottom">
        <button
          className={'nav-item' + (current === 'settings' ? ' is-active' : '')}
          onClick={() => onNav('settings')}
          onMouseEnter={() => setSettingsHover(true)}
          onMouseLeave={() => setSettingsHover(false)}
          title="Settings"
        >
          <span className="nav-ico">{Icons.settings}</span>
          <span className="nav-label" style={{ opacity: hover ? 1 : 0 }}>Settings</span>
        </button>

        <div className="sidebar-user">
          <div className="sidebar-user-avatar">FB</div>
          <div className="sidebar-user-text" style={{ opacity: hover ? 1 : 0 }}>
            <div className="sidebar-user-name">Fatou Ba</div>
            <div className="sidebar-user-role">Administrator</div>
          </div>
          <button className="sidebar-user-logout" title="Log out" style={{ opacity: hover ? 1 : 0 }}>
            {Icons.logout}
          </button>
        </div>
      </div>
    </aside>
  );
}
window.Sidebar = Sidebar;

// ---------- Topbar ----------
function Topbar({ title, crumbs = [], right, search = true }) {
  return (
    <header className="topbar">
      <div className="topbar-left">
        <div className="crumbs">
          {crumbs.length > 0 ? crumbs.map((c, i) => (
            <React.Fragment key={i}>
              <span className={i === crumbs.length - 1 ? 'crumb is-current' : 'crumb'}>{c}</span>
              {i < crumbs.length - 1 && <span className="crumb-sep">/</span>}
            </React.Fragment>
          )) : <span className="crumb is-current">{title}</span>}
        </div>
      </div>
      <div className="topbar-center">
        {search && (
          <div className="search">
            <span className="search-ico">{Icons.search}</span>
            <input placeholder="Search customers, documents, IDs…" />
            <kbd>⌘K</kbd>
          </div>
        )}
      </div>
      <div className="topbar-right">
        {right}
        <button className="icon-btn" title="Notifications">
          {Icons.bell}
          <span className="dot" />
        </button>
        <div className="topbar-user">
          <div className="topbar-user-avatar">FB</div>
        </div>
      </div>
    </header>
  );
}
window.Topbar = Topbar;

// ---------- Badges ----------
function Badge({ tone = 'slate', children, dot = false, size = 'sm' }) {
  return <span className={`badge badge-${tone} badge-${size}`}>{dot && <span className="badge-dot" />}{children}</span>;
}
window.Badge = Badge;

function RiskBadge({ risk }) {
  const tone = risk === 'Low' ? 'green' : risk === 'Medium' ? 'amber' : 'red';
  return <Badge tone={tone} dot>{risk} risk</Badge>;
}
window.RiskBadge = RiskBadge;

function TypeBadge({ type }) {
  const map = { Individual: { tone: 'blue', label: 'Basic Individual' }, Business: { tone: 'violet', label: 'Business Account' }, EDD: { tone: 'red', label: 'Enhanced DD' } };
  const m = map[type] || { tone: 'slate', label: type };
  return <Badge tone={m.tone}>{m.label}</Badge>;
}
window.TypeBadge = TypeBadge;

function StatusBadge({ status }) {
  const map = {
    valid: { tone: 'green', label: 'Valid' },
    expiring: { tone: 'amber', label: 'Expiring soon' },
    expired: { tone: 'red', label: 'Expired' },
    missing: { tone: 'red', label: 'Missing' },
  };
  const m = map[status] || { tone: 'slate', label: status };
  return <Badge tone={m.tone} dot>{m.label}</Badge>;
}
window.StatusBadge = StatusBadge;

// ---------- Button ----------
function Button({ variant = 'ghost', size = 'md', children, icon, onClick, disabled, ...rest }) {
  return (
    <button className={`btn btn-${variant} btn-${size}`} onClick={onClick} disabled={disabled} {...rest}>
      {icon && <span className="btn-ico">{icon}</span>}
      {children}
    </button>
  );
}
window.Button = Button;

// ---------- Donut ----------
function Donut({ value, size = 120, stroke = 10, color = '#2563EB', track = 'rgba(148,163,184,.15)', label, sublabel }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const off = c - (value / 100) * c;
  return (
    <div className="donut-wrap" style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={track} strokeWidth={stroke} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
          strokeDasharray={c} strokeDashoffset={off} strokeLinecap="round"
          transform={`rotate(-90 ${size/2} ${size/2})`} style={{ transition: 'stroke-dashoffset .6s' }} />
      </svg>
      <div className="donut-center">
        <div className="donut-value">{label ?? value + '%'}</div>
        {sublabel && <div className="donut-label">{sublabel}</div>}
      </div>
    </div>
  );
}
window.Donut = Donut;

// ---------- Utility ----------
function fmtDate(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}
window.fmtDate = fmtDate;

function relTime(iso) {
  const d = new Date(iso);
  const today = new Date('2026-04-18T10:00');
  const ms = today - d;
  const mins = Math.floor(ms/60000);
  if (mins < 60) return mins + 'm ago';
  const hrs = Math.floor(mins/60);
  if (hrs < 24) return hrs + 'h ago';
  const days = Math.floor(hrs/24);
  if (days < 7) return days + 'd ago';
  return fmtDate(iso);
}
window.relTime = relTime;

function StageBadge({ stageId, workflows }) {
  for (const wf of (workflows || window.TK_DATA.workflows)) {
    const s = wf.stages.find(x => x.id === stageId);
    if (s) return <Badge tone="slate">{s.short}</Badge>;
  }
  return <Badge tone="slate">—</Badge>;
}
window.StageBadge = StageBadge;
