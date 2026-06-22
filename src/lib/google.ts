const GOOGLE_SITE_VERIFICATION = import.meta.env.VITE_GOOGLE_SITE_VERIFICATION
const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID

function upsertMeta(name: string, content: string) {
  let element = document.querySelector(`meta[name="${name}"]`)
  if (!element) {
    element = document.createElement('meta')
    element.setAttribute('name', name)
    document.head.appendChild(element)
  }
  element.setAttribute('content', content)
}

export function initGoogle() {
  if (GOOGLE_SITE_VERIFICATION) {
    upsertMeta('google-site-verification', GOOGLE_SITE_VERIFICATION)
  }

  if (!GA_MEASUREMENT_ID || document.getElementById('ga-gtag')) {
    return
  }

  const script = document.createElement('script')
  script.id = 'ga-gtag'
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`
  document.head.appendChild(script)

  const inline = document.createElement('script')
  inline.id = 'ga-gtag-init'
  inline.textContent = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${GA_MEASUREMENT_ID}', { anonymize_ip: true });
  `
  document.head.appendChild(inline)
}
