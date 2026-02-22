import { useEffect, useState } from "react";
import { jobList } from "../Data/JobsData";
import JobCard from "./JobCard";
import Sort from "./Sort";
import { getAllJobs, getFilteredJobs, getRecommendedJobs } from "../Services/JobService";
import { useDispatch, useSelector } from "react-redux";
import { resetFilter, updateFilter } from "../Slices/FilterSlice";
import { resetSort } from "../Slices/SortSlice";
import { Divider } from "@mantine/core";
const Jobs=()=>{

    const [jobList, setJobList] = useState([{}]);
    const [allJobs, setAllJobs] = useState([{}]);
    const [filteredAllJobs, setFilteredAllJobs] = useState([{}]);

    const filter = useSelector((state:any)=>state.filter);
    const sort = useSelector((state:any)=>state.sort);
    const profile = useSelector((state:any)=>state.profile);
    const [filteredJobs, setFilteredJobs] = useState<any[]>([]);
    const dispatch = useDispatch();


    useEffect(()=>{
        dispatch(resetFilter());
        dispatch(resetSort());
        let job = {desiredJobTitle: profile?.jobTitle, userSkills: profile?.skills}
            getRecommendedJobs(job).then(res=>{
                setJobList(res)
            }).catch(err=>{
                console.error(err);
            })

            getAllJobs().then(res=>{
                setAllJobs(res)
            }).catch(err=>{
                console.error(err);
            })

        
    },[profile])

    
    // useEffect(()=>{
        

    //     dispatch(updateFilter({sortBy: sort}))
    //     const filterAndJobLists = {filter, jobList};
    //     getFilteredJobs(filterAndJobLists).then(res=>{
    //         setJobList(res)
    //     }
    //     ).catch(err=>{
    //         console.error(err);
    //     }
    //     )
    // },[sort,jobList, dispatch])


    useEffect(()=>{
        // dispatch(updateFilter({sortBy: sort}))        
       

        const filterAndJobLists = {filters: filter, jobs: jobList};
        getFilteredJobs(filterAndJobLists).then(res=>{
            setFilteredJobs(res)
        }
        ).catch(err=>{
            console.error(err);
        }
        )

        const filterandAllJobs = {filters: filter, jobs: allJobs};
        getFilteredJobs(filterandAllJobs).then(res=>{
            setFilteredAllJobs(res)
        }
        ).catch(err=>{
            console.error(err);
        }
        )


    },[filter, jobList])

    



    return <div className="px-5 py-5">
        <div className="flex justify-between mt-5">
            <div className="text-2xl font-semibold">Recommended Jobs</div>
            {/* <Sort sort="job"/> */}
        </div>
        <div className=" flex mt-10 flex-wrap gap-5 mb-3">
                {
                    filteredJobs?.length?filteredJobs.map((job:any , index:number)=> <JobCard key={index} {...job} />):<div className="text-2xl font-semibold">No Jobs found</div>
                }
        </div>
        <Divider label="All Jobs" />
        <div className="flex justify-between mt-3">
            <div className="text-2xl font-semibold">All Jobs</div>
        </div>
        <div className=" flex mt-10 flex-wrap gap-5">
                {
                    filteredAllJobs?.length?filteredAllJobs.map((job:any , index:number)=> <JobCard key={index} {...job} />):<div className="text-2xl font-semibold">No Jobs found</div>
                }
        </div>
    </div>
}
export default Jobs;