# Scaler Lite

A full-stack online learning platform built with Next.js. This was an assignment speedrun, built in around 50 hours.

----- 
### Deployment

This project is deployed on Vercel. 
[scaler-lite.vercel.app](https://scaler-lite.vercel.app)

-----

## Stack

  - **Framework**: Next.js (App Router)
  - **Language**: TypeScript
  - **Database**: MongoDB
  - **ORM**: Prisma
  - **Auth**: NextAuth.js
  - **UI**: Tailwind CSS, shadcn/ui
  - **File Uploads**: UploadThing

-----


## Project Structure

### DB Schema (`schema.prisma`)

  * `User` - User information (Student or Instructor).
  * `Course` - course created by an instructor
  * `Lecture` lecture within a course (reading or quiz). Reading addtionally has 4 types - text, pdf, video (yt link), link
  * `Progress` - student's completion of lectures
  * `Score` - student's quiz scores
  * `Enrollment` - relationship - student's enrollment in a course
  
  

### API Routes (`/src/app/api`)

  * `/auth/...` - NextAuth.js routes for authentication.
  * `/courses` - GET all courses, POST new course.
  * `/courses/my-courses` - GET courses for the current user.
  * `/courses/[courseId]` - GET course details.
  * `/courses/[courseId]/enroll` - POST to enroll in a course.
  * `/courses/[courseId]/lectures/[lectureId]` - GET lecture details.
  * `/courses/[courseId]/lectures/[lectureId]/complete` - POST to mark a lecture as complete.
  * `/courses/[courseId]/lectures/[lectureId]/submit` - POST quiz submission.
  * `/profile` - POST to update user profile.
  * `/uploadthing` - Handles file uploads.

### Frontend Routes (`/src/app`)

  * `/` - Home page
  * `/auth/sign-in` - Sign-in page
  * `/courses` - All courses page
  * `/courses/[courseId]` - Course detail page
  * `/courses/[courseId]/lectures/[lectureId]` - Lecture view page
  * `/instructor/courses/create` - Course creation form
  * `/profile/complete` - User profile completion page

-----

## Local Development

#### 1\. Clone & Install

```bash
git clone https://github.com/janardannn/scaler-lite.git
cd scaler-lite
npm install
```

#### 2\. Environment Variables

Create a `.env` file in the root directory and add the following:

```env
# Prisma
DATABASE_URL="your_mongodb_connection_string"

# NextAuth.js
NEXTAUTH_SECRET="a_random_secret_string"
GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"

# UploadThing
UPLOADTHING_SECRET="your_uploadthing_secret"
UPLOADTHING_APP_ID="your_uploadthing_app_id"
```

#### 3\. Database Setup

Push the schema and seed the database.

```bash
npx prisma generate
npx prisma db push
npx prisma db seed (optional, may require setup)
```

#### 4\. Run Server

```bash
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000)

-----

## High Level Design

![scaler-lite-HLD](public/scaler-lite-HLD.png)