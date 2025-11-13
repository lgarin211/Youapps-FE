interface ProfileImageProps {
  selectedImage: File | null
  userData: {
    username: string
    displayName: string
    gender: string
    birthday: string
    horoscope: string
    zodiac: string
  }
  onEditClick: () => void
}

export default function ProfileImage({ selectedImage, userData, onEditClick }: ProfileImageProps) {
  return (
    <div className="mb-8">
      <div className="relative h-64 bg-cover bg-center rounded-lg overflow-hidden" style={{
        backgroundImage: selectedImage 
          ? `url(${URL.createObjectURL(selectedImage)})`
          : "url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 400 200\"><defs><pattern id=\"rocks\" patternUnits=\"userSpaceOnUse\" width=\"100\" height=\"100\"><rect width=\"100\" height=\"100\" fill=\"%23374151\"/><circle cx=\"20\" cy=\"30\" r=\"8\" fill=\"%23475569\"/><circle cx=\"70\" cy=\"60\" r=\"12\" fill=\"%23475569\"/><circle cx=\"40\" cy=\"80\" r=\"6\" fill=\"%23475569\"/></pattern></defs><rect width=\"400\" height=\"200\" fill=\"url(%23rocks)\"/></svg>')"
      }}>
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
        
        {/* Profile Content at Bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="flex items-end justify-between">
            <div className="flex items-end space-x-4">
              {/* Name and Gender */}
              <div>
                <h1 className="text-2xl font-semibold text-white">
                  @{userData.username || 'user'}, {userData.birthday ? new Date().getFullYear() - new Date(userData.birthday).getFullYear() : 0}
                </h1>
                <p className="text-white/80 text-sm">{userData.gender || 'Male'}</p>
              </div>
            </div>
            
            {/* Edit Button */}
            <button 
              onClick={onEditClick}
              className="text-white/80 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
              </svg>
            </button>
          </div>
          
          {/* Zodiac and Horoscope badges */}
          <div className="flex space-x-3 mt-4">
            <div className="flex items-center bg-black/30 backdrop-blur-sm rounded-full px-3 py-1.5">
              <span className="text-white text-sm">♍ {userData.horoscope}</span>
            </div>
            <div className="flex items-center bg-black/30 backdrop-blur-sm rounded-full px-3 py-1.5">
              <span className="text-white text-sm">🐷 {userData.zodiac}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}