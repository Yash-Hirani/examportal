"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Calendar, Clock, FileText, PlusCircle, Search } from "lucide-react";

// Mock data
const upcomingTests = [
  {
    id: "1",
    title: "Physics Mid-Term",
    date: "2023-05-15",
    time: "10:00 AM",
    duration: 120,
    students: 45,
  },
  {
    id: "2",
    title: "Chemistry Final",
    date: "2023-05-20",
    time: "2:00 PM",
    duration: 180,
    students: 38,
  },
];

const completedTests = [
  {
    id: "3",
    title: "Mathematics Quiz",
    date: "2023-05-01",
    time: "9:00 AM",
    duration: 60,
    students: 42,
    avgScore: 78,
  },
  {
    id: "4",
    title: "Physics Practice Test",
    date: "2023-04-25",
    time: "1:00 PM",
    duration: 90,
    students: 40,
    avgScore: 65,
  },
];

export default function TeacherDashboard() {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter tests based on search query
  const filteredUpcoming = upcomingTests.filter((test) =>
    test.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCompleted = completedTests.filter((test) =>
    test.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-900 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Teacher Dashboard</h1>
          <div className="flex items-center space-x-4">
            <span>Welcome, Teacher</span>
            <Button
              variant="outline"
              className="text-white border-white hover:bg-blue-800"
            >
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Test Management</h2>
          <Link href="/teacher/tests/create">
            <Button className="flex items-center">
              <PlusCircle className="mr-2 h-4 w-4" /> Create New Test
            </Button>
          </Link>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              placeholder="Search tests..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="upcoming">Upcoming Tests</TabsTrigger>
            <TabsTrigger value="completed">Completed Tests</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-4">
            {filteredUpcoming.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No upcoming tests found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredUpcoming.map((test) => (
                  <Card key={test.id}>
                    <CardHeader>
                      <CardTitle>{test.title}</CardTitle>
                      <CardDescription>
                        <div className="flex items-center mt-1">
                          <Calendar className="h-4 w-4 mr-1 text-gray-500" />
                          <span>{test.date}</span>
                          <Clock className="h-4 w-4 ml-3 mr-1 text-gray-500" />
                          <span>{test.time}</span>
                        </div>
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Duration:</span>
                          <span>{test.duration} minutes</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Students:</span>
                          <span>{test.students}</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                      <Button size="sm">View Details</Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            {filteredCompleted.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No completed tests found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCompleted.map((test) => (
                  <Card key={test.id}>
                    <CardHeader>
                      <CardTitle>{test.title}</CardTitle>
                      <CardDescription>
                        <div className="flex items-center mt-1">
                          <Calendar className="h-4 w-4 mr-1 text-gray-500" />
                          <span>{test.date}</span>
                          <Clock className="h-4 w-4 ml-3 mr-1 text-gray-500" />
                          <span>{test.time}</span>
                        </div>
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Duration:</span>
                          <span>{test.duration} minutes</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Students:</span>
                          <span>{test.students}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Average Score:</span>
                          <span className="font-medium">{test.avgScore}%</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button variant="outline" size="sm">
                        <FileText className="h-4 w-4 mr-1" /> Export Results
                      </Button>
                      <Link href={`/teacher/tests/${test.id}/results`}>
                        <Button size="sm">View Results</Button>
                      </Link>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
