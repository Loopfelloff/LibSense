import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Book, Users, LayoutDashboard, Library, LogOut } from 'lucide-react'
import axios from 'axios'
import { logoutAPI } from '../../../apis/logout'


interface SidebarProps {
  activeView: string
  setActiveView: (view: string) => void
}

export const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView }) => {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const navigation = useNavigate()

  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'books', label: 'Manage Books', icon: Book },
    { id: 'authors', label: 'Manage Authors', icon: Users },
  ]

  const handleLogout = async () => {

      try{

	  const returnVal = await logoutAPI()

	  if(returnVal){
	      navigation("/login")
	      return
	  }
	  else{
	      alert("logout failed")
	  }

      }
      catch(err : unknown){

	  if(axios.isAxiosError(err)){
		alert(`${err.name}`)
		console.log(err.response?.data)
	  }
	
      }

  }

  return (
    <div className="w-64 bg-gradient-to-b from-gray-50 to-gray-100 border-r border-gray-200 min-h-screen p-4 flex flex-col">
      <div className="mb-8 pb-4 border-b border-gray-300">
        <div className="flex items-center gap-2 mb-2">
          <Library size={28} className="text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-800">LibSense</h1>
        </div>
        <p className="text-xs text-gray-500 ml-9">Admin Panel</p>
      </div>
      
      <nav className="flex-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = activeView === item.id
          
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-all duration-200 ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md transform scale-105'
                  : 'text-gray-700 hover:bg-gray-200 hover:shadow-sm'
              }`}
            >
              <Icon size={20} />
              <span className="font-medium">{item.label}</span>
            </button>
          )
        })}
      </nav>

      {/* Logout Button */}
      <button
        onClick={() => setShowLogoutConfirm(true)}
        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-4 text-red-600 hover:bg-red-50 hover:shadow-sm transition-all duration-200 border border-red-200"
      >
        <LogOut size={20} />
        <span className="font-medium">Logout</span>
      </button>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-xl max-w-sm w-full mx-4 animate-[flipIn_0.3s_ease-out]">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Confirm Logout</h2>
            <p className="text-gray-600 mb-6">Are you sure you want to logout?</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="pt-4 border-t border-gray-300 text-xs text-gray-500 text-center">
        <p>© 2025 LibSense</p>
        <p className="mt-1">Library Management System</p>
      </div>

      <style>{`
        @keyframes flipIn {
          from {
            transform: perspective(400px) rotateX(-90deg);
            opacity: 0;
          }
          to {
            transform: perspective(400px) rotateX(0deg);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  )
}
