const supertest = require("supertest");
const mongoose = require("mongoose");
const helper = require("./test_helper");
const app = require("../app");
const api = supertest(app);
const User = require("../models/users");
const Blog = require("../models/blog");

const newUserToken = async () => {
  const newUser = {
    username: "userTester",
    name: "User Tester",
    password: "testuser",
  };

  await api.post("/api/users").send(newUser);
  const loginDetails = await (await api.post("/api/login")).send(newUser);
  return loginDetails.body.token;
};

beforeEach(async () => {
  await Blog.deleteMany({});
  await User.deleteMany({});
  let blogObjects = helper.initialBlogs.map((blog) => new Blog(blog));
  const promiseArray = blogObjects.map((blog) => blog.save());
  await Promise.all(promiseArray);
});

describe("when there is some blogs saved", () => {
  test("blogs are returned as json", async () => {
    const token = await newUserToken();

    await api
      .get("/api/blogs")
      .set("Authorization", `bearer ${token}`)
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("all blogs are returned", async () => {
    const response = await api.get("/api/blogs");

    expect(response.body).toHaveLength(helper.initialBlogs.length);
  });

  test("blogs should contain id property (not _id)", async () => {
    const response = await api.get("/api/blogs");

    expect(response.body[0].id).toBeDefined();
  });
});

describe("viewing a specific blog", () => {
  test("succeeds with valid id", async () => {
    const blogsAtStart = await helper.blogsInDb();

    const blogToView = blogsAtStart[0];

    const resultBlog = await api
      .get(`/api/blogs/${blogToView.id}`)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    expect(resultBlog.body).toEqual(blogToView);
  });

  test("fails with statuscode 404 if blog does not exist", async () => {
    const validNonexistingId = mongoose.Types.ObjectId();

    await api.get(`/api/blogs/${validNonexistingId}`).expect(404);
  });

  test("fails with statuscode 400 id is invalid", async () => {
    const invalidId = "5e8cae887f883f27e06f54a66";

    await api.get(`/api/blogs/${invalidId}`).expect(400);
  });
});

describe("addition of new blog", () => {
  test("a valid blog post can be added", async () => {
    const newBlog = {
      title: "Craziest blog post ever",
      author: "John Smith",
      url: "www.coolestblog.com",
      likes: 10,
    };

    const token = await newUserToken();

    await api
      .post("/api/blogs")
      .set("Authorization", `bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/)
      .expect((response) => console.log(response));

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);

    const blogs = blogsAtEnd.map((r) => r.title);
    expect(blogs).toContain("Craziest blog post ever");
  });
  test("post without title or url is not added", async () => {
    const newBlog = {
      likes: 10,
    };

    await api
      .post("/api/blogs")
      .send(newBlog)
      .expect((response) => console.log(response))
      .expect(400);

    const blogsAtEnd = await helper.blogsInDb();

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);
  });
});
afterAll(async () => {
  await mongoose.connection.close();
});
