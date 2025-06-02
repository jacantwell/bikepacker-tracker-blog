// scripts/deploy-content.js - Updated to match existing interfaces
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const CONTENT_DIR = path.join(__dirname, '../content')
const POSTS_DIR = path.join(CONTENT_DIR, 'posts')
const OUTPUT_DIR = path.join(__dirname, '../dist-content')

// Default author info - you can customize this
const DEFAULT_AUTHOR = {
  name: "Jasper",
  picture: "/images/author.jpg" // Add your author photo to content/images/
}

async function generateContentIndex() {
  console.log('🔍 Scanning for blog posts...')
  
  // Ensure output directory exists
  fs.mkdirSync(OUTPUT_DIR, { recursive: true })
  fs.mkdirSync(path.join(OUTPUT_DIR, 'posts'), { recursive: true })
  fs.mkdirSync(path.join(OUTPUT_DIR, 'images'), { recursive: true })

  if (!fs.existsSync(POSTS_DIR)) {
    console.log('⚠️  No posts directory found, creating empty index')
    const emptyIndex = {
      posts: [],
      lastUpdated: new Date().toISOString()
    }
    fs.writeFileSync(
      path.join(OUTPUT_DIR, 'index.json'),
      JSON.stringify(emptyIndex, null, 2)
    )
    return
  }

  const posts = []
  const files = fs.readdirSync(POSTS_DIR).filter(file => file.endsWith('.md'))

  for (const file of files) {
    const filePath = path.join(POSTS_DIR, file)
    const fileContent = fs.readFileSync(filePath, 'utf8')
    const { data: frontMatter, content } = matter(fileContent)
    
    const slug = file.replace('.md', '')
    
    // Validate required frontmatter
    if (!frontMatter.title || !frontMatter.date || !frontMatter.excerpt) {
      console.warn(`⚠️  Skipping ${file}: missing required frontmatter (title, date, excerpt)`)
      continue
    }

    // Build post metadata in PostSummary format
    const post = {
      slug,
      title: frontMatter.title,
      excerpt: frontMatter.excerpt,
      date: frontMatter.date,
      coverImage: frontMatter.coverImage ? `/content/images/${frontMatter.coverImage}` : '',
      author: frontMatter.author || DEFAULT_AUTHOR,
      ogImage: {
        url: frontMatter.coverImage ? `/content/images/${frontMatter.coverImage}` : '/images/og-default.jpg'
      },
      // Optional fields for your bikepacking blog
      ...(frontMatter.tags && { tags: frontMatter.tags }),
      ...(frontMatter.location && { location: frontMatter.location })
    }

    posts.push(post)
    
    // Copy markdown file to output
    fs.copyFileSync(filePath, path.join(OUTPUT_DIR, 'posts', file))
    
    console.log(`✅ Processed: ${post.title}`)
  }

  // Sort posts by date (newest first)
  posts.sort((a, b) => new Date(b.date) - new Date(a.date))

  // Generate index.json in expected format
  const index = {
    posts,
    lastUpdated: new Date().toISOString()
  }

  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'index.json'),
    JSON.stringify(index, null, 2)
  )

  // Copy images
  const imagesDir = path.join(CONTENT_DIR, 'images')
  if (fs.existsSync(imagesDir)) {
    console.log('📸 Copying images...')
    const images = fs.readdirSync(imagesDir)
    for (const image of images) {
      fs.copyFileSync(
        path.join(imagesDir, image),
        path.join(OUTPUT_DIR, 'images', image)
      )
    }
    console.log(`✅ Copied ${images.length} images`)
  }

  console.log(`🎉 Generated index with ${posts.length} posts`)
  console.log(`📁 Content ready for deployment in: ${OUTPUT_DIR}`)
}

// AWS S3 deployment helper
function generateAwsCommands() {
  const bucketName = process.env.CONTENT_BUCKET_NAME || 'your-content-bucket'
  
  console.log('\n📋 AWS S3 Deployment Commands:')
  console.log(`aws s3 sync ${OUTPUT_DIR} s3://${bucketName}/ --delete`)
  console.log('\n🔄 CloudFront Invalidation:')
  console.log(`aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/content/*"`)
}

// Run the script
generateContentIndex()
  .then(() => {
    generateAwsCommands()
  })
  .catch(error => {
    console.error('❌ Error generating content:', error)
    process.exit(1)
  })