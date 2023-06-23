import React, { useState, useEffect, useRef  } from 'react'

function App() {
  const [userInput, setUserInput] = useState('')
  const [conversationArr, setConversationArr] = useState([])
  const [hideTranslation, setHideTranslation] = useState('true')

  useEffect(() => {
    setConversationArr(() => [
      {
        role: 'system',
        content: 'You are a friendly and helpful bilingual assistant capable of responding in both English and Japanese. Separate your responses with "/n/". For example: "こんにちは！ 今日はなんか手伝うことある？ /n/ Hello! How can I help you today?"'
      },
    ])
  },[])

  const handleInputChange = (event) => {
    setUserInput(event.target.value)
  }

  const toggleTranslation = () => {
    setHideTranslation(!hideTranslation)
  }
  const handleSubmit = (event) => {
    event.preventDefault()
    if (userInput) {
      const newMessage = {
        role: 'user',
        content: userInput,
      }
      const updatedConversation = [...conversationArr, newMessage]
      setConversationArr(updatedConversation)
      setUserInput('')
      console.log(updatedConversation)
      fetchReply(updatedConversation)
    }
  }
  const fetchReply = async (conversation) => {
    try {
      // setIsLoading(true)
      const apiConversation = conversation.map(({ role, content }) => ({ role, content }));
      const response = await fetch("https://api.openai.com/v1/chat/completions",{
        method: "POST",
        headers: {
          "Authorization": `Bearer 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`,
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
      setConversationArr(updatedConversationBot)
      console.log(updatedConversationBot)
    } catch (error) {
        console.error('Error:', error)}
    // } finally {
    //   setIsLoading(false)
    // }
  }

  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }
  
  useEffect(scrollToBottom, [conversationArr]);

  return (
      <div className="flex justify-center items-center h-screen bg-gray-200">
        <div className="flex w-2/5 h-2/3 bg-white rounded-lg shadow-lg">
          <div className="flex flex-col h-full w-1/2 rounded-l-lg  bg-gray-200">
              <div className="flex justify-center items-center h-1/6 bg-gray-300 rounded-tl-lg">Names of Contacts</div>
          </div>
          <div className="flex flex-col overflow-y-auto h-full w-full rounded-r-lg  bg-gray-100">
            <div className="flex justify-center items-center h-1/6 bg-gray-400 rounded-tr-lg">Current Speaker</div>
            {conversationArr.map((message, index) => {
                if (index === 0) return null
                return (
                  <div 
                      key={index} 
                      className={`
                          ${message.role === "user" ? " text-[#69A9DD] self-end ml-auto" : "flex flex-col items-start text-[#6C72C6] self-start"}
                          ${message.language === 'English' && hideTranslation ? ' hidden' : ''}
                          border border-[#989CD7] p-4 m-2 ml-4 rounded-md break-words inline-flex`}>
                      <div className=" text-right">{message.content}</div>                    
                      {message.role === "assistant" && message.language === 'Japanese' &&
                        <button onClick={toggleTranslation}>
                          {hideTranslation ? 'Show Translation' : 'Hide Translation'}
                        </button>}
                  </div> 
                )
              })}
              <div ref={messagesEndRef} />
            <form className="mt-auto flex s items-center" onSubmit={handleSubmit}>
              <input
                type="text"
                className="w-[90%] mt-auto"
                value={userInput}
                onChange={handleInputChange}
              />
              <button className="w-[10%] bg-gray-400" type="submit">=></button>
            </form>
            
          </div>
        </div>
    </div>
  );
}

export default App;