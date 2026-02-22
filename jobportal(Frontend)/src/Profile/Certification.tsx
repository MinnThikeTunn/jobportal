import { ActionIcon } from "@mantine/core";
import { IconPlus, IconDeviceFloppy, IconPencil, IconX } from "@tabler/icons-react";
import { profile } from "../Data/TalentData";
import CertiCard from "./CertiCard";
import CertiInput from "./CertiInput";
import { useState } from "react";
import { useSelector } from "react-redux";

const Certification = () => {
    const [edit, setEdit] = useState(false);
    const [addCerti, setAddCerti] = useState(false);
    const profile = useSelector((state:any)=>state.profile)
    const handleEdit = () => {
        setEdit(!edit)
    }
    return(
        <>
            <div className="text-2xl font-semibold mb-5 flex justify-between">Certifications 
                <div className="flex gap-2">
                    <ActionIcon onClick={()=>setAddCerti(true)} size="lg" color="#ffbd20"  variant="subtle"><IconPlus className="h-4/5 w-4/5" stroke={1.5}/>
                    </ActionIcon>
                    <ActionIcon onClick={handleEdit} size="lg" color={edit?"red.8":"bright-sun.4"}  variant="subtle">
                    {edit?<IconX className="h-4/5 w-4/5" stroke={1.5}/>:<IconPencil className="h-4/5 w-4/5" stroke={1.5} />}
                    </ActionIcon>
                </div>
            </div>
                <div className="flex flex-col gap-8">
                    {profile?.certifications?.map((certification:any, index:any) => (
                        <CertiCard key={index} edit={edit} index={index} {...certification}/>
                    ))}
                    {
                       addCerti&&<CertiInput setEdit={setAddCerti}/>
                    }
                </div>
        </>
    )
}

export default Certification;