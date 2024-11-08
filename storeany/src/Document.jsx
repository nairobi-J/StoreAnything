import React from 'react';
import { FaTrash, FaCopy, FaDownload , FaBoxOpen, FaFolderOpen, FaUpload} from 'react-icons/fa';
import DashBoard from './DashBoard';
const Document = () => {
    const items = [1, 2, 3, 4, 5, 6, 7];
  return (
    <div>
        <DashBoard/>
        <div className="Updoc bg-slate-500">
            <p>Add Document Here:</p>
           
            <FaUpload/>

        </div>
      <div className="doc w-screen h-screen grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-2 bg-slate-300 pt-2">
        
      {
        items.map((items,index)=>{
            return (
                <div key={index} className="doc-item  bg-slate-500 h-1/2 w-100 flex justify-center items-center  rounded-md  gap-1 pt-2 pb-2 -r-2 pl-2">
                    <div className="name">
                    <p>Nameddddddddddddddddddddddd</p>
                    </div>
                 
                 <div className="icons flex gap-2 justify-center items-center">
                 <div className="icon w-10 h-10 flex justify-center items-center  border-2 border-slate-700 rounded-md cursor-pointer">
                  <FaFolderOpen/>
                  </div>
                  <div className="icon w-10 h-10 border-2 flex justify-center items-center border-slate-700 rounded-md cursor-pointer">
                  <FaDownload/> 
                  </div>
                  <div className="icon w-10 h-10 flex justify-center items-center  border-2 border-slate-700 rounded-md cursor-pointer">
                  <FaTrash/>
                  </div>
                 
                 </div>
                  
                  

                </div>
            )
        })
      }

      </div>
    </div>
  );
}

export default Document;
