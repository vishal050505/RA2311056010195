const axios = require("axios");

const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJ2YjY0NTFAc3JtaXN0LmVkdS5pbiIsImV4cCI6MTc3NzcwMTc2OSwiaWF0IjoxNzc3NzAwODY5LCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiODEyYmI4Y2EtMGY4My00ZWNhLWI4MjUtNTlkNTc2ZjFlNTEyIiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoidmlzaGFsIGt1bWFyIHNpbmdoIiwic3ViIjoiYTE0Nzg0MWYtZjIyMC00YWI3LTg2MTAtMjY3MzZiYzBmYWU4In0sImVtYWlsIjoidmI2NDUxQHNybWlzdC5lZHUuaW4iLCJuYW1lIjoidmlzaGFsIGt1bWFyIHNpbmdoIiwicm9sbE5vIjoicmEyMzExMDU2MDEwMTk1IiwiYWNjZXNzQ29kZSI6IlFrYnB4SCIsImNsaWVudElEIjoiYTE0Nzg0MWYtZjIyMC00YWI3LTg2MTAtMjY3MzZiYzBmYWU4IiwiY2xpZW50U2VjcmV0IjoiVE53dXVBZERNa01WTWFKYiJ9.DFxqqMxAy35ZRnRCfFBvzIeOcUi2Ls0UrsraIfv8DGA";

const getNotifications = async () => {
  const res = await axios.get(
    "http://20.207.122.201/evaluation-service/notifications",
    {
      headers: {
        Authorization: `Bearer ${TOKEN}`
      }
    }
  );
  return res.data.notifications;
};

const getTopNotifications = (notifications) => {
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
};

const run = async () => {
  const notifications = await getNotifications();
  const top10 = getTopNotifications(notifications);

  console.log("Top 10 Notifications:");
  console.log(top10);
};

run();