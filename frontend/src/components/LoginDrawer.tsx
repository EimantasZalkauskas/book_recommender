import { Box, Button, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../context/AuthContext';


export default function LoginDrawer(){
    const { login } = useAuth()
    const [username, setUsername] = useState("")
    const navigate = useNavigate()

    async function userLogin(){

        const response = await fetch(`/api/users/${username}`,{
            method:"GET"
        })
        if(response.status == 200){
            const res_json = await response.json()
            login({
                id:res_json.id,
                name:res_json.name,
                books:res_json.books
            })
            navigate('/user')
        }else{
            alert('User does not exist')
        }
        
    }

    async function userRegister(){
        const response = await fetch('api/users/add',{
            method:"POST",
            body:JSON.stringify({
                'name':username,
                'books': []
            }),
            headers:{
                'Content-Type': 'application/json'
            }
        })
        if(response.status == 200){
            alert(`User Created with name ${username}`)
            userLogin()
        }else{
            console.log(`Failed to add user, status code: ${response.status}`)
        }
    }

    return(
        <Box sx={{maxWidth:'100%', p:'5%', flexDirection:'column'}}>
            <Box id='login'>
                <Typography variant="h6" color="textPrimary" sx={{pb:'2%'}}>Login</Typography>
                <Box sx={{display:'flex', flexDirection:'column'}}>
                    <TextField
                    variant="outlined"
                    label='Enter User Name'
                    value={username}
                    onChange={(event:React.ChangeEvent<HTMLInputElement>)=>{
                        setUsername(event.target.value);
                    }}
                    sx={{py:'5%'}}
                    />
                    <Button variant='contained' sx={{p:'1%'}} onClick={()=>userLogin()}>Login</Button>
                </Box>
            </Box>
            <Box id='register' sx={{pt:'20%'}}>
                <Typography variant="h6" color="textPrimary" sx={{pb:'2%'}}>Register</Typography>
                <Box sx={{display:'flex', flexDirection:'column'}}>
                    <TextField
                    variant="outlined"
                    label='Enter User Name'
                    value={username}
                    onChange={(event:React.ChangeEvent<HTMLInputElement>)=>{
                        setUsername(event.target.value);
                    }}
                    sx={{py:'5%'}}
                    />
                    <Button variant='contained' color="success" sx={{p:'1%'}} onClick={()=>userRegister()}>Register</Button>
                </Box>
            </Box>
        </Box>
    )
}