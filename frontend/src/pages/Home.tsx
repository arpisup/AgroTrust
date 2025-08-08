import { Link } from 'react-router-dom'
import { Shield, Search, QrCode, TrendingUp, Users, Globe, Plus } from 'lucide-react'

const Home = () => {
  return (
    <div className="max-w-6xl mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
          Blockchain-Powered
          <span className="text-primary-600"> GI Product Verification</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Verify the authenticity of Geographical Indication (GI) tagged agricultural products 
          with complete transparency from farm to consumer.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/lookup" className="btn-primary text-lg px-8 py-3">
            <Search className="w-5 h-5 inline mr-2" />
            Lookup Batch
          </Link>
          <Link to="/scan" className="btn-secondary text-lg px-8 py-3">
            <QrCode className="w-5 h-5 inline mr-2" />
            Scan QR Code
          </Link>
          <Link to="/add-data" className="btn-secondary text-lg px-8 py-3 bg-green-600 hover:bg-green-700 text-white">
            <Plus className="w-5 h-5 inline mr-2" />
            Add Data
          </Link>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        <div className="card text-center">
          <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Shield className="w-6 h-6 text-primary-600" />
          </div>
          <h3 className="subsection-title">Authenticity Verification</h3>
          <p className="text-gray-600">
            Verify the authenticity of GI products with immutable blockchain records 
            that cannot be tampered with.
          </p>
        </div>

        <div className="card text-center">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="subsection-title">Complete Traceability</h3>
          <p className="text-gray-600">
            Track products from farm to consumer with detailed information about 
            cultivation, processing, and quality testing.
          </p>
        </div>

        <div className="card text-center">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Users className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="subsection-title">Farmer Protection</h3>
          <p className="text-gray-600">
            Protect legitimate farmers and their GI products from counterfeiting 
            while building consumer trust.
          </p>
        </div>

        <div className="card text-center">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Globe className="w-6 h-6 text-purple-600" />
          </div>
          <h3 className="subsection-title">Geographical Indication</h3>
          <p className="text-gray-600">
            Ensure products originate from specific geographical locations and 
            possess qualities due to that origin.
          </p>
        </div>

        <div className="card text-center">
          <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Search className="w-6 h-6 text-orange-600" />
          </div>
          <h3 className="subsection-title">Easy Verification</h3>
          <p className="text-gray-600">
            Simple QR code scanning or batch ID lookup to access complete 
            product information instantly.
          </p>
        </div>

        <div className="card text-center">
          <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Plus className="w-6 h-6 text-red-600" />
          </div>
          <h3 className="subsection-title">Data Management</h3>
          <p className="text-gray-600">
            Add new batch data manually or upload CSV files for bulk processing 
            and transfer management.
          </p>
        </div>
      </div>

      {/* How It Works */}
      <div className="card mb-12">
        <h2 className="section-title text-center">How It Works</h2>
        <div className="grid md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-xl">1</span>
            </div>
            <h3 className="font-semibold mb-2">Add Data</h3>
            <p className="text-gray-600 text-sm">
              Add batch information manually or via CSV upload
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-xl">2</span>
            </div>
            <h3 className="font-semibold mb-2">Scan QR Code</h3>
            <p className="text-gray-600 text-sm">
              Scan the QR code on the product package
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-xl">3</span>
            </div>
            <h3 className="font-semibold mb-2">Access Information</h3>
            <p className="text-gray-600 text-sm">
              View complete product traceability data
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-xl">4</span>
            </div>
            <h3 className="font-semibold mb-2">Verify Authenticity</h3>
            <p className="text-gray-600 text-sm">
              Check blockchain-verified authenticity
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Ready to Verify Your GI Product?
        </h2>
        <p className="text-gray-600 mb-6">
          Start by scanning a QR code or entering a batch ID to access complete traceability information.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/scan" className="btn-primary">
            <QrCode className="w-4 h-4 inline mr-2" />
            Scan QR Code
          </Link>
          <Link to="/lookup" className="btn-secondary">
            <Search className="w-4 h-4 inline mr-2" />
            Enter Batch ID
          </Link>
          <Link to="/add-data" className="btn-secondary bg-green-600 hover:bg-green-700 text-white">
            <Plus className="w-4 h-4 inline mr-2" />
            Add New Data
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Home 