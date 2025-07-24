const host = { 
    hostName:process.env.NEXT_PUBLIC_BACKEND_URL,
    api_key:process.env.NEXT_PUBLIC_GEMINI_API_KEY,
    auth_domain:process.env.NEXT_PUBLIC_AUTH_DOMAIN,
    project_id:process.env.NEXT_PUBLIC_PROJECT_ID,
    storage_bucket:process.env.NEXT_PUBLIC_STORAGE_BUCKET,
    messaging_sender_id:process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
    app_id:process.env.NEXT_PUBLIC_APP_ID,
    vap_id:process.env.NEXT_PUBLIC_VAPID,
}
export default host;