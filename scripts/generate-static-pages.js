import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { articles, localizeArticle } from '../src/articles.js'
import { getMessages } from '../src/i18n.js'

const projectRoot = dirname(dirname(fileURLToPath(import.meta.url)))
const distDirectory = join(projectRoot, 'dist')
const templatePath = join(distDirectory, 'index.html')
const siteOrigin = (process.env.SITE_URL || 'https://van-media-company.vercel.app')
  .replace(/\/+$/, '')

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
}

function getPagePath(language, articleId) {
  const languagePrefix = language === 'en' ? '/en' : ''
  return articleId
    ? `${languagePrefix}/articles/${articleId}/`
    : `${languagePrefix || ''}/`
}

function getStaticHead({ language, article }) {
  const copy = getMessages(language)
  const pagePath = getPagePath(language, article?.id)
  const alternateLanguage = language === 'en' ? 'ko' : 'en'
  const alternatePath = getPagePath(alternateLanguage, article?.id)
  const defaultPath = getPagePath('ko', article?.id)
  const url = `${siteOrigin}${pagePath}`
  const title = article ? `${article.title} | VAN NEWS` : copy.defaultTitle
  const description = article?.summary ?? copy.defaultDescription
  const type = article ? 'article' : 'website'
  const structuredData = article
    ? {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: article.title,
        description: article.summary,
        articleBody: article.body.join('\n\n'),
        datePublished: article.publishedAt,
        inLanguage: language === 'en' ? 'en-US' : 'ko-KR',
        mainEntityOfPage: url,
        url,
        articleSection: article.category,
        author: {
          '@type': 'Organization',
          name: 'VAN NEWS',
        },
        citation: article.source.url,
        isAccessibleForFree: true,
      }
    : {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'VAN NEWS',
        description,
        inLanguage: language === 'en' ? 'en-US' : 'ko-KR',
        url,
      }

  const articleMeta = article
    ? `
    <meta property="article:published_time" content="${escapeHtml(article.publishedAt)}" />
    <meta property="article:section" content="${escapeHtml(article.category)}" />`
    : ''

  return `<!-- STATIC_META_START -->
    <meta name="description" content="${escapeHtml(description)}" />
    <link rel="canonical" href="${escapeHtml(url)}" />
    <link rel="alternate" hreflang="${language}" href="${escapeHtml(url)}" />
    <link rel="alternate" hreflang="${alternateLanguage}" href="${escapeHtml(`${siteOrigin}${alternatePath}`)}" />
    <link rel="alternate" hreflang="x-default" href="${escapeHtml(`${siteOrigin}${defaultPath}`)}" />
    <meta property="og:type" content="${type}" />
    <meta property="og:site_name" content="VAN NEWS" />
    <meta property="og:locale" content="${copy.locale}" />
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta property="og:url" content="${escapeHtml(url)}" />${articleMeta}
    <meta name="twitter:card" content="summary" />
    <meta name="twitter:title" content="${escapeHtml(title)}" />
    <meta name="twitter:description" content="${escapeHtml(description)}" />
    <script id="${article ? 'article-structured-data' : 'site-structured-data'}" type="application/ld+json">${JSON.stringify(structuredData).replaceAll('<', '\\u003c')}</script>
    <title>${escapeHtml(title)}</title>
    <!-- STATIC_META_END -->`
}

function renderPage(template, { language, article }) {
  return template
    .replace(/<html lang="[^"]+">/, `<html lang="${language}">`)
    .replace(
      /<!-- STATIC_META_START -->[\s\S]*?<!-- STATIC_META_END -->/,
      getStaticHead({ language, article }),
    )
}

async function writePage(template, { language, article }) {
  const relativeDirectory = article
    ? join(language === 'en' ? 'en' : '', 'articles', String(article.id))
    : language === 'en'
      ? 'en'
      : ''
  const outputDirectory = join(distDirectory, relativeDirectory)
  const outputPath = join(outputDirectory, 'index.html')

  await mkdir(outputDirectory, { recursive: true })
  await writeFile(outputPath, renderPage(template, { language, article }), 'utf8')
}

const template = await readFile(templatePath, 'utf8')

await writePage(template, { language: 'ko' })
await writePage(template, { language: 'en' })

for (const article of articles) {
  await writePage(template, { language: 'ko', article })
  await writePage(template, {
    language: 'en',
    article: localizeArticle(article, 'en'),
  })
}

console.log(`Generated ${articles.length * 2 + 2} static metadata pages.`)
