import { useState } from "react";
import Icon from "@/components/ui/icon";
import { Section, navItems } from "@/components/constants";
import TryOnSection from "@/components/TryOnSection";
import ProfileSection from "@/components/ProfileSection";
import { ScanSection, FavoritesSection, HistorySection, ShareSection } from "@/components/OtherSections";

export default function Index() {
  const [activeSection, setActiveSection] = useState<Section>("tryon");
  const [rotateY, setRotateY] = useState(0);

  return (
    <div className="min-h-screen bg-background flex flex-col overflow-hidden relative">
      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, hsl(186,80%,54%) 0%, transparent 70%)" }} />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] rounded-full opacity-6"
          style={{ background: "radial-gradient(circle, hsl(200,70%,50%) 0%, transparent 70%)" }} />
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-6 pt-8 pb-4">
        <div>
          <h1 className="font-display text-3xl font-light tracking-tight text-gradient">FitRoom</h1>
          <p className="text-muted-foreground text-xs font-body tracking-widest uppercase mt-0.5">Виртуальная примерочная</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="glass w-9 h-9 rounded-full flex items-center justify-center hover:glass-active transition-all duration-300">
            <Icon name="Bell" size={15} className="text-muted-foreground" />
          </button>
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-teal to-primary/50 flex items-center justify-center glow-teal-sm">
            <span className="text-background text-xs font-bold font-body">АМ</span>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 relative z-10 px-5 pb-28 overflow-y-auto">
        {activeSection === "tryon" && <TryOnSection rotateY={rotateY} setRotateY={setRotateY} />}
        {activeSection === "profile" && <ProfileSection />}
        {activeSection === "scan" && <ScanSection />}
        {activeSection === "favorites" && <FavoritesSection />}
        {activeSection === "history" && <HistorySection />}
        {activeSection === "share" && <ShareSection />}
      </main>

      {/* Bottom navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-20">
        <div className="mx-4 mb-5 glass rounded-2xl px-2 py-3 glow-teal-sm">
          <div className="flex items-center justify-around">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all duration-300 ${
                    isActive ? "glass-active nav-item-active" : "hover:bg-white/5"
                  }`}
                >
                  <Icon
                    name={item.icon}
                    size={18}
                    className={`transition-colors duration-300 ${isActive ? "text-teal" : "text-muted-foreground"}`}
                  />
                  <span className={`text-[9px] font-body font-medium tracking-wide transition-colors duration-300 ${
                    isActive ? "text-teal" : "text-muted-foreground"
                  }`}>
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>
    </div>
  );
}