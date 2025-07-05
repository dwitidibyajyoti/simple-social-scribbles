import { useState } from "react";
import { Feed } from "@/components/Feed";
import { UserForm } from "@/components/UserForm";
import { Button } from "@/components/ui/button";
import { MessageSquare, User } from "lucide-react";

const Index = () => {
  const [activeTab, setActiveTab] = useState<'feed' | 'form'>('feed');

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-primary">Social Scribbles</h1>

            {/* Navigation Tabs */}
            <div className="flex space-x-2">
              <Button
                variant={activeTab === 'feed' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveTab('feed')}
                className="flex items-center gap-2"
              >
                <MessageSquare className="h-4 w-4" />
                Feed
              </Button>
              <Button
                variant={activeTab === 'form' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveTab('form')}
                className="flex items-center gap-2"
              >
                <User className="h-4 w-4" />
                User Form
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        {activeTab === 'feed' ? <Feed /> : <UserForm />}
      </main>
    </div>
  );
};

export default Index;
