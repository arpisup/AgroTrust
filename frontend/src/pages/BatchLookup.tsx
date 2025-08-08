import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, AlertCircle, CheckCircle, Loader2, Sparkles, Wallet } from 'lucide-react'
import { toast } from 'react-toastify'
import { metamaskService } from '../services/metamaskService'

interface AvailableBatch {
  batchId: string
  cropName: string
  variety: string
  location: string
  description: string
}

const BatchLookup = () => {
  const [batchId, setBatchId] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [account, setAccount] = useState<string | null>(null)
  const [availableBatches, setAvailableBatches] = useState<AvailableBatch[]>([
    {
      batchId: 'ERD-TUR-2025-001',
      cropName: 'Turmeric',
      variety: 'Erode Manjal',
      location: 'Erode, Tamil Nadu',
      description: 'Premium quality turmeric with high curcumin content'
    },
    {
      batchId: 'KC-CLOVE-2025-001',
      cropName: 'Clove',
      variety: 'Kanyakumari Clove',
      location: 'Kanyakumari, Tamil Nadu',
      description: 'Premium clove with high eugenol content'
    }
  ])
  const [validationResult, setValidationResult] = useState<{
    exists: boolean
    batchInfo?: any
  } | null>(null)
  const navigate = useNavigate()

  // Check MetaMask connection on component mount
  useEffect(() => {
    checkMetaMaskConnection()
  }, [])

  const checkMetaMaskConnection = async () => {
    try {
      const connected = await metamaskService.isConnected()
      setIsConnected(connected)
      if (connected) {
        const accountAddress = await metamaskService.getAccount()
        setAccount(accountAddress)
      }
    } catch (error) {
      console.error('Error checking MetaMask connection:', error)
      setIsConnected(false)
    }
  }

  const connectMetaMask = async () => {
    setIsConnecting(true)
    try {
      await metamaskService.connect()
      setIsConnected(true)
      const accountAddress = await metamaskService.getAccount()
      setAccount(accountAddress)
      toast.success('MetaMask connected successfully!')
    } catch (error: any) {
      console.error('MetaMask connection error:', error)
      toast.error(error.message || 'Failed to connect MetaMask')
    } finally {
      setIsConnecting(false)
    }
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!batchId.trim()) {
      toast.error('Please enter a batch ID')
      return
    }

    if (!isConnected) {
      toast.error('Please connect MetaMask first')
      return
    }

    setIsLoading(true)
    setValidationResult(null)
    
    try {
      // First check if batch exists
      const exists = await metamaskService.checkBatchExists(batchId.trim())
      
      if (!exists) {
        setValidationResult({ exists: false })
        toast.error('Batch not found. Please check the batch ID and try again.')
        return
      }

      // If batch exists, get full batch info
      const batchInfo = await metamaskService.getBatchInfo(batchId.trim())
      
      if (batchInfo) {
        setValidationResult({
          exists: true,
          batchInfo: batchInfo
        })
        
        // Navigate to batch details
        navigate(`/batch/${batchId.trim()}`)
      } else {
        setValidationResult({ exists: false })
        toast.error('Batch not found. Please check the batch ID and try again.')
      }
    } catch (error: any) {
      console.error('Error searching batch:', error)
      setValidationResult({ exists: false })
      
      // Provide more specific error messages
      if (error.message && error.message.includes('could not decode result data')) {
        toast.error('Error connecting to blockchain. Please check your MetaMask connection and try again.')
      } else {
        toast.error(error.message || 'Failed to search batch. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuickSearch = (quickBatchId: string) => {
    setBatchId(quickBatchId)
  }

  const testContractConnection = async () => {
    try {
      const result = await metamaskService.testContractConnection()
      console.log('Contract test result:', result)
      toast.success('Contract connection test successful! Check console for details.')
    } catch (error: any) {
      console.error('Contract test failed:', error)
      toast.error('Contract connection test failed: ' + error.message)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Batch Lookup
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Enter a batch ID to view complete traceability information including farmer details, 
            cultivation practices, processing information, and quality certificates.
          </p>
        </div>

        {/* MetaMask Connection Status */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Wallet className="w-6 h-6 text-blue-600 mr-2" />
              <h2 className="text-xl font-semibold text-gray-900">
                MetaMask Connection
              </h2>
            </div>
            <div className="flex items-center space-x-4">
              {isConnected ? (
                <div className="flex items-center space-x-2">
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                    <span className="text-green-700 font-medium">Connected</span>
                    {account && (
                      <span className="text-sm text-gray-500 ml-2">
                        {account.slice(0, 6)}...{account.slice(-4)}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={testContractConnection}
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
                  >
                    Test Contract
                  </button>
                </div>
              ) : (
                <button
                  onClick={connectMetaMask}
                  disabled={isConnecting}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg flex items-center"
                >
                  {isConnecting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    <>
                      <Wallet className="w-4 h-4 mr-2" />
                      Connect MetaMask
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
          
          {!isConnected && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start">
                <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-medium text-yellow-900">MetaMask Required</h4>
                  <p className="text-sm text-yellow-700 mt-1">
                    Please connect MetaMask to search for batches. Make sure you're connected to the local Hardhat network.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Available Batches Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center mb-4">
            <Sparkles className="w-6 h-6 text-green-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">
              Available Batches (Pre-populated)
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            {availableBatches.map((batch) => (
              <div
                key={batch.batchId}
                className="border border-gray-200 rounded-lg p-4 hover:border-green-300 hover:shadow-md transition-all cursor-pointer"
                onClick={() => handleQuickSearch(batch.batchId)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {batch.cropName} - {batch.variety}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {batch.location}
                    </p>
                    <p className="text-xs text-gray-500">
                      {batch.description}
                    </p>
                  </div>
                  <div className="ml-4">
                    <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                      {batch.batchId}
                    </div>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleQuickSearch(batch.batchId)
                    }}
                    className="text-green-600 hover:text-green-700 text-sm font-medium"
                  >
                    Click to search →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Search Form */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Search by Batch ID
          </h2>
          
          <form onSubmit={handleSearch} className="space-y-4">
            <div>
              <label htmlFor="batchId" className="block text-sm font-medium text-gray-700 mb-2">
                Batch ID
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="batchId"
                  value={batchId}
                  onChange={(e) => setBatchId(e.target.value)}
                  placeholder="Enter batch ID (e.g., ERD-TUR-2025-001)"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                  disabled={!isConnected}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <Search className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            </div>
            
            <button
              type="submit"
              disabled={isLoading || !isConnected}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="w-5 h-5 mr-2" />
                  Lookup Batch
                </>
              )}
            </button>
          </form>

          {/* Validation Result */}
          {validationResult && (
            <div className={`mt-4 p-4 rounded-lg ${
              validationResult.exists 
                ? 'bg-green-50 border border-green-200' 
                : 'bg-red-50 border border-red-200'
            }`}>
              <div className="flex items-center">
                {validationResult.exists ? (
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                )}
                <span className={`font-medium ${
                  validationResult.exists ? 'text-green-800' : 'text-red-800'
                }`}>
                  {validationResult.exists ? 'Batch Found!' : 'Batch Not Found'}
                </span>
              </div>
              {validationResult.exists && (
                <p className="text-sm text-green-700 mt-1">
                  Redirecting to batch details...
                </p>
              )}
            </div>
          )}
        </div>

        {/* Info Alert */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-medium text-blue-900">How to find your Batch ID</h4>
              <p className="text-sm text-blue-700 mt-1">
                The batch ID is typically printed on the product packaging or can be found 
                by scanning the QR code on the product. It's a unique identifier that 
                contains information about the crop type, year, and batch number.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BatchLookup 