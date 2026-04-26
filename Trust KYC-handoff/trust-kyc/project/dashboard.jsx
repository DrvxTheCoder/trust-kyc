// Dashboard page — OAK-inspired layout
const { useState: useState_D, useMemo: useMemo_D } = React;

/* ---- Sparkline ---- */
function Sparkline({ points, color = '#3B82F6', w = 80, h = 28 }) {
  const min = Math.min(...points), max = Math.max(...points);
  const range = max - min || 1;
  const step = w / (points.length - 1);
  const coords = points.map((v, i) => [i * step, h - ((v - min) / range) * (h - 4) - 2]);
  const d = 'M' + coords.map(c => c.map(n => n.toFixed(1)).join(',')).join(' L');
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ color, display: 'block' }}>
      <path className="spark-line" d={d} />
    </svg>
  );
}

/* ---- Hero KPI chips ---- */
function HeroKPI({ icon, label, value, trend, spark }) {
  return (
    <div className="hero-kpi">
      <div className="hero-kpi-ico">{icon}</div>
      <div className="hero-kpi-body">
        <div className="hero-kpi-label">{label}</div>
        <div className="hero-kpi-value">{value}</div>
        <div className="hero-kpi-trend">{trend}</div>
      </div>
      {spark && (
        <div style={{ marginLeft: 'auto', opacity: .8 }}>
          <Sparkline points={spark} color="rgba(255,255,255,.8)" w={64} h={30} />
        </div>
      )}
    </div>
  );
}

/* ---- Monthly throughput bar chart ---- */
function ThroughputChart() {
  const data = [
    { m: 'Oct', v: 41 }, { m: 'Nov', v: 55 }, { m: 'Dec', v: 38 },
    { m: 'Jan', v: 62 }, { m: 'Feb', v: 70 }, { m: 'Mar', v: 85 },
    { m: 'Apr', v: 48 },
  ];
  const max = Math.max(...data.map(d => d.v));
  const [hovered, setHovered] = useState_D(null);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
        <div className="tabs" style={{ padding: 2 }}>
          <button className="tab is-active" style={{ padding: '4px 10px', fontSize: 11 }}>Monthly</button>
          <button className="tab" style={{ padding: '4px 10px', fontSize: 11 }}>Weekly</button>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 150, padding: '8px 0 0' }}>
        {data.map((x, i) => {
          const isHov = hovered === i;
          const isCurrent = i === data.length - 1;
          return (
            <div key={i}
              style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, cursor: 'default' }}
              onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}
            >
              {isHov && (
                <div style={{ background: 'var(--panel-2)', border: '1px solid var(--border-strong)', borderRadius: 8, padding: '4px 10px', fontSize: 12, fontFamily: 'var(--mono)', fontWeight: 700, whiteSpace: 'nowrap', boxShadow: 'var(--shadow-sm)', pointerEvents: 'none', marginBottom: 2 }}>
                  {x.v} accounts
                </div>
              )}
              <div style={{
                width: '100%', height: (x.v / max) * 120 + 'px',
                background: isCurrent ? 'linear-gradient(180deg, #60a5fa, #2563EB)' :
                  isHov ? 'rgba(59,130,246,.5)' : 'rgba(59,130,246,.22)',
                borderRadius: '7px 7px 3px 3px',
                transition: 'all .2s',
                boxShadow: isCurrent ? '0 4px 16px -4px rgba(37,99,235,.4)' : 'none',
              }} />
              <div className="chart-x-label">{x.m}</div>
            </div>
          );
        })}
      </div>
      <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-faint)' }}>
        <span>Oct 2025 — Apr 2026</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontFamily: 'var(--mono)', fontWeight: 700 }}>
          <span style={{ color: '#34d399' }}>↑ 16.8%</span> avg growth
        </span>
      </div>
    </div>
  );
}

/* ---- Completion donut ---- */
function CompletionPanel() {
  const value = 62;
  const size = 148, stroke = 13;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const off = c - (value / 100) * c;
  const breakdown = [
    { label: 'Approved on time', pct: 62, color: '#10B981' },
    { label: 'Approved (delayed)', pct: 18, color: '#F59E0B' },
    { label: 'In progress', pct: 14, color: '#3B82F6' },
    { label: 'Stuck / escalated', pct: 6, color: '#EF4444' },
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
        <div className="donut-wrap" style={{ width: size, height: size, flexShrink: 0 }}>
          <svg width={size} height={size}>
            <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(148,163,184,.1)" strokeWidth={stroke} />
            {/* segments */}
            <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#10B981" strokeWidth={stroke}
              strokeDasharray={c} strokeDashoffset={c - (62/100)*c} strokeLinecap="round"
              transform={`rotate(-90 ${size/2} ${size/2})`} style={{ transition: 'stroke-dashoffset .6s' }} />
            <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#F59E0B" strokeWidth={stroke}
              strokeDasharray={c} strokeDashoffset={c - (18/100)*c} strokeLinecap="butt" opacity={.7}
              transform={`rotate(${-90 + 62*3.6} ${size/2} ${size/2})`} style={{ transition: 'stroke-dashoffset .6s .1s' }} />
            <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#3B82F6" strokeWidth={stroke}
              strokeDasharray={c} strokeDashoffset={c - (14/100)*c} strokeLinecap="butt" opacity={.7}
              transform={`rotate(${-90 + 80*3.6} ${size/2} ${size/2})`} style={{ transition: 'stroke-dashoffset .6s .2s' }} />
          </svg>
          <div className="donut-center">
            <div className="donut-value">62%</div>
            <div className="donut-label">on time</div>
          </div>
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {breakdown.map((b, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 600 }}>
                <span style={{ color: 'var(--text-dim)' }}>{b.label}</span>
                <span style={{ fontFamily: 'var(--mono)', color: b.color, fontWeight: 700 }}>{b.pct}%</span>
              </div>
              <div style={{ height: 4, borderRadius: 999, background: 'rgba(148,163,184,.1)', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: b.pct + '%', background: b.color, borderRadius: 'inherit', opacity: .85 }} />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ padding: '10px 14px', background: 'rgba(16,185,129,.08)', border: '1px solid rgba(16,185,129,.18)', borderRadius: 11, fontSize: 12.5, display: 'flex', alignItems: 'center', gap: 8, color: '#34d399' }}>
        <span>↑</span>
        <span><strong>+4.1%</strong> completion rate vs last month</span>
      </div>
    </div>
  );
}

/* ---- Alerts list ---- */
function AlertsList({ onNav }) {
  const items = [
    { tone: 'red', title: 'Passeport expired — Ousmane Ndiaye', sub: 'Enhanced Due Diligence · 9 days stuck', time: '14m ago' },
    { tone: 'red', title: 'NINEA expired — Awa Gueye', sub: 'Stuck in Compliance Review · 8 days', time: '2h ago' },
    { tone: 'amber', title: 'NINEA expires in 22 days — A. Fall', sub: 'Business Account · Compliance', time: '6h ago' },
    { tone: 'amber', title: 'Attestation BE expires 12 days — O. Ndiaye', sub: 'EDD · Beneficial Ownership', time: '1d ago' },
    { tone: 'amber', title: 'Justificatif expires 8d — Awa Gueye', sub: 'Business Account · KYC stage', time: '1d ago' },
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {items.map((a, i) => (
        <div key={i} className="alert-row">
          <div className={'alert-ico ' + a.tone}>{a.tone === 'red' ? Icons.alert : Icons.calendar}</div>
          <div className="alert-body">
            <div className="alert-title">{a.title}</div>
            <div className="alert-sub">{a.sub}</div>
          </div>
          <span className="alert-time">{a.time}</span>
        </div>
      ))}
      <button className="btn btn-ghost btn-sm" style={{ justifyContent: 'center', marginTop: 4 }} onClick={() => onNav && onNav('activity')}>
        View all activity →
      </button>
    </div>
  );
}

/* ---- Top agents leaderboard ---- */
function TopAgents() {
  const agents = [
    { initials: 'KN', name: 'Khady Ndoye', role: 'Compliance Officer', count: 24 },
    { initials: 'AD', name: 'Awa Diagne', role: 'Sr. Onboarding Agent', count: 19 },
    { initials: 'MK', name: 'Moussa Kane', role: 'Compliance Officer', count: 17 },
    { initials: 'NT', name: 'Ndeye Thiaw', role: 'Onboarding Agent', count: 14 },
    { initials: 'MS', name: 'Mamadou Sy', role: 'Onboarding Agent', count: 11 },
  ];
  const max = agents[0].count;
  return (
    <div>
      {agents.map((a, i) => (
        <div key={i} className="leader-row">
          <div className="leader-rank" style={{ color: i === 0 ? '#f59e0b' : i === 1 ? '#94a3b8' : i === 2 ? '#cd7c2f' : 'var(--text-faint)' }}>
            {i < 3 ? ['🥇','🥈','🥉'][i] : i + 1}
          </div>
          <div className="leader-avatar" style={{ background: ['linear-gradient(135deg,#f59e0b,#ef4444)', 'linear-gradient(135deg,#3B82F6,#8B5CF6)', 'linear-gradient(135deg,#10B981,#3B82F6)', 'linear-gradient(135deg,#8B5CF6,#ec4899)', 'linear-gradient(135deg,#0D9488,#3B82F6)'][i] }}>{a.initials}</div>
          <div className="leader-body">
            <div className="leader-name">{a.name}</div>
            <div className="leader-role">{a.role}</div>
          </div>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 10, maxWidth: 100 }}>
            <div style={{ flex: 1, height: 5, background: 'rgba(148,163,184,.1)', borderRadius: 999, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: (a.count / max * 100) + '%', background: 'var(--blue)', borderRadius: 'inherit', opacity: .8 }} />
            </div>
          </div>
          <div className="leader-count" style={{ color: 'var(--text)' }}>{a.count}</div>
        </div>
      ))}
    </div>
  );
}

/* ---- Document health ---- */
function DocHealth() {
  const types = [
    { label: "Carte Nationale d'Identité", valid: 28, expiring: 3, expired: 1 },
    { label: 'RCCM (Registre du Commerce)', valid: 14, expiring: 2, expired: 0 },
    { label: 'NINEA', valid: 11, expiring: 4, expired: 2 },
    { label: 'Statuts de la Société', valid: 9, expiring: 0, expired: 0 },
    { label: 'Attestation Bénéficiaires', valid: 7, expiring: 3, expired: 1 },
    { label: 'Relevé Bancaire', valid: 6, expiring: 1, expired: 0 },
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {types.map((t, i) => {
        const total = t.valid + t.expiring + t.expired;
        return (
          <div key={i} className="doc-health-row">
            <div className="doc-health-label">{t.label}</div>
            <div className="doc-health-bar">
              <div style={{ display: 'flex', height: '100%' }}>
                <div style={{ width: (t.valid/total*100)+'%', background: '#10B981', borderRadius: '999px 0 0 999px' }} />
                <div style={{ width: (t.expiring/total*100)+'%', background: '#F59E0B' }} />
                <div style={{ width: (t.expired/total*100)+'%', background: '#EF4444', borderRadius: '0 999px 999px 0' }} />
              </div>
            </div>
            <div className="doc-health-val mono">{total}</div>
          </div>
        );
      })}
      <div style={{ display: 'flex', gap: 14, marginTop: 10, fontSize: 11 }}>
        {[['Valid', '#10B981'], ['Expiring', '#F59E0B'], ['Expired', '#EF4444']].map(([l, c]) => (
          <span key={l} style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'var(--text-faint)', fontWeight: 600 }}>
            <span style={{ width: 8, height: 8, borderRadius: 2, background: c, display: 'inline-block' }} />{l}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ---- SLA countdown card ---- */
function SLACard() {
  const daysLeft = 6;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, height: '100%' }}>
      <div style={{
        background: 'linear-gradient(135deg, rgba(239,68,68,.12), rgba(245,158,11,.08))',
        border: '1px solid rgba(239,68,68,.22)', borderRadius: 14,
        padding: '18px 20px', flex: 1
      }}>
        <div style={{ fontSize: 36, fontWeight: 900, fontFamily: 'var(--mono)', color: '#f87171', letterSpacing: '-0.04em', lineHeight: 1 }}>{daysLeft}</div>
        <div style={{ fontSize: 12.5, color: 'var(--text-dim)', marginTop: 4, fontWeight: 700 }}>days left</div>
        <div style={{ fontSize: 12, color: 'var(--text-faint)', marginTop: 10, lineHeight: 1.5 }}>
          BCEAO quarterly KYC review deadline. <strong style={{ color: 'var(--text-dim)' }}>12 accounts</strong> need urgent completion.
        </div>
        <button className="btn btn-sm" style={{ marginTop: 14, background: 'rgba(239,68,68,.15)', color: '#f87171', border: '1px solid rgba(239,68,68,.25)', borderRadius: 8, fontWeight: 700 }}>
          View at-risk accounts →
        </button>
      </div>
      <div style={{ background: 'rgba(37,99,235,.08)', border: '1px solid rgba(37,99,235,.18)', borderRadius: 14, padding: '14px 16px', fontSize: 12.5 }}>
        <div style={{ fontWeight: 700, marginBottom: 4, color: 'var(--blue-2)' }}>This week's target</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ flex: 1, height: 7, background: 'rgba(148,163,184,.12)', borderRadius: 999, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: '68%', background: 'linear-gradient(90deg, #2563EB, #60a5fa)', borderRadius: 999 }} />
          </div>
          <span style={{ fontFamily: 'var(--mono)', fontWeight: 700, fontSize: 13 }}>17 / 25</span>
        </div>
        <div style={{ color: 'var(--text-faint)', marginTop: 5, fontSize: 11.5 }}>Accounts processed this week</div>
      </div>
    </div>
  );
}

/* ---- Main Dashboard ---- */
function Dashboard({ appState, setAppState, onOpen, onNav }) {
  const { customers, workflows, activity } = window.TK_DATA;

  const totals = useMemo_D(() => {
    const all = appState.customers;
    return {
      total: 1847,
      onboarding: all.filter(c => c.stage !== 'approved').length + 126,
      expiring: appState.documents.filter(d => d.status === 'expiring').length + 9,
      stuck: all.filter(c => c.stuck).length,
      approved30: 47,
    };
  }, [appState]);

  return (
    <div className="page">
      {/* ---- Hero Banner ---- */}
      <div className="hero-banner">
        <div className="hero-mesh" />
        <div className="hero-noise" />
        <div className="hero-content">
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <div>
              <div className="hero-title">Operations Dashboard</div>
              <div className="hero-sub">CBAO Groupe Attijariwafa Bank · Dakar HQ · Friday, 25 April 2026</div>
            </div>
            <div className="hero-actions">
              <button className="hero-btn hero-btn-primary" onClick={() => onNav('activity')}>{Icons.activity} Activity log</button>
              <button className="hero-btn hero-btn-white">{Icons.plus} New customer</button>
            </div>
          </div>
          <div className="hero-kpis">
            <HeroKPI icon={Icons.customers} label="Total customers" value="1,847"
              trend="↑ 4.2% this month" spark={[12,14,13,15,17,16,18,20,19,22,24,26,28]} />
            <HeroKPI icon={Icons.pipeline} label="In onboarding" value={totals.onboarding}
              trend="+12 this week" spark={[20,22,24,23,25,27,28,30,29,32,34,36,38]} />
            <HeroKPI icon={Icons.check} label="Approved this month" value={totals.approved30}
              trend="↑ 8% vs last month" spark={[30,34,32,38,40,42,38,44,46,45,47,47,47]} />
            <HeroKPI icon={Icons.alert} label="Alerts requiring action" value={totals.stuck + totals.expiring}
              trend={totals.stuck + ' stuck · ' + totals.expiring + ' expiring'} spark={[6,7,8,8,9,10,11,10,12,13,14,15,16]} />
          </div>
        </div>
      </div>

      {/* ---- Body ---- */}
      <div className="dash-body">
        {/* Row 1: Completion | Throughput | Alerts */}
        <div className="dash-row dash-row-3">
          <div className="card card-lg">
            <div className="card-header">
              <div>
                <div className="card-title">Completion Rate</div>
                <div className="card-sub">SLA performance breakdown</div>
              </div>
              <Badge tone="green" dot>Healthy</Badge>
            </div>
            <CompletionPanel />
          </div>

          <div className="card card-lg">
            <div className="card-header">
              <div>
                <div className="card-title">Monthly Throughput</div>
                <div className="card-sub">Accounts fully onboarded</div>
              </div>
              <span style={{ fontFamily: 'var(--mono)', fontWeight: 700, fontSize: 28, letterSpacing: '-0.03em', color: 'var(--blue-2)' }}>399</span>
            </div>
            <ThroughputChart />
          </div>

          <div className="card card-lg">
            <div className="card-header">
              <div>
                <div className="card-title">Alerts Requiring Action</div>
                <div className="card-sub">Documents & stuck accounts</div>
              </div>
              <Badge tone="red" dot>8 open</Badge>
            </div>
            <AlertsList onNav={onNav} />
          </div>
        </div>

        {/* Row 2: SLA countdown | Top agents | Doc health */}
        <div className="dash-row" style={{ gridTemplateColumns: '1fr 1.3fr 1.3fr', gap: 16 }}>
          <div className="card card-lg" style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="card-header">
              <div>
                <div className="card-title">BCEAO Deadline</div>
                <div className="card-sub">Quarterly compliance review</div>
              </div>
            </div>
            <SLACard />
          </div>

          <div className="card card-lg">
            <div className="card-header">
              <div>
                <div className="card-title">Top Agents</div>
                <div className="card-sub">Accounts processed · April</div>
              </div>
              <div className="tabs" style={{ padding: 2 }}>
                <button className="tab is-active" style={{ padding: '4px 9px', fontSize: 11 }}>This month</button>
                <button className="tab" style={{ padding: '4px 9px', fontSize: 11 }}>All time</button>
              </div>
            </div>
            <TopAgents />
          </div>

          <div className="card card-lg">
            <div className="card-header">
              <div>
                <div className="card-title">Document Health</div>
                <div className="card-sub">By document type</div>
              </div>
              <Button variant="ghost" size="sm" onClick={() => onNav('documents')}>View all →</Button>
            </div>
            <DocHealth />
          </div>
        </div>
      </div>
    </div>
  );
}

window.Dashboard = Dashboard;

/* ---- Pipeline page ---- */
function KanbanCard({ c, onOpen, onDragStart, onDragEnd, dragging }) {
  const pct = (c.docs / c.docsTotal) * 100;
  return (
    <div className={'k-card' + (c.stuck ? ' stuck' : '') + (dragging ? ' dragging' : '')}
      draggable onDragStart={(e) => onDragStart(e, c.id)} onDragEnd={onDragEnd} onClick={() => onOpen(c)}>
      <div className="k-card-top">
        <div>
          <div className="k-card-name">{c.name}</div>
          <div className="k-card-id">{c.id} · {c.company || 'Individual'}</div>
        </div>
        <RiskBadge risk={c.risk} />
      </div>
      <TypeBadge type={c.type} />
      <div className="k-card-meta">
        <div className="k-card-docs">
          <span>{c.docs}/{c.docsTotal}</span>
          <div className="k-card-docbar"><div className="k-card-docbar-fill" style={{ width: pct + '%', background: pct === 100 ? '#10B981' : pct < 40 ? '#EF4444' : '#F59E0B' }} /></div>
        </div>
        <span className="k-card-days">{c.stuck && '⚠ '}{c.daysInStage}d</span>
      </div>
    </div>
  );
}

function Kanban({ customers, workflow, onOpen, onMove }) {
  const [dragId, setDragId] = useState_D(null);
  const [overCol, setOverCol] = useState_D(null);
  const handleDragStart = (e, id) => { setDragId(id); e.dataTransfer.effectAllowed = 'move'; };
  const handleDragEnd = () => { setDragId(null); setOverCol(null); };
  const handleDragOver = (e, stageId) => { e.preventDefault(); setOverCol(stageId); };
  const handleDrop = (e, stageId) => { e.preventDefault(); if (dragId) onMove(dragId, stageId); setDragId(null); setOverCol(null); };
  const colors = ['#64748B', '#3B82F6', '#8B5CF6', '#F59E0B', '#2563EB', '#10B981', '#0ea5e9', '#ec4899'];
  return (
    <div className="pipeline">
      {workflow.stages.map((s, i) => {
        const list = customers.filter(c => c.stage === s.id);
        return (
          <div key={s.id} className={'kanban-col' + (overCol === s.id ? ' drag-over' : '')}
            onDragOver={(e) => handleDragOver(e, s.id)} onDrop={(e) => handleDrop(e, s.id)}>
            <div className="kanban-head">
              <div className="kanban-head-left">
                <span className="kanban-head-dot" style={{ background: colors[i % colors.length] }} />
                {s.name}
              </div>
              <span className="kanban-count">{list.length}</span>
            </div>
            <div className="kanban-body">
              {list.map(c => <KanbanCard key={c.id} c={c} onOpen={onOpen} onDragStart={handleDragStart} onDragEnd={handleDragEnd} dragging={dragId === c.id} />)}
              {list.length === 0 && <div className="empty-note" style={{ padding: '20px 8px', fontSize: 12 }}>Empty</div>}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function PipelinePage({ appState, setAppState, onOpen }) {
  const { workflows } = window.TK_DATA;
  const [wfId, setWfId] = useState_D('business');
  const [view, setView] = useState_D('kanban');

  const wf = workflows.find(w => w.id === wfId);
  const visible = useMemo_D(() => {
    if (wfId === 'business') return appState.customers.filter(c => c.type === 'Business');
    if (wfId === 'basic') return appState.customers.filter(c => c.type === 'Individual');
    return appState.customers.filter(c => c.type === 'EDD');
  }, [wfId, appState.customers]);

  const moveCustomer = (id, stageId) => {
    setAppState(s => ({ ...s, customers: s.customers.map(c => c.id === id ? { ...c, stage: stageId, daysInStage: 0, stuck: false } : c) }));
  };

  return (
    <div className="page">
      <div className="page-inner">
        <div className="page-head">
          <div>
            <h1 className="page-title">Onboarding Pipeline</h1>
            <div className="page-sub">Drag cards to move customers between stages</div>
          </div>
          <div className="page-actions">
            <div className="tabs">
              {workflows.map(w => (
                <button key={w.id} className={'tab' + (wfId === w.id ? ' is-active' : '')} onClick={() => setWfId(w.id)}>
                  {w.name}
                </button>
              ))}
            </div>
            <div className="view-toggle">
              <button className={view === 'kanban' ? 'is-active' : ''} onClick={() => setView('kanban')}>{Icons.columns} Board</button>
              <button className={view === 'list' ? 'is-active' : ''} onClick={() => setView('list')}>{Icons.list} List</button>
            </div>
          </div>
        </div>
        {view === 'kanban' ? (
          <Kanban customers={visible} workflow={wf} onOpen={onOpen} onMove={moveCustomer} />
        ) : (
          <PipelineTable customers={visible} workflow={wf} onOpen={onOpen} />
        )}
      </div>
    </div>
  );
}

function PipelineTable({ customers, workflow, onOpen }) {
  return (
    <table className="table">
      <thead><tr><th>Customer</th><th>Account Type</th><th>Stage</th><th>Docs</th><th>Days in stage</th><th>Risk</th></tr></thead>
      <tbody>
        {customers.map(c => {
          const stage = workflow.stages.find(s => s.id === c.stage);
          return (
            <tr key={c.id} onClick={() => onOpen(c)}>
              <td className="t-strong">{c.name}<div className="t-id">{c.id}</div></td>
              <td><TypeBadge type={c.type} /></td>
              <td><Badge tone="slate">{stage?.name || '—'}</Badge></td>
              <td className="mono">{c.docs}/{c.docsTotal}</td>
              <td className={'mono ' + (c.stuck ? 'faint' : 'dim')}>{c.daysInStage}d{c.stuck && ' ⚠'}</td>
              <td><RiskBadge risk={c.risk} /></td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

window.PipelinePage = PipelinePage;
