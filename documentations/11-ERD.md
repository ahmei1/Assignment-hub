<!-- ERD -->


User
│
├── id
├── name
├── email
├── password
└── role

Assignment
│
├── id
├── title
├── description
├── dueDate
├── createdAt
└── lecturerId

Submission
│
├── id
├── assignmentId
├── studentId
├── fileUrl
├── submittedAt
└── status


<!-- RelationShips -->

User (Lecturer)
    1
    |
    |
    *
Assignment
    1
    |
    |
    *
Submission
    *
    |
    |
    1
User (Student)

Meaning:
One lecturer can create many assignments.
One assignment can have many submissions.
One student can submit many assignments.