
//import db from '../lib/database.js'
import fetch from 'node-fetch'
import { youtubedl, youtubedlv2, youtubedlv3 } from '@bochilteam/scraper';
let limit = 80
let handler = async (m, { conn, args, isPrems, isOwner, usedPrefix, command }) => {
  if (!args || !args[0]) throw `✳️ Ejemplo :\n${usedPrefix + command} https://youtu.be/YzkTFFwxtXI`
  if (!args[0].match(/youtu/gi)) throw `❎ Verifica que el link de YouTube`
 m.react(rwait)
 let chat = global.db.data.chats[m.chat]
  const isY = /y(es)/gi.test(args[1])
  const { thumbnail, video: _video, title } = await youtubedl(args[0]).catch(async _ => await youtubedlv2(args[0])).catch(async _ => await youtubedlv3(args[0]))
  const limitedSize = (isPrems || isOwner ? 350 : limit) * 3074
  let video, source, res, link, lastError, isLimit
  for (let i in _video) {
    try {
      video = _video[i]
      if (isNaN(video.fileSize)) continue
      isLimit = limitedSize < video.fileSize
      if (isLimit) continue
      link = await video.download()
      if (link) res = await fetch(link)
      isLimit = res?.headers.get('content-length') && parseInt(res.headers.get('content-length')) < limitedSize
      if (isLimit) continue
      if (res) source = await res.arrayBuffer()
      if (source instanceof ArrayBuffer) break
    } catch (e) {
      video = source = link = null
      lastError = e
    }
  }
  if ((!(source instanceof ArrayBuffer) || !link || !res.ok) && !isLimit) throw '❎ Error: ' + (lastError || 'no puedo descargar el video')

  let _thumb = {}
  try { _thumb = { thumbnail: await (await fetch(thumbnail)).buffer() } }
  catch (e) { }
  if (!isLimit) await conn.sendFile(m.chat, link, title + '.mp4', `
 ≡  *FG MUSIC*
  
▢ *📌Título* : ${title}
▢ *📟 Ext* : mp4
▢ *⚖️Peso* : ${video.fileSizeH}
`.trim(), m, false, {
    ..._thumb,
    asDocument: chat.useDocument
  })
  m.react(done)
}
handler.help = ['ytmp4 <link yt>']
handler.tags = ['downloader']
handler.command = ['ytmp4', 'fgmp4']
handler.diamond = true

handler.exp = 0


export default handler
