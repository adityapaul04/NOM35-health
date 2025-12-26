import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import './i18n/i18n'
import { ThemeProvider } from './components/theme-provider'
import { AssessmentProvider } from './context/AssessmentContext'
import Layout from './layout/Layout'
import Dashboard from './pages/Dashboard/Dashboard'
import Assessment from './pages/Assessment/Assessment'
import Report from './pages/Report/Report'
import AssessmentReview from './pages/Assessment/AssessmentReview'
import Login from './pages/Auth/Login'
import Signup from './pages/Auth/Signup'

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <AssessmentProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="/assessment" element={<Assessment />} />
              <Route path="/assessment/review" element={<AssessmentReview />} />
              <Route path="/report" element={<Report />} />
            </Route>
          </Routes>
        </Router>
      </AssessmentProvider>
    </ThemeProvider>
  )
}

export default App
