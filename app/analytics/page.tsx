"use client";

import {
  useEffect,
  useState,
} from 'react';

import {
  ArrowLeft,
  Download,
  Filter,
  Share2,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import AnalyticsChart from '@/components/analytics-chart';
import DateRangePicker from '@/components/date-range-picker';
import ResponseTable from '@/components/response-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import {apiClient} from '@/lib/api';

interface SurveySummary {
  id: string;
  title: string;
}
interface ResponseTableProps {
  responses: RawResponse[];
}

interface Question {
  id: string;
  question: string;
  type: "short-text" | "long-text" | "single-choice" | "rating" | "nps" | "multiple-choice";
  options?: string[];
}

interface SurveyDetail {
  id: string;
  title: string;
  description: string;
  questions: Question[];
  created_at: string;
  published_at: string | null;
}

interface RawResponse {
  id: string;
  answers: { [questionId: string]: any };
  completed_at: string;
  device?: string;
  location?: string;
  // ... any other metadata fields (e.g. browser, timeOfDay, etc.)
}

export default function AnalyticsPage() {
  const router = useRouter();
  const { toast } = useToast();
const params: { status?: string; page?: number; limit?: number } = {
  page: 1,
  limit: 50,
};
  // 1. Survey dropdown state
  const [allSurveys, setAllSurveys] = useState<SurveySummary[]>([]);
  const [isLoadingSurveys, setIsLoadingSurveys] = useState(true);
  const [surveyFetchError, setSurveyFetchError] = useState<string | null>(null);

  const [selectedSurvey, setSelectedSurvey] = useState<string>("");

  // 2. Date range picker state (for filtering)
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(new Date().setMonth(new Date().getMonth() - 1)), // default past month
    to: new Date(),
  });

  // 3. Active tab (overview / questions / responses / demographics)
  const [activeTab, setActiveTab] = useState<"overview" | "questions" | "responses" | "demographics">(
    "overview"
  );

  // 4. Survey detail + questions
  const [surveyDetail, setSurveyDetail] = useState<SurveyDetail | null>(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);

  // 5. Raw responses for selected survey (unpaged, but you can page if needed)
  const [rawResponses, setRawResponses] = useState<RawResponse[]>([]);
  const [isLoadingResponses, setIsLoadingResponses] = useState(false);
  const [responsesError, setResponsesError] = useState<string | null>(null);

  // 6. Derived metrics
  const totalResponses = rawResponses.length;
  const completionRate = surveyDetail
    ? Math.round((totalResponses / (rawResponses.length || 1)) * 100) // placeholder; adjust logic if you know total recipients
    : 0;

  // Compute average rating if there’s a rating question
  const ratingQuestionId = surveyDetail?.questions.find((q) => q.type === "rating")?.id;
  const npsQuestionId = surveyDetail?.questions.find((q) => q.type === "nps")?.id;

  // Build an object mapping questionId → { value → count }
  const questionCounts: Record<string, Record<string | number, number>> = {};
  rawResponses.forEach((resp) => {
    for (const [qid, answer] of Object.entries(resp.answers)) {
      if (!questionCounts[qid]) questionCounts[qid] = {};
      // For multiple‐choice, answer might be array; for rating/NPS, it might be a single value
      if (Array.isArray(answer)) {
        answer.forEach((val) => {
          questionCounts[qid][val] = (questionCounts[qid][val] || 0) + 1;
        });
      } else {
        questionCounts[qid][answer] = (questionCounts[qid][answer] || 0) + 1;
      }
    }
  });

  // Average rating
  const averageRating = ratingQuestionId
    ? (
        Object.entries(questionCounts[ratingQuestionId] || {}).reduce(
          (sum, [val, count]) => sum + Number(val) * count,
          0
        ) /
        (Object.values(questionCounts[ratingQuestionId] || {}).reduce((a, c) => a + c, 0) || 1)
      ).toFixed(1)
    : "0";

  // NPS: (Promoters – Detractors) / Total * 100
  const npsScore = npsQuestionId
    ? Math.round(
        ((questionCounts[npsQuestionId]?.["Promoters (9-10)"] || 0) -
          (questionCounts[npsQuestionId]?.["Detractors (0-6)"] || 0)) /
          (Object.values(questionCounts[npsQuestionId] || {}).reduce((a, c) => a + c, 0) || 1) *
          100
      )
    : 0;

  // Responses by day (filtered within dateRange)
  interface DayCount {
    date: string; // e.g. "2025-06-06"
    count: number;
  }
  const responsesByDay: DayCount[] = [];
  if (rawResponses.length > 0) {
    const bucket: Record<string, number> = {};
    rawResponses.forEach((resp) => {
      const dt = new Date(resp.completed_at);
      if (dt >= dateRange.from && dt <= dateRange.to) {
        const key = dt.toISOString().split("T")[0]; // "YYYY-MM-DD"
        bucket[key] = (bucket[key] || 0) + 1;
      }
    });
    Object.entries(bucket)
      .sort(([a], [b]) => (a < b ? -1 : 1))
      .forEach(([date, count]) => responsesByDay.push({ date, count }));
  }

  // Responses by device (expect resp.device to exist)
  interface DeviceCount {
    value: string;
    count: number;
  }
  const responsesByDevice: DeviceCount[] = [];
  if (rawResponses.length > 0) {
    const devBucket: Record<string, number> = {};
    rawResponses.forEach((resp) => {
      const dev = resp.device || "Unknown";
      devBucket[dev] = (devBucket[dev] || 0) + 1;
    });
    Object.entries(devBucket).forEach(([value, count]) => responsesByDevice.push({ value, count }));
  }

  // Responses by location
  interface LocationCount {
    value: string;
    count: number;
  }
  const responsesByLocation: LocationCount[] = [];
  if (rawResponses.length > 0) {
    const locBucket: Record<string, number> = {};
    rawResponses.forEach((resp) => {
      const loc = resp.location || "Unknown";
      locBucket[loc] = (locBucket[loc] || 0) + 1;
    });
    Object.entries(locBucket).forEach(([value, count]) => responsesByLocation.push({ value, count }));
  }

  // -------------- Effects --------------

  // A) Fetch the list of all surveys (for the <Select>)
  useEffect(() => {
    const loadSurveys = async () => {
      setIsLoadingSurveys(true);
      setSurveyFetchError(null);
      try {
        const res = await apiClient.getSurveys(params);
        if (res.success) {
          const arr = res.data.surveys.map((s: any) => ({
            id: s.id,
            title: s.title,
          }));
          setAllSurveys(arr);
          // If none selected yet, default to the first
          if (!selectedSurvey && arr.length > 0) {
            setSelectedSurvey(arr[0].id);
          }
        } else {
          setSurveyFetchError(res.message || "Failed to load surveys");
        }
      } catch (err: any) {
        setSurveyFetchError(err.message || "Failed to load surveys");
      } finally {
        setIsLoadingSurveys(false);
      }
    };
    loadSurveys();
  }, []);

  // B) Whenever selectedSurvey changes, fetch survey details AND all raw responses
  useEffect(() => {
    if (!selectedSurvey) return;

    const loadDetailAndResponses = async () => {
      setIsLoadingDetail(true);
      setDetailError(null);
      setIsLoadingResponses(true);
      setResponsesError(null);

      try {
        // Fetch survey metadata + questions
        const detailRes = await apiClient.getSurvey(selectedSurvey);
        if (detailRes.success) {
          setSurveyDetail(detailRes.data.survey as SurveyDetail);
        } else {
          setDetailError(detailRes.message || "Failed to load survey details");
        }
      } catch (err: any) {
        setDetailError(err.message || "Failed to load survey details");
      } finally {
        setIsLoadingDetail(false);
      }

      try {
        // Fetch all survey responses (this returns an array of RawResponse)
        const respRes = await apiClient.getSurveyResponses(selectedSurvey, { page: 1, limit: 1000 });
        if (respRes.success) {
          setRawResponses(respRes.data.responses as RawResponse[]);
        } else {
          setResponsesError(respRes.message || "Failed to load responses");
        }
      } catch (err: any) {
        setResponsesError(err.message || "Failed to load responses");
      } finally {
        setIsLoadingResponses(false);
      }
    };

    loadDetailAndResponses();
  }, [selectedSurvey]);

  // -------------- Render --------------

  return (
    <div className="container mx-auto py-10">
      {/* ───────────── Header & Controls ───────────── */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div className="flex items-center gap-2">
          <Link href="/surveys">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
            <p className="text-muted-foreground">View and analyze your survey responses</p>
          </div>
        </div>
        <div className="flex gap-2">
          {/* Survey selector dropdown */}
          <Select value={selectedSurvey} onValueChange={setSelectedSurvey}>
            <SelectTrigger className="w-[250px]">
              <SelectValue placeholder={isLoadingSurveys ? "Loading…" : "Select a survey"} />
            </SelectTrigger>
            <SelectContent>
              {isLoadingSurveys ? (
                <SelectItem value="" disabled>
                  Loading…
                </SelectItem>
              ) : surveyFetchError ? (
                <SelectItem value="" disabled>
                  Error loading surveys
                </SelectItem>
              ) : (
                allSurveys.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.title}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>

          <Button variant="outline" onClick={() => toast({ title: "Not yet implemented", description: "Sharing is not implemented yet." })}>
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => toast({ title: "Export PDF", description: "Exporting to PDF is not implemented yet." })}>
                Export as PDF
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => toast({ title: "Export CSV", description: "Exporting to CSV is not implemented yet." })}>
                Export as CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => toast({ title: "Export Excel", description: "Exporting to Excel is not implemented yet." })}>
                Export as Excel
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* ───────────── Survey Metadata & DateRange ───────────── */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <Card className="flex-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">{surveyDetail?.title || "Loading title…"}</CardTitle>
            <CardDescription>{surveyDetail?.description || ""}</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingDetail ? (
              <p>Loading survey details…</p>
            ) : detailError ? (
              <p className="text-destructive">{detailError}</p>
            ) : (
              <div className="flex flex-col md:flex-row justify-between gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Created On</p>
                  <p className="font-medium">
                    {surveyDetail
                      ? new Date(surveyDetail.created_at).toLocaleDateString()
                      : "—"}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Status</p>
                  <Badge className={`mt-1 ${surveyDetail?.published_at ? "bg-green-500" : "bg-gray-500"}`}>
                    {surveyDetail?.published_at ? "Active" : "Draft"}
                  </Badge>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="w-full md:w-auto">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Date Range</CardTitle>
          </CardHeader>
          <CardContent>
 <DateRangePicker
  dateRange={dateRange}
  onChange={(range) => {
    setDateRange({
      from: range.from ?? dateRange.from,
      to: range.to ?? dateRange.to,
    });
  }}
/>


          </CardContent>
        </Card>
      </div>

      {/* ───────────── Top Metrics ───────────── */}
      <div className="grid gap-6 md:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Responses</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingResponses ? (
              <p>Loading…</p>
            ) : responsesError ? (
              <p className="text-destructive">{responsesError}</p>
            ) : (
              <>
                <div className="text-2xl font-bold">{totalResponses}</div>
                <p className="text-xs text-muted-foreground">in selected date range</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
          </CardHeader>
          <CardContent>
            {ratingQuestionId ? (
              <div className="text-2xl font-bold">{averageRating}/5</div>
            ) : (
              <p>—</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Net Promoter Score</CardTitle>
          </CardHeader>
          <CardContent>
            {npsQuestionId ? (
              <>
                <div className="text-2xl font-bold">{npsScore}</div>
                <div className="flex justify-between mt-2 text-xs">
                  <span className="text-red-500">Detractors</span>
                  <span className="text-yellow-500">Passives</span>
                  <span className="text-green-500">Promoters</span>
                </div>
                <div className="flex h-2 mt-1 overflow-hidden rounded">
                  <div
                    className="bg-red-500"
                    style={{
                      width: `${
                        ((questionCounts[npsQuestionId]?.["Detractors (0-6)"] || 0) /
                          (Object.values(questionCounts[npsQuestionId] || {}).reduce((a, c) => a + c, 0) || 1)) *
                        100
                      }%`,
                    }}
                  ></div>
                  <div
                    className="bg-yellow-500"
                    style={{
                      width: `${
                        ((questionCounts[npsQuestionId]?.["Passives (7-8)"] || 0) /
                          (Object.values(questionCounts[npsQuestionId] || {}).reduce((a, c) => a + c, 0) || 1)) *
                        100
                      }%`,
                    }}
                  ></div>
                  <div
                    className="bg-green-500"
                    style={{
                      width: `${
                        ((questionCounts[npsQuestionId]?.["Promoters (9-10)"] || 0) /
                          (Object.values(questionCounts[npsQuestionId] || {}).reduce((a, c) => a + c, 0) || 1)) *
                        100
                      }%`,
                    }}
                  ></div>
                </div>
              </>
            ) : (
              <p>—</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            {totalResponses > 0 ? (
              <>
                <div className="text-2xl font-bold">{completionRate}%</div>
                <Progress value={completionRate} className="h-2 mt-2" />
              </>
            ) : (
              <p>—</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ───────────── Tabs ───────────── */}
      <Tabs value={activeTab}  onValueChange={(val: string) => {
    setActiveTab(val as "overview" | "questions" | "responses" | "demographics");
  }}
   className="w-full mb-8">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="questions">Questions</TabsTrigger>
          <TabsTrigger value="responses">Responses</TabsTrigger>
          <TabsTrigger value="demographics">Demographics</TabsTrigger>
        </TabsList>

        {/* ───────── Overview Tab ───────── */}
        <TabsContent value="overview">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Response Trends</CardTitle>
                <CardDescription>Daily survey responses over time</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingResponses ? (
                  <p>Loading chart…</p>
                ) : responsesError ? (
                  <p className="text-destructive">{responsesError}</p>
                ) : (
                  <AnalyticsChart
                    type="line"
                    data={{
                      labels: responsesByDay.map((item) => item.date),
                      datasets: [
                        {
                          label: "Responses",
                          data: responsesByDay.map((item) => item.count),
                          borderColor: "rgb(75, 192, 192)",
                          backgroundColor: "rgba(75, 192, 192, 0.5)",
                          tension: 0.3,
                        },
                      ],
                    }}
                  />
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Response by Device</CardTitle>
                <CardDescription>Distribution of responses by device type</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingResponses ? (
                  <p>Loading chart…</p>
                ) : responsesError ? (
                  <p className="text-destructive">{responsesError}</p>
                ) : (
                  <AnalyticsChart
                    type="doughnut"
                    data={{
                      labels: responsesByDevice.map((item) => item.value),
                      datasets: [
                        {
                          data: responsesByDevice.map((item) => item.count),
                          backgroundColor: [
                            "rgba(54, 162, 235, 0.6)",
                            "rgba(255, 99, 132, 0.6)",
                            "rgba(255, 206, 86, 0.6)",
                          ],
                          borderColor: ["rgba(54, 162, 235, 1)", "rgba(255, 99, 132, 1)", "rgba(255, 206, 86, 1)"],
                          borderWidth: 1,
                        },
                      ],
                    }}
                  />
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Response by Location</CardTitle>
                <CardDescription>Top regions by number of responses</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingResponses ? (
                  <p>Loading chart…</p>
                ) : responsesError ? (
                  <p className="text-destructive">{responsesError}</p>
                ) : (
                  <AnalyticsChart
                    type="bar"
                    data={{
                      labels: responsesByLocation.map((item) => item.value),
                      datasets: [
                        {
                          label: "Responses",
                          data: responsesByLocation.map((item) => item.count),
                          backgroundColor: "rgba(153, 102, 255, 0.6)",
                          borderColor: "rgba(153, 102, 255, 1)",
                          borderWidth: 1,
                        },
                      ],
                    }}
                  />
                )}
              </CardContent>
            </Card>

            {/* You can add more overview cards here… */}
          </div>
        </TabsContent>

        {/* ───────── Questions Tab ───────── */}
        <TabsContent value="questions">
          {isLoadingDetail ? (
            <p>Loading questions…</p>
          ) : detailError ? (
            <p className="text-destructive">{detailError}</p>
          ) : surveyDetail ? (
            <div className="space-y-6">
              {surveyDetail.questions.map((question) => (
                <Card key={question.id}>
                  <CardHeader>
                    <CardTitle>{question.question}</CardTitle>
                    <CardDescription>
                      {question.type === "rating"
                        ? "Rating question (1–5)"
                        : question.type === "nps"
                        ? "Net Promoter Score (0–10)"
                        : question.type === "multiple-choice"
                        ? "Multiple choice question"
                        : "Open text question"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-6 md:grid-cols-2">
                      <div>
                        {question.type === "rating" && (
                          <div className="space-y-4">
                            {Object.entries(questionCounts[question.id] || {}).map(([val, count]) => (
                              <div key={val} className="space-y-1">
                                <div className="flex justify-between text-sm">
                                  <span className="flex items-center">
                                    <span className="font-medium mr-2">{val} Star{val !== "1" && "s"}</span>
                                    {Array.from({ length: Number(val) }).map((_, i) => (
                                      <svg
                                        key={i}
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="currentColor"
                                        className="h-4 w-4 text-yellow-500"
                                      >
                                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                      </svg>
                                    ))}
                                  </span>
                                  <span>
                                    {count} (
                                    {Math.round((count / (totalResponses || 1)) * 100)}
                                    %)
                                  </span>
                                </div>
                                <Progress value={(count / (totalResponses || 1)) * 100} className="h-2" />
                              </div>
                            ))}
                          </div>
                        )}

                        {question.type === "nps" && (
                          <div className="space-y-4">
                            {["Detractors (0-6)", "Passives (7-8)", "Promoters (9-10)"].map((category) => {
                              const cnt = questionCounts[question.id]?.[category] || 0;
                              const pct = Math.round((cnt / (totalResponses || 1)) * 100);
                              const colorClass =
                                category.startsWith("Detractors") ? "bg-red-500" : category.startsWith("Passives") ? "bg-yellow-500" : "bg-green-500";
                              return (
                                <div key={category} className="space-y-1">
                                  <div className="flex justify-between text-sm">
                                    <span className={`font-medium ${colorClass.replace("bg-", "text-")}`}>{category}</span>
                                    <span>
                                      {cnt} ({pct}%)
                                    </span>
                                  </div>
                                  <Progress value={pct} className={`h-2 ${colorClass}`} />
                                </div>
                              );
                            })}
                          </div>
                        )}

                        {question.type === "multiple-choice" && (
                          <div className="space-y-4">
                            {Object.entries(questionCounts[question.id] || {}).map(([val, count]) => {
                              const pct = Math.round((count / (totalResponses || 1)) * 100);
                              return (
                                <div key={val} className="space-y-1">
                                  <div className="flex justify-between text-sm">
                                    <span className="font-medium">{val}</span>
                                    <span>
                                      {count} ({pct}%)
                                    </span>
                                  </div>
                                  <Progress value={pct} className="h-2" />
                                </div>
                              );
                            })}
                          </div>
                        )}

                        {question.type === "short-text" || question.type === "long-text" ? (
                          <p className="text-sm text-muted-foreground">Text responses cannot be charted here.</p>
                        ) : null}
                      </div>

                      <div>
                        <AnalyticsChart
                          type={question.type === "multiple-choice" ? "bar" : "pie"}
                          data={{
                            labels:
                              question.type === "rating"
                                ? Object.keys(questionCounts[question.id] || {}).map((val) => `${val} Star${val !== "1" ? "s" : ""}`)
                                : Object.keys(questionCounts[question.id] || {}),
                            datasets: [
                              {
                                label: "Responses",
                                data: Object.values(questionCounts[question.id] || {}),
                                backgroundColor:
                                  question.type === "nps"
                                    ? ["rgba(255, 99, 132, 0.6)", "rgba(255, 206, 86, 0.6)", "rgba(75, 192, 192, 0.6)"]
                                    : ["rgba(255, 99, 132, 0.6)", "rgba(54, 162, 235, 0.6)", "rgba(75, 192, 192, 0.6)", "rgba(153, 102, 255, 0.6)", "rgba(255, 159, 64, 0.6)"],
                                borderColor:
                                  question.type === "nps"
                                    ? ["rgba(255, 99, 132, 1)", "rgba(255, 206, 86, 1)", "rgba(75, 192, 192, 1)"]
                                    : ["rgba(255, 99, 132, 1)", "rgba(54, 162, 235, 1)", "rgba(75, 192, 192, 1)", "rgba(153, 102, 255, 1)", "rgba(255, 159, 64, 1)"],
                                borderWidth: 1,
                              },
                            ],
                          }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p>Select a survey to view its questions.</p>
          )}
        </TabsContent>

        {/* ───────── Responses Tab ───────── */}
        <TabsContent value="responses">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <CardTitle>Individual Responses</CardTitle>
                  <CardDescription>View and filter individual survey responses</CardDescription>
                </div>
                <div className="flex gap-2">
                  <div className="relative">
                    <Input
                      placeholder="Search responses..."
                      className="pl-8 w-[250px]"
                      // you can add onChange handler for a real search filter
                    />
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"
                    >
                      <circle cx="11" cy="11" r="8" />
                      <path d="m21 21-4.3-4.3" />
                    </svg>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline">
                        <Filter className="mr-2 h-4 w-4" />
                        Filter
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[200px]">
                      <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                      <DropdownMenuSeparator />

                      {/* Example: filter by rating */}
                      <div className="p-2">
                        <Label htmlFor="rating-filter" className="text-xs">
                          Rating
                        </Label>
                        <Select>
                          <SelectTrigger id="rating-filter">
                            <SelectValue placeholder="Any rating" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="any">Any rating</SelectItem>
                            <SelectItem value="5">5 stars</SelectItem>
                            <SelectItem value="4">4 stars</SelectItem>
                            <SelectItem value="3">3 stars</SelectItem>
                            <SelectItem value="2">2 stars</SelectItem>
                            <SelectItem value="1">1 star</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Example: filter by device */}
                      <div className="p-2">
                        <Label htmlFor="device-filter" className="text-xs">
                          Device
                        </Label>
                        <Select>
                          <SelectTrigger id="device-filter">
                            <SelectValue placeholder="Any device" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="any">Any device</SelectItem>
                            <SelectItem value="desktop">Desktop</SelectItem>
                            <SelectItem value="mobile">Mobile</SelectItem>
                            <SelectItem value="tablet">Tablet</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <DropdownMenuSeparator />
                      <div className="p-2">
                        <Button size="sm" className="w-full" onClick={() => toast({ title: "Filtering not implemented", description: "" })}>
                          Apply Filters
                        </Button>
                      </div>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* ResponseTable should accept `rawResponses` and render them */}
              {isLoadingResponses ? (
                <p>Loading responses…</p>
              ) : responsesError ? (
                <p className="text-destructive">{responsesError}</p>
              ) : (
                // <ResponseTable responses={rawResponses} />
                <ResponseTable responses={rawResponses}/>
              )}
            </CardContent>
            <CardFooter className="flex items-center justify-between border-t px-6 py-3">
              <div className="text-sm text-muted-foreground">
                Showing <strong>{rawResponses.length}</strong> of <strong>{rawResponses.length}</strong> responses
              </div>
              <div className="flex gap-1">
                <Button variant="outline" size="sm" disabled>
                  Previous
                </Button>
                <Button variant="outline" size="sm" disabled>
                  Next
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* ───────── Demographics Tab ───────── */}
        <TabsContent value="demographics">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Response by Location</CardTitle>
                <CardDescription>Geographic distribution of responses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px] w-full bg-muted rounded-md flex items-center justify-center">
                  <p className="text-muted-foreground">
                    Map visualization would appear here
                  </p>
                </div>
                <Separator className="my-4" />
                {isLoadingResponses ? (
                  <p>Loading…</p>
                ) : responsesError ? (
                  <p className="text-destructive">{responsesError}</p>
                ) : (
                  <div className="space-y-4">
                    {responsesByLocation.map((location) => {
                      const pct = Math.round((location.count / (totalResponses || 1)) * 100);
                      return (
                        <div key={location.value} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="font-medium">{location.value}</span>
                            <span>
                              {location.count} ({pct}%)
                            </span>
                          </div>
                          <Progress value={pct} className="h-2" />
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Response by Device</CardTitle>
                <CardDescription>Distribution of responses by device type</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingResponses ? (
                  <p>Loading chart…</p>
                ) : responsesError ? (
                  <p className="text-destructive">{responsesError}</p>
                ) : (
                  <>
                    <div className="flex justify-center mb-6">
                      <AnalyticsChart
                        type="doughnut"
                        data={{
                          labels: responsesByDevice.map((item) => item.value),
                          datasets: [
                            {
                              data: responsesByDevice.map((item) => item.count),
                              backgroundColor: [
                                "rgba(54, 162, 235, 0.6)",
                                "rgba(255, 99, 132, 0.6)",
                                "rgba(255, 206, 86, 0.6)",
                              ],
                              borderColor: [
                                "rgba(54, 162, 235, 1)",
                                "rgba(255, 99, 132, 1)",
                                "rgba(255, 206, 86, 1)",
                              ],
                              borderWidth: 1,
                            },
                          ],
                        }}
                      />
                    </div>
                    <div className="space-y-4">
                      {responsesByDevice.map((device) => {
                        const pct = Math.round((device.count / (totalResponses || 1)) * 100);
                        return (
                          <div key={device.value} className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span className="font-medium">{device.value}</span>
                              <span>
                                {device.count} ({pct}%)
                              </span>
                            </div>
                            <Progress value={pct} className="h-2" />
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader> 
                <CardTitle>Response by Time of Day</CardTitle>
                <CardDescription>When respondents are most active</CardDescription>
              </CardHeader>
              <CardContent>
                <AnalyticsChart
                  type="bar"
                  data={{
                    labels: ["Morning", "Afternoon", "Evening", "Night"],
                    datasets: [
                      {
                        label: "Responses",
                        data: [65, 92, 53, 35], // replace with real data if you track time-of-day in `rawResponses`
                        backgroundColor: "rgba(153, 102, 255, 0.6)",
                        borderColor: "rgba(153, 102, 255, 1)",
                        borderWidth: 1,
                      },
                    ],
                  }}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Response by Browser</CardTitle>
                <CardDescription>Browser usage among respondents</CardDescription>
              </CardHeader>
              <CardContent>
                <AnalyticsChart
                  type="pie"
                  data={{
                    labels: ["Chrome", "Safari", "Firefox", "Edge", "Other"],
                    datasets: [
                      {
                        data: [125, 65, 30, 20, 5], // replace with real data if you track `resp.browser` in `rawResponses`
                        backgroundColor: [
                          "rgba(255, 99, 132, 0.6)",
                          "rgba(54, 162, 235, 0.6)",
                          "rgba(255, 206, 86, 0.6)",
                          "rgba(75, 192, 192, 0.6)",
                          "rgba(153, 102, 255, 0.6)",
                        ],
                        borderColor: [
                          "rgba(255, 99, 132, 1)",
                          "rgba(54, 162, 235, 1)",
                          "rgba(255, 206, 86, 1)",
                          "rgba(75, 192, 192, 1)",
                          "rgba(153, 102, 255, 1)",
                        ],
                        borderWidth: 1,
                      },
                    ],
                  }}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}