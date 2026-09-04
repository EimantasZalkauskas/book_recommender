import { useState } from 'react';
import './App.css';
import BookFinderSection from './components/BookFinderSection';
import Navbar from './components/Navbar';

function App() {
  const [searchText, setSearchText] = useState("")

  function searchBook(){
    console.log(searchText);
  }

  return (
    <>
    <Navbar></Navbar>
    <BookFinderSection></BookFinderSection>
    </>
  )
}

export default App
