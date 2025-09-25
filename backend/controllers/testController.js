export const testController = (req, res) => {
  res.json({
    message: "✅ Test route is working!",
    time: new Date().toISOString()
  });
};
