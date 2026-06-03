import React from 'react';

interface BaseFieldProps {
  label: string;
  error?: string;
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement>, BaseFieldProps {}
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement>, BaseFieldProps {
  options: { value: string; label: string }[];
}
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement>, BaseFieldProps {}

export const Input: React.FC<InputProps> = ({ label, error, className = '', id, ...props }) => {
  const fieldId = id || label.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className="form-group">
      <label htmlFor={fieldId} className="form-label">{label}</label>
      <input
        id={fieldId}
        className={`form-input ${error ? 'input-error' : ''} ${className}`}
        {...props}
      />
      {error && (
        <span style={{ color: 'var(--color-danger)', fontSize: '0.775rem', marginTop: '4px', display: 'block' }}>
          {error}
        </span>
      )}
      <style>{`
        .input-error {
          border-color: var(--color-danger) !important;
        }
      `}</style>
    </div>
  );
};

export const Select: React.FC<SelectProps> = ({ label, options, error, className = '', id, ...props }) => {
  const fieldId = id || label.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className="form-group">
      <label htmlFor={fieldId} className="form-label">{label}</label>
      <select
        id={fieldId}
        className={`form-select ${error ? 'input-error' : ''} ${className}`}
        {...props}
      >
        {options.map((opt, idx) => (
          <option key={idx} value={opt.value} style={{ backgroundColor: 'var(--bg-app)', color: 'var(--text-primary)' }}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && (
        <span style={{ color: 'var(--color-danger)', fontSize: '0.775rem', marginTop: '4px', display: 'block' }}>
          {error}
        </span>
      )}
    </div>
  );
};

export const Textarea: React.FC<TextareaProps> = ({ label, error, className = '', id, ...props }) => {
  const fieldId = id || label.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className="form-group">
      <label htmlFor={fieldId} className="form-label">{label}</label>
      <textarea
        id={fieldId}
        className={`form-textarea ${error ? 'input-error' : ''} ${className}`}
        rows={4}
        {...props}
      />
      {error && (
        <span style={{ color: 'var(--color-danger)', fontSize: '0.775rem', marginTop: '4px', display: 'block' }}>
          {error}
        </span>
      )}
    </div>
  );
};
