import React from 'react';
import {FaImage, FaFolder, FaLink, FaStickyNote, FaArrowRight, FaUpload} from 'react-icons/fa'
const DashBoard = () => {
  return (
    <div className='flex flex-row gap-3 pb-6 pt-10 justify-center bg-slate-400'>
      
      <div className="flex-col  size-3 h-16 w-20  border-slate-700 border-4 flex items-center justify-center bg-slate-300 rounded-md cursor-pointer">
      <FaImage/>
      <p>Img</p>
      </div>

      <div className="flex-col flex items-center justify-center size-3 h-16 w-20  border-slate-700 border-4   bg-slate-300 rounded-md cursor-pointer">
      <FaFolder/>
      <p>Doc</p>
      </div>


      <div className="flex-col size-3 h-16 w-20  border-slate-700 border-4 flex items-center justify-center  bg-slate-300 rounded-md cursor-pointer">
      <FaLink/>
      <p>Link</p>
      </div>
      <div className="flex-col  size-3 h-16 w-20  border-slate-700 border-4 flex items-center justify-center  bg-slate-300 rounded-md cursor-pointer">
      <FaStickyNote/>
      <p>Note</p>
      </div>
      
    
      <div className="flex-col  size-3 h-16 w-20  border-slate-700 border-4 flex items-center justify-center  bg-slate-300 rounded-md cursor-pointer">
      <FaArrowRight/>
      <p>Log Out</p>
      </div>
      
      
    </div>
  );
}

export default DashBoard;
