import { Typography } from '@mui/material';
import { useState } from 'react';
import '../../App.css';

export default function UserPage() {
  const [searchText, setSearchText] = useState("")

  function searchBook(){
    console.log(searchText);
  }

  return (
    <>
    <Typography>User Page</Typography>
    </>
  )
}

