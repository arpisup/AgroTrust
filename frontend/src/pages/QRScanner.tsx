import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { QrCode, Camera, ArrowLeft } from 'lucide-react'
import { toast } from 'react-toastify'

const QRScanner = () => {
  const [qrCode, setQrCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!qrCode.trim()) {
      toast.error('Please enter a QR code or batch ID')
      return
    }

    setIsLoading(true)
    
    try {
      // For demo purposes, we'll navigate directly
      // In a real app, you'd validate the QR code first
      navigate(`/batch/${qrCode.trim()}`)
    } catch (error) {
      toast.error('Failed to scan QR code. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="section-title">QR Code Scanner</h1>
        <p className="text-gray-600">
          Scan a QR code to view complete product traceability information
        </p>
      </div>

      <div className="card">
        {/* Camera Placeholder */}
        <div className="mb-6 p-8 bg-gray-100 rounded-lg text-center">
          <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">
            Camera access would be enabled here for QR scanning
          </p>
          <p className="text-sm text-gray-500">
            For demo purposes, please enter a batch ID below
          </p>
        </div>

        {/* Manual Input */}
        <form onSubmit={handleScan} className="space-y-6">
          <div>
            <label htmlFor="qrCode" className="block text-sm font-medium text-gray-700 mb-2">
              Enter QR Code or Batch ID
            </label>
            <div className="relative">
              <input
                type="text"
                id="qrCode"
                value={qrCode}
                onChange={(e) => setQrCode(e.target.value)}
                placeholder="e.g., TURMERIC2025_002"
                className="input-field pr-10"
                disabled={isLoading}
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <QrCode className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || !qrCode.trim()}
            className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Scanning...
              </div>
            ) : (
              <>
                <QrCode className="w-4 h-4 inline mr-2" />
                Scan & Verify
              </>
            )}
          </button>
        </form>

        {/* Example QR Codes */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium text-gray-900 mb-3">Example QR Codes:</h3>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">•</span>
              <code className="text-sm bg-white px-2 py-1 rounded border">TURMERIC2025_002</code>
              <span className="text-sm text-gray-500">(Erode Turmeric)</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">•</span>
              <code className="text-sm bg-white px-2 py-1 rounded border">DARJEELING2025_001</code>
              <span className="text-sm text-gray-500">(Darjeeling Tea)</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">•</span>
              <code className="text-sm bg-white px-2 py-1 rounded border">BASMATI2025_001</code>
              <span className="text-sm text-gray-500">(Basmati Rice)</span>
            </div>
          </div>
        </div>

        {/* Info Alert */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start">
            <QrCode className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-medium text-blue-900">How QR Codes Work</h4>
              <p className="text-sm text-blue-700 mt-1">
                QR codes on GI products contain encrypted batch information that links 
                directly to the blockchain. Scanning provides instant access to complete 
                traceability data.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default QRScanner 