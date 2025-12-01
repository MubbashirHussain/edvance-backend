# API Examples and Payloads

## 📋 Table of Contents

- [Authentication](#authentication)
- [School Management](#school-management)
- [Student Management](#student-management)
- [Subject Management](#subject-management)
- [Class Management](#class-management)

## 🔐 Authentication

### Base URL

```
http://localhost:3000/api/v1
```

### Getting JWT Token

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

---

## 🏫 School Management

### Create School (Super Admin)

**Endpoint**: `POST /api/v1/superadmin/school/create`

**Required Role**: `SUPER_ADMIN`

**Request Body**:

```json
{
  "name": "Springfield High School",
  "domain": "springfield-high",
  "contactEmail": "admin@springfield.edu",
  "contactPhone": "+1234567890",
  "contactName": "Principal Smith",
  "address": "123 Main Street",
  "city": "Springfield",
  "state": "Illinois",
  "postalCode": "62701",
  "country": "USA",
  "plan": "PREMIUM",
  "status": "ACTIVE",
  "billingCycle": "YEARLY",
  "allowStudentsModule": true,
  "allowTeachersModule": true,
  "allowFeeModule": true,
  "allowAttendanceModule": true,
  "allowExamsModule": true
}
```

**Response** (201 Created):

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Springfield High School",
  "domain": "springfield-high",
  "plan": "PREMIUM",
  "status": "ACTIVE",
  "createdAt": "2025-11-29T12:00:00.000Z"
}
```

### Get All Schools

**Endpoint**: `GET /api/v1/superadmin/school/all`

**Required Role**: `SUPER_ADMIN`

**Response** (200 OK):

```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Springfield High School",
    "domain": "springfield-high",
    "status": "ACTIVE",
    "plan": "PREMIUM"
  }
]
```

---

## 👨‍🎓 Student Management

### Create Student

**Endpoint**: `POST /api/v1/school/student/create`

**Required Role**: `SCHOOL_ADMIN`, `SCHOOL_STAFF`

**Request Body**:

```json
{
  "studentId": "ST2025001",
  "admissionNo": "ADM2025001",
  "rollNumber": "ROLL001",
  "firstName": "John",
  "middleName": "Michael",
  "lastName": "Doe",
  "dateOfBirth": "2010-05-15",
  "gender": "MALE",
  "bloodGroup": "O+",
  "email": "john.doe@student.springfield.edu",
  "phone": "+1234567890",
  "currentGrade": "Grade 10",
  "section": "A",
  "admissionDate": "2025-01-15",
  "status": "ACTIVE",
  "parents": [
    {
      "firstName": "Robert",
      "lastName": "Doe",
      "cnic": "12345-6789012-3",
      "email": "robert.doe@email.com",
      "phone": "+1234567891",
      "occupation": "Engineer",
      "education": "Bachelor's Degree",
      "monthlyIncome": 5000,
      "relationship": "Father",
      "isPrimary": true
    },
    {
      "firstName": "Jane",
      "lastName": "Doe",
      "email": "jane.doe@email.com",
      "phone": "+1234567892",
      "occupation": "Teacher",
      "education": "Master's Degree",
      "monthlyIncome": 4000,
      "relationship": "Mother",
      "isPrimary": false
    }
  ]
}
```

**Response** (201 Created):

```json
{
  "id": "660e8400-e29b-41d4-a716-446655440001",
  "studentId": "ST2025001",
  "admissionNo": "ADM2025001",
  "firstName": "John",
  "lastName": "Doe",
  "currentGrade": "Grade 10",
  "section": "A",
  "status": "ACTIVE",
  "createdAt": "2025-11-29T12:00:00.000Z"
}
```

### Get All Students (with Pagination)

**Endpoint**: `GET /api/v1/school/student?page=1&limit=10&search=John&grade=Grade%2010&section=A&status=ACTIVE`

**Required Role**: `SCHOOL_ADMIN`, `SCHOOL_STAFF`, `SCHOOL_TEACHER`

**Query Parameters**:

- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `search` (optional): Search by name, admission no, or student ID
- `grade` (optional): Filter by grade
- `section` (optional): Filter by section
- `gender` (optional): Filter by gender
- `status` (optional): Filter by status

**Response** (200 OK):

```json
{
  "data": [
    {
      "id": "660e8400-e29b-41d4-a716-446655440001",
      "studentId": "ST2025001",
      "admissionNo": "ADM2025001",
      "firstName": "John",
      "lastName": "Doe",
      "currentGrade": "Grade 10",
      "section": "A",
      "status": "ACTIVE",
      "parents": [
        {
          "relationship": "Father",
          "isPrimary": true,
          "parent": {
            "firstName": "Robert",
            "lastName": "Doe",
            "email": "robert.doe@email.com"
          }
        }
      ]
    }
  ],
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "totalPages": 10
  }
}
```

### Get Student by ID

**Endpoint**: `GET /api/v1/school/student/:id`

**Required Role**: `SCHOOL_ADMIN`, `SCHOOL_STAFF`, `SCHOOL_TEACHER`

**Response** (200 OK):

```json
{
  "id": "660e8400-e29b-41d4-a716-446655440001",
  "studentId": "ST2025001",
  "admissionNo": "ADM2025001",
  "rollNumber": "ROLL001",
  "firstName": "John",
  "middleName": "Michael",
  "lastName": "Doe",
  "dateOfBirth": "2010-05-15T00:00:00.000Z",
  "gender": "MALE",
  "bloodGroup": "O+",
  "email": "john.doe@student.springfield.edu",
  "phone": "+1234567890",
  "currentGrade": "Grade 10",
  "section": "A",
  "admissionDate": "2025-01-15T00:00:00.000Z",
  "status": "ACTIVE",
  "parents": [
    {
      "relationship": "Father",
      "isPrimary": true,
      "parent": {
        "id": "770e8400-e29b-41d4-a716-446655440002",
        "firstName": "Robert",
        "lastName": "Doe",
        "cnic": "12345-6789012-3",
        "email": "robert.doe@email.com",
        "phone": "+1234567891",
        "occupation": "Engineer"
      }
    }
  ],
  "createdAt": "2025-11-29T12:00:00.000Z",
  "updatedAt": "2025-11-29T12:00:00.000Z"
}
```

### Update Student

**Endpoint**: `PATCH /api/v1/school/student/:id`

**Required Role**: `SCHOOL_ADMIN`, `SCHOOL_STAFF`

**Request Body** (all fields optional):

```json
{
  "phone": "+1234567899",
  "currentGrade": "Grade 11",
  "section": "B",
  "status": "ACTIVE"
}
```

**Response** (200 OK):

```json
{
  "id": "660e8400-e29b-41d4-a716-446655440001",
  "studentId": "ST2025001",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567899",
  "currentGrade": "Grade 11",
  "section": "B",
  "updatedAt": "2025-11-29T13:00:00.000Z"
}
```

### Delete Student

**Endpoint**: `DELETE /api/v1/school/student/:id`

**Required Role**: `SCHOOL_ADMIN`

**Response** (200 OK):

```json
{
  "message": "Student deleted successfully"
}
```

---

## 📚 Subject Management

### Create Subject

**Endpoint**: `POST /api/v1/school/subjects`

**Required Role**: `SCHOOL_ADMIN`, `SCHOOL_STAFF`

**Request Body**:

```json
{
  "name": "Mathematics",
  "code": "MATH-101",
  "description": "Introduction to advanced mathematics including algebra, geometry, and calculus",
  "schoolId": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Response** (201 Created):

```json
{
  "id": "880e8400-e29b-41d4-a716-446655440003",
  "name": "Mathematics",
  "code": "MATH-101",
  "description": "Introduction to advanced mathematics including algebra, geometry, and calculus",
  "schoolId": "550e8400-e29b-41d4-a716-446655440000",
  "isActive": true,
  "createdAt": "2025-11-29T12:00:00.000Z",
  "updatedAt": "2025-11-29T12:00:00.000Z"
}
```

### Get All Subjects

**Endpoint**: `GET /api/v1/school/subjects?schoolId=550e8400-e29b-41d4-a716-446655440000`

**Required Role**: `SCHOOL_ADMIN`, `SCHOOL_STAFF`, `SCHOOL_TEACHER`

**Query Parameters**:

- `schoolId` (required): School ID

**Response** (200 OK):

```json
[
  {
    "id": "880e8400-e29b-41d4-a716-446655440003",
    "name": "Mathematics",
    "code": "MATH-101",
    "description": "Introduction to advanced mathematics",
    "isActive": true,
    "createdAt": "2025-11-29T12:00:00.000Z"
  },
  {
    "id": "880e8400-e29b-41d4-a716-446655440004",
    "name": "Physics",
    "code": "PHY-101",
    "description": "Introduction to physics",
    "isActive": true,
    "createdAt": "2025-11-29T12:00:00.000Z"
  }
]
```

### Get Subject by ID

**Endpoint**: `GET /api/v1/school/subjects/:id`

**Required Role**: `SCHOOL_ADMIN`, `SCHOOL_STAFF`, `SCHOOL_TEACHER`

**Response** (200 OK):

```json
{
  "id": "880e8400-e29b-41d4-a716-446655440003",
  "name": "Mathematics",
  "code": "MATH-101",
  "description": "Introduction to advanced mathematics including algebra, geometry, and calculus",
  "schoolId": "550e8400-e29b-41d4-a716-446655440000",
  "isActive": true,
  "createdAt": "2025-11-29T12:00:00.000Z",
  "updatedAt": "2025-11-29T12:00:00.000Z"
}
```

### Update Subject

**Endpoint**: `PUT /api/v1/school/subjects/:id`

**Required Role**: `SCHOOL_ADMIN`, `SCHOOL_STAFF`

**Request Body**:

```json
{
  "name": "Advanced Mathematics",
  "description": "Advanced topics in mathematics",
  "isActive": true
}
```

**Response** (200 OK):

```json
{
  "id": "880e8400-e29b-41d4-a716-446655440003",
  "name": "Advanced Mathematics",
  "code": "MATH-101",
  "description": "Advanced topics in mathematics",
  "isActive": true,
  "updatedAt": "2025-11-29T13:00:00.000Z"
}
```

### Delete Subject

**Endpoint**: `DELETE /api/v1/school/subjects/:id`

**Required Role**: `SCHOOL_ADMIN`

**Response** (204 No Content)

---

---

## 👨‍🏫 Teacher Management

### Create Teacher

**Endpoint**: `POST /api/v1/school/teachers`

**Required Role**: `SCHOOL_ADMIN`, `SCHOOL_STAFF`

**Request Body**:

```json
{
  "firstName": "Sarah",
  "lastName": "Johnson",
  "email": "sarah.johnson@school.com",
  "phone": "+1234567890",
  "qualification": "Masters in Mathematics",
  "experience": "5 years",
  "specialization": "Algebra, Geometry",
  "joiningDate": "2025-01-15",
  "schoolId": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Response** (201 Created):

```json
{
  "id": "770e8400-e29b-41d4-a716-446655440005",
  "userId": "880e8400-e29b-41d4-a716-446655440006",
  "firstName": "Sarah",
  "lastName": "Johnson",
  "email": "sarah.johnson@school.com",
  "phone": "+1234567890",
  "qualification": "Masters in Mathematics",
  "experience": "5 years",
  "specialization": "Algebra, Geometry",
  "joiningDate": "2025-01-15T00:00:00.000Z",
  "status": "ACTIVE",
  "schoolId": "550e8400-e29b-41d4-a716-446655440000",
  "createdAt": "2025-11-29T12:00:00.000Z",
  "updatedAt": "2025-11-29T12:00:00.000Z"
}
```

### Get All Teachers

**Endpoint**: `GET /api/v1/school/teachers?schoolId=550e8400-e29b-41d4-a716-446655440000`

**Required Role**: `SCHOOL_ADMIN`, `SCHOOL_STAFF`, `SCHOOL_TEACHER`

**Query Parameters**:

- `schoolId` (required)
- `search` (optional): Search by name or email
- `specialization` (optional)
- `status` (optional)

**Response** (200 OK):

```json
[
  {
    "id": "770e8400-e29b-41d4-a716-446655440005",
    "firstName": "Sarah",
    "lastName": "Johnson",
    "email": "sarah.johnson@school.com",
    "specialization": "Algebra, Geometry",
    "status": "ACTIVE"
  }
]
```

### Get Teacher by ID

**Endpoint**: `GET /api/v1/school/teachers/:id`

**Required Role**: `SCHOOL_ADMIN`, `SCHOOL_STAFF`, `SCHOOL_TEACHER`

**Response** (200 OK):

```json
{
  "id": "770e8400-e29b-41d4-a716-446655440005",
  "firstName": "Sarah",
  "lastName": "Johnson",
  "email": "sarah.johnson@school.com",
  "qualification": "Masters in Mathematics",
  "experience": "5 years",
  "specialization": "Algebra, Geometry",
  "status": "ACTIVE"
}
```

### Update Teacher

**Endpoint**: `PATCH /api/v1/school/teachers/:id`

**Required Role**: `SCHOOL_ADMIN`, `SCHOOL_STAFF`

**Request Body**:

```json
{
  "phone": "+1234567899",
  "experience": "6 years"
}
```

**Response** (200 OK):

```json
{
  "id": "770e8400-e29b-41d4-a716-446655440005",
  "firstName": "Sarah",
  "lastName": "Johnson",
  "phone": "+1234567899",
  "experience": "6 years",
  "updatedAt": "2025-11-29T13:00:00.000Z"
}
```

### Delete Teacher

**Endpoint**: `DELETE /api/v1/school/teachers/:id`

**Required Role**: `SCHOOL_ADMIN`

**Response** (204 No Content)

---

## 🏛 Class Management

### Create Class

**Endpoint**: `POST /api/v1/classes`

**Required Role**: `SCHOOL_ADMIN`, `SCHOOL_STAFF`

**Request Body**:

```json
{
  "schoolId": "550e8400-e29b-41d4-a716-446655440000",
  "className": "Grade 10 - Section A",
  "classCode": "G10-A-2025",
  "academicYear": "2024-2025",
  "gradeLevel": "Grade 10",
  "section": "A",
  "classTeacherId": "990e8400-e29b-41d4-a716-446655440005",
  "coTeachers": ["990e8400-e29b-41d4-a716-446655440006"],
  "capacity": 40,
  "settings": {
    "allowLateSubmissions": true,
    "defaultAttendanceTime": "08:00"
  }
}
```

**Response** (201 Created):

```json
{
  "id": "aa0e8400-e29b-41d4-a716-446655440007",
  "className": "Grade 10 - Section A",
  "classCode": "G10-A-2025",
  "academicYear": "2024-2025",
  "gradeLevel": "Grade 10",
  "section": "A",
  "capacity": 40,
  "currentStrength": 0,
  "isActive": true,
  "createdAt": "2025-11-29T12:00:00.000Z"
}
```

### Get Class by ID

**Endpoint**: `GET /api/v1/classes/:id`

**Required Role**: `SCHOOL_ADMIN`, `SCHOOL_STAFF`

**Response** (200 OK):

```json
{
  "id": "aa0e8400-e29b-41d4-a716-446655440007",
  "schoolId": "550e8400-e29b-41d4-a716-446655440000",
  "className": "Grade 10 - Section A",
  "classCode": "G10-A-2025",
  "academicYear": "2024-2025",
  "gradeLevel": "Grade 10",
  "section": "A",
  "capacity": 40,
  "currentStrength": 35,
  "isActive": true,
  "classTeacher": {
    "id": "990e8400-e29b-41d4-a716-446655440005",
    "firstName": "Sarah",
    "lastName": "Johnson",
    "email": "sarah.johnson@springfield.edu"
  },
  "subjects": [
    {
      "id": "bb0e8400-e29b-41d4-a716-446655440008",
      "subject": {
        "name": "Mathematics",
        "code": "MATH-101"
      },
      "teacher": {
        "firstName": "John",
        "lastName": "Smith"
      }
    }
  ],
  "createdAt": "2025-11-29T12:00:00.000Z",
  "updatedAt": "2025-11-29T12:00:00.000Z"
}
```

---

## 🚨 Error Responses

### 400 Bad Request

```json
{
  "statusCode": 400,
  "message": ["field must be a string", "field should not be empty"],
  "error": "Bad Request"
}
```

### 401 Unauthorized

```json
{
  "statusCode": 401,
  "message": "Unauthorized",
  "error": "Unauthorized"
}
```

### 403 Forbidden

```json
{
  "statusCode": 403,
  "message": "Forbidden resource",
  "error": "Forbidden"
}
```

### 404 Not Found

```json
{
  "statusCode": 404,
  "message": "Student with ID 123 not found",
  "error": "Not Found"
}
```

### 409 Conflict

```json
{
  "statusCode": 409,
  "message": "Student with this Admission No, ID, or Email already exists",
  "error": "Conflict"
}
```

---

## 📝 Notes

1. All timestamps are in ISO 8601 format (UTC)
2. UUIDs are used for all IDs
3. All endpoints require JWT authentication unless specified otherwise
4. Role-based access control is enforced on all protected endpoints
5. Pagination defaults: page=1, limit=10
6. Search is case-insensitive
7. Date fields accept ISO 8601 format: `YYYY-MM-DD`
