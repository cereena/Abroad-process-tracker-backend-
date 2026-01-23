import jwt from "jsonwebtoken";

export const protect = (roles = []) => {
  // normalize roles → always array
  if (typeof roles === "string") {
    roles = [roles];
  }

  return (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;

      // 1️ Check token presence
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
          success: false,
          message: "Authorization token missing",
        });
      }

      const token = authHeader.split(" ")[1];

      // 2️ Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // decoded must contain id & role
      if (!decoded?.id || !decoded?.role) {
        return res.status(401).json({
          success: false,
          message: "Invalid token payload",
        });
      }

      // 3️ Attach user to request
      req.user = {
        id: decoded.id,
        role: decoded.role,
      };

      // 4️ Role authorization (if required)
      if (roles.length > 0 && !roles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: "Access denied",
        });
      }

      next();
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: "Token expired or invalid",
      });
    }
  };
};
