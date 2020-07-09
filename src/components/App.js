import React, { useState } from 'react';

function App() {
  const [origTxtType, setOrigTxtType] = useState('plain')
  const [conversionType, setConversionType] = useState('plain')
  const [preventWidows, setPreventWidows] = useState(false)
  const [newlineTransform, setNewlineTransform] = useState('')
  const [spaceTransform, setSpaceTransform] = useState('')
  const [htmlTransform, setHTMLTransform] = useState('')
  const [trim, setTrim] = useState(false)
  const [spellCheck, setSpellcheck] = useState(true)
  const [origTxt, setOrigTxt] = useState('')
  const [cleanTxt, setCleanTxt] = useState('')

  const clean = (txt) => {
    let newTxt = txt

    if(trim) {
      // Trim whitespaces around paragraphs
      let paragraphs

      if(origTxtType === 'html') {
        paragraphs = newTxt.split('</p>')
      } else {
        paragraphs = newTxt.split('\n')
      }

      for(const i in paragraphs) {
        const p = paragraphs[i]
        if(p) {
          paragraphs[i] = paragraphs[i].trim()
        }
      }

      if(origTxtType === 'html') {
        newTxt = paragraphs.join('</p>')
        paragraphs = newTxt.split('<p>')

        for(const i in paragraphs) {
          const p = paragraphs[i]
          if(p) {
            paragraphs[i] = paragraphs[i].trim()
          }
        }
        newTxt = paragraphs.join('<p>')
      } else {
        newTxt = paragraphs.join('\n')
      }
    }

    if(conversionType === 'html') {
      if(preventWidows) {
        // Prevent widows
        const paragraphs = newTxt.split(/\n+/g)
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

    // Newlines
    if(newlineTransform === 'reduce') {
      // Reduce multiple newlines
      newTxt = newTxt.replace(/\n+/g, '\n')
    } else if(newlineTransform === 'remove') {
      // Remove all newlines
      newTxt = newTxt.replace(/\n+/g, '')
    }

    // Spaces
    if(spaceTransform === 'reduce') {
      // Reduce multiple spaces
      newTxt = newTxt.replace(/ +/g, ' ')
    } else if(spaceTransform === 'remove') {
      // Remove all spaces
      newTxt = newTxt.replace(/ +/g, '')
    }

    // HTML
    if(htmlTransform === 'single') {
      // Wrap paragraphs separated by single newlines with p tags
      const paragraphs = newTxt.split('\n')
      for(const i in paragraphs) {
        const p = paragraphs[i]
        if(p) {
          paragraphs[i] = `<p>${paragraphs[i]}</p>`
        }
      }
      newTxt = paragraphs.join('\n')
    } else if(htmlTransform === 'multiple') {
      // Wrap paragraphs separated by multiple newlines with p tags
      const paragraphs = newTxt.split(/\n{2,}/)
      for(const i in paragraphs) {
        const p = paragraphs[i]
        if(p) {
          paragraphs[i] = `<p>${paragraphs[i]}</p>`
        }
      }
      newTxt = paragraphs.join('\n')
    } else if(htmlTransform === 'remove') {
      // Remove all p tags
      newTxt = newTxt.replace(/(<p[^>]+?>|<p>|<\/p>)/img, '');
    }
  
    console.log(JSON.stringify(newTxt))
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

  let html
  if(origTxtType === 'html' || conversionType === 'html') {
    html = (
      <section>
        <h2>HTML</h2>
        <label>
          Paragraphs
          <select onChange={e => setHTMLTransform(e.target.value)}>
            <option value="">None</option>
            {conversionType === 'html' && <option value="single">Wrap paragraphs separated by single newlines with p tags</option>}
            {conversionType === 'html' && <option value="multiple">Wrap paragraphs separated by multiple newlines with p tags</option>}
            <option value="remove">Remove all p tags</option>
          </select>
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
            <option value="html">HTML</option>
          </select>
        </section>
        <section>
          <h2>Conversion Type</h2>
          <select onChange={e => setConversionType(e.target.value)}>
            <option value="plain">Plain</option>
            <option value="html">HTML</option>
          </select>
        </section>
        {conversionType === 'html' ? endings : null}
        <section>
          <h2>Spacing</h2>
          <label>
            Newlines
            <select onChange={e => setNewlineTransform(e.target.value)}>
              <option value="">None</option>
              <option value="reduce">Reduce multiple newlines</option>
              <option value="remove">Remove all newlines</option>
            </select>
          </label>
          <label>
            Spaces
            <select onChange={e => setSpaceTransform(e.target.value)}>
              <option value="">None</option>
              <option value="reduce">Reduce multiple spaces</option>
              <option value="remove">Remove all spaces</option>
            </select>
          </label>
          <label>
            <input type="checkbox" checked={trim} onChange={(e) => setTrim(e.target.checked)} /> Trim whitespaces around paragraphs
          </label>
        </section>
        {html}
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
