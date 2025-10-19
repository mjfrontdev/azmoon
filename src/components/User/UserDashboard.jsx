import React, { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useExam } from '../../contexts/ExamContext'
import { Button } from '../ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { Badge } from '../ui/badge'
import { BookOpen, Clock, CheckCircle, AlertCircle, ExternalLink, User, Mail, Calendar } from 'lucide-react'

const UserDashboard = () => {
  const { user, logout } = useAuth()
  const { exams, examResults, getUserResults } = useExam()
  const [activeTab, setActiveTab] = useState('exams')

  const userResults = getUserResults(user?.id)
  const availableExams = exams.filter(exam => exam.status === 'active')
  const completedExams = userResults.map(result => result.examId)
  const pendingExams = availableExams.filter(exam => !completedExams.includes(exam.id))

  const getExamResult = (examId) => {
    return userResults.find(result => result.examId === examId)
  }

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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">پنل کاربری</h1>
              <p className="text-muted-foreground">خوش آمدید، {user?.name}</p>
            </div>
            <Button onClick={logout} variant="outline">
              خروج
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* User Info Card */}
        <Card className="mb-8" data-aos="fade-up">
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="w-5 h-5 ml-2" />
              اطلاعات کاربری
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center space-x-6 space-x-reverse">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="font-medium">{user?.name}</p>
                  <p className="text-sm text-muted-foreground">نام و نام خانوادگی</p>
                </div>
              </div>
              <div className="flex items-center space-x-6 space-x-reverse">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">{user?.email}</p>
                  <p className="text-sm text-muted-foreground">ایمیل</p>
                </div>
              </div>
              <div className="flex items-center space-x-6 space-x-reverse">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">
                    {user?.registeredAt ? new Date(user.registeredAt).toLocaleDateString('fa-IR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    }) : 'تاریخ عضویت موجود نیست'}
                  </p>
                  <p className="text-sm text-muted-foreground">تاریخ عضویت</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8" data-aos="fade-up">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">آزمون‌های موجود</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{availableExams.length}</div>
              <p className="text-xs text-muted-foreground">
                آزمون فعال
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">آزمون‌های انجام شده</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userResults.length}</div>
              <p className="text-xs text-muted-foreground">
                آزمون تکمیل شده
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">میانگین نمرات</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {userResults.length > 0 
                  ? Math.round(userResults.reduce((sum, result) => sum + result.score, 0) / userResults.length)
                  : 0
                }
              </div>
              <p className="text-xs text-muted-foreground">
                از ۱۰۰
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="exams">آزمون‌های من</TabsTrigger>
            <TabsTrigger value="results">نتایج</TabsTrigger>
          </TabsList>

          <TabsContent value="exams" className="mt-6">
            <div className="space-y-6">
              {/* Pending Exams */}
              {pendingExams.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold mb-4 flex items-center">
                    <AlertCircle className="w-5 h-5 ml-2 text-yellow-600" />
                    آزمون‌های در انتظار
                  </h2>
                  <div className="grid gap-4">
                    {pendingExams.map((exam) => (
                      <Card key={exam.id} data-aos="fade-up">
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <div>
                              <CardTitle className="text-lg">{exam.title}</CardTitle>
                              <CardDescription>{exam.description}</CardDescription>
                            </div>
                            <Badge variant="secondary">در انتظار</Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-4">
                            <div className="flex items-center">
                              <Clock className="w-4 h-4 ml-2 text-muted-foreground" />
                              <span className="text-muted-foreground">مدت زمان:</span>
                              <span className="font-medium mr-2">{exam.duration} دقیقه</span>
                            </div>
                            <div className="flex items-center">
                              <BookOpen className="w-4 h-4 ml-2 text-muted-foreground" />
                              <span className="text-muted-foreground">تعداد سوالات:</span>
                              <span className="font-medium mr-2">{exam.questions?.length || 0}</span>
                            </div>
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 ml-2 text-muted-foreground" />
                              <span className="text-muted-foreground">تاریخ ایجاد:</span>
                              <span className="font-medium mr-2">
                                {new Date(exam.createdAt).toLocaleDateString('fa-IR')}
                              </span>
                            </div>
                          </div>
                          <Button 
                            className="w-full"
                            onClick={() => window.open(`/exam/${exam.id}?user=${user.id}`, '_blank')}
                          >
                            <ExternalLink className="w-4 h-4 ml-2" />
                            شروع آزمون
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Completed Exams */}
              {userResults.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold mb-4 flex items-center">
                    <CheckCircle className="w-5 h-5 ml-2 text-green-600" />
                    آزمون‌های انجام شده
                  </h2>
                  <div className="grid gap-4">
                    {userResults.map((result) => {
                      const exam = exams.find(e => e.id === result.examId)
                      if (!exam) return null

                      return (
                        <Card key={result.id} data-aos="fade-up">
                          <CardHeader>
                            <div className="flex items-center justify-between">
                              <div>
                                <CardTitle className="text-lg">{exam.title}</CardTitle>
                                <CardDescription>{exam.description}</CardDescription>
                              </div>
                              <Badge className={getScoreBadge(result.score, result.totalScore)}>
                                {result.score} از {result.totalScore}
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm mb-4">
                              <div className="flex items-center">
                                <Clock className="w-4 h-4 ml-2 text-muted-foreground" />
                                <span className="text-muted-foreground">زمان صرف شده:</span>
                                <span className="font-medium mr-2">{result.timeSpent} دقیقه</span>
                              </div>
                              <div className="flex items-center">
                                <Calendar className="w-4 h-4 ml-2 text-muted-foreground" />
                                <span className="text-muted-foreground">تاریخ انجام:</span>
                                <span className="font-medium mr-2">
                                  {new Date(result.submittedAt).toLocaleDateString('fa-IR')}
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
                  </div>
                </div>
              )}

              {availableExams.length === 0 && (
                <Card>
                  <CardContent className="text-center py-8">
                    <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">هیچ آزمونی در دسترس نیست</h3>
                    <p className="text-muted-foreground">
                      در حال حاضر آزمون فعالی برای شما تعریف نشده است
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="results" className="mt-6">
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">نتایج آزمون‌ها</h2>
              
              {userResults.length > 0 ? (
                <div className="grid gap-4">
                  {userResults.map((result) => {
                    const exam = exams.find(e => e.id === result.examId)
                    if (!exam) return null

                    return (
                      <Card key={result.id} data-aos="fade-up">
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <div>
                              <CardTitle className="text-lg">{exam.title}</CardTitle>
                              <CardDescription>
                                انجام شده در {new Date(result.submittedAt).toLocaleDateString('fa-IR')}
                              </CardDescription>
                            </div>
                            <div className="text-right">
                              <div className={`text-2xl font-bold ${getScoreColor(result.score, result.totalScore)}`}>
                                {result.score}/{result.totalScore}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {Math.round((result.score / result.totalScore) * 100)}%
                              </div>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="text-muted-foreground">زمان صرف شده:</span>
                              <p className="font-medium">{result.timeSpent} دقیقه</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">وضعیت:</span>
                              <p className="font-medium">
                                <Badge variant={result.score >= 60 ? "default" : "destructive"}>
                                  {result.score >= 60 ? 'قبول' : 'مردود'}
                                </Badge>
                              </p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">نمره:</span>
                              <p className={`font-medium ${getScoreColor(result.score, result.totalScore)}`}>
                                {result.score} از {result.totalScore}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              ) : (
                <Card>
                  <CardContent className="text-center py-8">
                    <CheckCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">هیچ نتیجه‌ای وجود ندارد</h3>
                    <p className="text-muted-foreground">
                      هنوز هیچ آزمونی انجام نداده‌اید
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default UserDashboard
