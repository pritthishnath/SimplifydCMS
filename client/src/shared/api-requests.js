import axios from "axios";

export const User = {
  authorize: async (type, data) => {
    return await axios.post(`/api/auth/${type}`, data);
  },
  getCurrentUser: async () => {
    return await axios.get(`/api/users/get-current-user`);
  },
  create: async (data) => {
    return await axios.post(`/api/users/create-user`, data);
  },
  get: async (id) => {
    return await axios.get(`/api/users/get-user/${id}`);
  },
  getAll: async () => {
    return await axios.get(`/api/users/get-users`);
  },
  delete: async (id) => {
    return await axios.delete(`/api/users/delete-user/${id}`);
  },
};

export const Story = {
  create: async (oldObject, changes) => {
    return await axios.post("/api/stories/create-draft", {
      ...oldObject,
      ...changes,
    });
  },
  update: async (oldObject, changes) => {
    const id = localStorage.getItem("id");
    return await axios.put(`/api/stories/${id}/edit`, {
      ...oldObject,
      ...changes,
    });
  },
  get: async (type, id) => {
    return await axios.get(`/api/stories/get-${type}/${id}`);
  },
  getAll: async (type) => {
    function getDrafts() {
      return axios.get(`/api/stories/get-drafts`);
    }
    function getPublications() {
      return axios.get(`/api/stories/get-publications`);
    }
    if (type) {
      return await axios.get(`/api/stories/get-${type}`);
    }
    return await axios.all([getDrafts(), getPublications()]);
  },
  delete: async (type, id) => {
    return await axios.delete(`/api/stories/delete-${type}/${id}`);
  },
  publish: async (id) => {
    return await axios.post(`/api/stories/publish/${id}`);
  },
};
