"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { AlertCircle, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

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
  duration: number; // in minutes
  questions: Question[];
  subjects: { id: string; name: string }[];
}

// Mock data - would be fetched from API in real implementation
const mockTest: TestData = {
  id: "test-1",
  title: "JEE-Main",
  duration: 180, // 3 hours
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
    // Add more questions here
  ],
};

export default function TestPage({ params }: { params: { testId: string } }) {
  const router = useRouter();
  const [test, setTest] = useState<TestData>(mockTest);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [remainingTime, setRemainingTime] = useState(test.duration * 60); // in seconds
  const [activeSubject, setActiveSubject] = useState<string | null>(null);
  const [warningCount, setWarningCount] = useState(0);
  const [showWarning, setShowWarning] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const pageRef = useRef<HTMLDivElement>(null);
  const visibilityWarningRef = useRef<number>(0);
  const autoSaveIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const blurTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize answers
  useEffect(() => {
    const initialAnswers = test.questions.map((q) => ({
      questionId: q.id,
      selectedOption: null,
      markedForReview: false,
    }));
    setAnswers(initialAnswers);
    setActiveSubject(test.subjects[0].id);

    // Load saved state if available
    const savedState = localStorage.getItem(`test-${params.testId}`);
    if (savedState) {
      const {
        answers: savedAnswers,
        currentQuestionIndex: savedIndex,
        remainingTime: savedTime,
      } = JSON.parse(savedState);
      setAnswers(savedAnswers);
      setCurrentQuestionIndex(savedIndex);
      setRemainingTime(savedTime);
    }

    // Set up auto-save
    autoSaveIntervalRef.current = setInterval(() => {
      saveTestState();
    }, 5000); // Auto-save every 5 seconds

    return () => {
      if (autoSaveIntervalRef.current) {
        clearInterval(autoSaveIntervalRef.current);
      }
      if (blurTimeoutRef.current) {
        clearTimeout(blurTimeoutRef.current);
      }
    };
  }, [params.testId]);

  // Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setRemainingTime((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Format time as HH:MM:SS
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Anti-cheating: Tab visibility
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        visibilityWarningRef.current += 1;
        setWarningCount(visibilityWarningRef.current);
        setShowWarning(true);

        if (visibilityWarningRef.current >= 3) {
          handleSubmitTest();
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  // Anti-cheating: Blur detection
  useEffect(() => {
    const handleBlur = () => {
      if (blurTimeoutRef.current) clearTimeout(blurTimeoutRef.current);

      if (pageRef.current) {
        pageRef.current.classList.add("blur-content");
      }

      blurTimeoutRef.current = setTimeout(() => {
        if (pageRef.current) {
          pageRef.current.classList.remove("blur-content");
        }
      }, 500);
    };

    window.addEventListener("blur", handleBlur);
    return () => {
      window.removeEventListener("blur", handleBlur);
    };
  }, []);

  // Anti-cheating: Disable right-click
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent common keyboard shortcuts
      if (
        (e.ctrlKey &&
          (e.key === "c" || e.key === "v" || e.key === "u" || e.key === "p")) ||
        e.key === "F12" ||
        e.key === "PrintScreen"
      ) {
        e.preventDefault();
        return false;
      }
    };

    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Full screen mode
  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((e) => {
        console.error(
          `Error attempting to enable full-screen mode: ${e.message}`
        );
      });
      setIsFullScreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullScreen(false);
      }
    }
  };

  // Save test state to localStorage
  const saveTestState = () => {
    const state = {
      answers,
      currentQuestionIndex,
      remainingTime,
    };
    localStorage.setItem(`test-${params.testId}`, JSON.stringify(state));
  };

  // Handle answer selection
  const handleAnswerSelect = (option: string) => {
    const updatedAnswers = [...answers];
    updatedAnswers[currentQuestionIndex] = {
      ...updatedAnswers[currentQuestionIndex],
      selectedOption: option,
    };
    setAnswers(updatedAnswers);
  };

  // Handle marking for review
  const handleMarkForReview = () => {
    const updatedAnswers = [...answers];
    updatedAnswers[currentQuestionIndex] = {
      ...updatedAnswers[currentQuestionIndex],
      markedForReview: !updatedAnswers[currentQuestionIndex].markedForReview,
    };
    setAnswers(updatedAnswers);
  };

  // Navigation functions
  const goToNextQuestion = () => {
    if (currentQuestionIndex < test.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const goToQuestion = (index: number) => {
    if (index >= 0 && index < test.questions.length) {
      setCurrentQuestionIndex(index);
    }
  };

  // Filter questions by subject
  const filteredQuestions = activeSubject
    ? test.questions.filter((q) => q.subjectId === activeSubject)
    : test.questions;

  // Get current question
  const currentQuestion = test.questions[currentQuestionIndex];
  const currentAnswer = answers[currentQuestionIndex];

  // Handle test submission
  const handleSubmitTest = () => {
    // Save final state
    saveTestState();

    // In a real implementation, we would send the answers to the server
    // For now, we'll just navigate to the results page
    router.push(`/student/test/${params.testId}/results`);
  };

  // Get question status class
  const getQuestionStatusClass = (index: number) => {
    const answer = answers[index];
    if (!answer) return "question-not-visited";

    if (answer.markedForReview && answer.selectedOption) {
      return "question-answered-marked-review";
    } else if (answer.markedForReview) {
      return "question-marked-review";
    } else if (answer.selectedOption) {
      return "question-answered";
    } else {
      return "question-not-answered";
    }
  };

  return (
    <div
      ref={pageRef}
      className="min-h-screen flex flex-col no-select no-context"
      onCopy={(e) => e.preventDefault()}
      onPaste={(e) => e.preventDefault()}
      onCut={(e) => e.preventDefault()}
    >
      {/* Header */}
      <header className="bg-blue-900 text-white p-2 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Image
                src="/placeholder.svg?height=40&width=40"
                alt="Logo"
                width={40}
                height={40}
                className="mr-2"
              />
              <div>
                <h1 className="text-lg font-bold">National Testing Agency</h1>
                <p className="text-xs">Government of India</p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              className="text-white border-white hover:bg-blue-800"
              onClick={toggleFullScreen}
            >
              {isFullScreen ? "Exit Full Screen" : "Enter Full Screen"}
            </Button>
          </div>
        </div>
      </header>

      {/* Candidate Info Bar */}
      <div className="bg-gray-100 p-2 border-b">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <div className="bg-gray-300 rounded-full w-10 h-10 flex items-center justify-center mr-3">
              <span className="text-gray-600">👤</span>
            </div>
            <div>
              <p className="text-sm">
                <span className="text-gray-500">Candidate Name:</span>{" "}
                <span className="font-medium">Student Name</span>
              </p>
              <p className="text-sm">
                <span className="text-gray-500">Exam Name:</span>{" "}
                <span className="font-medium">{test.title}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center">
            <div className="mr-4">
              <p className="text-sm">
                <span className="text-gray-500">Subject:</span>{" "}
                <span className="font-medium">
                  {test.subjects.find((s) => s.id === activeSubject)?.name ||
                    "All Subjects"}
                </span>
              </p>
              <p className="text-sm flex items-center">
                <span className="text-gray-500 flex items-center">
                  <Clock className="h-3 w-3 mr-1" /> Remaining Time:
                </span>{" "}
                <span className="font-medium text-blue-600 ml-1">
                  {formatTime(remainingTime)}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 container mx-auto p-4 flex">
        {/* Question Area */}
        <div className="flex-1 mr-4">
          <Card className="p-6 h-full flex flex-col">
            {/* Subject Tabs */}
            <div className="flex mb-4 border-b pb-2">
              <Button
                variant={activeSubject === null ? "default" : "outline"}
                className="mr-2"
                onClick={() => setActiveSubject(null)}
              >
                All
              </Button>
              {test.subjects.map((subject) => (
                <Button
                  key={subject.id}
                  variant={activeSubject === subject.id ? "default" : "outline"}
                  className="mr-2"
                  onClick={() => setActiveSubject(subject.id)}
                >
                  {subject.name}
                </Button>
              ))}
            </div>

            {/* Question */}
            <div className="flex-1">
              <div className="mb-4">
                <h2 className="text-lg font-medium mb-2">
                  Question {currentQuestionIndex + 1}:
                </h2>
                <div
                  className="text-lg mb-6"
                  dangerouslySetInnerHTML={{ __html: currentQuestion.text }}
                />

                <RadioGroup
                  value={currentAnswer?.selectedOption || ""}
                  onValueChange={handleAnswerSelect}
                  className="space-y-4"
                >
                  {currentQuestion.options.map((option, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-2 p-3 rounded-md border hover:bg-gray-50"
                    >
                      <RadioGroupItem
                        value={String(index)}
                        id={`option-${index}`}
                      />
                      <Label
                        htmlFor={`option-${index}`}
                        className="flex-1 cursor-pointer"
                        dangerouslySetInnerHTML={{ __html: option }}
                      />
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-4 pt-4 border-t">
              <div>
                <Button
                  variant="outline"
                  onClick={goToPreviousQuestion}
                  disabled={currentQuestionIndex === 0}
                  className="mr-2"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" /> Previous
                </Button>
                <Button
                  variant="outline"
                  onClick={handleMarkForReview}
                  className={cn(
                    "mr-2",
                    currentAnswer?.markedForReview && "bg-purple-100"
                  )}
                >
                  {currentAnswer?.markedForReview
                    ? "Unmark for Review"
                    : "Mark for Review"}
                </Button>
              </div>
              <div>
                <Button
                  variant="outline"
                  onClick={goToNextQuestion}
                  disabled={currentQuestionIndex === test.questions.length - 1}
                  className="mr-2"
                >
                  Next <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
                <Button
                  variant="default"
                  onClick={() => setShowSubmitDialog(true)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Submit Test
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Question Palette */}
        <div className="w-64">
          <Card className="p-4">
            <h3 className="font-medium mb-3">Question Palette</h3>

            {/* Legend */}
            <div className="mb-4 text-xs space-y-2">
              <div className="flex items-center">
                <div className="question-number question-not-answered mr-2">
                  0
                </div>
                <span>Not Answered</span>
              </div>
              <div className="flex items-center">
                <div className="question-number question-answered mr-2">0</div>
                <span>Answered</span>
              </div>
              <div className="flex items-center">
                <div className="question-number question-marked-review mr-2">
                  0
                </div>
                <span>Marked for Review</span>
              </div>
              <div className="flex items-center">
                <div className="question-number question-answered-marked-review mr-2">
                  0
                </div>
                <span>Answered & Marked for Review</span>
              </div>
            </div>

            {/* Question Grid */}
            <div className="grid grid-cols-5 gap-2 mt-4">
              {filteredQuestions.map((_, index) => {
                const questionIndex = test.questions.indexOf(
                  filteredQuestions[index]
                );
                return (
                  <button
                    key={index}
                    className={cn(
                      "question-number",
                      getQuestionStatusClass(questionIndex),
                      currentQuestionIndex === questionIndex &&
                        "current-question"
                    )}
                    onClick={() => goToQuestion(questionIndex)}
                  >
                    {questionIndex + 1}
                  </button>
                );
              })}
            </div>

            {/* Summary */}
            <div className="mt-6 text-sm">
              <p>
                <span className="font-medium">Total Questions:</span>{" "}
                {filteredQuestions.length}
              </p>
              <p>
                <span className="font-medium">Answered:</span>{" "}
                {
                  answers.filter(
                    (a) => a.selectedOption !== null && !a.markedForReview
                  ).length
                }
              </p>
              <p>
                <span className="font-medium">Marked for Review:</span>{" "}
                {
                  answers.filter(
                    (a) => a.markedForReview && a.selectedOption === null
                  ).length
                }
              </p>
              <p>
                <span className="font-medium">
                  Answered & Marked for Review:
                </span>{" "}
                {
                  answers.filter(
                    (a) => a.markedForReview && a.selectedOption !== null
                  ).length
                }
              </p>
              <p>
                <span className="font-medium">Not Visited:</span>{" "}
                {
                  answers.filter(
                    (a) => a.selectedOption === null && !a.markedForReview
                  ).length
                }
              </p>
            </div>
          </Card>
        </div>
      </div>

      {/* Warning Dialog */}
      <Dialog open={showWarning} onOpenChange={setShowWarning}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-destructive flex items-center">
              <AlertCircle className="h-5 w-5 mr-2" /> Security Warning
            </DialogTitle>
            <DialogDescription>
              You have switched away from the test window. This is considered a
              security violation.
              {warningCount >= 2 && (
                <p className="font-bold mt-2 text-destructive">
                  Warning {warningCount}/3. Your test will be automatically
                  submitted after 3 violations.
                </p>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setShowWarning(false)}>I Understand</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Submit Dialog */}
      <Dialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Submit Test</DialogTitle>
            <DialogDescription>
              Are you sure you want to submit your test? You won't be able to
              change your answers after submission.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm">
              <span className="font-medium">Total Questions:</span>{" "}
              {test.questions.length}
            </p>
            <p className="text-sm">
              <span className="font-medium">Answered:</span>{" "}
              {answers.filter((a) => a.selectedOption !== null).length}
            </p>
            <p className="text-sm">
              <span className="font-medium">Unanswered:</span>{" "}
              {answers.filter((a) => a.selectedOption === null).length}
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowSubmitDialog(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleSubmitTest}>Submit Test</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
