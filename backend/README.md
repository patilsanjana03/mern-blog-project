# 📝 MERN Blog Project - Backend API (Member 1)
**Developer:** Sanjana Patil  
**College:** BLDEA's Engineering College  
**Status:** Backend Infrastructure Complete (Auth & CRUD)

---

## 🚀 Setup & Installation
1. **Install Dependencies:**
   ```bash
   cd backend
   npm install
Environment Variables:Create a .env file in the backend folder and paste:PlaintextPORT=5000
MONGO_URI=mongodb+srv://SanjanaP:Sanjana19@cluster0.onbb56o.mongodb.net/blogDB?retryWrites=true&w=majority
JWT_SECRET=my_super_secret_key_123
Run the Server:Bashnpx nodemon server.js
🛠 API Endpoints Documentation🔑 User AuthenticationMethodEndpointDescriptionAccessPOST/api/auth/registerRegister a new userPublicPOST/api/auth/loginLogin and get JWT TokenPublic✍️ Blog PostsMethodEndpointDescriptionAccessGET/api/postsFetch all blog postsPublicPOST/api/postsCreate a new blog postPrivatePUT/api/posts/:idUpdate a post by IDPrivateDELETE/api/posts/:idDelete a post by IDPrivate🛡 Security LogicBcrypt.js: Password encryption.JWT: Token-based authorization.Middleware: authMiddleware.js handles route protection.✅ Current Progress (Member 1)[x] MongoDB Atlas Connection[x] User Auth (Register/Login)[x] JWT Middleware logic[x] Blog Post CRUD logic

Once you save this, look at the very top right of your VS Code window. There is a small icon that looks like a **split window with a magnifying glass** (Open Preview to the Side). Click that! 

If it looks like a clean document with a table, you are officially done with the Member 1 Backend tasks. 
