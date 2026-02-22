import { Divider } from "@mantine/core";
import Jobs from "../FindJobs/Jobs";
import SearchBar from "../FindJobs/SearchBar";

const FindJobs=()=>{
    return(
        <div className="min-h-[100vh] bg-mine-shaft-950 font-['poppins']">
            <SearchBar/>
            <Divider size="sm" mx="md" />
            <Jobs/>
        </div>  
    )
}
export default FindJobs;