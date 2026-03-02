package com.jobportal.simulations;

import static io.gatling.javaapi.core.CoreDsl.*;
import static io.gatling.javaapi.http.HttpDsl.*;

import io.gatling.javaapi.core.*;
import io.gatling.javaapi.http.*;
import java.time.Duration;

/**
 * Gatling load test for JobPortal.
 * Tests Login and Get All Jobs endpoints over a 20-minute period.
 */
public class JobPortalSimulation extends Simulation {

    HttpProtocolBuilder httpProtocol = http
        .baseUrl("http://localhost:8080") 
        .acceptHeader("application/json")
        .contentTypeHeader("application/json");

    ScenarioBuilder scn = scenario("Job Portal 20-Minute Load Test")
        // 1. Login to get JWT token
        .exec(http("Login Request")
            .post("/auth/login")
            .body(StringBody("{\"email\": \"applicant@example.com\", \"password\": \"Password@123\"}"))
            .check(status().is(200))
            .check(jsonPath("$.jwt").saveAs("jwtToken")))
        .exitHereIfFailed()
        .pause(1)
        // 2. Use the token to fetch all jobs
        .exec(http("Get All Jobs")
            .get("/jobs/getAll")
            .header("Authorization", session -> "Bearer " + session.getString("jwtToken"))
            .check(status().is(200))
            .check(bodyString().saveAs("lastResponse")))
        // Debug step: runs only if the previous step marked the session as failed
        .exec(session -> {
            if (session.isFailed()) {
                System.out.println("--- DEBUG INFO ---");
                System.out.println("Status: Failed");
                System.out.println("Token: " + session.getString("jwtToken"));
                System.out.println("Last Response: " + session.getString("lastResponse"));
                System.out.println("------------------");
            }
            return session;
        })
        .pause(5);

    {
        setUp(
            scn.injectOpen(
                atOnceUsers(1),
                rampUsers(100).during(Duration.ofMinutes(20))
            )
        ).protocols(httpProtocol);
    }
}
