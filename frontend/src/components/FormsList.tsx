import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, Edit, Eye, Trash2 } from 'lucide-react';
import { api } from '../api/forms';
import { Form } from '../types/form';

export const FormsList = () => {
  const [forms, setForms] = useState<Form[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadForms();
  }, []);

  const loadForms = async () => {
    try {
      const response = await api.getForms();
      setForms(response.data);
    } catch (err) {
      setError('Failed to load forms');
    } finally {
      setLoading(false);
    }
  };

  const deleteForm = async (id: string) => {
    try {
      await api.deleteForm(id);
      setForms(forms.filter(form => form._id !== id));
    } catch (err) {
      setError('Failed to delete form');
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center py-8">{error}</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Your Forms</h2>
        <Link
          to="/create"
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          <PlusCircle size={20} />
          Create New Form
        </Link>
      </div>

      {forms.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No forms created yet. Create your first form!
        </div>
      ) : (
        <div className="grid gap-4">
          {forms.map((form) => (
            <div
              key={form._id}
              className="bg-white p-4 rounded-lg shadow-sm flex items-center justify-between"
            >
              <div>
                <h3 className="font-medium">{form.title}</h3>
                <p className="text-sm text-gray-500">{form.description}</p>
              </div>
              <div className="flex gap-2">
                <Link
                  to={`/form/${form._id}`}
                  className="p-2 text-gray-600 hover:text-blue-500"
                  title="Preview"
                >
                  <Eye size={20} />
                </Link>
                <Link
                  to={`/edit/${form._id}`}
                  className="p-2 text-gray-600 hover:text-green-500"
                  title="Edit"
                >
                  <Edit size={20} />
                </Link>
                <button
                  onClick={() => deleteForm(form._id!)}
                  className="p-2 text-gray-600 hover:text-red-500"
                  title="Delete"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};