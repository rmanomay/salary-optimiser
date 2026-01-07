import { useState } from 'react'
import { SalaryInputForm } from './components/SalaryInputForm'
import { TaxComparison } from './components/TaxComparison'
import type { SalaryInputs, Investments, TaxResult } from './utils/taxCalculator'
import { calculateTaxAPI } from './services/api'
import { Calculator, DollarSign } from 'lucide-react'

function App() {
  const [inputs, setInputs] = useState<SalaryInputs>({
    basic: 600000,
    hra: 300000,
    specialAllowance: 400000,
    lta: 0,
    variablePay: 100000,
    otherAllowances: 0,
    pfDeduction: 21600,
    professionalTax: 2400
  });

  const [investments, setInvestments] = useState<Investments>({
    section80C: 150000,
    section80D: 25000,
    hraRentPaid: 120000,
    npsSelf: 0,
    npsEmployer: 0,
    homeLoanInterest: 0
  });

  const [results, setResults] = useState<{ oldRegime: TaxResult, newRegime: TaxResult } | null>(null);
  const [loading, setLoading] = useState(false);

  // Manual API call handler
  const handleCalculate = async () => {
    setLoading(true);
    setResults(null);
    try {
      const res = await calculateTaxAPI(inputs, investments);
      setResults(res);
    } catch (e) {
      console.error("Failed to fetch tax data", e);
      alert("Calculation failed. Ensure backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-blue-600">
            <Calculator className="h-8 w-8" />
            <h1 className="text-xl font-bold tracking-tight text-gray-900">Salary <span className="text-blue-600">Optimizer</span></h1>
          </div>
          <div className="text-sm text-gray-500">FY 2025-26 (AY 26-27)</div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* Hero Section */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-3">Maximize Your Take-Home Salary</h2>
          <p className="text-lg text-gray-600">Compare Old vs New Tax Regimes instantly with our advanced AI-powered tax engine.</p>
        </div>

        {/* Input Form */}
        <SalaryInputForm
          inputs={inputs}
          investments={investments}
          setInputs={setInputs}
          setInvestments={setInvestments}
        />

        {/* Calculate Button */}
        <div className="flex justify-center">
          <button
            onClick={handleCalculate}
            disabled={loading}
            className="flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold px-8 py-4 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Calculating...
              </>
            ) : (
              <>
                <DollarSign size={24} />
                Calculate Optimizations
              </>
            )}
          </button>
        </div>

        {/* Results Section */}
        {results && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <TaxComparison
              oldRegime={results.oldRegime}
              newRegime={results.newRegime}
              pf={inputs.pfDeduction}
              pt={inputs.professionalTax}
            />
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-6 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm">
            Designed & Developed by <span className="text-white font-semibold">Manomay Rapte</span>
          </p>
          <p className="text-xs mt-2">FY 2025-26 Tax Calculator</p>
        </div>
      </footer>
    </div>
  )
}

export default App
