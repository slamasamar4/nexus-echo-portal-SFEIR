import { IntentPortal } from "@/components/IntentPortal";
import { AIAssistant } from "@/components/AIAssistant";

const Index = () => {
  return (
    <main className="relative min-h-screen bg-background">
      {/* Animated background gradient */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/5 rounded-full blur-3xl" />
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        <IntentPortal />
      </div>

      {/* Floating AI Assistant */}
      <AIAssistant />
    </main>
  );
};

export default Index;
