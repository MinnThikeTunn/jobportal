import { Button, Divider } from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import ApplyJobComp from "../ApplyJob/ApplyJobComp";
import { useState, useEffect } from "react";
import { getJob } from "../Services/JobService";

const ApplyJobPage=()=>{
    const navigate = useNavigate();
    const {id} = useParams();
    const [job, setJob] = useState<any>(null);
    useEffect(()=>{
        window.scrollTo(0,0);
        getJob(id).then(res=>{
            setJob(res);
        }).catch(err=>{
            console.error(err);
        })
    },[id])
    
    return(
        <div className="min-h-[100vh] bg-mine-shaft-950 font-['poppins'] p-4">
            {/* <Divider size="xs" mb="xs" /> */}
            <Button my="md" leftSection={<IconArrowLeft size={20}/> } onClick={()=>navigate(-1)} color="#ffbd20" variant="light" >Back</Button>
               
            <ApplyJobComp {...job}/>
        </div>  
    )
}
export default ApplyJobPage;