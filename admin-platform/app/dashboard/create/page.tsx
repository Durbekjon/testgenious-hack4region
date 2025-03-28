"use client"

import type React from "react"

import { useState, useEffect, useCallback, useRef } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { motion } from "framer-motion"
import { ArrowLeft, ArrowRight, BookOpen, FileText, Upload, Check, Loader2, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { TestPreview } from "@/components/test-preview"
import { initSocket, getSocket, emitEvent, onEvent, EVENTS } from "@/lib/socket"

// Interface for the payload expected by the backend
interface IPayload {
  subject: string
  topic: string
  difficulty_level: string
  test_format: string
  number_of_questions: number
  user_prompt: string
}

// Form schema
const formSchema = z.object({
  subject: z.string().min(1, "Subject is required"),
  topic: z.string().min(1, "Topic is required"),
  difficulty_level: z.string().min(1, "Difficulty is required"),
  test_format: z.string().min(1, "Format is required"),
  language: z.string().min(1, "Language is required"),
  number_of_questions: z.number().min(5).max(50),
  user_prompt: z.string().optional(),
})

export default function CreatePage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [method, setMethod] = useState<"form" | "book">("form")
  const [file, setFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingProgress, setProcessingProgress] = useState(0)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatingProgress, setGeneratingProgress] = useState(0)
  const [extractedTopics, setExtractedTopics] = useState<string[]>([])
  const [selectedTopics, setSelectedTopics] = useState<string[]>([])
  const [isConnected, setIsConnected] = useState(true) // Start with true for better UX
  const [error, setError] = useState<string | null>(null)
  const [testData, setTestData] = useState<any>(null)
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const socketInitializedRef = useRef(false)

  // Initialize form with optimized default values
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      subject: "math",
      topic: "",
      difficulty_level: "medium",
      test_format: "multiple-choice",
      language: "english",
      number_of_questions: 20,
      user_prompt: "",
    },
  })

  // Simulate progress for better UX
  const simulateProgress = useCallback(() => {
    // Clear any existing interval
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current)
    }

    // Start with a small increment
    let progress = 5

    progressIntervalRef.current = setInterval(() => {
      // Gradually increase progress with random increments
      const increment = Math.random() * 5 + 1
      progress += increment

      // Cap at 95% to wait for actual completion
      if (progress >= 95) {
        if (progressIntervalRef.current) {
          clearInterval(progressIntervalRef.current)
          progressIntervalRef.current = null
        }
        setGeneratingProgress(95)
      } else {
        setGeneratingProgress(progress)
      }
    }, 800)
  }, [])

  // Clear progress interval
  const clearProgressInterval = useCallback(() => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current)
      progressIntervalRef.current = null
    }
  }, [])

  // Initialize socket connection
  useEffect(() => {
    if (socketInitializedRef.current) return

    // Initialize socket
    initSocket()

    // Set up event handlers
    const handleConnect = () => {
      console.log("Socket connected successfully")
      setIsConnected(true)
      setError(null)
    }

    const handleDisconnect = () => {
      console.log("Socket disconnected")
      setIsConnected(false)
    }

    const handleError = (err: any) => {
      console.error("Socket connection error:", err)
      setError(err.message || "Connection error")
      setIsConnected(false)
    }

    const socket = getSocket()
    if (socket) {
      socket.on("connect", handleConnect)
      socket.on("disconnect", handleDisconnect)
      socket.on("connect_error", handleError)

      // Check initial connection state
      setIsConnected(socket.connected)
    }

    socketInitializedRef.current = true

    return () => {
      const socket = getSocket()
      if (socket) {
        socket.off("connect", handleConnect)
        socket.off("disconnect", handleDisconnect)
        socket.off("connect_error", handleError)
      }
    }
  }, [])

  // Set up test event handlers
  useEffect(() => {
    // Handle test progress updates
    const progressCleanup = onEvent(EVENTS.TEST_PROGRESS, (data) => {
      console.log("Test progress:", data)
      const progress = Math.max(data.progress || 0, generatingProgress)
      setGeneratingProgress(progress)
    })

    // Handle test creation completion
    const createdCleanup = onEvent(EVENTS.TEST_CREATED, (data) => {
      console.log("Test created:", data)

      // Clear progress interval
      clearProgressInterval()

      // Update state
      setTestData(data)
      setIsGenerating(false)
      setGeneratingProgress(100)

      // Move to preview step
      setTimeout(() => {
        setStep(3)
      }, 500)
    })

    // Handle errors
    const errorCleanup = onEvent(EVENTS.ERROR, (err) => {
      console.error("Server error:", err)
      setError(err.message || "Server error")
      setIsGenerating(false)
      clearProgressInterval()
    })

    return () => {
      progressCleanup()
      createdCleanup()
      errorCleanup()
      clearProgressInterval()
    }
  }, [generatingProgress, clearProgressInterval])

  // Handle file drop
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0]
      const fileType = droppedFile.type

      // Check if file is PDF, DOCX, or TXT
      if (
        fileType === "application/pdf" ||
        fileType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
        fileType === "text/plain"
      ) {
        setFile(droppedFile)
      } else {
        alert("Please upload a PDF, DOCX, or TXT file")
      }
    }
  }

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0])
    }
  }

  // Process book - optimized with smoother progress
  const processBook = () => {
    if (!file) return

    setIsProcessing(true)
    setProcessingProgress(0)

    // Simulate processing with smoother progress updates
    let progress = 0
    const interval = setInterval(() => {
      progress += Math.random() * 8 + 2 // Random increment between 2-10

      if (progress >= 100) {
        clearInterval(interval)
        setProcessingProgress(100)

        setTimeout(() => {
          setIsProcessing(false)

          // Mock extracted topics
          const mockTopics = [
            "Linear Equations",
            "Quadratic Equations",
            "Polynomials",
            "Factoring",
            "Rational Expressions",
            "Radicals",
            "Complex Numbers",
            "Functions",
          ]
          setExtractedTopics(mockTopics)
        }, 500)
      } else {
        setProcessingProgress(progress)
      }
    }, 300)
  }

  // Toggle topic selection
  const toggleTopic = (topic: string) => {
    if (selectedTopics.includes(topic)) {
      setSelectedTopics(selectedTopics.filter((t) => t !== topic))
    } else {
      setSelectedTopics([...selectedTopics, topic])
    }
  }

  // Handle form submission
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (method === "form") {
      handleGenerate(values)
    } else {
      handleGenerateFromBook(values)
    }
  }

  // Generate test from form
  const handleGenerate = (values: z.infer<typeof formSchema>) => {
    const socket = getSocket()

    if (!socket) {
      setError("Not connected to server")
      return
    }

    setIsGenerating(true)
    setGeneratingProgress(0)

    // Start progress simulation
    simulateProgress()

    // Create payload according to the expected interface
    const payload: IPayload = {
      subject: values.subject,
      topic: values.topic,
      difficulty_level: values.difficulty_level,
      test_format: values.test_format,
      number_of_questions: values.number_of_questions,
      user_prompt: values.user_prompt || "",
    }

    // Emit event to create test by form
    emitEvent(EVENTS.CREATE_TEST_BY_FORM, payload)
  }

  // Generate test from book
  const handleGenerateFromBook = (values: z.infer<typeof formSchema>) => {
    const socket = getSocket()

    if (!socket) {
      setError("Not connected to server")
      return
    }

    if (!file || selectedTopics.length === 0) {
      alert("Please upload a file and select at least one topic")
      return
    }

    setIsGenerating(true)
    setGeneratingProgress(0)

    // Start progress simulation
    simulateProgress()

    // Create payload according to the expected interface
    const payload: IPayload = {
      subject: values.subject,
      topic: selectedTopics.join(", "),
      difficulty_level: values.difficulty_level,
      test_format: values.test_format,
      number_of_questions: values.number_of_questions,
      user_prompt: `Book: ${file.name}. ${values.user_prompt || ""}`,
    }

    // Emit event to create test by book
    emitEvent(EVENTS.CREATE_TEST_BY_BOOK, payload)
  }

  // Force move to next step (for debugging)
  const forceNextStep = () => {
    clearProgressInterval()
    setIsGenerating(false)
    setGeneratingProgress(100)
    setStep(3)
  }

  // Next step
  const nextStep = () => {
    if (step < 3) {
      setStep(step + 1)
    }
  }

  // Previous step
  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  // Handle test save
  const handleSaveTest = () => {
    // Here you would typically save the test to your backend
    alert("Test saved successfully!")
    router.push("/dashboard")
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Create Test</h1>
        <p className="text-muted-foreground">Generate a new test using AI</p>
      </div>

      {/* Connection status */}
      <div className="mb-4">
        <div className={`flex items-center gap-2 ${isConnected ? "text-green-500" : "text-red-500"}`}>
          <div className={`w-3 h-3 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"}`}></div>
          <span>{isConnected ? "Connected to server" : "Not connected to server"}</span>
        </div>
        {error && <p className="text-red-500 mt-1">{error}</p>}
      </div>

      {/* Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full ${
                step >= 1 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}
            >
              1
            </div>
            <div className={`mx-2 h-1 w-10 ${step >= 2 ? "bg-primary" : "bg-muted"}`} />
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full ${
                step >= 2 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}
            >
              2
            </div>
            <div className={`mx-2 h-1 w-10 ${step >= 3 ? "bg-primary" : "bg-muted"}`} />
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full ${
                step >= 3 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}
            >
              3
            </div>
          </div>
          <div className="text-sm text-muted-foreground">
            {step === 1 && "Choose method"}
            {step === 2 && "Configure test"}
            {step === 3 && "Preview test"}
          </div>
        </div>
      </div>

      {/* Step 1: Choose method */}
      {step === 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <div className="grid gap-6 md:grid-cols-2">
            <div
              className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border p-6 text-center hover:border-primary ${
                method === "form" ? "border-primary bg-primary/5" : ""
              }`}
              onClick={() => setMethod("form")}
            >
              <FileText className="mb-4 h-12 w-12 text-primary" />
              <h3 className="mb-2 text-xl font-medium">Create from Form</h3>
              <p className="text-sm text-muted-foreground">
                Enter subject, topics, and other details to generate a test
              </p>
            </div>
            <div
              className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border p-6 text-center hover:border-primary ${
                method === "book" ? "border-primary bg-primary/5" : ""
              }`}
              onClick={() => setMethod("book")}
            >
              <BookOpen className="mb-4 h-12 w-12 text-primary" />
              <h3 className="mb-2 text-xl font-medium">Create from Book</h3>
              <p className="text-sm text-muted-foreground">
                Upload a book (PDF, DOCX, TXT) and select topics to generate a test
              </p>
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <Button onClick={nextStep}>
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </motion.div>
      )}

      {/* Step 2: Configure test */}
      {step === 2 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {method === "form" ? (
                <>
                  <div className="grid gap-6 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Subject</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Mathematics, Physics, History" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="topic"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Topic</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Algebra, Calculus, Geometry" {...field} />
                          </FormControl>
                          <FormDescription>Separate multiple topics with commas</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-4">
                    <div
                      className={`flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 ${
                        isDragging ? "border-primary bg-primary/5" : ""
                      }`}
                      onDragOver={(e) => {
                        e.preventDefault()
                        setIsDragging(true)
                      }}
                      onDragLeave={() => setIsDragging(false)}
                      onDrop={handleDrop}
                    >
                      {file ? (
                        <div className="text-center">
                          <Check className="mx-auto mb-2 h-8 w-8 text-green-500" />
                          <p className="mb-1 font-medium">{file.name}</p>
                          <p className="text-sm text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                          <Button variant="outline" size="sm" className="mt-2" onClick={() => setFile(null)}>
                            Remove
                          </Button>
                        </div>
                      ) : (
                        <>
                          <Upload className="mb-4 h-12 w-12 text-muted-foreground" />
                          <h3 className="mb-2 text-lg font-medium">Drag and drop your file here</h3>
                          <p className="mb-4 text-sm text-muted-foreground">Supports PDF, DOCX, and TXT files</p>
                          <div className="flex items-center space-x-2">
                            <label htmlFor="file-upload">
                              <div className="flex cursor-pointer items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                                Browse files
                              </div>
                              <input
                                id="file-upload"
                                type="file"
                                className="hidden"
                                accept=".pdf,.docx,.txt"
                                onChange={handleFileChange}
                              />
                            </label>
                          </div>
                        </>
                      )}
                    </div>

                    {file && !isProcessing && processingProgress === 0 && (
                      <Button type="button" onClick={processBook} className="w-full">
                        Process Book
                      </Button>
                    )}

                    {isProcessing && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Processing book...</span>
                          <span>{Math.round(processingProgress)}%</span>
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                          <div className="h-full bg-primary" style={{ width: `${processingProgress}%` }} />
                        </div>
                      </div>
                    )}

                    {extractedTopics.length > 0 && (
                      <div className="space-y-2">
                        <h3 className="font-medium">Extracted Topics</h3>
                        <p className="text-sm text-muted-foreground">
                          Select the topics you want to include in your test
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {extractedTopics.map((topic) => (
                            <div
                              key={topic}
                              className={`cursor-pointer rounded-full px-3 py-1 text-sm ${
                                selectedTopics.includes(topic)
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-muted text-muted-foreground"
                              }`}
                              onClick={() => toggleTopic(topic)}
                            >
                              {topic}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}

              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="difficulty_level"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Difficulty</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select difficulty" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="easy">Easy</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="hard">Hard</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="test_format"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Format</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select format" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
                          <SelectItem value="true-false">True/False</SelectItem>
                          <SelectItem value="short-answer">Short Answer</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="language"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Language</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select language" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="english">English</SelectItem>
                          <SelectItem value="spanish">Spanish</SelectItem>
                          <SelectItem value="french">French</SelectItem>
                          <SelectItem value="german">German</SelectItem>
                          <SelectItem value="chinese">Chinese</SelectItem>
                          <SelectItem value="japanese">Japanese</SelectItem>
                          <SelectItem value="russian">Russian</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="number_of_questions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Number of Questions: {field.value}</FormLabel>
                      <FormControl>
                        <Slider
                          min={5}
                          max={50}
                          step={1}
                          defaultValue={[field.value]}
                          onValueChange={(value) => field.onChange(value[0])}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="user_prompt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Additional Instructions (Optional)</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Any specific instructions or requirements for the test" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-between">
                <Button type="button" variant="outline" onClick={prevStep}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <div className="flex gap-2">
                  {isGenerating && (
                    <Button type="button" variant="outline" onClick={forceNextStep}>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Skip Loading
                    </Button>
                  )}
                  <Button type="submit" disabled={isGenerating}>
                    {isGenerating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        Generate with AI
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {isGenerating && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Generating test...</span>
                    <span>{Math.round(generatingProgress)}%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div className="h-full bg-primary" style={{ width: `${generatingProgress}%` }} />
                  </div>
                </div>
              )}
            </form>
          </Form>
        </motion.div>
      )}

      {/* Step 3: Preview test */}
      {step === 3 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <div className="space-y-6">
            <TestPreview testData={testData} />
            <div className="flex justify-between">
              <Button variant="outline" onClick={prevStep}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button onClick={handleSaveTest}>
                Save Test
                <Check className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}

