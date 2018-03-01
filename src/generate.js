import './style.css'
import { CanvasRuler } from 'js-yaruo'
import { SPACES } from 'js-yaruo/src/space.ts'
import * as jconv from 'jconv'
import table from 'jconv/tables/SJIS'
import { range, uniq, uniqWith } from 'ramda'

export default function () {
  const el = document.getElementById('t')

  // 1 Byte Characters
  const oneByteChars = [...range(0x21, 0x7f), ...range(0xa1, 0xe0)].map(n => ({
    c: jconv.decode(new Buffer([n]), 'cp932'),
    n
  }))

  // 2 Bytes Characters

  const twoBytesChars = Object.keys(table)
    .map(s => parseInt(s, 10))
    .map(n => {
      const c = jconv.decode(Buffer.from([n >>> 8, n & 0xff]), 'cp932')
      if (c === '・' && n !== 0x8145) {
        return { c: '', n }
      }
      return { c, n }
    })
    .filter(c => c.c.length === 1)

  // Unicode Characters which used in SJIS Art

  const unicodeChars = [
    '▄',
    '▪',
    '▀',
    '█',
    '▂',
    '▐',
    '▆',
    '▅',
    '▎',
    '◤',
    '▌',
    '◢',
    '▍',
    '▼',
    '▲',
    '▬',
    '▶',
    ...SPACES.map(s => s.str)
  ].map(c => ({ c: c, n: 0 }))

  console.log(SPACES)
  const chars = [...oneByteChars, ...twoBytesChars, ...unicodeChars]
  const uniqChars = uniqWith((a, b) => a.c === b.c)

  el.innerHTML += uniqChars(chars)
    .map(c => {
      const ruler = new CanvasRuler()
      const width = ruler.getWidth(c.c)
      const cWithQuotes = (c => {
        if (c === '"') {
          return '""""'
        }
        if (c === ' ' || c === ',') {
          return `"${c}"`
        }
        return c
      })(c.c)
      return `${cWithQuotes}\t${width}`
    })
    .join('<br />')
}
