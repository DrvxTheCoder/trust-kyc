// Workflows + Team pages
const { useState: useState_W } = React;

// ---------- Workflow Builder ----------
function WorkflowBuilder() {
  const { workflows } = window.TK_DATA;
  const [selected, setSelected] = useState_W('business');
  const [expanded, setExpanded] = useState_W('compliance');
  const wf = workflows.find(w => w.id === selected);

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1 className="page-title">Workflow Builder</h1>
          <div className="page-sub">Design onboarding workflows, required documents, and stage rules</div>
        </div>
        <div className="page-actions">
          <Button variant="secondary" size="sm">Preview</Button>
          <Button variant="primary" size="sm" icon={Icons.check}>Publish changes</Button>
        </div>
      </div>

      <div className="wf-layout">
        <div>
          <div className="card card-lg">
            <div className="card-header">
              <div className="card-title">Workflow templates</div>
              <button className="icon-btn" style={{ width: 28, height: 28 }}>{Icons.plus}</button>
            </div>
            <div className="wf-list">
              {workflows.map(w => (
                <div key={w.id} className={'wf-list-item' + (selected === w.id ? ' is-active' : '')} onClick={() => setSelected(w.id)}>
                  <div className="wf-list-head">
                    <span>{w.name}</span>
                    <Badge tone={w.risk === 'Low' ? 'green' : w.risk === 'Medium' ? 'amber' : 'red'} size="sm" dot>{w.risk}</Badge>
                  </div>
                  <div className="wf-list-sub">{w.stages.length} stages · {w.count} active</div>
                </div>
              ))}
              <button className="btn btn-secondary btn-sm" style={{ marginTop: 8, justifyContent: 'center' }}>{Icons.plus} Create new workflow</button>
            </div>
          </div>
        </div>

        <div className="card card-lg">
          <div className="card-header">
            <div>
              <div className="card-title">{wf.name}</div>
              <div className="card-sub">Drag to reorder stages · click any stage to configure</div>
            </div>
            <div className="row gap-s">
              <Badge tone="blue">{wf.stages.length} stages</Badge>
              <Badge tone="slate">{wf.count} active customers</Badge>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {wf.stages.map((s, i) => {
              const isExp = expanded === s.id;
              const needsSig = ['compliance', 'approved', 'ownership', 'sanctions'].includes(s.id);
              return (
                <React.Fragment key={s.id}>
                  <div className="wf-stage">
                    <div className="wf-stage-head" onClick={() => setExpanded(isExp ? null : s.id)}>
                      <span style={{ color: 'var(--text-faint)', cursor: 'grab', display: 'inline-flex' }}>{Icons.grip}</span>
                      <span className="wf-stage-num">{String(i + 1).padStart(2, '0')}</span>
                      <span className="wf-stage-name">{s.name}</span>
                      {needsSig && <span style={{ color: 'var(--text-faint)' }} title="Requires signature">{Icons.signature}</span>}
                      <Badge tone="slate" size="sm">{['Onboarding Agent', 'Compliance Officer', 'Team Lead'][i % 3]}</Badge>
                      <span style={{ color: 'var(--text-faint)', transform: isExp ? 'rotate(90deg)' : 'rotate(0)', transition: 'transform .18s', display: 'inline-flex' }}>{Icons.chevronRight}</span>
                    </div>
                    {isExp && (
                      <div className="wf-stage-body">
                        <div className="field-row">
                          <div className="field-label">Stage name</div>
                          <input className="field-input" defaultValue={s.name} />
                        </div>
                        <div className="field-row">
                          <div className="field-label">Assigned role</div>
                          <button className="select" style={{ justifyContent: 'space-between' }}>
                            <span>{['Onboarding Agent', 'Compliance Officer', 'Team Lead', 'Senior Auditor'][i % 4]}</span>
                            <span className="select-chev">{Icons.chevronDown}</span>
                          </button>
                        </div>
                        <div className="field-row" style={{ gridColumn: 'span 2' }}>
                          <div className="field-label">Required documents</div>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                            {['Carte Nationale d\u2019Identité', 'RCCM', 'NINEA', 'Justificatif de Domicile'].slice(0, (i % 3) + 2).map(d => (
                              <Badge tone="outline" key={d}>{d} <span style={{ opacity: .5, marginLeft: 4, cursor: 'pointer' }}>×</span></Badge>
                            ))}
                            <Badge tone="blue"><span style={{ cursor: 'pointer' }}>+ Add</span></Badge>
                          </div>
                        </div>
                        <div style={{ gridColumn: 'span 2', display: 'flex', gap: 18, flexWrap: 'wrap', paddingTop: 4 }}>
                          <ToggleField label="Allow forward" on={true} />
                          <ToggleField label="Allow backward" on={i > 0} />
                          <ToggleField label="Allow skip" on={false} />
                          <ToggleField label="Auto-advance" on={i === 1} />
                          <ToggleField label="Requires signature" on={needsSig} />
                        </div>
                      </div>
                    )}
                  </div>
                  {i < wf.stages.length - 1 && (
                    <div className="wf-connector">
                      <div style={{ position: 'relative', height: 28, display: 'flex', alignItems: 'center' }}>
                        <div style={{ width: 1.5, height: 28, background: 'var(--border-strong)' }} />
                        <button className="wf-add-btn" style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}>{Icons.plus}</button>
                      </div>
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function ToggleField({ label, on: initial }) {
  const [on, setOn] = useState_W(initial);
  return (
    <div className={'toggle' + (on ? ' is-on' : '')} onClick={() => setOn(!on)}>
      <div className="toggle-track"><div className="toggle-thumb" /></div>
      <span>{label}</span>
    </div>
  );
}

window.WorkflowBuilder = WorkflowBuilder;

// ---------- Team ----------
function TeamPage() {
  const { team } = window.TK_DATA;
  const [selected, setSelected] = useState_W(team[0]);
  const [tab, setTab] = useState_W('users');

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1 className="page-title">Team & Roles</h1>
          <div className="page-sub">Manage users, roles, permissions, and signature uploads</div>
        </div>
        <div className="page-actions">
          <Button variant="secondary" size="sm">Invite via email</Button>
          <Button variant="primary" size="sm" icon={Icons.plus}>Add user</Button>
        </div>
      </div>

      <div className="tabs" style={{ marginBottom: 16 }}>
        <button className={'tab' + (tab === 'users' ? ' is-active' : '')} onClick={() => setTab('users')}>Users</button>
        <button className={'tab' + (tab === 'roles' ? ' is-active' : '')} onClick={() => setTab('roles')}>Roles & permissions</button>
      </div>

      {tab === 'users' ? (
        <div className="wf-layout">
          <div className="card card-lg" style={{ padding: 0, overflow: 'hidden' }}>
            <table className="table">
              <thead><tr><th>User</th><th>Role</th><th>Category</th><th>Status</th><th>Last active</th></tr></thead>
              <tbody>
                {team.map(u => (
                  <tr key={u.email} onClick={() => setSelected(u)} style={{ background: selected?.email === u.email ? 'rgba(37,99,235,.07)' : undefined }}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{
                          width: 30, height: 30, borderRadius: 8,
                          background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontWeight: 700, fontSize: 11
                        }}>{u.initials}</div>
                        <div>
                          <div className="t-strong">{u.name}</div>
                          <div className="t-id" style={{ fontFamily: 'var(--ui)' }}>{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>{u.role}</td>
                    <td><Badge tone={u.category === 'Operational' ? 'blue' : u.category === 'Compliance & Audit' ? 'violet' : 'green'} size="sm">{u.category}</Badge></td>
                    <td><Badge tone={u.status === 'Active' ? 'green' : 'slate'} size="sm" dot>{u.status}</Badge></td>
                    <td className="mono dim">{u.lastActive}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <UserDetail user={selected} />
        </div>
      ) : (
        <RolesPanel />
      )}
    </div>
  );
}

function UserDetail({ user }) {
  if (!user) return null;
  return (
    <div className="card card-lg" style={{ position: 'sticky', top: 20, alignSelf: 'start' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <div style={{ width: 48, height: 48, borderRadius: 12, background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 16 }}>{user.initials}</div>
        <div>
          <div style={{ fontWeight: 700, fontSize: 15 }}>{user.name}</div>
          <div style={{ fontSize: 12, color: 'var(--text-faint)' }}>{user.email}</div>
        </div>
      </div>

      <div className="field-row"><div className="field-label">Role category</div>
        <button className="select" style={{ justifyContent: 'space-between' }}><span>{user.category}</span><span className="select-chev">{Icons.chevronDown}</span></button>
      </div>
      <div className="field-row" style={{ marginTop: 10 }}>
        <div className="field-label">Role</div>
        <button className="select" style={{ justifyContent: 'space-between' }}><span>{user.role}</span><span className="select-chev">{Icons.chevronDown}</span></button>
      </div>

      <hr className="hr" />

      <div className="field-row">
        <div className="field-label">Digital signature</div>
        <div style={{
          marginTop: 6,
          padding: 14,
          border: '1.5px dashed var(--border-strong)',
          borderRadius: 10,
          textAlign: 'center',
          background: user.hasSig ? 'rgba(255,255,255,.02)' : 'transparent'
        }}>
          {user.hasSig ? (
            <>
              <div style={{ fontFamily: 'Brush Script MT, cursive', fontSize: 28, color: 'var(--text)', fontStyle: 'italic', marginBottom: 4 }}>
                {user.name.split(' ').map(n => n[0]).join('')}. {user.name.split(' ').slice(-1)[0]}
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-faint)' }}>Uploaded 12 Feb 2026</div>
              <Button variant="ghost" size="sm" icon={Icons.upload} style={{ marginTop: 6 }}>Replace</Button>
            </>
          ) : (
            <>
              <div style={{ color: 'var(--text-faint)', fontSize: 12, marginBottom: 8 }}>No signature on file</div>
              <Button variant="secondary" size="sm" icon={Icons.upload}>Upload signature</Button>
            </>
          )}
        </div>
        <div style={{ fontSize: 11, color: 'var(--text-faint)', marginTop: 6, lineHeight: 1.4 }}>
          Signature required for roles with stage-approval permissions. Applied to completion reports at the Account Approved stage.
        </div>
      </div>

      <hr className="hr" />

      <div style={{ display: 'flex', gap: 8 }}>
        <Button variant="secondary" size="sm" style={{ flex: 1 }}>Deactivate</Button>
        <Button variant="primary" size="sm" style={{ flex: 1 }}>Save changes</Button>
      </div>
    </div>
  );
}

function RolesPanel() {
  const categories = [
    {
      name: 'Operational', tone: 'blue',
      roles: [
        { name: 'Onboarding Agent', perms: 8 },
        { name: 'Senior Onboarding Agent', perms: 12 },
        { name: 'Front-Desk Associate', perms: 5 },
      ]
    },
    {
      name: 'Compliance & Audit', tone: 'violet',
      roles: [
        { name: 'Compliance Officer', perms: 14 },
        { name: 'Senior Compliance Officer', perms: 18 },
        { name: 'Internal Auditor', perms: 9 },
      ]
    },
    {
      name: 'Supervisory', tone: 'green',
      roles: [
        { name: 'Team Lead', perms: 16 },
        { name: 'Administrator', perms: 24 },
        { name: 'Branch Manager', perms: 20 },
      ]
    }
  ];
  const [open, setOpen] = useState_W('Compliance Officer');
  const perms = [
    ['Upload documents', true], ['Delete documents', false],
    ['Advance stages (forward)', true], ['Move stages backward', true],
    ['Approve accounts', true], ['Reject accounts', true],
    ['Flag for review', true], ['Override document expiry', false],
    ['View all customers', true], ['Edit customer data', true],
    ['Generate compliance reports', true], ['Access activity log', true],
    ['Manage users', false], ['Configure workflows', false],
  ];
  return (
    <div className="grid-3">
      {categories.map(cat => (
        <div key={cat.name} className="card card-lg">
          <div className="card-header">
            <div className="card-title">{cat.name}</div>
            <Badge tone={cat.tone} size="sm">{cat.roles.length}</Badge>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {cat.roles.map(r => (
              <div key={r.name}>
                <div
                  onClick={() => setOpen(open === r.name ? null : r.name)}
                  style={{ padding: '10px 12px', border: '1px solid var(--border)', borderRadius: 9, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: open === r.name ? 'rgba(37,99,235,.07)' : 'rgba(255,255,255,.01)' }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 13 }}>{r.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-faint)', marginTop: 2 }}>{r.perms} permissions</div>
                  </div>
                  <span style={{ color: 'var(--text-faint)', transform: open === r.name ? 'rotate(90deg)' : 'rotate(0)', transition: 'transform .18s', display: 'inline-flex' }}>{Icons.chevronRight}</span>
                </div>
                {open === r.name && (
                  <div style={{ padding: 12, marginTop: 4, border: '1px solid var(--border)', borderRadius: 9, background: 'rgba(0,0,0,.2)' }}>
                    {perms.slice(0, Math.min(r.perms, perms.length)).map(([p, on], i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 0', fontSize: 12.5 }}>
                        <span style={{ width: 14, height: 14, borderRadius: 3, background: on ? 'var(--blue)' : 'transparent', border: '1.5px solid ' + (on ? 'var(--blue)' : 'var(--border-strong)'), display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          {on && <span style={{ fontSize: 10, color: 'white' }}>✓</span>}
                        </span>
                        <span style={{ color: on ? 'var(--text)' : 'var(--text-dim)' }}>{p}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <button className="btn btn-ghost btn-sm" style={{ justifyContent: 'center', marginTop: 4 }}>{Icons.plus} Create role</button>
          </div>
        </div>
      ))}
    </div>
  );
}

window.TeamPage = TeamPage;
