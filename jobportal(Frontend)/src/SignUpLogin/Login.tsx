import { TextInput, rem, PasswordInput, Button, LoadingOverlay } from "@mantine/core";
import { IconAt, IconCheck, IconLock, IconX } from "@tabler/icons-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../Services/AuthService";
import { loginValidation } from "../Services/FormValidation";
import { notifications } from "@mantine/notifications";
import { useDisclosure } from "@mantine/hooks";
import ResetPassword from "./ResetPassword";
import { useDispatch } from "react-redux";
import { setUser } from "../Slices/UserSlice";
import { setJwt } from "../Slices/JwtSlice";
import {jwtDecode} from "jwt-decode";

const form = {
    email: "",
    password: "",
}

const Login = () => {

    const [loading, setLoading] = useState(false);

    const [data, setData] = useState<{[key: string]: string}>(form);

    const [formError, setFormError] = useState<{[key: string]: string}>(form);

    const [opened, {open, close}] = useDisclosure(false);

    const navigate = useNavigate();

    const dispatch = useDispatch();


    const handleChange = (event: React.ChangeEvent<HTMLInputElement>|any) => {
        let name = event.target.name;
        let value = event.target.value;

        setFormError({ ...formError, [name]: "" });
        setData({ ...data, [name]: value });
        setFormError({ ...formError, [name]: loginValidation(name, value) });

    }

    const handleSubmit = () => {
        let valid = true;
        let newFormError:{[key: string]: string} = {};

        for (let key in data) {
        newFormError[key] = loginValidation(key, data[key]);
        if (newFormError[key]) valid = false;
        }

        setFormError(newFormError);

        if (valid) {
        setLoading(true);
            loginUser(data)
            .then(res => { 
                setData(form);
                notifications.show({
                  title: 'Login successful',
                  message: 'Redirecting to Home page',
                  withCloseButton: true,
                  icon: <IconCheck style={{width: "90%", height: "90%"}} />,
                  color: 'teal',
                  withBorder: true,
                  className:"!border-green-500"
                })
                dispatch(setJwt(res.jwt));
                const decoded = jwtDecode(res.jwt);
                dispatch(setUser({...decoded, email:decoded.sub}))
                setTimeout(() => {
                  setLoading(false);
                  navigate('/');
                }, 3000); 
              })
              .catch(err => {
                setLoading(false);
                notifications.show({
                  title: 'Login failed',
                  message: 'Bad Credentials or Something Went Wrong',
                  withCloseButton: true,
                  icon: <IconX style={{width: "90%", height: "90%"}} />,
                  color: 'red',
                  withBorder: true,
                  className:"!border-red-500"
                })
              })
        }
        
    }


    return<>
      <LoadingOverlay visible={loading} zIndex={1000} overlayProps={{radius: 'sm', blur: 2}} loaderProps={{color: 'bright-sun.4', type: 'bars'}} />
      <div className="w-1/2 px-20 flex flex-col justify-center gap-3">
        <div className="text-2xl font-semibold">Login Your Account</div> 
        <TextInput withAsterisk error={formError.email} name="email" value={data.email} onChange={handleChange}
            leftSection={<IconAt style={{width: rem(16), height: rem(16)}}/>} label="Email" placeholder="Your email"/>
        <PasswordInput name="password" error={formError.password} value={data.password} onChange={handleChange} withAsterisk leftSection={<IconLock size={18} stroke={1.5}/>} label="Password" placeholder="Password" />
        <Button onClick={handleSubmit} loading={loading} autoContrast variant="filled">Login</Button>
        <div className="mx-auto">Don't have an account? <span onClick={()=>{navigate('/signup'); setData(form); setFormError(form)}} className="text-bright-sun-400 hover:underline cursor-pointer">Signup</span></div>
        <div onClick={open} className="text-bright-sun-400 hover:underline cursor-pointer text-center">Forgot Password?</div>

      </div>
      <ResetPassword opened={opened} close={close}/>

    </>
}

export default Login;



