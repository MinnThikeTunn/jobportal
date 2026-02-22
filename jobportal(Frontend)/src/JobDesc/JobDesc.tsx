import { ActionIcon, Button, Divider } from "@mantine/core";
import { IconBookmark, IconBookmarkFilled } from "@tabler/icons-react";
import { Link, useLocation, useParams } from "react-router-dom";
import { card, desc, skills } from "../Data/JobDescData";
import DOMPurify from "dompurify";
import { timeAgo } from "../Services/Utilities";
import { useDispatch, useSelector } from "react-redux";
import { changeProfile } from "../Slices/ProfileSlice";
import { useEffect, useState } from "react";
import { postJob } from "../Services/JobService";
import { errorNotification, successNotification } from "../Services/NotificationService";

const JobDesc =(props:any)=>{
    const data = DOMPurify.sanitize(props.description);
    const profile = useSelector((state:any)=>state.profile);
    const user = useSelector((state:any)=>state.user);
    const dispatch = useDispatch();
    const [applied, setApplied] = useState(false);
    const location = useLocation();
    const {id} = useParams()


    useEffect(()=>{
        if(props.applicants?.filter((applicant:any)=>applicant.applicantId == user.id).length>0){
            setApplied(true);
        }
        else {
            setApplied(false);
        }
    },[props])

    const handleSaveJob = () => {
        let savedJobs:any = [];
        if(profile.savedJobs){
             savedJobs  = [...profile.savedJobs];
        }
        if(savedJobs?.includes(props.jobId)){
            savedJobs = savedJobs.filter((jobId:any)=>jobId!=props.jobId);
        }else{
            savedJobs = [...savedJobs, props.jobId];
        }
        let updatedProfile = {...profile, savedJobs};
        dispatch(changeProfile(updatedProfile));
    }

    const handleClose = () => {
        postJob({...props, jobStatus: "CLOSED"}).then(res => {
            successNotification("Success", "Job closed successfully")
        }).catch(err => {
            errorNotification("Error", err.response.data.errorMessage)
        })
    }


    return <div className="w-2/3">
        <div className="flex justify-between">
                <div className="flex gap-2 items-center">
                    <div className="p-3 bg-mine-shaft-800 rounded-xl">
                        <img className="h-14" src={`/Icons/${props.company}.png`} alt="" />
                    </div>
                    <div className="flex flex-col gap-1" >
                        <div className="font-semibold text-2xl">{props.jobTitle}</div>
                        <div className="text-lg text-mine-shaft-300">{props.company} &#x2022; {timeAgo(props.postTime)} &#x2022; {props.applicants?props.applicants.length:0} Applicants</div>
                    </div>
                </div>
                <div className="flex flex-col gap-2 items-center">
                    {(props.edit || !applied ) && <Link to={props.edit?`/post-job/${props.jobId}`:props.jobStatus=="CLOSED"?"":`/apply-job/${props.jobId}`}>
                        <Button color={props.jobStatus=="CLOSED"&&location.pathname!=`/posted-jobs/${id}`?"red.8":"bright-sun.4"} size="sm" variant="light" >{props.closed?"Reopen":props.jobStatus=="CLOSED"?"Closed":props.edit?"Edit":"Apply"}</Button>
                    </Link>}
                    {
                       !props.edit && applied && <Button color="green.8" size="sm" variant="light" >Applied</Button>
                    }
                    
                    
                    
                    {props.edit && !props.closed ?<Button color="red.5" size="sm" variant="outline"  onClick={handleClose} >Close</Button>:profile.savedJobs?.includes(props.jobId)?<IconBookmarkFilled onClick={handleSaveJob} className=" text-bright-sun-400 cursor-pointer" stroke={1.5}/>:<IconBookmark onClick={handleSaveJob} className="text-mine-shaft-300 hover:text-bright-sun-400 cursor-pointer" stroke={1.5}/>}
                </div>
            </div>
            <Divider my="xl"/>
            <div className="flex justify-between">
                {
                    card.map((item:any , index:number)=> <div key={index} className="flex flex-col items-center gap-1">
                    <ActionIcon color="#ffbd20" className="!h-12 !w-12" variant="light" radius="xl" aria-label="Settings">
                    <item.icon className="h-4/5 w-4/5" stroke={1.5} />
                    </ActionIcon>
                    <div className="text-sm text-mine-shaft-300">{item.name}</div>
                    <div className="font-semibold">{props?props[item.id]:"NA"} {item.id=="packageOffered"&&<>$</>}</div>
                    </div>)
                }
                
            </div>
            <Divider my="xl"/>
            <div>
                <div className="text-xl font-semibold mb-5">Required Skills</div>
                <div className="flex flex-wrap gap-2">
                    {
                        props?.skillsRequired?.map((item:any , index:number)=> <ActionIcon key={index} color="#ffbd20" className="!h-fit font-medium !text-sm !w-fit" p="xs" variant="light" radius="xl" aria-label="Settings">{item}
                    </ActionIcon>)
                    }
                    
                </div>
            </div>
            <Divider my="xl"/>
            <div className="[&_h4]:text-xl [&_*]:text-mine-shaft-300 [&_li]:marker:text-bright-sun-400 [&_li]:mb-1 [&_h4]:my-5 [&_h4]:font-semibold [&_h4]:text-mine-shaft-200 [&_p]:text-justify" dangerouslySetInnerHTML={{__html:data}}>
            </div>
            <Divider my="xl"/>
            <div>
                <div className="text-xl font-semibold mb-5">About Company</div>
                <div className="flex justify-between mb-3">
                <div className="flex gap-2 items-center">
                    <div className="p-3 bg-mine-shaft-800 rounded-xl">
                        <img className="h-8" src={`/Icons/${props.company}.png`} alt="" />
                    </div>
                    <div className="flex flex-col" >
                        <div className="font-medium text-lg">{props.company}</div>
                        <div className="text-mine-shaft-300">10K+ Employees</div>
                    </div>
                </div>
                    <Link to={`/company/${props.company}`}>
                        <Button color="#ffbd20" variant="light" >Company Page</Button>
                    </Link>
            </div>
            <div className="text-mine-shaft-300 text-justify">Lorem ipsum dolor sit amet consectetur adipisicing elit. Nesciunt beatae hic nostrum ab quisquam recusandae facere eum tenetur, ratione molestias rerum molestiae illum numquam deserunt voluptatem, nulla voluptatum tempora sapiente repellendus ducimus a iure. Ab consequatur aspernatur voluptates ipsum tenetur?</div>
            </div>
    </div>
}
export default JobDesc;