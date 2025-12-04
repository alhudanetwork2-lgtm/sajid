import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Video, VideoOff, PhoneOff, MessageSquare, Users, Share, Hand, MoreVertical } from 'lucide-react';
import { User } from '../types';

interface LiveClassProps {
  user: User;
  onEndCall: () => void;
}

export const LiveClass: React.FC<LiveClassProps> = ({ user, onEndCall }) => {
  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);
  const [showChat, setShowChat] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;

    const startCamera = async () => {
      if (cameraOn) {
        try {
          stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false }); // Audio false to prevent feedback loop in demo
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } catch (err) {
          console.error("Camera error:", err);
          setCameraOn(false);
        }
      }
    };

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [cameraOn]);

  return (
    <div className="fixed inset-0 z-50 bg-gray-900 flex flex-col md:flex-row text-white animate-in fade-in duration-300">
      {/* Main Video Area */}
      <div className={`flex-1 flex flex-col relative ${showChat ? 'md:w-3/4' : 'w-full'}`}>
        
        {/* Header Overlay */}
        <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-10 bg-gradient-to-b from-black/50 to-transparent">
          <div>
            <h2 className="font-semibold text-lg">Advanced Mathematics: Calculus II</h2>
            <p className="text-sm opacity-80">01:23:45 • 24 Students</p>
          </div>
          <div className="bg-red-600 px-3 py-1 rounded-full text-xs font-bold animate-pulse">LIVE</div>
        </div>

        {/* Video Grid */}
        <div className="flex-1 p-4 flex items-center justify-center">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-6xl h-full max-h-[80vh]">
            
            {/* Teacher / Main Speaker (Placeholder) */}
            <div className="relative bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-700">
              <img src="https://picsum.photos/800/600" alt="Teacher" className="w-full h-full object-cover" />
              <div className="absolute bottom-4 left-4 bg-black/40 backdrop-blur-md px-2 py-1 rounded text-sm">
                Sarah Teacher (Host)
              </div>
            </div>

            {/* Self View (Camera) */}
            <div className="relative bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-700">
              {cameraOn ? (
                <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover transform scale-x-[-1]" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-800">
                  <div className="w-24 h-24 rounded-full bg-indigo-600 flex items-center justify-center text-3xl font-bold">
                    {user.name.charAt(0)}
                  </div>
                </div>
              )}
              <div className="absolute bottom-4 left-4 bg-black/40 backdrop-blur-md px-2 py-1 rounded text-sm flex items-center space-x-2">
                <span>You</span>
                {!micOn && <MicOff className="w-3 h-3 text-red-400" />}
              </div>
            </div>
            
          </div>
        </div>

        {/* Control Bar */}
        <div className="h-20 bg-gray-800/90 backdrop-blur-md border-t border-gray-700 flex items-center justify-center space-x-4 md:space-x-8 px-4">
          <button 
            onClick={() => setMicOn(!micOn)}
            className={`p-3 rounded-full transition-colors ${micOn ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-500 hover:bg-red-600'}`}
          >
            {micOn ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
          </button>
          
          <button 
            onClick={() => setCameraOn(!cameraOn)}
            className={`p-3 rounded-full transition-colors ${cameraOn ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-500 hover:bg-red-600'}`}
          >
            {cameraOn ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
          </button>

          <button className="hidden md:block p-3 rounded-full bg-gray-700 hover:bg-gray-600">
            <Hand className="w-6 h-6" />
          </button>
          
          <button className="hidden md:block p-3 rounded-full bg-gray-700 hover:bg-gray-600">
            <Share className="w-6 h-6" />
          </button>

          <button 
            onClick={onEndCall}
            className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded-full font-semibold flex items-center space-x-2"
          >
            <PhoneOff className="w-5 h-5" />
            <span className="hidden md:inline">End Class</span>
          </button>

          <button 
            onClick={() => setShowChat(!showChat)}
            className={`p-3 rounded-full transition-colors ${showChat ? 'bg-indigo-600' : 'bg-gray-700 hover:bg-gray-600'}`}
          >
            <MessageSquare className="w-6 h-6" />
          </button>
          
          <button className="md:hidden p-3 rounded-full bg-gray-700 hover:bg-gray-600">
            <MoreVertical className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Side Panel (Chat/Participants) */}
      {showChat && (
        <div className="w-full md:w-80 bg-white text-gray-800 flex flex-col border-l border-gray-200">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="font-semibold">Class Chat</h3>
            <button onClick={() => setShowChat(false)} className="md:hidden"><Users className="w-5 h-5" /></button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
             <div className="flex items-start space-x-2">
               <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-600">ST</div>
               <div className="bg-white p-2 rounded-lg shadow-sm max-w-[80%]">
                 <p className="text-xs font-semibold text-gray-500 mb-0.5">Sarah Teacher</p>
                 <p className="text-sm">Welcome everyone! Please turn on your cameras.</p>
               </div>
             </div>
             <div className="flex items-start space-x-2">
               <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-xs font-bold text-green-600">JD</div>
               <div className="bg-white p-2 rounded-lg shadow-sm max-w-[80%]">
                 <p className="text-xs font-semibold text-gray-500 mb-0.5">John Doe</p>
                 <p className="text-sm">Is the audio clear?</p>
               </div>
             </div>
          </div>

          <div className="p-4 border-t border-gray-200 bg-white">
            <div className="flex space-x-2">
              <input 
                type="text" 
                placeholder="Type a message..." 
                className="flex-1 border rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button className="bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700">
                <MessageSquare className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
