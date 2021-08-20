const gun = Gun('https://doujia.herokuapp.com/gun')

let uid
const _list = []

init()

async function init() {
  chrome.storage.sync.get('uid', (data) => {
    uid = data.uid
    if (uid) {
      updateDOM(uid)
    }
  })
}

function updateDOM(uid) {
  const userList = gun.get(uid)
  userList.map().on(function (item, id) {
    _list.push(item)
  })

  const statuses = document.getElementsByClassName('new-status')

  for (let index = 0; index < statuses.length; index++) {
    const status = statuses[index]
    const actions = status.getElementsByClassName('actions')

    const span = document.createElement('SPAN')
    span.innerText = '收藏到[豆荚]'
    span.className = 'gun-button'
    span.addEventListener('click', function (e) {
      e.preventDefault()
      const uid = status.dataset.uid
      const sid = status.dataset.sid

      const createdAt = status.getElementsByClassName('created_at')[0]
      createdAt.innerText = createdAt.getAttribute('title')

      openModal({
        uid,
        sid,
        content: status.outerHTML.replace(/(\r\n|\n|\r)/gm, ''),
      })
    })
    actions[0].appendChild(span)
  }
}

function saveTo(listName, data) {
  const collections = gun.get(`${uid}/${listName}`)
  const collection = gun.get(data.sid).put(data)
  collections.set(collection)
}

function openModal(data) {
  const modal = document.createElement('div')
  modal.id = 'i-modal'

  const modalBody = document.createElement('div')
  modalBody.className = 'i-modal-body'
  const doulistDiv = document.createElement('div')
  doulistDiv.className = 'doulist'
  modalBody.appendChild(doulistDiv)
  _list.map((t) => {
    const p = document.createElement('p')
    p.addEventListener('click', (e) => {
      saveTo(t, data)
      modal.remove()
    })
    p.innerText = t
    doulistDiv.appendChild(p)
  })
  modal.appendChild(modalBody)

  const body = document.getElementsByTagName('body')[0]
  body.appendChild(modal)
}
