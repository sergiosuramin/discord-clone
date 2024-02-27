export function getInitials(name: string): string {
  if (name.trim() === '') {
    return '' // Return empty string for an empty name
  }

  const words = name.split(' ')

  if (words.length === 1) {
    return words[0].charAt(0)
  } else if (words.length === 2) {
    return words[0].charAt(0) + words[1].charAt(0)
  } else {
    // Case: more than 2 words
    return words[0].charAt(0) + words[words.length - 1].charAt(0)
  }
}
