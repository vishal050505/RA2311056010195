const axios = require("axios");
const Log = require("../logging_middleware/logger");


const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJ2YjY0NTFAc3JtaXN0LmVkdS5pbiIsImV4cCI6MTc3NzcwMTc2OSwiaWF0IjoxNzc3NzAwODY5LCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiODEyYmI4Y2EtMGY4My00ZWNhLWI4MjUtNTlkNTc2ZjFlNTEyIiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoidmlzaGFsIGt1bWFyIHNpbmdoIiwic3ViIjoiYTE0Nzg0MWYtZjIyMC00YWI3LTg2MTAtMjY3MzZiYzBmYWU4In0sImVtYWlsIjoidmI2NDUxQHNybWlzdC5lZHUuaW4iLCJuYW1lIjoidmlzaGFsIGt1bWFyIHNpbmdoIiwicm9sbE5vIjoicmEyMzExMDU2MDEwMTk1IiwiYWNjZXNzQ29kZSI6IlFrYnB4SCIsImNsaWVudElEIjoiYTE0Nzg0MWYtZjIyMC00YWI3LTg2MTAtMjY3MzZiYzBmYWU4IiwiY2xpZW50U2VjcmV0IjoiVE53dXVBZERNa01WTWFKYiJ9.DFxqqMxAy35ZRnRCfFBvzIeOcUi2Ls0UrsraIfv8DGA";

const getDepot = async () => {
  const res = await axios.get(
    "http://20.207.122.201/evaluation-service/depots",
    {
      headers: {
        Authorization: `Bearer ${TOKEN}`
      }
    }
  );
  return res.data.depots[0]; 
};


const getVehicles = async () => {
  const res = await axios.get(
    "http://20.207.122.201/evaluation-service/vehicles",
    {
      headers: {
        Authorization: `Bearer ${TOKEN}`
      }
    }
  );
  return res.data.vehicles;
};


const knapsack = (tasks, maxHours) => {
  const n = tasks.length;

  const dp = Array(n + 1)
    .fill(0)
    .map(() => Array(maxHours + 1).fill(0));

  for (let i = 1; i <= n; i++) {
    const { Duration, Impact } = tasks[i - 1];

    for (let w = 0; w <= maxHours; w++) {
      if (Duration <= w) {
        dp[i][w] = Math.max(
          dp[i - 1][w],
          Impact + dp[i - 1][w - Duration]
        );
      } else {
        dp[i][w] = dp[i - 1][w];
      }
    }
  }

  return dp[n][maxHours];
};


const runScheduler = async () => {
  try {
    await Log("backend", "info", "service", "Fetching depot data");

    const depot = await getDepot();
    const maxHours = depot.MechanicHours;

    await Log("backend", "info", "service", "Fetching vehicle tasks");

    const vehicles = await getVehicles();

    await Log("backend", "info", "service", "Running knapsack algorithm");

    const maxImpact = knapsack(vehicles, maxHours);

    console.log(" Maximum Impact:", maxImpact);

    await Log("backend", "info", "service", "Scheduler completed successfully");

    return maxImpact; 
  } catch (err) {
    await Log("backend", "error", "service", "Scheduler failed");
    console.error(" Error:", err.message);
    throw err;
  }
};

module.exports = runScheduler;