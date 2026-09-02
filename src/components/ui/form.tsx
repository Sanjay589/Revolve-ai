import React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, helperText, id, ...props }, ref) => {
    const inputId = id || props.name;
    const subText = helperText || hint;

    return (
      <div style={{ marginBottom: 14 }}>
        {label && (
          <label htmlFor={inputId} style={{
            display: 'block',
            fontSize: '0.8125rem',
            fontWeight: 600,
            color: 'var(--text-primary)',
            marginBottom: 6,
          }}>
            {label}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          className={cn(
            'w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 outline-none focus:border-teal-600 transition',
            error && 'border-red-500',
            className
          )}
          style={{
            width: '100%',
            padding: '9px 14px',
            borderRadius: 'var(--radius-md)',
            border: `1px solid ${error ? 'var(--error)' : 'var(--border-primary)'}`,
            background: 'var(--bg-secondary)',
            color: 'var(--text-primary)',
            fontSize: '0.875rem',
            outline: 'none',
          }}
          {...props}
        />
        {error && <p style={{ fontSize: '0.75rem', color: 'var(--error)', marginTop: 4 }}>{error}</p>}
        {subText && !error && (
          <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: 4 }}>
            {subText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  helperText?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, hint, helperText, id, rows = 3, ...props }, ref) => {
    const textareaId = id || props.name;
    const subText = helperText || hint;

    return (
      <div style={{ marginBottom: 14 }}>
        {label && (
          <label htmlFor={textareaId} style={{
            display: 'block',
            fontSize: '0.8125rem',
            fontWeight: 600,
            color: 'var(--text-primary)',
            marginBottom: 6,
          }}>
            {label}
          </label>
        )}
        <textarea
          id={textareaId}
          ref={ref}
          rows={rows}
          style={{
            width: '100%',
            padding: '10px 14px',
            borderRadius: 'var(--radius-md)',
            border: `1px solid ${error ? 'var(--error)' : 'var(--border-primary)'}`,
            background: 'var(--bg-secondary)',
            color: 'var(--text-primary)',
            fontSize: '0.875rem',
            outline: 'none',
            fontFamily: 'var(--font-body)',
            resize: 'vertical',
          }}
          {...props}
        />
        {error && <p style={{ fontSize: '0.75rem', color: 'var(--error)', marginTop: 4 }}>{error}</p>}
        {subText && !error && (
          <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: 4 }}>
            {subText}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { label: string; value: string | number }[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, options, id, ...props }, ref) => {
    const selectId = id || props.name;

    return (
      <div style={{ marginBottom: 14 }}>
        {label && (
          <label htmlFor={selectId} style={{
            display: 'block',
            fontSize: '0.8125rem',
            fontWeight: 600,
            color: 'var(--text-primary)',
            marginBottom: 6,
          }}>
            {label}
          </label>
        )}
        <select
          id={selectId}
          ref={ref}
          style={{
            width: '100%',
            padding: '9px 14px',
            borderRadius: 'var(--radius-md)',
            border: `1px solid ${error ? 'var(--error)' : 'var(--border-primary)'}`,
            background: 'var(--bg-secondary)',
            color: 'var(--text-primary)',
            fontSize: '0.875rem',
            outline: 'none',
          }}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && <p style={{ fontSize: '0.75rem', color: 'var(--error)', marginTop: 4 }}>{error}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';
