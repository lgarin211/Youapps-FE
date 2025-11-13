'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Header from './components/Header'
import ProfileImage from './components/ProfileImage'
import SimpleProfile from './components/SimpleProfile'
import BioSection from './components/BioSection'
import AboutForm from './components/AboutForm'
import AboutDisplay from './components/AboutDisplay'
import InterestList from './components/InterestList'
import InterestModal from './components/InterestModal'
import SectionHeader from './components/SectionHeader'
import { calculateHoroscope, calculateZodiac, formatDate } from './utils'
import { useAuthContext, useProfile } from '../../hooks'
import type { UserData, TempAboutData } from './types'

export default function InitialStatePage() {
  const router = useRouter()
  const { isAuthenticated, user, isLoading: authLoading } = useAuthContext()
  const { 
    profile, 
    isLoading: profileLoading, 
    error, 
    createProfile, 
    updateProfile, 
    hasProfile,
    setError 
  } = useProfile()

  // Local state for UI management
  const [isEditingBio, setIsEditingBio] = useState<boolean>(false)
  const [isEditingAbout, setIsEditingAbout] = useState<boolean>(false)
  const [isEditingInterest, setIsEditingInterest] = useState<boolean>(false)
  const [tempBio, setTempBio] = useState<string>('')
  const [interests, setInterests] = useState<string[]>([])
  const [newInterest, setNewInterest] = useState<string>('')
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  
  // Profile data state
  const [userData, setUserData] = useState<UserData>({
    username: user?.username || '',
    bio: '',
    displayName: '',
    gender: '',
    birthday: '',
    horoscope: '',
    zodiac: '',
    height: '',
    weight: '',
    profileImage: null
  })

  const [tempAboutData, setTempAboutData] = useState<TempAboutData>({
    displayName: '',
    gender: '',
    birthday: '',
    horoscope: '',
    zodiac: '',
    height: '',
    weight: ''
  })

  // Check authentication
  useEffect(() => {
    if (!isAuthenticated && !authLoading) {
      router.push('/login')
    }
  }, [isAuthenticated, authLoading, router])

  // Update local state when profile data changes
  useEffect(() => {
    if (profile && hasProfile) {
      const formattedBirthday = profile.birthday ? formatDate.toDisplay(profile.birthday) : ''
      
      setUserData(prev => ({
        ...prev,
        displayName: profile.name || '',
        birthday: formattedBirthday,
        height: profile.height ? `${profile.height} cm` : '',
        weight: profile.weight ? `${profile.weight} kg` : '',
        horoscope: profile.birthday ? calculateHoroscope(profile.birthday) : '',
        zodiac: profile.birthday ? calculateZodiac(profile.birthday) : ''
      }))
      setInterests(profile.interests || [])
      setTempBio('')
    }
  }, [profile, hasProfile])

  // Handle bio editing
  const handleBioEdit = async () => {
    if (isEditingBio) {
      // Save bio
      if (hasProfile) {
        const result = await updateProfile({ name: userData.displayName })
        if (!result.success) {
          console.error('Failed to update bio:', result.error)
        }
      }
    } else {
      setTempBio('')
    }
    setIsEditingBio(!isEditingBio)
  }

  const handleBioCancel = () => {
    setTempBio('')
    setIsEditingBio(false)
  }

  // Prepare about data for editing
  const prepareAboutData = () => ({
    displayName: userData.displayName,
    gender: userData.gender,
    birthday: profile?.birthday || '',
    horoscope: userData.horoscope,
    zodiac: userData.zodiac,
    height: profile?.height?.toString() || '',
    weight: profile?.weight?.toString() || ''
  })

  // Handle about section editing
  const handleAboutEdit = async () => {
    if (isEditingAbout) {
      // Save about data
      const profileData = {
        name: tempAboutData.displayName,
        birthday: tempAboutData.birthday,
        height: parseInt(tempAboutData.height) || 0,
        weight: parseInt(tempAboutData.weight) || 0,
        interests: interests
      }

      let result
      if (hasProfile) {
        result = await updateProfile(profileData)
      } else {
        result = await createProfile(profileData)
      }

      if (!result.success) {
        console.error('Failed to save profile:', result.error)
        return
      }
    } else {
      setTempAboutData(prepareAboutData())
    }
    setIsEditingAbout(!isEditingAbout)
  }

  const handleAboutCancel = () => {
    setTempAboutData(prepareAboutData())
    setIsEditingAbout(false)
  }

  const handleAboutChange = (field: string, value: string) => {
    const updatedData = { ...tempAboutData, [field]: value }
    
    if (field === 'birthday') {
      updatedData.horoscope = calculateHoroscope(value)
      updatedData.zodiac = calculateZodiac(value)
    }

    setTempAboutData(updatedData)
  }

  // Handle image selection
  const handleImageSelect = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        setSelectedImage(file)
        // TODO: Implement image upload to server
      }
    }
    input.click()
  }

  // Handle interests editing
  const handleInterestEdit = async () => {
    if (isEditingInterest) {
      // Save interests
      let result
      if (hasProfile) {
        result = await updateProfile({ interests })
      } else {
        // If no profile exists, create one with minimal data
        result = await createProfile({
          name: user?.username || '',
          birthday: '',
          height: 0,
          weight: 0,
          interests
        })
      }

      if (!result.success) {
        console.error('Failed to save interests:', result.error)
        return
      }
    }
    
    setIsEditingInterest(!isEditingInterest)
    setNewInterest('')
  }

  const handleInterestCancel = () => {
    // Reset interests to original state
    if (profile) {
      setInterests(profile.interests || [])
    }
    setIsEditingInterest(false)
    setNewInterest('')
  }

  const handleAddInterest = () => {
    const trimmed = newInterest.trim()
    if (trimmed && !interests.includes(trimmed)) {
      setInterests([...interests, trimmed])
      setNewInterest('')
    }
  }

  const handleRemoveInterest = (interestToRemove: string) => {
    setInterests(prev => prev.filter(interest => interest !== interestToRemove))
  }

  // Loading state - show loading if auth is loading or profile is loading
  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen text-white flex items-center justify-center" style={{backgroundImage: 'url(/BGp.png)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat'}}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>{authLoading ? 'Checking authentication...' : 'Loading profile...'}</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen text-white flex items-center justify-center" style={{backgroundImage: 'url(/BGp.png)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat'}}>
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button 
            onClick={() => setError(null)}
            className="bg-blue-600 px-4 py-2 rounded-lg"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="min-h-screen text-white" style={{backgroundImage: 'url(/BGp.png)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat'}}>
        <Header />

        <div className="px-6 mt-8">
          {/* Profile Section */}
          {hasProfile && profile ? (
            <ProfileImage 
              selectedImage={selectedImage}
              userData={{
                ...userData,
                username: user?.username || '',
                birthday: profile.birthday || ''
              }}
              onEditClick={() => setIsEditingBio(!isEditingBio)}
            />
          ) : (
            <SimpleProfile onEditClick={() => setIsEditingBio(!isEditingBio)} />
          )}

          {/* Bio Section */}
          <BioSection 
            isEditing={isEditingBio}
            bio={userData.displayName || 'Tell others about yourself'}
            tempBio={tempBio}
            onTempBioChange={setTempBio}
            onEdit={handleBioEdit}
            onCancel={handleBioCancel}
          />

          {/* About Section */}
          <div className="mb-8">
            <SectionHeader 
              title="About"
              subtitle="Add in your details to help others know you better"
              isEditing={isEditingAbout}
              onEdit={handleAboutEdit}
            />

            {isEditingAbout ? (
              <AboutForm 
                tempAboutData={tempAboutData}
                selectedImage={selectedImage}
                onImageSelect={handleImageSelect}
                onFieldChange={handleAboutChange}
                onCancel={handleAboutCancel}
              />
            ) : (
              <AboutDisplay userData={userData} />
            )}
          </div>

          {/* Interest Section */}
          <div className="mb-12">
            <SectionHeader 
              title="Interest"
              subtitle="Add in your interests to find a better match"
              isEditing={isEditingInterest}
              onEdit={handleInterestEdit}
              editLabel="Save"
            />

            <div className="space-y-3">
              <InterestList interests={interests} />
            </div>
          </div>
        </div>

        {/* Interest Modal */}
        {isEditingInterest && (
          <InterestModal 
            interests={interests}
            newInterest={newInterest}
            onNewInterestChange={setNewInterest}
            onAddInterest={handleAddInterest}
            onRemoveInterest={handleRemoveInterest}
            onCancel={handleInterestCancel}
            onSave={handleInterestEdit}
          />
        )}
      </div>
    </>
  )
}