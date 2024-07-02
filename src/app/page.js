"use client"

import SearchHistory from "@/components/SearchHistory";
import ArticleForm from "@/components/ArticleForm";
import { useRef, useState, useEffect } from "react";


const MainPage = () => {

  const formRef = useRef(null);
  const textareaRef = useRef(null);

  const [ sentence, setSentence ] = useState('');
  const [ pastSearch, setPastSearch ] = useState('');

  useEffect(() => {
      const responseHistory = localStorage.getItem('responseHistory');
      let temp = [];
      if (responseHistory)
          temp = JSON.parse(responseHistory);
          setPastSearch(temp);
  }, []);

  const handleSubmit = async (event, isFromEnter=false) => {
    if (!isFromEnter)
      event.preventDefault();

    let toSend = 'It can help us [lead] better and more fulfilling lives';
    if (sentence !== '' && sentence !== '\n') 
      toSend = sentence;

    setSentence('');
    
    await fetch(`http://127.0.0.1:8000/?sentence=${toSend}`)
          .then((response) => response.json())
          .then((result) => {
            let searchList = JSON.parse(localStorage.getItem('responseHistory') || '[]');
            searchList.push({
              'sentence': toSend,
              'result': result['result'],
            });
            setPastSearch(searchList);
            localStorage.setItem('responseHistory', JSON.stringify(searchList));
          })
          .catch((error) => {
            console.log(`Error: ${error}`);
          })
  }

  const handleKeyDown = (event) => {
    if (sentence !== '' && event.key === "Enter" && event.shiftKey === false) {
      event.preventDefault();
      handleSubmit(null, true);
    }
    else if (sentence === '' && event.key === "Tab") {
      event.preventDefault();
      setSentence("It can help us [lead] better and more fulfilling lives");
    }
  }

  const handleClear = () => {
    localStorage.removeItem('responseHistory');
    setPastSearch([]);
  }

  return (
    <>
      <div className="bg-slate-200 h-10"></div>
      <div className="flex">
        <div className="h-[95vh] w-40 bg-black mr-5"></div>
        <div className="w-full">
          <div className="flex items-center justify-center gap-5 mt-5">
            <ArticleForm setpastsearch={setPastSearch} />
            <SearchHistory pastsearch={pastSearch} />
          </div>
        </div>
      </div>
    </>
  )
}

export default MainPage;
