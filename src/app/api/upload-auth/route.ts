// File: app/api/upload-auth/route.ts
import { getUserSession } from "@/utils/getUser"
import { getUploadAuthParams } from "@imagekit/next/server"
import { AppError } from "@/utils/app-error"

export async function GET(request: Request): Promise<Response> {
  try {
    
    await getUserSession(request.headers)

    const { token, expire, signature } = getUploadAuthParams({
            privateKey: process.env.IMAGEKIT_PRIVATE_KEY as string, // Never expose this on client side
            publicKey: process.env.IMAGEKIT_PUBLIC_KEY as string,
            // expire: 30 * 60, // Optional, controls the expiry time of the token in seconds, maximum 1 hour in the future
            // token: "random-token", // Optional, a unique token for request
        })
    
    return Response.json({ token, expire, signature, publicKey: process.env.IMAGEKIT_PUBLIC_KEY })
      
    } catch (error) {
        console.error("Upload auth API error:", error)

        if (error instanceof AppError) {
            return Response.json(
                { error: error.message },
                { status: error.statusCode }
            );
        }

        return Response.json(
            { error: "Failed to authenticate upload request" },
            { status: 500 }
        )
    }
}
