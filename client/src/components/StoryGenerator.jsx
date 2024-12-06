import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import { ClipLoader } from 'react-spinners'
import { useRemark } from 'react-remark'

function StoryGenerator() {
  const [prompt, setPrompt] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [markdown, setMarkdown] = useRemark()
  const { token, logout } = useAuth()
  const navigate = useNavigate()
  if (!token) {
    navigate('/login')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMarkdown('')

    try {
      const response = await axios.post('http://localhost:3000/', {
        message: prompt
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      const formattedStory = response.data.story
        .replace(/\n/g, '\n\n')
        .replace(/^#/gm, '##')
      
      setMarkdown(formattedStory)
    } catch (err) {
      if (err.response?.status === 401) {
        logout()
      } else {
        setError(err.message || 'Failed to generate story')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-8">
      <div className="bg-white shadow-2xl rounded-lg p-8 w-full max-w-4xl">
        <div className="flex justify-between items-center mb-8 border-b pb-4">
          <h1 className="text-3xl font-bold text-gray-800">
            AI Story Generator
          </h1>
          <button 
            onClick={logout}
            className="bg-gray-800 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition duration-300"
          >
            Logout
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4 mb-8">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter your story prompt..."
            className="w-full px-6 py-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 transition duration-300 min-h-[150px]"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-800 text-white py-3 px-6 rounded-lg hover:bg-gray-700 transition duration-300 disabled:opacity-50 text-lg font-medium flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <ClipLoader color="#ffffff" size={24} />
                <span>Generating Story...</span>
              </>
            ) : (
              'Generate Story'
            )}
          </button>
        </form>

        {error && (
          <div className="mb-8 p-4 bg-red-100 text-red-700 rounded-lg text-center">
            {error}
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center space-y-4 my-12">
            <ClipLoader color="#1f2937" size={50} />
            <p className="text-gray-600">Creating your story...</p>
          </div>
        )}

        {markdown && !loading && (
          <div className="bg-gray-100 rounded-lg shadow-inner p-8">
            <div className="prose prose-lg max-w-none">
              <article className="markdown-body">
                {markdown}
              </article>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default StoryGenerator 