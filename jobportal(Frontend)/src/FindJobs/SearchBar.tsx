import MultiInput from "./MultiInput";
import { dropdownData } from "../Data/JobsData";
import { Divider, RangeSlider } from "@mantine/core";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { updateFilter } from "../Slices/FilterSlice";
import React from "react";

const SearchBar=()=>{
    const dispatch = useDispatch();
    const [value, setValue] = useState<[number , number]>([0, 300]);
    const handleChange = (event:any) => {
        dispatch(updateFilter({salary:event}))
    }    
    
    return <div className="flex px-5 py-8">
        {
            dropdownData.map((item, index)=><React.Fragment key={index}><div className="w-1/4">
                <MultiInput {...item}/>
            </div>
                <Divider mr="xs" size="xs" orientation="vertical" />
            </React.Fragment>)
        }
            {/* <div className="w-1/5 [&_.mantine-Slider-label]:!translate-y-10">
                <div className="flex text-sm justify-between">
                    <div>Salary</div>
                    <div>{value[0]} $  - {value[1]} $</div>
                </div>
                <RangeSlider color="yellow" minRange={1} min={1} max={300} size="xs" value={value} labelTransitionProps={{
                transition: 'skew-down',
                duration: 150,
                timingFunction: 'linear',
                }} onChange={setValue}
                onChangeEnd={handleChange}
                 />
            </div> */}
        
        </div>
}
export default SearchBar;