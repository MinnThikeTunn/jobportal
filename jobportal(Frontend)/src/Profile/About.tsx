import { ActionIcon, Textarea } from "@mantine/core"
import { IconCheck, IconPencil, IconX } from "@tabler/icons-react"
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { successNotification } from "../Services/NotificationService";
import { changeProfile } from "../Slices/ProfileSlice";

const About = () => {

    const dispatch = useDispatch();
    const profile = useSelector((state:any)=>state.profile);
    const [edit, setEdit] = useState(false);
    const [about, setAbout] = useState("");
    const handleEdit = () => {
        if(!edit){
            setEdit(true);
            setAbout(profile.about);
        } else {
            setEdit(false);
        }
    }

    const handleSave = () => {
        setEdit(false);
        let updatedProfile = {...profile, about: about}
        dispatch(changeProfile(updatedProfile))
        successNotification("Success", "About updated successfully");
    }
    return (
                <div>
                    <div className="text-2xl font-semibold mb-3 flex justify-between
                    ">About 
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
                            edit?<><Textarea
                            value={about} placeholder="Enter about yourself..." autosize minRows={3}
                            onChange={(event) => setAbout(event.currentTarget.value)}/></>:<><div className="text-sm text-mine-shaft-300 text-justify">
                            {profile?.about}
                            </div></>
                        }
                    
                
                </div>
    )
}

export default About;