import { useState } from 'react'

function App() {
  const [question, setQuestion] = useState('')
  const [options, setOptions] = useState(['', ''])
  const [factors, setFactors] = useState([])
  const [currentFactor, setCurrentFactor] = useState('')
  const [scores, setScores] = useState({})

  const addFactor = () => {
    if (currentFactor.trim() && factors.length < 5) {
      setFactors([...factors, currentFactor.trim()])
      setCurrentFactor('')
    }
  }

  const updateScore = (factor, option, value) => {
    setScores(prev => ({
      ...prev,
      [`${factor}-${option}`]: parseInt(value)
    }))
  }

  const getWeightedScore = (option) => {
    return factors.reduce((total, factor, index) => {
      const importance = 5 - index
      const score = scores[`${factor}-${option}`] || 0
      return total + (importance * score)
    }, 0)
  }

  const maxScore = factors.reduce((total, _, index) => total + (5 - index) * 5, 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-2xl p-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
          Decision Maker
        </h1>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">What's your decision?</label>
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="e.g., Should I take Job A or Job B?"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Enter your options</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                value={options[0]}
                onChange={(e) => setOptions([e.target.value, options[1]])}
                placeholder="Option A"
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
              />
              <input
                type="text"
                value={options[1]}
                onChange={(e) => setOptions([options[0], e.target.value])}
                placeholder="Option B"
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Factors (top 5, ranked by importance)</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={currentFactor}
                onChange={(e) => setCurrentFactor(e.target.value)}
                placeholder="e.g., Salary"
                onKeyPress={(e) => e.key === 'Enter' && addFactor()}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
              />
              <button 
                onClick={addFactor} 
                disabled={factors.length >= 5}
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
              >
                Add ({factors.length}/5)
              </button>
            </div>
            <div className="mt-3 space-y-2">
              {factors.map((factor, i) => (
                <div key={i} className="flex justify-between items-center bg-indigo-50 px-4 py-2 rounded-lg">
                  <span className="font-medium text-gray-800">{i + 1}. {factor}</span>
                  <span className="text-xs font-semibold text-indigo-600 bg-indigo-100 px-2 py-1 rounded-full">Importance: {5 - i}</span>
                </div>
              ))}
            </div>
          </div>

          {factors.length > 0 && options[0] && options[1] && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-4">Score each factor (1-5)</label>
                <div className="space-y-4">
                  {factors.map((factor, fIndex) => (
                    <div key={fIndex} className="bg-gray-50 p-4 rounded-lg">
                      <div className="font-medium text-gray-800 mb-3">Factor {fIndex + 1}: {factor}</div>
                      <div className="space-y-2">
                        {options.map((option, oIndex) => (
                          <div key={oIndex} className="flex items-center gap-4">
                            <span className="w-1/2 font-medium text-sm text-gray-600">{options[oIndex] || `Option ${oIndex + 1}`}</span>
                            <input
                              type="range"
                              min="1"
                              max="5"
                              value={scores[`${factor}-${option}`] || 1}
                              onChange={(e) => updateScore(factor, option, e.target.value)}
                              className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                            />
                            <span className="w-8 text-center font-bold text-indigo-600">{scores[`${factor}-${option}`] || 1}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Live Results</h2>
                <p className="text-sm text-gray-600 mb-4">Max possible score: {maxScore}</p>
                <div className="space-y-4">
                  {options.map((option, i) => {
                    const score = getWeightedScore(option)
                    const percentage = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0
                    return (
                      <div key={i} className="bg-white p-4 rounded-lg shadow-sm">
                        <h4 className="font-semibold text-gray-800 mb-2">{option || `Option ${i + 1}`}</h4>
                        <div className="h-4 bg-gray-200 rounded-full overflow-hidden mb-2">
                          <div 
                            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="font-bold text-indigo-600">{score} pts</span>
                          <span className="text-gray-600">{percentage}%</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App