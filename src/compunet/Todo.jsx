import React, { useState, useEffect } from "react";
import { BiPlus, BiDotsVerticalRounded, BiTag, BiTrash } from "react-icons/bi";
import axios from "axios";

const Todo = () => {
  // Get user ID from localStorage
  const userId = localStorage.getItem('user_id');
  
  // State management
  const [selectedTag, setSelectedTag] = useState(null);
  const [hideCompleted, setHideCompleted] = useState(false);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showTagForm, setShowTagForm] = useState(false);
  const [tags, setTags] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tag_id: ''
  });
  const [tagFormData, setTagFormData] = useState({
    title: '',
    color: '#ddd',
    user_id: userId
  });

  const BASE_URL = 'http://todo.reworkstaging.name.ng/v1';

  // Fetch all tags for the user
  const fetchTags = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/tags?user_id=${userId}`);
      setTags(response.data);
    } catch (error) {
      console.error("Error fetching tags:", error);
    }
  };

  // Fetch tasks based on filter
  const fetchTasks = async () => {
    try {
      let url = `${BASE_URL}/tasks?user_id=${userId}`;
      if (selectedTag) {
        url = `${BASE_URL}/tags/tasks?tag_id=${selectedTag}`;
      }
      const response = await axios.get(url);
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  // Initial data load
  useEffect(() => {
    if (userId) {
      fetchTags();
      fetchTasks();
    }
  }, [userId, selectedTag]);

  // Create new tag
  const createTag = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${BASE_URL}/tags`, tagFormData);
      if (response.data.id) {
        await fetchTags();
        setTagFormData({ title: '', color: '#ddd', user_id: userId });
        setShowTagForm(false);
      }
    } catch (error) {
      console.error("Error creating tag:", error);
    }
  };

  // Create new task
  const createTask = async (e) => {
    e.preventDefault();
    try {
      const taskData = {
        ...formData,
        user_id: userId
      };
      const response = await axios.post(`${BASE_URL}/tasks`, taskData);
      if (response.data.id) {
        await fetchTasks();
        setFormData({ title: '', content: '', tag_id: '' });
        setShowTaskForm(false);
      }
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  // Update task completion status
  const updateTaskCompletion = async (taskId, completed) => {
    try {
      await axios.put(`${BASE_URL}/tasks/${taskId}/set-completed`, { completed });
      await fetchTasks();
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  // Delete task
  const deleteTask = async (taskId) => {
  console.log("Deleting task with ID:", taskId);
  try {
    await axios.delete(`${BASE_URL}/tasks/${taskId}`);
    await fetchTasks();
  } catch (error) {
    console.error("Error deleting task:", error);
  }
};


  // Filter tasks based on selected tag and completion status
  const filteredTasks = tasks.filter(task => {
    if (hideCompleted && task.completed) return false;
    return true;
  });

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Tasks</h1>
        <div className="flex space-x-4">
          <button 
            onClick={() => setShowTagForm(true)}
            className="p-2 rounded-full hover:bg-gray-100"
            title="Add Tag"
          >
            <BiTag size={24} />
          </button>
          <button 
            onClick={() => setShowTaskForm(true)}
            className="p-2 rounded-full hover:bg-gray-100"
            title="Add Task"
          >
            <BiPlus size={24} />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <div className="w-full md:w-1/4 bg-gray-50 p-4 rounded-lg">
          <h2 className="font-semibold mb-4">Tags</h2>
          <ul className="space-y-2">
            <li
              className={`p-2 rounded cursor-pointer ${!selectedTag ? 'bg-blue-100' : 'hover:bg-gray-200'}`}
              onClick={() => setSelectedTag(null)}
            >
              All Tasks
            </li>
            {tags.map(tag => (
              <li
                key={tag.id}
                className={`p-2 rounded cursor-pointer flex items-center ${selectedTag === tag.id ? 'bg-blue-100' : 'hover:bg-gray-200'}`}
                onClick={() => setSelectedTag(tag.id)}
              >
                <span 
                  className="w-4 h-4 rounded-full mr-2"
                  style={{ backgroundColor: tag.color }}
                ></span>
                {tag.title}
              </li>
            ))}
          </ul>

          <div className="mt-6">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={hideCompleted}
                onChange={(e) => setHideCompleted(e.target.checked)}
                className="rounded"
              />
              <span>Hide Completed</span>
            </label>
          </div>
        </div>

        {/* Task List */}
        <div className="flex-1">
          {filteredTasks.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              No tasks found. Create a new task to get started!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredTasks.map(task => (
                <div 
                  key={task.id} 
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                  style={{
                    backgroundColor: task.bg_color || '#fff',
                    color: task.fg_color || '#000',
                    opacity: task.completed ? 0.7 : 1
                  }}
                >
                  <div className="flex justify-between items-start">
                    <h3 className={`font-medium ${task.completed ? 'line-through' : ''}`}>
                      {task.title}
                    </h3>
                    <div className="relative">
                      <button 
                        onClick={() => deleteTask(task.id)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <BiTrash size={20} />
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    {task.content}
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                    {task.tag_id && (
                      <span className="text-xs px-2 py-1 rounded-full bg-gray-100">
                        {tags.find(t => t.id === task.tag_id)?.title || 'Untagged'}
                      </span>
                    )}
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={(e) => updateTaskCompletion(task.id, e.target.checked)}
                        className="rounded"
                      />
                      <span className="text-sm">Completed</span>
                    </label>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Task Modal */}
      {showTaskForm && (
        <div className="fixed inset-0 bg-[#0000006a] bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add New Task</h2>
            <form onSubmit={createTask}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  className="w-full p-2 border rounded"
                  rows={3}
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Tag</label>
                <select
                  className="w-full p-2 border rounded"
                  value={formData.tag_id}
                  onChange={(e) => setFormData({...formData, tag_id: e.target.value})}
                >
                  <option value="">Select a tag</option>
                  {tags.map(tag => (
                    <option key={tag.id} value={tag.id}>{tag.title}</option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowTaskForm(false)}
                  className="px-4 py-2 border rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Add Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Tag Modal */}
      {showTagForm && (
        <div className="fixed inset-0 bg-[#0000006a] bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Create New Tag</h2>
            <form onSubmit={createTag}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Tag Name</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  value={tagFormData.title}
                  onChange={(e) => setTagFormData({...tagFormData, title: e.target.value})}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Color</label>
                <select
                  className="w-full p-2 border rounded"
                  value={tagFormData.color}
                  onChange={(e) => setTagFormData({...tagFormData, color: e.target.value})}
                >
                  <option value="#ddd">Light Gray</option>
                  <option value="#333">Dark Gray</option>
                  <option value="#007bff">Blue</option>
                  <option value="#28a745">Green</option>
                  <option value="#dc3545">Red</option>
                  <option value="#ffc107">Yellow</option>
                  <option value="#6f42c1">Purple</option>
                </select>
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowTagForm(false)}
                  className="px-4 py-2 border rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Create Tag
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Todo;