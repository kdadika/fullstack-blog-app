const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const middleware = require("../utils/middleware");

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });
  response.json(blogs.map((blog) => blog.toJSON()));
});

blogsRouter.post(
  "/",
  middleware.userExtractor,
  async (request, response, next) => {
    const { body } = request;

    const user = request.user;

    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes,
      user: user._id,
    });

    const savedBlog = await blog.save();
    user.blogs = user.blogs.concat(savedBlog._id);
    await user.save();

    response.status(201).json(savedBlog);
  }
);

blogsRouter.get("/:id", async (request, response) => {
  try {
    const { id } = request.params;
    const blog = await Blog.findById(id);
    if (!blog) return response.status(404).send("blog does not exist");
    response.send(blog);
  } catch (error) {
    response.status(400).send("invalid id");
  }
});

blogsRouter.delete(
  "/:id",
  middleware.userExtractor,
  async (request, response) => {
    const { id } = request.params;

    const user = request.user;
    const blog = await Blog.findById(id);

    if (blog.user.toString() === user._id.toString()) {
      await Blog.findByIdAndRemove(id);
      response.status(204).end();
    } else {
      response
        .status(401)
        .json({ error: "You are not authorized to delete this blog" });
    }
  }
);

blogsRouter.put("/:id", async (request, response, next) => {
  const { body } = request;
  const { id } = request.params;

  const blog = {
    likes: body.likes,
  };

  const updatedBlog = await Blog.findByIdAndUpdate(id, blog, { new: true });

  if (updatedBlog) {
    response.status(200).json(updatedBlog.toJSON());
  } else {
    response.status(404).end();
  }
});

module.exports = blogsRouter;
