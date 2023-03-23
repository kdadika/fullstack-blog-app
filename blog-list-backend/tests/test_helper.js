const Blog = require("../models/blog");
const User = require("../models/users");

const initialBlogs = [
  {
    _id: "5a422a851b54a676234d17f7",
    title: "Top 10 best vacations",
    author: "Bob Boberson",
    url: "www.travelblog.com",
    likes: 4,
  },
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Newest Video Games",
    author: "Art Vandelay",
    url: "www.aboutnothing.com",
    likes: 8,
  },
];

const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map((blog) => blog.toJSON());
};

const usersInDb = async () => {
  const users = await User.find({});
  return users.map((u) => u.toJSON());
};

module.exports = {
  initialBlogs,
  blogsInDb,
  usersInDb,
};
