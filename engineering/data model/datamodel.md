**Entities and Attributes:**

1.  **User:**
    * `id` (integer, primary key)
    * `username` (string)
    * `email` (string)
    * `password` (string)
    * `role` (string, e.g., "student", "administrator")

2.  **Quiz/Exam:**
    * `id` (integer, primary key)
    * `title` (string)
    * `description` (text)
    * `subject` (string, e.g., "Math", "Science", "History")
    * `created_by` (integer, foreign key referencing `User`)

3.  **Question:**
    * `id` (integer, primary key)
    * `text` (text)
    * `type` (string, e.g., "multiple-choice-single", "multiple-choice-multiple", "true-false")
    * `options` (text, for multiple-choice questions)
    * `correct_answer` (string or array)

4.  **QuizQuestion:**
    * `quiz_id` (integer, foreign key referencing `Quiz/Exam`, primary key - part 1)
    * `question_id` (integer, foreign key referencing `Question`, primary key - part 2)
    * `order` (integer, optional)
    * `points` (integer, optional)

5.  **StudyMaterial:**
    * `id` (integer, primary key)
    * `title` (string)
    * `description` (text)
    * `subject` (string)
    * `file_url` (string)
    * `created_by` (integer, foreign key referencing `User`)

6.  **UserProgress:**
    * `id` (integer, primary key)
    * `user_id` (integer, foreign key referencing `User`)
    * `quiz_id` (integer, foreign key referencing `Quiz/Exam`)
    * `score` (integer)
    * `completed_at` (timestamp)

7.  **StudyPlan:**
    * `id` (integer, primary key)
    * `user_id` (integer, foreign key referencing `User`)
    * `start_date` (date)
    * `end_date` (date)
    * `subject` (string)
    * `goal` (string)

**Relationships:**

* A user can create many quizzes/exams and study materials.
* A quiz/exam can have many questions, and a question can belong to many quizzes/exams (many-to-many through `QuizQuestion`).
* A user can have many progress records and study plans.

**Diagram (Conceptual):**

```
User *----1 Quiz/Exam
User *----1 StudyMaterial
User 1----* UserProgress
User 1----* StudyPlan
Quiz/Exam *----* Question  (through QuizQuestion)
```


