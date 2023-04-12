import { useState, useEffect } from "react";
import Blog from "./components/Blog";
import Notification from "./components/Notification";

import blogService from "./services/blogs";
import loginService from "./services/login";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [newBlog, setNewBlog] = useState({
    title: "",
    author: "",
    url: "",
    likes: 0,
  });
  // const [showAll, setShowAll] = useState(true);
  const [message, setMessage] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  // Clear notification after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setMessage(null);
    }, 5000);
    return () => {
      clearTimeout(timer);
    };
  }, [message]);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const user = await loginService.login({
        username,
        password,
      });
      window.localStorage.setItem("loggedBlogUser", JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
      setUsername("");
      setPassword("");
    } catch (exception) {
      setMessage("Wrong credentials");
      setTimeout(() => {
        setMessage(null);
      }, 5000);
    }
  };

  const handleLogout = () => {
    window.localStorage.clear();
    setUser(null);
  };

  const handleBlogChange = (e) => {
    const { name, value } = e.target;
    setNewBlog({ ...newBlog, [name]: value });
  };

  const handleCreateBlog = (e) => {
    e.preventDefault();
    createBlog(newBlog.title, newBlog.author, newBlog.url, newBlog.likes);
    setNewBlog({ title: "", author: "", url: "" });
  };

  const createBlog = async (title, author, url, likes) => {
    try {
      const blog = await blogService.create({
        title,
        author,
        url,
        likes,
      });
      setBlogs(blogs.concat(blog));
      setMessage(`A new blog ${title} by ${author} added`);
    } catch (error) {
      setMessage("error" + error.response.data.error);
    }
  };

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
        <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>
  );

  const blogForm = () => (
    <form onSubmit={handleCreateBlog}>
      <div>
        title
        <input
          name="title"
          type="text"
          value={newBlog.title}
          onChange={handleBlogChange}
        />
      </div>
      <div>
        author
        <input
          name="author"
          type="text"
          value={newBlog.author}
          onChange={handleBlogChange}
        />
      </div>
      <div>
        url
        <input
          name="url"
          type="text"
          value={newBlog.url}
          onChange={handleBlogChange}
        />
      </div>
      <button id="createBtn" type="submit">
        create
      </button>
    </form>
  );

  return (
    <div>
      <h1 className="headerTitle">blogs</h1>
      <Notification message={message} />
      {!user && loginForm()}
      {user && (
        <div>
          <p>
            <span className="active-user">{user.name}</span> logged in{" "}
            <button id="logout-btn" onClick={handleLogout}>
              logout
            </button>
          </p>
          {blogForm()}
          <div>
            {blogs.map((blog) => (
              <Blog key={blog.id} blog={blog} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
