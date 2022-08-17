/* eslint-disable no-underscore-dangle */
import Post from './post.js';

class PostController {
  async create(request, response) {
    try {
      const { user, password } = request.body;
      const postLogPass = await Post.create({ user, password });
      response.json(postLogPass);
    } catch (error) {
      response.status(500).json(error);
    }
  }

  async getAll(request, response) {
    try {
      const posts = await Post.find();
      return response.json(posts);
    } catch (error) {
      response.status(500).json(error);
    }
  }

  async getOne(request, response) {
    try {
      const { id } = request.params;
      if (!id) {
        response.status(400).json({ message: 'no ID' });
      }
      const post = await Post.findById(id);
      return response.json(post);
    } catch (error) {
      response.status(500).json(error);
    }
  }

  async update(request, response) {
    try {
      const post = request.body;
      if (!post._id) {
        response.status(400).json({ message: 'no ID' });
      }
      const updatedData = await Post.findByIdAndUpdate(post._id, post, { new: true });
      return response.json(updatedData);
    } catch (error) {
      response.status(500).json(error);
    }
  }

  async delete(request, response) {
    try {
      const { id } = request.params;
      if (!id) {
        response.status(400).json({ message: 'no ID' });
      }
      const post = await Post.findByIdAndDelete(id);
      return response.json(post);
    } catch (error) {
      response.status(500).json(error);
    }
  }
}

export default new PostController();
