import React, { useState, useEffect } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { useExam } from '../../contexts/ExamContext'
import { Button } from '../ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Progress } from '../ui/progress'
import { Clock, CheckCircle, AlertTriangle, ArrowRight, ArrowLeft, Flag } from 'lucide-react'

const ExamTaking = () => {
  const { examId } = useParams()
  const [searchParams] = useSearchParams()
  const userId = searchParams.get('user')
  
  const { exams, submitExamResult } = useExam()
  const [exam, setExam] = useState(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [timeLeft, setTimeLeft] = useState(0)
  const [examStarted, setExamStarted] = useState(false)
  const [examCompleted, setExamCompleted] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [result, setResult] = useState(null)

  useEffect(() => {
    const foundExam = exams.find(e => e.id === parseInt(examId))
    if (foundExam) {
      setExam(foundExam)
      setTimeLeft(foundExam.duration * 60) // Convert minutes to seconds
    }
  }, [examId, exams])

  useEffect(() => {
    let timer
    if (examStarted && timeLeft > 0 && !examCompleted) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleSubmitExam()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [examStarted, timeLeft, examCompleted])

  const startExam = () => {
    setExamStarted(true)
  }

  const handleAnswerChange = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }))
  }

  const calculateScore = () => {
    let score = 0
    let totalScore = 0

    exam.questions.forEach(question => {
      totalScore += question.points
      if (answers[question.id] === question.correctAnswer) {
        score += question.points
      }
    })

    return { score, totalScore }
  }

  const handleSubmitExam = () => {
    const { score, totalScore } = calculateScore()
    const timeSpent = exam.duration - Math.floor(timeLeft / 60)
    
    const resultData = {
      examId: parseInt(examId),
      userId: parseInt(userId),
      score,
      totalScore,
      timeSpent,
      answers,
      submittedAt: new Date().toISOString()
    }

    const submittedResult = submitExamResult(resultData)
    setResult(submittedResult)
    setExamCompleted(true)
    setShowResults(true)
  }

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
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

  if (!exam) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-8">
            <AlertTriangle className="w-12 h-12 text-destructive mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">آزمون یافت نشد</h3>
            <p className="text-muted-foreground">
              آزمون مورد نظر وجود ندارد یا حذف شده است
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (showResults && result) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <Card className="w-full max-w-2xl" data-aos="fade-up">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">آزمون تکمیل شد!</CardTitle>
            <CardDescription>
              نتایج آزمون شما آماده است
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className={`text-4xl font-bold mb-2 ${getScoreColor(result.score, result.totalScore)}`}>
                {result.score}/{result.totalScore}
              </div>
              <Badge className={getScoreBadge(result.score, result.totalScore)}>
                {Math.round((result.score / result.totalScore) * 100)}%
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold text-foreground">{result.timeSpent}</div>
                <div className="text-sm text-muted-foreground">دقیقه</div>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold text-foreground">
                  {exam.questions.filter(q => answers[q.id] === q.correctAnswer).length}
                </div>
                <div className="text-sm text-muted-foreground">سوال صحیح</div>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold text-foreground">
                  {exam.questions.length - exam.questions.filter(q => answers[q.id] === q.correctAnswer).length}
                </div>
                <div className="text-sm text-muted-foreground">سوال غلط</div>
              </div>
            </div>

            <div className="text-center">
              <Badge variant={result.score >= 60 ? "default" : "destructive"} className="text-lg px-4 py-2">
                {result.score >= 60 ? 'قبول شدید!' : 'مردود شدید'}
              </Badge>
            </div>

            <div className="flex justify-center space-x-4 space-x-reverse">
              <Button onClick={() => window.close()}>
                بستن
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!examStarted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <Card className="w-full max-w-2xl" data-aos="fade-up">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">{exam.title}</CardTitle>
            <CardDescription>{exam.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold text-foreground">{exam.duration}</div>
                <div className="text-sm text-muted-foreground">دقیقه</div>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold text-foreground">{exam.questions.length}</div>
                <div className="text-sm text-muted-foreground">سوال</div>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold text-foreground">
                  {exam.questions.reduce((sum, q) => sum + q.points, 0)}
                </div>
                <div className="text-sm text-muted-foreground">نمره کل</div>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start space-x-3 space-x-reverse">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-yellow-800 mb-1">نکات مهم:</p>
                  <ul className="text-yellow-700 space-y-1">
                    <li>• زمان آزمون محدود است و پس از اتمام، آزمون به صورت خودکار ارسال می‌شود</li>
                    <li>• پس از شروع آزمون، امکان بازگشت وجود ندارد</li>
                    <li>• پاسخ‌های خود را با دقت انتخاب کنید</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="text-center">
              <Button onClick={startExam} size="lg" className="px-8">
                شروع آزمون
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const currentQuestion = exam.questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / exam.questions.length) * 100

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold">{exam.title}</h1>
              <p className="text-sm text-muted-foreground">
                سوال {currentQuestionIndex + 1} از {exam.questions.length}
              </p>
            </div>
            <div className="flex items-center space-x-4 space-x-reverse">
              <div className="flex items-center space-x-2 space-x-reverse">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className={`font-mono text-lg ${timeLeft < 300 ? 'text-red-600' : 'text-foreground'}`}>
                  {formatTime(timeLeft)}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSubmitExam}
                className="text-red-600 border-red-600 hover:bg-red-50"
              >
                <Flag className="w-4 h-4 ml-1" />
                ارسال آزمون
              </Button>
            </div>
          </div>
          <div className="mt-4">
            <Progress value={progress} className="h-2" />
          </div>
        </div>
      </header>

      {/* Question Content */}
      <div className="container mx-auto px-6 py-8">
        <Card data-aos="fade-up">
          <CardHeader>
            <CardTitle className="text-lg">
              سوال {currentQuestionIndex + 1}: {currentQuestion.text}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => (
                <label
                  key={index}
                  className={`flex items-center space-x-3 space-x-reverse p-4 border rounded-lg cursor-pointer transition-colors ${
                    answers[currentQuestion.id] === index
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <input
                    type="radio"
                    name={`question-${currentQuestion.id}`}
                    value={index}
                    checked={answers[currentQuestion.id] === index}
                    onChange={() => handleAnswerChange(currentQuestion.id, index)}
                    className="text-primary"
                  />
                  <span className="flex-1">{option}</span>
                </label>
              ))}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between pt-6 border-t">
              <Button
                variant="outline"
                onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                disabled={currentQuestionIndex === 0}
              >
                <ArrowLeft className="w-4 h-4 ml-2" />
                قبلی
              </Button>

              <div className="flex items-center space-x-2 space-x-reverse">
                {exam.questions.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentQuestionIndex(index)}
                    className={`w-8 h-8 rounded-full text-sm font-medium transition-colors ${
                      index === currentQuestionIndex
                        ? 'bg-primary text-primary-foreground'
                        : answers[exam.questions[index].id] !== undefined
                        ? 'bg-green-100 text-green-800'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>

              <Button
                onClick={() => setCurrentQuestionIndex(prev => Math.min(exam.questions.length - 1, prev + 1))}
                disabled={currentQuestionIndex === exam.questions.length - 1}
              >
                بعدی
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default ExamTaking
