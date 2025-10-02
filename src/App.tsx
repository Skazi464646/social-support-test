import { useState } from 'react';
import { AIEnhancedTextarea } from '@/components/molecules/AIEnhancedTextarea';
import { AIEnhancedInput } from '@/components/molecules/AIEnhancedInput';

function App() {
  const [step, setStep] = useState(1);
  
  // Form state
  const [financialSituation, setFinancialSituation] = useState('');
  const [employmentCircumstances, setEmploymentCircumstances] = useState('');
  const [reasonForApplying, setReasonForApplying] = useState('');
  const [additionalComments, setAdditionalComments] = useState('');
  
  // Sample user context for AI assistance
  const userContext = {
    step1: {
      fullName: 'Sample User',
      email: 'user@example.com',
    },
    step2: {
      employmentStatus: 'unemployed',
      monthlyIncome: 0,
      housingStatus: 'rent',
      dependents: 2,
      maritalStatus: 'married',
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Social Support Portal
          </h1>
          <p className="text-gray-600">
            Apply for financial assistance through our secure portal
          </p>
        </header>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                Step {step} of 3
              </span>
              <span className="text-sm text-gray-500">
                {Math.round((step / 3) * 100)}% complete
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(step / 3) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Form Content */}
          <div className="space-y-6">
            {step === 1 && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name *
                    </label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address *
                    </label>
                    <input 
                      type="email" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="your.email@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number *
                    </label>
                    <input 
                      type="tel" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="+971 50 123 4567"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      National ID *
                    </label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your 10-digit national ID"
                      maxLength={10}
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Financial Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Monthly Income (AED) *
                    </label>
                    <input 
                      type="number" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Employment Status *
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="">Select employment status</option>
                      <option value="employed">Employed (Full-time)</option>
                      <option value="unemployed">Unemployed</option>
                      <option value="self_employed">Self-employed</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Detailed Information with AI Assistance</h2>
                <div className="space-y-6">
                  {/* Financial Situation */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Describe Your Financial Situation *
                    </label>
                    <AIEnhancedTextarea
                      fieldName="financialSituation"
                      fieldLabel="Financial Situation"
                      value={financialSituation}
                      onChange={setFinancialSituation}
                      placeholder="Please describe your current financial challenges..."
                      minLength={50}
                      maxLength={1000}
                      required={true}
                      userContext={userContext}
                    />
                  </div>

                  {/* Employment Circumstances */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Describe Your Employment Circumstances *
                    </label>
                    <AIEnhancedTextarea
                      fieldName="employmentCircumstances"
                      fieldLabel="Employment Circumstances"
                      value={employmentCircumstances}
                      onChange={setEmploymentCircumstances}
                      placeholder="Please explain your current employment situation..."
                      minLength={50}
                      maxLength={1000}
                      required={true}
                      userContext={userContext}
                    />
                  </div>

                  {/* Reason for Applying */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Why Are You Applying for Social Support? *
                    </label>
                    <AIEnhancedTextarea
                      fieldName="reasonForApplying"
                      fieldLabel="Reason for Applying"
                      value={reasonForApplying}
                      onChange={setReasonForApplying}
                      placeholder="Please explain why you need assistance and how it will help..."
                      minLength={50}
                      maxLength={1000}
                      required={true}
                      userContext={userContext}
                    />
                  </div>

                  {/* Additional Comments */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Additional Comments (Optional)
                    </label>
                    <AIEnhancedTextarea
                      fieldName="additionalComments"
                      fieldLabel="Additional Comments"
                      value={additionalComments}
                      onChange={setAdditionalComments}
                      placeholder="Any additional information that might be relevant..."
                      minLength={0}
                      maxLength={500}
                      required={false}
                      userContext={userContext}
                      rows={3}
                    />
                  </div>

                  {/* Demo Notice */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
                    <h3 className="font-semibold text-blue-900 mb-2">🎉 AI Assistance Demo Ready!</h3>
                    <p className="text-sm text-blue-700">
                      All fields now include AI assistance with:
                      • Field-specific prompts and examples
                      • Context-aware suggestions based on your previous answers
                      • Real-time editing and refinement capabilities
                      • Rate limiting and security features
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex justify-between mt-8 pt-6 border-t">
            <button 
              onClick={() => setStep(Math.max(1, step - 1))}
              disabled={step === 1}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Back
            </button>
            
            <button 
              onClick={() => {
                if (step === 3) {
                  alert('Form submitted successfully! (This is a demo)');
                } else {
                  setStep(Math.min(3, step + 1));
                }
              }}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              {step === 3 ? 'Submit Application' : 'Next'}
            </button>
          </div>
        </div>

        {/* AI Features Preview */}
        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2">🚀 Coming Soon: AI-Powered Features</h3>
          <p className="text-sm text-blue-700">
            Module 5 will add intelligent writing assistance, auto-completion, and contextual suggestions to help you complete your application more effectively.
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
