import testFileType from '../testFileType'

describe('Tests for the test file type function', ()=>{
  test('Test against a PNG', ()=>{
    expect(testFileType({name:'image',type:'image/png'})).toBe(false)
  })

  test('Test a file name with "html" in the name', ()=>{
    expect(testFileType({name:'html.html',type:'image/png'})).toBe(false)
  })
})
