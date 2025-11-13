interface SectionHeaderProps {
  title: string
  subtitle?: string
  isEditing: boolean
  onEdit: () => void
  editLabel?: string
}

export default function SectionHeader({ 
  title, 
  subtitle, 
  isEditing, 
  onEdit, 
  editLabel = "Save & Update" 
}: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between py-2 mb-4">
      <div>
        <h3 className="text-white font-medium text-lg mb-1">{title}</h3>
        {!isEditing && subtitle && (
          <p className="text-slate-400 text-sm">{subtitle}</p>
        )}
      </div>
      <button 
        onClick={onEdit}
        className="text-slate-400 hover:text-white transition-colors"
      >
        {isEditing ? (
          <div className="flex items-center space-x-4">
            <span className="text-golden-400 text-sm">{editLabel}</span>
          </div>
        ) : (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
          </svg>
        )}
      </button>
    </div>
  )
}