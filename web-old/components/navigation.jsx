"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { useAuth } from "@/components/auth-provider";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { currentUser, logout } = useAuth();

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo/Home Link */}
        <div className="flex gap-6">
          <Link href="/" className="text-lg font-semibold hover:underline">
            Public
          </Link>

          {currentUser && (
            <Link
              href="/posts"
              className="text-lg font-semibold hover:underline"
            >
              Premium
            </Link>
          )}
        </div>

        {/* Links for larger screens */}
        <div className="hidden md:flex space-x-4 items-center">
          {currentUser ? (
            <>
              <Button asChild variant="secondary">
                <Link href="/create-post">
                  <PlusCircle /> Create Post
                </Link>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="link text-secondary">
                    {currentUser?.preferred_username}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-white text-gray-800">
                  <DropdownMenuItem asChild>
                    <Link href="/friends" className="w-full text-left">
                      Friends
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/account-settings" className="w-full text-left">
                      Account Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:underline">
                Login / Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <Button variant="ghost" onClick={() => setIsOpen(!isOpen)}>
            ☰
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden flex flex-col items-left space-y-2 mt-2">
          {currentUser ? (
            <>
              <Link href="/create-post" className="hover:underline">
                Create Post
              </Link>
              <Link href="/friends" className="hover:underline">
                Friends
              </Link>
              <Link href="/account-settings" className="hover:underline">
                Account Settings
              </Link>
              <Link href="#" className="hover:underline" onClick={logout}>
                Logout
              </Link>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:underline">
                Login / Register
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
