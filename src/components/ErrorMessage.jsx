import React from 'react';
import { AlertCircle } from 'lucide-react';

const ErrorMessage = ({ error }) => {
  if (!error) return null;

  return (
    <div className="mb-6 bg-red-500/20 border border-red-500 rounded-lg p-4 flex items-center gap-3">
      <AlertCircle size={20} />
      <p>{error}</p>
    </div>
  );
};

export default ErrorMessage;
