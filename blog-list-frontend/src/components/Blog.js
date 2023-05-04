import { useState } from "react";

const Blog = ({ blog, updateLikes, deleteBlog, username }) => {
  const [visible, setVisible] = useState(false);
  const [blogObject, setBlogObject] = useState(blog);
  const toggleVisibility = () => {
    setVisible(!visible);
  };

  const handleLike = () => {
    const blogToUpdate = {
      ...blog,
      likes: blog.likes + 1,
    };
    updateLikes(blog.id, blogToUpdate);
    setBlogObject(blogToUpdate);
  };
  const handleDelete = () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      deleteBlog(blog.id);
    }
  };

  return (
    <div className="blog">
      <div>
        <span className="title">{blog.title}</span>
        <span className="author">{blog.author}</span>{" "}
        <button id="view-btn" onClick={toggleVisibility}>
          {visible ? "hide" : "view"}
        </button>
      </div>
      {visible && (
        <div className="blog-details">
          <div>{blog.url}</div>
          <div>
            Likes: {blogObject.likes}{" "}
            <button id="like-btn" onClick={handleLike}>
              like
            </button>{" "}
          </div>
          <div>{blogObject.user.name}</div>
          <div>
            {blogObject.user.username === username && (
              <button id="delete-btn" onClick={handleDelete}>
                delete
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Blog;
