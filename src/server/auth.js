const jwt = require("jsonwebtoken");
const mysecretkey = "capstone";

//jwt토큰을 검증하고 토큰에서 사용자 정보 추출
const auth = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).send({ message: "Missing Auth Token" });
  }

  try {
    const decoded = jwt.verify(token, mysecretkey);
    req.user = { id: decoded.id };
    next();
  } catch (err) {
    console.error(err);
    res.status(401).send({ message: "Invalid Auth Token" });
  }
};

module.exports = auth;