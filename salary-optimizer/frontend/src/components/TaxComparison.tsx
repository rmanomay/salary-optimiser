import { calculateInHand } from '../utils/taxCalculator';
import type { TaxResult } from '../utils/taxCalculator';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Download } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface Props {
    oldRegime: TaxResult;
    newRegime: TaxResult;
    pf: number;
    pt: number;
}

export function TaxComparison({ oldRegime, newRegime, pf, pt }: Props) {

    // Recalculate correctly here or ensure it was passed right
    const inHandOld = calculateInHand(oldRegime.grossSalary, oldRegime.totalTax, pf, pt);
    const inHandNew = calculateInHand(newRegime.grossSalary, newRegime.totalTax, pf, pt);

    const betterRegime = inHandNew >= inHandOld ? 'New' : 'Old';
    const savings = Math.abs(inHandNew - inHandOld) * 12;

    const downloadReport = () => {
        const doc = new jsPDF();

        doc.setFontSize(20);
        doc.text("Salary Structuring & Tax Report FY 25-26", 14, 20);

        doc.setFontSize(12);
        doc.text(`Recommendation: Choose ${betterRegime} Regime`, 14, 30);
        doc.text(`Potential Annual Savings: Rs. ${savings.toLocaleString()}`, 14, 38);

        const data = [
            ['Metric', 'Old Regime', 'New Regime'],
            ['Gross Salary', oldRegime.grossSalary.toLocaleString(), newRegime.grossSalary.toLocaleString()],
            ['Taxable Income', oldRegime.taxableIncome.toLocaleString(), newRegime.taxableIncome.toLocaleString()],
            ['Total Tax (Yearly)', oldRegime.totalTax.toLocaleString(), newRegime.totalTax.toLocaleString()],
            ['In-Hand (Monthly)', Math.round(inHandOld).toLocaleString(), Math.round(inHandNew).toLocaleString()],
        ];

        autoTable(doc, {
            head: [data[0]],
            body: data.slice(1),
            startY: 45,
        });

        doc.save("tax-optimization-report.pdf");
    };

    return (
        <div className="space-y-8">

            {/* Winner Banner */}
            <div className={`p-6 rounded-xl border-l-4 shadow-sm ${betterRegime === 'New' ? 'bg-blue-50 border-blue-500' : 'bg-green-50 border-green-500'}`}>
                <h2 className="text-2xl font-bold text-gray-900">
                    🎉 Recommended: {betterRegime} Tax Regime
                </h2>
                <p className="text-gray-600 mt-2">
                    You save <span className="font-bold text-green-600">₹{savings.toLocaleString()}</span> per year by choosing the {betterRegime} regime.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ResultCard title="New Regime (Default)" result={newRegime} inHand={inHandNew} isWinner={betterRegime === 'New'} />
                <ResultCard title="Old Regime" result={oldRegime} inHand={inHandOld} isWinner={betterRegime === 'Old'} />
            </div>

            <div className="flex justify-center pt-6">
                <button onClick={downloadReport} className="flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors shadow-lg hover:translate-y-[-2px]">
                    <Download size={20} />
                    Download Detailed Report
                </button>
            </div>
        </div>
    );
}

function ResultCard({ title, result, inHand, isWinner }: { title: string, result: TaxResult, inHand: number, isWinner: boolean }) {
    const chartData = [
        { name: 'In-Hand', value: result.grossSalary - result.totalTax, color: '#10b981' },
        { name: 'Tax', value: result.totalTax, color: '#ef4444' },
    ];

    return (
        <div className={`bg-white rounded-xl shadow-lg border-2 overflow-hidden ${isWinner ? 'border-green-500 ring-4 ring-green-500/10' : 'border-transparent'}`}>
            <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h3 className="text-xl font-bold text-gray-800">{title}</h3>
                        <p className="text-sm text-gray-500 mt-1">FY 2025-26 Rules</p>
                    </div>
                    {isWinner && <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold">Best Value</span>}
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Monthly In-Hand</p>
                        <p className="text-2xl font-bold text-gray-900">₹{Math.round(inHand).toLocaleString()}</p>
                    </div>
                    <div className="p-3 bg-red-50 rounded-lg">
                        <p className="text-xs text-red-500 uppercase tracking-wide">Yearly Tax</p>
                        <p className="text-2xl font-bold text-red-600">₹{result.totalTax.toLocaleString()}</p>
                    </div>
                </div>

                <div className="h-48 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={chartData}
                                innerRadius={40}
                                outerRadius={60}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip formatter={(value) => value ? `₹${value.toLocaleString()}` : '₹0'} />
                            <Legend verticalAlign="bottom" height={36} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Detailed Breakdown</h4>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-500">Gross Income</span>
                            <span className="font-medium">₹{result.grossSalary.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Taxable Income</span>
                            <span className="font-medium">₹{result.taxableIncome.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-red-500">
                            <span>Effective Tax Rate</span>
                            <span>{((result.totalTax / result.grossSalary) * 100).toFixed(1)}%</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
