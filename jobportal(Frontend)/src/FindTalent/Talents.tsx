import { useEffect, useState } from "react";
import { talents } from "../Data/TalentData";
import Sort from "../FindJobs/Sort";
import TalentCard from "./TalentCard";
import { getAllProfiles } from "../Services/ProfileService";
import { useDispatch, useSelector } from "react-redux";
import { resetFilter, updateFilter } from "../Slices/FilterSlice";
import { resetSort } from "../Slices/SortSlice";
import { getFilteredProfiles } from "../Services/ProfileService";

const Talents=()=>{
    const dispatch = useDispatch();
    const filter = useSelector((state:any)=>state.filter);
    const [filteredTalents, setFilteredTalents] = useState<any[]>([]);
    const [talents, setTalents] = useState<any[]>([]);
    const sort = useSelector((state:any)=>state.sort);
    useEffect(()=>{
        dispatch(resetFilter());
        dispatch(resetSort());
        getAllProfiles().then(res=>{
            setTalents(res)
        }).catch(err=>{
            console.error(err);
        })
    },[])

    useEffect(()=>{
        // if(sort=="Experience: Low to High"){
        //     setTalents([...talents].sort((a:any,b:any)=>a.totalExp-b.totalExp))
        // }
        // else if(sort=="Experience: High to Low"){
        //     setTalents([...talents].sort((a:any,b:any)=>b.totalExp-a.totalExp))
        // }
        dispatch(updateFilter({sortBy: sort}))
        getFilteredProfiles(filter).then(res=>{
            setTalents(res)
        }
        ).catch(err=>{
            console.error(err);
        }
        )
    },[sort])

    useEffect(()=>{
        let filterTalent = [...talents]
        setFilteredTalents(filterTalent)
        // if(filter.name){
        //     filterTalent = filterTalent.filter((talent:any)=>talent.name.toLowerCase().includes(filter.name.toLowerCase())) // change with backend filter algorithm
        //     setFilteredTalents(filterTalent)
        // }
        // if(filter["Job Title"] && filter["Job Title"].length > 0){
        //     filterTalent = filterTalent.filter((talent:any)=>filter["Job Title"]?.some((title:any)=>talent?.jobTitle?.toLowerCase().includes(title?.toLowerCase())))
        //     setFilteredTalents(filterTalent)
        // }
        // if(filter.Location && filter.Location.length > 0){
        //     filterTalent = filterTalent.filter((talent:any)=>filter.Location?.some((location:any)=>talent?.location?.toLowerCase().includes(location?.toLowerCase())))
        //     setFilteredTalents(filterTalent)
        // }
        // if(filter.Skills && filter.Skills.length > 0){
        //     filterTalent = filterTalent.filter((talent:any)=>filter.Skills?.some((skill:any)=>talent?.skills?.some((talentSkill:any)=>talentSkill.toLowerCase().includes(skill.toLowerCase()))))
        //     setFilteredTalents(filterTalent)
        // }
        // if(filter.exp && filter.exp.length > 0){
        //     filterTalent = filterTalent.filter((talent:any)=>filter.exp[0] <= talent.totalExp && talent.totalExp <= filter.exp[1])
        //     setFilteredTalents(filterTalent)
        // }

        getFilteredProfiles(filter).then(res=>{
            setFilteredTalents(res)
        }
        ).catch(err=>{
            console.error(err);
        }
        )




    },[filter, talents])


    return <div className="p-5">
        <div className="flex justify-between">
            <div className="text-2xl font-semibold">Talents</div>
            <Sort sort="talent"/>
        </div>
        <div className="mt-10 flex flex-wrap gap-5  justify-center">
            {
                filteredTalents?.length?filteredTalents.map((talent:any,index:number)=><TalentCard key={index} {...talent} />):<div className="text-2xl font-semibold">No Talents found</div>
            }
        
        </div>
    </div>
}
export default Talents;