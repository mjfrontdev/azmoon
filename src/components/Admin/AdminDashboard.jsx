import React, { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useExam } from '../../contexts/ExamContext'
import { Button } from '../ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { Users, BookOpen, BarChart3, Plus, Eye, Copy, Trash2 } from 'lucide-react'
import UsersList from './UsersList'
import CreateExam from './CreateExam'
import ExamResults from './ExamResults'

const AdminDashboard = () => {
  const { user, logout } = useAuth()
  const { users, exams, examResults } = useExam()
  const [activeTab, setActiveTab] = useState('users')

  const stats = {
    totalUsers: users.length,
    totalExams: exams.length,
    totalResults: examResults.length,
    activeExams: exams.filter(exam => exam.status === 'active').length
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    // You can add a toast notification here
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">پنل مدیریت</h1>
              <p className="text-muted-foreground">خوش آمدید، {user?.name}</p>
            </div>
            <Button onClick={logout} variant="outline">
              خروج
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8" data-aos="fade-up">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">کل کاربران</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
              <p className="text-xs text-muted-foreground">
                کاربران ثبت نام شده
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">کل آزمون‌ها</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalExams}</div>
              <p className="text-xs text-muted-foreground">
                {stats.activeExams} آزمون فعال
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">کل نتایج</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalResults}</div>
              <p className="text-xs text-muted-foreground">
                آزمون‌های انجام شده
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">نرخ تکمیل</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.totalUsers > 0 ? Math.round((stats.totalResults / (stats.totalUsers * stats.totalExams)) * 100) : 0}%
              </div>
              <p className="text-xs text-muted-foreground">
                میانگین تکمیل آزمون
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="users">مدیریت کاربران</TabsTrigger>
            <TabsTrigger value="exams">آزمون‌ها</TabsTrigger>
            <TabsTrigger value="create">ایجاد آزمون</TabsTrigger>
            <TabsTrigger value="results">نتایج</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="mt-6">
            <UsersList />
          </TabsContent>

          <TabsContent value="exams" className="mt-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">آزمون‌های موجود</h2>
                <Button onClick={() => setActiveTab('create')}>
                  <Plus className="w-4 h-4 ml-2" />
                  آزمون جدید
                </Button>
              </div>

              <div className="grid gap-4">
                {exams.map((exam) => (
                  <Card key={exam.id} data-aos="fade-up">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg">{exam.title}</CardTitle>
                          <CardDescription>{exam.description}</CardDescription>
                        </div>
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => copyToClipboard(`${window.location.origin}/exam/${exam.id}`)}
                          >
                            <Copy className="w-4 h-4 ml-1" />
                            کپی لینک
                          </Button>
                          <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4 ml-1" />
                            مشاهده
                          </Button>
                          <Button size="sm" variant="destructive">
                            <Trash2 className="w-4 h-4 ml-1" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">مدت زمان:</span>
                          <p className="font-medium">{exam.duration} دقیقه</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">تعداد سوالات:</span>
                          <p className="font-medium">{exam.questions?.length || 0}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">وضعیت:</span>
                          <p className={`font-medium ${exam.status === 'active' ? 'text-green-600' : 'text-red-600'}`}>
                            {exam.status === 'active' ? 'فعال' : 'غیرفعال'}
                          </p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">تاریخ ایجاد:</span>
                          <p className="font-medium">
                            {new Date(exam.createdAt).toLocaleDateString('fa-IR')}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {exams.length === 0 && (
                  <Card>
                    <CardContent className="text-center py-8">
                      <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">هیچ آزمونی وجود ندارد</h3>
                      <p className="text-muted-foreground mb-4">
                        اولین آزمون خود را ایجاد کنید
                      </p>
                      <Button onClick={() => setActiveTab('create')}>
                        <Plus className="w-4 h-4 ml-2" />
                        ایجاد آزمون
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="create" className="mt-6">
            <CreateExam onSuccess={() => setActiveTab('exams')} />
          </TabsContent>

          <TabsContent value="results" className="mt-6">
            <ExamResults />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default AdminDashboard
