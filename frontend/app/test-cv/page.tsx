"use client"

import { useState } from "react"
import UplodeCV from "@/components/uplode_cv"
import CVSearch from "@/components/cv-search"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, Search } from "lucide-react"

export default function TestCVPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">CV Upload & Search Test</h1>
          <p className="text-gray-600">Test the CV upload and search functionality</p>
        </div>

        <Tabs defaultValue="upload" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Test Upload
            </TabsTrigger>
            <TabsTrigger value="search" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              Test Search
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload">
            <Card>
              <CardHeader>
                <CardTitle>Upload CV Test</CardTitle>
                <CardDescription>
                  Upload a CV file to test the parsing and vector DB storage
                </CardDescription>
              </CardHeader>
              <CardContent>
                <UplodeCV />
                
                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <h4 className="font-medium text-yellow-800 mb-2">Testing Instructions:</h4>
                  <ol className="text-sm text-yellow-700 space-y-1 list-decimal list-inside">
                    <li>Make sure your backend is running on port 5000</li>
                    <li>You must be logged in (authentication required)</li>
                    <li>Upload a PDF, DOC, or DOCX file</li>
                    <li>Check the console/network tab for API responses</li>
                    <li>File will be parsed and stored in vector database</li>
                  </ol>
                </div>

                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-medium text-blue-800 mb-2">Backend API Endpoints:</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li><code>POST /api/cv/upload</code> - Upload CV</li>
                    <li><code>GET /api/cv/search?query=...</code> - Search CVs</li>
                    <li><code>GET /api/cv/all</code> - Get all CVs</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="search">
            <Card>
              <CardHeader>
                <CardTitle>Search CV Test</CardTitle>
                <CardDescription>
                  Test the AI-powered semantic search functionality
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CVSearch />
                
                <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="font-medium text-green-800 mb-2">Search Tips:</h4>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• Try searching for skills: "JavaScript", "Python", "React"</li>
                    <li>• Search for experience: "5 years", "senior developer"</li>
                    <li>• Look for education: "computer science", "engineering"</li>
                    <li>• Search for roles: "frontend developer", "data scientist"</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
