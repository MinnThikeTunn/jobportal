package com.jobportal.util;

public class TestLogger {
    private static final String SEPARATOR = "--------------------------------------------------------------------------------";
    
    // ANSI Escape Codes for Colors
    private static final String RESET = "\u001B[0m";
    private static final String BOLD = "\u001B[1m";
    private static final String CYAN = "\u001B[36m";
    private static final String YELLOW = "\u001B[33m";
    private static final String GREEN = "\u001B[32m";
    private static final String RED = "\u001B[31m";
    private static final String PURPLE = "\u001B[35m";

    public static void logTestStart(String testName, String data, String context, String action, String expectation) {
        System.out.println();
        System.out.println(PURPLE + SEPARATOR + RESET);
        System.out.println(BOLD + CYAN + "TEST: " + testName + RESET);
        System.out.println(PURPLE + SEPARATOR + RESET);
        
        if (data != null && !data.isEmpty()) {
            System.out.println(BOLD + "  DATA:        " + RESET + YELLOW + data + RESET);
        }
        if (context != null && !context.isEmpty()) {
            System.out.println(BOLD + "  CONTEXT:     " + RESET + context);
        }
        if (action != null && !action.isEmpty()) {
            System.out.println(BOLD + "  ACTION:      " + RESET + action);
        }
        if (expectation != null && !expectation.isEmpty()) {
            System.out.println(BOLD + "  EXPECTATION: " + RESET + expectation);
        }
        System.out.println(PURPLE + SEPARATOR + RESET);
    }

    public static void logTestStart(String testName, String data, String action, String expectation) {
        logTestStart(testName, data, null, action, expectation);
    }

    public static void logSetup(String message) {
        System.out.println("  " + PURPLE + "SETUP:       " + RESET + message);
    }

    public static void logExecution(String message) {
        System.out.println("  " + CYAN + "EXECUTION:   " + RESET + message);
    }

    public static void logVerification(String message) {
        System.out.println("  " + YELLOW + "VERIFY:      " + RESET + message);
    }

    public static void logResult(String result) {
        String coloredResult = result;
        if (result.contains("PASS")) {
            coloredResult = BOLD + GREEN + result + RESET;
        } else if (result.contains("FAIL")) {
            coloredResult = BOLD + RED + result + RESET;
        }
        
        System.out.println(BOLD + "  RESULT:      " + RESET + coloredResult);
        System.out.println(PURPLE + SEPARATOR + RESET);
        System.out.println();
    }
}
