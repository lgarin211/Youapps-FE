interface BioSectionProps {
  isEditing: boolean
  bio: string
  tempBio: string
  onTempBioChange: (value: string) => void
  onEdit: () => void
  onCancel: () => void
}

export default function BioSection({ 
  isEditing, 
  bio, 
  tempBio, 
  onTempBioChange, 
  onEdit, 
  onCancel 
}: BioSectionProps) {
  if (isEditing) {
    return (
      <div className="space-y-4 mb-12">
        <textarea
          value={tempBio}
          onChange={(e) => onTempBioChange(e.target.value)}
          className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:border-blue-400 focus:outline-none resize-none"
          rows={4}
          placeholder="Tell something about yourself..."
        />
        <div className="flex space-x-3">
          <button
            onClick={onEdit}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Save
          </button>
          <button
            onClick={onCancel}
            className="border border-slate-600 text-white px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    )
  }

  if (bio) {
    return <p className="text-slate-300 leading-relaxed mb-12">{bio}</p>
  }

  return <div className="mb-12"></div>
}