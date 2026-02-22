import { ActionIcon } from "@mantine/core"
import { IconPlus, IconDeviceFloppy, IconPencil, IconX } from "@tabler/icons-react"
import { profile } from "../Data/TalentData"
import ExpCard from "./ExpCard"
import ExpInput from "./ExpInput"
import { useState } from "react"
import { useSelector } from "react-redux"

const Experience = () => {

    const profile = useSelector((state:any)=>state.profile)

    const [edit, setEdit] = useState(false)

    const [addExp, setAddExp] = useState(false)

    const handleEdit = () => {
        setEdit(!edit)
    }




    return(
        <>
        <div className="text-2xl font-semibold mb-5 flex justify-between">Experience <div className="flex gap-2">
            <ActionIcon onClick={()=>setAddExp(true)} size="lg" color="#ffbd20"  variant="subtle"><IconPlus className="h-4/5 w-4/5"/>
                    </ActionIcon><ActionIcon onClick={handleEdit} size="lg" color={edit?"red.8":"bright-sun.4"} variant="subtle">
                    {edit?<IconX className="h-4/5 w-4/5" stroke={1.5}/>:<IconPencil stroke={1.5} className="h-4/5 w-4/5" />}
                    </ActionIcon></div></div>
                <div className="flex flex-col gap-8">
                {
                profile?.experiences?.map((exp: any,index: number) => (
                    <ExpCard key={index} index={index} {...exp} edit={edit}/>
                ))
                }
                {addExp&&<ExpInput add setEdit={setAddExp}/>}
            </div>
        </>
    )
}

export default Experience;