module.exports = {
  changeOrigin: true,
  on: {
    error: (err, req, res) => {
      console.error("Proxy Error: ", err);
      res.status(500).json({ message: "Internal server error" });
    },
  },
};
