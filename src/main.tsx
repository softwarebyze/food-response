import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { AuthProvider } from './contexts/AuthContext'
import { UserDataProvider } from './contexts/UserDataContext'

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <UserDataProvider>
          <App />
        </UserDataProvider>
      </QueryClientProvider>
    </AuthProvider>
  </React.StrictMode>
)
