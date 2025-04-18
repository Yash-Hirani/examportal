"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, XCircle, Clock, HelpCircle } from "lucide-react";

// Types
interface Question {
  id: string;
  text: string;
  options: string[];
  subjectId: string;
}

interface Answer {
  questionId: string;
  selectedOption: string | null;
  markedForReview: boolean;
}

interface TestData {
  id: string;
  title: string;
  duration: number;
  questions: Question[];
  subjects: { id: string; name: string }[];
}

// Mock data - would be fetched from API in real implementation
const mockTest: TestData = {
  id: "test-1",
  title: "JEE-Main",
  duration: 180,
  subjects: [
    { id: "physics", name: "Physics" },
    { id: "chemistry", name: "Chemistry" },
    { id: "math", name: "Mathematics" },
  ],
  questions: [
    {
      id: "q1",
      text: "The vector projection of a vector 3\\hat{i}+4\\hat{k} on y-axis is",
      options: ["5", "4", "3", "0"],
      subjectId: "physics",
    },
    {
      id: "q2",
      text: "Position of a particle in a rectangular-coordinate system is (3,2,5), Then its position vector will be",
      options: [
        "3\\hat{i}+5\\hat{j}+2\\hat{k}",
        "3\\hat{i}+2\\hat{j}+5\\hat{k}",
        "5\\hat{i}+3\\hat{j}+2\\hat{k}",
        "None of these",
      ],
      subjectId: "physics",
    },
  ],
};

// Mock correct answers - would be fetched from API
const correctAnswers = {
  q1: "3",
  q2: "1",
};

export default function TestResultsPage({
  params,
}: {
  params: { testId: string };
}) {
  const [test, setTest] = useState<TestData>(mockTest);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [score, setScore] = useState({
    total: 0,
    correct: 0,
    incorrect: 0,
    unattempted: 0,
  });
  const [subjectScores, setSubjectScores] = useState<
    Record<string, { total: number; correct: number }>
  >({});
  const [timeSpent, setTimeSpent] = useState<Record<string, number>>({});

  useEffect(() => {
    // Load saved answers from localStorage
    const savedState = localStorage.getItem(`test-${params.testId}`);
    if (savedState) {
      const { answers: savedAnswers } = JSON.parse(savedState);
      setAnswers(savedAnswers);

      // Calculate scores
      let correct = 0;
      let incorrect = 0;
      let unattempted = 0;
      const subjectScoresTemp: Record<
        string,
        { total: number; correct: number }
      > = {};
      const timeSpentTemp: Record<string, number> = {};

      test.questions.forEach((question, index) => {
        // Initialize subject scores
        if (!subjectScoresTemp[question.subjectId]) {
          subjectScoresTemp[question.subjectId] = { total: 0, correct: 0 };
        }
        subjectScoresTemp[question.subjectId].total++;

        // Mock time spent (would come from actual tracking)
        timeSpentTemp[question.id] = Math.floor(Math.random() * 120) + 30; // 30-150 seconds

        const answer = savedAnswers[index];
        if (!answer || answer.selectedOption === null) {
          unattempted++;
        } else {
          // Check if answer is correct (using our mock data)
          const isCorrect =
            answer.selectedOption ===
            correctAnswers[question.id as keyof typeof correctAnswers];
          if (isCorrect) {
            correct++;
            subjectScoresTemp[question.subjectId].correct++;
          } else {
            incorrect++;
          }
        }
      });

      setScore({
        total: test.questions.length,
        correct,
        incorrect,
        unattempted,
      });
      setSubjectScores(subjectScoresTemp);
      setTimeSpent(timeSpentTemp);
    }
  }, [params.testId, test.questions]);

  // Calculate percentages
  const correctPercentage =
    Math.round((score.correct / score.total) * 100) || 0;
  const incorrectPercentage =
    Math.round((score.incorrect / score.total) * 100) || 0;
  const unattemptedPercentage =
    Math.round((score.unattempted / score.total) * 100) || 0;

  // Format time (seconds to MM:SS)
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  // Calculate average time per question
  const averageTimePerQuestion =
    Object.values(timeSpent).reduce((sum, time) => sum + time, 0) /
      Object.keys(timeSpent).length || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-900 text-white p-4 shadow-md">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold">Test Results</h1>
          <p>{test.title}</p>
        </div>
      </header>

      <main className="container mx-auto py-8 px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Score Summary */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Score Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">
                      Correct ({score.correct}/{score.total})
                    </span>
                    <span className="text-sm font-medium text-green-600">
                      {correctPercentage}%
                    </span>
                  </div>
                  <Progress
                    value={correctPercentage}
                    className="h-2 bg-gray-200"
                    indicatorClassName="bg-green-500"
                  />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">
                      Incorrect ({score.incorrect}/{score.total})
                    </span>
                    <span className="text-sm font-medium text-red-600">
                      {incorrectPercentage}%
                    </span>
                  </div>
                  <Progress
                    value={incorrectPercentage}
                    className="h-2 bg-gray-200"
                    indicatorClassName="bg-red-500"
                  />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">
                      Unattempted ({score.unattempted}/{score.total})
                    </span>
                    <span className="text-sm font-medium text-gray-600">
                      {unattemptedPercentage}%
                    </span>
                  </div>
                  <Progress
                    value={unattemptedPercentage}
                    className="h-2 bg-gray-200"
                    indicatorClassName="bg-gray-500"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Subject-wise Performance */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">
                Subject-wise Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(subjectScores).map(
                  ([subjectId, subjectScore]) => {
                    const subject = test.subjects.find(
                      (s) => s.id === subjectId
                    );
                    const percentage =
                      Math.round(
                        (subjectScore.correct / subjectScore.total) * 100
                      ) || 0;
                    return (
                      <div key={subjectId}>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">
                            {subject?.name}
                          </span>
                          <span className="text-sm font-medium">
                            {subjectScore.correct}/{subjectScore.total} (
                            {percentage}%)
                          </span>
                        </div>
                        <Progress
                          value={percentage}
                          className="h-2 bg-gray-200"
                        />
                      </div>
                    );
                  }
                )}
              </div>
            </CardContent>
          </Card>

          {/* Time Analysis */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Time Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium">
                      Average Time per Question
                    </p>
                    <p className="text-lg font-bold">
                      {formatTime(Math.round(averageTimePerQuestion))}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-green-600" />
                  <div>
                    <p className="text-sm font-medium">Fastest Question</p>
                    <p className="text-lg font-bold">
                      {formatTime(Math.min(...Object.values(timeSpent)))}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-red-600" />
                  <div>
                    <p className="text-sm font-medium">Slowest Question</p>
                    <p className="text-lg font-bold">
                      {formatTime(Math.max(...Object.values(timeSpent)))}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Analysis */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Questions</TabsTrigger>
            <TabsTrigger value="correct">Correct</TabsTrigger>
            <TabsTrigger value="incorrect">Incorrect</TabsTrigger>
            <TabsTrigger value="unattempted">Unattempted</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {test.questions.map((question, index) => {
              const answer = answers[index];
              const selectedOption = answer?.selectedOption;
              const correctOption =
                correctAnswers[question.id as keyof typeof correctAnswers];
              const isCorrect = selectedOption === correctOption;
              const isUnattempted = !selectedOption;

              return (
                <Card key={question.id} className="overflow-hidden">
                  <div
                    className={`h-1 ${
                      isUnattempted
                        ? "bg-gray-500"
                        : isCorrect
                        ? "bg-green-500"
                        : "bg-red-500"
                    }`}
                  />
                  <CardContent className="pt-6">
                    <div className="flex items-start">
                      <div className="mr-4 mt-1">
                        {isUnattempted ? (
                          <HelpCircle className="h-6 w-6 text-gray-500" />
                        ) : isCorrect ? (
                          <CheckCircle2 className="h-6 w-6 text-green-500" />
                        ) : (
                          <XCircle className="h-6 w-6 text-red-500" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-500 mb-1">
                          Question {index + 1}
                        </p>
                        <p
                          className="font-medium mb-4"
                          dangerouslySetInnerHTML={{ __html: question.text }}
                        />

                        <div className="space-y-2 mb-4">
                          {question.options.map((option, optIndex) => (
                            <div
                              key={optIndex}
                              className={`p-3 rounded-md border ${
                                String(optIndex) === selectedOption &&
                                String(optIndex) === correctOption
                                  ? "bg-green-50 border-green-200"
                                  : String(optIndex) === selectedOption
                                  ? "bg-red-50 border-red-200"
                                  : String(optIndex) === correctOption
                                  ? "bg-green-50 border-green-200"
                                  : ""
                              }`}
                            >
                              <div className="flex items-center">
                                <div className="w-6 h-6 flex items-center justify-center mr-2">
                                  {String(optIndex) === selectedOption &&
                                    String(optIndex) === correctOption && (
                                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                                    )}
                                  {String(optIndex) === selectedOption &&
                                    String(optIndex) !== correctOption && (
                                      <XCircle className="h-5 w-5 text-red-500" />
                                    )}
                                  {String(optIndex) !== selectedOption &&
                                    String(optIndex) === correctOption && (
                                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                                    )}
                                </div>
                                <span
                                  dangerouslySetInnerHTML={{ __html: option }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="flex justify-between text-sm text-gray-500">
                          <span>
                            Time spent:{" "}
                            {formatTime(timeSpent[question.id] || 0)}
                          </span>
                          <span>
                            Subject:{" "}
                            {
                              test.subjects.find(
                                (s) => s.id === question.subjectId
                              )?.name
                            }
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </TabsContent>

          <TabsContent value="correct" className="space-y-4">
            {test.questions.map((question, index) => {
              const answer = answers[index];
              const selectedOption = answer?.selectedOption;
              const correctOption =
                correctAnswers[question.id as keyof typeof correctAnswers];
              const isCorrect = selectedOption === correctOption;

              if (!isCorrect) return null;

              return (
                <Card key={question.id} className="overflow-hidden">
                  <div className="h-1 bg-green-500" />
                  <CardContent className="pt-6">
                    <div className="flex items-start">
                      <div className="mr-4 mt-1">
                        <CheckCircle2 className="h-6 w-6 text-green-500" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-500 mb-1">
                          Question {index + 1}
                        </p>
                        <p
                          className="font-medium mb-4"
                          dangerouslySetInnerHTML={{ __html: question.text }}
                        />

                        <div className="space-y-2 mb-4">
                          {question.options.map((option, optIndex) => (
                            <div
                              key={optIndex}
                              className={`p-3 rounded-md border ${
                                String(optIndex) === correctOption
                                  ? "bg-green-50 border-green-200"
                                  : ""
                              }`}
                            >
                              <div className="flex items-center">
                                <div className="w-6 h-6 flex items-center justify-center mr-2">
                                  {String(optIndex) === correctOption && (
                                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                                  )}
                                </div>
                                <span
                                  dangerouslySetInnerHTML={{ __html: option }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="flex justify-between text-sm text-gray-500">
                          <span>
                            Time spent:{" "}
                            {formatTime(timeSpent[question.id] || 0)}
                          </span>
                          <span>
                            Subject:{" "}
                            {
                              test.subjects.find(
                                (s) => s.id === question.subjectId
                              )?.name
                            }
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </TabsContent>

          {/* Similar structure for incorrect and unattempted tabs */}
          <TabsContent value="incorrect" className="space-y-4">
            {/* Similar to "correct" tab but for incorrect answers */}
          </TabsContent>

          <TabsContent value="unattempted" className="space-y-4">
            {/* Similar to "correct" tab but for unattempted questions */}
          </TabsContent>
        </Tabs>

        <div className="mt-8 flex justify-center">
          <Link href="/student/dashboard">
            <Button size="lg">Return to Dashboard</Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
