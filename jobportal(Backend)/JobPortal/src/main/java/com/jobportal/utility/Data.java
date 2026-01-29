package com.jobportal.utility;

public class Data {
    public static String getMessageBody(String otp, String userName) {
        return
                "<!DOCTYPE html>\n" +
                        "<html lang=\"en\">\n" +
                        "<head>\n" +
                        "    <meta charset=\"UTF-8\">\n" +
                        "    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n" +
                        "    <title>OTP Email</title>\n" +
                        "    <style>\n" +
                        "        body {\n" +
                        "            font-family: Arial, sans-serif;\n" +
                        "            background-color: #f4f4f9;\n" +
                        "            margin: 0;\n" +
                        "            padding: 0;\n" +
                        "        }\n" +
                        "        .email-container {\n" +
                        "            max-width: 600px;\n" +
                        "            margin: 20px auto;\n" +
                        "            background-color: #ffffff;\n" +
                        "            border-radius: 8px;\n" +
                        "            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);\n" +
                        "            overflow: hidden;\n" +
                        "        }\n" +
                        "        .header {\n" +
                        "            background-color: #4caf50;\n" +
                        "            color: white;\n" +
                        "            padding: 20px;\n" +
                        "            text-align: center;\n" +
                        "            font-size: 24px;\n" +
                        "        }\n" +
                        "        .content {\n" +
                        "            padding: 20px;\n" +
                        "        }\n" +
                        "        .content p {\n" +
                        "            font-size: 16px;\n" +
                        "            line-height: 1.6;\n" +
                        "            color: #333;\n" +
                        "        }\n" +
                        "        .otp-code {\n" +
                        "            font-size: 24px;\n" +
                        "            font-weight: bold;\n" +
                        "            color: #4caf50;\n" +
                        "            text-align: center;\n" +
                        "            margin: 20px 0;\n" +
                        "            padding: 10px;\n" +
                        "            background-color: #f9f9f9;\n" +
                        "            border-radius: 4px;\n" +
                        "        }\n" +
                        "        .footer {\n" +
                        "            background-color: #f4f4f9;\n" +
                        "            text-align: center;\n" +
                        "            padding: 10px;\n" +
                        "            font-size: 14px;\n" +
                        "            color: #888;\n" +
                        "        }\n" +
                        "        .footer a {\n" +
                        "            color: #4caf50;\n" +
                        "            text-decoration: none;\n" +
                        "        }\n" +
                        "    </style>\n" +
                        "</head>\n" +
                        "<body>\n" +
                        "    <div class=\"email-container\">\n" +
                        "        <div class=\"header\">\n" +
                        "            Your OTP Code\n" +
                        "        </div>\n" +
                        "        <div class=\"content\">\n" +
                        "            <p>Hello " + userName + ",</p>\n" +
                        "            <p>Thank you for using our service. To complete your verification, please use the following One-Time Password (OTP):</p>\n" +
                        "            <div class=\"otp-code\">\n" +
                        "                " + otp + "\n" +
                        "            </div>\n" +
                        "            <p>Please note that this OTP is valid for 10 minutes. Do not share this code with anyone.</p>\n" +
                        "            <p>If you did not request this, please contact our support team immediately.</p>\n" +
                        "        </div>\n" +
                        "        <div class=\"footer\">\n" +
                        "            <p>Thank you,<br>The JobPortal Team</p>\n" +
                        "            <p><a href=\"https://example.com\">Visit our website</a></p>\n" +
                        "        </div>\n" +
                        "    </div>\n" +
                        "</body>\n" +
                        "</html>";
    }
}
