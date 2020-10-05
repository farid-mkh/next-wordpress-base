import { useRouter } from 'next/router'
import ErrorPage from 'next/error'
import Head from 'next/head'
import Container from '../../components/style/container'
import PostBody from '../../components/single/post-body'
import MoreStories from '../../components/main/more-stories'
import Header from '../../components/common/header'
import PostHeader from '../../components/single/post-header'
import SectionSeparator from '../../components/style/section-separator'
import Layout from '../../Layout/layout'
import { getAllPostsWithSlug, getPostAndMorePosts } from '../../lib/api'
import PostTitle from '../../components/tools/post-title'
import { CMS_NAME } from '../../lib/constants'
import Tags from '../../components/tools/tags'

export default function Post({ post, posts, preview }) {
    const router = useRouter()
    const morePosts = posts?.edges

    if (!router.isFallback && !post?.slug) {
        return <ErrorPage statusCode={404} />
    }

    return (
        <Layout preview={preview}>
            <Container>
                <Header />
                {router.isFallback ? (
                    <PostTitle>Loading…</PostTitle>
                ) : (
                        <>
                            <article>
                                <Head>
                                    <title>
                                        {post.title} | {CMS_NAME}
                                    </title>
                                    <meta
                                        property="og:image"
                                        content={post.featuredImage?.node?.sourceUrl}
                                    />
                                </Head>
                                <PostHeader
                                    title={post.title}
                                    coverImage={post.featuredImage.node}
                                    date={post.date}
                                    author={post.author.node}
                                    categories={post.categories}
                                />
                                <PostBody content={post.content} />
                                <footer>
                                    {post.tags.edges.length > 0 && <Tags tags={post.tags} />}
                                </footer>
                            </article>

                            <SectionSeparator />
                            {morePosts.length > 0 && <MoreStories posts={morePosts} />}
                        </>
                    )}
            </Container>
        </Layout>
    )
}

export async function getStaticProps({ params, preview = false, previewData }) {
    const data = await getPostAndMorePosts(params.slug, preview, previewData)

    return {
        props: {
            preview,
            post: data.post,
            posts: data.posts,
        },
    }
}

export async function getStaticPaths() {
    const allPosts = await getAllPostsWithSlug()

    return {
        paths: allPosts.edges.map(({ node }) => `/posts/${node.slug}`) || [],
        fallback: true,
    }
}
