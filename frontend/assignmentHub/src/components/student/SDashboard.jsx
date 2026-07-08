import {
  BookOpenText,
  NotebookText,
  BookCheck,
  Timer,
} from "lucide-react";

const SDashboard = () => {
  const stats = [
    {
      id: 1,
      icon: BookOpenText,
      title: "Courses",
      value: 5,
    },
    {
      id: 2,
      icon: NotebookText,
      title: "Assignments",
      value: 12,
    },
    {
      id: 3,
      icon: BookCheck,
      title: "Submitted",
      value: 8,
    },
    {
      id: 4,
      icon: Timer,
      title: "Due Soon",
      value: 2,
    },
  ];

  const deadlines = [
    {
      id: 1,
      assignment: "React Portfolio",
      course: "Web Development",
      dueDate: "15 July 2026",
      status: "Pending",
    },
    {
      id: 2,
      assignment: "Database Project",
      course: "Database Systems",
      dueDate: "20 July 2026",
      status: "Pending",
    },
    {
      id: 3,
      assignment: "Network Lab",
      course: "Computer Networks",
      dueDate: "25 July 2026",
      status: "Submitted",
    },
  ];

  const progress = 80;

  return (
    <div className="space-y-8 p-8">
      {/* Statistics Cards */}
      <section>
        <h2 className="text-2xl font-bold mb-5 text-white">
          Dashboard Overview
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.id}
                className="bg-[#252736] rounded-2xl p-6 shadow-lg hover:scale-105 transition duration-300 cursor-pointer"
              >
                <div className="flex justify-between items-center">
                  <Icon className="w-10 h-10 text-[#969DD9]" />

                  <span className="text-4xl font-bold text-white">
                    {stat.value}
                  </span>
                </div>

                <h3 className="text-gray-400 text-lg mt-6">
                  {stat.title}
                </h3>
              </div>
            );
          })}
        </div>
      </section>

      {/* Upcoming Deadlines */}
      <section className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-5">
          Upcoming Deadlines
        </h2>

        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="py-3">Assignment</th>
              <th>Course</th>
              <th>Due Date</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {deadlines.map((deadline) => (
              <tr
                key={deadline.id}
                className="border-b hover:bg-gray-50"
              >
                <td className="py-4">
                  {deadline.assignment}
                </td>

                <td>{deadline.course}</td>

                <td>{deadline.dueDate}</td>

                <td>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      deadline.status === "Submitted"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {deadline.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Progress */}
      <section className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-5">
          Progress
        </h2>

        <div className="w-full h-5 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="bg-blue-600 h-full rounded-full transition-all duration-700"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        <p className="mt-4 text-gray-600">
          You have completed{" "}
          <span className="font-bold">{progress}%</span> of your assignments.
        </p>
      </section>
    </div>
  );
};

export default SDashboard;