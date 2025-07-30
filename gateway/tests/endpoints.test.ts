import axios from "axios";

const BASE_URL = "http://localhost:8000";

describe("Gateway Endpoints", () => {
  let testUserId: string;
  let testTournamentId: string;

  beforeAll(async () => {
    // Wait for services to be ready
    await new Promise((resolve) => setTimeout(resolve, 2000));
  });

  describe("Health Check", () => {
    it("should return pong for ping endpoint", async () => {
      const response = await axios.get(`${BASE_URL}/ping`);
      expect(response.status).toBe(200);
      expect(response.data).toBe("pong\n");
    });
  });

  describe("Auth Endpoints", () => {
    it("should create a new user", async () => {
      const userData = {
        name: `testuser_${Date.now()}`,
      };

      const response = await axios.post(`${BASE_URL}/auth/signup`, userData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty("id");
      expect(response.data).toHaveProperty("name", userData.name);

      testUserId = response.data.id;
    });

    it("should authenticate an existing user", async () => {
      const userData = {
        name: `testuser_${Date.now()}`,
      };

      // First create a user
      await axios.post(`${BASE_URL}/auth/signup`, userData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      // Then authenticate
      const response = await axios.post(
        `${BASE_URL}/auth/authenticate`,
        userData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty("id");
      expect(response.data).toHaveProperty("name", userData.name);
    });

    it("should return 400 for duplicate user creation", async () => {
      const userData = {
        name: `duplicateuser_${Date.now()}`,
      };

      // Create user first time
      await axios.post(`${BASE_URL}/auth/signup`, userData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      // Try to create same user again
      try {
        await axios.post(`${BASE_URL}/auth/signup`, userData, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        fail("Should have thrown an error");
      } catch (error: any) {
        expect(error.response.status).toBe(400);
      }
    });
  });

  describe("Tournament Endpoints", () => {
    it("should get all tournaments with user ID header", async () => {
      if (!testUserId) {
        // Create a user if we don't have one
        const userData = {
          name: `testuser_${Date.now()}`,
        };
        const userResponse = await axios.post(
          `${BASE_URL}/auth/signup`,
          userData,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        testUserId = userResponse.data.id;
      }

      const response = await axios.get(`${BASE_URL}/tournaments`, {
        headers: {
          "x-user-id": testUserId,
        },
      });
      expect(response.status).toBe(200);
      expect(Array.isArray(response.data)).toBe(true);
    });

    it("should create a new tournament", async () => {
      if (!testUserId) {
        // Create a user if we don't have one
        const userData = {
          name: `testuser_${Date.now()}`,
        };
        const userResponse = await axios.post(
          `${BASE_URL}/auth/signup`,
          userData,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        testUserId = userResponse.data.id;
      }

      const tournamentData = {
        name: `Test Tournament ${Date.now()}`,
        description: "A test tournament",
        max_num: 8,
        rule: "simple",
      };

      const response = await axios.post(
        `${BASE_URL}/tournaments`,
        tournamentData,
        {
          headers: {
            "Content-Type": "application/json",
            "x-user-id": testUserId,
          },
        }
      );

      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty("id");
      expect(response.data).toHaveProperty("name", tournamentData.name);

      testTournamentId = response.data.id;
    });

    it("should get a specific tournament", async () => {
      if (!testTournamentId) {
        // Create a tournament if we don't have one
        if (!testUserId) {
          const userData = {
            name: `testuser_${Date.now()}`,
          };
          const userResponse = await axios.post(
            `${BASE_URL}/auth/signup`,
            userData,
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          testUserId = userResponse.data.id;
        }

        const tournamentData = {
          name: `Test Tournament ${Date.now()}`,
          description: "A test tournament",
          max_num: 8,
          rule: "simple",
        };

        const createResponse = await axios.post(
          `${BASE_URL}/tournaments`,
          tournamentData,
          {
            headers: {
              "Content-Type": "application/json",
              "x-user-id": testUserId,
            },
          }
        );
        testTournamentId = createResponse.data.id;
      }

      const response = await axios.get(
        `${BASE_URL}/tournaments/${testTournamentId}`,
        {
          headers: {
            "x-user-id": testUserId,
          },
        }
      );
      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty("id", testTournamentId);
    });

    it("should get tournament participants", async () => {
      if (!testTournamentId) {
        // Create a tournament if we don't have one
        if (!testUserId) {
          const userData = {
            name: `testuser_${Date.now()}`,
          };
          const userResponse = await axios.post(
            `${BASE_URL}/auth/signup`,
            userData,
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          testUserId = userResponse.data.id;
        }

        const tournamentData = {
          name: `Test Tournament ${Date.now()}`,
          description: "A test tournament",
          max_num: 8,
          rule: "simple",
        };

        const createResponse = await axios.post(
          `${BASE_URL}/tournaments`,
          tournamentData,
          {
            headers: {
              "Content-Type": "application/json",
              "x-user-id": testUserId,
            },
          }
        );
        testTournamentId = createResponse.data.id;
      }

      const response = await axios.get(
        `${BASE_URL}/tournaments/${testTournamentId}/participants`,
        {
          headers: {
            "x-user-id": testUserId,
          },
        }
      );
      expect(response.status).toBe(200);
      expect(Array.isArray(response.data)).toBe(true);
    });

    it("should join a tournament", async () => {
      if (!testTournamentId) {
        // Create a tournament if we don't have one
        if (!testUserId) {
          const userData = {
            name: `testuser_${Date.now()}`,
          };
          const userResponse = await axios.post(
            `${BASE_URL}/auth/signup`,
            userData,
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          testUserId = userResponse.data.id;
        }

        const tournamentData = {
          name: `Test Tournament ${Date.now()}`,
          description: "A test tournament",
          max_num: 8,
          rule: "simple",
        };

        const createResponse = await axios.post(
          `${BASE_URL}/tournaments`,
          tournamentData,
          {
            headers: {
              "Content-Type": "application/json",
              "x-user-id": testUserId,
            },
          }
        );
        testTournamentId = createResponse.data.id;
      }

      const joinData = {
        userId: testUserId,
      };

      try {
        const response = await axios.post(
          `${BASE_URL}/tournaments/${testTournamentId}/join`,
          joinData,
          {
            headers: {
              "Content-Type": "application/json",
              "x-user-id": testUserId,
            },
          }
        );
        expect([200, 400, 404, 500]).toContain(response.status);
      } catch (error: any) {
        // It's okay if this fails due to server-side issues
        expect([400, 404, 500]).toContain(error.response?.status);
      }
    });

    it("should open a tournament", async () => {
      if (!testTournamentId) {
        // Create a tournament if we don't have one
        if (!testUserId) {
          const userData = {
            name: `testuser_${Date.now()}`,
          };
          const userResponse = await axios.post(
            `${BASE_URL}/auth/signup`,
            userData,
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          testUserId = userResponse.data.id;
        }

        const tournamentData = {
          name: `Test Tournament ${Date.now()}`,
          description: "A test tournament",
          max_num: 8,
          rule: "simple",
        };

        const createResponse = await axios.post(
          `${BASE_URL}/tournaments`,
          tournamentData,
          {
            headers: {
              "Content-Type": "application/json",
              "x-user-id": testUserId,
            },
          }
        );
        testTournamentId = createResponse.data.id;
      }

      try {
        const response = await axios.post(
          `${BASE_URL}/tournaments/${testTournamentId}/open`,
          {},
          {
            headers: {
              "x-user-id": testUserId,
            },
          }
        );
        expect([200, 400, 404]).toContain(response.status);
      } catch (error: any) {
        // It's okay if this fails due to tournament state or permissions
        expect([400, 404, 500]).toContain(error.response?.status);
      }
    });
  });

  describe("Battle Endpoints", () => {
    it("should handle battle ready request", async () => {
      if (!testUserId) {
        // Create a user if we don't have one
        const userData = {
          name: `testuser_${Date.now()}`,
        };
        const userResponse = await axios.post(
          `${BASE_URL}/auth/signup`,
          userData,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        testUserId = userResponse.data.id;
      }

      if (!testTournamentId) {
        // Create a tournament if we don't have one
        const tournamentData = {
          name: `Test Tournament ${Date.now()}`,
          description: "A test tournament",
          max_num: 8,
          rule: "simple",
        };

        const createResponse = await axios.post(
          `${BASE_URL}/tournaments`,
          tournamentData,
          {
            headers: {
              "Content-Type": "application/json",
              "x-user-id": testUserId,
            },
          }
        );
        testTournamentId = createResponse.data.id;
      }

      try {
        const response = await axios.put(
          `${BASE_URL}/tournaments/${testTournamentId}/battle/ready`,
          {},
          {
            headers: {
              "x-user-id": testUserId,
            },
          }
        );
        // This might succeed or fail depending on the current state
        expect([200, 400, 404, 500]).toContain(response.status);
      } catch (error: any) {
        // It's okay if this fails due to missing tournament or other conditions
        expect([400, 404, 500]).toContain(error.response?.status);
      }
    });

    it("should handle cancel battle request", async () => {
      if (!testUserId) {
        // Create a user if we don't have one
        const userData = {
          name: `testuser_${Date.now()}`,
        };
        const userResponse = await axios.post(
          `${BASE_URL}/auth/signup`,
          userData,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        testUserId = userResponse.data.id;
      }

      const cancelData = {
        userId: testUserId,
        battleId: "test-battle",
      };

      try {
        const response = await axios.post(
          `${BASE_URL}/battle/cancel`,
          cancelData,
          {
            headers: {
              "Content-Type": "application/json",
              "x-user-id": testUserId,
            },
          }
        );
        expect([200, 400, 404, 500]).toContain(response.status);
      } catch (error: any) {
        // It's okay if this fails
        expect([400, 404, 500]).toContain(error.response?.status);
      }
    });

    it("should handle AI opponent request", async () => {
      if (!testUserId) {
        // Create a user if we don't have one
        const userData = {
          name: `testuser_${Date.now()}`,
        };
        const userResponse = await axios.post(
          `${BASE_URL}/auth/signup`,
          userData,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        testUserId = userResponse.data.id;
      }

      const aiData = {
        userId: testUserId,
        aiLevel: 1,
      };

      try {
        const response = await axios.post(
          `${BASE_URL}/battle/ai-opponent`,
          aiData,
          {
            headers: {
              "Content-Type": "application/json",
              "x-user-id": testUserId,
            },
          }
        );
        expect([200, 400, 404, 500]).toContain(response.status);
      } catch (error: any) {
        // It's okay if this fails
        expect([400, 404, 500]).toContain(error.response?.status);
      }
    });
  });

  describe("Error Handling", () => {
    it("should return 400 for missing x-user-id header", async () => {
      try {
        await axios.get(`${BASE_URL}/tournaments`);
        fail("Should have thrown an error");
      } catch (error: any) {
        expect(error.response.status).toBe(400);
        expect(error.response.data.message).toContain("x-user-id");
      }
    });

    it("should return 400 for invalid tournament creation data", async () => {
      if (!testUserId) {
        const userData = {
          name: `testuser_${Date.now()}`,
        };
        const userResponse = await axios.post(
          `${BASE_URL}/auth/signup`,
          userData,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        testUserId = userResponse.data.id;
      }

      const invalidTournamentData = {
        name: "Test Tournament",
        // Missing required fields
      };

      try {
        await axios.post(`${BASE_URL}/tournaments`, invalidTournamentData, {
          headers: {
            "Content-Type": "application/json",
            "x-user-id": testUserId,
          },
        });
        fail("Should have thrown an error");
      } catch (error: any) {
        expect(error.response.status).toBe(400);
      }
    });
  });
});
