import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, CheckCircle, AlertCircle, Download, QrCode, Loader2 } from 'lucide-react'
import { toast } from 'react-toastify'
import { metamaskService } from '../services/metamaskService'

interface BatchData {
  batchId: string
  batch: {
    cropName: string
    variety: string
    location: string
    harvestDate: number
    exists: boolean
  }
  farmer: {
    farmerName: string
    farmLocation: string
    contact: string
    farmerId: string
    exists: boolean
  }
  cultivation: {
    soilType: string
    irrigationType: string
    pesticideUsed: string
    sowingDate: number
    area: number
    exists: boolean
  }
  processing: {
    processorName: string
    method: string
    processingDate: number
    processingUnitId: string
    exists: boolean
  }
  labResult: {
    labName: string
    result: string
    testDate: number
    reportHash: string
    exists: boolean
  }
  certificate: {
    issuedBy: string
    certificateType: string
    issueDate: number
    certificateId: string
    exists: boolean
  }
  transfers: Array<{
    from: string
    to: string
    purpose: string
    transferDate: number
  }>
  traceData: {
    notes: string
    qrCodeHash: string
    exists: boolean
  }
}

const BatchDetails = () => {
  const { batchId } = useParams<{ batchId: string }>()
  const [batchData, setBatchData] = useState<BatchData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    checkConnectionAndLoadData()
  }, [batchId])

  const checkConnectionAndLoadData = async () => {
    try {
      // Check MetaMask connection
      const connected = await metamaskService.isConnected()
      setIsConnected(connected)
      
      if (!connected) {
        setError('MetaMask not connected. Please connect MetaMask and try again.')
        setIsLoading(false)
        return
      }

      if (!batchId) {
        setError('Batch ID is required')
        setIsLoading(false)
        return
      }

      // Load batch data
      const data = await metamaskService.getBatchInfo(batchId)
      
      if (data) {
        setBatchData(data)
        setError(null)
      } else {
        setError('Batch not found')
      }
    } catch (error: any) {
      console.error('Error loading batch details:', error)
      setError(error.message || 'Failed to load batch details')
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const handleRetry = () => {
    setIsLoading(true)
    setError(null)
    checkConnectionAndLoadData()
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="w-8 h-8 text-green-600 animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Loading batch details...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Batch</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <div className="space-x-4">
              <button
                onClick={handleRetry}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
              >
                Retry
              </button>
              <Link
                to="/batch-lookup"
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg inline-block"
              >
                Back to Search
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!batchData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Batch Not Found</h2>
            <p className="text-gray-600 mb-6">The requested batch could not be found.</p>
            <Link
              to="/batch-lookup"
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
            >
              Back to Search
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/batch-lookup"
            className="inline-flex items-center text-green-600 hover:text-green-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Batch Lookup
          </Link>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {batchData.batch.cropName} - {batchData.batch.variety}
                </h1>
                <p className="text-lg text-gray-600 mt-1">
                  Batch ID: {batchData.batchId}
                </p>
                <p className="text-gray-500 mt-1">
                  Location: {batchData.batch.location}
                </p>
              </div>
              <div className="flex space-x-2">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </button>
                <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center">
                  <QrCode className="w-4 h-4 mr-2" />
                  QR Code
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Batch Information Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
              Basic Information
            </h2>
            <div className="space-y-3">
              <div>
                <span className="text-sm font-medium text-gray-500">Crop:</span>
                <p className="text-gray-900">{batchData.batch.cropName}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Variety:</span>
                <p className="text-gray-900">{batchData.batch.variety}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Location:</span>
                <p className="text-gray-900">{batchData.batch.location}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Harvest Date:</span>
                <p className="text-gray-900">{formatDate(batchData.batch.harvestDate)}</p>
              </div>
            </div>
          </div>

          {/* Farmer Information */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
              Farmer Information
            </h2>
            {batchData.farmer.exists ? (
              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-gray-500">Farmer Name:</span>
                  <p className="text-gray-900">{batchData.farmer.farmerName}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Farm Location:</span>
                  <p className="text-gray-900">{batchData.farmer.farmLocation}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Contact:</span>
                  <p className="text-gray-900">{batchData.farmer.contact}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Farmer ID:</span>
                  <p className="text-gray-900">{batchData.farmer.farmerId}</p>
                </div>
              </div>
            ) : (
              <p className="text-gray-500">No farmer information available</p>
            )}
          </div>

          {/* Cultivation Details */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
              Cultivation Details
            </h2>
            {batchData.cultivation.exists ? (
              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-gray-500">Soil Type:</span>
                  <p className="text-gray-900">{batchData.cultivation.soilType}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Irrigation Type:</span>
                  <p className="text-gray-900">{batchData.cultivation.irrigationType}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Pesticide Used:</span>
                  <p className="text-gray-900">{batchData.cultivation.pesticideUsed}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Sowing Date:</span>
                  <p className="text-gray-900">{formatDate(batchData.cultivation.sowingDate)}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Area (sq m):</span>
                  <p className="text-gray-900">{batchData.cultivation.area.toLocaleString()}</p>
                </div>
              </div>
            ) : (
              <p className="text-gray-500">No cultivation details available</p>
            )}
          </div>

          {/* Processing Information */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
              Processing Information
            </h2>
            {batchData.processing.exists ? (
              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-gray-500">Processor:</span>
                  <p className="text-gray-900">{batchData.processing.processorName}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Method:</span>
                  <p className="text-gray-900">{batchData.processing.method}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Processing Date:</span>
                  <p className="text-gray-900">{formatDate(batchData.processing.processingDate)}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Unit ID:</span>
                  <p className="text-gray-900">{batchData.processing.processingUnitId}</p>
                </div>
              </div>
            ) : (
              <p className="text-gray-500">No processing information available</p>
            )}
          </div>

          {/* Lab Results */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
              Lab Results
            </h2>
            {batchData.labResult.exists ? (
              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-gray-500">Lab:</span>
                  <p className="text-gray-900">{batchData.labResult.labName}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Result:</span>
                  <p className="text-gray-900">{batchData.labResult.result}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Test Date:</span>
                  <p className="text-gray-900">{formatDate(batchData.labResult.testDate)}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Report Hash:</span>
                  <p className="text-gray-900 font-mono text-sm">{batchData.labResult.reportHash}</p>
                </div>
              </div>
            ) : (
              <p className="text-gray-500">No lab results available</p>
            )}
          </div>

          {/* Certificate */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
              Certificate
            </h2>
            {batchData.certificate.exists ? (
              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-gray-500">Issued By:</span>
                  <p className="text-gray-900">{batchData.certificate.issuedBy}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Certificate Type:</span>
                  <p className="text-gray-900">{batchData.certificate.certificateType}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Issue Date:</span>
                  <p className="text-gray-900">{formatDate(batchData.certificate.issueDate)}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Certificate ID:</span>
                  <p className="text-gray-900">{batchData.certificate.certificateId}</p>
                </div>
              </div>
            ) : (
              <p className="text-gray-500">No certificate information available</p>
            )}
          </div>
        </div>

        {/* Transfer Records */}
        {batchData.transfers.length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
              Transfer Records
            </h2>
            <div className="space-y-4">
              {batchData.transfers.map((transfer, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="grid md:grid-cols-4 gap-4">
                    <div>
                      <span className="text-sm font-medium text-gray-500">From:</span>
                      <p className="text-gray-900">{transfer.from}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">To:</span>
                      <p className="text-gray-900">{transfer.to}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Purpose:</span>
                      <p className="text-gray-900">{transfer.purpose}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Date:</span>
                      <p className="text-gray-900">{formatDate(transfer.transferDate)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Trace Data */}
        {batchData.traceData.exists && (
          <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
              Trace Data
            </h2>
            <div className="space-y-3">
              <div>
                <span className="text-sm font-medium text-gray-500">Notes:</span>
                <p className="text-gray-900">{batchData.traceData.notes}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">QR Code Hash:</span>
                <p className="text-gray-900 font-mono text-sm">{batchData.traceData.qrCodeHash}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default BatchDetails 