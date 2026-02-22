import { TextInput, NumberInput, FileInput, Textarea, Button, LoadingOverlay } from "@mantine/core"
import { useForm, isNotEmpty } from "@mantine/form";
import { IconPaperclip } from "@tabler/icons-react"
import { useState } from "react";
import { getBase64 } from "../Services/Utilities";
import { useNavigate, useParams } from "react-router-dom";
import { applyJob } from "../Services/JobService";
import { errorNotification, successNotification } from "../Services/NotificationService";
import { useSelector } from "react-redux";

const ApplicationForm = () => {

        const {id} = useParams();
        const user = useSelector((state:any)=>state.user);

        const navigate = useNavigate();

        
        const [preview ,setPreview] = useState(false);
        const [submit , setSubmit] = useState(false);

        const handlePreview=()=>{
            form.validate();
            window.scrollTo({top:0 , behavior:"smooth"})
            if(!form.isValid()) return;
            setPreview(!preview);
        }
        const handleSubmit= async ()=>{
            setSubmit(true);
            let resume: any = await getBase64(form.getValues().resume);
            resume = cleanBase64(resume.split(',')[1]);
            let applicant = {...form.getValues(), applicantId: user.id, resume};
            applyJob(id, applicant).then(res=>{
                setSubmit(false);
                successNotification("Success", "Application submitted successfully");
                navigate("/job-history");
            }).catch(err=>{
                console.error(err);
                setSubmit(false);
                errorNotification("Error", err.response.data.errorMessage);
            })
    
        }

        const cleanBase64 = (base64: string) => {
            return base64.replace(/[^A-Za-z0-9+/=]/g, ""); // Remove invalid characters
        };
        
        const form = useForm({
                    mode: 'controlled',
                    validateInputOnChange: true,
                    initialValues: {
                        name: '',
                        email: '',
                        phone: '',
                        website: '',
                        resume: null,
                        coverLetter: ''
                        
                    },
                    validate: {
                        name: isNotEmpty("Name is required"),
                        email: isNotEmpty("Email is required"),
                        phone: isNotEmpty("Phone is required"),
                        website: isNotEmpty("Website is required"),
                        resume: isNotEmpty("Resume is required"),
                        coverLetter: isNotEmpty("Cover Letter is required"),
                    }
                })
    return(
        <div>
            <LoadingOverlay className="!fixed"
                visible={submit}
                zIndex={1000}
                overlayProps={{ radius: 'sm', blur: 2 }}
                loaderProps={{ color: '#ffbd20', type: 'bars' }}
                />
            <div className="text-xl font-semibold mb-5">Submit Your Application</div>
                <div className="flex flex-col gap-5">
                    <div className="flex gap-10 [&>*]:w-1/2">
                        <TextInput {...form.getInputProps("name")} readOnly={preview} variant={preview?"unstyled":"default"} className={`${preview?"text-mine-shaft-300 font-semibold":""}`} label="Full Name" withAsterisk placeholder="Enter Name" />
                        <TextInput {...form.getInputProps("email")} readOnly={preview} variant={preview?"unstyled":"default"} className={`${preview?"text-mine-shaft-300 font-semibold":""}`} label="Email" withAsterisk placeholder="Enter email" />
                    </div>
                    <div className="flex gap-10 [&>*]:w-1/2">
                        <NumberInput {...form.getInputProps("phone")} readOnly={preview} variant={preview?"unstyled":"default"} className={`${preview?"text-mine-shaft-300 font-semibold":""}`} label="Phone Number" withAsterisk placeholder="Enter Phone Number" hideControls min={0} max={9999999999} clampBehavior="strict"/>
                        <TextInput {...form.getInputProps("website")} readOnly={preview} variant={preview?"unstyled":"default"} className={`${preview?"text-mine-shaft-300 font-semibold":""}`} label="Personal Website" withAsterisk placeholder="Enter Url" />
                    </div>
                    <FileInput accept="application/pdf" {...form.getInputProps("resume")} readOnly={preview} variant={preview?"unstyled":"default"} className={`${preview?"text-mine-shaft-300 font-semibold":""}`} withAsterisk
                        leftSection={<IconPaperclip stroke={1.5}/>}
                        label="Attach your CV"
                        placeholder="Your CV"
                        leftSectionPointerEvents="none"
                    />
                    <Textarea {...form.getInputProps("coverLetter")} readOnly={preview} variant={preview?"unstyled":"default"} className={`${preview?"text-mine-shaft-300 font-semibold":""}`} withAsterisk
                        placeholder="Type something about yourself..."
                        label="Cover Letter"
                        autosize
                        minRows={4}
                    />
                    {!preview &&<Button onClick={handlePreview} color="#ffbd20" variant="light" >Preview</Button>}
                    {
                        preview &&<div className="flex gap-10 [&>*]:w-1/2">
                            <Button fullWidth onClick={handlePreview} color="#ffbd20" variant="outline" >Edit</Button>
                            <Button fullWidth onClick={handleSubmit} color="#ffbd20" variant="light" >Submit</Button>
                        </div>
                    }
                </div>
        </div>
    )
}

export default ApplicationForm;