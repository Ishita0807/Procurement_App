'use client'
import { SignOutButton, useUser } from '@clerk/nextjs'
import { ChevronDown } from 'lucide-react'
import { useState } from 'react'

export default function CustomUserMenu() {
  const { user } = useUser()
  const [open, setOpen] = useState(false)

  if (!user) return null

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-3 rounded-xl border border-emerald-200/60 bg-white p-1 shadow-sm transition-all duration-200 hover:bg-emerald-50"
      >
        <img
          src={user.imageUrl}
          alt="User avatar"
          className="h-10 w-10 rounded-full border border-emerald-200 object-cover"
        />
        <div className="flex flex-col text-left">
          <p className="text-xs font-medium text-emerald-800">
            {user.fullName || 'Anonymous'}
          </p>
          <p className="max-w-[120px] truncate text-xs text-emerald-600">
            {user.primaryEmailAddress?.emailAddress}
          </p>
        </div>
        <ChevronDown className="ml-1 h-4 w-4 text-emerald-600" />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 rounded-xl border border-emerald-200/60 bg-white shadow-lg">
          <ul className="flex flex-col p-1">
            <li>
              <SignOutButton>
                <button className="w-full rounded-lg px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50">
                  Log Out
                </button>
              </SignOutButton>
            </li>
          </ul>
        </div>
      )}
    </div>
  )
}