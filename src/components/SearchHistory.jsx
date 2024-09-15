import { ScrollArea } from "./ui/scroll-area"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlayCircle } from "@fortawesome/free-regular-svg-icons";

const SearchHistory = ({ pastsearch }) => {    

    const handleSpeak = (text='Sorry, some error happened.') => {
        const utterance = new SpeechSynthesisUtterance();
        utterance.rate = 1.5;
        utterance.text = text;
        speechSynthesis.cancel();
        speechSynthesis.speak(utterance);
    }

    return (
        <ScrollArea className="flex flex-col gap-6 h-[80vh] overflow-hidden">
            {pastsearch.length > 0 && (
                pastsearch.toReversed().map((pastsearchItem, index) => {
                    return (
                        <div key={`${pastsearchItem} ${index}`} className="flex flex-col items-center bg-gray-100 rounded-xl px-5 py-12 mt-3 gap-2">
                            <div className="flex gap-2 items-center">
                                <button onClick={() => handleSpeak(pastsearchItem['sentence'])}><FontAwesomeIcon icon={faPlayCircle} /></button>
                                <p className="text-xl font-medium">{pastsearchItem['sentence']}</p>
                            </div>
                            <div className="flex gap-2 items-center">
                                <button onClick={() => handleSpeak(pastsearchItem['result'])}><FontAwesomeIcon icon={faPlayCircle} /></button>
                                <p>{pastsearchItem['result']}</p>
                            </div>
                        </div>
                    )
                })
            )}
        </ScrollArea>
    )
}

export default SearchHistory