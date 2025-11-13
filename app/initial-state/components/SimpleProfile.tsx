interface SimpleProfileProps {
  onEditClick: () => void
}

export default function SimpleProfile({ onEditClick }: SimpleProfileProps) {
  return (
    <div className="flex items-center justify-between mb-12">
      <div>
        <h1 className="text-2xl font-normal text-white">@johndoe123,</h1>
      </div>
      <button 
        onClick={onEditClick}
        className="text-slate-300 hover:text-white transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
        </svg>
      </button>
    </div>
  )
}