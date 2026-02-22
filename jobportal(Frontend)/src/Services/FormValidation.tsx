const signUpValidation = (name: string, value: string) => {
    switch (name) {
        case "username":
            if (value.length === 0) {
                return "Username is required";
            }
            return "";
        case "email":
            if (value.length === 0) {
                return "Email is required";
            }
            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if (!emailRegex.test(value)) {
                return "Invalid email";
            }
            return "";
        case "password":
            if (value.length === 0) {
                return "Password is required";
            }
            const passwdRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}$/;
            if (!passwdRegex.test(value)) {
                return "Password must be 8 to 15 characters and contain one uppercase letter, one lowercase letter, one number and one special character";
            }
            return "";
        case "confirmPassword":
            if (value.length === 0) {
                return "Confirm password is required";
            }
            return "";
        default:
            return "";
        
    }
};

const loginValidation = (name: string, value: string) => {
    switch (name) {
        
        case "email":
            if (value.length === 0) {
                return "Email is required";
            }
            return "";
            
        case "password":
            if (value.length === 0) {
                return "Password is required";
            }
            return "";
        default:
            return "";
        
    }
};

export {signUpValidation, loginValidation};