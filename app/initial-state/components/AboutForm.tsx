interface AboutFormProps {
  tempAboutData: {
    displayName: string
    gender: string
    birthday: string
    horoscope: string
    zodiac: string
    height: string
    weight: string
  }
  selectedImage: File | null
  onImageSelect: () => void
  onFieldChange: (field: string, value: string) => void
  onCancel: () => void
}

export default function AboutForm({ 
  tempAboutData, 
  selectedImage, 
  onImageSelect, 
  onFieldChange, 
  onCancel 
}: AboutFormProps) {
  return (
    <div className="space-y-4">
      {/* Add image */}
      <div className="flex items-center space-x-4">
        <button 
          onClick={onImageSelect}
          className="w-12 h-12 bg-slate-700 rounded-lg flex items-center justify-center hover:bg-slate-600 transition-colors"
        >
          <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </button>
        <span className="text-slate-400 text-sm">
          {selectedImage ? selectedImage.name : 'Add image'}
        </span>
      </div>

      {/* Display name */}
      <div className="flex items-center justify-between">
        <span className="text-slate-400 text-sm w-24">Display name:</span>
        <input
          type="text"
          value={tempAboutData.displayName}
          onChange={(e) => onFieldChange('displayName', e.target.value)}
          className="bg-transparent border-b border-slate-600 text-white text-right text-sm py-1 px-2 focus:border-blue-400 focus:outline-none flex-1 ml-4"
          placeholder="Enter name"
        />
      </div>

      {/* Gender */}
      <div className="flex items-center justify-between">
        <span className="text-slate-400 text-sm w-24">Gender:</span>
        <select
          value={tempAboutData.gender}
          onChange={(e) => onFieldChange('gender', e.target.value)}
          className="bg-slate-700 border border-slate-600 text-white text-right text-sm py-1 px-2 rounded focus:border-blue-400 focus:outline-none flex-1 ml-4"
        >
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
      </div>

      {/* Birthday */}
      <div className="flex items-center justify-between">
        <span className="text-slate-400 text-sm w-24">Birthday:</span>
        <input
          type="date"
          value={tempAboutData.birthday}
          onChange={(e) => onFieldChange('birthday', e.target.value)}
          className="bg-slate-700 border border-slate-600 text-white text-right text-sm py-1 px-2 rounded focus:border-blue-400 focus:outline-none flex-1 ml-4"
        />
      </div>

      {/* Horoscope */}
      <div className="flex items-center justify-between">
        <span className="text-slate-400 text-sm w-24">Horoscope:</span>
        <input
          type="text"
          value={tempAboutData.horoscope}
          readOnly
          className="bg-slate-800 border-b border-slate-600 text-white text-right text-sm py-1 px-2 flex-1 ml-4 cursor-not-allowed"
          placeholder="--"
        />
      </div>

      {/* Zodiac */}
      <div className="flex items-center justify-between">
        <span className="text-slate-400 text-sm w-24">Zodiac:</span>
        <input
          type="text"
          value={tempAboutData.zodiac}
          readOnly
          className="bg-slate-800 border-b border-slate-600 text-white text-right text-sm py-1 px-2 flex-1 ml-4 cursor-not-allowed"
          placeholder="--"
        />
      </div>

      {/* Height */}
      <div className="flex items-center justify-between">
        <span className="text-slate-400 text-sm w-24">Height:</span>
        <div className="flex items-center flex-1 ml-4">
          <input
            type="number"
            value={tempAboutData.height}
            onChange={(e) => onFieldChange('height', e.target.value)}
            className="bg-transparent border-b border-slate-600 text-white text-right text-sm py-1 px-2 focus:border-blue-400 focus:outline-none flex-1"
            placeholder="0"
            min="0"
            max="300"
          />
          <span className="text-slate-400 text-sm ml-2">cm</span>
        </div>
      </div>

      {/* Weight */}
      <div className="flex items-center justify-between">
        <span className="text-slate-400 text-sm w-24">Weight:</span>
        <div className="flex items-center flex-1 ml-4">
          <input
            type="number"
            value={tempAboutData.weight}
            onChange={(e) => onFieldChange('weight', e.target.value)}
            className="bg-transparent border-b border-slate-600 text-white text-right text-sm py-1 px-2 focus:border-blue-400 focus:outline-none flex-1"
            placeholder="0"
            min="0"
            max="500"
          />
          <span className="text-slate-400 text-sm ml-2">kg</span>
        </div>
      </div>

      {/* Cancel button */}
      <div className="flex justify-end mt-6">
        <button
          onClick={onCancel}
          className="text-slate-400 hover:text-white transition-colors text-sm"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}