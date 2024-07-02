"use client"

import { Textarea } from "@/components/ui/textarea";
import { useRef, useState } from "react";
import { ScrollArea } from "./ui/scroll-area";
import { Button } from "./ui/button";

const ArticleForm = ({ setpastsearch }) => {

    const formRef = useRef(null);
    const textareaRef = useRef(null);

    const [ artcle, setArticle ] = useState('');
    const [ hasUserSubmit, setHasUserSubmit ] = useState(false);
    const [ paragraphArray, setParagraphArray ] = useState([]);


    const handleSubmit = async () => {
        setHasUserSubmit(true);
        let tmpParagraphArray = artcle.split("\n").filter((paragraph) => {
            return paragraph !== '';
        });
        
        for (let i = 0; i < tmpParagraphArray.length; i++) {
            if (tmpParagraphArray[i].includes('.'))
                tmpParagraphArray[i] = 
                    tmpParagraphArray[i].split('.').filter((paragraph) => {
                        return paragraph !== '';
                    });
                
            if (typeof(tmpParagraphArray[i]) !== 'string') {
                for (let j = 0; j < tmpParagraphArray[i].length; j++) {
                    let sentence = tmpParagraphArray[i][j];
                    tmpParagraphArray[i][j] = tmpParagraphArray[i][j].split(' ');
                    tmpParagraphArray[i][j].push(sentence);
                }
            }
            else {
                let sentence = tmpParagraphArray[i];
                tmpParagraphArray[i] = [tmpParagraphArray[i].split(' ')];
                tmpParagraphArray[i][0].push(sentence);
            }
        }
        setParagraphArray(tmpParagraphArray);
        console.log(paragraphArray);
    }
    
    const handleKeyDown = (event) => {
        if (event.key === "Enter" && event.shiftKey === false) {
            event.preventDefault();
            handleSubmit();
        }
        else if (artcle === '' && event.key === "Tab") {
            event.preventDefault();
        }
    }

    const handleWordClick = async (word, sentence) => {

        let sentenceToSend = sentence.replace(word, `[${word}]`) + '.';

        console.log(sentenceToSend);
        
        await fetch(`http://127.0.0.1:8000/?sentence=${sentenceToSend}`)
            .then((response) => response.json())
            .then((result) => {
                console.log(sentenceToSend, result);
                let toChange = JSON.parse(localStorage.getItem('responseHistory') || '[]');
                toChange.push({
                    'sentence': sentenceToSend,
                    'result': result['result'],
                });
                console.log(toChange)
                setpastsearch(toChange);
                localStorage.setItem('responseHistory', JSON.stringify(toChange));
            })
            .catch((error) => {
                console.log(`Error: ${error}`);
            });
    }


    return (
        <>
            {!hasUserSubmit ? 
                <div className="flex flex-col">
                    <form className="flex items-center gap-1.5 sm:left-4 lg:left-10" onSubmit={handleSubmit} ref={formRef}>
                        <Textarea 
                            className="min-h-[80vh] w-[70vh] overflow-hidden" 
                            ref={textareaRef} 
                            label="Article"
                            placeholder={`Type in or post the article which contains the word you are interested in. \n\nEnter to Submit \nShift+Enter to new line`}
                            value={artcle}
                            onChange={e => setArticle(e.target.value)}
                            onKeyDown={handleKeyDown} 
                        />
                    </form>
                    <Button onClick={() => setHasUserSubmit(true)}>Submit</Button>
                </div>   
                : 
                <div className="flex flex-col">
                    <ScrollArea className="bg-neutral-300 min-h-[80vh] w-[70vh] p-5 rounded-lg">
                        {paragraphArray.length > 0 && (
                                paragraphArray.map((paragraph) => {
                                    return (
                                        <p className="my-5">
                                            {paragraph.map((sentence) => {
                                                let [fullSentence] = sentence.slice(-1);
                                                let wordArray = sentence.slice(0, -1);
                                                return (
                                                    <>
                                                        {wordArray.map((word) => {
                                                            return (
                                                                <>
                                                                    <span> </span>
                                                                    <a className="hover:underline hover:decoration-red-500 cursor-pointer" onClick={() => {handleWordClick(word, fullSentence)}}> {word}</a>
                                                                </>
                                                            );
                                                        })}
                                                        <span>.</span>
                                                    </>
                                                )
                                            })}
                                        </p>
                                    )
                                })
                            )
                        }               
                    </ScrollArea>
                    <Button onClick={() => setHasUserSubmit(false)}>Reset</Button>
                </div>
            }
        </>
    );
}

export default ArticleForm;