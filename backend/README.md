```
/backend
│
├── server.js                  # Entry point of the backend
├── config
│   ├── db.js                  # MongoDB connection
│   ├── groq.js                # Groq API configuration
│   └── jwt.js                 # JWT secret & options
│
├── middlewares
│   ├── auth.js                # JWT authentication middleware
│   ├── errorHandler.js        # Centralized error handling
│   └── upload.js              # File upload (Multer) middleware
│
├── models
│   ├── User.js                # User schema
│   ├── Company.js             # Company schema
│   ├── Resume.js              # Resume schema
│   ├── InterviewSession.js    # Interview session schema
│   └── Question.js            # Question schema (MCQ, P2P, HR)
│
├── controllers
│   ├── authController.js      # Signup/Login
│   ├── resumeController.js    # Resume upload & vector DB handling
│   ├── companyController.js   # Create/List/Select company
│   ├── interviewController.js # Start session, fetch questions, record answers
│   └── analyticsController.js # Compute & fetch user analytics
│
├── routes
│   ├── authRoutes.js          # /api/auth
│   ├── resumeRoutes.js        # /api/resume
│   ├── companyRoutes.js       # /api/company
│   ├── interviewRoutes.js     # /api/interview
│   └── analyticsRoutes.js     # /api/analytics
│
├── services
│   ├── groqService.js         # Communicate with Groq API for embeddings & search
│   ├── voiceService.js        # Voice assistant service: text-to-speech / speech-to-text
│   └── faceDetectionService.js# Facial emotion/motion detection processing
│
├── utils
│   ├── parseResume.js         # Parse PDF/DOCX resumes
│   ├── generateQuestions.js   # Generate questions from resume/company
│   ├── calculateMetrics.js    # Analytics calculations (eye movement, comm skills)
│   └── logger.js              # Logging utilities
│
└── package.json
```
