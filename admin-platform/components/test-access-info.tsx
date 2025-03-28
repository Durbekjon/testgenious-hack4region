"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Copy, QrCode, LinkIcon, Check } from "lucide-react"

type TestAccessInfoProps = {
  testCode: string
  testLink: string
  qrCodeUrl: string
}

export function TestAccessInfo({ testCode, testLink, qrCodeUrl }: TestAccessInfoProps) {
  const [activeTab, setActiveTab] = useState("code")
  const [copied, setCopied] = useState<"code" | "link" | null>(null)

  const handleCopy = (type: "code" | "link", text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(type)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Test Access Information</CardTitle>
        <CardDescription>Share this information with participants to allow them to join the test</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="code" className="flex items-center gap-2">
              <span className="font-mono text-xs">ABC</span>
              <span>Access Code</span>
            </TabsTrigger>
            <TabsTrigger value="qr" className="flex items-center gap-2">
              <QrCode className="h-4 w-4" />
              <span>QR Code</span>
            </TabsTrigger>
            <TabsTrigger value="link" className="flex items-center gap-2">
              <LinkIcon className="h-4 w-4" />
              <span>Direct Link</span>
            </TabsTrigger>
          </TabsList>

          <AnimatePresence mode="wait">
            <TabsContent value="code" asChild>
              <motion.div
                key="code-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <div className="mt-4 space-y-4">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Share this code with participants to join the test:</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input value={testCode} readOnly className="font-mono text-lg text-center" />
                    <Button variant="outline" size="icon" onClick={() => handleCopy("code", testCode)}>
                      {copied === "code" ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                      <span className="sr-only">Copy code</span>
                    </Button>
                  </div>
                  <p className="text-center text-sm text-muted-foreground">
                    Participants can enter this code on the test platform to join.
                  </p>
                </div>
              </motion.div>
            </TabsContent>

            <TabsContent value="qr" asChild>
              <motion.div
                key="qr-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <div className="mt-4 flex flex-col items-center space-y-4">
                  <p className="text-sm text-muted-foreground">Participants can scan this QR code to join the test:</p>
                  <div className="rounded-lg border bg-background p-2">
                    <img src={qrCodeUrl || "/placeholder.svg"} alt="QR Code" className="h-48 w-48" />
                  </div>
                  <Button variant="outline" size="sm">
                    Download QR Code
                  </Button>
                </div>
              </motion.div>
            </TabsContent>

            <TabsContent value="link" asChild>
              <motion.div
                key="link-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <div className="mt-4 space-y-4">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Share this link with participants to join the test:</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input value={testLink} readOnly className="font-mono text-xs" />
                    <Button variant="outline" size="icon" onClick={() => handleCopy("link", testLink)}>
                      {copied === "link" ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                      <span className="sr-only">Copy link</span>
                    </Button>
                  </div>
                  <p className="text-center text-sm text-muted-foreground">
                    Participants can click this link to directly join the test.
                  </p>
                </div>
              </motion.div>
            </TabsContent>
          </AnimatePresence>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-center border-t bg-muted/50 px-6 py-4">
        <p className="text-center text-sm text-muted-foreground">
          <strong>Note:</strong> This information will no longer be accessible once the test starts.
        </p>
      </CardFooter>
    </Card>
  )
}

