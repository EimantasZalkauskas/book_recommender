import DeleteIcon from '@mui/icons-material/Delete';
import { Box, Button, IconButton, List, ListItem, ListItemText, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../App.css';
import { useAuth } from '../../context/AuthContext';

export default function UserPage() {
  const { user } = useAuth();
  const navigate = useNavigate()

  const [books, setBooks] = useState<any[] | null>(null)

  useEffect(()=>{
    if(!user){
      alert('Not Logged in')
      navigate('/', { replace: true })
    }else{
      getBooks(user.id!)
    }
  },[user, navigate])

  async function getBooks(user_id:number){
    const res = await fetch(`/api/user/books/${user_id}`,{
      method:'GET'
    })
    if(res.ok){
      const books = await res.json()
      setBooks(books)
    }
  }

  async function deleteUserBook(user_id:number, book_id:number){
    console.log(user_id, book_id)
    const res = await fetch('/api/user/delete_book/',{
      method:'DELETE',
      headers:{
        'Content-Type':'application/json'
      },
      body:JSON.stringify({
        user_id:user_id,
        book_id:book_id
      })
    })
    if(res.ok){
      const res_json = await res.json()
      console.log(res_json)
      window.location.reload();
    }else{
      console.log(res)
    }
  }



  return (
    <>
      { user ?
      <Box sx={{display:'flex', flexDirection:'column', justifyContent:'center', py:'5%'}}>
        <Typography variant='h5'>Hello {user.name}</Typography>
        <Box>
          <Typography variant='subtitle1'>Number of Books Added: {books != null ? books.length : 0}</Typography>
          <List>
            {books != null && books.map((book)=>
              <ListItem key={book.id} 
                secondaryAction={
                  <IconButton onClick={()=>deleteUserBook(user.id! ,book.id)}><DeleteIcon /></IconButton>
                }
              >
                <ListItemText 
                  primary={book.title}
                  secondary={book.authors}/>
              </ListItem>
            )}
          </List>
          
        </Box>
        <Button variant='contained' color='info' onClick={() => navigate('/')}>Add Books</Button>
      </Box> : null
      }
    </>

  )
}

