"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Pencil, Plus, Trash, Save, Download, FileText, FileSpreadsheet, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { motion, AnimatePresence } from "framer-motion"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { toast } from "@/components/ui/use-toast"

// Define types for the server response data
interface ServerOption {
  id: string
  text: string
}

interface ServerQuestion {
  question_id: string
  question: string
  options: ServerOption[]
  correct_answer_id: string
  options_order: string[]
  explanation: string
}

interface ServerTestData {
  test_id: string
  generated_part: number
  total_parts: number
  questions: ServerQuestion[]
  continue: boolean
}

// Define types for the component's internal data structure
interface TestQuestion {
  id: number
  text: string
  type: string
  options: { id: string; text: string }[]
  correctAnswer: string
}

interface TestData {
  id: string
  title: string
  description: string
  questions: TestQuestion[]
}

interface TestPreviewProps {
  testData?: ServerTestData | null
}

export function TestPreview({ testData }: TestPreviewProps) {
  const router = useRouter()

  // State for the test data
  const [test, setTest] = useState<TestData>({
    ...mockTest,
    id: testData?.test_id || "test-" + Math.random().toString(36).substring(2, 9),
  })
  const [editingTitle, setEditingTitle] = useState(false)
  const [editingDescription, setEditingDescription] = useState(false)
  const [editingQuestion, setEditingQuestion] = useState<number | null>(null)
  const [title, setTitle] = useState(testData?.test_id || "Algebra Fundamentals")
  const [description, setDescription] = useState(
    "A comprehensive test covering basic algebraic concepts and equations.",
  )
  const [isDownloading, setIsDownloading] = useState(false)

  // State for editing a question
  const [editQuestionText, setEditQuestionText] = useState("")
  const [editQuestionOptions, setEditQuestionOptions] = useState<{ id: string; text: string }[]>([])
  const [editQuestionCorrectAnswer, setEditQuestionCorrectAnswer] = useState("")
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  // Update test data when testData prop changes
  useEffect(() => {
    if (testData) {
      // Convert server data format to component format
      const convertedTest: TestData = {
        id: testData.test_id,
        title: testData.test_id,
        description: "A comprehensive test covering basic algebraic concepts and equations.",
        questions: testData.questions.map((q) => ({
          id: Number.parseInt(q.question_id.replace("q", "")),
          text: q.question,
          type: "multiple-choice",
          options: q.options.map((opt) => ({
            id: opt.id,
            text: opt.text,
          })),
          correctAnswer: q.correct_answer_id,
        })),
      }

      setTest(convertedTest)
      setTitle(testData.test_id)
    }
  }, [testData])

  const handleSaveTitle = () => {
    setTest({ ...test, title })
    setEditingTitle(false)
  }

  const handleSaveDescription = () => {
    setTest({ ...test, description })
    setEditingDescription(false)
  }

  const handleDeleteQuestion = (id: number) => {
    setTest({
      ...test,
      questions: test.questions.filter((q) => q.id !== id),
    })
  }

  const handleAddQuestion = () => {
    const newQuestion: TestQuestion = {
      id: Math.max(0, ...test.questions.map((q) => q.id)) + 1,
      text: "New question",
      type: "multiple-choice",
      options: [
        { id: "a", text: "Option A" },
        { id: "b", text: "Option B" },
        { id: "c", text: "Option C" },
        { id: "d", text: "Option D" },
      ],
      correctAnswer: "a",
    }

    setTest({
      ...test,
      questions: [...test.questions, newQuestion],
    })

    // Open edit dialog for the new question
    openEditDialog(newQuestion)
  }

  const openEditDialog = (question: TestQuestion) => {
    setEditingQuestion(question.id)
    setEditQuestionText(question.text)
    setEditQuestionOptions([...question.options])
    setEditQuestionCorrectAnswer(question.correctAnswer)
    setIsEditDialogOpen(true)
  }

  const handleSaveQuestion = () => {
    if (editingQuestion === null) return

    const updatedQuestions = test.questions.map((q) => {
      if (q.id === editingQuestion) {
        return {
          ...q,
          text: editQuestionText,
          options: [...editQuestionOptions],
          correctAnswer: editQuestionCorrectAnswer,
        }
      }
      return q
    })

    setTest({
      ...test,
      questions: updatedQuestions,
    })

    setIsEditDialogOpen(false)
    setEditingQuestion(null)
  }

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...editQuestionOptions]
    newOptions[index] = { ...newOptions[index], text: value }
    setEditQuestionOptions(newOptions)
  }

  const handleStartTest = () => {
    // Navigate to the monitoring page with the test ID
    const testId = test.id || testData?.test_id || "test-" + Math.random().toString(36).substring(2, 9)

    // Show toast notification
    toast({
      title: "Test started",
      description: `Starting test: ${testId}`,
    })

    // Navigate to monitoring page with test ID
    router.push(`/dashboard/monitor?testId=${encodeURIComponent(testId)}`)
  }

  const handleDownload = (format: "pdf" | "word" | "excel") => {
    setIsDownloading(true)

    // Simulate download delay
    setTimeout(() => {
      setIsDownloading(false)

      // Show success toast
      toast({
        title: "Download complete",
        description: `Test has been downloaded in ${format.toUpperCase()} format.`,
      })
    }, 1500)

    // In a real application, you would make an API call to generate and download the file
    console.log(`Downloading test in ${format} format:`, test)
  }

  return (
    <div className="space-y-6">
      {/* Test Title */}
      <div className="space-y-2">
        {editingTitle ? (
          <div className="space-y-2">
            <Label htmlFor="test-title">Test Title</Label>
            <div className="flex gap-2">
              <Input id="test-title" value={title} onChange={(e) => setTitle(e.target.value)} className="flex-1" />
              <Button onClick={handleSaveTitle}>Save</Button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">{test.title}</h2>
              <p className="text-sm text-muted-foreground">Test ID: {test.id}</p>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setEditingTitle(true)}>
              <Pencil className="h-4 w-4" />
              <span className="sr-only">Edit title</span>
            </Button>
          </div>
        )}
      </div>

      {/* Test Description */}
      <div className="space-y-2">
        {editingDescription ? (
          <div className="space-y-2">
            <Label htmlFor="test-description">Test Description</Label>
            <div className="flex gap-2">
              <Textarea
                id="test-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleSaveDescription}>Save</Button>
            </div>
          </div>
        ) : (
          <div className="flex items-start justify-between rounded-md border bg-muted/50 p-3">
            <p className="text-sm text-muted-foreground">{test.description}</p>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setEditingDescription(true)}>
              <Pencil className="h-4 w-4" />
              <span className="sr-only">Edit description</span>
            </Button>
          </div>
        )}
      </div>

      {/* Questions */}
      <div className="space-y-6">
        <h3 className="font-semibold">Questions</h3>
        <AnimatePresence>
          {test.questions.map((question, index) => (
            <motion.div
              key={question.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0, overflow: "hidden" }}
              transition={{ duration: 0.3 }}
              className="rounded-md border p-4"
            >
              <div className="mb-4 flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                    {index + 1}
                  </span>
                  <h4 className="font-medium">{question.text}</h4>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEditDialog(question)}>
                    <Pencil className="h-4 w-4" />
                    <span className="sr-only">Edit question</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive"
                    onClick={() => handleDeleteQuestion(question.id)}
                  >
                    <Trash className="h-4 w-4" />
                    <span className="sr-only">Delete question</span>
                  </Button>
                </div>
              </div>
              {question.type === "multiple-choice" && (
                <RadioGroup defaultValue={question.correctAnswer}>
                  {question.options.map((option) => (
                    <div key={option.id} className="flex items-center space-x-2">
                      <RadioGroupItem value={option.id} id={`q${question.id}-${option.id}`} />
                      <Label htmlFor={`q${question.id}-${option.id}`}>{option.text}</Label>
                    </div>
                  ))}
                </RadioGroup>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        <Button variant="outline" className="w-full" onClick={handleAddQuestion}>
          <Plus className="mr-2 h-4 w-4" />
          Add Question
        </Button>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" disabled={isDownloading}>
              {isDownloading ? (
                <>
                  <svg
                    className="mr-2 h-4 w-4 animate-spin"
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
                  Downloading...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Download Test
                </>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem onClick={() => handleDownload("pdf")} className="cursor-pointer">
              <FileText className="mr-2 h-4 w-4 text-red-500" />
              <span>PDF Format</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleDownload("word")} className="cursor-pointer">
              <FileText className="mr-2 h-4 w-4 text-blue-500" />
              <span>Word Format</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleDownload("excel")} className="cursor-pointer">
              <FileSpreadsheet className="mr-2 h-4 w-4 text-green-500" />
              <span>Excel Format</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button onClick={handleStartTest} className="gap-2 bg-green-600 hover:bg-green-700">
          <Play className="h-4 w-4" />
          Start Test
        </Button>
      </div>

      {/* Edit Question Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Question</DialogTitle>
            <DialogDescription>Make changes to the question and its options.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="question-text">Question</Label>
              <Textarea
                id="question-text"
                value={editQuestionText}
                onChange={(e) => setEditQuestionText(e.target.value)}
                className="min-h-[80px]"
              />
            </div>
            <div className="space-y-3">
              <Label>Options</Label>
              <RadioGroup value={editQuestionCorrectAnswer} onValueChange={setEditQuestionCorrectAnswer}>
                {editQuestionOptions.map((option, index) => (
                  <div key={option.id} className="flex items-center gap-2">
                    <RadioGroupItem value={option.id} id={`edit-option-${option.id}`} />
                    <Input
                      value={option.text}
                      onChange={(e) => handleOptionChange(index, e.target.value)}
                      placeholder={`Option ${option.id.toUpperCase()}`}
                    />
                  </div>
                ))}
              </RadioGroup>
              <p className="text-sm text-muted-foreground">Select the radio button for the correct answer.</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveQuestion}>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Mock data for a generated test (used as fallback)
const mockTest: TestData = {
  id: "test-" + Math.random().toString(36).substring(2, 9),
  title: "Algebra Fundamentals",
  description: "A comprehensive test covering basic algebraic concepts and equations.",
  questions: [
    {
      id: 1,
      text: "What is the value of x in the equation 2x + 5 = 13?",
      type: "multiple-choice",
      options: [
        { id: "a", text: "3" },
        { id: "b", text: "4" },
        { id: "c", text: "5" },
        { id: "d", text: "6" },
      ],
      correctAnswer: "b",
    },
    {
      id: 2,
      text: "Simplify the expression: 3(2x - 4) + 5",
      type: "multiple-choice",
      options: [
        { id: "a", text: "6x - 7" },
        { id: "b", text: "6x - 12 + 5" },
        { id: "c", text: "6x - 7" },
        { id: "d", text: "6x + 7" },
      ],
      correctAnswer: "c",
    },
    {
      id: 3,
      text: "If f(x) = 2x² - 3x + 1, what is f(2)?",
      type: "multiple-choice",
      options: [
        { id: "a", text: "3" },
        { id: "b", text: "5" },
        { id: "c", text: "7" },
        { id: "d", text: "9" },
      ],
      correctAnswer: "b",
    },
  ],
}

