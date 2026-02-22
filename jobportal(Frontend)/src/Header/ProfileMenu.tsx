import { Menu, Avatar, Switch } from '@mantine/core';
import {
  IconMessageCircle,
  IconUserCircle,
  IconFileText,
  IconMoon,
  IconMoonStars,
  IconSun,
  IconLogout2,
} from '@tabler/icons-react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { removeUser } from '../Slices/UserSlice';
import { removeJwt } from '../Slices/JwtSlice';

const ProfileMenu=()=>{
  
  const dispatch = useDispatch();
  const user = useSelector((state:any)=>state.user);
  const profile = useSelector((state:any)=>state.profile);
  const [opened, setOpened] = useState(false);
  const [checked, setChecked] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    
    dispatch(removeUser());
    dispatch(removeJwt());
    navigate("/login");
  }

  return (
    <Menu opened={opened} onChange={setOpened} shadow="md" width={200}>
      <Menu.Target>
      <div className="flex cursor-pointer items-center gap-2">
            <div>
                {profile.name}
            </div>
            <Avatar src={profile.picture?`data:image/jpeg;base64,${profile.picture}`:"/avatar.png"} alt="it's me" />
        </div>
      </Menu.Target>

      <Menu.Dropdown onChange={()=>setOpened(true)}>
        <Link to="/profile">
        <Menu.Item leftSection={<IconUserCircle size={14} />}>
          Profile 
        </Menu.Item>
        </Link>
        
        {/* <Menu.Item leftSection={<IconMessageCircle size={14} />}>
          Messages
        </Menu.Item>
        <Menu.Item leftSection={<IconFileText size={14} />}>
          Resume
        </Menu.Item>
        <Menu.Item
          leftSection={<IconMoon size={14} />}
          rightSection={
            <Switch checked={checked}
            onChange={(event) => setChecked(event.currentTarget.checked)} size="md" color="dark.4" onLabel={<IconSun size={16} stroke={2.5} color="yellow" />} offLabel={<IconMoonStars size={16} stroke={2.5} color="cyan" />}/>
          }
        >
          Dark Mode 
        </Menu.Item> */}

        <Menu.Divider />

        
        <Menu.Item
          color="red"
          onClick={handleLogout}
          leftSection={<IconLogout2 size={14}  />}
        >
            Log out
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
export default ProfileMenu;