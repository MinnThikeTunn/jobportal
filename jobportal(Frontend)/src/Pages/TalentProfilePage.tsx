import { Button } from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import { Link, useNavigate } from "react-router-dom";
import Profile from "../TalentProfile/Profile";
import { profile } from "../Data/TalentData";
import RecommendTalent from "../TalentProfile/RecommendTalent";
import { useEffect, useState } from "react";
import { getAllProfiles } from "../Services/ProfileService";

const TalentProfilePage=()=>{
    const navigate = useNavigate();
    const [talents, setTalents] = useState<any[]>([]);

    useEffect(()=>{
        getAllProfiles().then((data:any) => {
            setTalents(data)
        }).catch((error:any) => {
            console.error(error);
        });
    },[])

    return(
        <div className="min-h-[100vh] bg-mine-shaft-950 font-['poppins'] p-4">
            
            <Button onClick={()=>navigate(-1)} leftSection={<IconArrowLeft size={20}/> } color="#ffbd20" my="sm" variant="light" >Back</Button>
            
            <div className="flex gap-5">
                <Profile />
                <RecommendTalent talents={talents}/>
            </div>
            

            
        </div>  
    )
}
export default TalentProfilePage;