import { Button, TextField, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import React, { useState } from 'react';
import BookCard from './BookCard';


export default function BookFinderSection(){
    const [searchQuery, SetSearchQuery] = useState("");
    const [returnedBooks, SetReturnedBooks] = useState<any[] | null>(null);

    async function bookSearch(){
        console.log(searchQuery);

        const response = await fetch(`/api/${encodeURIComponent(searchQuery)}`)
        if(response.status == 200){
            const returnedList = await response.json()
            SetReturnedBooks(returnedList.items)
            console.log(returnedList)
        }else{
            console.log({
                'status':response.status,
                'message':response.body
            })
        }


    }

    return(
        // Outer
        <Box sx={{pt:'10%'}}>
            {/* Search Section */}
            <Box>
                <Typography variant='h4' sx={{pb:'10%'}}>Search For A Book</Typography>
                <Box sx={{display:'flex' ,flexDirection:'column', px:'5%'}}>
                    <TextField
                    id="search-field" 
                    label="Type the book title or author name" 
                    variant="outlined"
                    value={searchQuery}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        SetSearchQuery(event.target.value);
                    }} 
                    sx={{pb:'5%'}}/>
                    <Button variant='contained' onClick={()=>bookSearch()}>Search</Button>
                </Box>
                
            </Box>
            {/* Display Section */}
            
            <Box sx={{
                display:'flex',
                flexDirection:'column',
                py:"5%",
                px:"2%"
            }}>
                {returnedBooks !== null && returnedBooks.map((item:any)=> 
                    <Box key={item.id} sx={{py:'2%'}}>
                        <BookCard 
                        key={item.id} 
                        id={item.id}
                        title={item.volumeInfo.title} 
                        authors={item.volumeInfo.authors}
                        categories={item.volumeInfo.categories}
                        subtitle={item.volumeInfo.subtitle}
                        description={item.volumeInfo.description}
                        imageLinks={item.volumeInfo.imageLinks}
                        language={item.volumeInfo.language}
                        pageCount={item.volumeInfo.pageCount}
                        publishingDate={item.volumeInfo.publishedDate}
                        />
                    </Box>
                )}
            </Box>

        </Box>
    )
}