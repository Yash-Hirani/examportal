"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DatePicker } from "@/components/ui/date-picker";
import { TimePicker } from "@/components/ui/time-picker";
import { Checkbox } from "@/components/ui/checkbox";
import { PlusCircle, ArrowLeft, Save } from "lucide-react";

// Mock data
const subjects = [
  { id: "physics", name: "Physics" },
  { id: "chemistry", name: "Chemistry" },
  { id: "math", name: "Mathematics" },
];

const questionBank = [
  {
    id: "q1",
    text: "The vector projection of a vector 3\\hat{i}+4\\hat{k} on y-axis is",
    options: ["5", "4", "3", "0"],
    correctOption: "3",
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
    correctOption: "1",
    subjectId: "physics",
  },
  // Add more questions here
];

const students = [
  { id: "s1", name: "John Doe", email: "john@example.com" },
  { id: "s2", name: "Jane Smith", email: "jane@example.com" },
  { id: "s3", name: "Bob Johnson", email: "bob@example.com" },
  // Add more students here
];

export default function CreateTestPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("details");
  const [testDetails, setTestDetails] = useState({
    title: "",
    description: "",
    duration: 60,
    startDate: new Date(),
    startTime: new Date(),
    endDate: new Date(),
    endTime: new Date(new Date().setHours(new Date().getHours() + 1)),
  });
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter questions based on selected subjects and search query
  const filteredQuestions = questionBank.filter(
    (q) =>
      (selectedSubjects.length === 0 ||
        selectedSubjects.includes(q.subjectId)) &&
      q.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle subject selection
  const toggleSubject = (subjectId: string) => {
    setSelectedSubjects((prev) =>
      prev.includes(subjectId)
        ? prev.filter((id) => id !== subjectId)
        : [...prev, subjectId]
    );
  };

  // Handle question selection
  const toggleQuestion = (questionId: string) => {
    setSelectedQuestions((prev) =>
      prev.includes(questionId)
        ? prev.filter((id) => id !== questionId)
        : [...prev, questionId]
    );
  };

  // Handle student selection
  const toggleStudent = (studentId: string) => {
    setSelectedStudents((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId]
    );
  };

  // Handle test details change
  const handleDetailsChange = (field: string, value: any) => {
    setTestDetails((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = () => {
    // In a real implementation, we would send the data to the server
    console.log({
      testDetails,
      selectedSubjects,
      selectedQuestions,
      selectedStudents,
    });

    // Navigate back to dashboard
    router.push("/teacher/dashboard");
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
          <h1 className="text-2xl font-bold">Create New Test</h1>
        </div>
      </header>

      <main className="container mx-auto py-8 px-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-8 grid w-full grid-cols-3">
            <TabsTrigger value="details">Test Details</TabsTrigger>
            <TabsTrigger value="questions">Questions</TabsTrigger>
            <TabsTrigger value="students">Assign Students</TabsTrigger>
          </TabsList>

          <TabsContent value="details">
            <Card>
              <CardHeader>
                <CardTitle>Test Information</CardTitle>
                <CardDescription>
                  Enter the basic details for your test
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Test Title</Label>
                  <Input
                    id="title"
                    placeholder="Enter test title"
                    value={testDetails.title}
                    onChange={(e) =>
                      handleDetailsChange("title", e.target.value)
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea
                    id="description"
                    placeholder="Enter test description"
                    value={testDetails.description}
                    onChange={(e) =>
                      handleDetailsChange("description", e.target.value)
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (minutes)</Label>
                  <Input
                    id="duration"
                    type="number"
                    min="1"
                    value={testDetails.duration}
                    onChange={(e) =>
                      handleDetailsChange(
                        "duration",
                        Number.parseInt(e.target.value)
                      )
                    }
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Start Date & Time</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <DatePicker
                        date={testDetails.startDate}
                        setDate={(date) =>
                          handleDetailsChange("startDate", date)
                        }
                      />
                      <TimePicker
                        date={testDetails.startTime}
                        setDate={(date) =>
                          handleDetailsChange("startTime", date)
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>End Date & Time</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <DatePicker
                        date={testDetails.endDate}
                        setDate={(date) => handleDetailsChange("endDate", date)}
                      />
                      <TimePicker
                        date={testDetails.endTime}
                        setDate={(date) => handleDetailsChange("endTime", date)}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Subjects</Label>
                  <div className="flex flex-wrap gap-2">
                    {subjects.map((subject) => (
                      <div
                        key={subject.id}
                        className={`px-3 py-1 rounded-full text-sm cursor-pointer transition-colors ${
                          selectedSubjects.includes(subject.id)
                            ? "bg-blue-100 text-blue-800 border border-blue-300"
                            : "bg-gray-100 text-gray-800 border border-gray-200 hover:bg-gray-200"
                        }`}
                        onClick={() => toggleSubject(subject.id)}
                      >
                        {subject.name}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => router.push("/teacher/dashboard")}
                >
                  Cancel
                </Button>
                <Button onClick={() => setActiveTab("questions")}>
                  Continue to Questions
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="questions">
            <Card>
              <CardHeader>
                <CardTitle>Select Questions</CardTitle>
                <CardDescription>
                  Choose questions from the question bank or create new ones
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <Label>Filter by Subject:</Label>
                    <Select
                      value={
                        selectedSubjects.length === 1
                          ? selectedSubjects[0]
                          : "all"
                      }
                      onValueChange={(value) =>
                        setSelectedSubjects(value === "all" ? [] : [value])
                      }
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="All Subjects" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Subjects</SelectItem>
                        {subjects.map((subject) => (
                          <SelectItem key={subject.id} value={subject.id}>
                            {subject.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Input
                    placeholder="Search questions..."
                    className="w-64"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <div className="border rounded-md">
                  <div className="flex items-center p-3 bg-gray-50 border-b">
                    <div className="w-8">
                      <Checkbox
                        checked={
                          filteredQuestions.length > 0 &&
                          filteredQuestions.every((q) =>
                            selectedQuestions.includes(q.id)
                          )
                        }
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedQuestions([
                              ...selectedQuestions,
                              ...filteredQuestions
                                .filter(
                                  (q) => !selectedQuestions.includes(q.id)
                                )
                                .map((q) => q.id),
                            ]);
                          } else {
                            setSelectedQuestions(
                              selectedQuestions.filter(
                                (id) =>
                                  !filteredQuestions.some((q) => q.id === id)
                              )
                            );
                          }
                        }}
                      />
                    </div>
                    <div className="flex-1 font-medium">Question</div>
                    <div className="w-24 text-center">Subject</div>
                  </div>

                  <div className="max-h-96 overflow-y-auto">
                    {filteredQuestions.length === 0 ? (
                      <div className="p-4 text-center text-gray-500">
                        No questions found
                      </div>
                    ) : (
                      filteredQuestions.map((question) => (
                        <div
                          key={question.id}
                          className={`flex items-center p-3 border-b hover:bg-gray-50 ${
                            selectedQuestions.includes(question.id)
                              ? "bg-blue-50"
                              : ""
                          }`}
                        >
                          <div className="w-8">
                            <Checkbox
                              checked={selectedQuestions.includes(question.id)}
                              onCheckedChange={() =>
                                toggleQuestion(question.id)
                              }
                            />
                          </div>
                          <div
                            className="flex-1"
                            dangerouslySetInnerHTML={{ __html: question.text }}
                          />
                          <div className="w-24 text-center text-sm">
                            {
                              subjects.find((s) => s.id === question.subjectId)
                                ?.name
                            }
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-500">
                    {selectedQuestions.length} questions selected
                  </div>
                  <Button variant="outline" className="flex items-center">
                    <PlusCircle className="h-4 w-4 mr-1" /> Add New Question
                  </Button>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => setActiveTab("details")}
                >
                  Back to Details
                </Button>
                <Button onClick={() => setActiveTab("students")}>
                  Continue to Assign Students
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="students">
            <Card>
              <CardHeader>
                <CardTitle>Assign Students</CardTitle>
                <CardDescription>
                  Select students who will take this test
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <Label>Total Students:</Label>
                    <span className="font-medium">{students.length}</span>
                  </div>

                  <Input placeholder="Search students..." className="w-64" />
                </div>

                <div className="border rounded-md">
                  <div className="flex items-center p-3 bg-gray-50 border-b">
                    <div className="w-8">
                      <Checkbox
                        checked={
                          students.length > 0 &&
                          students.every((s) => selectedStudents.includes(s.id))
                        }
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedStudents(students.map((s) => s.id));
                          } else {
                            setSelectedStudents([]);
                          }
                        }}
                      />
                    </div>
                    <div className="flex-1 font-medium">Name</div>
                    <div className="w-48">Email</div>
                  </div>

                  <div className="max-h-96 overflow-y-auto">
                    {students.map((student) => (
                      <div
                        key={student.id}
                        className={`flex items-center p-3 border-b hover:bg-gray-50 ${
                          selectedStudents.includes(student.id)
                            ? "bg-blue-50"
                            : ""
                        }`}
                      >
                        <div className="w-8">
                          <Checkbox
                            checked={selectedStudents.includes(student.id)}
                            onCheckedChange={() => toggleStudent(student.id)}
                          />
                        </div>
                        <div className="flex-1">{student.name}</div>
                        <div className="w-48 text-sm text-gray-600">
                          {student.email}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-500">
                    {selectedStudents.length} students selected
                  </div>
                  <Button variant="outline" className="flex items-center">
                    <PlusCircle className="h-4 w-4 mr-1" /> Add New Student
                  </Button>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => setActiveTab("questions")}
                >
                  Back to Questions
                </Button>
                <Button onClick={handleSubmit} className="flex items-center">
                  <Save className="h-4 w-4 mr-1" /> Create Test
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
