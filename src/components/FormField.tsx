import { FormApi, useField } from '@tanstack/react-form';
import { useTheme } from '../context/ThemeContext';
import { FormField as FormFieldType } from '../types';
import { validateField } from '../utils/validation';

interface FormFieldProps {
  field: FormFieldType;
  form: FormApi<any, any>;
}

function FormField({ field, form }: FormFieldProps) {
  const { darkMode } = useTheme();
  
  const getInputClassName = (hasError: boolean) => {
    return `w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 ${
      darkMode 
        ? 'bg-gray-700 text-white border-gray-600 placeholder-gray-400' 
        : 'bg-white text-gray-900 border-gray-300'
    } ${
      hasError
        ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
        : 'focus:ring-blue-500 focus:border-blue-500'
    }`;
  };

  const fieldApi = useField({
    form,
    name: field.id,
    validators: {
      onChange: ({ value }: { value: any }) => validateField(field, value),
    },
  });

  const { state, handleChange, handleBlur } = fieldApi;
  const hasError = state.meta.errors.length > 0;

  return (
    <div>
      <label htmlFor={field.id} className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
        {field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {field.type === 'text' && (
        <input
          id={field.id}
          type="text"
          value={state.value || ''}
          onChange={(e) => handleChange(e.target.value)}
          onBlur={handleBlur}
          placeholder={field.placeholder}
          className={getInputClassName(hasError)}
        />
      )}

      {field.type === 'number' && (
        <input
          id={field.id}
          type="number"
          value={state.value || ''}
          onChange={(e) => handleChange(e.target.value ? Number(e.target.value) : '')}
          onBlur={handleBlur}
          placeholder={field.placeholder}
          className={getInputClassName(hasError)}
        />
      )}

      {field.type === 'select' && (
        <select
          id={field.id}
          value={state.value || ''}
          onChange={(e) => handleChange(e.target.value)}
          onBlur={handleBlur}
          className={getInputClassName(hasError)}
        >
          <option value="">{field.placeholder || 'Select an option'}</option>
          {field.options?.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      )}

      {field.type === 'multi-select' && (
        <select
          id={field.id}
          multiple
          value={state.value || []}
          onChange={(e) => {
            const selected = Array.from(e.target.selectedOptions, (option) => option.value);
            handleChange(selected);
          }}
          onBlur={handleBlur}
          className={getInputClassName(hasError)}
          size={5}
        >
          {field.options?.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      )}

      {field.type === 'date' && (
        <input
          id={field.id}
          type="date"
          value={state.value || ''}
          onChange={(e) => handleChange(e.target.value)}
          onBlur={handleBlur}
          className={getInputClassName(hasError)}
        />
      )}

      {field.type === 'textarea' && (
        <textarea
          id={field.id}
          value={state.value || ''}
          onChange={(e) => handleChange(e.target.value)}
          onBlur={handleBlur}
          placeholder={field.placeholder}
          rows={4}
          className={getInputClassName(hasError)}
        />
      )}

      {field.type === 'switch' && (
        <div className="flex items-center">
          <button
            type="button"
            role="switch"
            aria-checked={state.value || false}
            onClick={() => handleChange(!state.value)}
            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              state.value ? 'bg-blue-600' : darkMode ? 'bg-gray-600' : 'bg-gray-200'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                state.value ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      )}

      {hasError && (
        <p className="mt-1 text-sm text-red-600">{state.meta.errors[0]}</p>
      )}
    </div>
  );
}

export default FormField;
