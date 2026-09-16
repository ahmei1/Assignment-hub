CREATE INDEX "Course_lecturerId_createdAt_idx" ON "Course"("lecturerId", "createdAt");
CREATE INDEX "Enrollment_courseId_idx" ON "Enrollment"("courseId");
CREATE INDEX "Assignment_courseId_dueDate_idx" ON "Assignment"("courseId", "dueDate");
CREATE INDEX "Assignment_lecturerId_dueDate_idx" ON "Assignment"("lecturerId", "dueDate");
CREATE INDEX "Submission_studentId_submittedAt_idx" ON "Submission"("studentId", "submittedAt");
CREATE INDEX "Submission_assignmentId_submittedAt_idx" ON "Submission"("assignmentId", "submittedAt");
