const fs = require('fs');
let content = fs.readFileSync('src/pages/LoginPage.tsx', 'utf8');

// Find the return ( statement
const returnIndex = content.indexOf('return (');

const insertion = `
  const handleStateToggle = (targetMode: 'login' | 'signup') => {
    setError(null)
    setMode(targetMode)
    navigate(targetMode === 'login' ? '/login' : '/signup')
  }

  const handleDemoLogin = async (role: 'admin' | 'user') => {
    setLoading(true)
    setError(null)
    try {
      let rawApiUrl = (import.meta.env.VITE_API_URL || '/api').trim()
      if (rawApiUrl.startsWith('http')) {
        if (rawApiUrl.endsWith('/')) rawApiUrl = rawApiUrl.slice(0, -1)
        if (!rawApiUrl.endsWith('/api')) rawApiUrl += '/api'
      } else if (!rawApiUrl.startsWith('/api')) {
        rawApiUrl = '/api'
      }

      const response = await fetch(\`\${rawApiUrl}/auth/demo\`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role }),
      })

      if (!response.ok) {
        const err = await response.json().catch(() => ({ error: 'Demo login failed' }))
        throw new Error(err.error || 'Demo login failed')
      }

      const { token } = await response.json()
      
      // Store real JWT in Zustand so apiFetch can use it for real API calls
      useAppStore.getState().setDemoToken(token)
      setUserEmail(role === 'admin' ? 'admin@demo.clientpilotai' : 'user@demo.clientpilotai')
      setUserRole(role)
      navigate(role === 'admin' ? '/app/admin' : '/app')
    } catch (err) {
      // Fallback: if backend is unreachable, still let user explore the UI
      console.warn('[DemoLogin] Backend unreachable, using role-only access:', err)
      setUserEmail(role === 'admin' ? 'admin@clientpilotai.com' : 'demo@clientpilotai.com')
      setUserRole(role)
      navigate(role === 'admin' ? '/app/admin' : '/app')
    } finally {
      setLoading(false)
    }
  }

  `;

content = content.slice(0, returnIndex) + insertion + content.slice(returnIndex);
fs.writeFileSync('src/pages/LoginPage.tsx', content);
console.log('Fixed LoginPage.tsx');
