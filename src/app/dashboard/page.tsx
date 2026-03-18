'use client';

import { useState, useEffect, useCallback } from 'react';
import { tasksApi, Task, TaskCreate } from '../../lib/api';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import '@/app/globals.css';

/**
 * Professional Dashboard Page - Clean, Modern Design
 * All functionality exactly as per constitution
 */
export default function DashboardPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'complete' | 'incomplete'>('all');
  const [userEmail, setUserEmail] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication - as per constitution
  useEffect(() => {
    const token = localStorage.getItem('user_id');
    const email = localStorage.getItem('user_email');

    if (!token || !email) {
      window.location.href = '/login';
      return;
    }

    setUserEmail(email);
    setIsAuthenticated(true);
  }, []);

  // Load tasks - as per constitution
  useEffect(() => {
    if (isAuthenticated) {
      loadTasks();
    }
  }, [statusFilter, isAuthenticated]);

  const loadTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await tasksApi.list(statusFilter);
      setTasks(data);
    } catch (err) {
      if (err instanceof Error && err.message.includes('login')) {
        window.location.href = '/login';
        return;
      }
      setError(err instanceof Error ? err.message : 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user_id');
    localStorage.removeItem('user_email');
    localStorage.removeItem('user_name');
    window.location.href = '/login';
  }

  // Create task - as per constitution
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!title.trim()) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Title cannot be empty',
        confirmButtonColor: '#2563eb',
      });
      return;
    }

    try {
      const newTask = await tasksApi.create({ title: title.trim(), description });
      setTasks([newTask, ...tasks]);
      setTitle('');
      setDescription('');
      
      Swal.fire({
        icon: 'success',
        title: 'Task Created!',
        text: 'Your task has been created successfully',
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (err) {
      if (err instanceof Error && err.message.includes('login')) {
        window.location.href = '/login';
        return;
      }
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err instanceof Error ? err.message : 'Failed to create task',
        confirmButtonColor: '#2563eb',
      });
    }
  }

  // Toggle completion - as per constitution
  async function handleToggle(task: Task) {
    try {
      const updatedTask = await tasksApi.toggle(task.id);
      setTasks(tasks.map(t => t.id === task.id ? updatedTask : t));
      
      Swal.fire({
        icon: task.completed ? 'info' : 'success',
        title: task.completed ? 'Task marked as incomplete' : 'Task completed!',
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      if (err instanceof Error && err.message.includes('login')) {
        window.location.href = '/login';
        return;
      }
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err instanceof Error ? err.message : 'Failed to toggle task',
        confirmButtonColor: '#2563eb',
      });
    }
  }

  // Delete task - as per constitution
  async function handleDelete(task: Task) {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to delete "${task.title}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    });

    if (!result.isConfirmed) return;

    try {
      await tasksApi.delete(task.id);
      setTasks(tasks.filter(t => t.id !== task.id));
      
      Swal.fire({
        icon: 'success',
        title: 'Deleted!',
        text: 'Task has been deleted successfully',
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (err) {
      if (err instanceof Error && err.message.includes('login')) {
        window.location.href = '/login';
        return;
      }
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err instanceof Error ? err.message : 'Failed to delete task',
        confirmButtonColor: '#2563eb',
      });
    }
  }

  // Update task - as per constitution
  async function handleEdit(task: Task) {
    const { value: formValues } = await Swal.fire({
      title: '<span style="font-size: 1.5rem; font-weight: 600; color: #111827;">✏️ Edit Task</span>',
      html: `
        <style>
          .swal2-edit-input {
            width: 100%;
            padding: 0.75rem 1rem;
            border: 2px solid #e5e7eb;
            border-radius: 0.5rem;
            font-size: 0.875rem;
            transition: all 0.2s;
            margin-bottom: 1rem;
          }
          .swal2-edit-input:focus {
            outline: none;
            border-color: #2563eb;
            box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
          }
          .swal2-edit-input::placeholder {
            color: #9ca3af;
          }
          .swal2-edit-textarea {
            width: 100%;
            padding: 0.75rem 1rem;
            border: 2px solid #e5e7eb;
            border-radius: 0.5rem;
            font-size: 0.875rem;
            transition: all 0.2s;
            resize: vertical;
            min-height: 100px;
            font-family: inherit;
          }
          .swal2-edit-textarea:focus {
            outline: none;
            border-color: #2563eb;
            box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
          }
          .swal2-edit-label {
            display: block;
            font-size: 0.875rem;
            font-weight: 500;
            color: #374151;
            margin-bottom: 0.5rem;
          }
          .swal2-edit-group {
            text-align: left;
            margin-bottom: 0.5rem;
          }
        </style>
        <div class="swal2-edit-group">
          <label class="swal2-edit-label" for="swal-title">📝 Task Title</label>
          <input 
            id="swal-title" 
            class="swal2-edit-input" 
            placeholder="Enter task title" 
            value="${task.title || ''}"
          >
        </div>
        <div class="swal2-edit-group">
          <label class="swal2-edit-label" for="swal-desc">📄 Description (optional)</label>
          <textarea 
            id="swal-desc" 
            class="swal2-edit-textarea" 
            placeholder="Enter task description"
          >${task.description || ''}</textarea>
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: '<span style="font-weight: 500;">💾 Update Task</span>',
      cancelButtonText: '<span style="font-weight: 500;">Cancel</span>',
      confirmButtonColor: '#2563eb',
      cancelButtonColor: '#6b7280',
      buttonsStyling: true,
      customClass: {
        popup: 'swal2-popup-custom',
        title: 'swal2-title-custom',
        actions: 'swal2-actions-custom',
      },
      didOpen: () => {
        const titleInput = document.getElementById('swal-title') as HTMLInputElement;
        if (titleInput) {
          titleInput.focus();
        }
      },
      preConfirm: () => {
        const titleInput = document.getElementById('swal-title') as HTMLInputElement;
        const descTextarea = document.getElementById('swal-desc') as HTMLTextAreaElement;
        
        const title = titleInput?.value.trim();
        const description = descTextarea?.value.trim();
        
        if (!title) {
          Swal.showValidationMessage('<span style="color: #dc2626;">⚠️ Title cannot be empty</span>');
          return false;
        }
        
        if (title.length > 200) {
          Swal.showValidationMessage('<span style="color: #dc2626;">⚠️ Title must be 200 characters or less</span>');
          return false;
        }
        
        return { title, description: description || undefined };
      },
    });

    if (!formValues) return;

    try {
      const updatedTask = await tasksApi.update(task.id, formValues);
      setTasks(tasks.map(t => t.id === task.id ? updatedTask : t));
      
      Swal.fire({
        icon: 'success',
        title: '<span style="font-size: 1.25rem; font-weight: 600;">✅ Updated!</span>',
        html: '<p style="color: #6b7280;">Task has been updated successfully</p>',
        confirmButtonColor: '#2563eb',
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (err) {
      if (err instanceof Error && err.message.includes('login')) {
        window.location.href = '/login';
        return;
      }
      Swal.fire({
        icon: 'error',
        title: '<span style="font-size: 1.25rem; font-weight: 600;">❌ Error</span>',
        html: `<p style="color: #6b7280;">${err instanceof Error ? err.message : 'Failed to update task'}</p>`,
        confirmButtonColor: '#2563eb',
      });
    }
  }

  // Calculate counts
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.completed).length;
  const incompleteTasks = totalTasks - completedTasks;

  // Show loading
  if (!isAuthenticated) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f9fafb',
      }}>
        <div style={{ textAlign: 'center' }}>
          <span className="spinner" style={{ 
            width: '32px', 
            height: '32px',
            borderColor: '#e5e7eb',
            borderTopColor: '#2563eb',
          }} />
          <p style={{ marginTop: '1rem', color: '#6b7280' }}>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fade-in" style={{
      minHeight: '100vh',
      backgroundColor: '#f9fafb',
      padding: '2rem 1rem',
    }}>
      <div className="container" style={{ maxWidth: '900px' }}>
        {/* Header */}
        <div className="dashboard-header" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
          paddingBottom: '1.5rem',
          borderBottom: '1px solid #e5e7eb',
          gap: '1rem',
        }}>
          <div style={{ flex: 1 }}>
            <h1 style={{
              fontSize: 'clamp(1.25rem, 4vw, 1.5rem)',
              fontWeight: '600',
              color: '#111827',
              marginBottom: '0.25rem',
            }}>
              📋 TaskFlow
            </h1>
            <p style={{
              fontSize: '0.8125rem',
              color: '#6b7280',
            }}>
              👤 {userEmail}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="btn-secondary"
            style={{
              padding: '0.5rem 1rem',
              fontSize: '0.8125rem',
              whiteSpace: 'nowrap',
            }}
          >
            Logout
          </button>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem',
        }}>
          <div className="card" style={{
            padding: '1.25rem',
            textAlign: 'center',
          }}>
            <div style={{
              fontSize: 'clamp(1.5rem, 4vw, 2rem)',
              fontWeight: '700',
              color: '#2563eb',
              marginBottom: '0.25rem',
            }}>
              {totalTasks}
            </div>
            <div style={{
              fontSize: '0.75rem',
              color: '#6b7280',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}>
              Total
            </div>
          </div>
          <div className="card" style={{
            padding: '1.25rem',
            textAlign: 'center',
          }}>
            <div style={{
              fontSize: 'clamp(1.5rem, 4vw, 2rem)',
              fontWeight: '700',
              color: '#059669',
              marginBottom: '0.25rem',
            }}>
              {completedTasks}
            </div>
            <div style={{
              fontSize: '0.75rem',
              color: '#6b7280',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}>
              Completed
            </div>
          </div>
          <div className="card" style={{
            padding: '1.25rem',
            textAlign: 'center',
          }}>
            <div style={{
              fontSize: 'clamp(1.5rem, 4vw, 2rem)',
              fontWeight: '700',
              color: '#d97706',
              marginBottom: '0.25rem',
            }}>
              {incompleteTasks}
            </div>
            <div style={{
              fontSize: '0.75rem',
              color: '#6b7280',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}>
              Pending
            </div>
          </div>
        </div>

        {/* Create Task Form */}
        <div className="card" style={{
          marginBottom: '2rem',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        }}>
          <h2 style={{
            fontSize: '1.125rem',
            fontWeight: '600',
            color: '#111827',
            marginBottom: '1.25rem',
          }}>
            Create New Task
          </h2>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1rem' }}>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Task title (required)"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  fontSize: '0.875rem',
                }}
              />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Task description (optional)"
                rows={3}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  fontSize: '0.875rem',
                  resize: 'vertical',
                }}
              />
            </div>
            <button
              type="submit"
              className="btn-primary"
              style={{
                padding: '0.625rem 1.25rem',
                fontSize: '0.875rem',
                fontWeight: '500',
              }}
            >
              <span style={{ marginRight: '0.5rem' }}>+</span>
              Create Task
            </button>
          </form>
        </div>

        {/* Filter */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.5rem',
          flexWrap: 'wrap',
          gap: '0.5rem',
        }}>
          <h2 style={{
            fontSize: '1.125rem',
            fontWeight: '600',
            color: '#111827',
          }}>
            My Tasks
          </h2>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="filter-select"
            style={{
              padding: '0.5rem 0.75rem',
              fontSize: '0.875rem',
              width: 'auto',
            }}
          >
            <option value="all">All ({totalTasks})</option>
            <option value="complete">Completed ({completedTasks})</option>
            <option value="incomplete">Pending ({incompleteTasks})</option>
          </select>
        </div>

        {/* Task List */}
        <div>
          {loading && (
            <div style={{
              padding: '2rem',
              textAlign: 'center',
              color: '#6b7280',
            }}>
              <span className="spinner" style={{ 
                width: '24px', 
                height: '24px',
                borderColor: '#e5e7eb',
                borderTopColor: '#2563eb',
              }} />
              <p style={{ marginTop: '0.75rem' }}>Loading tasks...</p>
            </div>
          )}

          {error && (
            <div className="alert alert-error" style={{
              marginBottom: '1.5rem',
            }}>
              <span>⚠️</span>
              {error}
            </div>
          )}

          {!loading && !error && tasks.length === 0 && (
            <div className="card" style={{
              padding: '3rem',
              textAlign: 'center',
            }}>
              <div style={{
                fontSize: 'clamp(2rem, 8vw, 3rem)',
                marginBottom: '1rem',
              }}>
                📭
              </div>
              <h3 style={{
                fontSize: '1.125rem',
                fontWeight: '600',
                color: '#111827',
                marginBottom: '0.5rem',
              }}>
                No tasks yet
              </h3>
              <p style={{
                color: '#6b7280',
                fontSize: '0.875rem',
              }}>
                Create your first task above!
              </p>
            </div>
          )}

          {!loading && !error && tasks.length > 0 && (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
            }}>
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="card"
                  style={{
                    padding: '1.25rem',
                    backgroundColor: task.completed ? '#f0fdf4' : 'white',
                    border: task.completed 
                      ? '1px solid #bbf7d0' 
                      : '1px solid #e5e7eb',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '1rem',
                    flexWrap: 'wrap',
                  }}>
                    {/* Checkbox */}
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => handleToggle(task)}
                      style={{
                        width: '20px',
                        height: '20px',
                        marginTop: '2px',
                        cursor: 'pointer',
                        accentColor: '#059669',
                      }}
                    />

                    {/* Task Content */}
                    <div style={{ flex: 1, minWidth: '200px' }}>
                      <h3 style={{
                        fontSize: '1rem',
                        fontWeight: '500',
                        color: task.completed ? '#9ca3af' : '#111827',
                        marginBottom: '0.25rem',
                        textDecoration: task.completed ? 'line-through' : 'none',
                      }}>
                        {task.title}
                      </h3>
                      {task.description && (
                        <p style={{
                          fontSize: '0.875rem',
                          color: '#6b7280',
                          marginBottom: '0.75rem',
                          textDecoration: task.completed ? 'line-through' : 'none',
                        }}>
                          {task.description}
                        </p>
                      )}
                      <div style={{
                        fontSize: '0.75rem',
                        color: '#9ca3af',
                      }}>
                        Created: {new Date(task.created_at).toLocaleString()}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="task-actions" style={{
                      display: 'flex',
                      gap: '0.5rem',
                      flexWrap: 'wrap',
                    }}>
                      <button
                        onClick={() => handleEdit(task)}
                        className="btn-secondary"
                        style={{
                          padding: '0.5rem 0.75rem',
                          fontSize: '0.75rem',
                        }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(task)}
                        className="btn-danger"
                        style={{
                          padding: '0.5rem 0.75rem',
                          fontSize: '0.75rem',
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
