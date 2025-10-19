import React, { createContext, useContext, useState, useEffect } from 'react'

const ExamContext = createContext()

export const useExam = () => {
  const context = useContext(ExamContext)
  if (!context) {
    throw new Error('useExam must be used within an ExamProvider')
  }
  return context
}

export const ExamProvider = ({ children }) => {
  const [users, setUsers] = useState([])
  const [exams, setExams] = useState([])
  const [examResults, setExamResults] = useState([])

  useEffect(() => {
    // Load data from localStorage
    const storedUsers = JSON.parse(localStorage.getItem('azmoon_users') || '[]')
    const storedExams = JSON.parse(localStorage.getItem('azmoon_exams') || '[]')
    const storedResults = JSON.parse(localStorage.getItem('azmoon_results') || '[]')
    
    setUsers(storedUsers)
    setExams(storedExams)
    setExamResults(storedResults)
  }, [])

  const createExam = (examData) => {
    const newExam = {
      id: Date.now(),
      ...examData,
      createdAt: new Date().toISOString(),
      status: 'active'
    }
    
    const updatedExams = [...exams, newExam]
    setExams(updatedExams)
    localStorage.setItem('azmoon_exams', JSON.stringify(updatedExams))
    
    return newExam
  }

  const updateExam = (examId, updates) => {
    const updatedExams = exams.map(exam => 
      exam.id === examId ? { ...exam, ...updates } : exam
    )
    setExams(updatedExams)
    localStorage.setItem('azmoon_exams', JSON.stringify(updatedExams))
  }

  const deleteExam = (examId) => {
    const updatedExams = exams.filter(exam => exam.id !== examId)
    setExams(updatedExams)
    localStorage.setItem('azmoon_exams', JSON.stringify(updatedExams))
  }

  const submitExamResult = (resultData) => {
    const newResult = {
      id: Date.now(),
      ...resultData,
      submittedAt: new Date().toISOString()
    }
    
    const updatedResults = [...examResults, newResult]
    setExamResults(updatedResults)
    localStorage.setItem('azmoon_results', JSON.stringify(updatedResults))
    
    return newResult
  }

  const getExamResults = (examId) => {
    return examResults.filter(result => result.examId === examId)
  }

  const getUserResults = (userId) => {
    return examResults.filter(result => result.userId === userId)
  }

  const generateExamLink = (examId, userId) => {
    return `${window.location.origin}/exam/${examId}?user=${userId}`
  }

  const value = {
    users,
    exams,
    examResults,
    createExam,
    updateExam,
    deleteExam,
    submitExamResult,
    getExamResults,
    getUserResults,
    generateExamLink
  }

  return (
    <ExamContext.Provider value={value}>
      {children}
    </ExamContext.Provider>
  )
}
