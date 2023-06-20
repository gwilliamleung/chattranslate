
import React, { useState, useEffect, useRef } from 'react'

function App() {
  return (
      <div className="flex justify-center items-center h-screen bg-gray-200">
        <div className="flex w-2/5 h-2/3 bg-white rounded-lg shadow-lg">
          <div className="flex flex-col h-full w-2/5 rounded-l-lg  bg-gray-200">
              <div className="flex w-full bg-slate-400 justify-center items-center rounded-tl-lg h-1/6">
                Names of Bots available
              </div>
              <div>test</div>

          </div>
          <div className="flex flex-col h-full w-full rounded-lg bg-gray-100">
            <div className="flex w-full bg-slate-500 rounded-tr-lg justify-center items-center h-1/6">
                  Names of Bots available
                </div>
                <div>test</div>
                <div>test</div>
                <div>test</div>
                <div>test</div>
                <div>test</div>
                <form className="mt-auto" >
                  <div className="flex justify-between border-slate-700 border-2">
                    <input
                      type="text"
                      // value={userInput}
                      // onChange={handleInputChange}
                      className="w-[90%] mt-auto"
                    />
                <button type="submit">O</button>
              </div>
              </form>


            </div>
        </div>
    </div>
  );
}

export default App;
