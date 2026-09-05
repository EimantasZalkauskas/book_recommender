import { Box, Button, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import '../../../App.css';

export default function CreateUserPage() {
  const [userName, setUserName] = useState("")

  async function addUser(){
    console.log(userName);
    const response = await fetch('')
  }

  return (
    <Box sx={{display:'flex',
            flexDirection:'column',
            padding:'5%'
    }}>
        <Typography variant='h4' sx={{pb:'5%'}}>Create User</Typography>
        <TextField  label='Enter Your Name' 
                    variant='outlined'
                    value={userName}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        setUserName(event.target.value);
                    }} 
                    sx={{pb:'5%'}}/>
        <Button variant='contained' color='info' onClick={()=>addUser()}>Add</Button>
    </Box>
  )
}

