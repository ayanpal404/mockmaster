import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain, Target, TrendingUp } from "lucide-react"

const features = [
  {
    icon: Brain,
    title: "Mock Interviews by Round",
    description: "Practice MCQ, Coding, HR, Group Discussion, and Peer-to-Peer rounds with realistic scenarios.",
    items: ["Multiple Choice Questions", "Coding Challenges", "HR Behavioral", "Group Discussions", "Peer Reviews"],
  },
  {
    icon: Target,
    title: "Difficulty Levels",
    description: "Progress from Easy to Expert levels with adaptive difficulty based on your performance.",
    items: [
      "Easy - Beginner friendly",
      "Medium - Intermediate level",
      "Hard - Advanced concepts",
      "Expert - Industry standard",
    ],
  },
  {
    icon: TrendingUp,
    title: "Progress History",
    description: "Track your improvement over time with detailed analytics and performance insights.",
    items: ["Performance Analytics", "Score Tracking", "Improvement Suggestions", "Detailed Reports"],
  },
]

export function FeaturesSection() {
  return (
    <section className="py-24 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Everything you need to ace your interviews
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            Comprehensive preparation tools designed to boost your confidence and performance
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="relative overflow-hidden border-0 bg-white/50 backdrop-blur-sm dark:bg-gray-800/50"
            >
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
                <CardDescription className="text-base">{feature.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {feature.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                      <div className="mr-2 h-1.5 w-1.5 rounded-full bg-blue-500"></div>
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
