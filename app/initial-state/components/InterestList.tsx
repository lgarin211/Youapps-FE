interface InterestListProps {
  interests: string[]
}

export default function InterestList({ interests }: InterestListProps) {
  if (interests.length === 0) {
    return <p className="text-slate-400 text-sm">No interests added yet</p>
  }

  return (
    <div className="flex flex-wrap gap-2">
      {interests.map((interest, index) => (
        <div key={index} className="bg-slate-700 rounded-full px-3 py-1">
          <span className="text-white text-sm">{interest}</span>
        </div>
      ))}
    </div>
  )
}