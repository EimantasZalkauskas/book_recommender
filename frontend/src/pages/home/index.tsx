import { useState } from 'react';
import '../../App.css';
import BookFinderSection from '../../components/BookFinderSection';



export default function HomePage() {
  const [searchText, setSearchText] = useState("")

  function searchBook(){
    console.log(searchText);
  }

  return (
    <>
    <BookFinderSection></BookFinderSection>
    </>
  )
}

