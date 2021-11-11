const allPosts = `query {
  postCollection(order: date_ASC, limit: 10) {
    items {
      slug
      title
			coverImage {
        url
        width
        height
      }
      date
      author {
        name
        picture {
          url
        }
      }
      excerpt
      content {
        json
        links {
          assets {
            block {
              sys {
                id
              }
              url
              size
              width
              height
            }
          }
        }
      }
    }
  }
}`;

// use this helper function
async function fetchGraphQL(query) {
  return fetch(
    `https://graphql.contentful.com/content/v1/spaces/${process.env.CONTENTFUL_SPACE_ID}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.CONTENTFUL_ACCESS_TOKEN}`,
      },
      body: JSON.stringify({ query }),
    }
  ).then((response) => response.json());
}

/**
 * This method is called in `/pages/index.js`
 */
export async function getAllPostsForHome() {
  const response = await fetchGraphQL(allPosts);
  return response.data.postCollection.items;
}

/**
 * This method is called in `/pages/posts/[slug].js`
 */
export async function getAllPostsWithSlug() {
  const response = await fetchGraphQL(allPosts);
  return response.data.postCollection.items;
}

/**
 * This method is called in `/pages/posts/[slug].js
 *
 * @param {String} slug
 */
export async function getPostAndMorePosts(slug) {
  const res = await fetchGraphQL(allPosts);
  const posts = res.data.postCollection.items;
  const currentPost = posts.find((post) => post.slug === slug);

  const currentPostIndex = posts.findIndex((post) => post.slug === slug);
  const prevPost = posts[currentPostIndex - 1] || posts[posts.length - 1];
  const nextPost = posts[currentPostIndex + 1] || posts[0];

  if (!currentPost) {
    return {
      post: false,
    };
  }

  return {
    post: currentPost,
    morePosts: [prevPost, nextPost],
  };
}
