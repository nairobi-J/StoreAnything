import React from 'react';
import { FaDownload, FaTrash } from 'react-icons/fa';
import logo from './no.png';

const Image = () => {
  const items = [1, 2, 3, 4, 5, 6, 7];

  return (
    <div className="min-h-screen w-screen bg-slate-300 p-6">
     
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {items.map((item, index) => (
          <div key={index} className="border border-slate-600 p-4 bg-slate-300 rounded-md shadow-md flex flex-col items-center gap-4">
         
            <div className="img h-40 w-40">
              <img src={logo} alt="Logo" className="h-40 w-40 object-cover" />
            </div>

            <div className="icons flex gap-3 justify-center">
             
              <div className="icon h-10 w-10 border-4 border-slate-600 flex items-center justify-center bg-slate-300 rounded-md cursor-pointer">
                <FaDownload />
              </div>
         
              <div className="icon h-10 w-10 border-4 border-slate-600 flex items-center justify-center bg-slate-300 rounded-md cursor-pointer">
                <FaTrash />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Image;
