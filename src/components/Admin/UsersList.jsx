import React, { useState } from 'react'
import { useExam } from '../../contexts/ExamContext'
import { Button } from '../ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Input } from '../ui/input'
import { Badge } from '../ui/badge'
import { Search, User, Mail, Calendar, Eye } from 'lucide-react'

const UsersList = () => {
  const { users, generateExamLink } = useExam()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedUser, setSelectedUser] = useState(null)

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">لیست کاربران</h2>
        <div className="relative w-64">
          <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="جستجو در کاربران..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pr-10"
          />
        </div>
      </div>

      <div className="grid gap-4">
        {filteredUsers.map((user) => (
          <Card key={user.id} data-aos="fade-up">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 space-x-reverse">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{user.name}</CardTitle>
                    <CardDescription className="flex items-center">
                      <Mail className="w-4 h-4 ml-1" />
                      {user.email}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Badge variant="secondary">
                    {user.role === 'admin' ? 'مدیر' : 'کاربر'}
                  </Badge>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectedUser(selectedUser === user.id ? null : user.id)}
                  >
                    <Eye className="w-4 h-4 ml-1" />
                    جزئیات
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            {selectedUser === user.id && (
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <Calendar className="w-4 h-4 ml-2 text-muted-foreground" />
                      <span className="text-muted-foreground">تاریخ ثبت نام:</span>
                      <span className="font-medium mr-2">
                        {new Date(user.registeredAt).toLocaleDateString('fa-IR')}
                      </span>
                    </div>
                    <div className="flex items-center text-sm">
                      <User className="w-4 h-4 ml-2 text-muted-foreground" />
                      <span className="text-muted-foreground">نوع کاربر:</span>
                      <span className="font-medium mr-2">
                        {user.role === 'admin' ? 'مدیر سیستم' : 'کاربر عادی'}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm">
                      <span className="text-muted-foreground">آیدی کاربر:</span>
                      <span className="font-medium mr-2">{user.id}</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-muted-foreground">وضعیت:</span>
                      <Badge variant="outline" className="mr-2">
                        فعال
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
        ))}

        {filteredUsers.length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <User className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">هیچ کاربری یافت نشد</h3>
              <p className="text-muted-foreground">
                {searchTerm ? 'لطفاً عبارت جستجو را تغییر دهید' : 'هنوز کاربری ثبت نام نکرده است'}
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="text-center text-sm text-muted-foreground">
        مجموع {users.length} کاربر در سیستم
      </div>
    </div>
  )
}

export default UsersList
