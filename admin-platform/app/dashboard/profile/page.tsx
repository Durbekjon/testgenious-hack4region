"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Mail,
  MapPin,
  Briefcase,
  Calendar,
  FileText,
  Github,
  Twitter,
  Linkedin,
  Globe,
  Upload,
  Save,
} from "lucide-react"

export default function ProfilePage() {
  const [isLoading, setIsLoading] = useState(false)

  const handleSave = async () => {
    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsLoading(false)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Profile</h2>
        <p className="text-muted-foreground">Manage your personal information and public profile.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Update your personal details and public profile.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <Avatar className="h-24 w-24 border-4 border-background">
                <AvatarImage src="/placeholder.svg?height=96&width=96" alt="John Doe" />
                <AvatarFallback className="text-2xl">JD</AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <h3 className="text-xl font-semibold">John Doe</h3>
                <p className="text-sm text-muted-foreground">john.doe@example.com</p>
                <div className="flex gap-2 mt-2">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Upload className="h-4 w-4" />
                    Change Photo
                  </Button>
                </div>
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" defaultValue="John Doe" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="display-name">Display Name</Label>
                <Input id="display-name" defaultValue="John Doe" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" defaultValue="john.doe@example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" type="tel" defaultValue="+1 (555) 123-4567" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <Input id="location" defaultValue="New York, NY" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="occupation">Occupation</Label>
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                  <Input id="occupation" defaultValue="Teacher" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <textarea
                id="bio"
                className="w-full min-h-[120px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Tell us about yourself"
                defaultValue="I'm a high school teacher specializing in mathematics and computer science. I've been using TestGenius AI to create engaging assessments for my students."
              />
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Social Profiles</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <Input id="website" placeholder="https://yourwebsite.com" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="github">GitHub</Label>
                  <div className="flex items-center gap-2">
                    <Github className="h-4 w-4 text-muted-foreground" />
                    <Input id="github" placeholder="github.com/username" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="twitter">Twitter</Label>
                  <div className="flex items-center gap-2">
                    <Twitter className="h-4 w-4 text-muted-foreground" />
                    <Input id="twitter" placeholder="twitter.com/username" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="linkedin">LinkedIn</Label>
                  <div className="flex items-center gap-2">
                    <Linkedin className="h-4 w-4 text-muted-foreground" />
                    <Input id="linkedin" placeholder="linkedin.com/in/username" />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button variant="outline">Cancel</Button>
            <Button onClick={handleSave} disabled={isLoading} className="gap-2">
              {isLoading ? (
                "Saving..."
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </CardFooter>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Overview</CardTitle>
              <CardDescription>Your public profile information.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col items-center text-center">
                <Avatar className="h-20 w-20 mb-4">
                  <AvatarImage src="/placeholder.svg?height=80&width=80" alt="John Doe" />
                  <AvatarFallback className="text-xl">JD</AvatarFallback>
                </Avatar>
                <h3 className="text-xl font-semibold">John Doe</h3>
                <p className="text-sm text-muted-foreground">Teacher at Acme High School</p>
                <div className="flex items-center gap-1 mt-1">
                  <MapPin className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">New York, NY</span>
                </div>
                <div className="flex gap-1 mt-3">
                  <Badge variant="secondary">Mathematics</Badge>
                  <Badge variant="secondary">Computer Science</Badge>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">john.doe@example.com</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Joined January 2023</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">142 Tests Created</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Activity Stats</CardTitle>
              <CardDescription>Your activity on TestGenius AI.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Tests Created</span>
                  <span className="font-medium">142</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Active Students</span>
                  <span className="font-medium">2,853</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Completion Rate</span>
                  <span className="font-medium">87%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Average Score</span>
                  <span className="font-medium">78%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Your recent activity on TestGenius AI.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="tests" className="space-y-4">
            <TabsList>
              <TabsTrigger value="tests">Tests</TabsTrigger>
              <TabsTrigger value="students">Students</TabsTrigger>
              <TabsTrigger value="results">Results</TabsTrigger>
            </TabsList>

            <TabsContent value="tests" className="space-y-4">
              <div className="rounded-md border">
                <div className="grid grid-cols-12 border-b bg-muted/50 px-4 py-2 text-sm font-medium">
                  <div className="col-span-5">Test Name</div>
                  <div className="col-span-2">Subject</div>
                  <div className="col-span-2">Questions</div>
                  <div className="col-span-3">Created</div>
                </div>
                <div className="divide-y">
                  {[
                    { name: "Algebra Fundamentals", subject: "Mathematics", questions: 15, date: "Mar 15, 2023" },
                    { name: "Cell Biology Basics", subject: "Science", questions: 20, date: "Apr 10, 2023" },
                    { name: "Grammar and Punctuation", subject: "English", questions: 25, date: "May 5, 2023" },
                    { name: "World War II Overview", subject: "History", questions: 18, date: "Jun 20, 2023" },
                    { name: "JavaScript Fundamentals", subject: "Programming", questions: 30, date: "Jul 15, 2023" },
                  ].map((test, index) => (
                    <div key={index} className="grid grid-cols-12 items-center px-4 py-3 text-sm hover:bg-muted/30">
                      <div className="col-span-5 font-medium">{test.name}</div>
                      <div className="col-span-2">{test.subject}</div>
                      <div className="col-span-2">{test.questions}</div>
                      <div className="col-span-3 text-muted-foreground">{test.date}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-center">
                <Button variant="outline" size="sm">
                  View All Tests
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="students" className="space-y-4">
              <div className="rounded-md border">
                <div className="grid grid-cols-12 border-b bg-muted/50 px-4 py-2 text-sm font-medium">
                  <div className="col-span-4">Student Name</div>
                  <div className="col-span-4">Email</div>
                  <div className="col-span-2">Tests Taken</div>
                  <div className="col-span-2">Avg. Score</div>
                </div>
                <div className="divide-y">
                  {[
                    { name: "Alice Johnson", email: "alice.j@example.com", tests: 12, score: "85%" },
                    { name: "Bob Smith", email: "bob.s@example.com", tests: 8, score: "72%" },
                    { name: "Carol Williams", email: "carol.w@example.com", tests: 15, score: "91%" },
                    { name: "David Brown", email: "david.b@example.com", tests: 10, score: "68%" },
                    { name: "Eve Davis", email: "eve.d@example.com", tests: 7, score: "79%" },
                  ].map((student, index) => (
                    <div key={index} className="grid grid-cols-12 items-center px-4 py-3 text-sm hover:bg-muted/30">
                      <div className="col-span-4 font-medium">{student.name}</div>
                      <div className="col-span-4 text-muted-foreground">{student.email}</div>
                      <div className="col-span-2">{student.tests}</div>
                      <div className="col-span-2">{student.score}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-center">
                <Button variant="outline" size="sm">
                  View All Students
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="results" className="space-y-4">
              <div className="rounded-md border">
                <div className="grid grid-cols-12 border-b bg-muted/50 px-4 py-2 text-sm font-medium">
                  <div className="col-span-3">Test Name</div>
                  <div className="col-span-3">Student</div>
                  <div className="col-span-2">Score</div>
                  <div className="col-span-2">Time Spent</div>
                  <div className="col-span-2">Date</div>
                </div>
                <div className="divide-y">
                  {[
                    {
                      test: "Algebra Fundamentals",
                      student: "Alice Johnson",
                      score: "92%",
                      time: "45m",
                      date: "Mar 18, 2023",
                    },
                    {
                      test: "Cell Biology Basics",
                      student: "Bob Smith",
                      score: "78%",
                      time: "38m",
                      date: "Apr 12, 2023",
                    },
                    {
                      test: "Grammar and Punctuation",
                      student: "Carol Williams",
                      score: "85%",
                      time: "52m",
                      date: "May 8, 2023",
                    },
                    {
                      test: "World War II Overview",
                      student: "David Brown",
                      score: "71%",
                      time: "41m",
                      date: "Jun 22, 2023",
                    },
                    {
                      test: "JavaScript Fundamentals",
                      student: "Eve Davis",
                      score: "89%",
                      time: "60m",
                      date: "Jul 18, 2023",
                    },
                  ].map((result, index) => (
                    <div key={index} className="grid grid-cols-12 items-center px-4 py-3 text-sm hover:bg-muted/30">
                      <div className="col-span-3 font-medium">{result.test}</div>
                      <div className="col-span-3">{result.student}</div>
                      <div className="col-span-2">{result.score}</div>
                      <div className="col-span-2">{result.time}</div>
                      <div className="col-span-2 text-muted-foreground">{result.date}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-center">
                <Button variant="outline" size="sm">
                  View All Results
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

