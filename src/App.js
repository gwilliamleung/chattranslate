import React, { useState, useEffect, useRef  } from 'react'
import { FaBomb } from 'react-icons/fa';

function App() {
  const [userInput, setUserInput] = useState('')
  const [conversationObj, setConversationObj] = useState({})
  const [hideTranslation, setHideTranslation] = useState('true')
  // const [chosenLanguage, setchosenLanguage] = useState('')
  const [isLoading,setIsLoading] = useState(false)
  const [selectedConversationId, setselectedConversationId] = useState(null)

  // console.log(conversationObj[selectedConversationId].messages)
  // console.log(`The current selectedID is ${selectedConversationId}`)
  useEffect(() => {
    setConversationObj([
      {
        id: 'Chinese',
        messages: [
          { role: 'user', content: 'Hola!' },
          { role: 'user', content: '你好吗？' },
          { role: 'assistant', content: '我很好！!' },
          { role: 'user', content: 'How are you?' },
        ],
      },
      {
        id: 'Japanese',
        messages: [
          { role: 'user', content: 'Hola!' },
          { role: 'user', content: 'おはよう！!' },
          { role: 'assistant', content: 'こんにちは！ 今日はなんか手伝うことある？' },
          { role: 'user', content: '元気ですか？' },
        ],
      },
      {
        id: 'Spanish',
        messages: [
          { role: 'user', content: 'Hola!' },
          { role: 'user', content: 'Hola!' },
          { role: 'assistant', content: '¡Hola! ¿En qué puedo ayudarte hoy?' },
        ],
      },
    ])
    console.log(conversationObj)
    setselectedConversationId(0)
  },[])

  const clearandSetPrompt = () => {
    setConversationObj([
      {
        role: 'system',
        content: 'You are a friendly and helpful bilingual assistant capable of responding in both English and Japanese. Separate your responses with "/n/". For example: "こんにちは！ 今日はなんか手伝うことある？ /n/ Hello! How can I help you today?"'
      },
    ])
  }
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

  const toggleTranslation = () => {
    setHideTranslation(!hideTranslation)
    scrollToBottom()
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (userInput) {
      const newMessage = {
        role: 'user',
        content: userInput,
      }
      setConversationObj((prevConversationObj) => {
        const updatedConversationObj = { ...prevConversationObj }
        const selectedConversation = updatedConversationObj[selectedConversationId]
        const updatedMessages = [...selectedConversation.messages, newMessage]
        return {
          ...updatedConversationObj,
          [selectedConversationId]: {
            ...selectedConversation,
            messages: updatedMessages,
          },
        }
      })
      setUserInput('')
    }
  }

  const fetchReply = async (conversation) => {
    try {
      setIsLoading(true)
      const apiConversation = conversation.map(({ role, content }) => ({ role, content }));
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
      console.log(apiResponseContent)
      const [JapaneseResponse, englishResponse] = apiResponseContent.split('/n/').map(response => response.trim());
      const updatedConversationBot = [
        ...conversation,
        { role: 'assistant', content: JapaneseResponse, language: 'Japanese' },
        { role: 'assistant', content: englishResponse, language: 'English' }
      ]
      setConversationObj(updatedConversationBot)
      console.log(updatedConversationBot)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleConversationClick = (conversationId) => {
    console.log(`${conversationId} HELLO`)
    setselectedConversationId(conversationId);
  }

  const clearChat = () => {
    clearandSetPrompt()
  }

  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }
  
  useEffect(scrollToBottom, [conversationObj, hideTranslation]);

  return (
      <div className="flex justify-center items-center h-screen bg-gray-200">
        <div className="flex w-2/5 h-2/3 bg-white rounded-lg shadow-lg">
          <div className="flex flex-col h-full w-1/2 rounded-l-lg  bg-gray-200">
              <div className="flex justify-center items-center h-1/6 bg-gray-300 rounded-tl-lg">Names of Contacts</div>
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
              <button onClick={clearChat} className="col-span-1 flex flex-col justify-center items-center text-xl">
                <FaBomb/>
                <div className="text-xs">Clear Chat</div>
                </button>
            </div>
            <div className="flex flex-col overflow-y-auto" style={{ maxHeight: 'calc(100% - 1/6*100vh)' }}>
            {conversationObj[selectedConversationId] && conversationObj[selectedConversationId].messages.map((message, index) => {
                if (index === 0) return null;

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
                      message.language === 'Japanese' && (
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
        </div>
    </div>
  );
}

export default App;