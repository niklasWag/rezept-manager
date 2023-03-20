import { arraysEqual } from "../src/helpers"

describe('test array equal function', () => {
    it('Should return true if arrays are completely equal', () => {
        const arrA = ['1', '2', '3']
        const arrB = ['1', '2', '3']
        expect(arraysEqual(arrA, arrB)).toBe(true)
    })

    it('Should return true if arrays are equal regardless of order of items', () => {
        const arrA = ['1', '2', '3']
        const arrB = ['3', '2', '1']
        expect(arraysEqual(arrA, arrB)).toBe(true)
    })

    it('Should return false if arrays are not equal', () => {
        const arrA = ['1', '2', '3']
        const arrB = ['1', '2', '4']
        expect(arraysEqual(arrA, arrB)).toBe(false)
    })

    it('Should return false if arrays contain different item types', () => {
        const arrA = ['1', '2', '3']
        const arrB = [1, 2, 3]
        expect(arraysEqual(arrA, arrB)).toBe(false)
    })
})