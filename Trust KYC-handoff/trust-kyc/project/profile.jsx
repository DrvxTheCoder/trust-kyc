// Customer Profile page
const { useState: useState_P } = React;

function CustomerProfile({ customer, appState, onBack, onMoveStage }) {
  if (!customer) return null;
  const { workflows } = window.TK_DATA;
  const wf = workflows.find(w => {
    if (customer.type === 'Business') return w.id === 'business';
    if (customer.type === 'EDD') return w.id === 'edd';
    return w.id === 'basic';
  });
  const stages = wf.stages;
  const currentIdx = stages.findIndex(s => s.id === customer.stage);

  const docs = appState.documents.filter(d => d.customerId === customer.id);
  const feed = window.TK_DATA.activity.filter(a => a.customer === customer.name);

  const completedValidators = ['Khady Ndoye', 'Moussa Kane', 'Awa Diagne', 'Ibrahima Cissé'];

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <div className="crumbs" style={{ marginBottom: 8 }}>
            <a className="crumb" onClick={onBack} style={{ cursor: 'pointer' }}>Customers</a>
            <span className="crumb-sep">/</span>
            <span className="crumb is-current">{customer.name}</span>
          </div>
        </div>
        <div className="page-actions">
          <Button variant="ghost" size="sm" onClick={onBack}>← Back to pipeline</Button>
        </div>
      </div>

      <div className="profile-hero">
        <div className="profile-avatar">{customer.initials}</div>
        <div className="profile-hero-body">
          <div className="row between">
            <div>
              <h1 className="profile-name">{customer.name}</h1>
              <div className="profile-id">{customer.id} · Created {fmtDate(customer.created)}</div>
            </div>
            <div className="profile-actions">
              <Button variant="secondary" size="sm" icon={Icons.upload}>Upload document</Button>
              <Button variant="secondary" size="sm" icon={Icons.flag}>Flag for review</Button>
              <Button variant="primary" size="sm" icon={Icons.arrowRight}>Advance stage</Button>
            </div>
          </div>
          <div className="profile-badges">
            <TypeBadge type={customer.type} />
            <RiskBadge risk={customer.risk} />
            <Badge tone="blue" dot>In {stages[currentIdx]?.name}</Badge>
            <Badge tone="slate">{customer.daysInStage}d in stage</Badge>
            {customer.stuck && <Badge tone="red" dot>Stuck — needs attention</Badge>}
            <Badge tone="outline">{customer.docs}/{customer.docsTotal} docs</Badge>
          </div>
        </div>
      </div>

      <div className="profile-grid">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div className="card card-lg">
            <div className="card-header">
              <div className="card-title">Customer information</div>
              <Button variant="ghost" size="sm">Edit</Button>
            </div>
            <div className="info-grid">
              <InfoRow label="First name" value={customer.name.split(' ')[0]} />
              <InfoRow label="Last name" value={customer.name.split(' ').slice(1).join(' ')} />
              <InfoRow label="Date of birth" value={fmtDate(customer.dob)} />
              <InfoRow label="Nationality" value={customer.nationality} />
              <InfoRow label="Phone" value={customer.phone} mono />
              <InfoRow label="Email" value={customer.email} />
              <InfoRow label="Address" value={customer.address} />
              <InfoRow label="Account type" value={customer.type === 'Business' ? 'Business Account (SARL)' : customer.type === 'EDD' ? 'Enhanced Due Diligence' : 'Basic Individual'} />
              {customer.company && <InfoRow label="Legal entity" value={customer.company} />}
              <InfoRow label="Created at" value={fmtDate(customer.created)} mono />
            </div>
          </div>

          <div className="card card-lg">
            <div className="card-header">
              <div>
                <div className="card-title">Document archive</div>
                <div className="card-sub">{docs.length} uploaded · {customer.docsTotal - customer.docs} missing</div>
              </div>
              <Button variant="secondary" size="sm" icon={Icons.upload}>Upload</Button>
            </div>

            {customer.docsTotal - customer.docs > 0 && (
              <div style={{ padding: 10, marginBottom: 10, borderRadius: 9, background: 'rgba(245,158,11,.08)', border: '1px solid rgba(245,158,11,.25)', fontSize: 12.5, color: '#fbbf24', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ flexShrink: 0 }}>{Icons.alert}</span>
                <span><strong>{customer.docsTotal - customer.docs} required document{customer.docsTotal - customer.docs > 1 ? 's' : ''} missing</strong> — {customer.type === 'Business' ? 'Procès-Verbal d\u2019AG' : 'Justificatif de Domicile'} required before the next stage transition.</span>
              </div>
            )}

            <table className="table">
              <thead><tr><th>Document</th><th>Uploaded</th><th>Expires</th><th>Status</th><th>Uploaded by</th><th></th></tr></thead>
              <tbody>
                {docs.map(d => (
                  <tr key={d.id}>
                    <td className="t-strong">{d.type}<div className="t-id">{d.id}</div></td>
                    <td className="mono dim">{fmtDate(d.uploaded)}</td>
                    <td className="mono dim">{fmtDate(d.expires)}</td>
                    <td><StatusBadge status={d.status} /></td>
                    <td className="dim">{d.by}</td>
                    <td style={{ textAlign: 'right' }}>
                      <button className="icon-btn" style={{ width: 28, height: 28 }}>{Icons.eye}</button>
                    </td>
                  </tr>
                ))}
                {docs.length === 0 && (
                  <tr><td colSpan={6}><div className="empty-note">No documents uploaded yet</div></td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div className="card card-lg">
            <div className="card-header">
              <div>
                <div className="card-title">Workflow progress</div>
                <div className="card-sub">{wf.name} · {currentIdx + 1} of {stages.length}</div>
              </div>
              <Badge tone="blue">{Math.round(((currentIdx) / (stages.length - 1)) * 100)}%</Badge>
            </div>
            <div className="stepper">
              {stages.map((s, i) => {
                const done = i < currentIdx;
                const current = i === currentIdx;
                const needsSig = ['compliance', 'approved', 'ownership'].includes(s.id);
                return (
                  <div key={s.id} className={'step' + (done ? ' done' : current ? ' current' : '')}>
                    {i < stages.length - 1 && <div className="step-line" />}
                    <div className="step-dot">{done ? '✓' : i + 1}</div>
                    <div className="step-body">
                      <div className="step-title-row">
                        <div className="step-title">{s.name}</div>
                        {needsSig && <span className="step-sig" title="Requires signature">{Icons.signature}</span>}
                      </div>
                      <div className="step-meta">
                        {done && <>Validated by <strong>{completedValidators[i % completedValidators.length]}</strong> · {fmtDate(window.TK_DATA.daysAgo(15 - i * 2))}</>}
                        {current && <>In progress · Started {window.TK_DATA.daysAgo(customer.daysInStage)} ({customer.daysInStage}d ago)</>}
                        {!done && !current && <>Pending</>}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <hr className="hr" />
            <div className="row between">
              <Button variant="secondary" size="sm">← Move back</Button>
              <Button variant="primary" size="sm" icon={Icons.arrowRight}>Advance to {stages[currentIdx + 1]?.short || 'Complete'}</Button>
            </div>
          </div>

          <div className="card card-lg">
            <div className="card-header">
              <div className="card-title">Activity timeline</div>
              <Button variant="ghost" size="sm">Full log</Button>
            </div>
            <div className="feed">
              {feed.length === 0 && (
                <>
                  <FeedItem icon={Icons.upload} user="Khady Ndoye" role="Compliance Officer" detail={'Uploaded ' + (docs[0]?.type || 'document')} time="2h ago" />
                  <FeedItem icon={Icons.arrowRight} user="Awa Diagne" role="Senior Onboarding Agent" detail={`Moved from ${stages[Math.max(0, currentIdx-1)]?.name || '—'} → ${stages[currentIdx]?.name}`} time="Yesterday" />
                  <FeedItem icon={Icons.check} user="Ibrahima Cissé" role="Team Lead" detail="Approved business documents" time="2d ago" />
                  <FeedItem icon={Icons.user} user="System" role="Automation" detail={`Account created · Assigned ${wf.name} workflow`} time={fmtDate(customer.created)} />
                </>
              )}
              {feed.map((a, i) => (
                <FeedItem key={i} icon={iconFor(a.action)} user={a.user} role={a.role} detail={a.detail} time={relTime(a.t)} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function iconFor(action) {
  if (action.includes('Upload')) return Icons.upload;
  if (action.includes('Transition')) return Icons.arrowRight;
  if (action.includes('Approv')) return Icons.check;
  if (action.includes('Reject')) return Icons.x;
  if (action.includes('Flag')) return Icons.flag;
  if (action.includes('Alert')) return Icons.alert;
  return Icons.activity;
}

function InfoRow({ label, value, mono }) {
  return (
    <div className="info-row">
      <div className="info-label">{label}</div>
      <div className={'info-value ' + (mono ? 'mono' : '')}>{value}</div>
    </div>
  );
}

function FeedItem({ icon, user, role, detail, time }) {
  return (
    <div className="feed-item">
      <div className="feed-ico">{icon}</div>
      <div className="feed-body">
        <div className="feed-head">
          <span className="feed-user">{user}</span>
          <span className="feed-role">· {role}</span>
          <span className="feed-time">{time}</span>
        </div>
        <div className="feed-detail">{detail}</div>
      </div>
    </div>
  );
}

window.CustomerProfile = CustomerProfile;
