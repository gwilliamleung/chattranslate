import React, { useState, useEffect, useRef  } from 'react'
import { FaBomb, FaRegStickyNote, FaUser, FaSignOutAlt } from 'react-icons/fa';

function App() {
  const [userInput, setUserInput] = useState('')
  const [conversationObj, setConversationObj] = useState({})
  const [hideTranslation, setHideTranslation] = useState(true)
  // const [chosenLanguage, setchosenLanguage] = useState('')
  const [isLoading,setIsLoading] = useState(false)
  const [selectedConversationId, setselectedConversationId] = useState(null)
  const [creatingNewchat, setCreatingNewChat] = useState(true)
  const [newChatArr, setNewChatArr] = useState([])

  // console.log(conversationObj[selectedConversationId].messages)

  useEffect(() => {
    setConversationObj([
      // {
      //   id: 'Chinese',
      //   messages: [
      //     { role: 'user', content: 'Hola!' },
      //     { role: 'user', content: '你好吗？' },
      //     { role: 'assistant', content: '我很好！!' },
      //     { role: 'user', content: 'How are you?' },
      //   ],
      // },
      // {
      //   id: 'Japanese',
      //   messages: [
      //     { role: 'user', content: 'Hola!' },
      //     { role: 'user', content: 'おはよう！!' },
      //     { role: 'assistant', content: 'こんにちは！ 今日はなんか手伝うことある？' },
      //     { role: 'user', content: '元気ですか？' },
      //   ],
      // },
      // {
      //   id: 'Spanish',
      //   messages: [
      //     { role: 'user', content: 'Hola!' },
      //     { role: 'user', content: 'Hola!' },
      //     { role: 'assistant', content: '¡Hola! ¿En qué puedo ayudarte hoy?' },
      //   ],
      // },
    ]
    )
    setselectedConversationId(0)
    newChat()
  },[])

  const clearSelectedChat = () => {
    setConversationObj((prevConversationObj) => {
      const updatedConversationObj = { ...prevConversationObj }
      delete updatedConversationObj[selectedConversationId]
      return updatedConversationObj
    })
    // if (setConversationObj && !createNewChat) {
    //   createNewChat()
    // }
  }

  const languageMessage = { 
    japanese: `こんにちは！ 今日はなんか手伝うことある？`,
    spanish: `¡Hola! ¿En qué puedo ayudarte hoy?`,
    chinese: `您好，今天需要什么帮助吗？`
  }

  // {
  //   role: 'system',
  //   content: 'You are a friendly and helpful bilingual assistant capable of responding in both English and Japanese. Separate your responses with "/n/". For example: "こんにちは！ 今日はなんか手伝うことある？ /n/ Hello! How can I help you today?"'
  // },

  // const chooseLanguage = () => {
  //   setchosenLanguage(userInput)
  //   setUserInput('')
  // }

  
  // useEffect(() => {
  //   if (chosenLanguage.toLowerCase() === "chinese" || chosenLanguage.toLowerCase() === "japanese" || chosenLanguage.toLowerCase() === "spanish") {
  //     console.log(`Is ${chosenLanguage} your desired language?`)
  //   } else {
  //     console.log('In this current installation, the bot only provides Chinese, Japanese, or Spanish. Please choose one of these languages.')
  //     console.log(chosenLanguage)
  //     setchosenLanguage('')
  //   }
  // }, [chosenLanguage])

  const handleInputChange = (event) => {
    setUserInput(event.target.value)
  }

  const newChat = () => {
    setCreatingNewChat(true)
    setNewChatArr( 
      [
        {
          role: 'system',
          content: "In this current installation, the bot only provides Chinese, Japanese, or Spanish. Please type one of these languages to get started."
        }
      ]
    )
  }

  const toggleTranslation = () => {
    setHideTranslation(!hideTranslation)
    scrollToBottom()
  }

  const createNewChat = (language) => {
    setConversationObj((prevConversationObj) => {
      const updatedConversationObj = {
        ...prevConversationObj,
        [language]: {
          id: language,
          messages: [
            {
              role: 'system',
              content: `You are a friendly and helpful bilingual assistant capable of responding in both ${language} and English. Make sure English is always after ${language} Separate your responses with /n/ For example: ${languageMessage[language]} /n/ How can I help you today?`,
            },
            {
              role: 'assistant',
              content: `${languageMessage[language]}`,
            },
          ],
        },
      }
      handleConversationClick(language)
      return updatedConversationObj
    })
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (userInput) {
      { 
        if (creatingNewchat){
        const newMessage = {
            role: 'user',
            content: userInput
          }
          const updatedConversation = [...newChatArr,newMessage]
          setNewChatArr(updatedConversation)

          const desireLanguages = ['chinese','japanese','spanish']
          if (desireLanguages.includes(userInput.toLowerCase())){
            setCreatingNewChat(false)
            createNewChat(userInput)
            setNewChatArr([])
          } else {
            setNewChatArr([
              ...updatedConversation,
              { role: 'system', content: 'Please try again.' },
            ])
          }
      } else{
        const newMessage = {
          role: 'user',
          content: userInput,
        }
        const updatedMessages = [...conversationObj[selectedConversationId].messages, newMessage];
          setConversationObj({
            ...conversationObj,
            [selectedConversationId]: {
              ...conversationObj[selectedConversationId],
              messages: updatedMessages,
            }
          })
        fetchReply(updatedMessages)
        }

      }
      setUserInput('')
    }
  }

  useEffect(() => {
    console.log(conversationObj);
  }, [conversationObj])

  const fetchReply = async (conversation) => {
    try {
      setIsLoading(true)
      const apiConversation = conversation.map(({ role, content }) => ({ role, content }))
      const response = await fetch("https://api.openai.com/v1/chat/completions",{
        method: "POST",
        headers: {
          "Authorization": `Bearer sk-`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "model": "gpt-3.5-turbo",
          "messages" : apiConversation
        })        
      })
      const data = await response.json()
      const apiResponseContent = data.choices[0].message.content
      const [nonEnglishResponse, englishResponse] = apiResponseContent.split('/n/').map(response => response.trim())
      const updatedConversationBot = [
        ...conversation,
        { role: 'assistant', content: nonEnglishResponse, language: `${selectedConversationId}` },
        { role: 'assistant', content: englishResponse, language: 'English' }
      ]
      console.log(conversationObj[selectedConversationId].messages)
      setConversationObj(prevConversationObj => ({
        ...prevConversationObj,
        [selectedConversationId]: {
          ...prevConversationObj[selectedConversationId],
          messages: updatedConversationBot
        }
      }))
      } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleConversationClick = (conversationId) => {
    setCreatingNewChat(false)
    setselectedConversationId(conversationId)
  }

  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }
  
  useEffect(scrollToBottom, [conversationObj, hideTranslation, newChatArr])

  return (
      <div className="flex justify-center items-center h-screen bg-gray-200">
        <div className="flex w-2/5 h-2/3 bg-white rounded-lg shadow-lg">
          <div className="flex flex-col h-full w-1/2 rounded-l-lg  bg-gray-200">
              <div className="justify-center items-center grid grid-cols-4 h-1/6 bg-gray-300 rounded-tl-lg">
                <div className="col-span-3 flex justify-center items-center ml-6">Contacts</div>
                  <button onClick={newChat} className="col-span-1 flex flex-col justify-center items-center text-xl">
                  <FaRegStickyNote/>
                  <div className="text-xs">New Chat</div>
                  </button>
              </div>
              {Object.keys(conversationObj).map((conversationId) => {
                return (
                  <button className="p-4 border border-gray-500"
                       key={conversationId}
                       onClick={() => handleConversationClick(conversationId)}
                       >{conversationObj[conversationId].id}</button>
                )
              })}
          </div>
          <div className="flex flex-col  overflow-y-auto h-full w-full rounded-r-lg  bg-gray-100">
            <div className="justify-center items-center grid grid-cols-4 h-1/6 bg-gray-400 rounded-tr-lg">
              <div className="col-span-3 flex justify-center items-center ml-20">Current Speaker</div>
              <button onClick={clearSelectedChat} className="col-span-1 flex flex-col justify-center items-center text-xl">
                <FaBomb/>
                <div className="text-xs">Clear Chat</div>
                </button>
            </div>
            <div className="flex flex-col overflow-y-auto" style={{ maxHeight: 'calc(100% - 1/6*100vh)' }}>
            {creatingNewchat && newChatArr.map((message, index) => {
                return (
                    <div 
                      key={index} 
                      className={`${message.role === "user" ? " text-[#69A9DD] self-end ml-auto" : "flex flex-col items-start text-[#6C72C6]"}
                        border border-[#989CD7] p-4 m-2 ml-4 rounded-md break-words inline-flex`}>
                        <div className="">{message.content}</div>                    
                   </div> 
                )
              })}
            
            {conversationObj[selectedConversationId] && !creatingNewchat && conversationObj[selectedConversationId].messages.map((message, index) => {
                if (index === 0) return null

                return (
                  <div
                    key={index}
                    className={`${
                      message.role === 'user'
                        ? ' text-[#69A9DD] self-end ml-auto'
                        : 'flex flex-col items-start text-[#6C72C6] self-start'
                    } ${
                      message.language === 'English' && hideTranslation ? ' hidden' : ''
                    } border border-[#989CD7] p-4 m-2 ml-4 mr-4 rounded-md break-words inline-flex`}
                  >
                    <div className="text-left">{message.content}</div>
                    {message.role === 'assistant' &&
                      message.language === `${selectedConversationId}` && (
                        <button
                          onClick={() => {
                            toggleTranslation();
                            scrollToBottom();
                          }}
                        >
                          {hideTranslation ? 'Show Translation' : 'Hide Translation'}
                        </button>
                      )}
                  </div>
                )
              })}
              {isLoading ? ( <div className="flex-col items-start text-[#6C72C6] self-start border border-[#989CD7] p-4 m-2 ml-4 mr-4 rounded-md break-words inline-flex ">Loading...</div>): null}
              <div ref={messagesEndRef} />
            </div>
            <form className="mt-auto flex s items-center" onSubmit={handleSubmit}>
              <input
                type="text"
                className="w-[90%] mt-auto h-10 pl-2"
                value={userInput}
                onChange={handleInputChange}
              />
              <button className="w-[10%] bg-gray-400 h-10" type="submit">=></button>
            </form>
            
          </div>
        <div className="flex justify-center items-center grid grid-cols-4 h-1/6 bg-gray-300 rounded-bl-lg">
          <button className="col-span-1 flex flex-col justify-center items-center text-xl">
            <FaUser />
          </button>
          <button className="col-span-1 flex flex-col justify-center items-center text-xl">
            <FaSignOutAlt />
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;