const dummy = (blogs) => {
  return 1;
};

const totalLikes = (posts) => {
  return posts.length === 0
    ? 0
    : posts.reduce((acc, curr) => acc + curr.likes, 0);
};

const favoriteBlog = (posts) => {
  if (!posts || posts.likes === 0) {
    return null;
  }

  const mostLikes = posts.reduce((a, b) => (b.likes > a.likes ? b : a));

  const favBlog = {
    title: mostLikes.title,
    author: mostLikes.author,
    likes: mostLikes.likes,
  };

  return favBlog;
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
};
