/** Vercel entry point. Application logic and durable data stay on the private Worker. */
async function handle(request: Request) {
  const backend=process.env.SKO_BACKEND_URL, token=process.env.SKO_BACKEND_TOKEN, secret=process.env.SKO_PUBLIC_PROXY_SECRET;
  if(!backend||!token||!secret)return new Response("Hosting configuration is incomplete.",{status:503,headers:{"Cache-Control":"no-store"}});
  const incoming=new URL(request.url);
  let backendUrl: URL;
  try {
    backendUrl = new URL(backend);
  } catch {
    return new Response("SKO_BACKEND_URL must be a valid private Sites URL.",{status:503,headers:{"Cache-Control":"no-store"}});
  }
  // Never let this proxy call its own Vercel deployment; that creates nested
  // function invocations until Vercel returns 508 INFINITE_LOOP_DETECTED.
  if (
    backendUrl.origin === incoming.origin ||
    ["skodesign.nl", "www.skodesign.nl"].includes(backendUrl.hostname) ||
    backendUrl.hostname.endsWith(".vercel.app")
  ) {
    console.error("SKO_BACKEND_URL points back to the public Vercel site.");
    return new Response("Proxy loop prevented. Set SKO_BACKEND_URL to the private Sites origin, not skodesign.nl or a Vercel URL.",{status:503,headers:{"Cache-Control":"no-store"}});
  }
  const path=incoming.searchParams.get("path") || "";
  const upstream=new URL("/"+path.replace(/^\/+/,""),backendUrl);
  for(const [key,value]of incoming.searchParams)if(key!=="path")upstream.searchParams.append(key,value);
  const headers=new Headers(request.headers);
  for(const name of ["host","connection","content-length","transfer-encoding","authorization","oai-authenticated-user-id","oai-authenticated-user-email","x-sko-forwarded-origin","x-sko-proxy-secret","x-sko-client-ip"])headers.delete(name);
  // Sites dispatch expects an explicit bearer scheme for its private bypass token.
  headers.set("OAI-Sites-Authorization",`Bearer ${token.replace(/^Bearer\s+/i,"")}`);
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
    if(location){const destination=new URL(location,backendUrl);if(destination.origin===backendUrl.origin){destination.protocol=incoming.protocol;destination.host=incoming.host;resultHeaders.set("Location",destination.href);}}
    if(!upstream.pathname.startsWith("/assets/")&&!upstream.pathname.startsWith("/_next/"))resultHeaders.set("Cache-Control","private, no-store");
    let responseBody:BodyInit|null=request.method==="HEAD"?null:response.body;
    if(responseBody&&resultHeaders.get("Content-Type")?.includes("text/html")){
      const html=await response.text();
      const transparentArtwork="<style>.project-preview,.project-preview .project-image,.project-preview .project-image img,.project-modal .modal-art{background-color:transparent!important}.project-preview{border-color:transparent!important}</style>";
      responseBody=html.replace(/<\/head\s*>/i,`${transparentArtwork}</head>`);
      resultHeaders.delete("ETag");
      resultHeaders.delete("Content-MD5");
    }
    return new Response(responseBody,{status:response.status,headers:resultHeaders});
  }catch{return new Response("The website is temporarily unavailable. Please try again.",{status:502,headers:{"Cache-Control":"no-store"}});}
}
export default {fetch:handle};
