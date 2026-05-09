import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { HomePage } from './pages/HomePage'

function AppHeader() {
  return (
    <header className="border-b border-border bg-background">
      <div className="mx-auto w-full max-w-4xl px-4 py-6">
        <div className="flex flex-col gap-1">
          <h1 className="ts-headline text-foreground">CV ATS Converter</h1>
          <p className="ts-body-sm text-muted-foreground">
            Transforme seu currículo para passar pelos sistemas de triagem automática (ATS)
          </p>
        </div>
      </div>
    </header>
  )
}

export function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background">
        <AppHeader />
        <Routes>
          <Route path="/" element={<HomePage />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}
