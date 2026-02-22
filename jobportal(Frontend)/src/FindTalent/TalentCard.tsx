import { Avatar, Divider, Text, Button, Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconCalendarMonth, IconHeart, IconMapPin } from "@tabler/icons-react";
import { Link, useParams } from "react-router-dom";

import { DateInput, TimeInput } from '@mantine/dates';
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { getProfile } from "../Services/ProfileService";
import { changeAppStatus } from "../Services/JobService";
import { errorNotification, successNotification } from "../Services/NotificationService";
import { formatInterviewTime, openBase64PDFInNewTab } from "../Services/Utilities";


const TalentCard=(props:any)=>{
    const {id} = useParams();
    const [opened, { open, close }] = useDisclosure(false);
    const [app, {open:openApp, close:closeApp}] = useDisclosure(false);
    const [date, setDate] = useState<Date | null>(null);
    const [time, setTime] = useState<any>(null);
    const ref = useRef<HTMLInputElement>(null);
    const [profile, setProfile] = useState<any>({});

    useEffect(()=>{
        if(props.applicantId){
            getProfile(props.applicantId).then((data:any) => {
                setProfile(data)
            }).catch((error:any) => {
                console.log(error);
            });
        } else {
            setProfile(props)
        }
    },[props])

    const handleOffer = (status:any) => {

        let interview:any = {id, applicantId:profile?.id, applicationStatus:status}

        if(status == "INTERVIEWING"){
            const [hours, minutes] = time.split(":").map(Number)
            date?.setHours(hours, minutes)
            interview = {...interview, interviewTime: date}
        }
        
        changeAppStatus(interview).then(res=>{
            if(status == "INTERVIEWING") successNotification("Interview Scheduled", "Interview has been scheduled successfully")
            else if(status == "OFFERED") successNotification("Offered", "Offer has been sent successfully")
            else successNotification("Offer Rejected", "Offer has been rejected successfully")
            setTimeout(() => {
                window.location.reload()
            }, 2000);
        }).catch(err=>{
            errorNotification("Failed to schedule", err.response.data.errorMessage)
            console.error(err);
        })
    }



    return <div className="bg-mine-shaft-900 p-4 w-96 flex flex-col gap-3 rounded-xl hover:shadow-[0_0_5px_1px_yellow] !shadow-bright-sun-400">
            <div className="flex justify-between">
                <div className="flex gap-2 items-center">
                    <div className="p-2 bg-mine-shaft-800 rounded-full">
                        <Avatar  size="lg" src={profile?.picture?`data:image/jpeg;base64,${profile?.picture}`:"/avatar.png"} alt="" />
                    </div>
                    <div>
                        <div className="font-semibold text-lg">{props?.name} </div>
                        <div className="text-sm text-mine-shaft-300">{profile?.jobTitle} &bull; {profile?.company}</div>
                    </div>
                </div>
                {/* <IconHeart className="text-mine-shaft-300 cursor-pointer"/> */}
            </div>
            <div className="flex gap-2 ">
                {
                    profile?.skills?.map((skill:any,index:any)=> index < 4 && <div key={index} className="py-2 px-2 bg-mine-shaft-800 text-bright-sun-400 rounded-lg text-xs">{skill}</div>)
                }
                
           </div>
        <Text className="!text-xs text-justify !text-mine-shaft-300" lineClamp={3}>{profile?.about}</Text>
            <Divider size="sm" color="#4f4f4f" />
            {
                props.invited?<div className="flex gap-1 text-mine-shaft-200 text-sm items-center">
                    <IconCalendarMonth stroke={1.5 }/>Interview: {formatInterviewTime(props.interviewTime)}
                </div>: <div className="flex justify-between">
                <div className=" text-mine-shaft-300">
                    Exp: {props.totalExp?props.totalExp:1} Years
                </div>
                <div className="flex gap-1 text-xs text-mine-shaft-400 items-center">
                    <IconMapPin className="h-5 w-5" stroke={1.5}/>{profile?.location}
                </div>
            </div>
            }
           
            <Divider size="sm" color="#4f4f4f" />
            <div className="flex w-full [&>*]:p-1">
                {
                    !props.invited&&<>
                        <Link  to={`/talent-profile/${profile?.id}`} className="w-full">
                            <Button color="#ffbd20" variant="outline" fullWidth>Profile</Button>
                        </Link>
                        <div>
                            {props.posted?<Button onClick={open} leftSection={<IconCalendarMonth className="w-5 h-5"/>} color="#ffbd20" variant="light" fullWidth>Schedule</Button>:<></>}
                        </div>
                    </>
                }
                {
                    props.invited&&<>
                        <div>
                        <Button color="#ffbd20" variant="outline" onClick={()=>handleOffer("OFFERED")} fullWidth>Accept</Button>
                        </div>
                        <div>
                        <Button color="#ffbd20" variant="light" onClick={()=>handleOffer("REJECTED")} fullWidth >Reject</Button>    
                        </div>
                    </>
                }
                
            </div>
                
            { (props.invited || props.posted) && <Button color="#ffbd20" onClick={openApp} variant="filled" fullWidth autoContrast>View Application</Button> }

            <Modal opened={opened} onClose={close} title="Schedule Interview" centered>
                <div className="flex flex-col gap-4">
                    <DateInput value={date} minDate={new Date( )} onChange={setDate} label="Date"     placeholder="Enter Date"/>
                    <TimeInput label="Time" value={time} onChange={(e)=>setTime(e.currentTarget.value)} ref={ref} onClick={() => ref.current?.showPicker()} />
                    <Button onClick={()=>handleOffer("INTERVIEWING")} color="#ffbd20" variant="light" fullWidth>Schedule</Button>
                </div>     
            </Modal>

            <Modal opened={app} onClose={closeApp} title="Application" centered>
                <div className="flex flex-col gap-4">
                    <div>
                        Email: &emsp;<a href={`mailto:${props.email}`} className="text-bright-sun-400 hover:underline cursor-pointer text-center">{props.email}</a>
                    </div>
                    <div>
                        Website: &emsp;<a target="_blank" href={props.website} className="text-bright-sun-400 hover:underline cursor-pointer text-center">{props.website}</a>
                    </div>
                    <div>
                        Resume: &emsp;<span onClick={()=>openBase64PDFInNewTab(props.resume)} className="text-bright-sun-400 hover:underline cursor-pointer text-center">{props.name}</span>
                    </div>
                    <div>
                        Cover Letter: &emsp;<div>{props.coverLetter}</div>
                    </div>
                </div>     
            </Modal>
        </div>
}
export default TalentCard;