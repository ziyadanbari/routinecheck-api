import validator from "validator";

function extractType(token) {
  if (!validator.isBase64(token)) {
    return false;
  }
  const decodedType = Buffer.from(token, "base64").toString("ascii");
  if (!validator.isAlphanumeric(decodedType)) return false;
  const type = decodedType.slice(-8);
  return type;
}

const RequestTypeChecker = async (req, res, next) => {
  try {
    const { type: token } = req.body;
    if (!token) throw [400, "Invalid Token"];
    const type = extractType(token);
    if (!type) throw [400, "Invalid Token"];
    req.type = type;
    return next();
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
};
export { RequestTypeChecker };
