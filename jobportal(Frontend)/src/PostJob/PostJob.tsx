import { Button, NumberInput, TagsInput, Textarea } from "@mantine/core";
import { content, fields } from "../Data/PostJob";
import SelectInput from "./SelectInput";
import TextEditor from "./TextEditor";
import { isNotEmpty, useForm } from "@mantine/form";
import { getJob, postJob } from "../Services/JobService";
import { errorNotification, successNotification } from "../Services/NotificationService";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

const PostJob=()=>{
    const {id} = useParams();
    const [editorData, setEditorData] = useState<any>(content);
    const user = useSelector((state:any)=>state.user);
    const navigate = useNavigate();
    const select = fields;

    useEffect(()=>{
        window.scrollTo(0, 0);
        if(id!=="0"){
            getJob(id).then(res => {
                form.setValues(res)
                setEditorData(res.description)
            }).catch(err => {
                console.error(err)
            })
        } else {
            form.reset()
            setEditorData(content)
        }
    },[id])

    const form = useForm({
        mode: 'controlled',
        validateInputOnChange: true,
        initialValues: {
            jobTitle: '',
            company: '',
            experience: '',
            jobType: '',
            location: '',
            packageOffered: '',
            skillsRequired: [],
            about: '',
            description: content
        },
        validate: {
            jobTitle: isNotEmpty(' is required'),
            company: isNotEmpty('Company is required'),
            experience: isNotEmpty('Experience is required'),
            jobType: isNotEmpty('Job Type is required'),
            location: isNotEmpty('Location is required'),
            packageOffered: isNotEmpty('Package Offered is required'),
            skillsRequired: isNotEmpty('Skills Required is required'),
            about: isNotEmpty('About is required'),
            description: isNotEmpty('Description is required')

        }
    })

    const handlePost = () => {
        form.validate()
        if(!form.isValid()) return;
        postJob({...form.getValues(), jobId: id, postedBy: user.id, jobStatus: "ACTIVE"}).then(res => {
            successNotification("Success", "Job posted successfully")
            navigate(`/posted-jobs/${res.jobId}`)

        }).catch(err => {
            console.error(err)
            errorNotification("Error", err.response.data.errorMessage)
        })  
    }

    const handleDraft = () => {
        
        postJob({...form.getValues(), jobId: id, postedBy: user.id, jobStatus: "DRAFT"}).then(res => {
            successNotification("Success", "Job drafted successfully")
            navigate(`/posted-jobs/${res.jobId}`)

        }).catch(err => {
            console.error(err)
            errorNotification("Error", err.response.data.errorMessage)
        })  
    }


    return <div className="w-4/5 mx-auto">
        <div className="text-2xl font-semibold mb-5">
            Post a Job
        </div>
        <div className="flex flex-col gap-5 mb-5">
            <div className="flex gap-10 [&>*]:w-1/2">
                <SelectInput form={form} name="jobTitle" {...select[0]} />
                <SelectInput form={form} name="company" {...select[1]} />
            </div>
            <div className="flex gap-10 [&>*]:w-1/2">
                <SelectInput form={form} name="experience" {...select[2]} />
                <SelectInput form={form} name="jobType" {...select[3]} />
            </div>
            <div className="flex gap-10 [&>*]:w-1/2">
                <SelectInput form={form} name="location" {...select[4]} />
                <NumberInput label="Salary" placeholder="Enter Salary" hideControls withAsterisk min={1} max={10000} clampBehavior="strict" {...form.getInputProps("packageOffered")}/>
            </div>
            <TagsInput withAsterisk label="Skills" placeholder="Enter skill" splitChars={[',', ' ', '|']} clearable {...form.getInputProps("skillsRequired")}/>
            <Textarea withAsterisk {...form.getInputProps('about')}
                                  label="About Job" placeholder="Enter about job..." className="my-3" autosize minRows={3}
                                />
        </div>
        <div className="[&_button[data-active='true']]:!text-bright-sun-400 [&_button[data-active='true']]:!bg-bright-sun-400/20">
            <div className="text-sm font-medium">Job Description <span className="text-red-500">*</span></div>
            <TextEditor form={form} data={editorData}/>
        </div>
        <div className="flex gap-4 py-5">
            <Button color="#ffbd20" variant="light" onClick={handlePost} >Publish Job</Button>
            <Button color="#ffbd20" variant="outline" onClick={handleDraft} >Save as Draft</Button>
        </div>
    </div>
}
export default PostJob;