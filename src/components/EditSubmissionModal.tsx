import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from '@tanstack/react-form';
import { useTheme } from '../context/ThemeContext';
import { Submission, FormField as FormFieldType } from '../types';
import { api } from '../api';
import FormField from './FormField';

interface EditSubmissionModalProps {
  submission: Submission;
  onClose: () => void;
}

function EditSubmissionModal({ submission, onClose }: EditSubmissionModalProps) {
  const queryClient = useQueryClient();
  const { darkMode } = useTheme();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const { data: schema } = useQuery({
    queryKey: ['formSchema'],
    queryFn: api.getFormSchema,
  });

  const mutation = useMutation({
    mutationFn: (data: Record<string, any>) => api.updateSubmission(submission.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['submissions'] });
      onClose();
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
      setSubmitError(error.error || 'Update failed');
    },
  });

  const form = useForm({
    defaultValues: submission.data,
    onSubmit: async ({ value }) => {
      setSubmitError(null);
      mutation.mutate(value);
    },
  });

  if (!schema) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto`}>
        <div className={`px-6 py-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} flex items-center justify-between`}>
          <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Edit Submission</h2>
          <button
            onClick={onClose}
            className={`${darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-6 py-4">
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

            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className={`px-4 py-2 rounded-md ${
                  darkMode 
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={mutation.isPending}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {mutation.isPending ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditSubmissionModal;
