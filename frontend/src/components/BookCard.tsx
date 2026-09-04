import SendIcon from '@mui/icons-material/Send';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import default_image from '../assets/images/cover_default.png';


interface props {
    id:string,
    title:string,
    subtitle:string,
    authors:any,
    categories:any,
    description:string,
    imageLinks:any,
    language:string,
    pageCount:number,
    publishingDate:string,
}

export default function BookCard(props: props) {
  const [image, setImage] = useState(default_image)
  useEffect(()=>{
    if(props.imageLinks != undefined){
      
      setImage(props.imageLinks.thumbnail) 
    }
  },[props])
  async function addBook(){
    console.log(props)
  }

  return (
    <Card >
      <CardMedia
        sx={{ height: {lg:900, md:800, sm:700, xs:600}}}
        image={image}
        title={props.title}
      />
      <CardContent>
        <Typography gutterBottom variant="h6" component="div">
          {props.title}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', overflow:'hidden', height: {lg:500, md:400, sm:300, xs:200} }}>
          {props.description ? props.description: props.subtitle }
        </Typography>
      </CardContent>
      <CardActions>
        <Button variant='outlined' size="small" endIcon={<SendIcon />} onClick={()=>addBook()}>Add Book</Button>
        {/* <Button size="small">Learn More</Button> */}
      </CardActions>
    </Card>
  );
}