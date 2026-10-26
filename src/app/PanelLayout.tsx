import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { UNIT } from "@/features/panel/config";
import { Status } from "@/features/panel/components/Status";
import { NAVIGATION, type PageId } from "@/features/panel/navigation";

interface PanelLayoutProps {
  readonly page: PageId;
  readonly unitRunning: boolean;
  readonly maintenanceAcknowledged: boolean;
  readonly onNavigate: (page: PageId) => void;
  readonly children: ReactNode;
}

export function PanelLayout({
  page,
  unitRunning,
  maintenanceAcknowledged,
  onNavigate,
  children,
}: PanelLayoutProps) {
  const activePage = NAVIGATION.find((item) => item.id === page)!;
  return (
    <div className="app-shell">
      <aside className="sidebar" aria-label="Operator panel sidebar">
        <div className="sidebar-brand">
          <img
            className="halliburton-logo"
            src={`${import.meta.env.BASE_URL}halliburton.svg`}
            alt="Halliburton"
            width="176"
            height="13"
          />
        </div>
        <nav className="side-nav" aria-label="Main navigation">
          {NAVIGATION.map(({ id, label, icon: Icon }) => (
            <Button
              key={id}
              variant="ghost"
              className={`nav-button ${page === id ? "nav-active" : ""}`}
              aria-current={page === id ? "page" : undefined}
              onClick={() => onNavigate(id)}
            >
              <span className="nav-icon">
                <Icon size={24} strokeWidth={1.7} />
                {id === "ventilation" && !maintenanceAcknowledged && (
                  <span className="nav-notice" />
                )}
              </span>
              <span>{label}</span>
            </Button>
          ))}
        </nav>
      </aside>
      <header className="app-header">
        <div className="brand">
          <div className="unit-identity">
            <strong>{UNIT.name}</strong>
            <p>{UNIT.reference}</p>
          </div>
        </div>
        <div className="header-state">
          <Badge variant="outline">Demo</Badge>
        </div>
      </header>
      <main id="main-content" className="main-content">
        <div className="page-heading">
          <div>
            <h1>{activePage.label}</h1>
          </div>
          <Status neutral={!unitRunning}>
            {unitRunning ? "Unit running" : "Unit stopped"}
          </Status>
        </div>
        {children}
      </main>
      <footer className="app-footer">
        <span>
          <span className="simulation-dot" />
          Simulation · No PLC connected
        </span>
        <span>{UNIT.panel}</span>
      </footer>
    </div>
  );
}
