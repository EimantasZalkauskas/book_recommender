import DeleteIcon from '@mui/icons-material/Delete';
import { Box, IconButton, List, ListItem, ListItemText, Typography } from "@mui/material";
import { useEffect, useState } from "react";



export default function UsersPage(){
    const [users, setUsers] = useState<any[]>([])

    useEffect(() => {
        const fetchUsers = async () => {
            const response = await fetch(`/api/users/`, {
                method: "GET"
            })
            const json_res = await response.json()
            setUsers(json_res)
        }

        fetchUsers()
    }, [])

    async function deleteUser(user_id:number){
        const response = await fetch(`/api/users/${user_id}`,{
            method:'DELETE'
        })
        if(response.status == 200){
            console.log(`Removed User ID: ${user_id}`)
            window.location.reload();
        }else{
            console.log(`Failed to Remove User ID: ${user_id}`)
        }
    }


    return (
        <Box>
            <Typography>All Users</Typography>
            <List>
                {users.map((user:any)=>
                <ListItem key={user.id} 
                secondaryAction={
                    <IconButton edge='end' disabled onClick={()=>deleteUser(user.id)}><DeleteIcon /></IconButton>
                }
                >
                    <ListItemText 
                    primary={user.name} 
                    secondary={`Books Added: ` + user.books.length}
                    />
                </ListItem>
                )}
            </List>
        </Box>
    )
}