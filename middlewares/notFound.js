const notFound = (req, res) => {
  res.status(404).send("[404] RESOURCE NOT FOUND");
};

module.exports = notFound;
