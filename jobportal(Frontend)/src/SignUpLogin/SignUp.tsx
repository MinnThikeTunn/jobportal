import { Anchor, Button, Checkbox, PasswordInput, rem, TextInput, Radio, Group, em, LoadingOverlay } from "@mantine/core";
import { IconAt, IconCheck, IconLock, IconX } from "@tabler/icons-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { registerUser } from "../Services/UserService";
import { signUpValidation } from "../Services/FormValidation";
import { notifications } from "@mantine/notifications";

const form = {
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
  accountType: "APPLICANT",
}

const SignUp = () => {

  const [data, setData] = useState<{[key: string]: string}>(form);

  const [formError, setFormError] = useState<{[key: string]: string}>(form);

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>|any) => {
    if(typeof event === 'string') {
      setData({ ...data, accountType: event });
      return;
    }

    let name = event.target.name;
    let value = event.target.value;

    setData({ ...data, [name]: value });
    setFormError({ ...formError, [name]: signUpValidation(name, value) });

    if (name === "password" && data.confirmPassword.length > 0) {
      let err = "";
      if (data.confirmPassword !== value) {
        err = "Passwords do not match";
      }
      setFormError({ ...formError, confirmPassword: err, [name] : signUpValidation(name, value) });
    }

    if (name === "confirmPassword") {
      if (data.password !== value) {
        setFormError({ ...formError, [name]: "Passwords do not match" });
      } else {
        setFormError({ ...formError, confirmPassword: "" });
      }
    }
    
  }

  const handleSubmit = () => {


    let valid = true;
    let newFormError:{[key: string]: string} = {};

    for (let key in data) {
      if (key === "accountType") continue;
      if (key != "confirmPassword") newFormError[key] = signUpValidation(key, data[key]);
      else if (data[key] !== data["password"]) newFormError[key] = "Passwords do not match";
      if (newFormError[key]) valid = false;
    }

    setFormError(newFormError);

    if (valid === true) {
    setLoading(true);
      
      registerUser(data)
      .then(res => { 
        setData(form);
        notifications.show({
          title: 'Account created successfully',
          message: 'Redirecting to login page',
          withCloseButton: true,
          icon: <IconCheck style={{width: "90%", height: "90%"}} />,
          color: 'teal',
          withBorder: true,
          className:"!border-green-500"
        })
        setTimeout(() => {
          setLoading(false);
          navigate('/login');
        }, 3000);
      })
      .catch(err => {
        setLoading(false);
        notifications.show({
          title: 'Registration failed',
          message: err.response.data.errorMessage,
          withCloseButton: true,
          icon: <IconX style={{width: "90%", height: "90%"}} />,
          color: 'red',
          withBorder: true,
          className:"!border-red-500"
        })
      })
    }

  }

  return (<>
  <LoadingOverlay visible={loading} zIndex={1000} className="translate-x-1/2" overlayProps={{radius: 'sm', blur: 2}} loaderProps={{color: 'bright-sun.4', type: 'bars'}} />
    <div className="w-1/2 px-20 flex flex-col justify-center gap-3">
      <div className="text-2xl font-semibold">Create Account</div>
      <TextInput name="username" error={formError.username} onChange={handleChange} value={data.username} withAsterisk label="Full Name" placeholder="Your Name" />
      <TextInput
        name="email"
        onChange={handleChange}
        value={data.email}
        error={formError.email}
        withAsterisk
        leftSection={<IconAt style={{ width: rem(16), height: rem(16) }} />}
        label="Email"
        placeholder="Your email"
      />
      <PasswordInput
        name="password"
        onChange={handleChange}
        value={data.password}
        error={formError.password}
        withAsterisk
        leftSection={<IconLock size={18} stroke={1.5} />}
        label="Password"
        placeholder="Password"
      />
      <PasswordInput
        name="confirmPassword"
        onChange={handleChange}
        error={formError.confirmPassword}
        value={data.confirmPassword}
        withAsterisk
        leftSection={<IconLock size={18} stroke={1.5} />}
        label="Confirm Password"
        placeholder="Confirm password"
      />
      <Radio.Group
        value={data.accountType}
        onChange={handleChange}
        label="You are?"
        withAsterisk
      > 
        <Group mt='xs'>
          <Radio className="py-4 px-6 border border-mine-shaft-800 rounded-lg has-[:checked]:border-bright-sun-400 has-[:checked]:bg-bright-sun-400/5 hover:bg-mine-shaft-900" autoContrast value="APPLICANT" label="Applicant" />
          <Radio className="py-4 px-6 border border-mine-shaft-800 rounded-lg has-[:checked]:border-bright-sun-400 has-[:checked]:bg-bright-sun-400/5 hover:bg-mine-shaft-900" autoContrast value="EMPLOYER" label="Employer" />
          
        </Group>
        
      </Radio.Group>
      <Checkbox
        autoContrast
        label={
          <>
            I accept <Anchor>terms & conditions</Anchor>
          </>
        }
      />
      <Button loading={loading} onClick={handleSubmit} autoContrast variant="filled">Sign up</Button>
      <div className="mx-auto">
        Have an account? <span onClick={()=>{navigate('/login'); setData(form); setFormError(form)}} className="text-bright-sun-400 hover:underline cursor-pointer">Login</span>
      </div>
    </div>
    </>
  );
}

export default SignUp;