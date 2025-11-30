import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from '@tanstack/react-form';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { api } from '../api';
import { FormField as FormFieldType } from '../types';
import FormField from '../components/FormField';
import { useState } from 'react';

function FormPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { darkMode } = useTheme();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const { data: schema, isLoading, error } = useQuery({
    queryKey: ['formSchema'],
    queryFn: api.getFormSchema,
  });

  const mutation = useMutation({
    mutationFn: api.submitForm,
    onSuccess: () => {
      setSubmitSuccess(true);
      setSubmitError(null);
      queryClient.invalidateQueries({ queryKey: ['submissions'] });
      form.reset();
      setTimeout(() => {
        navigate('/submissions');
      }, 1500);
    },
    onError: (error: any) => {
      if (error.errors) {
        Object.entries(error.errors).forEach(([field, message]) => {
          form.setFieldMeta(field, (prev) => ({
            ...prev,
            errors: [message as string],
          }));
        });
      }
      setSubmitError(error.error || 'Submission failed');
    },
  });

  const form = useForm({
    defaultValues: {} as Record<string, any>,
    onSubmit: async ({ value }) => {
      setSubmitError(null);
      setSubmitSuccess(false);
      mutation.mutate(value);
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">Error loading form: {(error as Error).message}</p>
      </div>
    );
  }

  if (!schema) return null;

  return (
    <div className="max-w-2xl mx-auto">
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} shadow rounded-lg p-6`}>
        <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>{schema.title}</h1>
        <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-6`}>{schema.description}</p>

        {submitSuccess && (
          <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-800">Form submitted successfully! Redirecting...</p>
          </div>
        )}

        {submitError && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{submitError}</p>
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <div className="space-y-6">
            {schema.fields.map((field: FormFieldType) => (
              <FormField key={field.id} field={field} form={form} />
            ))}
          </div>

          <div className="mt-6">
            <button
              type="submit"
              disabled={mutation.isPending}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed ${
                darkMode ? 'focus:ring-offset-gray-800' : ''
              }`}
            >
              {mutation.isPending ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </span>
              ) : (
                'Submit'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default FormPage;
