'use client';

import { useState } from 'react';
import { floorPlans } from '@/lib/api';
import { toast } from 'sonner';

export default function FloorPlanAnalysis() {
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>('No file chosen');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setFileName(selectedFile.name);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      toast.error('Please select a file to upload');
      return;
    }

    setIsLoading(true);
    try {
      const result = await floorPlans.analyze(file);
      setAnalysisResult(result);
      toast.success('Floor plan analyzed successfully!');
    } catch (error) {
      console.error('Error analyzing floor plan:', error);
      toast.error('Failed to analyze floor plan. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-slate-900 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">AI Construction Cost Estimator</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">
            Upload your floor plan
          </label>
          <div className="border border-gray-300 dark:border-gray-700 rounded-lg">
            <div className="p-4 flex items-center justify-between">
              <span className="text-sm truncate">{fileName}</span>
              <label className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded-md text-sm">
                Choose File
                <input 
                  type="file" 
                  className="hidden" 
                  accept=".jpg,.jpeg,.png,.pdf"
                  onChange={handleFileChange}
                />
              </label>
            </div>
          </div>
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            Supported formats: JPG, PNG, PDF
          </p>
        </div>
        
        <button 
          type="submit" 
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md font-medium"
          disabled={isLoading}
        >
          {isLoading ? 'Analyzing...' : 'Upload & Analyze'}
        </button>
      </form>

      {analysisResult && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">Analysis Results</h3>
          
          {/* Components Detected */}
          <div className="mb-6">
            <h4 className="text-lg font-medium mb-2">Components Detected</h4>
            <div className="bg-gray-50 dark:bg-slate-800 rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-100 dark:bg-slate-700">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Component
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Dimensions
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Confidence
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {analysisResult.components.map((component: any, index: number) => (
                    <tr key={index}>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium capitalize">
                        {component.type}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">
                        {component.dimensions ? 
                          `${Math.round(component.dimensions.width)}cm × ${Math.round(component.dimensions.height)}cm` 
                          : 'N/A'}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">
                        {component.confidence ? 
                          `${Math.round(component.confidence * 100)}%` 
                          : 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Cost Breakdown */}
          <div className="mb-6">
            <h4 className="text-lg font-medium mb-2">Cost Breakdown</h4>
            <div className="bg-gray-50 dark:bg-slate-800 rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-100 dark:bg-slate-700">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Item
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Materials
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Labor
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {analysisResult.cost_breakdown.breakdown.map((item: any, index: number) => (
                    <tr key={index}>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium capitalize">
                        {item.component}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">
                        {formatCurrency(item.material_cost)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">
                        {formatCurrency(item.labor_cost)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                        {formatCurrency(item.total)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Total Costs */}
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Direct Costs</h4>
                <p className="text-lg font-semibold">
                  {formatCurrency(analysisResult.cost_breakdown.direct_costs.total)}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Indirect Costs</h4>
                <p className="text-lg font-semibold">
                  {formatCurrency(analysisResult.cost_breakdown.indirect_costs.total)}
                </p>
              </div>
              <div className="col-span-2 pt-2 mt-2 border-t border-blue-200 dark:border-blue-700">
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Estimated Cost</h4>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {formatCurrency(analysisResult.cost_breakdown.total_cost)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 