import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { CourseCard } from "@/components/course-card";
import { getDisplayName } from "@/utils/get-display-name";

// mock data
const mockUser = {
  name: "Janardan Hazarika",
  username: "janardan",
  email: "janardan@gmail.com",
  // image: "/avatars/janardan.jpg"
  type: "instructor", // or "instructor"
};

const mockMyCourses = [
  {
    id: "1",
    title: "Introduction to Java Programming",
    description: "Learn Java fundamentals and OOP concepts",
    imageUrl: "https://file.labex.io/namespace/df87b950-1f37-4316-bc07-6537a1f2c481/java/lab-your-first-java-lab/assets/java.svg",
    instructor: "Dr. Rajesh Kumar",
    progress: 75,
    totalLectures: 12,
    completedLectures: 9
  },
  {
    id: "2",
    title: "Web Development with React",
    description: "Build modern web applications",
    imageUrl: "https://blog.openreplay.com/images/vite-create-react-app/images/hero.png",
    instructor: "Sarah Johnson",
    progress: 40,
    totalLectures: 15,
    completedLectures: 6
  },
  {
    id: "3",
    title: "Data Structures & Algorithms",
    description: "Master DSA for interviews",
    imageUrl: "https://assets.bytebytego.com/diagrams/0024-10-data-structures-used-in-daily-life.png",
    instructor: "Prof. Amit Singh",
    progress: 20,
    totalLectures: 20,
    completedLectures: 4
  }
];

const mockTopCourses = [
  {
    id: "4",
    title: "Machine Learning Fundamentals",
    description: "Introduction to ML and AI concepts",
    imageUrl: "https://prutor.online/wp-content/uploads/2024/08/Machine-Learning.jpg",
    instructor: "Dr. Ananya Patel",
    enrolledCount: 2847
  },
  {
    id: "5",
    title: "Python for Beginners",
    description: "Start your programming journey",
    imageUrl: "https://files.realpython.com/media/Newbie_Watermarked.a9319218252a.jpg",
    instructor: "Mark Thompson",
    enrolledCount: 5234
  },
  {
    id: "6",
    title: "DevOps End-to-End",
    description: "Complete devops roadmap covered",
    imageUrl: "https://shalb.com/wp-content/uploads/2019/11/Devops1.jpeg",
    instructor: "Lisa Chen",
    enrolledCount: 1892
  }
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar user={mockUser} />

      <main className="pt-28 pb-16 px-4 max-w-7xl mx-auto">

        <Hero user={mockUser} />

        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-slate-900">
              My Courses
            </h2>
            <button className="text-primary hover:text-primary-hover font-medium">
              View All
            </button>
          </div>

          <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
            {mockMyCourses.map((course) => (
              <div key={course.id} className="flex-none w-80">
                <CourseCard
                  {...course}
                  showProgress={true}
                  variant="enrolled"
                />
              </div>
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-slate-900">
              Top Courses
            </h2>
            <button className="text-primary hover:text-primary-hover font-medium">
              Browse All
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockTopCourses.map((course) => (
              <CourseCard
                key={course.id}
                {...course}
                showProgress={false}
                variant="discovery"
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
