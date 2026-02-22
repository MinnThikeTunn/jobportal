import { Button, Divider } from "@mantine/core";
import { IconBriefcase, IconMapPin } from "@tabler/icons-react";
import ExpCard from "./ExpCard";
import CertiCard from "./CertiCard";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getProfile } from "../Services/ProfileService";

const Profile=()=>{

    const {id} = useParams();
    const [profile, setProfile] = useState<any>({});

    useEffect(()=>{
        window.scrollTo(0,0);
        getProfile(id).then((data:any) => {
            setProfile(data)
        }).catch((error:any) => {
            console.log(error);
        });
    },[id])
    
    return <div className="w-2/3">
        <div className="relative">
            <img className="rounded-t-2xl" src="/Profile/banner.jpg" alt="banner" />
            <img className="w-48 h-48  rounded-full -bottom-[4rem] absolute left-3 border-mine-shaft-950 border-8" src={profile.picture?`data:image/jpeg;base64,${profile.picture}`:"/avatar.png"} alt="banner" />
        </div>
            <div className="px-3 mt-16">
                <div className="text-3xl font-semibold flex justify-between">{profile?.name}<Button color="#ffbd20" variant="light" >Messege</Button> </div>
                <div className="text-xl flex gap-1 items-center"><IconBriefcase className="h-5 w-5" stroke={1.5}/>{profile?.jobTitle} &bull; {profile?.company}</div>
                <div className="text-xl flex gap-1 items-center text-mine-shaft-300">
                    <IconMapPin className="h-5 w-5" stroke={1.5}/>{profile?.location}
                </div>
                <div className="text-xl flex gap-1 items-center text-mine-shaft-300">
                    <IconBriefcase className="h-5 w-5" stroke={1.5}/>Total Experience: {profile?.totalExp} Years
                </div>

            </div>
            <Divider mx="xs" my="xl" />
            <div className="px-3">
                <div className="text-2xl font-semibold mb-3">About</div>
                <div className="text-sm text-mine-shaft-300 text-justify">
                    {profile?.about}
                </div>
            </div>
            <Divider mx="xs" my="xl" />
            <div className="px-3">
                <div className="text-2xl font-semibold mb-3">Skills</div>
                <div className="flex flex-wrap gap-2">
                    {profile?.skills?.map((skill:any, index:any) => (
                        <div key={index} className="bg-bright-sun-300 bg-opacity-15 rounded-3xl text-sm font-medium text-bright-sun-400 px-3 py-1">
                        {skill}
                    </div>
                    ))}
                    

                </div>
            </div>
            <Divider mx="xs" my="xl" />
            <div className="px-3">
                <div className="text-2xl font-semibold mb-5">Experience</div>
                <div className="flex flex-col gap-8">
                    {profile?.experiences?.map((exp:any, index:any) => (
                        <ExpCard key={index} {...exp}/>
                    ))}
                </div>
            </div>
            <Divider mx="xs" my="xl" />
            <div className="px-3">
                <div className="text-2xl font-semibold mb-5">Certifications</div>
                <div className="flex flex-col gap-8">
                    {profile?.certifications?.map((certification:any, index:any) => (
                        <CertiCard key={index} {...certification}/>
                    ))}
                </div>
            </div>
        </div>
}
export default Profile;