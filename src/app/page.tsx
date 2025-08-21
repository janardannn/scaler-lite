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
};

const mockMyCourses = [
  {
    id: "1",
    title: "Introduction to Java Programming",
    description: "Learn Java fundamentals and OOP concepts",
    imageUrl: "/courses/java.jpg",
    instructor: "Dr. Rajesh Kumar",
    progress: 75,
    totalLectures: 12,
    completedLectures: 9
  },
  {
    id: "2",
    title: "Web Development with React",
    description: "Build modern web applications",
    imageUrl: "/courses/react.jpg",
    instructor: "Sarah Johnson",
    progress: 40,
    totalLectures: 15,
    completedLectures: 6
  },
  {
    id: "3",
    title: "Data Structures & Algorithms",
    description: "Master DSA for interviews",
    imageUrl: "/courses/dsa.jpg",
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
    imageUrl: "/courses/ml.jpg",
    instructor: "Dr. Ananya Patel",
    enrolledCount: 2847
  },
  {
    id: "5",
    title: "Python for Beginners",
    description: "Start your programming journey",
    imageUrl: "/courses/python.jpg",
    instructor: "Mark Thompson",
    enrolledCount: 5234
  },
  {
    id: "6",
    title: "Digital Marketing Mastery",
    description: "Complete digital marketing course",
    imageUrl: "/courses/marketing.jpg",
    instructor: "Lisa Chen",
    enrolledCount: 1892
  }
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar user={mockUser} />

      <main className="pt-28 pb-16 px-4 max-w-7xl mx-auto">

        <Hero userName={getDisplayName(mockUser.name, mockUser.username)} />

        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-slate-900">
              My Courses
            </h2>
            <button className="text-teal-600 hover:text-teal-700 font-medium">
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
            <button className="text-teal-600 hover:text-teal-700 font-medium">
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
