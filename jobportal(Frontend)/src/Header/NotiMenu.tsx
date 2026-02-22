import { Menu, Avatar, Switch, Indicator, rem, Notification, Stack } from "@mantine/core";
import { IconUserCircle, IconMessageCircle, IconFileText, IconMoon, IconSun, IconMoonStars, IconLogout2, IconBell, IconCheck } from "@tabler/icons-react";
import { Link, useNavigate } from "react-router-dom";
import { profile } from "../Data/TalentData";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getNotifications, readNotification } from "../Services/NotiService";

const NotiMenu = () => {
  const navigate=useNavigate();
  const user = useSelector((state:any)=>state.user);
  const [opened, setOpened] = useState(false);
  const [notifications, setNotifications] = useState<any>([]);
  useEffect(()=>{
    if(user){
      getNotifications(user.id).then((data:any)=>{
        setNotifications(data);
      }
      ).catch((error:any)=>{
        console.log(error);
      }
      )
    }
  },[user])

  const unread = (index:number) => {
    let notis = [...notifications]; 
    notis = notis.filter((noti:any,i:number)=>i!=index);
    setNotifications(notis);
    readNotification(notifications[index].id).then((data:any)=>{
    }).catch((error:any)=>{
      console.log(error);
    }
    )
  }

    return (
        <Menu opened={opened} onChange={setOpened} shadow="md" width={400}>
      <Menu.Target>
        <div className="bg-mine-shaft-900 p-1.5 rounded-full">
            <Indicator disabled={notifications.length<=0} color="bright-sun.4" offset={6} size={9} processing>
                <IconBell stroke={1.5} />
            </Indicator>
        </div>
      </Menu.Target>

      <Menu.Dropdown onChange={()=>setOpened(true)}>
        
        <div className="flex flex-col gap-1">
            {
              notifications?.map((noti:any, index:number) => (
                <Notification key={index} onClick={()=>{
                  navigate(noti.route)
                  setOpened(false)
                  unread(index)
                }} className="hover:bg-mine-shaft-900 cursor-pointer" onClose={()=>unread(index)} icon={<IconCheck style={{width: rem(20), height: rem(20)}}/>} color="teal" title={noti?.action} mt="md">
                  {noti?.message}
                </Notification>
              ))
            }
            {
              notifications?.length == 0 && <div className="text-center text-mine-shaft-300">No Notifications</div>
            }
          
        </div>
        

        
        
      </Menu.Dropdown>
    </Menu>
    )
}

export default NotiMenu;