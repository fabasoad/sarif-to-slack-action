import fs from 'fs'
import { processColor, processSarifPath } from '../Processors'

jest.mock('fs')
const mockedFs = fs as jest.Mocked<typeof fs>

describe('processColor', () => {
  it('returns correct hex for success', () => {
    expect(processColor('success')).toBe('#008000')
  })

  it('returns correct hex for failure', () => {
    expect(processColor('failure')).toBe('#ff0000')
  })

  it('returns correct hex for cancelled', () => {
    expect(processColor('cancelled')).toBe('#0047AB')
  })

  it('returns correct hex for skipped', () => {
    expect(processColor('skipped')).toBe('#808080')
  })

  it('returns input for unknown color', () => {
    expect(processColor('other')).toBe('other')
  })

  it('returns undefined for undefined input', () => {
    expect(processColor(undefined)).toBeUndefined()
  })
})

describe('processSarifPath', () => {
  const fakeDir = '/fake/dir'
  const fakeFile = '/fake/file.sarif'

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('throws if path does not exist', () => {
    mockedFs.existsSync.mockReturnValue(false)
    expect(() => processSarifPath(fakeFile)).toThrow(/does not exist/)
  })

  it('returns .sarif files in directory', () => {
    mockedFs.existsSync.mockReturnValue(true)
    mockedFs.statSync.mockReturnValue({ isDirectory: () => true, isFile: () => false } as any)
    // @ts-ignore: mocking readdirSync with a specific return value
    mockedFs.readdirSync.mockReturnValue(['a.sarif', 'b.SARIF', 'c.txt'])
    const result: string[] = processSarifPath(fakeDir)
    expect(result).toEqual(['a.sarif', 'b.SARIF'])
  })

  it('returns file path if it is a file', () => {
    mockedFs.existsSync.mockReturnValue(true)
    mockedFs.statSync.mockReturnValue({ isDirectory: () => false, isFile: () => true } as any)
    const result: string[] = processSarifPath(fakeFile)
    expect(result).toHaveLength(1)
    expect(result[0]).toEqual(fakeFile)
  })

  it('throws if path is neither file nor directory', () => {
    mockedFs.existsSync.mockReturnValue(true)
    mockedFs.statSync.mockReturnValue({ isDirectory: () => false, isFile: () => false } as any)
    expect(() => processSarifPath('/weird/path')).toThrow(/neither a file nor a directory/)
  })
})
