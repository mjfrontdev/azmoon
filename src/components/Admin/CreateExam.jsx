import React, { useState } from 'react'
import { useExam } from '../../contexts/ExamContext'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Textarea } from '../ui/textarea'
import { Plus, Trash2, Save, ArrowRight } from 'lucide-react'

const CreateExam = ({ onSuccess }) => {
  const { createExam } = useExam()
  const [loading, setLoading] = useState(false)
  const [examData, setExamData] = useState({
    title: '',
    description: '',
    duration: 60,
    questions: []
  })

  const addQuestion = () => {
    const newQuestion = {
      id: Date.now(),
      text: '',
      type: 'multiple-choice',
      options: ['', '', '', ''],
      correctAnswer: 0,
      points: 1
    }
    setExamData({
      ...examData,
      questions: [...examData.questions, newQuestion]
    })
  }

  const updateQuestion = (questionId, updates) => {
    setExamData({
      ...examData,
      questions: examData.questions.map(q =>
        q.id === questionId ? { ...q, ...updates } : q
      )
    })
  }

  const removeQuestion = (questionId) => {
    setExamData({
      ...examData,
      questions: examData.questions.filter(q => q.id !== questionId)
    })
  }

  const updateQuestionOption = (questionId, optionIndex, value) => {
    const question = examData.questions.find(q => q.id === questionId)
    if (question) {
      const newOptions = [...question.options]
      newOptions[optionIndex] = value
      updateQuestion(questionId, { options: newOptions })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Validate exam data
      if (!examData.title.trim()) {
        alert('لطفاً عنوان آزمون را وارد کنید')
        return
      }

      if (examData.questions.length === 0) {
        alert('لطفاً حداقل یک سوال اضافه کنید')
        return
      }

      // Validate questions
      for (const question of examData.questions) {
        if (!question.text.trim()) {
          alert('لطفاً متن تمام سوالات را وارد کنید')
          return
        }
        if (question.options.some(opt => !opt.trim())) {
          alert('لطفاً تمام گزینه‌های سوالات را پر کنید')
          return
        }
      }

      createExam(examData)
      alert('آزمون با موفقیت ایجاد شد!')
      onSuccess()
    } catch (error) {
      alert('خطا در ایجاد آزمون')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Card data-aos="fade-up">
        <CardHeader>
          <CardTitle className="text-2xl">ایجاد آزمون جدید</CardTitle>
          <CardDescription>
            اطلاعات آزمون و سوالات را وارد کنید
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Exam Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">عنوان آزمون</Label>
                <Input
                  id="title"
                  value={examData.title}
                  onChange={(e) => setExamData({ ...examData, title: e.target.value })}
                  placeholder="عنوان آزمون را وارد کنید"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">مدت زمان (دقیقه)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={examData.duration}
                  onChange={(e) => setExamData({ ...examData, duration: parseInt(e.target.value) })}
                  min="1"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">توضیحات آزمون</Label>
              <Textarea
                id="description"
                value={examData.description}
                onChange={(e) => setExamData({ ...examData, description: e.target.value })}
                placeholder="توضیحات آزمون را وارد کنید"
                rows={3}
              />
            </div>

            {/* Questions */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">سوالات آزمون</h3>
                <Button type="button" onClick={addQuestion} variant="outline">
                  <Plus className="w-4 h-4 ml-2" />
                  افزودن سوال
                </Button>
              </div>

              {examData.questions.map((question, index) => (
                <Card key={question.id} className="border-l-4 border-l-primary">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">سوال {index + 1}</CardTitle>
                      <Button
                        type="button"
                        size="sm"
                        variant="destructive"
                        onClick={() => removeQuestion(question.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>متن سوال</Label>
                      <Textarea
                        value={question.text}
                        onChange={(e) => updateQuestion(question.id, { text: e.target.value })}
                        placeholder="متن سوال را وارد کنید"
                        rows={2}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>گزینه‌ها</Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {question.options.map((option, optionIndex) => (
                          <div key={optionIndex} className="flex items-center space-x-2 space-x-reverse">
                            <input
                              type="radio"
                              name={`correct-${question.id}`}
                              checked={question.correctAnswer === optionIndex}
                              onChange={() => updateQuestion(question.id, { correctAnswer: optionIndex })}
                              className="text-primary"
                            />
                            <Input
                              value={option}
                              onChange={(e) => updateQuestionOption(question.id, optionIndex, e.target.value)}
                              placeholder={`گزینه ${optionIndex + 1}`}
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 space-x-reverse">
                      <div className="space-y-2">
                        <Label>نمره سوال</Label>
                        <Input
                          type="number"
                          value={question.points}
                          onChange={(e) => updateQuestion(question.id, { points: parseInt(e.target.value) })}
                          min="1"
                          className="w-20"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {examData.questions.length === 0 && (
                <Card>
                  <CardContent className="text-center py-8">
                    <p className="text-muted-foreground mb-4">
                      هنوز سوالی اضافه نکرده‌اید
                    </p>
                    <Button type="button" onClick={addQuestion}>
                      <Plus className="w-4 h-4 ml-2" />
                      افزودن اولین سوال
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>

            <div className="flex justify-end space-x-4 space-x-reverse">
              <Button type="submit" disabled={loading}>
                {loading ? 'در حال ذخیره...' : 'ذخیره آزمون'}
                <Save className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default CreateExam
