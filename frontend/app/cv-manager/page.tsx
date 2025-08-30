"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import UplodeCV from "@/components/uplode_cv"
import CVSearch from "@/components/cv-search"
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Upload, Search, FileText, Database, Activity,
  ArrowDownRightFromSquare,
  ChevronLeft
} from "lucide-react"

interface CVData {
  id: string;
  filename: string;
  uploadedAt: string;
  textLength: number;
}

export default function CVManagerPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [cvs, setCvs] = useState<CVData[]>([])
  const [loadingCVs, setLoadingCVs] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router])

  const fetchCVs = async () => {
    setLoadingCVs(true)
    try {
      const response = await fetch('http://localhost:5000/api/cv/all', {
        credentials: 'include',
      })
      const data = await response.json()
      if (response.ok) {
        setCvs(data.cvs || [])
      }
    } catch (error) {
      console.error('Failed to fetch CVs:', error)
    } finally {
      setLoadingCVs(false)
    }
  }

  useEffect(() => {
    if (user) {
      fetchCVs()
    }
  }, [user])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 pt-24">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
            <button onClick={()=>router.back()}><ChevronLeft size={30} /></button>
            CV Manager</h1>
          <p className="text-gray-600">Upload, parse, and search through CVs using AI-powered vector database</p>
        </div>

        <Tabs defaultValue="upload" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Upload CV
            </TabsTrigger>
            <TabsTrigger value="search" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              Search CVs
            </TabsTrigger>
            <TabsTrigger value="manage" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Manage CVs
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Upload New CV
                </CardTitle>
                <CardDescription>
                  Upload a CV file (PDF, DOC, DOCX) to parse and store in the vector database
                </CardDescription>
              </CardHeader>
              <CardContent>
                <UplodeCV />
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">How it works:</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Upload your CV file (max 10MB)</li>
                    <li>• Text is extracted and processed</li>
                    <li>• AI generates embeddings for semantic search</li>
                    <li>• CV is stored in vector database for future searches</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="search" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Search CVs
                </CardTitle>
                <CardDescription>
                  Use AI-powered semantic search to find relevant CVs based on skills, experience, or keywords
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CVSearch />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="manage" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  CV Database
                </CardTitle>
                <CardDescription>
                  View and manage all uploaded CVs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4" />
                    <span className="text-sm text-gray-600">
                      Total CVs: {cvs.length}
                    </span>
                  </div>
                  <Button onClick={fetchCVs} disabled={loadingCVs}>
                    {loadingCVs ? 'Refreshing...' : 'Refresh'}
                  </Button>
                </div>

                {cvs.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>No CVs uploaded yet</p>
                    <p className="text-sm">Upload your first CV to get started</p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {cvs.map((cv) => (
                      <div key={cv.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">{cv.filename}</h4>
                            <p className="text-sm text-gray-500">
                              Uploaded: {new Date(cv.uploadedAt).toLocaleString()}
                            </p>
                            <p className="text-sm text-gray-500">
                              Text Length: {cv.textLength} characters
                            </p>
                          </div>
                          <div className="text-sm text-gray-400">
                            ID: {cv.id}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
