// What the CostGraph API answers in the demos. Made-up data only; the
// store (one per demo load) holds what the visitor has done so far.
(function () {
  const R = window.__cgRoute;
  const fail = window.__cgFail;
  const page = (items) => ({ items, limit: 50, offset: 0, total_count: items.length });

  const me = (s) => ({
    auth_method: 'cognito', subject_type: 'user', role: 'org_owner',
    user_id: s.sub, email: s.email, name: s.name,
    organization_id: 'org_demo', organization_name: s.org, organization_slug: s.slug,
    tenants: s.tenants || [],
  });

  /* ---- account ---------------------------------------------------------- */
  // A brand-new account isn't provisioned until the profile is in
  R('GET', /^\/me$/, ({ store }) => (store.profiled ? me(store) : fail(403, 'User not provisioned in system')));
  R('PATCH', /^\/me$/, ({ store, save, body }) => { if (body && body.name) store.name = body.name; save(); return me(store); });
  R('POST', /^\/signup\/complete$/, ({ store, save, body }) => {
    Object.assign(store, {
      profiled: true,
      name: [body.first_name, body.last_name].filter(Boolean).join(' '),
      org: body.company_name, slug: body.slug,
      tenants: [{ id: 'tenant_demo', name: body.company_name || 'Default' }],
    });
    save();
    return me(store);
  });
  R('GET', /^\/settings\/security$/, () => ({ mfa_required: false, sso_enabled: false, session_timeout_minutes: 720 }));
  R('GET', /^\/settings\/customization$/, () => ({
    date_format: 'DD/MM/YYYY', language: 'en', week_starts_on: 'monday',
    theme: new URLSearchParams(location.search).get('theme') === 'dark' ? 'dark' : 'light',
  }));
  R('GET', /^\/organizations\/[^/]+\/users/, ({ store }) => page([{ id: store.sub, name: store.name, email: store.email, role: 'org_owner', status: 'active' }]));
  R('GET', /^\/organizations\/[^/]+\/invites/, () => page([]));
  R('GET', /^\/tenant\/users/, ({ store }) => page([{ id: store.sub, name: store.name, email: store.email, role: 'admin' }]));

  /* ---- day one: nothing connected yet ----------------------------------- */
  R('GET', /^\/tenant\/clusters\/exists/, ({ store }) => !!store.cluster);
  // A name is free until the cluster's operator reports in under it
  R('GET', /^\/tenant\/clusters\/by-name\/([^/?]+)/, ({ store, m }) =>
    store.cluster
      ? { cluster: { id: 'cl_demo', name: decodeURIComponent(m[1]), tenant_id: 'tenant_demo', provider: 'aws' } }
      : fail(404, 'cluster not found'));
  // The operator's install key, scoped to this one cluster (a fake one)
  R('POST', /^\/settings\/api-keys$/, ({ body }) => ({
    id: 'key_demo', active: true, kind: (body && body.kind) || 'install_token',
    name: (body && body.name) || 'Operator install', tenant_id: 'tenant_demo',
    created_at: new Date().toISOString(), permission_scopes: ['clusters:write'],
    raw_api_key: 'cg_inst_demo_7Qm2xK9vR4pL8sT1', last_four: 'sT1',
  }));
  R('GET', /^\/tenant\/virtual-machines\/exists/, ({ store }) => !!store.vm);
  R('GET', /^\/tenant\/reports/, ({ store }) => ({ reports: store.reports || [], total_count: (store.reports || []).length, limit: 20, offset: 0 }));
  R('GET', /^\/tenant\/virtual-tag-keys/, ({ store }) => store.vtags || []);
  R('GET', /^\/integrations$/, ({ store }) => store.integrations || []);
  R('GET', /^\/integrations\/(focus|sandbox|ai-gateway)\/providers/, () => []);
  R('GET', /^\/integrations\/ci-runners/, () => []);
  R('GET', /^\/tenant\/billing\/export\/providers/, () => []);

  /* ---- budgets: this month, computed from today ------------------------ */
  const month = () => {
    const now = new Date();
    const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
    const end = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1));
    const days = Math.round((end - start) / 86400000);
    return { start, end, days, today: now.getUTCDate() };
  };
  // daily spend for one budget: a base rate with a little weekday rhythm
  const BUDGETS = [
    { id: 'b_prod_aws', name: 'Production AWS', amount: 10000, daily: 372, wobble: 0.12, filters: ['provider:aws', 'tag:env:prod'], thresholds: [50, 80, 100] },
    { id: 'b_gpu', name: 'GPU training', amount: 25000, daily: 735, wobble: 0.22, filters: ['tag:team:ml', 'service:gpu'], thresholds: [80, 100] },
    { id: 'b_data', name: 'Data platform', amount: 4000, daily: 432, wobble: 0.1, filters: ['provider:gcp', 'tag:team:data'], thresholds: [80, 100] },
  ];
  function spendOf(b) {
    const { days, today } = month();
    const out = [];
    let total = 0;
    for (let i = 0; i < days; i++) {
      if (i >= today) { out.push(undefined); continue; }
      total += b.daily * (1 + b.wobble * Math.sin(i * 1.7 + b.amount));
      out.push(Math.round(total * 100) / 100);
    }
    const actual = out[today - 1] || 0;
    const forecast = Math.round((actual / today) * days);
    return { cumulative: out, actual, forecast };
  }
  function view(b, store) {
    const { start, end } = month();
    const { actual, forecast } = spendOf(b);
    const pct = (v) => Math.round((v / b.amount) * 1000) / 10;
    const status = actual > b.amount ? 'over' : forecast > b.amount ? 'at_risk' : 'on_track';
    return {
      id: b.id, name: b.name, amount: b.amount, currency: 'USD', period: 'monthly', layer: 'billed', basis: 'gross',
      filters: b.filters, thresholds: b.thresholds, forecastAlert: true, ownerUserIds: [store.sub],
      createdAt: '2026-09-02T09:00:00Z', updatedAt: '2026-10-28T16:20:00Z',
      evaluation: {
        periodStart: start.toISOString(), periodEnd: end.toISOString(), actual, pctUsed: pct(actual), status,
        forecast: { point: forecast, pctOfBudget: pct(forecast), method: 'regression' }, excludedCurrencies: [],
      },
    };
  }
  R('GET', /^\/tenant\/budgets$/, ({ store }) => (store.budgetOrder || BUDGETS.map((b) => b.id)).map((id) => view(BUDGETS.find((b) => b.id === id), store)));
  R('GET', /^\/tenant\/budgets\/([^/]+)\/series/, ({ m }) => {
    const b = BUDGETS.find((x) => x.id === m[1]) || BUDGETS[0];
    const { start, end, days } = month();
    const { cumulative, forecast } = spendOf(b);
    return {
      periodStart: start.toISOString(), periodEnd: end.toISOString(), currency: 'USD', amount: b.amount,
      forecast: { point: forecast, method: 'regression' },
      points: cumulative.map((actual, i) => ({
        day: new Date(start.getTime() + i * 86400000).toISOString(),
        ...(actual === undefined ? {} : { actual }),
        budget: Math.round(((b.amount * (i + 1)) / days) * 100) / 100,
      })),
    };
  });
  R('PUT', /^\/tenant\/budgets\/order/, ({ store, save, body }) => { if (body && body.ids) { store.budgetOrder = body.ids; save(); } return null; });

  /* ---- cost: 30 days of AWS, ending today --------------------------------
     Seven services with their own rhythm. RDS steps up mid-month when a
     replica is added; Data Transfer spikes for one day. */
  const SERVICES = [
    { key: 'Amazon Elastic Compute Cloud', label: 'Amazon EC2', base: 412, wobble: 0.06 },
    { key: 'Amazon Relational Database Service', label: 'Amazon RDS', base: 168, wobble: 0.04, stepAt: 15, stepTo: 236 },
    { key: 'Amazon Elastic Kubernetes Service', label: 'Amazon EKS', base: 96, wobble: 0.02 },
    { key: 'AWS Data Transfer', label: 'Data Transfer', base: 54, wobble: 0.18, spikeAt: 21, spike: 162 },
    { key: 'Amazon Simple Storage Service', label: 'Amazon S3', base: 47, wobble: 0.05 },
    { key: 'Amazon CloudWatch', label: 'CloudWatch', base: 28, wobble: 0.08 },
    { key: 'AWS Lambda', label: 'Lambda', base: 13, wobble: 0.25 },
  ];
  const DAYS = 30;
  const dayList = (offset = 0) => {
    const today = new Date(); today.setUTCHours(0, 0, 0, 0);
    return Array.from({ length: DAYS }, (_, i) => new Date(today.getTime() - (DAYS - 1 - i + offset) * 86400000).toISOString().slice(0, 10));
  };
  const costOn = (svc, i, prev = false) => {
    const weekday = 1 + svc.wobble * Math.sin(i * 0.9 + svc.base);
    let v = (svc.stepAt && i >= svc.stepAt && !prev ? svc.stepTo : svc.base) * weekday;
    if (svc.spikeAt === i && !prev) v += svc.spike;
    return Math.round(v * (prev ? 0.91 : 1) * 100) / 100;
  };
  const measures = (current, previous, total) => ({
    current, previous, billedCost: current, contractedCost: current, listCost: Math.round(current * 1.08 * 100) / 100,
    share: total ? Math.round((current / total) * 1000) / 10 : 0, usageQuantity: 0,
    changePct: previous ? Math.round(((current - previous) / previous) * 1000) / 10 : null,
    changeAmount: Math.round((current - previous) * 100) / 100,
  });
  function costQuery() {
    const days = dayList();
    const series = [];
    const per = SERVICES.map((svc) => {
      let cur = 0, prev = 0;
      days.forEach((day, i) => { const c = costOn(svc, i); cur += c; prev += costOn(svc, i, true); series.push({ day, stack: svc.key, cost: c }); });
      return { svc, cur: Math.round(cur * 100) / 100, prev: Math.round(prev * 100) / 100 };
    });
    const current = per.reduce((a, x) => a + x.cur, 0);
    const previous = per.reduce((a, x) => a + x.prev, 0);
    return {
      days, series,
      stackLabels: Object.fromEntries(SERVICES.map((s) => [s.key, s.label])),
      groups: per.map(({ svc, cur, prev }) => ({ dimension: 'service', key: svc.key, label: svc.label, ...measures(cur, prev, current) })),
      totals: { current: Math.round(current * 100) / 100, previous: Math.round(previous * 100) / 100, changePct: Math.round(((current - previous) / previous) * 1000) / 10, dailyAverage: Math.round((current / DAYS) * 100) / 100, monthlyPace: Math.round((current / DAYS) * 30.4 * 100) / 100 },
      categoryTotals: [{ chargeCategory: 'Usage', current: Math.round(current * 100) / 100, previous: Math.round(previous * 100) / 100 }],
      netCurrent: Math.round(current * 100) / 100, netPrevious: Math.round(previous * 100) / 100, previousComparable: true, reportingCurrency: 'USD',
    };
  }
  R('GET', /^\/tenant\/cost\/providers\/aws/, () => ({
    provider: 'aws', days: dayList(),
    metadata: { name: 'Amazon Web Services', slug: 'aws', category: 'cloud', grain: 'daily' },
    sections: ['overview', 'usage', 'commitments', 'unit-economics', 'anomalies', 'recommendations', 'accounts'],
    connections: [], usage: [],
  }));
  R('GET', /^\/tenant\/cost\/query/, () => costQuery());
  R('GET', /^\/tenant\/cost\/forecast/, () => { const q = costQuery(); return { point: Math.round(q.totals.dailyAverage * 30.4), method: 'regression', lower: null, upper: null }; });
  R('GET', /^\/tenant\/cost\/facets/, () => ({ provider: [{ value: 'aws', label: 'AWS' }], region: [{ value: 'eu-west-1' }, { value: 'us-east-1' }], resource_type: null, service_category: [{ value: 'Compute' }, { value: 'Databases' }, { value: 'Storage' }, { value: 'Networking' }], sub_account: null, tags: { team: ['platform', 'ml', 'data'], env: ['prod', 'staging'] } }));

  /* ---- one GPU inference VM, seven days of it --------------------------- */
  const VM_PRICE = { id: 'price_g5_2xl', instance_type: 'g5.2xlarge', cpu_cores: 8, ram_gb: 32, gpu_count: 1, gpu_type: 'NVIDIA A10G', cost_per_hour: 1.212, currency: 'USD', region: 'eu-west-1', usage_type: 'BoxUsage:g5.2xlarge', assigned_resources: 1 };
  const vmDetail = (id) => {
    const end = new Date(); const start = new Date(end.getTime() - 30 * 86400000);
    const prevStart = new Date(start.getTime() - 30 * 86400000);
    return {
      id, name: 'ml-inference-01', active: true, provider: 'aws', region: 'eu-west-1', availability_zone: 'eu-west-1b', service: 'Amazon EC2',
      hosting: 'cloud', instance_id: 'i-0c2f9a7e41d3b6a58', created_at: '2026-07-21T09:14:00Z', agent_installed_at: '2026-07-21T09:31:00Z', last_heartbeat_at: new Date(end.getTime() - 40000).toISOString(),
      capacity: { cpu_cores: 8, ram_gb: 32, volumes_attached: 1 },
      machine_info: { architecture: 'x86_64', cost_per_hour: 1.212, hostname: 'ip-10-4-17-82', instance_type: 'g5.2xlarge', usage_type: 'BoxUsage:g5.2xlarge', price_source: 'catalog' },
      system_details: { agent_version: '0.18.2', container_runtimes: ['containerd'], ip_addresses: ['10.4.17.82'], kernel_version: '6.1.112-124.190.amzn2023.x86_64', operating_system: 'Amazon Linux 2023', os_family: 'linux', os_version: '2023', workload_running_containers: 6, workload_total_containers: 7 },
      assigned_price: VM_PRICE,
      disks: [{ id: 'vol-0a7d3c', name: '/dev/nvme0n1', boot: true, capacity_gb: 200, type: 'gp3', iops: 3000, throughput_mbps: 125, cost_per_month: 16, pinned: false, pinned_by: null, pricing_id: 'disk_gp3', cheaper_type: null, cheaper_type_cost_per_month: null, savings_per_month: null }],
      disk_cost_per_month: 16,
      cost_summary: {
        period: 'last_30d', currency: 'USD', cost_data_available: true,
        period_start: start.toISOString(), period_end: end.toISOString(), previous_period_start: prevStart.toISOString(), previous_period_end: start.toISOString(),
        cpu_cost: 214.8, memory_cost: 98.6, storage_cost: 41.2, gpu_cost: 518.08,
        current_period_cost: 872.68, previous_period_cost: 801.12, change_amount: 71.56, change_percent: 8.9,
        projected_monthly_spend: 884.76, potential_savings_monthly_usd: 196.4,
      },
    };
  };
  const vmMetrics = () => {
    const step = 1800, end = Math.floor(Date.now() / 1000 / step) * step, n = 336, start = end - (n - 1) * step;
    const series = (base, amp, noise, peakHour = 14) => Array.from({ length: n }, (_, i) => {
      const t = start + i * step; const hour = new Date(t * 1000).getUTCHours() + new Date(t * 1000).getUTCMinutes() / 60;
      const day = Math.cos(((hour - peakHour) / 24) * Math.PI * 2);
      // busier on weekdays, a little each day
      const dow = new Date(t * 1000).getUTCDay();
      const week = dow === 0 || dow === 6 ? 0.55 : 1;
      const v = (base + amp * day) * week + noise * Math.sin(i * 1.37) * Math.cos(i * 0.61);
      return { t, v: Math.max(0, Math.min(100, Math.round(v * 10) / 10)) };
    });
    const empty = [];
    return {
      start: new Date(start * 1000).toISOString(), end: new Date(end * 1000).toISOString(), step_seconds: step,
      cpu_utilization: series(38, 22, 7), cpu_user: series(30, 18, 5), cpu_system: series(6, 3, 1), cpu_wait: series(1.2, 0.8, 0.3), cpu_steal: empty, cpu_nice: empty, cpu_irq: empty, cpu_softirq: empty, cpu_psi_some: empty,
      memory_utilization: series(52, 24, 9, 15), memory_used: empty, memory_available: empty, memory_free: empty, memory_cached: empty, memory_cached_percent: empty, memory_buffers: empty, memory_buffers_percent: empty, memory_psi_some: empty,
      disk_utilization: series(44, 1, 0.4), disk_busy_percent: series(9, 6, 3), disk_read_iops: empty, disk_write_iops: empty, disk_read_latency: empty, disk_write_latency: empty, disk_read_throughput: empty, disk_write_throughput: empty, io_psi_some: empty,
      gpu_utilization: series(31, 26, 9), gpu_memory_utilization: series(48, 14, 4), gpu_power_utilization: series(36, 20, 6),
      load_average_1m: empty, load_average_5m: empty, load_average_15m: empty, network_receive: empty, network_transmit: empty, swap_utilization: empty, tcp_retransmits: empty,
    };
  };
  R('GET', /^\/tenant\/virtual-machines\/([^/?]+)\/metrics/, () => vmMetrics());
  R('GET', /^\/tenant\/virtual-machines\/([^/?]+)\/load-drivers/, () => {
    const end = new Date(); const start = new Date(end.getTime() - 3600000);
    const d = (groupname, cpu, mem, procs, cores, trend, rss) => ({ groupname, cpu_host_percent: cpu, memory_host_percent: mem, process_count: procs, cpu_cores: cores, trend_percent: trend, memory_resident_bytes: rss, agent_container_id: null });
    return {
      start: start.toISOString(), end: end.toISOString(), window_seconds: 3600, trend_window_seconds: 86400, trend_basis: 'previous_day',
      cpu_used_host_percent: 46.2, cpu_idle_host_percent: 53.8, cpu_remaining_used_host_percent: 3.1,
      items: [d('triton-server', 21.4, 28.6, 3, 1.71, 12.5, 9.8e9), d('python (batch workers)', 12.8, 14.2, 8, 1.02, -4.1, 4.9e9), d('dcgm-exporter', 4.6, 1.1, 1, 0.37, 0.8, 3.8e8), d('containerd', 2.9, 2.4, 14, 0.23, 1.2, 8.2e8), d('node_exporter', 1.4, 0.3, 1, 0.11, -0.6, 1.1e8)],
    };
  });
  R('GET', /^\/tenant\/virtual-machines\/([^/?]+)(\?|$)/, ({ m }) => vmDetail(m[1]));
  R('GET', /^\/tenant\/pricing\/compute/, () => [VM_PRICE]);
  R('GET', /^\/tenant\/pricing\/disk/, () => [{ id: 'disk_gp3', type: 'gp3', region: 'eu-west-1', service: 'Amazon EBS', cost_per_gb_month: 0.08, assigned_resources: 1 }]);
  R('GET', /^\/tenant\/gpus/, () => page([]));
})();
