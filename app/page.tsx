"use client";

import {
  useEffect,
  useState,
} from 'react';

import {
  ArrowUpRight,
  BarChart3,
  BookOpen,
  CheckCircle2,
  FileText,
  Target,
  Users,
  Zap,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import BestPracticesModal from '@/components/best-practices-modal';
import OnboardingModal from '@/components/onboarding-modal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { apiClient } from '@/lib/api';

interface SurveySummary {
  id: string;
  title: string;
  status: string;
  questions_count: number;
  responses_count: number;
  created_at: string;
  updated_at: string;
  published_at: string | null;
}

export default function HomePage() {
  const router = useRouter();
  const { toast } = useToast();

  // Tabs state
  const [activeTab, setActiveTab] = useState<"overview" | "responses" | "engagement">(
    "overview"
  );

  // Modal state
  const [bestPracticesOpen, setBestPracticesOpen] = useState(false);

  // Data from API
  const [allSurveys, setAllSurveys] = useState<SurveySummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Derived metrics
  const totalSurveys = allSurveys.length;
  const totalResponses = allSurveys.reduce((sum, s) => sum + s.responses_count, 0);
  const activeSurveys = allSurveys.filter((s) => s.status === "active");

  // Dummy “target” for health calculation
  const dummyTargetResponses = 500;

  useEffect(() => {
    const fetchSurveys = async () => {
      setIsLoading(true);
      setFetchError(null);

      try {
        const response = await apiClient.getSurveys();
        if (response.success) {
          setAllSurveys(response.data.surveys as SurveySummary[]);
        } else {
          setFetchError(response.message || "Failed to load surveys.");
        }
      } catch (err: any) {
        console.error("Error fetching surveys:", err);
        setFetchError(err.message || "Failed to load surveys.");
      } finally {
        setIsLoading(false);
      }
    };
    if(!localStorage.getItem("token")){
      router.push("/login");
    }
    fetchSurveys();
  }, []);

  // Quick Action handler
  const handleQuickAction = (action: string) => {
    switch (action) {
      case "create-survey":
        router.push("/surveys/create");
        break;
      case "templates":
        router.push("/surveys/templates");
        break;
      case "analytics":
        router.push("/analytics");
        break;
      case "best-practices":
        setBestPracticesOpen(true);
        break;
      default:
        break;
    }
  };

  return (
    <div className="flex-1 bg-gradient-to-b from-background to-muted/10 min-h-screen">
      <div className="container py-6">
        <div className="grid gap-6 md:grid-cols-7">
          {/* === Main Content Area === */}
          <div className="md:col-span-5 space-y-6">
            {/* Analytics Overview */}
            <Card className="bg-white shadow-sm border-gray-200">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle className="text-xl text-gray-900">Analytics Overview</CardTitle>
                  <CardDescription className="text-gray-600">
                    Survey performance metrics
                  </CardDescription>
                </div>
                <Link href="/analytics">
                  <Button variant="ghost" size="sm" className="gap-1">
                    View Detailed Analytics
                    <ArrowUpRight className="h-4 w-4" />
                  </Button>
                </Link>
              </CardHeader>

              <CardContent>
                <Tabs
                  value={activeTab}
                  onValueChange={(val) =>
                    setActiveTab(val as "overview" | "responses" | "engagement")
                  }
                >
                  <TabsList className="mb-4">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="responses">Responses</TabsTrigger>
                    <TabsTrigger value="engagement">Engagement</TabsTrigger>
                  </TabsList>

                  {isLoading ? (
                    <div className="flex h-40 items-center justify-center">
                      <p className="text-muted-foreground">Loading...</p>
                    </div>
                  ) : fetchError ? (
                    <div className="flex h-40 items-center justify-center">
                      <p className="text-destructive">{fetchError}</p>
                    </div>
                  ) : (
                    <>
                      {/* ===== Overview Tab ===== */}
                      <TabsContent value="overview" className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                          <Card className="bg-gray-50">
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="text-sm font-medium text-gray-700">Total Surveys</p>
                                  <p className="text-2xl font-bold">{totalSurveys}</p>
                                </div>
                                <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                                  <FileText className="h-5 w-5 text-gray-500" />
                                </div>
                              </div>
                            </CardContent>
                          </Card>

                          <Card className="bg-gray-50">
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="text-sm font-medium text-gray-700">Total Responses</p>
                                  <p className="text-2xl font-bold">{totalResponses}</p>
                                </div>
                                <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                                  <Users className="h-5 w-5 text-gray-500" />
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>

                        <div className="h-[240px] rounded-lg border bg-gray-50 flex items-center justify-center">
                          <BarChart3 className="h-8 w-8 text-muted-foreground" />
                          <span className="ml-2 text-muted-foreground">Response trend chart</span>
                        </div>
                      </TabsContent>

                      {/* ===== Responses Tab ===== */}
                      <TabsContent value="responses" className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-3">
                          <Card className="bg-gray-50">
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="text-sm font-medium text-muted-foreground">Today</p>
                                  <p className="text-2xl font-bold">—</p>
                                </div>
                                <Badge>—</Badge>
                              </div>
                            </CardContent>
                          </Card>

                          <Card className="bg-gray-50">
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="text-sm font-medium text-muted-foreground">This Week</p>
                                  <p className="text-2xl font-bold">—</p>
                                </div>
                                <Badge>—</Badge>
                              </div>
                            </CardContent>
                          </Card>

                          <Card className="bg-gray-50">
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="text-sm font-medium text-muted-foreground">This Month</p>
                                  <p className="text-2xl font-bold">—</p>
                                </div>
                                <Badge>—</Badge>
                              </div>
                            </CardContent>
                          </Card>
                        </div>

                        <div className="h-[240px] rounded-lg border bg-gray-50 flex items-center justify-center">
                          <BarChart3 className="h-8 w-8 text-muted-foreground" />
                          <span className="ml-2 text-muted-foreground">Response distribution chart</span>
                        </div>
                      </TabsContent>

                      {/* ===== Engagement Tab ===== */}
                      <TabsContent value="engagement" className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                          <Card className="bg-gray-50">
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="text-sm font-medium text-muted-foreground">Completion Rate</p>
                                  <p className="text-2xl font-bold">
                                    {totalSurveys > 0
                                      ? Math.round(
                                          (totalResponses / (totalSurveys * dummyTargetResponses)) * 100
                                        ) + "%"
                                      : "—"}
                                  </p>
                                </div>
                                <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                                  <CheckCircle2 className="h-5 w-5 text-gray-500" />
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>

                        <div className="h-[240px] rounded-lg border bg-gray-50 flex items-center justify-center">
                          <BarChart3 className="h-8 w-8 text-muted-foreground" />
                          <span className="ml-2 text-muted-foreground">Engagement metrics chart</span>
                        </div>
                      </TabsContent>
                    </>
                  )}
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* === Sidebar === */}
          <div className="md:col-span-2 space-y-6">
            {/* Active Surveys */}
            <Card className="bg-white shadow-sm border-gray-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-gray-900">Active Surveys</CardTitle>
                <CardDescription className="text-gray-600">Currently running surveys</CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {isLoading ? (
                  <p className="text-sm text-muted-foreground">Loading…</p>
                ) : fetchError ? (
                  <p className="text-sm text-destructive">{fetchError}</p>
                ) : activeSurveys.length === 0 ? (
                  <p className="text-sm text-gray-600">No active surveys found.</p>
                ) : (
                  activeSurveys.map((survey) => (
                    <div
                      key={survey.id}
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 cursor-pointer border border-gray-100"
                      onClick={() => router.push(`/surveys/preview/${survey.id}`)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                        <span className="font-medium text-gray-900">{survey.title}</span>
                      </div>
                      <Badge variant="secondary">{survey.responses_count}</Badge>
                    </div>
                  ))
                )}

                <Button variant="outline" className="w-full" asChild>
                  <Link href="/surveys">View All Surveys</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Survey Health */}
            <Card className="bg-white shadow-sm border-gray-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-gray-900">Survey Health</CardTitle>
                <CardDescription className="text-gray-600">Performance indicators</CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {isLoading ? (
                  <p className="text-sm text-muted-foreground">Loading…</p>
                ) : fetchError ? (
                  <p className="text-sm text-destructive">{fetchError}</p>
                ) : activeSurveys.length === 0 ? (
                  <p className="text-sm text-gray-600">No health data available.</p>
                ) : (
                  activeSurveys.map((survey) => {
                    const completionPercent = survey.responses_count
                      ? Math.min(
                          Math.round((survey.responses_count / dummyTargetResponses) * 100),
                          100
                        )
                      : 0;

                    const statusLabel =
                      completionPercent >= 75
                        ? "Healthy"
                        : completionPercent >= 40
                        ? "Needs Attention"
                        : "Critical";

                    return (
                      <div key={survey.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-700">{survey.title}</span>
                          <span className="text-sm font-medium text-gray-900">{statusLabel}</span>
                        </div>
                        <Progress value={completionPercent} className="h-2" />
                        <div className="flex justify-between text-xs text-gray-600">
                          <span>{completionPercent}% completion</span>
                          <span>{survey.responses_count} responses</span>
                        </div>
                      </div>
                    );
                  })
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* === Quick Actions === */}
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4 text-gray-900">Quick Actions</h2>
          <div className="grid gap-4 md:grid-cols-4">
            {/* Create Survey */}
            <Card
              className="bg-gradient-to-br from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 border-gray-200 transition-colors cursor-pointer shadow-sm"
              onClick={() => handleQuickAction("create-survey")}
            >
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="rounded-full bg-gray-200 p-3 mb-3">
                  <Zap className="h-6 w-6 text-gray-700" />
                </div>
                <h3 className="font-medium mb-1 text-gray-900">Create Survey</h3>
                <p className="text-sm text-gray-600">Build a new survey from scratch</p>
              </CardContent>
            </Card>

            {/* Templates */}
            <Card
              className="bg-gradient-to-br from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 border-gray-200 transition-colors cursor-pointer shadow-sm"
              onClick={() => handleQuickAction("templates")}
            >
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="rounded-full bg-gray-200 p-3 mb-3">
                  <Target className="h-6 w-6 text-gray-700" />
                </div>
                <h3 className="font-medium mb-1 text-gray-900">Templates</h3>
                <p className="text-sm text-gray-600">Use pre-built survey templates</p>
              </CardContent>
            </Card>

            {/* View Analytics */}
            <Card
              className="bg-gradient-to-br from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 border-gray-200 transition-colors cursor-pointer shadow-sm"
              onClick={() => handleQuickAction("analytics")}
            >
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="rounded-full bg-gray-200 p-3 mb-3">
                  <BarChart3 className="h-6 w-6 text-gray-700" />
                </div>
                <h3 className="font-medium mb-1 text-gray-900">View Analytics</h3>
                <p className="text-sm text-gray-600">Check your survey performance</p>
              </CardContent>
            </Card>

            {/* Best Practices */}
            <Card
              className="bg-gradient-to-br from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 border-gray-200 transition-colors cursor-pointer shadow-sm"
              onClick={() => handleQuickAction("best-practices")}
            >
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="rounded-full bg-gray-200 p-3 mb-3">
                  <BookOpen className="h-6 w-6 text-gray-700" />
                </div>
                <h3 className="font-medium mb-1 text-gray-900">Best Practices</h3>
                <p className="text-sm text-gray-600">Learn survey optimization tips</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <OnboardingModal />
      <BestPracticesModal open={bestPracticesOpen} onOpenChange={setBestPracticesOpen} />
    </div>
  );
}