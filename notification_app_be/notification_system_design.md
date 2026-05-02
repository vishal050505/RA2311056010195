# Notification System Design

---

## Stage 1: REST API Design

### Core Features

* Send notification
* Fetch notifications
* Mark as read

### APIs

#### 1. Get Notifications

**GET /notifications**

Response:

```json
{
  "notifications": [
    {
      "id": "string",
      "type": "Event | Result | Placement",
      "message": "string",
      "timestamp": "datetime",
      "isRead": false
    }
  ]
}
```

---

#### 2. Send Notification

**POST /notifications**

Request:

```json
{
  "studentId": "string",
  "type": "Event",
  "message": "string"
}
```

Response:

```json
{
  "message": "Notification sent successfully"
}
```

---

#### 3. Mark as Read

**PUT /notifications/:id/read**

Response:

```json
{
  "message": "Notification marked as read"
}
```

---

### Real-Time Mechanism

* Use WebSockets / Server-Sent Events (SSE)
* Push notifications instantly to users

---

## Stage 2: Database Design

### Choice: PostgreSQL

Reason:

* Structured data
* ACID compliance
* Good indexing support

### Table: notifications

| Column    | Type      |
| --------- | --------- |
| id        | UUID      |
| studentId | VARCHAR   |
| type      | ENUM      |
| message   | TEXT      |
| isRead    | BOOLEAN   |
| createdAt | TIMESTAMP |

### Problems with Scale

* Large data volume
* Slow queries

### Solutions

* Indexing (studentId, isRead)
* Partitioning
* Caching (Redis)

---

## Stage 3: Query Optimization

### Given Query:

```sql
SELECT * FROM notifications
WHERE studentID = 1042 AND isRead = false
ORDER BY createdAt DESC;
```

### Issues:

* Full table scan
* No index

### Solution:

```sql
CREATE INDEX idx_notifications ON notifications(studentID, isRead, createdAt DESC);
```

### Optimized Query:

```sql
SELECT id, message, createdAt FROM notifications
WHERE studentID = 1042 AND isRead = false
ORDER BY createdAt DESC;
```

### Time Complexity:

* Before: O(n)
* After: O(log n)

---

## Stage 4: Performance Improvement

### Problems:

* DB overload
* Slow response

### Solutions:

* Pagination (LIMIT, OFFSET)
* Caching recent notifications
* Lazy loading

### Trade-offs:

* Cache inconsistency
* Extra memory usage

---

## Stage 5: Reliable Notification System

### Issues:

* Partial failures (email fails)
* No retry

### Improved Design:

* Use Queue (Kafka / RabbitMQ)
* Retry mechanism
* Logging failures

### Improved Pseudocode:

```python
enqueue(notification)

worker:
  send_email()
  save_to_db()
  push_to_app()
```

---

## Stage 6: Priority Notifications

### Goal:

Show top 10 important notifications

### Priority Logic:

* Placement > Result > Event
* Recent first

### Approach:

* Use Max Heap / Priority Queue

### Example Code (JavaScript):

```javascript
function getTopNotifications(notifications) {
  const priorityMap = {
    Placement: 3,
    Result: 2,
    Event: 1
  };

  return notifications
    .sort((a, b) => {
      if (priorityMap[b.Type] !== priorityMap[a.Type]) {
        return priorityMap[b.Type] - priorityMap[a.Type];
      }
      return new Date(b.Timestamp) - new Date(a.Timestamp);
    })
    .slice(0, 10);
}
```

### Handling Continuous Updates:

* Maintain heap of size 10
* Insert/remove dynamically

---
