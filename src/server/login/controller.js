const loginController = {
  options: {
    auth: 'defra-id'
  },
  handler: async (request, h) => await h.redirect('/')
}

export { loginController }
