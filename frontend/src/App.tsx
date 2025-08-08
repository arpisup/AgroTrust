import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Home from './pages/Home'
import BatchLookup from './pages/BatchLookup'
import BatchDetails from './pages/BatchDetails'
import QRScanner from './pages/QRScanner'
import AddData from './pages/AddData'

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/lookup" element={<BatchLookup />} />
          <Route path="/batch/:batchId" element={<BatchDetails />} />
          <Route path="/scan" element={<QRScanner />} />
          <Route path="/add-data" element={<AddData />} />
        </Routes>
      </main>
    </div>
  )
}

export default App 