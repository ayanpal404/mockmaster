"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import {
  Brain, Code, Users, MessageSquare, UserCheck, Calendar, Trophy, TrendingUp, CircleDot, Upload,
} from "lucide-react"
import { BatteryWarning, Battery, BatteryLow , BatteryMedium, BatteryFull } from 'lucide-react';

const interviewRounds = [
  { id: "mcq", title: "MCQ", description: "Multiple Choice Questions", icon: Brain, color: "bg-blue-500" },
  { id: "group-discussion", title: "Group Discussion", description: "Team Collaboration", icon: Users, color: "bg-purple-500" },
  { id: "hr", title: "HR", description: "HR Round", icon: MessageSquare, color: "bg-orange-500" },
  { id: "peer-to-peer", title: "P2P", description: "Mock Interviews", icon: UserCheck, color: "bg-pink-500" },
]

const mockHistory = [
  { id: 1, date: "2024-01-15", roundType: "Coding", score: 85, difficulty: "Medium" },
  { id: 2, date: "2024-01-14", roundType: "HR", score: 92, difficulty: "Easy" },
  { id: 3, date: "2024-01-13", roundType: "MCQ", score: 78, difficulty: "Hard" },
  { id: 4, date: "2024-01-12", roundType: "GD", score: 88, difficulty: "Medium" },
]

const difficultyLevels = [
  { level: "Beginner", icon: BatteryWarning, color: "text-green-500" },
  { level: "Easy", icon: Battery, color: "text-blue-500" },
  { level: "Medium", icon: BatteryLow, color: "text-yellow-500" },
  { level: "Hard", icon: BatteryMedium, color: "text-orange-500" },
  { level: "Expert", icon: BatteryFull, color: "text-red-500" },
]

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  const [selectedRound, setSelectedRound] = useState<string | null>(null)
  const [jobRole, setJobRole] = useState<string>("")
  const [difficulty, setDifficulty] = useState<string>("")
  const [showDialog, setShowDialog] = useState(false)

  useEffect(() => {
    if (!loading && !user) router.push("/login")
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-primary"></div>
      </div>
    )
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "hard":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600 dark:text-green-400"
    if (score >= 75) return "text-yellow-600 dark:text-yellow-400"
    return "text-red-600 dark:text-red-400"
  }

  const handleRoundClick = (roundId: string) => {
    setSelectedRound(roundId)
    setShowDialog(true)
  }

  const handleStart = () => {
    if (jobRole && difficulty && selectedRound) {
      console.log("Start Interview with:", { selectedRound, jobRole, difficulty })
      // route to interview page
      router.push(`/interview?round=${selectedRound}&role=${jobRole}&difficulty=${difficulty}`)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 via-white to-gray-100 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900">
      <Navbar />

      <main className="pt-24 container mx-auto px-4 pb-16">
        {/* Welcome Section */}
        <section className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">Welcome back, {user?.name || "User"} 👋</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">Let's sharpen your interview skills and boost your confidence!</p>
        </section>

        {/* Interview Rounds */}
        <section className="mb-14">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
            <Brain className="h-6 w-6" /> Interview Rounds
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {interviewRounds.map((round) => (
              <Card
                key={round.id}
                className="cursor-pointer bg-white/60 dark:bg-gray-800/70 backdrop-blur-sm border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow"
                onClick={() => handleRoundClick(round.id)}
              >
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className={`h-12 w-12 flex items-center justify-center rounded-full ${round.color}`}>
                      <round.icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl mt-2">{round.title}</CardTitle>
                      <CardDescription>{round.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>

        {/* CV Management Section */}
        <section className="mb-14">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
            <Brain className="h-6 w-6" /> CV Management
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            <Card
              className="cursor-pointer bg-white/60 dark:bg-gray-800/70 backdrop-blur-sm border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow"
              onClick={() => router.push('/cv-manager')}
            >
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 flex items-center justify-center rounded-full bg-green-500">
                    <Upload className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl mt-2">CV Manager</CardTitle>
                    <CardDescription>Upload, parse, and search CVs with AI</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
            
            <Card className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border border-green-200 dark:border-green-700">
              <CardHeader>
                <CardTitle className="text-lg text-green-800 dark:text-green-200">AI-Powered CV Processing</CardTitle>
                <CardDescription className="text-green-700 dark:text-green-300">
                  • Upload PDF/DOC files<br/>
                  • Extract text automatically<br/>
                  • Generate AI embeddings<br/>
                  • Semantic search capabilities
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </section>

        {/* History Section */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
            <TrendingUp className="h-6 w-6" /> Your Progress History
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {mockHistory.map((session) => (
              <Card key={session.id} className="py-4 px-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    {new Date(session.date).toLocaleDateString()}
                  </span>
                  <span className="font-medium">{session.roundType}</span>
                </div>
                <div className="flex items-center gap-4">
                  <Badge className={getDifficultyColor(session.difficulty)}>{session.difficulty}</Badge>
                  <div className="flex items-center gap-1">
                    <Trophy className="h-4 w-4 text-gray-500" />
                    <span className={`font-bold ${getScoreColor(session.score)}`}>{session.score}%</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>
      </main>

      {/* Popup Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Select Job Role & Difficulty</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Select Role</label>
              <Select onValueChange={setJobRole}>
                <SelectTrigger>
                  <SelectValue placeholder="e.g. Frontend Developer" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="frontend">Frontend Developer</SelectItem>
                  <SelectItem value="backend">Backend Developer</SelectItem>
                  <SelectItem value="data">Data Analyst</SelectItem>
                  <SelectItem value="devops">DevOps Engineer</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">Difficulty Level</label>
              <div className="flex justify-between mt-2">
                {difficultyLevels.map((level) => (
                  <div key={level.level} className="relative group">
                    <button
                      onClick={() => setDifficulty(level.level)}
                      className={`p-3 rounded-full hover:scale-110 transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700 ${
                        difficulty === level.level ? "ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20" : ""
                      }`}
                    >
                      <level.icon className={`h-6 w-6 ${level.color}`} />
                    </button>
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black dark:bg-white text-white dark:text-black text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                      {level.level}
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-black dark:border-t-white"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter className="pt-4">
            <Button disabled={!jobRole || !difficulty} onClick={handleStart}>
              Start Interview
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}