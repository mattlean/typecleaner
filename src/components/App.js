import React, { useState } from 'react';

function App() {
  const [conversionType, setConversionType] = useState('plain')
  const [preventWidows, setPreventWidows] = useState(false)
  const [newLineTransform, setNewLineTransform] = useState('')
  const [spellCheck, setSpellcheck] = useState(true)
  const [origTxt, setOrigTxt] = useState('')
  const [cleanTxt, setCleanTxt] = useState('')

  const clean = (txt) => {
    let newTxt = txt

    if(conversionType === 'html') {
      if(preventWidows) {
        const paragraphs = newTxt.split('\n')
        const words = []
  
        for(const i in paragraphs) {
          const p = paragraphs[i]
          if(p) {
            words.push(p.split(' '))
          }
        }
  
        for(const i in words) {
          const w = words[i]
          if(w.length > 1) {
            const lastWord = w.pop()
            console.log(w[w.length-1] + '&nbsp;' + lastWord)
            w[w.length-1] = w[w.length-1] + '&nbsp;' + lastWord // Insert non-breaking space
          }
  
          words[i] = w.join(' ')
        }
  
        for(const i in paragraphs) {
          const p = paragraphs[i]
          if(p) {
            const t = words.shift()
            paragraphs[i] = t
          }
        }
  
        newTxt = paragraphs.join('\n')
        console.log(newTxt)
      }
    }

    if(newLineTransform === 'reduce') {
      newTxt = txt.replace(/\n+/g, '\n')
    } else if(newLineTransform === 'remove') {
      newTxt = txt.replace(/\n+/g, '')
    }
  
    return newTxt
  }

  let endings
  
  if(conversionType === 'html') {
    endings = (
      <section>
        <h2>Endings</h2>
        <label>
          <input type="checkbox" checked={preventWidows} onChange={e => setPreventWidows(e.target.checked)}  /> Prevent Widows
        </label>
      </section>
    )
  }

  return (
    <main className="grid">
      <h1>Type Cleaner</h1>
      <section id="ops">
        <section>
          <h2>Conversion Type</h2>
          <select onChange={e => setConversionType(e.target.value)}>
            <option value="plain">Plain</option>
            <option value="html">HTML Entities</option>
          </select>
        </section>
        {conversionType === 'html' ? endings : null}
        <section>
          <h2>New Lines</h2>
          <label>
            Transform Method
            <select onChange={e => setNewLineTransform(e.target.value)}>
              <option value="">None</option>
              <option value="reduce">Reduce multiple new lines</option>
              <option value="remove">Remove new lines</option>
            </select>
          </label>
        </section>
        <section>
          <h2>Miscellaneous</h2>
          <label>
            <input type="checkbox" checked={spellCheck} onChange={(e) => setSpellcheck(e.target.checked)} /> Spell Check
          </label>
        </section>
        <section>
          <h2>Modify Text Areas</h2>
          <button onClick={() => {setOrigTxt(cleanTxt)}}>Set Original Text to Cleaned Text</button>
          <button onClick={() => {setCleanTxt(clean(origTxt))}}>Clean</button>
        </section>
      </section>
      <h2>Original Text</h2>
      <textarea spellCheck={spellCheck} value={origTxt} onChange={(e) => setOrigTxt(e.target.value)}></textarea>
      <h2>Cleaned Text</h2>
      <textarea readOnly spellCheck={false} value={cleanTxt}></textarea>
    </main>
  );
}

export default App;
