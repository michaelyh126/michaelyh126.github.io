import { useMemo, useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  CreditCard,
  LayoutDashboard,
  QrCode,
  Scissors,
  ShieldAlert,
  ShieldCheck,
  Smartphone,
  Sparkles,
  UserCheck,
  Volume2,
  Wallet,
} from 'lucide-react';

type TerminalTab = 'customer' | 'stylist' | 'pos' | 'admin';
type Currency = 'USD' | 'CNY';
type AppointmentStatus = 'WAITING' | 'IN_SERVICE' | 'COMPLETED' | 'PAID';
type Role = 'OWNER' | 'CASHIER';

interface Stylist {
  id: string;
  name: string;
  title: string;
  commissionRate: number;
}

interface ServiceItem {
  id: string;
  name: string;
  durationMin: number;
  priceUsd: number;
}

interface MemberAccount {
  id: string;
  code: string;
  name: string;
  principalUsd: number;
  bonusUsd: number;
}

interface Appointment {
  id: string;
  customerId: string;
  customerName: string;
  serviceId: string;
  serviceName: string;
  priceUsd: number;
  stylistId: string;
  stylistName: string;
  slot: string;
  status: AppointmentStatus;
  paymentMethod?: 'MEMBER_WALLET' | 'DIRECT_QR' | 'CASH';
  handledBy?: string;
}

interface PendingTopUp {
  id: string;
  memberId: string;
  memberName: string;
  principalUsd: number;
  bonusUsd: number;
  payerHint: string;
  channel: 'Direct QR (0% Fee)';
  submittedAt: string;
  status: 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED';
}

interface LedgerEntry {
  id: string;
  timestamp: string;
  type: 'CHECKOUT_WALLET' | 'CHECKOUT_QR' | 'TOPUP_APPROVED' | 'RBAC_403_BLOCK';
  actor: string;
  detail: string;
  amountUsd: number;
  channel: 'Member Wallet' | 'Direct QR (0%)' | 'Security Audit';
}

const STYLISTS: Stylist[] = [
  { id: 'st-elena', name: 'Elena Vance', title: 'Creative Director', commissionRate: 0.35 },
  { id: 'st-marcus', name: 'Marcus Chen', title: 'Senior Colorist', commissionRate: 0.3 },
  { id: 'st-liam', name: 'Liam Brooks', title: 'Precision Stylist', commissionRate: 0.28 },
];

const SERVICES: ServiceItem[] = [
  { id: 'svc-cut', name: 'Signature Precision Cut', durationMin: 45, priceUsd: 55 },
  { id: 'svc-color', name: 'Dimensional Balayage', durationMin: 120, priceUsd: 160 },
  { id: 'svc-keratin', name: 'Botanical Keratin Repair', durationMin: 75, priceUsd: 110 },
  { id: 'svc-blowout', name: 'Editorial Gloss & Blowout', durationMin: 35, priceUsd: 40 },
];

const TIME_SLOTS = ['10:30', '11:30', '13:00', '14:30', '16:00', '17:30'];

const INITIAL_MEMBERS: MemberAccount[] = [
  { id: 'm-1', code: 'VIP-8801', name: 'Chloe Bennett', principalUsd: 240, bonusUsd: 60 },
  { id: 'm-2', code: 'VIP-8802', name: 'Sophia Patel', principalUsd: 180, bonusUsd: 40 },
  { id: 'm-3', code: 'VIP-8803', name: 'David Kim', principalUsd: 95, bonusUsd: 25 },
];

const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'APT-101',
    customerId: 'm-1',
    customerName: 'Chloe Bennett',
    serviceId: 'svc-cut',
    serviceName: 'Signature Precision Cut',
    priceUsd: 55,
    stylistId: 'st-elena',
    stylistName: 'Elena Vance',
    slot: '10:30',
    status: 'COMPLETED',
  },
  {
    id: 'APT-102',
    customerId: 'm-2',
    customerName: 'Sophia Patel',
    serviceId: 'svc-color',
    serviceName: 'Dimensional Balayage',
    priceUsd: 160,
    stylistId: 'st-marcus',
    stylistName: 'Marcus Chen',
    slot: '11:30',
    status: 'IN_SERVICE',
  },
  {
    id: 'APT-103',
    customerId: 'm-3',
    customerName: 'David Kim',
    serviceId: 'svc-blowout',
    serviceName: 'Editorial Gloss & Blowout',
    priceUsd: 40,
    stylistId: 'st-liam',
    stylistName: 'Liam Brooks',
    slot: '13:00',
    status: 'WAITING',
  },
];

const INITIAL_TOPUPS: PendingTopUp[] = [
  {
    id: 'DPA-2026-001',
    memberId: 'm-2',
    memberName: 'Sophia Patel (VIP-8802)',
    principalUsd: 200,
    bonusUsd: 50,
    payerHint: 'Sophia P. · Last 4: 4821',
    channel: 'Direct QR (0% Fee)',
    submittedAt: '10:18',
    status: 'PENDING_REVIEW',
  },
];

const INITIAL_LEDGER: LedgerEntry[] = [
  {
    id: 'LED-901',
    timestamp: '09:42',
    type: 'CHECKOUT_QR',
    actor: 'Cashier Mia',
    detail: 'Walk-in Blowout · Direct QR audio speaker verified (#9014)',
    amountUsd: 40,
    channel: 'Direct QR (0%)',
  },
  {
    id: 'LED-902',
    timestamp: '10:05',
    type: 'CHECKOUT_WALLET',
    actor: 'Owner Claire',
    detail: 'Chloe Bennett · Double-entry split ($44 principal + $11 bonus)',
    amountUsd: 55,
    channel: 'Member Wallet',
  },
];

export default function SalonSaaSDemo() {
  const [activeTab, setActiveTab] = useState<TerminalTab>('customer');
  const [currency, setCurrency] = useState<Currency>('USD');
  const [adminRole, setAdminRole] = useState<Role>('CASHIER');

  const [members, setMembers] = useState<MemberAccount[]>(INITIAL_MEMBERS);
  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS);
  const [topUps, setTopUps] = useState<PendingTopUp[]>(INITIAL_TOPUPS);
  const [ledger, setLedger] = useState<LedgerEntry[]>(INITIAL_LEDGER);
  const [toast, setToast] = useState<{ kind: 'ok' | 'error'; text: string } | null>(null);

  // Customer terminal form state
  const [bookingMemberId, setBookingMemberId] = useState('m-1');
  const [bookingServiceId, setBookingServiceId] = useState('svc-cut');
  const [bookingStylistId, setBookingStylistId] = useState('st-elena');
  const [bookingSlot, setBookingSlot] = useState('14:30');
  const [topUpHint, setTopUpHint] = useState('Chloe B. · Ref 7731');

  // Stylist terminal state
  const [selectedStylistId, setSelectedStylistId] = useState('st-elena');

  // POS terminal state
  const [posApptId, setPosApptId] = useState<string>('APT-101');
  const [posMethod, setPosMethod] = useState<'MEMBER_WALLET' | 'DIRECT_QR'>('DIRECT_QR');
  const [audioVerified, setAudioVerified] = useState(false);
  const [qrPayerRef, setQrPayerRef] = useState('');

  const fmt = (usd: number) =>
    currency === 'USD' ? `$${usd.toFixed(2)}` : `¥${(usd * 7.2).toFixed(0)}`;

  const notify = (kind: 'ok' | 'error', text: string) => {
    setToast({ kind, text });
    window.setTimeout(() => setToast(null), 4000);
  };

  const nowTime = () =>
    new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });

  // 1. Customer Books Appointment
  const handleBookAppointment = () => {
    const member = members.find((m) => m.id === bookingMemberId)!;
    const svc = SERVICES.find((s) => s.id === bookingServiceId)!;
    const stylist = STYLISTS.find((s) => s.id === bookingStylistId)!;
    const newId = `APT-${100 + appointments.length + 1}`;
    const newAppt: Appointment = {
      id: newId,
      customerId: member.id,
      customerName: member.name,
      serviceId: svc.id,
      serviceName: svc.name,
      priceUsd: svc.priceUsd,
      stylistId: stylist.id,
      stylistName: stylist.name,
      slot: bookingSlot,
      status: 'WAITING',
    };
    setAppointments((prev) => [newAppt, ...prev]);
    setSelectedStylistId(stylist.id);
    notify(
      'ok',
      `Booked ${newId} for ${member.name} with ${stylist.name} at ${bookingSlot} — live in Stylist Workbench!`
    );
  };

  // 1b. Customer Submits Direct-QR Self Top-Up (PENDING_REVIEW)
  const handleSubmitSelfTopUp = () => {
    const member = members.find((m) => m.id === bookingMemberId)!;
    const id = `DPA-2026-00${topUps.length + 1}`;
    setTopUps((prev) => [
      {
        id,
        memberId: member.id,
        memberName: `${member.name} (${member.code})`,
        principalUsd: 150,
        bonusUsd: 35,
        payerHint: topUpHint.trim() || `${member.name} · QR`,
        channel: 'Direct QR (0% Fee)',
        submittedAt: nowTime(),
        status: 'PENDING_REVIEW',
      },
      ...prev,
    ]);
    notify(
      'ok',
      `Submitted ${id} as PENDING_REVIEW (never auto-credits). Open Admin Console to test Owner vs Cashier RBAC!`
    );
  };

  // 2. Stylist Advances Appointment Status
  const handleAdvanceStatus = (id: string, next: AppointmentStatus) => {
    setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, status: next } : a)));
    if (next === 'COMPLETED') {
      setPosApptId(id);
      notify('ok', `${id} marked COMPLETED — now ready for checkout in Mobile Cashier POS!`);
    }
  };

  // 3. POS Checkout (Member Double-Entry Wallet OR Zero-Fee Direct QR)
  const readyForCheckout = appointments.filter((a) => a.status === 'COMPLETED');
  const activePosAppt =
    readyForCheckout.find((a) => a.id === posApptId) ?? readyForCheckout[0] ?? null;

  const handlePosCheckout = () => {
    if (!activePosAppt) return;
    const actor = adminRole === 'OWNER' ? 'Owner Claire' : 'Cashier Mia';

    if (posMethod === 'DIRECT_QR') {
      if (!audioVerified) {
        notify(
          'error',
          'Anti-fraud rule: Confirm store payment speaker audio alert before closing Direct-QR ticket.'
        );
        return;
      }
      setAppointments((prev) =>
        prev.map((a) =>
          a.id === activePosAppt.id
            ? { ...a, status: 'PAID', paymentMethod: 'DIRECT_QR', handledBy: actor }
            : a
        )
      );
      setLedger((prev) => [
        {
          id: `LED-${900 + prev.length + 1}`,
          timestamp: nowTime(),
          type: 'CHECKOUT_QR',
          actor,
          detail: `${activePosAppt.id} (${activePosAppt.serviceName}) · Speaker Verified ${qrPayerRef ? `(${qrPayerRef})` : ''}`,
          amountUsd: activePosAppt.priceUsd,
          channel: 'Direct QR (0%)',
        },
        ...prev,
      ]);
      setAudioVerified(false);
      setQrPayerRef('');
      notify('ok', `Checked out ${activePosAppt.id} via 0%-fee Direct QR — logged to EOD Reconciliation!`);
      return;
    }

    // Member Double-Entry Wallet Deduction (proportional principal/bonus split)
    const member = members.find((m) => m.id === activePosAppt.customerId);
    if (!member) return;
    const totalBal = member.principalUsd + member.bonusUsd;
    if (totalBal < activePosAppt.priceUsd) {
      notify('error', `Insufficient wallet balance for ${member.name}. Switch to Direct QR or approve top-up.`);
      return;
    }
    const principalRatio = member.principalUsd / totalBal;
    const principalDeduct = Number((activePosAppt.priceUsd * principalRatio).toFixed(2));
    const bonusDeduct = Number((activePosAppt.priceUsd - principalDeduct).toFixed(2));

    setMembers((prev) =>
      prev.map((m) =>
        m.id === member.id
          ? {
              ...m,
              principalUsd: Number((m.principalUsd - principalDeduct).toFixed(2)),
              bonusUsd: Number((m.bonusUsd - bonusDeduct).toFixed(2)),
            }
          : m
      )
    );
    setAppointments((prev) =>
      prev.map((a) =>
        a.id === activePosAppt.id
          ? { ...a, status: 'PAID', paymentMethod: 'MEMBER_WALLET', handledBy: actor }
          : a
      )
    );
    setLedger((prev) => [
      {
        id: `LED-${900 + prev.length + 1}`,
        timestamp: nowTime(),
        type: 'CHECKOUT_WALLET',
        actor,
        detail: `${activePosAppt.id} · Double-entry split (${fmt(principalDeduct)} principal + ${fmt(bonusDeduct)} bonus)`,
        amountUsd: activePosAppt.priceUsd,
        channel: 'Member Wallet',
      },
      ...prev,
    ]);
    notify('ok', `Wallet debited via double-entry ledger (${fmt(principalDeduct)} principal + ${fmt(bonusDeduct)} bonus).`);
  };

  // 4. Admin Approve Top-Up (Enforces OWNER-only RBAC 403 block!)
  const handleReviewTopUp = (req: PendingTopUp, decision: 'APPROVED' | 'REJECTED') => {
    if (adminRole !== 'OWNER') {
      setLedger((prev) => [
        {
          id: `SEC-${403 + prev.length}`,
          timestamp: nowTime(),
          type: 'RBAC_403_BLOCK',
          actor: 'Cashier Mia (CASHIER)',
          detail: `HTTP 403 FORBIDDEN: Blocked unauthorized ${decision} attempt on ${req.id}`,
          amountUsd: 0,
          channel: 'Security Audit',
        },
        ...prev,
      ]);
      notify(
        'error',
        'HTTP 403 FORBIDDEN: Cashier role cannot approve remote QR top-ups! Incident logged. Switch role to OWNER to approve.'
      );
      return;
    }

    setTopUps((prev) => prev.map((t) => (t.id === req.id ? { ...t, status: decision } : t)));
    if (decision === 'APPROVED') {
      setMembers((prev) =>
        prev.map((m) =>
          m.id === req.memberId
            ? {
                ...m,
                principalUsd: m.principalUsd + req.principalUsd,
                bonusUsd: m.bonusUsd + req.bonusUsd,
              }
            : m
        )
      );
      setLedger((prev) => [
        {
          id: `LED-${900 + prev.length + 1}`,
          timestamp: nowTime(),
          type: 'TOPUP_APPROVED',
          actor: 'Owner Claire (OWNER)',
          detail: `Approved ${req.id} · +${fmt(req.principalUsd)} principal + ${fmt(req.bonusUsd)} bonus`,
          amountUsd: req.principalUsd,
          channel: 'Direct QR (0%)',
        },
        ...prev,
      ]);
      notify('ok', `Owner approved ${req.id} — member wallet balance credited live!`);
    } else {
      notify('ok', `Owner rejected ${req.id}.`);
    }
  };

  // Live EOD Reconciliation Aggregation
  const eodSummary = useMemo(() => {
    const map = new Map<string, { actor: string; qr: number; wallet: number; count: number }>();
    for (const entry of ledger) {
      if (entry.type === 'RBAC_403_BLOCK') continue;
      const cur = map.get(entry.actor) ?? { actor: entry.actor, qr: 0, wallet: 0, count: 0 };
      if (entry.channel === 'Direct QR (0%)') cur.qr += entry.amountUsd;
      if (entry.channel === 'Member Wallet') cur.wallet += entry.amountUsd;
      cur.count += 1;
      map.set(entry.actor, cur);
    }
    return Array.from(map.values());
  }, [ledger]);

  const pendingReviewCount = topUps.filter((t) => t.status === 'PENDING_REVIEW').length;
  const activeStylist = STYLISTS.find((s) => s.id === selectedStylistId)!;
  const stylistQueue = appointments.filter((a) => a.stylistId === selectedStylistId);
  const stylistCommission = stylistQueue
    .filter((a) => a.status === 'COMPLETED' || a.status === 'PAID')
    .reduce((sum, a) => sum + a.priceUsd * activeStylist.commissionRate, 0);

  return (
    <div className="mx-auto max-w-7xl space-y-4 p-4 sm:p-6">
      {/* Studio Banner + 4-Terminal Switcher */}
      <div className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200/90 bg-white p-4 dark:border-slate-800 dark:bg-obsidian-900 lg:flex-row lg:items-center">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-cyan-500" />
            <span className="font-display text-lg font-bold text-slate-950 dark:text-white">
              Atelier Nova Hair Studio · 4-Terminal Live Flow
            </span>
          </div>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            Try the end-to-end flow: Book in <strong>Customer App</strong> → Complete in{' '}
            <strong>Stylist App</strong> → Checkout in <strong>Cashier POS</strong> → Reconcile &amp; test{' '}
            <strong>RBAC 403</strong> in <strong>Admin Console</strong>.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex rounded-lg border border-slate-200 bg-slate-100 p-0.5 font-mono text-xs dark:border-slate-800 dark:bg-obsidian-950">
            {(['USD', 'CNY'] as Currency[]).map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCurrency(c)}
                className={`rounded-md px-2.5 py-1 font-semibold ${
                  currency === c
                    ? 'bg-white text-slate-950 shadow-sm dark:bg-cyan-500 dark:text-slate-950'
                    : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 4 Terminal Navigation Tabs */}
      <div className="grid grid-cols-2 gap-2.5 lg:grid-cols-4">
        {(
          [
            {
              id: 'customer',
              label: '1. Customer Booking App',
              sub: 'H5 Mobile · Self Top-Up',
              icon: Smartphone,
              badge: null,
            },
            {
              id: 'stylist',
              label: '2. Stylist Workbench',
              sub: 'Live Queue & Commission',
              icon: Scissors,
              badge: appointments.filter((a) => a.status === 'WAITING' || a.status === 'IN_SERVICE').length,
            },
            {
              id: 'pos',
              label: '3. Mobile Cashier POS',
              sub: '0% Direct QR & Wallet',
              icon: CreditCard,
              badge: readyForCheckout.length,
            },
            {
              id: 'admin',
              label: '4. Admin & 5s EOD',
              sub: 'RBAC 403 & Double-Entry',
              icon: LayoutDashboard,
              badge: pendingReviewCount,
            },
          ] as const
        ).map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-start justify-between rounded-xl border p-3.5 text-left transition ${
                active
                  ? 'border-cyan-500 bg-cyan-500/10 shadow-sm dark:border-cyan-400 dark:bg-cyan-500/15'
                  : 'border-slate-200 bg-white hover:border-cyan-500/40 dark:border-slate-800 dark:bg-obsidian-900'
              }`}
            >
              <div>
                <div className="flex items-center gap-1.5 font-display text-sm font-bold text-slate-950 dark:text-white">
                  <Icon className={`h-4 w-4 ${active ? 'text-cyan-500' : 'text-slate-400'}`} />
                  <span>{tab.label}</span>
                </div>
                <div className="mt-0.5 font-mono text-[11px] text-slate-500 dark:text-slate-400">
                  {tab.sub}
                </div>
              </div>
              {tab.badge !== null && tab.badge > 0 && (
                <span className="rounded-full bg-amber-500 px-2 py-0.5 font-mono text-[10px] font-bold text-slate-950">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Live Toast Feedback */}
      {toast && (
        <div
          className={`flex items-center gap-2 rounded-xl border px-4 py-3 text-xs font-medium ${
            toast.kind === 'error'
              ? 'border-rose-500/40 bg-rose-500/10 text-rose-700 dark:text-rose-200'
              : 'border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-200'
          }`}
        >
          {toast.kind === 'error' ? (
            <AlertTriangle className="h-4 w-4 shrink-0 text-rose-500" />
          ) : (
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
          )}
          <span>{toast.text}</span>
        </div>
      )}

      {/* TERMINAL 1: CUSTOMER BOOKING MOBILE APP */}
      {activeTab === 'customer' && (
        <div className="grid gap-6 lg:grid-cols-12">
          <div className="mx-auto w-full max-w-md rounded-[2rem] border-4 border-slate-800 bg-white p-5 shadow-2xl dark:border-slate-700 dark:bg-obsidian-900 lg:col-span-6">
            <div className="mb-4 flex items-center justify-between border-b border-slate-200 pb-3 dark:border-slate-800">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
                  Customer H5 Web App
                </div>
                <div className="font-display text-lg font-bold text-slate-950 dark:text-white">
                  Atelier Nova · Book Visit
                </div>
              </div>
              <span className="rounded-full bg-emerald-500/15 px-2.5 py-1 font-mono text-[10px] font-semibold text-emerald-700 dark:text-emerald-300">
                No App Install
              </span>
            </div>

            <div className="space-y-4">
              <div>
                <label className="font-mono text-[11px] font-semibold text-slate-500">
                  Logged-In Member
                </label>
                <select
                  value={bookingMemberId}
                  onChange={(e) => setBookingMemberId(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-xs font-medium dark:border-slate-700 dark:bg-obsidian-950"
                >
                  {members.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.code}) · Wallet {fmt(m.principalUsd + m.bonusUsd)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-mono text-[11px] font-semibold text-slate-500">
                  1. Select Service
                </label>
                <div className="mt-1.5 grid grid-cols-2 gap-2">
                  {SERVICES.map((svc) => (
                    <button
                      key={svc.id}
                      type="button"
                      onClick={() => setBookingServiceId(svc.id)}
                      className={`rounded-xl border p-2.5 text-left transition ${
                        bookingServiceId === svc.id
                          ? 'border-cyan-500 bg-cyan-500/10'
                          : 'border-slate-200 dark:border-slate-800'
                      }`}
                    >
                      <div className="text-xs font-semibold text-slate-900 dark:text-white">
                        {svc.name}
                      </div>
                      <div className="mt-1 flex justify-between font-mono text-[11px] text-cyan-600 dark:text-cyan-400">
                        <span>{fmt(svc.priceUsd)}</span>
                        <span className="text-slate-400">{svc.durationMin}m</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-mono text-[11px] font-semibold text-slate-500">
                  2. Choose Stylist
                </label>
                <div className="mt-1.5 grid grid-cols-3 gap-2">
                  {STYLISTS.map((st) => (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => setBookingStylistId(st.id)}
                      className={`rounded-xl border p-2 text-center text-xs transition ${
                        bookingStylistId === st.id
                          ? 'border-cyan-500 bg-cyan-500/10 font-bold'
                          : 'border-slate-200 dark:border-slate-800'
                      }`}
                    >
                      <div>{st.name.split(' ')[0]}</div>
                      <div className="font-mono text-[10px] text-slate-400">{st.title.split(' ')[0]}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-mono text-[11px] font-semibold text-slate-500">
                  3. Time Slot
                </label>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {TIME_SLOTS.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setBookingSlot(slot)}
                      className={`rounded-lg px-2.5 py-1 font-mono text-xs ${
                        bookingSlot === slot
                          ? 'bg-cyan-600 text-white dark:bg-cyan-500 dark:text-slate-950'
                          : 'border border-slate-200 text-slate-600 dark:border-slate-800 dark:text-slate-300'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={handleBookAppointment}
                className="w-full rounded-xl bg-cyan-600 py-3 text-sm font-bold text-white shadow-glow transition hover:bg-cyan-500 dark:bg-cyan-500 dark:text-slate-950"
              >
                Confirm Instant Booking
              </button>
            </div>
          </div>

          {/* Right Card: Customer Self-Service QR Top-Up Anti-Fraud Demo */}
          <div className="flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-6 dark:border-slate-800 dark:bg-obsidian-900 lg:col-span-6">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/35 bg-amber-500/10 px-3 py-1 font-mono text-[11px] font-semibold text-amber-700 dark:text-amber-300">
                <QrCode className="h-3.5 w-3.5" />
                <span>CU03 Anti-Fraud Self Top-Up Flow</span>
              </div>
              <h3 className="mt-3 font-display text-xl font-bold text-slate-950 dark:text-white">
                Zero-Fee Direct QR Wallet Recharge
              </h3>
              <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-300">
                Customers scan the salon mirror stand QR and submit their transfer reference. To
                prevent fake-screenshot fraud, the API strictly creates a{' '}
                <code className="rounded bg-slate-100 px-1 py-0.5 font-mono text-xs dark:bg-obsidian-950">
                  PENDING_REVIEW
                </code>{' '}
                ticket and <strong>never auto-credits</strong> balance until the <strong>OWNER</strong>{' '}
                verifies receipt in Admin Console.
              </p>

              <div className="mt-5 flex items-center gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-obsidian-950">
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl border-2 border-dashed border-cyan-500/60 bg-white text-slate-900">
                  <QrCode className="h-12 w-12" />
                </div>
                <div className="text-xs">
                  <div className="font-mono font-bold text-cyan-700 dark:text-cyan-400">
                    PACKAGE: Recharge {fmt(150)} + Bonus {fmt(35)}
                  </div>
                  <p className="mt-1 text-slate-500 dark:text-slate-400">
                    Double-entry wallet splits principal &amp; promotional bonus automatically on
                    future checkouts.
                  </p>
                </div>
              </div>

              <div className="mt-4">
                <label className="font-mono text-[11px] font-semibold text-slate-500">
                  Payer Nickname / Transfer Last 4 Digits
                </label>
                <input
                  type="text"
                  value={topUpHint}
                  onChange={(e) => setTopUpHint(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 font-mono text-xs dark:border-slate-700 dark:bg-obsidian-950"
                />
              </div>

              <button
                type="button"
                onClick={handleSubmitSelfTopUp}
                className="mt-4 w-full rounded-xl border border-cyan-500/60 bg-cyan-500/10 py-2.5 text-xs font-bold text-cyan-700 transition hover:bg-cyan-600 hover:text-white dark:text-cyan-300 dark:hover:bg-cyan-500 dark:hover:text-slate-950"
              >
                Submit Direct-QR Top-Up (Creates PENDING_REVIEW Ticket)
              </button>
            </div>

            <div className="mt-6 rounded-xl border border-slate-200/80 bg-slate-50 p-3.5 font-mono text-xs dark:border-slate-800 dark:bg-obsidian-950">
              <div className="text-[10px] uppercase text-slate-400">Live Member Balances</div>
              <div className="mt-2 space-y-1.5">
                {members.map((m) => (
                  <div key={m.id} className="flex justify-between">
                    <span>{m.name}</span>
                    <span className="text-emerald-600 dark:text-emerald-400">
                      {fmt(m.principalUsd)} prin + {fmt(m.bonusUsd)} bonus
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TERMINAL 2: STYLIST MOBILE WORKBENCH */}
      {activeTab === 'stylist' && (
        <div className="grid gap-6 lg:grid-cols-12">
          <div className="mx-auto w-full max-w-md rounded-[2rem] border-4 border-slate-800 bg-white p-5 shadow-2xl dark:border-slate-700 dark:bg-obsidian-900 lg:col-span-6">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3 dark:border-slate-800">
              <div>
                <div className="font-mono text-[10px] uppercase text-emerald-600 dark:text-emerald-400">
                  Stylist Mobile Workbench
                </div>
                <div className="font-display text-lg font-bold text-slate-950 dark:text-white">
                  {activeStylist.name}
                </div>
              </div>
              <select
                value={selectedStylistId}
                onChange={(e) => setSelectedStylistId(e.target.value)}
                className="rounded-lg border border-slate-300 bg-slate-50 px-2 py-1 font-mono text-xs dark:border-slate-700 dark:bg-obsidian-950"
              >
                {STYLISTS.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({Math.round(s.commissionRate * 100)}%)
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2.5">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-obsidian-950">
                <div className="font-mono text-[10px] uppercase text-slate-400">Today’s Queue</div>
                <div className="mt-1 font-mono text-xl font-bold text-slate-950 dark:text-white">
                  {stylistQueue.length}
                </div>
              </div>
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3">
                <div className="font-mono text-[10px] uppercase text-emerald-700 dark:text-emerald-300">
                  Live Commission ({Math.round(activeStylist.commissionRate * 100)}%)
                </div>
                <div className="mt-1 font-mono text-xl font-bold text-emerald-700 dark:text-emerald-300">
                  {fmt(stylistCommission)}
                </div>
              </div>
            </div>

            <div className="mt-4 space-y-2.5">
              {stylistQueue.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-300 p-6 text-center text-xs text-slate-500 dark:border-slate-700">
                  No bookings assigned yet. Book one in Terminal 1!
                </div>
              ) : (
                stylistQueue.map((apt) => (
                  <div
                    key={apt.id}
                    className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 dark:border-slate-800 dark:bg-obsidian-950/70"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-cyan-600 dark:text-cyan-400">
                        {apt.slot} · {apt.id}
                      </span>
                      <span className="rounded bg-slate-200 px-2 py-0.5 font-mono text-[10px] font-bold dark:bg-obsidian-800">
                        {apt.status}
                      </span>
                    </div>
                    <div className="mt-1 font-display text-sm font-bold text-slate-950 dark:text-white">
                      {apt.customerName} — {apt.serviceName}
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="font-mono text-xs text-slate-500">{fmt(apt.priceUsd)}</span>
                      <div className="flex gap-2">
                        {apt.status === 'WAITING' && (
                          <button
                            type="button"
                            onClick={() => handleAdvanceStatus(apt.id, 'IN_SERVICE')}
                            className="rounded-lg bg-cyan-600 px-3 py-1 font-mono text-[11px] font-bold text-white"
                          >
                            Start Service
                          </button>
                        )}
                        {apt.status === 'IN_SERVICE' && (
                          <button
                            type="button"
                            onClick={() => handleAdvanceStatus(apt.id, 'COMPLETED')}
                            className="rounded-lg bg-emerald-600 px-3 py-1 font-mono text-[11px] font-bold text-white"
                          >
                            Complete → Send to POS
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200/90 bg-white p-6 dark:border-slate-800 dark:bg-obsidian-900 lg:col-span-6">
            <h3 className="font-display text-lg font-bold text-slate-950 dark:text-white">
              Real-Time Floor State Across All Stylists
            </h3>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Advancing a ticket to <code className="font-mono">COMPLETED</code> automatically
              unlocks it in the Mobile Cashier POS queue.
            </p>
            <div className="mt-4 divide-y divide-slate-200/80 dark:divide-slate-800">
              {appointments.map((a) => (
                <div key={a.id} className="flex items-center justify-between py-2.5 text-xs">
                  <div>
                    <span className="font-mono font-bold text-cyan-600 dark:text-cyan-400">
                      {a.id}
                    </span>{' '}
                    · {a.customerName} ({a.serviceName})
                    <div className="font-mono text-[11px] text-slate-400">
                      {a.stylistName} · {a.slot}
                    </div>
                  </div>
                  <span className="rounded-md bg-slate-100 px-2 py-0.5 font-mono text-[10px] font-semibold dark:bg-obsidian-950">
                    {a.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TERMINAL 3: MOBILE CASHIER POS */}
      {activeTab === 'pos' && (
        <div className="grid gap-6 lg:grid-cols-12">
          <div className="rounded-2xl border border-slate-200/90 bg-white p-5 dark:border-slate-800 dark:bg-obsidian-900 lg:col-span-5">
            <h3 className="font-display text-base font-bold text-slate-950 dark:text-white">
              Ready for Checkout ({readyForCheckout.length})
            </h3>
            <div className="mt-3 space-y-2">
              {readyForCheckout.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-300 p-6 text-center text-xs text-slate-500 dark:border-slate-700">
                  All completed tickets settled! Complete another ticket in Stylist Workbench.
                </div>
              ) : (
                readyForCheckout.map((apt) => (
                  <button
                    key={apt.id}
                    type="button"
                    onClick={() => setPosApptId(apt.id)}
                    className={`w-full rounded-xl border p-3.5 text-left transition ${
                      activePosAppt?.id === apt.id
                        ? 'border-cyan-500 bg-cyan-500/10'
                        : 'border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    <div className="flex justify-between font-mono text-xs">
                      <span className="font-bold text-cyan-600 dark:text-cyan-400">{apt.id}</span>
                      <span className="font-bold">{fmt(apt.priceUsd)}</span>
                    </div>
                    <div className="mt-1 text-sm font-semibold">{apt.customerName}</div>
                    <div className="text-xs text-slate-500">
                      {apt.serviceName} · {apt.stylistName}
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200/90 bg-white p-6 dark:border-slate-800 dark:bg-obsidian-900 lg:col-span-7">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3 dark:border-slate-800">
              <h3 className="font-display text-lg font-bold text-slate-950 dark:text-white">
                Cashier Settlement Rail
              </h3>
              <span className="font-mono text-xs text-slate-500">
                Operator: {adminRole === 'OWNER' ? 'Owner Claire' : 'Cashier Mia'}
              </span>
            </div>

            {activePosAppt ? (
              <div className="mt-4 space-y-4">
                <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4 dark:bg-obsidian-950">
                  <div>
                    <div className="font-mono text-xs text-slate-500">{activePosAppt.id}</div>
                    <div className="font-display text-lg font-bold">
                      {activePosAppt.customerName} · {activePosAppt.serviceName}
                    </div>
                  </div>
                  <div className="font-mono text-2xl font-bold text-cyan-600 dark:text-cyan-400">
                    {fmt(activePosAppt.priceUsd)}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPosMethod('DIRECT_QR')}
                    className={`flex items-center gap-2 rounded-xl border p-3.5 text-left ${
                      posMethod === 'DIRECT_QR'
                        ? 'border-cyan-500 bg-cyan-500/10'
                        : 'border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    <QrCode className="h-5 w-5 text-cyan-500" />
                    <div>
                      <div className="text-xs font-bold">Zero-Fee Direct QR</div>
                      <div className="font-mono text-[10px] text-emerald-600 dark:text-emerald-400">
                        0% gateway fee · Audio check
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPosMethod('MEMBER_WALLET')}
                    className={`flex items-center gap-2 rounded-xl border p-3.5 text-left ${
                      posMethod === 'MEMBER_WALLET'
                        ? 'border-cyan-500 bg-cyan-500/10'
                        : 'border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    <Wallet className="h-5 w-5 text-emerald-500" />
                    <div>
                      <div className="text-xs font-bold">Double-Entry Wallet</div>
                      <div className="font-mono text-[10px] text-slate-500">
                        Proportional principal/bonus
                      </div>
                    </div>
                  </button>
                </div>

                {posMethod === 'DIRECT_QR' ? (
                  <div className="space-y-3 rounded-xl border border-amber-500/35 bg-amber-500/10 p-4">
                    <label className="flex cursor-pointer items-start gap-2.5 text-xs font-semibold text-amber-900 dark:text-amber-200">
                      <input
                        type="checkbox"
                        checked={audioVerified}
                        onChange={(e) => setAudioVerified(e.target.checked)}
                        className="mt-0.5 h-4 w-4 accent-amber-500"
                      />
                      <span className="flex items-center gap-1.5">
                        <Volume2 className="h-4 w-4 shrink-0" />I have personally heard the store
                        payment speaker announce the exact received amount (anti-fake-screenshot
                        guard).
                      </span>
                    </label>
                    <input
                      type="text"
                      value={qrPayerRef}
                      onChange={(e) => setQrPayerRef(e.target.value)}
                      placeholder="Optional payer nickname / last 4 digits..."
                      className="w-full rounded-lg border border-amber-500/30 bg-white px-3 py-2 font-mono text-xs dark:bg-obsidian-950"
                    />
                  </div>
                ) : (
                  <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 font-mono text-xs text-emerald-800 dark:text-emerald-200">
                    {(() => {
                      const m = members.find((x) => x.id === activePosAppt.customerId);
                      return m
                        ? `Available: ${fmt(m.principalUsd)} Principal + ${fmt(m.bonusUsd)} Bonus = ${fmt(m.principalUsd + m.bonusUsd)} Total`
                        : '';
                    })()}
                  </div>
                )}

                <button
                  type="button"
                  onClick={handlePosCheckout}
                  className="w-full rounded-xl bg-cyan-600 py-3 text-sm font-bold text-white shadow-glow transition hover:bg-cyan-500 dark:bg-cyan-500 dark:text-slate-950"
                >
                  Settle Ticket &amp; Write Audit Ledger
                </button>
              </div>
            ) : (
              <p className="mt-4 text-sm text-slate-500">Select a completed ticket to settle.</p>
            )}
          </div>
        </div>
      )}

      {/* TERMINAL 4: DESKTOP ADMIN & 5-SECOND EOD RECONCILIATION */}
      {activeTab === 'admin' && (
        <div className="space-y-4">
          {/* RBAC Role Switcher Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200/90 bg-white p-4 dark:border-slate-800 dark:bg-obsidian-900">
            <div className="flex items-center gap-2.5">
              {adminRole === 'OWNER' ? (
                <ShieldCheck className="h-5 w-5 text-emerald-500" />
              ) : (
                <ShieldAlert className="h-5 w-5 text-amber-500" />
              )}
              <div>
                <div className="font-display text-sm font-bold">
                  Active RBAC Session:{' '}
                  <span className="font-mono text-cyan-600 dark:text-cyan-400">{adminRole}</span>
                </div>
                <div className="text-xs text-slate-500">
                  Try clicking Approve as <strong>CASHIER</strong> to trigger an authentic{' '}
                  <code className="font-mono text-rose-500">HTTP 403</code> RBAC audit block!
                </div>
              </div>
            </div>

            <div className="inline-flex rounded-xl border border-slate-200 bg-slate-100 p-1 font-mono text-xs dark:border-slate-800 dark:bg-obsidian-950">
              {(['CASHIER', 'OWNER'] as Role[]).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setAdminRole(r)}
                  className={`rounded-lg px-3 py-1.5 font-bold transition ${
                    adminRole === r
                      ? r === 'OWNER'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-amber-500 text-slate-950'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {r === 'OWNER' ? 'OWNER (Full Access)' : 'CASHIER (Restricted)'}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-12">
            {/* Pending Direct-QR Top-Up Approval Queue */}
            <div className="rounded-2xl border border-slate-200/90 bg-white p-5 dark:border-slate-800 dark:bg-obsidian-900 lg:col-span-6">
              <div className="flex items-center justify-between">
                <h3 className="flex items-center gap-2 font-display text-base font-bold">
                  <UserCheck className="h-4 w-4 text-cyan-500" />
                  <span>Direct-QR Top-Up Verification Queue</span>
                </h3>
                <span className="rounded-full bg-amber-500/15 px-2.5 py-0.5 font-mono text-[11px] font-semibold text-amber-600 dark:text-amber-300">
                  {pendingReviewCount} Pending
                </span>
              </div>

              <div className="mt-4 space-y-3">
                {topUps.map((req) => (
                  <div
                    key={req.id}
                    className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-3.5 dark:border-slate-800 dark:bg-obsidian-950/70"
                  >
                    <div className="flex items-center justify-between font-mono text-xs">
                      <span className="font-bold text-cyan-600 dark:text-cyan-400">{req.id}</span>
                      <span
                        className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                          req.status === 'APPROVED'
                            ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-300'
                            : req.status === 'REJECTED'
                              ? 'bg-rose-500/15 text-rose-600 dark:text-rose-300'
                              : 'bg-amber-500/15 text-amber-600 dark:text-amber-300'
                        }`}
                      >
                        {req.status}
                      </span>
                    </div>
                    <div className="mt-1 text-sm font-semibold">{req.memberName}</div>
                    <div className="font-mono text-xs text-slate-500">
                      +{fmt(req.principalUsd)} Principal + {fmt(req.bonusUsd)} Bonus · {req.payerHint}
                    </div>
                    {req.status === 'PENDING_REVIEW' && (
                      <div className="mt-3 flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleReviewTopUp(req, 'APPROVED')}
                          className="rounded-lg bg-emerald-600 px-3 py-1.5 font-mono text-[11px] font-bold text-white hover:bg-emerald-500"
                        >
                          Approve &amp; Credit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleReviewTopUp(req, 'REJECTED')}
                          className="rounded-lg border border-rose-500/40 px-3 py-1.5 font-mono text-[11px] font-bold text-rose-600 dark:text-rose-300"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* 5-Second EOD Reconciliation Matrix */}
            <div className="rounded-2xl border border-slate-200/90 bg-white p-5 dark:border-slate-800 dark:bg-obsidian-900 lg:col-span-6">
              <h3 className="font-display text-base font-bold">
                5-Second EOD Handler × Channel Reconciliation
              </h3>
              <p className="mt-0.5 text-xs text-slate-500">
                Owner compares Direct-QR subtotal directly against personal phone bank/QR summary at
                closing.
              </p>

              <table className="mt-4 w-full text-left font-mono text-xs">
                <thead className="border-b border-slate-200 text-[10px] uppercase text-slate-400 dark:border-slate-800">
                  <tr>
                    <th className="py-2">Handler</th>
                    <th className="py-2">Direct QR (0%)</th>
                    <th className="py-2">Wallet Debit</th>
                    <th className="py-2 text-right">Txns</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/70 dark:divide-slate-800">
                  {eodSummary.map((row) => (
                    <tr key={row.actor}>
                      <td className="py-2.5 font-semibold">{row.actor}</td>
                      <td className="py-2.5 text-emerald-600 dark:text-emerald-400">
                        {fmt(row.qr)}
                      </td>
                      <td className="py-2.5 text-cyan-600 dark:text-cyan-400">
                        {fmt(row.wallet)}
                      </td>
                      <td className="py-2.5 text-right">{row.count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Immutable Double-Entry & RBAC Security Audit Log */}
          <div className="rounded-2xl border border-slate-200/90 bg-white p-5 dark:border-slate-800 dark:bg-obsidian-900">
            <h3 className="font-display text-base font-bold">
              Double-Entry Ledger &amp; RBAC Security Audit Log
            </h3>
            <div className="mt-3 max-h-56 overflow-y-auto divide-y divide-slate-200/70 font-mono text-xs dark:divide-slate-800">
              {ledger.map((item) => (
                <div key={item.id} className="flex flex-wrap items-center justify-between gap-2 py-2.5">
                  <div className="flex items-center gap-2.5">
                    <span className="text-slate-400">{item.timestamp}</span>
                    <span
                      className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                        item.type === 'RBAC_403_BLOCK'
                          ? 'bg-rose-500/20 text-rose-600 dark:text-rose-300'
                          : 'bg-cyan-500/15 text-cyan-700 dark:text-cyan-300'
                      }`}
                    >
                      {item.type}
                    </span>
                    <span className="font-semibold">{item.actor}</span>
                    <span className="text-slate-600 dark:text-slate-300">{item.detail}</span>
                  </div>
                  <span className="font-bold">
                    {item.amountUsd > 0 ? fmt(item.amountUsd) : 'BLOCKED'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
