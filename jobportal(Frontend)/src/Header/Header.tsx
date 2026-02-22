import { Indicator, Button } from "@mantine/core";
import { IconBell, IconSettings, IconAnchor } from '@tabler/icons-react';
import NavLinks from "./NavLinks";
import { useLocation, Link, useNavigate } from "react-router-dom";
import ProfileMenu from "./ProfileMenu";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProfile } from "../Services/ProfileService";
import { setProfile } from "../Slices/ProfileSlice";
import NotiMenu from "./NotiMenu";
import { jwtDecode } from "jwt-decode";
import { setUser } from "../Slices/UserSlice";
import { setupResponseInterceptor } from "../Inteceptor/AxiosInterceptor";

const Header = () => {
    const location = useLocation();

    const dispatch = useDispatch();

    const user = useSelector((state:any)=>state.user);
    const profile = useSelector((state:any)=>state.profile);
    const token = useSelector((state:any)=>state.jwt);
    const navigate = useNavigate();

    useEffect(()=>{
        setupResponseInterceptor(navigate, location);
        

    },[navigate, location])
    

    useEffect(()=>{
        if(token!=""){
            const decoded = jwtDecode(token);
            dispatch(setUser({...decoded, email: decoded.sub}));
        }
        
        if(location.pathname !== "/signup" && location.pathname !== "/login" && user){
            getProfile(user?.profileId).then((data:any) => {
                dispatch(setProfile(data))
            }).catch((error:any) => {
                console.log(error);
            });
        }
    },[token, dispatch])

    

    return location.pathname !== "/signup" && location.pathname !== "/login" ? (
        <div className="w-full bg-mine-shaft-950 px-6 text-white h-20 flex justify-between items-center font-['poppins']">
            <div className="flex gap-1 items-center text-bright-sun-400">
                {/* <IconAnchor className="h-8 w-8" stroke={2.5} /> */}
                <div className="text-3xl font-semibold" onClick={()=>navigate("/")}>JobBox</div>
            </div>
            {NavLinks()}
            <div className="flex gap-3 items-center">
                
                    
                        {user ? <ProfileMenu /> : <Link to="/login"><Button variant="subtle" color="bright-sun.4">Login</Button></Link>}
                        {/* <div className="bg-mine-shaft-900 p-1.5 rounded-full">
                            <IconSettings stroke={1.5} />
                        </div> */}
                        {user ? <NotiMenu /> : <> </>}
                        
                        
                    
                
            </div>
        </div>
    ) : null;
}

export default Header;