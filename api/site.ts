/** Vercel entry point. Application logic and durable data stay on the private Worker. */
async function handle(request: Request) {
  const backend=process.env.SKO_BACKEND_URL, token=process.env.SKO_BACKEND_TOKEN, secret=process.env.SKO_PUBLIC_PROXY_SECRET;
  if(!backend||!token||!secret)return new Response("Hosting configuration is incomplete.",{status:503,headers:{"Cache-Control":"no-store"}});
  const incoming=new URL(request.url);
  const path=incoming.searchParams.get("path") || "";
  const upstream=new URL("/"+path.replace(/^\/+/,""),backend);
  for(const [key,value]of incoming.searchParams)if(key!=="path")upstream.searchParams.append(key,value);
  const headers=new Headers(request.headers);
  for(const name of ["host","connection","content-length","transfer-encoding","authorization","oai-authenticated-user-id","oai-authenticated-user-email","x-sko-forwarded-origin","x-sko-proxy-secret","x-sko-client-ip"])headers.delete(name);
  headers.set("OAI-Sites-Authorization",token);
  headers.set("X-Sko-Proxy-Secret",secret);
  headers.set("X-Sko-Forwarded-Origin",incoming.origin);
  const clientIp=(request.headers.get("x-vercel-forwarded-for")||request.headers.get("x-forwarded-for")||"").split(",")[0].trim();
  if(/^[0-9a-f:.]{1,60}$/i.test(clientIp))headers.set("X-Sko-Client-IP",clientIp);
  const body=!["GET","HEAD"].includes(request.method)?await request.arrayBuffer():undefined;
  if(body&&body.byteLength>4_000_000)return new Response("Upload too large.",{status:413});
  try{
    const response=await fetch(upstream,{method:request.method,headers,body,redirect:"manual",signal:AbortSignal.timeout(50000)});
    const resultHeaders=new Headers(response.headers);
    resultHeaders.delete("Content-Encoding");resultHeaders.delete("Content-Length");
    const location=resultHeaders.get("Location");
    if(location){const destination=new URL(location,backend);if(destination.origin===new URL(backend).origin){destination.protocol=incoming.protocol;destination.host=incoming.host;resultHeaders.set("Location",destination.href);}}
    if(!upstream.pathname.startsWith("/assets/")&&!upstream.pathname.startsWith("/_next/"))resultHeaders.set("Cache-Control","private, no-store");
    return new Response(request.method==="HEAD"?null:response.body,{status:response.status,headers:resultHeaders});
  }catch{return new Response("The website is temporarily unavailable. Please try again.",{status:502,headers:{"Cache-Control":"no-store"}});}
}
export default {fetch:handle};
