import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Flame } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { WheelLoader } from '@/components/shared/WheelLoader'

export function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await login(email, password)
      navigate('/')
    } catch (err) {
      setError('Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-md bg-hw-blue border-hw-blue">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <img src="/wheel-icon.svg" alt="Hot Collection" className="w-16 h-16" />
          </div>
          <CardTitle className="text-2xl flex items-center justify-center gap-2 text-white">
            <Flame className="w-6 h-6 text-hw-orange" />
            Hot Collection
          </CardTitle>
          <p className="text-white/70 mt-2">Sign in to your account</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-lg bg-red-500/20 text-white text-sm">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                autoComplete="email"
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-white">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="current-password"
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
              />
            </div>

            <Button type="submit" className="w-full bg-hw-orange hover:bg-hw-orange/90" disabled={loading}>
              {loading ? <WheelLoader size={20} /> : 'Sign In'}
            </Button>

            <div className="text-center space-y-2">
              <Link
                to="/forgot-password"
                className="text-sm text-white/80 hover:text-white hover:underline block"
              >
                Forgot password?
              </Link>
              <p className="text-sm text-white/70">
                Don't have an account?{' '}
                <Link to="/register" className="text-hw-orange hover:underline">
                  Sign up
                </Link>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
