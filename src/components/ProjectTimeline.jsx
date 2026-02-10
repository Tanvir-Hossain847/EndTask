"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { HiCheck, HiX } from 'react-icons/hi';

const steps = [
  { id: 'OPEN', label: 'Open' },
  { id: 'ASSIGNED', label: 'Assigned' },
  { id: 'IN_PROGRESS', label: 'In Progress' },
  { id: 'SUBMITTED', label: 'Review' },
  { id: 'COMPLETED', label: 'Completed' },
];

export default function ProjectTimeline({ status }) {
  
  let currentStepIndex = steps.findIndex(s => s.id === status);
  const isRejected = status === 'REJECTED';

  
  
  if (isRejected) {
    currentStepIndex = steps.findIndex(s => s.id === 'SUBMITTED');
  }

  
  
  
  
  
  
  
  
  
  
  
  const isTaskStatus = ['TODO', 'IN_PROGRESS', 'SUBMITTED', 'REJECTED'].includes(status);
  
  const timelineSteps = isTaskStatus 
    ? [
        { id: 'TODO', label: 'To Do' },
        { id: 'IN_PROGRESS', label: 'In Progress' },
        { id: 'SUBMITTED', label: 'Submitted' },
        { id: 'COMPLETED', label: 'Done' }
      ]
    : [
        { id: 'OPEN', label: 'Open' },
        { id: 'ASSIGNED', label: 'Assigned' },
        { id: 'COMPLETED', label: 'Completed' }
      ];

  currentStepIndex = timelineSteps.findIndex(s => s.id === status);
  if (isRejected) currentStepIndex = timelineSteps.findIndex(s => s.id === 'SUBMITTED');


  return (
    <div className="w-full py-6">
      <div className="relative flex items-center justify-between w-full">
        {}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-white/10 rounded-full -z-10" />

        {}
        <motion.div 
          className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary rounded-full -z-10"
          initial={{ width: '0%' }}
          animate={{ width: `${(currentStepIndex / (timelineSteps.length - 1)) * 100}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />

        {timelineSteps.map((step, index) => {
          const isCompleted = index < currentStepIndex;
          const isCurrent = index === currentStepIndex;
          const isError = isCurrent && isRejected;

          return (
            <div key={step.id} className="flex flex-col items-center gap-2 relative">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center border-2 
                  ${isError ? 'bg-error border-error text-error-content' : 
                    isCompleted || isCurrent ? 'bg-primary border-primary text-primary-content' : 'bg-base-100 border-white/20 text-white/40'}
                  z-10 transition-colors duration-300
                `}
              >
                {isCompleted ? <HiCheck className="w-5 h-5" /> : 
                 isError ? <HiX className="w-5 h-5" /> :
                 <span className="text-xs font-bold">{index + 1}</span>}
              </motion.div>
              
              <motion.span 
                className={`text-xs font-medium absolute -bottom-6 whitespace-nowrap ${isCurrent ? 'text-white' : 'text-white/40'}`}
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.2 }}
              >
                {step.label} {isError && '(Rejected)'}
              </motion.span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
