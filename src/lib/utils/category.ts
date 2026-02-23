export function categoryClass(label: string) {
  switch (label) {
    case '海外':
      return 'chip-overseas'
    case '国内':
      return 'chip-domestic'
    case 'テック':
      return 'chip-tech'
    case '開発':
      return 'chip-dev'
    case 'AI':
      return 'chip-ai'
    default:
      return 'chip-default'
  }
}
