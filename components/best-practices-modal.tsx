"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, CheckCircle2, Clock, Target, Users, Zap } from "lucide-react"

interface BestPracticesModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function BestPracticesModal({ open, onOpenChange }: BestPracticesModalProps) {
  const [activeTab, setActiveTab] = useState("design")

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <BookOpen className="h-6 w-6 text-primary" />
            Survey Best Practices
          </DialogTitle>
          <DialogDescription>Optimize your surveys for better response rates and more accurate data</DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value="design">Survey Design</TabsTrigger>
            <TabsTrigger value="distribution">Distribution</TabsTrigger>
            <TabsTrigger value="engagement">Engagement</TabsTrigger>
            <TabsTrigger value="analysis">Analysis</TabsTrigger>
          </TabsList>

          {/* Survey Design Tab */}
          <TabsContent value="design" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  Keep it Focused
                </CardTitle>
                <CardDescription>Maintain a clear objective for your survey</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <p>
                  Every question should serve a specific purpose related to your survey goal. Remove any questions that
                  don't directly contribute to your objective.
                </p>
                <div className="bg-muted p-3 rounded-md mt-2">
                  <p className="font-medium">Pro Tip:</p>
                  <p className="text-sm">
                    Before adding a question, ask yourself: "How will this answer help me achieve my survey goal?"
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  Respect Time Constraints
                </CardTitle>
                <CardDescription>Keep surveys short and to the point</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <p>
                  Aim for surveys that take less than 5 minutes to complete. Completion rates drop significantly after
                  this threshold.
                </p>
                <div className="bg-muted p-3 rounded-md mt-2">
                  <p className="font-medium">Pro Tip:</p>
                  <p className="text-sm">
                    Include a progress indicator so respondents know how much time they have left.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  Use Clear Language
                </CardTitle>
                <CardDescription>Write questions that are easy to understand</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <p>
                  Avoid jargon, double negatives, and complex sentence structures. Questions should be straightforward
                  and unambiguous.
                </p>
                <div className="bg-muted p-3 rounded-md mt-2">
                  <p className="font-medium">Pro Tip:</p>
                  <p className="text-sm">
                    Test your survey with a small group before full distribution to identify any confusing questions.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Distribution Tab */}
          <TabsContent value="distribution" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Target the Right Audience
                </CardTitle>
                <CardDescription>Ensure your survey reaches the most relevant respondents</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <p>
                  Define your target audience clearly and use appropriate channels to reach them. Quality responses from
                  the right audience are more valuable than a high quantity of irrelevant responses.
                </p>
                <div className="bg-muted p-3 rounded-md mt-2">
                  <p className="font-medium">Pro Tip:</p>
                  <p className="text-sm">
                    Use screening questions at the beginning to ensure respondents match your target criteria.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  Timing Matters
                </CardTitle>
                <CardDescription>Send surveys at optimal times for higher response rates</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <p>
                  Research shows that Tuesday, Wednesday, and Thursday mornings typically yield the highest response
                  rates for business surveys. For consumer surveys, weekends can be effective.
                </p>
                <div className="bg-muted p-3 rounded-md mt-2">
                  <p className="font-medium">Pro Tip:</p>
                  <p className="text-sm">
                    Schedule follow-up reminders 3-4 days after the initial invitation for those who haven't responded.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Engagement Tab */}
          <TabsContent value="engagement" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  Personalize Your Approach
                </CardTitle>
                <CardDescription>Make respondents feel valued</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <p>
                  Address respondents by name when possible and explain why their specific feedback is important.
                  Personalized invitations can increase response rates by up to 30%.
                </p>
                <div className="bg-muted p-3 rounded-md mt-2">
                  <p className="font-medium">Pro Tip:</p>
                  <p className="text-sm">
                    Reference previous interactions or purchases when relevant to show you value their specific
                    relationship.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  Offer Incentives Wisely
                </CardTitle>
                <CardDescription>Motivate participation without biasing results</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <p>
                  Consider offering incentives like discount codes, gift cards, or donations to charity. However, ensure
                  the incentive doesn't attract people who are only interested in the reward.
                </p>
                <div className="bg-muted p-3 rounded-md mt-2">
                  <p className="font-medium">Pro Tip:</p>
                  <p className="text-sm">
                    For B2B surveys, offering access to the aggregated results can be a compelling incentive.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analysis Tab */}
          <TabsContent value="analysis" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  Look Beyond Averages
                </CardTitle>
                <CardDescription>Dig deeper into your data</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <p>
                  While averages provide a quick overview, they can hide important insights. Segment your data by
                  demographics, behavior patterns, or other relevant factors.
                </p>
                <div className="bg-muted p-3 rounded-md mt-2">
                  <p className="font-medium">Pro Tip:</p>
                  <p className="text-sm">
                    Use cross-tabulation to identify correlations between different questions and uncover hidden
                    patterns.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  Account for Response Bias
                </CardTitle>
                <CardDescription>Recognize the limitations of your data</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <p>
                  Be aware that your respondents may not perfectly represent your entire target population. Consider who
                  might be missing from your sample and how that affects your conclusions.
                </p>
                <div className="bg-muted p-3 rounded-md mt-2">
                  <p className="font-medium">Pro Tip:</p>
                  <p className="text-sm">
                    Compare respondent demographics with your known customer base to identify any significant gaps.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  Take Action on Results
                </CardTitle>
                <CardDescription>Close the feedback loop</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <p>
                  The most important part of survey analysis is turning insights into action. Create a clear plan for
                  implementing changes based on your findings.
                </p>
                <div className="bg-muted p-3 rounded-md mt-2">
                  <p className="font-medium">Pro Tip:</p>
                  <p className="text-sm">
                    Share key findings and planned actions with respondents to show their feedback was valued.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

export default BestPracticesModal
