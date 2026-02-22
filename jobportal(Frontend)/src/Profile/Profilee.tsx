import { ActionIcon,  Avatar,  Divider, FileInput, Indicator, Overlay, TagsInput, Textarea } from "@mantine/core";
import { IconBriefcase, IconDeviceFloppy, IconEdit, IconMapPin, IconPencil, IconPlus } from "@tabler/icons-react";
import ExpCard from "./ExpCard";
import CertiCard from "./CertiCard";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SelectInput from "./SelectInput";
import fields from "../Data/Profile";
import { profile } from "../Data/TalentData";
import ExpInput from "./ExpInput";
import CertiInput from "./CertiInput";
import { getProfile } from "../Services/ProfileService";
import Info from "./Info";
import { changeProfile, setProfile } from "../Slices/ProfileSlice";
import About from "./About";
import Skills from "./Skills";
import Experience from "./Experience";
import Certification from "./Certification";
import { useHover } from "@mantine/hooks";
import { successNotification } from "../Services/NotificationService";
import { getBase64 } from "../Services/Utilities";

const Profile=()=>{

    const dispatch = useDispatch();

    const profile = useSelector((state:any)=>state.profile);

    const {hovered, ref} = useHover()

    
    
    const handleFileChange = async (image: any) => {
        let picture: any = await getBase64(image);
        picture = cleanBase64(picture.split(",")[1]); // Sanitize Base64 string
        let updatedProfile = { ...profile, picture };
        dispatch(changeProfile(updatedProfile));
        successNotification("Success", "Profile picture updated successfully");
    };

    const cleanBase64 = (base64: string) => {
        return base64.replace(/[^A-Za-z0-9+/=]/g, ""); // Remove invalid characters
    };
    

    

      
      const select=fields;
    return <div className="w-4/5 mx-auto">
        <div className="relative">
            <img className="rounded-t-2xl" src="/Profile/banner.jpg" alt="banner" />
            <div ref={ref} className="absolute flex items-center justify-center -bottom-[4rem] left-3">
                
                    <Avatar src={profile.picture?`data:image/jpeg;base64,${profile.picture}`:"/avatar.png"} className="!w-48 !h-48 border-mine-shaft-950 border-8 rounded-full" alt="avatar"  />
                    {hovered && <Overlay color="#000" className="!rounded-full" backgroundOpacity={0.75}/>}
                    {hovered && <IconEdit className="absolute z-[300] !w-16 !h-16" />}
                    {hovered && <FileInput onChange={handleFileChange} className="absolute  w-full z-[301] !h-full [&_*]:!h-full [&_*]:!rounded-full" variant="transparent" accept="image/png,image/jpg,image/jpeg" />}
                
            </div>
        </div>
            <div className="px-3 mt-16">
                <Info />
                
                


                <Divider mx="xs" my="xl" />
                <About />
        </div>
            
            
            <Divider mx="xs" my="xl" />
            <div className="px-3">
                <Skills />
                    
                
            </div>
            <Divider mx="xs" my="xl" />
            <div className="px-3">
                <Experience />
            </div>
            <Divider mx="xs" my="xl" />
            <div className="px-3">
                <Certification />
            </div>
        </div>
}
export default Profile;

