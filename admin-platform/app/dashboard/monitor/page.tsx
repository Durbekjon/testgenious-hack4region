"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  AlertCircle,
  Clock,
  Eye,
  Play,
  Pause,
  MoreHorizontal,
  UserCheck,
  UserX,
  Download,
  XCircle,
  AlertTriangle,
  BarChart3,
  PieChart,
  CheckCircle2,
  FileText,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { RemoveParticipantDialog } from "@/components/remove-participant-dialog"
import { TestTimer } from "@/components/test-timer"
import { TestDurationSlider } from "@/components/test-duration-slider"
import { TestAccessInfo } from "@/components/test-access-info"
import { TestResultsCharts } from "@/components/test-results-charts"
import { DownloadResultsDialog } from "@/components/download-results-dialog"
import { useLanguage } from "@/contexts/language-context" // Add this import

// Mock data for participants
// Remove this entire mock data block

export default function TestMonitorPage() {
  const searchParams = useSearchParams()
  const testId = searchParams.get("testId")

  const [participants, setParticipants] = useState<
    Array<{
      id: number
      name: string
      email: string
      status: string
      progress: number
      joinedAt: Date
    }>
  >([])
  const [testStarted, setTestStarted] = useState(false)
  const [testPaused, setTestPaused] = useState(false)
  const [testDuration, setTestDuration] = useState(60) // in minutes
  const [timeRemaining, setTimeRemaining] = useState(testDuration * 60) // in seconds
  const [showAlert, setShowAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState("")
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false)
  const [selectedParticipant, setSelectedParticipant] = useState<number | null>(null)
  const [testCompleted, setTestCompleted] = useState(false)
  const [gradingSystem, setGradingSystem] = useState<"percentage" | "points">("percentage")
  const [downloadDialogOpen, setDownloadDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { t } = useLanguage() // Get translation function

  // Generate test access info
  const [testAccessInfo] = useState({
    code: testId || `TEST-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
    link: `https://testgenius.ai/test/${testId || Math.random().toString(36).substring(2, 10)}`,
    qrCode: "/placeholder.svg?height=200&width=200",
  })

  // Load test data based on testId
  useEffect(() => {
    if (testId) {
      // In a real app, you would fetch test data from the server
      console.log(`Loading test data for test ID: ${testId}`)

      // For demo purposes, we'll just show an alert
      setAlertMessage(`Test loaded: ${testId}`)
      setShowAlert(true)

      // Hide alert after 5 seconds
      setTimeout(() => {
        setShowAlert(false)
      }, 5000)
    }
  }, [testId])

  // Simulate a participant leaving
  useEffect(() => {
    if (testStarted && !testPaused && participants.length > 0) {
      const timeout = setTimeout(() => {
        const randomIndex = Math.floor(Math.random() * participants.length)
        const randomParticipant = participants[randomIndex]

        if (randomParticipant.status === "active") {
          setAlertMessage(`${randomParticipant.name} has left the test or switched tabs.`)
          setShowAlert(true)

          setParticipants((prev) => prev.map((p) => (p.id === randomParticipant.id ? { ...p, status: "left" } : p)))
        }
      }, 30000) // Show alert after 30 seconds

      return () => clearTimeout(timeout)
    }
  }, [testStarted, testPaused, participants])

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout

    if (testStarted && !testPaused && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(interval)
            setTestCompleted(true)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }

    return () => clearInterval(interval)
  }, [testStarted, testPaused, timeRemaining])

  const handleStartTest = () => {
    setIsLoading(true)

    // Simulate loading
    setTimeout(() => {
      setTestStarted(true)
      setTimeRemaining(testDuration * 60)
      setIsLoading(false)
    }, 1500)
  }

  const handlePauseResumeTest = () => {
    setTestPaused((prev) => !prev)
  }

  const handleRemoveParticipant = (id: number) => {
    setSelectedParticipant(id)
    setRemoveDialogOpen(true)
  }

  const confirmRemoveParticipant = () => {
    if (selectedParticipant) {
      setParticipants((prev) => prev.filter((p) => p.id !== selectedParticipant))
    }
    setRemoveDialogOpen(false)
    setSelectedParticipant(null)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge variant="outline" className="bg-green-500/10 text-green-500 hover:bg-green-500/10">
            <UserCheck className="mr-1 h-3 w-3" />
            Active
          </Badge>
        )
      case "idle":
        return (
          <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/10">
            <AlertTriangle className="mr-1 h-3 w-3" />
            Idle
          </Badge>
        )
      case "left":
        return (
          <Badge variant="outline" className="bg-red-500/10 text-red-500 hover:bg-red-500/10">
            <UserX className="mr-1 h-3 w-3" />
            Left
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const averageProgress =
    participants.length > 0 ? Math.round(participants.reduce((acc, p) => acc + p.progress, 0) / participants.length) : 0

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{t("monitor.title")}</h2>
          <p className="text-muted-foreground">
            {t("monitor.subtitle")}
            {testId && <span className="font-medium"> - Test ID: {testId}</span>}
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          {!testStarted ? (
            <Button onClick={handleStartTest} disabled={isLoading} className="relative overflow-hidden group">
              {isLoading ? (
                <div className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  {t("monitor.starting")}
                </div>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4" />
                  {t("monitor.start")}
                  <span className="absolute inset-0 flex h-full w-full items-center justify-center bg-primary opacity-0 transition-opacity group-hover:opacity-10">
                    <Play className="h-12 w-12" />
                  </span>
                </>
              )}
            </Button>
          ) : (
            <Button variant={testPaused ? "default" : "outline"} onClick={handlePauseResumeTest}>
              {testPaused ? (
                <>
                  <Play className="mr-2 h-4 w-4" />
                  {t("monitor.resume")}
                </>
              ) : (
                <>
                  <Pause className="mr-2 h-4 w-4" />
                  {t("monitor.pause")}
                </>
              )}
            </Button>
          )}
          <Button variant="outline">
            <Eye className="mr-2 h-4 w-4" />
            {t("monitor.preview")}
          </Button>
        </div>
      </div>

      {showAlert && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>{t("monitor.attention")}</AlertTitle>
            <AlertDescription>{alertMessage}</AlertDescription>
            <Button variant="ghost" size="icon" className="absolute right-2 top-2" onClick={() => setShowAlert(false)}>
              <XCircle className="h-4 w-4" />
            </Button>
          </Alert>
        </motion.div>
      )}

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">{t("monitor.time_remaining")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              {testStarted ? (
                <div className="flex items-center">
                  <Clock className="mr-2 h-5 w-5 text-muted-foreground" />
                  <TestTimer seconds={timeRemaining} />
                </div>
              ) : (
                <TestDurationSlider value={testDuration} onChange={setTestDuration} disabled={testStarted} />
              )}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">{t("monitor.participants")}</CardTitle>
          </CardHeader>
          <CardContent>
            {participants.length > 0 ? (
              <>
                <div className="text-2xl font-bold">{participants.length}</div>
                <div className="mt-1 flex items-center gap-2">
                  <div className="flex items-center">
                    <div className="mr-1 h-2 w-2 rounded-full bg-green-500" />
                    <span className="text-xs text-muted-foreground">
                      {participants.filter((p) => p.status === "active").length} Active
                    </span>
                  </div>
                  <div className="flex items-center">
                    <div className="mr-1 h-2 w-2 rounded-full bg-yellow-500" />
                    <span className="text-xs text-muted-foreground">
                      {participants.filter((p) => p.status === "idle").length} Idle
                    </span>
                  </div>
                  <div className="flex items-center">
                    <div className="mr-1 h-2 w-2 rounded-full bg-red-500" />
                    <span className="text-xs text-muted-foreground">
                      {participants.filter((p) => p.status === "left").length} Left
                    </span>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <UserCheck className="h-10 w-10 text-muted-foreground/50" />
                <p className="mt-2 text-sm text-muted-foreground">No participants yet</p>
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">{t("monitor.average_progress")}</CardTitle>
          </CardHeader>
          <CardContent>
            {participants.length > 0 ? (
              <>
                <div className="text-2xl font-bold">{averageProgress}%</div>
                <Progress value={averageProgress} className="mt-2" />
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <BarChart3 className="h-10 w-10 text-muted-foreground/50" />
                <p className="mt-2 text-sm text-muted-foreground">No data available</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <AnimatePresence>
        {!testStarted && (
          <motion.div
            initial={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.5 }}
          >
            <TestAccessInfo
              testCode={testAccessInfo.code}
              testLink={testAccessInfo.link}
              qrCodeUrl={testAccessInfo.qrCode}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <Tabs defaultValue={testCompleted ? "results" : "participants"} className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList className="grid w-[400px] grid-cols-2">
            <TabsTrigger value="participants" className="flex items-center gap-2">
              <UserCheck className="h-4 w-4" />
              {t("monitor.participants_tab")}
            </TabsTrigger>
            <TabsTrigger value="results" disabled={!testCompleted} className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              {t("monitor.results_tab")}
            </TabsTrigger>
          </TabsList>

          {testCompleted && (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Label htmlFor="grading-system" className="text-sm">
                  Grading System:
                </Label>
                <Select
                  value={gradingSystem}
                  onValueChange={(value) => setGradingSystem(value as "percentage" | "points")}
                >
                  <SelectTrigger id="grading-system" className="w-32">
                    <SelectValue placeholder="Grading System" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage</SelectItem>
                    <SelectItem value="points">10-Point Scale</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={() => setDownloadDialogOpen(true)} className="gap-2">
                <Download className="h-4 w-4" />
                {t("monitor.export_results")}
              </Button>
            </div>
          )}
        </div>

        <TabsContent value="participants" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle>{t("monitor.participants_list")}</CardTitle>
                <Input placeholder={t("common.search")} className="max-w-xs" />
              </div>
            </CardHeader>
            <CardContent>
              {participants.length > 0 ? (
                <div className="rounded-md border">
                  <div className="grid grid-cols-12 border-b bg-muted/50 px-4 py-2 text-sm font-medium">
                    <div className="col-span-3">Name</div>
                    <div className="col-span-3">Email</div>
                    <div className="col-span-2">Status</div>
                    <div className="col-span-2">Progress</div>
                    <div className="col-span-2 text-right">{t("monitor.participant_actions")}</div>
                  </div>
                  <div className="divide-y">
                    {participants.map((participant) => (
                      <motion.div
                        key={participant.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        className="grid grid-cols-12 items-center px-4 py-3 text-sm"
                      >
                        <div className="col-span-3 font-medium">{participant.name}</div>
                        <div className="col-span-3 text-muted-foreground">{participant.email}</div>
                        <div className="col-span-2">{getStatusBadge(participant.status)}</div>
                        <div className="col-span-2">
                          <div className="flex items-center gap-2">
                            <Progress value={participant.progress} className="h-2" />
                            <span className="text-xs">{participant.progress}%</span>
                          </div>
                        </div>
                        <div className="col-span-2 flex justify-end">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Actions</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>{t("monitor.view_details")}</DropdownMenuItem>
                              <DropdownMenuItem>{t("monitor.send_message")}</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-destructive focus:text-destructive"
                                onClick={() => handleRemoveParticipant(participant.id)}
                              >
                                {t("monitor.remove_participant")}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center rounded-md border py-16 text-center">
                  <UserCheck className="h-12 w-12 text-muted-foreground/50" />
                  <h3 className="mt-4 text-lg font-medium">No participants yet</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Participants will appear here once they join the test
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="results" className="space-y-6">
          {participants.length > 0 ? (
            <>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                <div className="grid gap-4 md:grid-cols-3">
                  <Card className="transition-all hover:shadow-md">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">{t("monitor.avg_score")}</CardTitle>
                      <PieChart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{gradingSystem === "percentage" ? "78%" : "7.8"}</div>
                      <p className="text-xs text-muted-foreground">+5% from previous test</p>
                    </CardContent>
                  </Card>
                  <Card className="transition-all hover:shadow-md">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">{t("monitor.completion_rate")}</CardTitle>
                      <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">92%</div>
                      <p className="text-xs text-muted-foreground">+12% from previous test</p>
                    </CardContent>
                  </Card>
                  <Card className="transition-all hover:shadow-md">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">{t("monitor.avg_time")}</CardTitle>
                      <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">42m</div>
                      <p className="text-xs text-muted-foreground">-8m from previous test</p>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>

              <TestResultsCharts gradingSystem={gradingSystem} />

              <Card>
                <CardHeader>
                  <CardTitle>{t("monitor.detailed_results")}</CardTitle>
                  <CardDescription>Comprehensive breakdown of individual performance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <div className="grid grid-cols-12 border-b bg-muted/50 px-4 py-2 text-sm font-medium">
                      <div className="col-span-2">Name</div>
                      <div className="col-span-2 text-center">Score</div>
                      <div className="col-span-2 text-center">Correct</div>
                      <div className="col-span-2 text-center">Time Spent</div>
                      <div className="col-span-2 text-center">Status</div>
                      <div className="col-span-2 text-center">Actions</div>
                    </div>
                    <div className="divide-y">
                      {participants.map((participant, index) => {
                        // Calculate mock results
                        const correctAnswers = Math.floor(participant.progress / 10)
                        const incorrectAnswers = Math.floor(Math.random() * 5)
                        const totalQuestions = 10
                        const score = (correctAnswers / totalQuestions) * 100
                        const timeSpent = 20 + Math.floor(Math.random() * 40)
                        const cheatingAttempts = Math.random() > 0.8 ? Math.floor(Math.random() * 3) + 1 : 0

                        return (
                          <motion.div
                            key={participant.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                            className="grid grid-cols-12 items-center px-4 py-3 text-sm hover:bg-muted/30"
                          >
                            <div className="col-span-2 font-medium">{participant.name}</div>
                            <div className="col-span-2 text-center font-medium">
                              {gradingSystem === "percentage" ? `${score.toFixed(0)}%` : (score / 10).toFixed(1)}
                            </div>
                            <div className="col-span-2 text-center">
                              <span className="font-mono text-green-500">{correctAnswers}</span>
                              <span className="text-muted-foreground">/</span>
                              <span className="font-mono">{totalQuestions}</span>
                            </div>
                            <div className="col-span-2 text-center font-mono">{timeSpent}m</div>
                            <div className="col-span-2 text-center">
                              {cheatingAttempts > 0 ? (
                                <Badge variant="outline" className="bg-red-500/10 text-red-500">
                                  {cheatingAttempts} Suspicious
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="bg-green-500/10 text-green-500">
                                  Clean
                                </Badge>
                              )}
                            </div>
                            <div className="col-span-2 flex justify-center gap-2">
                              <Button variant="outline" size="sm" className="h-8 px-2">
                                <FileText className="mr-1 h-3 w-3" />
                                Details
                              </Button>
                              <Button variant="outline" size="sm" className="h-8 px-2">
                                <Download className="mr-1 h-3 w-3" />
                                Export
                              </Button>
                            </div>
                          </motion.div>
                        )
                      })}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end gap-4">
                  <Button variant="outline" className="gap-2">
                    <PieChart className="h-4 w-4" />
                    {t("monitor.generate_report")}
                  </Button>
                  <Button onClick={() => setDownloadDialogOpen(true)} className="gap-2">
                    <Download className="h-4 w-4" />
                    {t("monitor.export_results")}
                  </Button>
                </CardFooter>
              </Card>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-md border py-24 text-center">
              <BarChart3 className="h-16 w-16 text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-medium">No results available</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Results will be available once participants complete the test
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      <RemoveParticipantDialog
        open={removeDialogOpen}
        onOpenChange={setRemoveDialogOpen}
        onConfirm={confirmRemoveParticipant}
        participantName={participants.find((p) => p.id === selectedParticipant)?.name || ""}
      />

      <DownloadResultsDialog open={downloadDialogOpen} onOpenChange={setDownloadDialogOpen} />
    </div>
  )
}

