import React, { useEffect, useState } from 'react';
import { createClient } from '../../../utils/supabase/client';

interface Todo {
  id: string;
  [key: string]: any;
}

export const TodosPage: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const supabase = createClient();
        const { data, error: fetchError } = await supabase.from('todos').select();
        
        if (fetchError) {
          setError(fetchError.message);
        } else {
          setTodos(data || []);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch todos');
      } finally {
        setLoading(false);
      }
    };

    fetchTodos();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#2d3748' }}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: '#a0aec0' }}></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#2d3748', color: '#a0aec0' }}>
        <p className="text-red-400">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8" style={{ backgroundColor: '#2d3748', color: '#a0aec0' }}>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-light mb-6">Todos</h1>
        <ul className="space-y-2">
          {todos.length === 0 ? (
            <li className="text-gray-500">No todos found</li>
          ) : (
            todos.map((todo) => (
              <li key={todo.id} className="p-4 bg-gray-700 bg-opacity-50 rounded-lg">
                {JSON.stringify(todo)}
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};
