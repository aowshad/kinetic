import { HashRouter, Route, Routes } from 'react-router-dom'
import Gallery from './pages/Gallery'
import Detail from './pages/Detail'
import { useTheme } from './lib/useTheme'

function App() {
  const { theme, toggleTheme } = useTheme()

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Gallery theme={theme} onThemeToggle={toggleTheme} />} />
        <Route path="/a/:id" element={<Detail />} />
      </Routes>
    </HashRouter>
  )
}

export default App
