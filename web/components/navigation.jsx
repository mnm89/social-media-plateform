"use client";

import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { parseToken, isTokenExpired } from "@/lib/token";
import { PlusCircle } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState("");
  useEffect(() => {
    setIsAuthenticated(!isTokenExpired(Cookies.get("access_token")));
    setUserName(parseToken(Cookies.get("access_token")).preferred_username);
  }, []);

  const handleLogout = async () => {
    Cookies.remove("access_token");
    Cookies.remove("refresh_token");
    window.location.href = "/";
  };

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo/Home Link */}
        <Link href="/" className="text-lg font-semibold hover:underline">
          Home
        </Link>

        {/* Links for larger screens */}
        <div className="hidden md:flex space-x-4 items-center">
          <Button asChild variant="secondary">
            <Link href="/create-post">
              <PlusCircle /> Create Post
            </Link>
          </Button>
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="link text-secondary">{userName}</Button>
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
                <DropdownMenuItem onClick={handleLogout}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
        <div className="md:hidden flex flex-col items-center space-y-2 mt-2">
          <Link href="/" className="hover:underline">
            Home
          </Link>
          {isAuthenticated ? (
            <>
              <Link href="/account-settings" className="hover:underline">
                Account Settings
              </Link>
              <Button variant="ghost" onClick={handleLogout}>
                Logout
              </Button>
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
