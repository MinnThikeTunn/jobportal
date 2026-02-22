import { Badge, Tabs } from "@mantine/core";
import JobDesc from "../JobDesc/JobDesc";
import { talents } from "../Data/TalentData";
import TalentCard from "../FindTalent/TalentCard";
import { useEffect, useState } from "react";

const PostedJobDesc = (props:any) => {
    const [tab, setTab] = useState<string>("overview");
    const [arr, setArr] = useState<any>([]);
    const handleTabChange = (value:any) => {
        setTab(value);
        if(value === "applicants"){
            setArr(props?.applicants?.filter((x:any)=>x.applicationStatus==="APPLIED"));
        } else if(value === "Invited"){
            setArr(props?.applicants?.filter((x:any)=>x.applicationStatus==="INTERVIEWING"));
        } else if(value === "offered"){
            setArr(props?.applicants?.filter((x:any)=>x.applicationStatus==="OFFERED"));
        } else if(value === "rejected"){
            setArr(props?.applicants?.filter((x:any)=>x.applicationStatus==="REJECTED"));
        }
    }


    useEffect(()=>{
        handleTabChange("overview");
    },[props])

    return(
        <div className="mt-5 w-3/4 px-5">
            {props.jobTitle?<><div className="text-2xl font-semibold flex items-center">{props.jobTitle} <Badge variant="light" ml="sm" color="#ffbd20" size="sm">{props.jobStatus}</Badge></div>
            <div className="font-medium text-mine-shaft-300 mb-5">
                {props.location}
            </div>
            <div>
            <Tabs variant="outline" radius="lg" value={tab} onChange={handleTabChange}>
                    <Tabs.List className=" [&_button]:!text-lg font-semibold mb-5 [&_button[data-active='true']]:text-bright-sun-400">
                        <Tabs.Tab value="overview">Overview</Tabs.Tab>
                        <Tabs.Tab value="applicants">Applicants</Tabs.Tab>
                        <Tabs.Tab value="Invited">Invited</Tabs.Tab>
                        <Tabs.Tab value="offered">Offered</Tabs.Tab>
                        <Tabs.Tab value="rejected">Rejected</Tabs.Tab>

                    </Tabs.List>

                    <Tabs.Panel value="overview" className="[&>div]:w-full">
                        <JobDesc {...props} edit closed={props.jobStatus==="CLOSED"}/>
                    </Tabs.Panel>
                    <Tabs.Panel value="applicants">
                        
                            <div className="flex mt-10 flex-wrap gap-5 justify-around">
                                {
                                    arr?.length?arr.map((talent:any,index:number)=><TalentCard key={index} {...talent} posted />):<div className="text-2xl font-semibold flex justify-center items-center ">No Applicants</div>
                                }
                            </div>
                        
                    </Tabs.Panel>
                    <Tabs.Panel value="Invited">
                            <div className="flex mt-10 flex-wrap gap-5 justify-around">
                            {
                                    arr?.length?arr.map((talent:any,index:number)=><TalentCard key={index} {...talent} invited />):<div className="text-2xl font-semibold flex justify-center items-center ">No Invited Candidates</div>
                                }
                            </div>
                    </Tabs.Panel>
                    <Tabs.Panel value="offered">
                            <div className="flex mt-10 flex-wrap gap-5 justify-around">
                            {
                                    arr?.length?arr.map((talent:any,index:number)=><TalentCard key={index} {...talent} offered />):<div className="text-2xl font-semibold flex justify-center items-center ">No Offered Candidates</div>
                                }
                            </div>
                    </Tabs.Panel>
                    <Tabs.Panel value="rejected">
                            <div className="flex mt-10 flex-wrap gap-5 justify-around">
                            {
                                    arr?.length?arr.map((talent:any,index:number)=><TalentCard key={index} {...talent} rejected />):<div className="text-2xl font-semibold flex justify-center items-center ">No Rejected Candidates</div>
                                }
                            </div>
                    </Tabs.Panel>
                </Tabs>
            </div>
            </>:<div className="text-2xl font-semibold flex justify-center items-center min-h-[70vh]">No Job Selected</div>}
        </div>
    )
}

export default PostedJobDesc;