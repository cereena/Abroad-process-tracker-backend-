import jwt from "jsonwebtoken";

export const protect = (roles = []) => {
  if (typeof roles === "string") roles = [roles];

  return (req, res, next) => {
    console.log("HEADERS RECEIVED:", req.headers);
    console.log("PROTECT JWT_SECRET:", process.env.JWT_SECRET);

    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.toLowerCase().startsWith("bearer ")) {
        return res.status(401).json({
          success: false,
          message: "Authorization token missing",
        });
      }

      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = {
        id: decoded.id,
        role: decoded.role.toLowerCase()
      };

      if (roles.length > 0 && !roles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: "Access denied",
        });
      }

      next();
    } catch (err) {
      console.error("JWT VERIFY ERROR:", err.message);
      return res.status(401).json({
        success: false,
        message: err.message,
      });
    }
  };
};


