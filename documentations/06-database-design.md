<!-- 6- DataBase Design -->

1-User

Field	       Type

id	           UUID
name	       String
email	       String
password	   String
role	       String


2-Assignment

Field	       Type

id	           UUID
title	       String
description	   Text
dueDate	       Date
lecturerId	   UUID


3-Submission

Field	        Type

id	            UUID
assignmentId    UUID
studentId	    UUID
fileUrl	        String
submittedAt	    Date