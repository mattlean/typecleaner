import React, { useState } from 'react';

function App() {
  const [origTxtType, setOrigTxtType] = useState('plain')
  const [conversionType, setConversionType] = useState('plain')
  const [preventWidows, setPreventWidows] = useState(false)
  const [newLineTransform, setNewLineTransform] = useState('')
  const [spaceTransform, setSpaceTransform] = useState('')
  const [trim, setTrim] = useState(false)
  const [spellCheck, setSpellcheck] = useState(true)
  const [origTxt, setOrigTxt] = useState('')
  const [cleanTxt, setCleanTxt] = useState('')

  const clean = (txt) => {
    let newTxt = txt

    if(trim) {
      const paragraphs = newTxt.split('\n')
      for(const i in paragraphs) {
        paragraphs[i] = paragraphs[i].trim()
      }
      newTxt = paragraphs.join('\n')
    }

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
      }
    }

    if(newLineTransform === 'reduce') {
      newTxt = newTxt.replace(/\n+/g, '\n')
    } else if(newLineTransform === 'remove') {
      newTxt = newTxt.replace(/\n+/g, '')
    }

    if(spaceTransform === 'reduce') {
      newTxt = newTxt.replace(/ +/g, ' ')
    } else if(spaceTransform === 'remove') {
      newTxt = newTxt.replace(/ +/g, '')
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
          <h2>Original Text Type</h2>
          <select onChange={e => setOrigTxtType(e.target.value)}>
            <option value="plain">Plain</option>
            <option value="html">HTML Entities</option>
          </select>
        </section>
        <section>
          <h2>Conversion Type</h2>
          <select onChange={e => setConversionType(e.target.value)}>
            <option value="plain">Plain</option>
            <option value="html">HTML Entities</option>
          </select>
        </section>
        {conversionType === 'html' ? endings : null}
        <section>
          <h2>Spacing</h2>
          <label>
            New Lines
            <select onChange={e => setNewLineTransform(e.target.value)}>
              <option value="">None</option>
              <option value="reduce">Reduce multiple new lines</option>
              <option value="remove">Remove all new lines</option>
            </select>
          </label>
          <label>
            Spaces
            <select onChange={e => setSpaceTransform(e.target.value)}>
              <option value="">None</option>
              <option value="reduce">Reduce multiple spaces</option>
              <option value="remove">Remove all spaces</option>
            </select>
            <label>
              <input type="checkbox" checked={trim} onChange={(e) => setTrim(e.target.checked)} /> Trim whitespaces on paragraphs
            </label>
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
          <button onClick={() => {
            setOrigTxt(cleanTxt)
            setCleanTxt('')
          }}>Set Original Text to Cleaned Text</button>
          <button onClick={() => setCleanTxt(clean(origTxt))}>Clean</button>
        </section>
      </section>
      <h2 className="io">Original Text</h2>
      <textarea spellCheck={spellCheck} value={origTxt} onChange={(e) => setOrigTxt(e.target.value)}></textarea>
      <h2 className="io">Cleaned Text</h2>
      <textarea readOnly spellCheck={false} value={cleanTxt}></textarea>
    </main>
  );
}

export default App;
