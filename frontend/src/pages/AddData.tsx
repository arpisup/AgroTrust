import React, { useState, useRef } from 'react'
import { Plus, CheckCircle, AlertCircle, Upload } from 'lucide-react'
import { toast } from 'react-toastify'
import axios from 'axios'

interface FormData {
  batchId: string
  cropName: string
  variety: string
  location: string
  harvestDate: string
  farmerName: string
  farmLocation: string
  contact: string
  farmerId: string
  soilType: string
  irrigationType: string
  pesticideUsed: string
  sowingDate: string
  area: string
  processorName: string
  method: string
  processingDate: string
  processingUnitId: string
  labName: string
  labResult: string
  testDate: string
  reportHash: string
  issuedBy: string
  certificateType: string
  issueDate: string
  certificateId: string
  transferFrom: string
  transferTo: string
  transferPurpose: string
  transferDate: string
  notes: string
  qrCodeHash: string
}

const AddData = () => {
  const [activeTab, setActiveTab] = useState('batch')
  const [isLoading, setIsLoading] = useState(false)
  const [csvFile, setCsvFile] = useState<File | null>(null)
  const [csvUploading, setCsvUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [formData, setFormData] = useState<FormData>({
    batchId: '',
    cropName: '',
    variety: '',
    location: '',
    harvestDate: '',
    farmerName: '',
    farmLocation: '',
    contact: '',
    farmerId: '',
    soilType: '',
    irrigationType: '',
    pesticideUsed: '',
    sowingDate: '',
    area: '',
    processorName: '',
    method: '',
    processingDate: '',
    processingUnitId: '',
    labName: '',
    labResult: '',
    testDate: '',
    reportHash: '',
    issuedBy: '',
    certificateType: '',
    issueDate: '',
    certificateId: '',
    transferFrom: '',
    transferTo: '',
    transferPurpose: '',
    transferDate: '',
    notes: '',
    qrCodeHash: ''
  })

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (endpoint: string, data: any) => {
    setIsLoading(true)
    try {
      const response = await axios.post(`http://localhost:3001/api/batches/${endpoint}`, data)
      if (response.data.success) {
        toast.success(response.data.message)
        return true
      } else {
        toast.error(response.data.error || 'Failed to add data')
        return false
      }
    } catch (error: any) {
      console.error('Error:', error)
      toast.error(error.response?.data?.error || 'Failed to add data to blockchain')
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const handleBatchSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const success = await handleSubmit('add-batch', {
      batchId: formData.batchId,
      cropName: formData.cropName,
      variety: formData.variety,
      location: formData.location,
      harvestDate: formData.harvestDate
    })
    if (success) {
      setActiveTab('farmer')
    }
  }

  const handleFarmerSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const success = await handleSubmit('add-farmer', {
      batchId: formData.batchId,
      farmerName: formData.farmerName,
      farmLocation: formData.farmLocation,
      contact: formData.contact,
      farmerId: formData.farmerId
    })
    if (success) {
      setActiveTab('cultivation')
    }
  }

  const handleCultivationSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const success = await handleSubmit('add-cultivation', {
      batchId: formData.batchId,
      soilType: formData.soilType,
      irrigationType: formData.irrigationType,
      pesticideUsed: formData.pesticideUsed,
      sowingDate: formData.sowingDate,
      area: formData.area
    })
    if (success) {
      setActiveTab('processing')
    }
  }

  const handleProcessingSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const success = await handleSubmit('add-processing', {
      batchId: formData.batchId,
      processorName: formData.processorName,
      method: formData.method,
      processingDate: formData.processingDate,
      processingUnitId: formData.processingUnitId
    })
    if (success) {
      setActiveTab('lab')
    }
  }

  const handleLabSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const success = await handleSubmit('add-lab-result', {
      batchId: formData.batchId,
      labName: formData.labName,
      result: formData.labResult,
      testDate: formData.testDate,
      reportHash: formData.reportHash
    })
    if (success) {
      setActiveTab('certificate')
    }
  }

  const handleCertificateSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const success = await handleSubmit('add-certificate', {
      batchId: formData.batchId,
      issuedBy: formData.issuedBy,
      certificateType: formData.certificateType,
      issueDate: formData.issueDate,
      certificateId: formData.certificateId
    })
    if (success) {
      setActiveTab('transfer')
    }
  }

  const handleTransferSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const success = await handleSubmit('add-transfer', {
      batchId: formData.batchId,
      from: formData.transferFrom,
      to: formData.transferTo,
      purpose: formData.transferPurpose,
      transferDate: formData.transferDate
    })
    if (success) {
      setActiveTab('trace')
    }
  }

  const handleTraceSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const success = await handleSubmit('add-trace-data', {
      batchId: formData.batchId,
      notes: formData.notes,
      qrCodeHash: formData.qrCodeHash
    })
    if (success) {
      toast.success('Complete product data added to blockchain!')
      // Reset form or redirect
    }
  }

  const handleCsvUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!csvFile) {
      toast.error('Please select a CSV file')
      return
    }

    setCsvUploading(true)
    try {
      const formData = new FormData()
      formData.append('csvFile', csvFile)

      const response = await axios.post('http://localhost:3001/api/batches/upload-csv', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      if (response.data.success) {
        toast.success(response.data.message)
        setCsvFile(null)
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
      } else {
        toast.error(response.data.error || 'Failed to upload CSV')
      }
    } catch (error: any) {
      console.error('Error:', error)
      toast.error(error.response?.data?.error || 'Failed to upload CSV file')
    } finally {
      setCsvUploading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type === 'text/csv') {
      setCsvFile(file)
    } else {
      toast.error('Please select a valid CSV file')
      e.target.value = ''
    }
  }

  const tabs = [
    { id: 'batch', label: 'Batch Info', icon: Plus },
    { id: 'csv', label: 'CSV Upload', icon: Upload },
    { id: 'farmer', label: 'Farmer Info', icon: Plus },
    { id: 'cultivation', label: 'Cultivation', icon: Plus },
    { id: 'processing', label: 'Processing', icon: Plus },
    { id: 'lab', label: 'Lab Results', icon: Plus },
    { id: 'certificate', label: 'Certificate', icon: Plus },
    { id: 'transfer', label: 'Transfer', icon: Plus },
    { id: 'trace', label: 'Trace Data', icon: Plus }
  ]

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="section-title">Add Product Data</h1>
        <p className="text-gray-600">
          Add complete traceability data to the blockchain for GI products
        </p>
      </div>

      {/* Progress Tabs */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2 justify-center">
          {tabs.map((tab, index) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            const isCompleted = tabs.findIndex(t => t.id === activeTab) > index
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive 
                    ? 'bg-primary-600 text-white' 
                    : isCompleted
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {isCompleted && <CheckCircle className="w-4 h-4" />}
              </button>
            )
          })}
        </div>
      </div>

      {/* Form Content */}
      <div className="card">
        {/* Batch Information */}
        {activeTab === 'batch' && (
          <form onSubmit={handleBatchSubmit} className="space-y-6">
            <h2 className="subsection-title">Batch Information</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Batch ID *</label>
                <input
                  type="text"
                  value={formData.batchId}
                  onChange={(e) => handleInputChange('batchId', e.target.value)}
                  className="input-field"
                  placeholder="e.g., TURMERIC2025_003"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Crop Name *</label>
                <input
                  type="text"
                  value={formData.cropName}
                  onChange={(e) => handleInputChange('cropName', e.target.value)}
                  className="input-field"
                  placeholder="e.g., Turmeric"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Variety *</label>
                <input
                  type="text"
                  value={formData.variety}
                  onChange={(e) => handleInputChange('variety', e.target.value)}
                  className="input-field"
                  placeholder="e.g., Erode Manjal"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location *</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className="input-field"
                  placeholder="e.g., Erode, Tamil Nadu"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Harvest Date *</label>
                <input
                  type="date"
                  value={formData.harvestDate}
                  onChange={(e) => handleInputChange('harvestDate', e.target.value)}
                  className="input-field"
                  required
                />
              </div>
            </div>
            <button type="submit" disabled={isLoading} className="btn-primary">
              {isLoading ? 'Adding to Blockchain...' : 'Add Batch & Continue'}
            </button>
          </form>
        )}

        {/* CSV Upload */}
        {activeTab === 'csv' && (
          <form onSubmit={handleCsvUpload} className="space-y-6">
            <h2 className="subsection-title">CSV Upload</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Upload CSV File *</label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  className="input-field"
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  Upload a CSV file with batch information. The file should contain columns: 
                  batchId, cropName, variety, location, harvestDate
                </p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-gray-900 mb-2">CSV Format Example:</h4>
                <pre className="text-xs text-gray-600 bg-white p-2 rounded border">
{`batchId,cropName,variety,location,harvestDate
TURMERIC2025_001,Turmeric,Erode Manjal,Erode Tamil Nadu,2025-01-15
TURMERIC2025_002,Turmeric,Erode Manjal,Erode Tamil Nadu,2025-01-20
CLOVE2025_001,Clove,Malabar Clove,Kerala,2025-01-25`}
                </pre>
              </div>
            </div>
            <button type="submit" disabled={csvUploading || !csvFile} className="btn-primary">
              {csvUploading ? 'Uploading to Blockchain...' : 'Upload CSV & Continue'}
            </button>
          </form>
        )}

        {/* Farmer Information */}
        {activeTab === 'farmer' && (
          <form onSubmit={handleFarmerSubmit} className="space-y-6">
            <h2 className="subsection-title">Farmer Information</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Farmer Name *</label>
                <input
                  type="text"
                  value={formData.farmerName}
                  onChange={(e) => handleInputChange('farmerName', e.target.value)}
                  className="input-field"
                  placeholder="e.g., Rajesh Kumar"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Farmer ID *</label>
                <input
                  type="text"
                  value={formData.farmerId}
                  onChange={(e) => handleInputChange('farmerId', e.target.value)}
                  className="input-field"
                  placeholder="e.g., FARMER001"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Farm Location *</label>
                <input
                  type="text"
                  value={formData.farmLocation}
                  onChange={(e) => handleInputChange('farmLocation', e.target.value)}
                  className="input-field"
                  placeholder="e.g., Erode District, Tamil Nadu"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Contact Number *</label>
                <input
                  type="tel"
                  value={formData.contact}
                  onChange={(e) => handleInputChange('contact', e.target.value)}
                  className="input-field"
                  placeholder="e.g., +91 9876543210"
                  required
                />
              </div>
            </div>
            <button type="submit" disabled={isLoading} className="btn-primary">
              {isLoading ? 'Adding to Blockchain...' : 'Add Farmer & Continue'}
            </button>
          </form>
        )}

        {/* Cultivation Details */}
        {activeTab === 'cultivation' && (
          <form onSubmit={handleCultivationSubmit} className="space-y-6">
            <h2 className="subsection-title">Cultivation Details</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Soil Type *</label>
                <input
                  type="text"
                  value={formData.soilType}
                  onChange={(e) => handleInputChange('soilType', e.target.value)}
                  className="input-field"
                  placeholder="e.g., Red Soil"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Irrigation Type *</label>
                <input
                  type="text"
                  value={formData.irrigationType}
                  onChange={(e) => handleInputChange('irrigationType', e.target.value)}
                  className="input-field"
                  placeholder="e.g., Drip Irrigation"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pesticide Used *</label>
                <input
                  type="text"
                  value={formData.pesticideUsed}
                  onChange={(e) => handleInputChange('pesticideUsed', e.target.value)}
                  className="input-field"
                  placeholder="e.g., Organic Neem Oil"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sowing Date *</label>
                <input
                  type="date"
                  value={formData.sowingDate}
                  onChange={(e) => handleInputChange('sowingDate', e.target.value)}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Area (acres) *</label>
                <input
                  type="number"
                  value={formData.area}
                  onChange={(e) => handleInputChange('area', e.target.value)}
                  className="input-field"
                  placeholder="e.g., 5.5"
                  step="0.1"
                  min="0"
                  required
                />
              </div>
            </div>
            <button type="submit" disabled={isLoading} className="btn-primary">
              {isLoading ? 'Adding to Blockchain...' : 'Add Cultivation & Continue'}
            </button>
          </form>
        )}

        {/* Processing Information */}
        {activeTab === 'processing' && (
          <form onSubmit={handleProcessingSubmit} className="space-y-6">
            <h2 className="subsection-title">Processing Information</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Processor Name *</label>
                <input
                  type="text"
                  value={formData.processorName}
                  onChange={(e) => handleInputChange('processorName', e.target.value)}
                  className="input-field"
                  placeholder="e.g., Erode Processing Unit"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Processing Method *</label>
                <input
                  type="text"
                  value={formData.method}
                  onChange={(e) => handleInputChange('method', e.target.value)}
                  className="input-field"
                  placeholder="e.g., Traditional Drying"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Processing Date *</label>
                <input
                  type="date"
                  value={formData.processingDate}
                  onChange={(e) => handleInputChange('processingDate', e.target.value)}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Processing Unit ID *</label>
                <input
                  type="text"
                  value={formData.processingUnitId}
                  onChange={(e) => handleInputChange('processingUnitId', e.target.value)}
                  className="input-field"
                  placeholder="e.g., PROC001"
                  required
                />
              </div>
            </div>
            <button type="submit" disabled={isLoading} className="btn-primary">
              {isLoading ? 'Adding to Blockchain...' : 'Add Processing & Continue'}
            </button>
          </form>
        )}

        {/* Lab Results */}
        {activeTab === 'lab' && (
          <form onSubmit={handleLabSubmit} className="space-y-6">
            <h2 className="subsection-title">Laboratory Results</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Laboratory Name *</label>
                <input
                  type="text"
                  value={formData.labName}
                  onChange={(e) => handleInputChange('labName', e.target.value)}
                  className="input-field"
                  placeholder="e.g., Food Safety Lab"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Test Date *</label>
                <input
                  type="date"
                  value={formData.testDate}
                  onChange={(e) => handleInputChange('testDate', e.target.value)}
                  className="input-field"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Lab Result *</label>
                <textarea
                  value={formData.labResult}
                  onChange={(e) => handleInputChange('labResult', e.target.value)}
                  className="input-field"
                  rows={4}
                  placeholder="e.g., Passed all quality parameters. Curcumin content: 5.2%, Moisture: 8.5%"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Report Hash *</label>
                <input
                  type="text"
                  value={formData.reportHash}
                  onChange={(e) => handleInputChange('reportHash', e.target.value)}
                  className="input-field"
                  placeholder="e.g., 0x1234567890abcdef..."
                  required
                />
              </div>
            </div>
            <button type="submit" disabled={isLoading} className="btn-primary">
              {isLoading ? 'Adding to Blockchain...' : 'Add Lab Results & Continue'}
            </button>
          </form>
        )}

        {/* Certificate */}
        {activeTab === 'certificate' && (
          <form onSubmit={handleCertificateSubmit} className="space-y-6">
            <h2 className="subsection-title">Certificate Information</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Issued By *</label>
                <input
                  type="text"
                  value={formData.issuedBy}
                  onChange={(e) => handleInputChange('issuedBy', e.target.value)}
                  className="input-field"
                  placeholder="e.g., GI Registry Office"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Certificate ID *</label>
                <input
                  type="text"
                  value={formData.certificateId}
                  onChange={(e) => handleInputChange('certificateId', e.target.value)}
                  className="input-field"
                  placeholder="e.g., CERT001"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Certificate Type *</label>
                <input
                  type="text"
                  value={formData.certificateType}
                  onChange={(e) => handleInputChange('certificateType', e.target.value)}
                  className="input-field"
                  placeholder="e.g., GI Certificate"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Issue Date *</label>
                <input
                  type="date"
                  value={formData.issueDate}
                  onChange={(e) => handleInputChange('issueDate', e.target.value)}
                  className="input-field"
                  required
                />
              </div>
            </div>
            <button type="submit" disabled={isLoading} className="btn-primary">
              {isLoading ? 'Adding to Blockchain...' : 'Add Certificate & Continue'}
            </button>
          </form>
        )}

        {/* Transfer Record */}
        {activeTab === 'transfer' && (
          <form onSubmit={handleTransferSubmit} className="space-y-6">
            <h2 className="subsection-title">Transfer Record</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Transfer From *</label>
                <input
                  type="text"
                  value={formData.transferFrom}
                  onChange={(e) => handleInputChange('transferFrom', e.target.value)}
                  className="input-field"
                  placeholder="e.g., Farmer"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Transfer To *</label>
                <input
                  type="text"
                  value={formData.transferTo}
                  onChange={(e) => handleInputChange('transferTo', e.target.value)}
                  className="input-field"
                  placeholder="e.g., Processor"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Transfer Purpose *</label>
                <input
                  type="text"
                  value={formData.transferPurpose}
                  onChange={(e) => handleInputChange('transferPurpose', e.target.value)}
                  className="input-field"
                  placeholder="e.g., Processing"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Transfer Date *</label>
                <input
                  type="date"
                  value={formData.transferDate}
                  onChange={(e) => handleInputChange('transferDate', e.target.value)}
                  className="input-field"
                  required
                />
              </div>
            </div>
            <button type="submit" disabled={isLoading} className="btn-primary">
              {isLoading ? 'Adding to Blockchain...' : 'Add Transfer & Continue'}
            </button>
          </form>
        )}

        {/* Trace Data */}
        {activeTab === 'trace' && (
          <form onSubmit={handleTraceSubmit} className="space-y-6">
            <h2 className="subsection-title">Trace Data</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Additional Notes *</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  className="input-field"
                  rows={4}
                  placeholder="e.g., Special handling instructions, quality notes, etc."
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">QR Code Hash *</label>
                <input
                  type="text"
                  value={formData.qrCodeHash}
                  onChange={(e) => handleInputChange('qrCodeHash', e.target.value)}
                  className="input-field"
                  placeholder="e.g., 0xabcdef1234567890..."
                  required
                />
              </div>
            </div>
            <button type="submit" disabled={isLoading} className="btn-primary">
              {isLoading ? 'Adding to Blockchain...' : 'Complete Product Data'}
            </button>
          </form>
        )}
      </div>

      {/* Info Alert */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start">
          <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
          <div>
            <h4 className="text-sm font-medium text-blue-900">Blockchain Integration</h4>
            <p className="text-sm text-blue-700 mt-1">
              All data is being added directly to the blockchain for immutable record-keeping. 
              Each step requires a blockchain transaction, which may take a few seconds to complete.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddData 