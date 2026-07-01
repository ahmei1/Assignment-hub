<!-- This is version 1 of the SRS -->

# Software Requirements Specification (SRS)

## 1. Introduction

### 1.1 Project Title

Assignment Hub

### 1.2 Purpose

Assignment Hub is a web-based platform designed to help lecturers create and manage assignments while allowing students to submit their assignments online. The system centralizes assignment distribution, submission tracking, and communication between lecturers and students.

### 1.3 Scope

The system will provide separate dashboards for lecturers and students.

Lecturers will be able to:

* Create assignments
* Edit assignments
* Delete assignments
* View student submissions
* Track assignment deadlines

Students will be able to:

* View available assignments
* Submit assignments
* Track submission status
* View assignment details

### 1.4 Objectives

* Reduce manual assignment handling
* Improve assignment tracking
* Simplify online submissions
* Provide a centralized platform for assignment management

---

# 2. User Types

## 2.1 Lecturer

Responsibilities:

* Create assignments
* Manage assignments
* Review submissions

Permissions:

* Create, update, and delete assignments
* View student submissions

## 2.2 Student

Responsibilities:

* View assignments
* Submit assignments

Permissions:

* Access available assignments
* Upload assignment files
* View submission status

---

# 3. Functional Requirements

## 3.1 Authentication

The system shall allow users to:

* Register an account
* Login securely
* Logout securely

## 3.2 Assignment Management

The system shall allow lecturers to:

* Create assignments
* Edit assignments
* Delete assignments
* View all assignments

Each assignment shall contain:

* Title
* Description
* Due Date
* Creation Date

## 3.3 Submission Management

The system shall allow students to:

* Submit assignments
* Upload files
* View submission status

The system shall allow lecturers to:

* View submitted assignments
* Track submission dates

## 3.4 Dashboard

Lecturer Dashboard:

* Total assignments
* Total submissions
* Recent assignments

Student Dashboard:

* Available assignments
* Submitted assignments
* Upcoming deadlines

---

# 4. Non-Functional Requirements

## 4.1 Performance

* Pages should load quickly.
* API responses should be efficient.

## 4.2 Security

* Passwords must be encrypted.
* Authentication must use secure tokens.
* Users should only access authorized resources.

## 4.3 Usability

* User-friendly interface
* Responsive design
* Easy navigation

## 4.4 Reliability

* Data should be stored accurately.
* The system should prevent data loss.

---

# 5. Database Requirements

The system shall maintain the following entities:

### User

* id
* name
* email
* password
* role

### Assignment

* id
* title
* description
* dueDate
* createdAt
* lecturerId

### Submission

* id
* assignmentId
* studentId
* fileUrl
* submittedAt
* status

---

# 6. Security Requirements

* Users must authenticate before accessing protected pages.
* Passwords must be hashed before storage.
* JWT authentication will be used.
* Role-based access control will be implemented.

---

# 7. Assumptions and Constraints

Assumptions:

* Users have internet access.
* Users possess valid login credentials.

Constraints:

* Initial version supports lecturers and students only.
* Initial version supports document uploads only.

---

# 8. Future Enhancements

* AI plagiarism detection
* Assignment grading system
* Email notifications
* Analytics dashboard
* Department management
* Admin dashboard
* Mobile application

---

# 9. Conclusion

Assignment Hub aims to provide a simple and effective platform for assignment management, enabling lecturers and students to interact efficiently through a centralized web application.
