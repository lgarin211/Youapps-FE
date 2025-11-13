interface InterestModalProps {
  interests: string[]
  newInterest: string
  onNewInterestChange: (value: string) => void
  onAddInterest: () => void
  onRemoveInterest: (interest: string) => void
  onCancel: () => void
  onSave: () => void
}

export default function InterestModal({
  interests,
  newInterest,
  onNewInterestChange,
  onAddInterest,
  onRemoveInterest,
  onCancel,
  onSave
}: InterestModalProps) {
  return (
    <div className="fixed inset-0 bg-gradient-to-b from-slate-800 via-blue-800 to-blue-900 z-50 flex flex-col">

      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4">
        <button onClick={onCancel} className="flex items-center">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          <span className="text-white ml-2 text-sm">Back</span>
        </button>
        <button onClick={onSave} className="text-blue-400 text-sm font-medium">
          Save
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 px-6">
        {/* Header text */}
        <div className="text-center mb-8">
          <p className="text-slate-300 text-sm mb-2">Tell everyone about yourself</p>
          <h2 className="text-white text-xl font-semibold">What interest you?</h2>
        </div>

        {/* Current interests with remove functionality */}
        <div className="flex flex-wrap gap-3 mb-6">
          {interests.map((interest, index) => (
            <div key={index} className="bg-slate-700/50 rounded-full px-4 py-2 flex items-center space-x-2">
              <span className="text-white text-sm">{interest}</span>
              <button
                onClick={() => onRemoveInterest(interest)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>

        {/* New interest input */}
        <div className="mb-6">
          <input
            type="text"
            value={newInterest}
            onChange={(e) => onNewInterestChange(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && onAddInterest()}
            className="w-full bg-slate-700/30 border border-slate-600 text-white px-4 py-3 rounded-lg focus:border-blue-400 focus:outline-none text-sm placeholder-slate-400"
            placeholder="Type new interest and press Enter..."
          />
        </div>

        {/* Add Interest Button */}
        <button
          onClick={onAddInterest}
          disabled={!newInterest.trim()}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-slate-600 disabled:to-slate-700 disabled:cursor-not-allowed text-white py-3 rounded-lg text-sm font-medium transition-colors"
        >
          Add Interest
        </button>
      </div>
    </div>
  )
}