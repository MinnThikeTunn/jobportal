import { searchFields } from "../Data/TalentData";
import { Divider, RangeSlider } from "@mantine/core";
import React, { useState } from "react";
import MultiInput from "../FindJobs/MultiInput";
import { IconUserCircle } from "@tabler/icons-react";
import { Input } from '@mantine/core';
import { useDispatch } from "react-redux";
import { updateFilter } from "../Slices/FilterSlice";

const SearchBar=()=>{
    const dispatch = useDispatch();
    const [value, setValue] = useState<[number , number]>([0, 50]);
    const [name, setName] = useState<any>("");
    const handleChange = (name:any, event:any) => {
        if(name=="exp"){
            dispatch(updateFilter({exp:event}))
        }else{
            setName(event.target.value);
            dispatch(updateFilter({name:event.target.value}))
        }
    }

    return <div className="flex  text-mine-shaft-100 items-center px-5 py-8 ">
        <div className="flex items-center">
            <div className="text-bright-sun-400 bg-mine-shaft-900 rounded-full p-1 mr-2">
                <IconUserCircle size={20}/>
            </div>
            <Input defaultValue={name} onChange={(e)=>handleChange("name",e)} className=" [&_input]:!placeholder-mine-shaft-300" variant="unstyled" placeholder="Talent Name" />
        </div>
        {
            searchFields.map((item, index)=>{
            return <React.Fragment key={index}><div className="w-1/5">
                <MultiInput title={item.title} icon={item.icon} options={item.options} />
            </div>
                <Divider mr="xs" size="xs" orientation="vertical" />
            </React.Fragment>})
        }
            <div className="w-1/5 [&_.mantine-Slider-label]:!translate-y-10">
                <div className="flex text-sm justify-between">
                    <div>Experience (Year)</div>
                    <div>{value[0]}  - {value[1]} </div>
                </div>
                <RangeSlider color="yellow" size="xs" minRange={1} min={1} max={50} value={value} labelTransitionProps={{
                transition: 'skew-down',
                duration: 150,
                timingFunction: 'linear',
                }} onChange={setValue}
                onChangeEnd={(e)=>handleChange("exp",e)}
                 />
            </div>
        
        </div>
}
export default SearchBar;