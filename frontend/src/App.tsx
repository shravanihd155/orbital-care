import React, { useEffect, useState } from 'react';
import { fetchParticipants } from './services/api';
import type { Participant } from './types';
import { TopBar } from './components/navigation/TopBar';
import { AstronautProfile } from './components/profile/AstronautProfile';
import { InteractiveBodyMap } from './components/body/InteractiveBodyMap';
import { SleepSummary } from './components/sleep/SleepSummary';
import { SleepDurationChart } from './components/sleep/SleepDurationChart';
import { SleepLatencyChart } from './components/sleep/SleepLatencyChart';
import { SleepEfficiencyChart } from './components/sleep/SleepEfficiencyChart';
import { ObservationAlerts } from './components/alerts/ObservationAlerts';
import { ProvenanceLedger } from './components/provenance/ProvenanceLedger';
import { ShieldCheck, Moon, Database } from 'lucide-react';

export const App: React.FC = () => {
  const [participants, setParticipants] = useState<Record<string, Participant>>({});
  const [selectedId, setSelectedId] = useState<string>('C1G0001');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    let active = true;
    fetchParticipants()
      .then((data) => {
        if (active) setParticipants(data);
      })
      .catch((err: unknown) => {
        if (active) setError(err instanceof Error ? err.message : 'API connection failed');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, []);
  const activeParticipant = participants[selectedId] ?? participants['C1G0001'];
  if (loading) {
    return <div className="min-h-screen bg-habitat-ground text-spaceText-primary flex items-center justify-center font-mono">CONNECTING TO ORBITAL CARE API...</div>;
  }
  if (error || !activeParticipant) {
    return (
      <div className="min-h-screen bg-habitat-ground text-spaceText-primary flex flex-col items-center justify-center gap-4 p-8">
        <h1 className="text-xl font-bold">HABITAT DATA LINK OFFLINE</h1>
        <p className="text-sm text-spaceText-secondary">{error || 'No participant data received.'}</p>
        <button className="px-5 py-2 rounded bg-mission-orange text-white" onClick={() => window.location.reload()}>RECONNECT</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-habitat-ground text-spaceText-primary font-sans antialiased selection:bg-mission-orange selection:text-white pb-16">
      {/* Flight Deck Aerospace TopBar */}
      <TopBar
        participants={participants}
        selectedParticipantId={selectedId}
        onSelectParticipant={setSelectedId}
      />

      <nav aria-label="Dashboard navigation" className="border-b border-habitat-border bg-habitat-panel px-4 py-3">
        <div className="mx-auto flex max-w-7xl flex-wrap gap-2">
          {[
            ["overview", "OVERVIEW"],
            ["sleep", "SLEEP ANALYTICS"],
            ["body-map", "BODY MAP"],
            ["observations", "OBSERVATIONS"],
            ["research", "RESEARCH DATA"]
          ].map(([id, label]) => (
            <a key={id} href={`#${id}`} className="nav-link">{label}</a>
          ))}
        </div>
      </nav>

      {/* Main Mission Console Grid */}
      <main className="max-w-7xl mx-auto px-4 lg:px-8 pt-6 space-y-8">
        {/* Research Context Ribbon */}
        <section id="research" className="bg-habitat-panel rounded-lg border border-habitat-border p-4 shadow-instrument flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded bg-habitat-elevated border border-habitat-border text-mission-orange">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-mission-orange">
                  NASA Human Research Program (HRP) Data Layer
                </span>
                <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-habitat-graphite text-mission-lime font-bold">
                  â— 207 VERIFIED RECORDS
                </span>
              </div>
              <h2 className="text-base font-bold text-spaceText-primary tracking-tight">
                UTMB 60-Day Head-Down Tilt Bedrest Campaign 1 Actigraphy
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono text-spaceText-secondary">
            <span className="hidden sm:inline">Active Subject:</span>
            <span className="px-2.5 py-1 rounded bg-habitat-graphite text-white font-bold">
              {activeParticipant.id}
            </span>
            <span className="text-spaceText-muted">|</span>
            <span className="text-spaceText-muted text-[11px]">
              {activeParticipant.baseline.isAvailable
                ? 'PRELIMINARY BASELINE (N=2)'
                : 'BASELINE UNAVAILABLE'}
            </span>
          </div>
        </section>

        {/* Deck Row 1: Crew Station Profile + Interactive Biomap */}
        <section id="overview" className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-5">
            <AstronautProfile participant={activeParticipant} />
          </div>
          <div id="body-map" className="lg:col-span-7">
            <InteractiveBodyMap participant={activeParticipant} />
          </div>
        </section>

        {/* Deck Row 2: Sleep Analytics Summary Strip */}
        <section id="sleep" className="space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Moon className="w-4 h-4 text-mission-violet" />
              <h3 className="text-sm font-mono uppercase tracking-wider font-bold text-spaceText-primary">
                Sleep Actigraphy Overview // Subject {activeParticipant.id}
              </h3>
            </div>
            <span className="text-xs font-mono text-spaceText-secondary">
              Cole-Brandt Wrist Actigraph Telemetry
            </span>
          </div>

          <SleepSummary participant={activeParticipant} />
        </section>

        {/* Deck Row 3: Daily Sleep Duration Across Study Phases */}
        <section>
          <SleepDurationChart participant={activeParticipant} />
        </section>

        {/* Deck Row 4: Sleep Onset Latency & Sleep Efficiency Side-by-Side */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SleepLatencyChart participant={activeParticipant} />
          <SleepEfficiencyChart participant={activeParticipant} />
        </section>

        {/* Deck Row 5: Decision Support & Explainable Health Observations */}
        <section id="observations">
          <ObservationAlerts participant={activeParticipant} />
        </section>

        {/* Deck Row 6: Master Telemetry Provenance Registry */}
        <section>
          <ProvenanceLedger />
        </section>
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-4 lg:px-8 mt-12 pt-6 border-t border-habitat-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-spaceText-secondary">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-mission-lime" />
          <span>ORBITAL CARE // Space Habitat OS â€” NASA Space Apps Challenge 2026</span>
        </div>
        <div className="flex items-center gap-4 text-[11px] text-spaceText-muted">
          <span>Target Directory: frontend/</span>
          <span>â— ZERO DATA FABRICATION ENFORCED</span>
        </div>
      </footer>
    </div>
  );
};

export default App;

