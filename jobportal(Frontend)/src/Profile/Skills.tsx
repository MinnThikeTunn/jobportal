import { ActionIcon, TagsInput } from "@mantine/core";
import { IconCheck, IconDeviceFloppy, IconPencil, IconX } from "@tabler/icons-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { skills } from "../Data/JobDescData";
import { successNotification } from "../Services/NotificationService";
import { changeProfile } from "../Slices/ProfileSlice";

const Skills = () => {

    const dispatch = useDispatch();
    const profile = useSelector((state:any)=>state.profile);
    const [edit, setEdit] = useState(false);
    const [skills, setSkills] = useState<string[]>([]);
    const handleEdit = () => {
        if(!edit){
            setEdit(true);
            setSkills(profile.skills);
        } else {
            setEdit(false);
        }
    }

    const handleSave = () => {
        setEdit(false);
        let updatedProfile = {...profile, skills: skills}
        dispatch(changeProfile(updatedProfile))
        successNotification("Success", "Skills updated successfully");
    }
    
    return(
        <>
                <div className="text-2xl font-semibold mb-3 flex justify-between">Skills 
                    <div>
                            {edit && <ActionIcon onClick={handleSave} size="lg" color="green.8"  variant="subtle">
                                <IconCheck className="h-4/5 w-4/5" stroke={1.5}/>
                            </ActionIcon> }
                            <ActionIcon onClick={handleEdit} size="lg" color={edit?"red.8":"bright-sun.4"}  variant="subtle">
                                {edit?<IconX className="h-4/5 w-4/5"/>:<IconPencil className="h-4/5 w-4/5" />}
                            </ActionIcon>
                        </div>
                </div>
                    {
                        edit?<TagsInput value={skills} onChange={setSkills}
                        placeholder="Add Skills"
                        splitChars={[',', ' ', '|']}/>:<div className="flex flex-wrap gap-2">
                    {profile?.skills?.map((skill:any, index:any) => (
                        <div key={index} className="bg-bright-sun-300 bg-opacity-15 rounded-3xl text-sm font-medium text-bright-sun-400 px-3 py-1">
                        {skill}
                    </div>
                    ))}
                </div>
                    }
        </>
    )
}

export default Skills;