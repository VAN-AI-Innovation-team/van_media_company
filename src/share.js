export function getShareTargets({ title, url }) {
  const encodedTitle = encodeURIComponent(title)
  const encodedUrl = encodeURIComponent(url)

  return {
    x: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    instagram: 'https://www.instagram.com/',
  }
}

export function supportsNativeShare(navigatorObject, shareData) {
  if (typeof navigatorObject?.share !== 'function') return false
  if (!shareData || typeof navigatorObject.canShare !== 'function') return true

  try {
    return navigatorObject.canShare(shareData)
  } catch {
    return false
  }
}

export async function shareWithDevice({ title, text, url }, navigatorObject) {
  const shareData = { title, text, url }

  if (!supportsNativeShare(navigatorObject, shareData)) {
    return { status: 'unsupported' }
  }

  try {
    await navigatorObject.share(shareData)
    return { status: 'shared' }
  } catch (error) {
    if (error?.name === 'AbortError') {
      return { status: 'canceled' }
    }

    return { status: 'failed', error }
  }
}

function legacyCopy(text) {
  const textArea = document.createElement('textarea')
  textArea.value = text
  textArea.setAttribute('readonly', '')
  textArea.style.position = 'fixed'
  textArea.style.opacity = '0'
  document.body.appendChild(textArea)
  textArea.select()

  const copied = document.execCommand('copy')
  textArea.remove()

  if (!copied) throw new Error('copy command failed')
}

export async function copyShareUrl(url) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(url)
    return
  }

  legacyCopy(url)
}
