interface AboutDisplayProps {
  userData: {
    displayName: string
    birthday: string
    horoscope: string
    zodiac: string
    height: string
    weight: string
  }
}

export default function AboutDisplay({ userData }: AboutDisplayProps) {
  // Calculate age from birthday
  const calculateAge = (birthday: string) => {
    if (!birthday) return 0
    const birthDate = new Date(birthday)
    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age
  }

  // Check if we have any meaningful data to display
  const hasAnyData = userData.birthday || userData.height || userData.weight || userData.horoscope || userData.zodiac
  
  if (!hasAnyData) {
    return (
      <div className="bg-slate-800/30 rounded-lg p-4 text-center">
        <p className="text-slate-400 text-sm">Add your details to help others know you better</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="bg-slate-800/50 rounded-lg p-4 space-y-3">
        {userData.birthday && (
          <div className="flex justify-between items-center">
            <span className="text-slate-400 text-sm">Birthday:</span>
            <span className="text-white text-sm">{userData.birthday} (Age {calculateAge(userData.birthday)})</span>
          </div>
        )}
        {userData.horoscope && (
          <div className="flex justify-between items-center">
            <span className="text-slate-400 text-sm">Horoscope:</span>
            <span className="text-white text-sm">{userData.horoscope}</span>
          </div>
        )}
        {userData.zodiac && (
          <div className="flex justify-between items-center">
            <span className="text-slate-400 text-sm">Zodiac:</span>
            <span className="text-white text-sm">{userData.zodiac}</span>
          </div>
        )}
        {userData.height && (
          <div className="flex justify-between items-center">
            <span className="text-slate-400 text-sm">Height:</span>
            <span className="text-white text-sm">{userData.height}</span>
          </div>
        )}
        {userData.weight && (
          <div className="flex justify-between items-center">
            <span className="text-slate-400 text-sm">Weight:</span>
            <span className="text-white text-sm">{userData.weight}</span>
          </div>
        )}
      </div>
    </div>
  )
}