import jwt from "jsonwebtoken";

export const verifyToken = async (req, res, next) => {     //Next allows our function to continue
  try {
    let token = req.header("Authorization");               //From the frontend we are grabbing the authorization header and that's where the token will be set

    if (!token) {
      return res.status(403).send("Access Denied");        //Token does not even exist
    }

    if (token.startsWith("Bearer ")) {                     //The token has to start with bearer which is set on the frontend
      token = token.slice(7, token.length).trimLeft();     //The token will be placed right after bearer.
    }

    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();                                                 //Continuation of our next function
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};