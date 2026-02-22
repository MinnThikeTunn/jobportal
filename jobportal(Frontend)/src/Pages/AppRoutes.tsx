import { Divider } from "@mantine/core"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Footer from "../Footer/Footer"
import Header from "../Header/Header"
import ApplyJobPage from "./ApplyJobPage"
import CompanyPage from "./CompanyPage"
import FindJobs from "./FindJobs"
import FindTalentPage from "./FindTalentPage"
import HomePage from "./HomePage"
import JobDescPage from "./JobDescPage"
import JobHistoryPage from "./JobHistoryPage"
import PostedJobPage from "./PostedJobPage"
import PostJobPage from "./PostJobPage"
import ProfilePage from "./ProfilePage"
import SignUpPage from "./SignUpPage"
import TalentProfilePage from "./TalentProfilePage"
import { useSelector } from "react-redux"
import ProtectedRoute from "../Services/ProtectedRoute"
import PublicRoute from "../Services/PublicRoute"

const AppRoutes = () => {
    const user = useSelector((state:any)=>state.user);
    return (
        <BrowserRouter>
            <div className='relative'>
            <Header/> 
            <Divider size="sm" mx="md"  />
            <Routes>
                <Route path='/find-jobs' element={<ProtectedRoute allowedRoles={['APPLICANT']}><FindJobs/></ProtectedRoute>}/>
                <Route path='/find-talent' element={<ProtectedRoute allowedRoles={['EMPLOYER']}><FindTalentPage/></ProtectedRoute>}/>
                <Route path='/company/:name' element={<CompanyPage/>}/>
                <Route path='/posted-jobs/:id' element={<ProtectedRoute allowedRoles={['EMPLOYER']}><PostedJobPage/></ProtectedRoute>}/>
                <Route path='/jobs/:id' element={<JobDescPage/>}/>
                <Route path='/apply-job/:id' element={<ApplyJobPage/>}/>
                <Route path="/post-job/:id" element={<ProtectedRoute allowedRoles={['EMPLOYER']}><PostJobPage/></ProtectedRoute>}/>
                <Route path="/job-history" element={<ProtectedRoute allowedRoles={['APPLICANT']}><JobHistoryPage/></ProtectedRoute>}/>
                <Route path='/talent-profile/:id' element={<TalentProfilePage/>}/>
                <Route path='/signup' element={<SignUpPage />} />
                <Route path='/login' element={<SignUpPage />} />
                <Route path='/profile' element={<ProfilePage/>} />

                
                <Route path='*' element={<HomePage/>}/>
            </Routes>
            <Footer/>
            </div>
      </BrowserRouter>
    )
}

export default AppRoutes;

