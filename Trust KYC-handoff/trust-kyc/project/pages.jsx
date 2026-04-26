// Documents + Activity + Workflows + Team pages
const { useState: useState_X, useMemo: useMemo_X } = React;

// ---------- Documents Page ----------
function DocumentsPage({ appState, onOpenCustomer }) {
  const { docTypes } = window.TK_DATA;
  const [filterType, setFilterType] = useState_X('All types');
  const [filterStatus, setFilterStatus] = useState_X('All statuses');
  const [query, setQuery] = useState_X('');

  const docs = useMemo_X(() => {
    return appState.documents.filter(d => {
      if (filterType !== 'All types' && d.type !== filterType) return false;
      if (filterStatus !== 'All statuses' && d.status !== filterStatus.toLowerCase().replace(' soon', '')) return false;
      if (query && !d.customer.toLowerCase().includes(query.toLowerCase()) && !d.type.toLowerCase().includes(query.toLowerCase())) return false;
      return true;
    });
  }, [appState.documents, filterType, filterStatus, query]);

  const stats = {
    total: appState.documents.length + 1844,
    expiring30: appState.documents.filter(d => d.status === 'expiring').length + 9,
    expired: appState.documents.filter(d => d.status === 'expired').length + 3,
    missing: 14,
  };

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1 className="page-title">Documents</h1>
          <div className="page-sub">Global archive across all customers · OCR & signature verification enabled</div>
        </div>
        <div className="page-actions">
          <Button variant="ghost" size="sm" icon={Icons.download}>Export CSV</Button>
          <Button variant="primary" size="sm" icon={Icons.upload}>Upload document</Button>
        </div>
      </div>

      <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        <MiniStat label="Total Documents" value={stats.total.toLocaleString()} icon={Icons.documents} tone="info" />
        <MiniStat label="Expiring in 30 days" value={stats.expiring30} icon={Icons.calendar} tone="warn" />
        <MiniStat label="Expired" value={stats.expired} icon={Icons.alert} tone="danger" />
        <MiniStat label="Missing Documents" value={stats.missing} icon={Icons.flag} tone="danger" />
      </div>

      <div className="card card-lg">
        <div className="filter-bar">
          <div className="search" style={{ minWidth: 280, flex: 1 }}>
            <span className="search-ico">{Icons.search}</span>
            <input placeholder="Search customer, document type, or ID…" value={query} onChange={e => setQuery(e.target.value)} />
          </div>
          <Select label="Type" value={filterType} options={['All types', ...docTypes]} onChange={setFilterType} />
          <Select label="Status" value={filterStatus} options={['All statuses', 'Valid', 'Expiring soon', 'Expired', 'Missing']} onChange={setFilterStatus} />
          <Select label="Date range" value="Last 90 days" options={['Last 7 days', 'Last 30 days', 'Last 90 days', 'All time']} onChange={() => {}} />
          <Button variant="ghost" size="sm" icon={Icons.filter}>More filters</Button>
        </div>

        <table className="table">
          <thead>
            <tr>
              <th>Document</th>
              <th>Customer</th>
              <th>Uploaded</th>
              <th>Expires</th>
              <th>Status</th>
              <th>Uploaded by</th>
              <th>Stage</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {docs.map(d => (
              <tr key={d.id} onClick={() => onOpenCustomer(d.customerId)}>
                <td className="t-strong">{d.type}<div className="t-id">{d.id}</div></td>
                <td>{d.customer}<div className="t-id">{d.customerId}</div></td>
                <td className="mono dim">{fmtDate(d.uploaded)}</td>
                <td className="mono dim">{fmtDate(d.expires)}</td>
                <td><StatusBadge status={d.status} /></td>
                <td className="dim">{d.by}</td>
                <td><Badge tone="slate">{d.stage}</Badge></td>
                <td style={{ textAlign: 'right' }}>
                  <button className="icon-btn" style={{ width: 28, height: 28, display: 'inline-flex' }} onClick={(e) => e.stopPropagation()}>{Icons.eye}</button>
                </td>
              </tr>
            ))}
            {docs.length === 0 && <tr><td colSpan={8}><div className="empty-note">No documents match these filters</div></td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function MiniStat({ label, value, icon, tone }) {
  return (
    <div className={`kpi tone-${tone}`}>
      <div className="kpi-top">
        <span className="kpi-label">{label}</span>
        <span className="kpi-ico">{icon}</span>
      </div>
      <div className="kpi-value">{value}</div>
    </div>
  );
}

function Select({ label, value, options, onChange }) {
  const [open, setOpen] = useState_X(false);
  return (
    <div style={{ position: 'relative' }}>
      <button className="select" onClick={() => setOpen(o => !o)}>
        {label && <span className="select-label">{label}:</span>}
        <span>{value}</span>
        <span className="select-chev">{Icons.chevronDown}</span>
      </button>
      {open && (
        <>
          <div style={{ position: 'fixed', inset: 0, zIndex: 20 }} onClick={() => setOpen(false)} />
          <div style={{
            position: 'absolute', top: '100%', left: 0, marginTop: 4, minWidth: 180, zIndex: 21,
            background: 'var(--panel-2)', border: '1px solid var(--border-strong)', borderRadius: 9,
            padding: 4, boxShadow: '0 12px 30px -8px rgba(0,0,0,.5)', maxHeight: 260, overflowY: 'auto'
          }}>
            {options.map(o => (
              <div key={o} onClick={() => { onChange(o); setOpen(false); }}
                style={{ padding: '7px 10px', borderRadius: 6, fontSize: 12.5, cursor: 'pointer', color: o === value ? '#bfdbfe' : 'inherit', background: o === value ? 'rgba(37,99,235,.15)' : 'transparent' }}>
                {o}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

window.DocumentsPage = DocumentsPage;
window.Select = Select;

// ---------- Activity Log ----------
function ActivityLog() {
  const [filterUser, setFilterUser] = useState_X('All users');
  const [filterAction, setFilterAction] = useState_X('All actions');
  const [expanded, setExpanded] = useState_X(null);
  const { activity, team } = window.TK_DATA;

  const items = useMemo_X(() => activity.filter(a => {
    if (filterUser !== 'All users' && a.user !== filterUser) return false;
    if (filterAction !== 'All actions' && a.action !== filterAction) return false;
    return true;
  }), [filterUser, filterAction]);

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1 className="page-title">Activity Log</h1>
          <div className="page-sub">Immutable audit trail · {activity.length * 14} events this month</div>
        </div>
        <div className="page-actions">
          <Button variant="ghost" size="sm" icon={Icons.download}>Export audit trail</Button>
        </div>
      </div>

      <div className="card card-lg">
        <div className="filter-bar">
          <Select label="User" value={filterUser} options={['All users', ...team.map(t => t.name), 'System']} onChange={setFilterUser} />
          <Select label="Action" value={filterAction} options={['All actions', 'Document Upload', 'Stage Transition', 'Approval', 'Rejection', 'Flagged', 'Role Change', 'Report Generation', 'Alert Generated']} onChange={setFilterAction} />
          <Select label="Customer" value="All customers" options={['All customers', ...window.TK_DATA.customers.map(c => c.name)]} onChange={() => {}} />
          <Select label="Date range" value="Last 7 days" options={['Today', 'Last 7 days', 'Last 30 days', 'All time']} onChange={() => {}} />
          <div style={{ marginLeft: 'auto', color: 'var(--text-faint)', fontSize: 12, fontFamily: 'var(--mono)' }}>{items.length} events</div>
        </div>

        <table className="table">
          <thead>
            <tr><th style={{ width: 120 }}>Timestamp</th><th>User</th><th>Action</th><th>Customer</th><th>Details</th><th></th></tr>
          </thead>
          <tbody>
            {items.map((a, i) => (
              <React.Fragment key={i}>
                <tr onClick={() => setExpanded(expanded === i ? null : i)}>
                  <td className="mono dim">{formatTimestamp(a.t)}</td>
                  <td>
                    <div className="t-strong">{a.user}</div>
                    <div className="t-id" style={{ fontFamily: 'var(--ui)' }}>{a.role}</div>
                  </td>
                  <td><ActionBadge action={a.action} /></td>
                  <td>{a.customer}</td>
                  <td className="dim" style={{ maxWidth: 380 }}>{a.detail}</td>
                  <td style={{ textAlign: 'right' }}>
                    <span style={{ color: 'var(--text-faint)', transform: expanded === i ? 'rotate(90deg)' : 'rotate(0)', display: 'inline-block', transition: 'transform .18s' }}>{Icons.chevronRight}</span>
                  </td>
                </tr>
                {expanded === i && (
                  <tr style={{ background: 'rgba(37,99,235,.04)' }}>
                    <td colSpan={6} style={{ padding: '14px 20px' }}>
                      <div className="grid-3" style={{ gap: 20 }}>
                        <div><div className="info-label">Event ID</div><div className="mono" style={{ fontSize: 12, marginTop: 3 }}>EVT-{String(90000 + i)}</div></div>
                        {a.direction && <div><div className="info-label">Direction</div><div style={{ marginTop: 3 }}><Badge tone={a.direction === 'forward' ? 'green' : 'amber'}>{a.direction}</Badge></div></div>}
                        {a.reason && <div><div className="info-label">Reason</div><div style={{ fontSize: 12.5, marginTop: 3 }}>{a.reason}</div></div>}
                        <div><div className="info-label">IP address</div><div className="mono" style={{ fontSize: 12, marginTop: 3 }}>196.207.14.{92 + i}</div></div>
                        <div><div className="info-label">Session</div><div className="mono" style={{ fontSize: 12, marginTop: 3 }}>sess_{Math.random().toString(36).slice(2, 10)}</div></div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ActionBadge({ action }) {
  const map = {
    'Document Upload': 'blue', 'Stage Transition': 'violet', 'Approval': 'green',
    'Rejection': 'red', 'Flagged': 'amber', 'Role Change': 'slate',
    'Report Generation': 'slate', 'Alert Generated': 'red',
  };
  return <Badge tone={map[action] || 'slate'}>{action}</Badge>;
}

function formatTimestamp(t) {
  const d = new Date(t);
  return d.toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }).replace(',', '');
}

window.ActivityLog = ActivityLog;
