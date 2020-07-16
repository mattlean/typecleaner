import React, { useEffect, useState } from 'react'
import { decode, encode } from 'he'

function App() {
  const [origTxtType, setOrigTxtType] = useState('plain')
  const [conversionType, setConversionType] = useState('plain')
  const [preventWidows, setPreventWidows] = useState(false)
  const [newlineTransform, setNewlineTransform] = useState('')
  const [spaceTransform, setSpaceTransform] = useState('')
  const [swapPTagNewlinesSpaces, setSwapPTagNewlinesSpaces] = useState(false)
  const [pTagTransform, setPTagTransform] = useState('')
  const [htmlEntities, setHTMLEntities] = useState('')
  const [trim, setTrim] = useState(false)
  const [spellCheck, setSpellcheck] = useState(true)
  const [origTxt, setOrigTxt] = useState('')
  const [cleanTxt, setCleanTxt] = useState('')
  const [autoClean, setAutoClean] = useState(true)

  const clean = () => {
    let newTxt = origTxt

    // Replace newlines in p tags with spaces
    // when original text type is HTML and conversion type is plain
    if (
      swapPTagNewlinesSpaces &&
      origTxtType === 'html' &&
      conversionType === 'plain'
    ) {
      const paragraphs = newTxt.split('</p>')
      for (const i in paragraphs) {
        const p = paragraphs[i]
        if (p) {
          paragraphs[i] = paragraphs[i].replace(/\n+/g, ' ')
        }
        newTxt = paragraphs.join('</p>')
      }
    }

    if (trim) {
      // Trim whitespaces around paragraphs
      let paragraphs

      if (origTxtType === 'html') {
        paragraphs = newTxt.split('</p>')
      } else {
        paragraphs = newTxt.split('\n')
      }

      for (const i in paragraphs) {
        const p = paragraphs[i]
        if (p) {
          paragraphs[i] = paragraphs[i].trim()
        }
      }

      if (origTxtType === 'html') {
        newTxt = paragraphs.join('</p>')
        paragraphs = newTxt.split('<p>')

        for (const i in paragraphs) {
          const p = paragraphs[i]
          if (p) {
            paragraphs[i] = paragraphs[i].trim()
          }
        }
        newTxt = paragraphs.join('<p>')
      } else {
        newTxt = paragraphs.join('\n')
      }
    }

    if (conversionType === 'html') {
      if (preventWidows) {
        // Prevent widows
        let paragraphs
        if (origTxtType === 'html') {
          paragraphs = newTxt.split(/<\/p>+/g)
        } else {
          paragraphs = newTxt.split(/\n+/g)
        }

        const words = []

        for (const i in paragraphs) {
          const p = paragraphs[i]
          if (p) {
            words.push(p.split(' '))
          }
        }

        for (const i in words) {
          const w = words[i]
          if (w.length > 1) {
            const lastWord = w.pop()
            w[w.length - 1] = w[w.length - 1] + '&nbsp;' + lastWord // Insert non-breaking space
          }

          words[i] = w.join(' ')
        }

        for (const i in paragraphs) {
          const p = paragraphs[i]
          if (p) {
            const t = words.shift()
            paragraphs[i] = t
          }
        }

        if (origTxtType === 'html') {
          newTxt = paragraphs.join('</p>')
        } else {
          newTxt = paragraphs.join('\n')
        }
      }
    }

    // Newlines
    if (newlineTransform === 'reduce') {
      // Reduce multiple newlines
      newTxt = newTxt.replace(/\n+/g, '\n')
    } else if (newlineTransform === 'remove') {
      // Remove all newlines
      newTxt = newTxt.replace(/\n+/g, '')
    }

    // HTML
    if (pTagTransform === 'single') {
      // Wrap paragraphs separated by single newlines with p tags
      const paragraphs = newTxt.split('\n')
      for (const i in paragraphs) {
        const p = paragraphs[i]
        if (p) {
          paragraphs[i] = `<p>${paragraphs[i]}</p>`
        }
      }
      newTxt = paragraphs.join('\n')
    } else if (pTagTransform === 'multiple') {
      // Wrap paragraphs separated by multiple newlines with p tags
      const paragraphs = newTxt.split(/\n{2,}/)
      for (const i in paragraphs) {
        const p = paragraphs[i]
        if (p) {
          paragraphs[i] = `<p>${paragraphs[i]}</p>`
        }
      }
      newTxt = paragraphs.join('\n')
    } else if (pTagTransform === 'remove') {
      // Remove all p tags
      newTxt = newTxt.replace(/(<p[^>]+?>|<p>|<\/p>)/gim, '')
    }

    // Replace newlines in p tags with spaces
    // when original text type and conversion type is HTML
    if (swapPTagNewlinesSpaces && conversionType === 'html') {
      const paragraphs = newTxt.split('</p>')
      for (const i in paragraphs) {
        const p = paragraphs[i]
        if (p) {
          paragraphs[i] = paragraphs[i].replace(/\n+/g, ' ')
        }
        newTxt = paragraphs.join('</p>')
      }
    }

    // Spaces
    if (spaceTransform === 'reduce') {
      // Reduce multiple spaces
      newTxt = newTxt.replace(/ +/g, ' ')
    } else if (spaceTransform === 'remove') {
      // Remove all spaces
      newTxt = newTxt.replace(/ +/g, '')
    }

    // Special Characters
    if (htmlEntities === 'encode') {
      newTxt = encode(newTxt)
    } else if (htmlEntities === 'encode-unsafe') {
      newTxt = encode(newTxt, { allowUnsafeSymbols: true })
    } else if (htmlEntities === 'decode') {
      newTxt = decode(newTxt)
    }

    console.log(JSON.stringify(newTxt))
    setCleanTxt(newTxt)
  }

  useEffect(() => {
    if (autoClean) clean()

    if (origTxtType !== 'html' && conversionType !== 'html') {
      if (swapPTagNewlinesSpaces) setSwapPTagNewlinesSpaces(false)
      if (pTagTransform === 'remove') setPTagTransform('')
      if (htmlEntities) setHTMLEntities('')
    }

    if (conversionType !== 'html') {
      if (preventWidows) setPreventWidows(false)
      if (pTagTransform === 'single' || pTagTransform === 'multiple') {
        setPTagTransform('')
      }
    }
  }, [
    origTxtType,
    conversionType,
    preventWidows,
    newlineTransform,
    spaceTransform,
    swapPTagNewlinesSpaces,
    pTagTransform,
    htmlEntities,
    trim,
    spellCheck,
    origTxt,
    cleanTxt,
    autoClean,
  ])

  const swapPTagNewlinesSpacesOption =
    origTxtType === 'html' || conversionType === 'html' ? (
      <label>
        <input
          type="checkbox"
          checked={swapPTagNewlinesSpaces}
          onChange={(e) => setSwapPTagNewlinesSpaces(e.target.checked)}
        />
        Replace newlines in p tags with spaces
      </label>
    ) : null

  let endings
  if (conversionType === 'html') {
    endings = (
      <section>
        <h2>Endings</h2>
        <label>
          <input
            type="checkbox"
            checked={preventWidows}
            onChange={(e) => setPreventWidows(e.target.checked)}
          />
          Prevent Widows
        </label>
      </section>
    )
  }

  let html
  if (origTxtType === 'html' || conversionType === 'html') {
    html = (
      <section>
        <h2>HTML</h2>
        <label>
          Paragraphs
          <select onChange={(e) => setPTagTransform(e.target.value)}>
            <option value="">None</option>
            {conversionType === 'html' && (
              <option value="single">
                Wrap paragraphs separated by single newlines with p tags
              </option>
            )}
            {conversionType === 'html' && (
              <option value="multiple">
                Wrap paragraphs separated by multiple newlines with p tags
              </option>
            )}
            <option value="remove">Remove all p tags</option>
          </select>
        </label>
        <label>
          Special Characters
          <select onChange={(e) => setHTMLEntities(e.target.value)}>
            <option value="">None</option>
            <option value="encode">Encode all</option>
            <option value="encode-unsafe">
              Encode but ignore unsafe characters
            </option>
            <option value="decode">Decode</option>
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
          <select onChange={(e) => setOrigTxtType(e.target.value)}>
            <option value="plain">Plain</option>
            <option value="html">HTML</option>
          </select>
        </section>
        <section>
          <h2>Conversion Type</h2>
          <select onChange={(e) => setConversionType(e.target.value)}>
            <option value="plain">Plain</option>
            <option value="html">HTML</option>
          </select>
        </section>
        {conversionType === 'html' ? endings : null}
        <section>
          <h2>Spacing</h2>
          <label>
            Newlines
            <select onChange={(e) => setNewlineTransform(e.target.value)}>
              <option value="">None</option>
              <option value="reduce">Reduce multiple newlines</option>
              <option value="remove">Remove all newlines</option>
            </select>
          </label>
          <label>
            Spaces
            <select onChange={(e) => setSpaceTransform(e.target.value)}>
              <option value="">None</option>
              <option value="reduce">Reduce multiple spaces</option>
              <option value="remove">Remove all spaces</option>
            </select>
          </label>
          <label>
            <input
              type="checkbox"
              checked={trim}
              onChange={(e) => setTrim(e.target.checked)}
            />
            Trim whitespaces around paragraphs
          </label>
          {swapPTagNewlinesSpacesOption}
        </section>
        {html}
        <section>
          <h2>Miscellaneous</h2>
          <label>
            <input
              type="checkbox"
              checked={spellCheck}
              onChange={(e) => setSpellcheck(e.target.checked)}
            />
            Spell Check
          </label>
        </section>
        <section>
          <h2>Clean</h2>
          <label>
            <input
              type="checkbox"
              checked={autoClean}
              onChange={(e) => setAutoClean(e.target.checked)}
            />
            Auto-Clean
          </label>
          {!autoClean && <button onClick={() => clean()}>Clean</button>}
        </section>
      </section>
      <header className="txt-header">
        <h2>Original Text</h2>
        <button onClick={() => setOrigTxt('')}>Reset</button>
      </header>
      <textarea
        spellCheck={spellCheck}
        value={origTxt}
        onChange={(e) => setOrigTxt(e.target.value)}
      ></textarea>
      <header className="txt-header">
        <h2>Cleaned Text</h2>
        <button
          onClick={() => {
            setOrigTxt(cleanTxt)
            setCleanTxt('')
          }}
        >
          Set Original Text to Cleaned Text
        </button>
      </header>
      <textarea readOnly spellCheck={false} value={cleanTxt}></textarea>
    </main>
  )
}

export default App
