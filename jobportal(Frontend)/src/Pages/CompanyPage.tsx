import { Button, Divider } from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import Company from "../CompanyProfile/Company";
import SimlarCompanies from "../CompanyProfile/SimilarCompanies";

const CompanyPage=()=>{
    const navigate=useNavigate();
    return(
        <div className="min-h-[100vh] bg-mine-shaft-950 font-['poppins'] p-4">
            <Divider size="xs"/>
                 <Button  color="#ffbd20" my="md" onClick={()=>navigate(-1 )} variant="light" leftSection={<IconArrowLeft size={20}/> } >Back</Button>
            
            <div className="flex gap-5 justify-between">
                <Company/>
                <SimlarCompanies/>
           
            </div>
            

            
        </div>  
    )
}
export default CompanyPage;