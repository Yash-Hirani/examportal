// types/next-auth.d.ts

import NextAuth from "next-auth"

declare module "next-auth" {
  interface User {
    id: string
    role: "STUDENT" | "TEACHER" | "ADMIN"  
  }

  interface Session {
    user: {
      id: string
      email: string
      role: "STUDENT" | "TEACHER" | "ADMIN"
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role: "STUDENT" | "TEACHER" | "ADMIN"
  }
}
