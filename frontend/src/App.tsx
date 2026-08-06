import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { HomePage } from './pages/HomePage'

function AppHeader() {
  return (
    <header className="relative overflow-hidden border-b border-hairline bg-canvas">
      {/* Atmospheric gradient orb — pure decoration, per DESIGN.md */}
      <div
        className="gradient-orb -right-24 -top-32 h-72 w-72 bg-gradient-mint"
        aria-hidden="true"
      />
      <div className="relative z-10 mx-auto w-full max-w-4xl px-4 py-9">
        <div className="flex flex-col gap-2">
          <h1 className="ts-headline text-ink">CV ATS Converter</h1>
          <p className="ts-body text-muted-foreground">
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
      <div className="min-h-screen bg-canvas">
        <AppHeader />
        <Routes>
          <Route path="/" element={<HomePage />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}
