import { ActionIcon } from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";
import { formatDate } from "../Services/Utilities";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { successNotification } from "../Services/NotificationService";
import { changeProfile } from "../Slices/ProfileSlice";

const CertiCard=(props:any)=>{
    const profile = useSelector((state:any)=>state.profile);
    const dispatch = useDispatch();

    const handleDelete = () => {
        let certi = [...profile.certifications];
        certi.splice(props.index,1);
        let updatedProfile = {...profile, certifications: certi};
        dispatch(changeProfile(updatedProfile));
        successNotification("Success", "Certificate deleted successfully");
    }
    
    return (
        <div className="flex justify-between">
                <div className="flex gap-2 items-center">
                    <div className="p-2 bg-mine-shaft-800 rounded-md">
                        <img className="h-7" src={`/Icons/${props.issuer}.png`} alt="" />
                    </div>
                    <div className="flex flex-col">
                        <div className="font-semibold">{props.name}</div>
                        <div className="text-sm text-mine-shaft-300">{props.issuer}</div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <div className="flex flex-col items-end">
                        <div className="text-sm text-mine-shaft-300">Issued {formatDate(props.issueDate)}</div>
                        <div className="text-sm text-mine-shaft-300">ID: {props.certificateId}</div>
                    </div>
                    {props.edit&&<ActionIcon size="lg" onClick={handleDelete}  color="red.8"  variant="subtle">
                    <IconTrash className="h-4/5 w-4/5" stroke={1.5}/>
                    </ActionIcon>}
                </div>
                
                
            </div>
            
    )
}
export default CertiCard;