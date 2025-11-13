// Utility functions for the Initial State page

// Function to calculate horoscope based on date
export const calculateHoroscope = (dateString: string) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  if (isNaN(date.getTime())) return ''
  const month = date.getMonth() + 1
  const day = date.getDate()

  const starts = [
    { m: 1, d: 20, name: 'Aquarius' },
    { m: 2, d: 19, name: 'Pisces' },
    { m: 3, d: 21, name: 'Aries' },
    { m: 4, d: 20, name: 'Taurus' },
    { m: 5, d: 21, name: 'Gemini' },
    { m: 6, d: 22, name: 'Cancer' },
    { m: 7, d: 23, name: 'Leo' },
    { m: 8, d: 23, name: 'Virgo' },
    { m: 9, d: 23, name: 'Libra' },
    { m: 10, d: 24, name: 'Scorpio' },
    { m: 11, d: 22, name: 'Sagittarius' },
    { m: 12, d: 22, name: 'Capricorn' }
  ]

  // Find latest start date that is <= given date
  for (let i = starts.length - 1; i >= 0; i--) {
    const s = starts[i]
    if (month > s.m || (month === s.m && day >= s.d)) return s.name
  }

  // If none matched (i.e. date before Jan 20) it's Capricorn
  return 'Capricorn'
}

// Simplified Chinese zodiac calculation
export const calculateZodiac = (dateString: string) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  const year = date.getFullYear();
  
  // Simplified zodiac calculation (approximate)
  const animals = ['Rat', 'Ox', 'Tiger', 'Rabbit', 'Dragon', 'Snake', 'Horse', 'Goat', 'Monkey', 'Rooster', 'Dog', 'Pig'];
  const baseYear = 1900; // Year of Rat
  const index = (year - baseYear) % 12;
  
  return animals[index];
};

// Function to calculate age from birthday string
export const calculateAge = (birthday: string) => {
  if (!birthday) return 0;
  
  let birthDate: Date;
  
  // Handle different date formats
  if (birthday.includes('/')) {
    // Format: DD / MM / YYYY or DD/MM/YYYY
    const cleanBirthday = birthday.replace(/\s/g, ''); // Remove spaces
    const parts = cleanBirthday.split('/');
    if (parts.length === 3) {
      // Convert DD/MM/YYYY to YYYY-MM-DD for proper Date parsing
      birthDate = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
    } else {
      return 0;
    }
  } else {
    // Assume ISO format YYYY-MM-DD
    birthDate = new Date(birthday);
  }
  
  if (isNaN(birthDate.getTime())) {
    return 0;
  }
  
  const today = new Date();
  const age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  // Adjust age if birthday hasn't occurred this year yet
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    return age - 1;
  }
  
  return age;
};

// Date formatting utilities
export const formatDate = {
  toInput: (dateString: string) => {
    if (!dateString) return '';
    const parts = dateString.split(' ');
    return parts.length === 3 ? `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}` : dateString;
  },
  toDisplay: (dateString: string) => {
    if (!dateString) return '';
    // Handle both YYYY-MM-DD and DD/MM/YYYY formats
    if (dateString.includes('-')) {
      const parts = dateString.split('-');
      if (parts.length === 3) {
        const date = new Date(dateString);
        return `${date.getDate().toString().padStart(2, '0')} / ${(date.getMonth() + 1).toString().padStart(2, '0')} / ${date.getFullYear()}`;
      }
    }
    return dateString;
  }
};