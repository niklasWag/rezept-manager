export function arraysEqual(a: any[], b: any[]): boolean {
  const bSorted = b.slice().sort()
  return (a.length === b.length && a.slice().sort().every((val, index) => {
    return val === bSorted[index]
  }))
}