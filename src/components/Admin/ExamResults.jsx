import React, { useState } from 'react'
import { useExam } from '../../contexts/ExamContext'
import { Button } from '../ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Input } from '../ui/input'
import { Search, Download, Eye, User, Calendar, Clock } from 'lucide-react'

const ExamResults = () => {
  const { exams, examResults, users } = useExam()
  const [selectedExam, setSelectedExam] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  const getExamById = (examId) => exams.find(exam => exam.id === examId)
  const getUserById = (userId) => users.find(user => user.id === userId)

  const filteredResults = examResults.filter(result => {
    const exam = getExamById(result.examId)
    const user = getUserById(result.userId)
    const matchesExam = !selectedExam || result.examId === parseInt(selectedExam)
    const matchesSearch = !searchTerm || 
      (user && user.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (exam && exam.title.toLowerCase().includes(searchTerm.toLowerCase()))
    
    return matchesExam && matchesSearch
  })

  const getScoreColor = (score, total) => {
    const percentage = (score / total) * 100
    if (percentage >= 80) return 'text-green-600'
    if (percentage >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreBadge = (score, total) => {
    const percentage = (score / total) * 100
    if (percentage >= 80) return 'bg-green-100 text-green-800'
    if (percentage >= 60) return 'bg-yellow-100 text-yellow-800'
    return 'bg-red-100 text-red-800'
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">نتایج آزمون‌ها</h2>
        <div className="flex items-center space-x-4 space-x-reverse">
          <div className="relative w-64">
            <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="جستجو در نتایج..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-10"
            />
          </div>
          <select
            value={selectedExam}
            onChange={(e) => setSelectedExam(e.target.value)}
            className="px-3 py-2 border border-input rounded-md bg-background text-foreground"
          >
            <option value="">همه آزمون‌ها</option>
            {exams.map(exam => (
              <option key={exam.id} value={exam.id}>{exam.title}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4" data-aos="fade-up">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">کل نتایج</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredResults.length}</div>
            <p className="text-xs text-muted-foreground">
              نتیجه آزمون
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">میانگین نمرات</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {filteredResults.length > 0 
                ? Math.round(filteredResults.reduce((sum, result) => sum + result.score, 0) / filteredResults.length)
                : 0
              }
            </div>
            <p className="text-xs text-muted-foreground">
              از ۱۰۰
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">نرخ قبولی</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {filteredResults.length > 0 
                ? Math.round((filteredResults.filter(result => result.score >= 60).length / filteredResults.length) * 100)
                : 0
              }%
            </div>
            <p className="text-xs text-muted-foreground">
              نمره بالای ۶۰
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Results List */}
      <div className="space-y-4">
        {filteredResults.map((result) => {
          const exam = getExamById(result.examId)
          const user = getUserById(result.userId)
          
          if (!exam || !user) return null

          return (
            <Card key={result.id} data-aos="fade-up">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{exam.title}</CardTitle>
                    <CardDescription className="flex items-center">
                      <User className="w-4 h-4 ml-1" />
                      {user.name}
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-4 space-x-reverse">
                    <Badge className={getScoreBadge(result.score, result.totalScore)}>
                      {result.score} از {result.totalScore}
                    </Badge>
                    <Button size="sm" variant="outline">
                      <Download className="w-4 h-4 ml-1" />
                      دانلود
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 ml-2 text-muted-foreground" />
                    <span className="text-muted-foreground">تاریخ آزمون:</span>
                    <span className="font-medium mr-2">
                      {new Date(result.submittedAt).toLocaleDateString('fa-IR')}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 ml-2 text-muted-foreground" />
                    <span className="text-muted-foreground">زمان صرف شده:</span>
                    <span className="font-medium mr-2">
                      {result.timeSpent} دقیقه
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-muted-foreground">درصد:</span>
                    <span className={`font-medium mr-2 ${getScoreColor(result.score, result.totalScore)}`}>
                      {Math.round((result.score / result.totalScore) * 100)}%
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-muted-foreground">وضعیت:</span>
                    <Badge variant={result.score >= 60 ? "default" : "destructive"} className="mr-2">
                      {result.score >= 60 ? 'قبول' : 'مردود'}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}

        {filteredResults.length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <Eye className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">هیچ نتیجه‌ای یافت نشد</h3>
              <p className="text-muted-foreground">
                {searchTerm || selectedExam ? 'لطفاً فیلترهای جستجو را تغییر دهید' : 'هنوز هیچ آزمونی انجام نشده است'}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

export default ExamResults
