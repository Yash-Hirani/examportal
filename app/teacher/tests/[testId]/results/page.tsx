"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { ArrowLeft, Download, Search, SortAsc, SortDesc } from "lucide-react";
import { useRouter } from "next/navigation";

// Mock data
const testInfo = {
  id: "test-1",
  title: "Physics Mid-Term Examination",
  date: "2023-05-01",
  duration: 120,
  totalQuestions: 30,
  totalStudents: 42,
  averageScore: 78,
  highestScore: 95,
  lowestScore: 45,
};

const studentResults = [
  {
    id: "s1",
    name: "John Doe",
    score: 85,
    correct: 25,
    incorrect: 3,
    unattempted: 2,
    timeSpent: 98, // in minutes
  },
  {
    id: "s2",
    name: "Jane Smith",
    score: 92,
    correct: 28,
    incorrect: 2,
    unattempted: 0,
    timeSpent: 105,
  },
  {
    id: "s3",
    name: "Bob Johnson",
    score: 70,
    correct: 21,
    incorrect: 9,
    unattempted: 0,
    timeSpent: 115,
  },
  {
    id: "s4",
    name: "Alice Brown",
    score: 65,
    correct: 19,
    incorrect: 8,
    unattempted: 3,
    timeSpent: 90,
  },
  {
    id: "s5",
    name: "Charlie Wilson",
    score: 78,
    correct: 23,
    incorrect: 5,
    unattempted: 2,
    timeSpent: 110,
  },
];

const questionAnalysis = [
  {
    id: "q1",
    text: "The vector projection of a vector 3\\hat{i}+4\\hat{k} on y-axis is",
    correctPercentage: 85,
    averageTime: 45, // in seconds
    difficulty: "Easy",
  },
  {
    id: "q2",
    text: "Position of a particle in a rectangular-coordinate system is (3,2,5), Then its position vector will be",
    correctPercentage: 65,
    averageTime: 60,
    difficulty: "Medium",
  },
  // Add more questions here
];

const scoreDistribution = [
  { range: "0-10", count: 0 },
  { range: "11-20", count: 0 },
  { range: "21-30", count: 0 },
  { range: "31-40", count: 1 },
  { range: "41-50", count: 2 },
  { range: "51-60", count: 3 },
  { range: "61-70", count: 8 },
  { range: "71-80", count: 12 },
  { range: "81-90", count: 10 },
  { range: "91-100", count: 6 },
];

export default function TestResultsPage({
  params,
}: {
  params: { testId: string };
}) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  // Filter students based on search query
  const filteredStudents = studentResults.filter((student) =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort students
  const sortedStudents = [...filteredStudents].sort((a, b) => {
    if (!sortField) return 0;

    const aValue = a[sortField as keyof typeof a];
    const bValue = b[sortField as keyof typeof b];

    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
    }

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortDirection === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    return 0;
  });

  // Handle sort
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  // Format time (minutes to HH:MM)
  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours > 0 ? `${hours}h ` : ""}${mins}m`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-900 text-white p-4 shadow-md">
        <div className="container mx-auto flex items-center">
          <Button
            variant="ghost"
            className="text-white mr-4 p-0"
            onClick={() => router.push("/teacher/dashboard")}
          >
            <ArrowLeft className="h-5 w-5 mr-1" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{testInfo.title} - Results</h1>
            <p className="text-sm opacity-80">Test Date: {testInfo.date}</p>
          </div>
          <div className="ml-auto">
            <Button
              variant="outline"
              className="text-white border-white hover:bg-blue-800"
            >
              <Download className="h-4 w-4 mr-1" /> Export Results
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto py-8 px-4">
        {/* Test Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Average Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{testInfo.averageScore}%</div>
              <Progress value={testInfo.averageScore} className="h-2 mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Highest Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                {testInfo.highestScore}%
              </div>
              <div className="text-sm text-gray-500 mt-1">
                {
                  studentResults.find((s) => s.score === testInfo.highestScore)
                    ?.name
                }
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Lowest Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">
                {testInfo.lowestScore}%
              </div>
              <div className="text-sm text-gray-500 mt-1">
                {
                  studentResults.find((s) => s.score === testInfo.lowestScore)
                    ?.name
                }
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Participation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{testInfo.totalStudents}</div>
              <div className="text-sm text-gray-500 mt-1">
                Students completed the test
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="students" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="students">Student Results</TabsTrigger>
            <TabsTrigger value="questions">Question Analysis</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="students" className="space-y-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Student Performance</h2>
              <div className="flex items-center">
                <Search className="h-4 w-4 mr-2 text-gray-400" />
                <Input
                  placeholder="Search students..."
                  className="w-64"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[250px]">
                        <button
                          className="flex items-center"
                          onClick={() => handleSort("name")}
                        >
                          Student Name
                          {sortField === "name" &&
                            (sortDirection === "asc" ? (
                              <SortAsc className="h-4 w-4 ml-1" />
                            ) : (
                              <SortDesc className="h-4 w-4 ml-1" />
                            ))}
                        </button>
                      </TableHead>
                      <TableHead>
                        <button
                          className="flex items-center"
                          onClick={() => handleSort("score")}
                        >
                          Score
                          {sortField === "score" &&
                            (sortDirection === "asc" ? (
                              <SortAsc className="h-4 w-4 ml-1" />
                            ) : (
                              <SortDesc className="h-4 w-4 ml-1" />
                            ))}
                        </button>
                      </TableHead>
                      <TableHead>Correct</TableHead>
                      <TableHead>Incorrect</TableHead>
                      <TableHead>Unattempted</TableHead>
                      <TableHead>
                        <button
                          className="flex items-center"
                          onClick={() => handleSort("timeSpent")}
                        >
                          Time Spent
                          {sortField === "timeSpent" &&
                            (sortDirection === "asc" ? (
                              <SortAsc className="h-4 w-4 ml-1" />
                            ) : (
                              <SortDesc className="h-4 w-4 ml-1" />
                            ))}
                        </button>
                      </TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedStudents.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell className="font-medium">
                          {student.name}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <span
                              className={`font-medium ${
                                student.score >= 80
                                  ? "text-green-600"
                                  : student.score >= 60
                                  ? "text-amber-600"
                                  : "text-red-600"
                              }`}
                            >
                              {student.score}%
                            </span>
                            <Progress
                              value={student.score}
                              className="h-2 w-16 ml-2"
                              indicatorClassName={
                                student.score >= 80
                                  ? "bg-green-500"
                                  : student.score >= 60
                                  ? "bg-amber-500"
                                  : "bg-red-500"
                              }
                            />
                          </div>
                        </TableCell>
                        <TableCell className="text-green-600">
                          {student.correct}
                        </TableCell>
                        <TableCell className="text-red-600">
                          {student.incorrect}
                        </TableCell>
                        <TableCell className="text-gray-600">
                          {student.unattempted}
                        </TableCell>
                        <TableCell>{formatTime(student.timeSpent)}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="questions" className="space-y-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Question Analysis</h2>
              <div className="flex items-center">
                <Search className="h-4 w-4 mr-2 text-gray-400" />
                <Input placeholder="Search questions..." className="w-64" />
              </div>
            </div>

            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[400px]">Question</TableHead>
                      <TableHead>Correct %</TableHead>
                      <TableHead>Avg. Time</TableHead>
                      <TableHead>Difficulty</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {questionAnalysis.map((question) => (
                      <TableRow key={question.id}>
                        <TableCell
                          className="font-medium"
                          dangerouslySetInnerHTML={{ __html: question.text }}
                        />
                        <TableCell>
                          <div className="flex items-center">
                            <span
                              className={`font-medium ${
                                question.correctPercentage >= 80
                                  ? "text-green-600"
                                  : question.correctPercentage >= 60
                                  ? "text-amber-600"
                                  : "text-red-600"
                              }`}
                            >
                              {question.correctPercentage}%
                            </span>
                            <Progress
                              value={question.correctPercentage}
                              className="h-2 w-16 ml-2"
                              indicatorClassName={
                                question.correctPercentage >= 80
                                  ? "bg-green-500"
                                  : question.correctPercentage >= 60
                                  ? "bg-amber-500"
                                  : "bg-red-500"
                              }
                            />
                          </div>
                        </TableCell>
                        <TableCell>
                          {Math.floor(question.averageTime / 60)}:
                          {(question.averageTime % 60)
                            .toString()
                            .padStart(2, "0")}
                        </TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              question.difficulty === "Easy"
                                ? "bg-green-100 text-green-800"
                                : question.difficulty === "Medium"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {question.difficulty}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Score Distribution</CardTitle>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={scoreDistribution}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="range" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar
                        dataKey="count"
                        name="Number of Students"
                        fill="#3b82f6"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Time vs Score Correlation</CardTitle>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={studentResults.map((s) => ({
                        name: s.name,
                        score: s.score,
                        time: s.timeSpent,
                      }))}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis
                        yAxisId="left"
                        orientation="left"
                        stroke="#3b82f6"
                      />
                      <YAxis
                        yAxisId="right"
                        orientation="right"
                        stroke="#10b981"
                      />
                      <Tooltip />
                      <Legend />
                      <Bar
                        yAxisId="left"
                        dataKey="score"
                        name="Score (%)"
                        fill="#3b82f6"
                      />
                      <Bar
                        yAxisId="right"
                        dataKey="time"
                        name="Time (min)"
                        fill="#10b981"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Performance Insights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
                  <h3 className="font-medium text-blue-800 mb-2">
                    Overall Performance
                  </h3>
                  <p className="text-blue-700">
                    The class performed well with an average score of{" "}
                    {testInfo.averageScore}%.
                    {testInfo.averageScore >= 80
                      ? " Most students demonstrated excellent understanding of the material."
                      : testInfo.averageScore >= 70
                      ? " Most students showed good grasp of the concepts with room for improvement."
                      : " There are some areas where students struggled and may need additional support."}
                  </p>
                </div>

                <div className="p-4 bg-amber-50 border border-amber-200 rounded-md">
                  <h3 className="font-medium text-amber-800 mb-2">
                    Areas for Improvement
                  </h3>
                  <p className="text-amber-700">
                    Questions with the lowest correct percentage may indicate
                    topics that need to be revisited:
                  </p>
                  <ul className="list-disc list-inside mt-2 text-amber-700">
                    {questionAnalysis
                      .sort((a, b) => a.correctPercentage - b.correctPercentage)
                      .slice(0, 3)
                      .map((q) => (
                        <li
                          key={q.id}
                          dangerouslySetInnerHTML={{ __html: q.text }}
                        />
                      ))}
                  </ul>
                </div>

                <div className="p-4 bg-green-50 border border-green-200 rounded-md">
                  <h3 className="font-medium text-green-800 mb-2">Strengths</h3>
                  <p className="text-green-700">
                    Students performed exceptionally well on these topics:
                  </p>
                  <ul className="list-disc list-inside mt-2 text-green-700">
                    {questionAnalysis
                      .sort((a, b) => b.correctPercentage - a.correctPercentage)
                      .slice(0, 3)
                      .map((q) => (
                        <li
                          key={q.id}
                          dangerouslySetInnerHTML={{ __html: q.text }}
                        />
                      ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
