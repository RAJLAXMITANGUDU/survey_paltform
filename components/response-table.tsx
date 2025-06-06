"use client";

import { useState } from 'react';

import {
  Eye,
  Star,
} from 'lucide-react';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';

// This interface must match exactly what the table expects.
export interface TableResponse {
  id: string;
  respondent: {
    name: string;
    email: string;
    avatar?: string;
  };
  date: string;
  time: string;
  device: string;
  browser: string;
  location: string;
  completionTime: string;
  answers: Array<{
    question: string;
    answer: string;
    type: "rating" | "nps" | "multiple-choice" | "text";
  }>;
}

interface ResponseTableProps {
  responses: TableResponse[];
}

export default function ResponseTable({ responses }: ResponseTableProps) {
  const [selectedResponse, setSelectedResponse] = useState<TableResponse | null>(null);

  return (
    <>
      <div className="border rounded-md overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-muted/50">
              <th className="text-left p-3 font-medium text-sm">Respondent</th>
              <th className="text-left p-3 font-medium text-sm">Date</th>
              <th className="text-left p-3 font-medium text-sm">Device</th>
              <th className="text-left p-3 font-medium text-sm">Location</th>
              <th className="text-left p-3 font-medium text-sm">Rating</th>
              <th className="text-right p-3 font-medium text-sm">Actions</th>
            </tr>
          </thead>
          <tbody>
            {responses.map((response, index) => (
              <tr
                key={response.id}
                className={index % 2 === 0 ? "bg-background" : "bg-muted/20"}
              >
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={response.respondent.avatar || "/placeholder.svg"}
                        alt={response.respondent.name}
                      />
                      <AvatarFallback>
                        {response.respondent.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{response.respondent.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {response.respondent.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="p-3">
                  <div className="text-sm">{response.date}</div>
                  <div className="text-xs text-muted-foreground">{response.time}</div>
                </td>
                <td className="p-3">
                  <div className="text-sm">{response.device}</div>
                  <div className="text-xs text-muted-foreground">{response.browser}</div>
                </td>
                <td className="p-3">
                  <div className="text-sm">{response.location}</div>
                  <div className="text-xs text-muted-foreground">
                    {response.completionTime}
                  </div>
                </td>
                <td className="p-3">
                  <div className="flex items-center">
                    <div className="font-medium mr-1">
                      {response.answers[0]?.answer}
                    </div>
                    <Star className="h-4 w-4 text-yellow-500" />
                  </div>
                </td>
                <td className="p-3 text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedResponse(response)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog
        open={!!selectedResponse}
        onOpenChange={() => setSelectedResponse(null)}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Response Details</DialogTitle>
            <DialogDescription>
              Submitted on {selectedResponse?.date} at {selectedResponse?.time}
            </DialogDescription>
          </DialogHeader>

          {selectedResponse && (
            <>
              <div className="grid grid-cols-2 gap-4 py-4">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={selectedResponse.respondent.avatar || "/placeholder.svg"}
                        alt={selectedResponse.respondent.name}
                      />
                      <AvatarFallback>
                        {selectedResponse.respondent.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">
                        {selectedResponse.respondent.name}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {selectedResponse.respondent.email}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Device:</span>
                      <span className="font-medium">{selectedResponse.device}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Browser:</span>
                      <span className="font-medium">{selectedResponse.browser}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Location:</span>
                      <span className="font-medium">{selectedResponse.location}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Completion Time:
                      </span>
                      <span className="font-medium">
                        {selectedResponse.completionTime}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="text-sm font-medium mb-2">
                    Response Summary
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Satisfaction Rating:
                      </span>
                      <span className="font-medium flex items-center">
                        {selectedResponse.answers[0]?.answer}
                        <Star className="h-4 w-4 text-yellow-500 ml-1" />
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">NPS Score:</span>
                      <Badge
                        className={
                          Number(selectedResponse.answers[1]?.answer) >= 9
                            ? "bg-green-500"
                            : Number(selectedResponse.answers[1]?.answer) >= 7
                            ? "bg-yellow-500"
                            : "bg-red-500"
                        }
                      >
                        {selectedResponse.answers[1]?.answer}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Most Used Feature:
                      </span>
                      <span className="font-medium">
                        {selectedResponse.answers[2]?.answer}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Referral Source:
                      </span>
                      <span className="font-medium">
                        {selectedResponse.answers[3]?.answer}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4 py-4">
                <div className="text-sm font-medium">Detailed Responses</div>
                {selectedResponse.answers.map((answer, index) => (
                  <div key={index} className="space-y-1">
                    <div className="text-sm font-medium">{answer.question}</div>

                    {answer.type === "rating" ? (
                      <div className="flex items-center">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-5 w-5 ${
                              i < Number(answer.answer)
                                ? "text-yellow-500 fill-yellow-500"
                                : "text-muted-foreground"
                            }`}
                          />
                        ))}
                        <span className="ml-2 text-sm">
                          {answer.answer} out of 5
                        </span>
                      </div>
                    ) : answer.type === "nps" ? (
                      <div>
                        <Badge
                          className={
                            Number(answer.answer) >= 9
                              ? "bg-green-500"
                              : Number(answer.answer) >= 7
                              ? "bg-yellow-500"
                              : "bg-red-500"
                          }
                        >
                          {answer.answer}
                        </Badge>
                        <span className="ml-2 text-sm">
                          {Number(answer.answer) >= 9
                            ? "Promoter"
                            : Number(answer.answer) >= 7
                            ? "Passive"
                            : "Detractor"}
                        </span>
                      </div>
                    ) : answer.type === "text" ? (
                      <div className="p-3 bg-muted rounded-md text-sm">
                        {answer.answer}
                      </div>
                    ) : (
                      <div className="text-sm">{answer.answer}</div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}