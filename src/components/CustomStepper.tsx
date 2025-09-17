'use client';

import { useState, ReactNode } from 'react';
import ClickSpark from './ClickSpark';

interface CustomStepperProps {
  children: ReactNode[];
  onComplete?: () => void;
  hideNavigation?: boolean;
}

interface StepIndicatorProps {
  current: number;
  total: number;
  onStepClick?: (step: number) => void;
}

function StepIndicator({ current, total, onStepClick }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center mb-8">
      {Array.from({ length: total }, (_, index) => {
        const stepNumber = index + 1;
        const isActive = stepNumber === current;
        const isCompleted = stepNumber < current;
        
        return (
          <div key={stepNumber} className="flex items-center">
            <button
              onClick={() => onStepClick?.(stepNumber)}
              className={`
                w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300
                ${isActive 
                  ? 'bg-white text-black shadow-lg scale-110' 
                  : isCompleted 
                    ? 'bg-white/20 text-white hover:bg-white/30' 
                    : 'bg-white/10 text-white/60 hover:bg-white/20'
                }
              `}
            >
              {isCompleted ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                stepNumber
              )}
            </button>
            {index < total - 1 && (
              <div 
                className={`
                  w-8 h-0.5 mx-2 transition-all duration-300
                  ${stepNumber < current ? 'bg-white' : 'bg-white/20'}
                `}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function CustomStepper({ children, onComplete, hideNavigation = false }: CustomStepperProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = children.length;
  const isLastStep = currentStep === totalSteps;
  const isFirstStep = currentStep === 1;

  const handleNext = () => {
    if (isLastStep) {
      onComplete?.();
    } else {
      // Add a significant delay to make manual booking much slower
      setTimeout(() => {
        setCurrentStep(currentStep + 1);
      }, 1500);
    }
  };

  const handlePrevious = () => {
    if (!isFirstStep) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepClick = (step: number) => {
    if (step <= currentStep) {
      setCurrentStep(step);
    }
  };

  return (
    <div className="w-full">
      {/* Step Indicators */}
      <StepIndicator 
        current={currentStep} 
        total={totalSteps} 
        onStepClick={handleStepClick}
      />

      {/* Step Content */}
      <div className="mb-8">
        {children[currentStep - 1]}
      </div>

      {/* Navigation Buttons */}
      {!hideNavigation && (
        <div className="flex justify-between items-center pt-6 border-t border-white/10">
          <div>
            {!isFirstStep && (
              <ClickSpark sparkColor="#a78bfa" sparkCount={4} sparkRadius={12}>
                <button
                  onClick={handlePrevious}
                  className="px-6 py-3 text-white/80 hover:text-white transition-colors"
                >
                  ← Previous
                </button>
              </ClickSpark>
            )}
          </div>
          
          <ClickSpark sparkColor="#ffffff" sparkCount={6} sparkRadius={15}>
            <button
              onClick={handleNext}
              className="btn-primary px-8 py-3"
            >
              {isLastStep ? 'Complete Reservation' : 'Next Step →'}
            </button>
          </ClickSpark>
        </div>
      )}
    </div>
  );
}

// Simple Step component
export function CustomStep({ children }: { children: ReactNode }) {
  return (
    <div className="space-y-6">
      {children}
    </div>
  );
}

