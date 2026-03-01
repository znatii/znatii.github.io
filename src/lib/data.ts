import { getCollection, type CollectionEntry } from 'astro:content'

// 文章按时间排序
export function postsSort(posts: CollectionEntry<'posts'>[]) {
  return posts.slice().sort((a, b) => {
    const dateA = a.data.updatedDate ?? a.data.pubDate
    const dateB = b.data.updatedDate ?? b.data.pubDate
    return new Date(dateB).getTime() - new Date(dateA).getTime()
  })
}

// 获取所有非草稿文章，按时间排序
export async function getAllPosts(lang: 'es' | 'en' = 'es'): Promise<CollectionEntry<'posts'>[]> {
  const allPosts = await getCollection('posts')
  const validPosts = allPosts.filter((post) => {
    if (post.data.draft) return false
    if (lang === 'en') return post.id.startsWith('en/')
    return !post.id.startsWith('en/')
  })
  return postsSort(validPosts)
}

// 获取所有置顶文章
export async function getPinnedPosts(lang: 'es' | 'en' = 'es'): Promise<CollectionEntry<'posts'>[]> {
  const allPosts = await getCollection('posts')
  const pinnedPosts = allPosts.filter((post) => {
    if (!post.data.pinned) return false
    if (lang === 'en') return post.id.startsWith('en/')
    return !post.id.startsWith('en/')
  })
  return postsSort(pinnedPosts)
}

// 获取最新的固定数量的文章
export async function getNumPosts(size: number, lang: 'es' | 'en' = 'es'): Promise<CollectionEntry<'posts'>[]> {
  const allPosts = await getCollection('posts')
  const validPosts = allPosts.filter((post) => {
    if (post.data.draft) return false
    if (lang === 'en') return post.id.startsWith('en/')
    return !post.id.startsWith('en/')
  })
  return postsSort(validPosts).slice(0, size)
}

// 获取标签
export async function getAllTags(lang: 'es' | 'en' = 'es'): Promise<Record<string, number>> {
  const allPosts = await getAllPosts(lang)
  const tags = allPosts.flatMap((post) => post.data.tags || [])
  return tags.reduce(
    (acc, tag) => {
      acc[tag] = (acc[tag] || 0) + 1
      return acc
    },
    {} as Record<string, number>
  )
}

// 获取project
export async function getAllProjects(): Promise<CollectionEntry<'projects'>[]> {
  const allProjects = await getCollection('projects')
  return allProjects.filter((project) => !project.data.draft)
}
