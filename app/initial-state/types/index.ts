export interface UserData {
  username: string
  bio: string
  displayName: string
  gender: string
  birthday: string
  horoscope: string
  zodiac: string
  height: string
  weight: string
  profileImage: File | null
}

export interface TempAboutData {
  displayName: string
  gender: string
  birthday: string
  horoscope: string
  zodiac: string
  height: string
  weight: string
}