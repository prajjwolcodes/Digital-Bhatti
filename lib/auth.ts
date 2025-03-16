import { getServerSession, type NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { compare } from "bcrypt"
import prisma from "@/lib/prisma"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials: Record<"email" | "password", string> | undefined): Promise<{ id: string; email: string; name: string; role: string } | null> {
        if (!credentials) {
          throw new Error("Credentials are missing");
        }
        try {
          const user = await prisma.user.findUnique({ where: { email: credentials.email } })
          if (!user)
            throw new Error("User doesnot exist with this email")

          const isPasswordCorrect = await compare(credentials.password, user.password)
          if (!isPasswordCorrect)
            throw new Error("Incorrect Password")
          else
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role
            }

        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
          console.log(errorMessage);
          throw new Error(errorMessage)
        }


      }
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
        token.name = user.name
        token.email = user.email

      }

      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.role = token.role as string
        session.user.name = token.name as string
        session.user.email = token.email as string
      }

      return session
    },
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
  },
}


export const validateRequest = async (): Promise<
  { user: unknown; session: unknown } | { user: null; session: null }
> => {
  // Use `getServerSession` to retrieve the session on the server side
  const session = await getServerSession(authOptions);

  if (!session) {
    return {
      user: null,
      session: null,
    };
  }

  return {
    user: session.user,
    session: session,
  };
};
