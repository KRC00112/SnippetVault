
import './App.css'
import {useEffect, useState} from "react";
import {useLocalStorage} from "usehooks-ts";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';




function SnippetCardList({list,removeCard}){

    const formattedDate=(date)=>{
        return date.toLocaleDateString("en-GB",{
            day:"numeric",
            month:"long",
            year:"numeric",
            hour:"numeric",
            minute:"numeric",
            second:"numeric",
        });
    }

    return(
        <>
        {list.map((obj) => (
            <div key={obj.id} className="card right-card">
                <div className='right-card-heading'>
                    <div className='right-card-title-and-language'>
                        <div className='right-card-title-label'>{obj.title}</div>
                        <div className='right-card-language-label'>{obj.language}</div>
                    </div>
                    <div className='date'>{formattedDate(new Date(obj.created_at))}</div>
                </div>
                <pre className='right-card-snippet'>{obj.code}</pre>
                <div className='snippet-operations'>
                    <button className='copy-btn' onClick={() => {navigator.clipboard.writeText(obj.code); toast.success('Snippet copied')}}>⧉ COPY</button>
                    <button className='delete-btn' onClick={()=>{removeCard(obj.id);toast.error("Snippet deleted")}}>✕ DELETE</button>
                </div>
            </div>
        ))}
    </>
    );
}


function AllSnippets({snippets,languageList,removeCard,query,onChangeQuery,focused,handleFocus}) {
    const [selectedLanguageTag, setSelectedLanguageTag] = useState('all');

    const filteredList=query?snippets.filter(snippet=>snippet.title.toLowerCase().includes(query.toLowerCase())):snippets;
    const displayList=selectedLanguageTag==='all'?filteredList:filteredList.filter(snippet=>snippet.language===selectedLanguageTag)
    return (
        <>
            <input type='text' className={`card-inputs ${focused==='search'?'clicked':''}`} onFocus={()=>{handleFocus('search')}} onBlur={()=>{handleFocus('')}} placeholder='Search snippets...' value={query} onChange={(e)=>{onChangeQuery(e)}}></input>
            <div className='all-tags'>
                <button className={`card tag-btns ${selectedLanguageTag==='all'?'selected-snippet':''}`} onClick={()=>{setSelectedLanguageTag('all')}}>All</button>
                <ul className='language-tags'>
                    {languageList.slice(1,).map((language) => (
                        <li key={language}><button className={`card tag-btns ${selectedLanguageTag===language?'selected-snippet':''}`} onClick={()=>{setSelectedLanguageTag(language)}}>{language}</button></li>
                    ))}
                </ul>
            </div>
            <div>

                {displayList.length<=0?<div className='card placeholder'>
                        <div className='placeholder-logo'>{`\{  \}`}</div>
                        <div className='placeholder-message'>
                            <span>NO SNIPPETS HERE!</span>
                        </div>
                </div>:<>
                    <SnippetCardList list={displayList} removeCard={removeCard}/>
                </>}

            </div>
        </>
    )
}

function AddSnippet({handleSetTitle, handleSetLanguage , handleSetCode, title, language, code, languageList, addSnippetOnClick, focused, handleFocus}){









    return(
        <div className='card add-snippet-card'>
            <p className='add-snippet-heading'>NEW SNIPPET</p>
            <input type='text' className={`card-inputs ${focused==='title'?'clicked':''}`} onFocus={()=>{handleFocus('title')}} onBlur={()=>{handleFocus('')}} placeholder='Give snippet a title' value={title}  onChange={(e)=>{handleSetTitle(e)}}></input>
            <select className={`card-inputs language-drop-down ${focused==='language'?'clicked':''}`} onFocus={()=>{handleFocus('language')}} onBlur={()=>{handleFocus('')}}  name="languages" value={language} onChange={(e)=>{handleSetLanguage(e)}}>
                {languageList.map((item,index) => (
                    <option key={index} >{item}</option>
                ))}
            </select>
            <textarea className={`input-snippet card-inputs ${focused==='snippet'?'clicked':''}`} onFocus={()=>{handleFocus('snippet')}} onBlur={()=>{handleFocus('')}} placeholder='Paste your snippet here...' rows={22} value={code} onChange={(e)=>{handleSetCode(e)}}></textarea>
            <button className='add-snippet-btn card' onClick={()=>addSnippetOnClick({id:Date.now(),title:title,language:language,code:code})}>+ ADD SNIPPET</button>
        </div>
    );
}

function App() {




    let languageList = ['Select a language','JavaScript','Python','Java','C#','C','C++','TypeScript','PHP','Go','Swift', 'Bash'];
    const [snippets,setSnippets]=useState([]);
    const [query, setQuery] = useState('');
    const [focused, setFocused] = useState('');
    const [title, setTitle] = useState('')
    const [language, setLanguage] = useState(languageList[0]);
    const [code, setCode] = useState('');
    const [loggedIn, setLoggedIn] = useState(true);


    useEffect(() => {
        async function fetchSnippets(){

            const response = await fetch("http://localhost:3000/");
            const data = await response.json();
            setSnippets(data)

        }
        fetchSnippets();
    }, []);



    const handleFocus=(comp)=>{
        setFocused(comp)
    }

    const onChangeQuery=(e)=>{
        setQuery(e.target.value)
    }
    const removeCard=(id)=>{
        setSnippets(prev=>prev.filter(item=>item.id!==id))
    }
    const addSnippetOnClick=(item)=>{
        if(item.language!==languageList[0] && item.title!=="" && item.code!=="") {
            setSnippets(prev => [...prev, item]);
            setTitle('')
            setLanguage(languageList[0]);
            setCode('')
        }
    }

    const handleSetTitle=(e)=>{
        setTitle(e.target.value)
    }
    const handleSetLanguage=(e)=>{
        setLanguage(e.target.value)
    }
    const handleSetCode=(e)=>{
        setCode(e.target.value)
    }

  return (
    <div className='page'>
        <header>
            <div className='header-left'>
                <span className='header-icon'>{'</>'}</span>
                <span className='header-name'>Snippet Vault</span>
            </div>
            <div className='header-right'>
                <label className='snippets-count-label'>{snippets.length} SNIPPET{snippets.length===1?'':'S'}</label>
                {loggedIn===false?
                    <>
                        <div className='header-button'>Login</div>
                        <div className='header-button'>Sign up</div>
                    </>:<img src='/user_profile.svg' alt='user_profile' width='40px' className='header-user-profile'/>}

            </div>
        </header>
        <section className='workspace'>
            <section className='left-section'>
                <AddSnippet handleSetTitle={handleSetTitle}
                            handleSetLanguage={handleSetLanguage}
                            handleSetCode={handleSetCode}
                            title={title} language={language}
                            code={code}
                            addSnippetOnClick={addSnippetOnClick}
                            languageList={languageList}
                            focused={focused}
                            handleFocus={handleFocus}/>
            </section>
            <section className='right-section'>
                <AllSnippets snippets={snippets}
                             languageList={languageList}
                             removeCard={removeCard}
                             query={query}
                             onChangeQuery={onChangeQuery}
                             focused={focused}
                             handleFocus={handleFocus}/>
            </section>
            <ToastContainer
                position="bottom-right"
                autoClose={2000}
                theme="dark"
                hideProgressBar={true}
                toastClassName="custom-toast"
                progressClassName="custom-toast-progress"
            />
        </section>
    </div>
  )
}

export default App
