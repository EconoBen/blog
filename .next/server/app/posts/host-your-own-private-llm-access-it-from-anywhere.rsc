1:"$Sreact.fragment"
2:I[2848,["874","static/chunks/874-218abc435b2ae46c.js","177","static/chunks/app/layout-04a0c423dc4c7100.js"],"default"]
3:I[7555,[],""]
4:I[1295,[],""]
6:I[9665,[],"OutletBoundary"]
9:I[4911,[],"AsyncMetadataOutlet"]
b:I[9665,[],"ViewportBoundary"]
d:I[9665,[],"MetadataBoundary"]
f:I[6614,[],""]
:HL["/_next/static/media/e4af272ccee01ff0-s.p.woff2","font",{"crossOrigin":"","type":"font/woff2"}]
:HL["/_next/static/css/e67a3fef1494970c.css","style"]
0:{"P":null,"b":"ZIsDc9NLOzuz-XovXmNxI","p":"","c":["","posts","host-your-own-private-llm-access-it-from-anywhere"],"i":false,"f":[[["",{"children":["posts",{"children":[["slug","host-your-own-private-llm-access-it-from-anywhere","d"],{"children":["__PAGE__",{}]}]}]},"$undefined","$undefined",true],["",["$","$1","c",{"children":[[["$","link","0",{"rel":"stylesheet","href":"/_next/static/css/e67a3fef1494970c.css","precedence":"next","crossOrigin":"$undefined","nonce":"$undefined"}]],["$","html",null,{"lang":"en","children":["$","body",null,{"className":"__className_e8ce0c","children":["$","$L2",null,{"children":["$","$L3",null,{"parallelRouterKey":"children","error":"$undefined","errorStyles":"$undefined","errorScripts":"$undefined","template":["$","$L4",null,{}],"templateStyles":"$undefined","templateScripts":"$undefined","notFound":[[["$","title",null,{"children":"404: This page could not be found."}],["$","div",null,{"style":{"fontFamily":"system-ui,\"Segoe UI\",Roboto,Helvetica,Arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\"","height":"100vh","textAlign":"center","display":"flex","flexDirection":"column","alignItems":"center","justifyContent":"center"},"children":["$","div",null,{"children":[["$","style",null,{"dangerouslySetInnerHTML":{"__html":"body{color:#000;background:#fff;margin:0}.next-error-h1{border-right:1px solid rgba(0,0,0,.3)}@media (prefers-color-scheme:dark){body{color:#fff;background:#000}.next-error-h1{border-right:1px solid rgba(255,255,255,.3)}}"}}],["$","h1",null,{"className":"next-error-h1","style":{"display":"inline-block","margin":"0 20px 0 0","padding":"0 23px 0 0","fontSize":24,"fontWeight":500,"verticalAlign":"top","lineHeight":"49px"},"children":404}],["$","div",null,{"style":{"display":"inline-block"},"children":["$","h2",null,{"style":{"fontSize":14,"fontWeight":400,"lineHeight":"49px","margin":0},"children":"This page could not be found."}]}]]}]}]],[]],"forbidden":"$undefined","unauthorized":"$undefined"}]}]}]}]]}],{"children":["posts",["$","$1","c",{"children":[null,["$","$L3",null,{"parallelRouterKey":"children","error":"$undefined","errorStyles":"$undefined","errorScripts":"$undefined","template":["$","$L4",null,{}],"templateStyles":"$undefined","templateScripts":"$undefined","notFound":"$undefined","forbidden":"$undefined","unauthorized":"$undefined"}]]}],{"children":[["slug","host-your-own-private-llm-access-it-from-anywhere","d"],["$","$1","c",{"children":[null,["$","$L3",null,{"parallelRouterKey":"children","error":"$undefined","errorStyles":"$undefined","errorScripts":"$undefined","template":["$","$L4",null,{}],"templateStyles":"$undefined","templateScripts":"$undefined","notFound":"$undefined","forbidden":"$undefined","unauthorized":"$undefined"}]]}],{"children":["__PAGE__",["$","$1","c",{"children":["$L5",null,["$","$L6",null,{"children":["$L7","$L8",["$","$L9",null,{"promise":"$@a"}]]}]]}],{},null,false]},null,false]},null,false]},null,false],["$","$1","h",{"children":[null,["$","$1","yZhe8BmnZe3OAkcVX7cXyv",{"children":[["$","$Lb",null,{"children":"$Lc"}],["$","meta",null,{"name":"next-size-adjust","content":""}]]}],["$","$Ld",null,{"children":"$Le"}]]}],false]],"m":"$undefined","G":["$f","$undefined"],"s":false,"S":true}
10:"$Sreact.suspense"
11:I[4911,[],"AsyncMetadata"]
e:["$","div",null,{"hidden":true,"children":["$","$10",null,{"fallback":null,"children":["$","$L11",null,{"promise":"$@12"}]}]}]
8:null
13:I[6874,["874","static/chunks/874-218abc435b2ae46c.js","601","static/chunks/601-bda34c32a07f1aee.js","858","static/chunks/app/posts/%5Bslug%5D/page-9394db66ac0edac0.js"],""]
14:I[4372,["874","static/chunks/874-218abc435b2ae46c.js","601","static/chunks/601-bda34c32a07f1aee.js","858","static/chunks/app/posts/%5Bslug%5D/page-9394db66ac0edac0.js"],"default"]
15:I[1778,["874","static/chunks/874-218abc435b2ae46c.js","601","static/chunks/601-bda34c32a07f1aee.js","858","static/chunks/app/posts/%5Bslug%5D/page-9394db66ac0edac0.js"],"default"]
16:T64b9,

![Cole Thomas - The Oxbow](/assets/2025/01/1060px-Cole_Thomas_The_Oxbow_The_Connecticut_River_near_Northampton_1836-1.jpg)

**Ben Labaschin **on Jan 06, 2025 **3

## Host Your Own Local LLM / RAG Behind a Private VPN, Access It From Anywhere

# Part One

#### Building Our LLM: Making It Accessible To Us Alone—Anywhere

The other day, I was reading [this](https://tdhopper.com/blog/accessing-my-home-server-around-the-world-with-custom-domain-names/) article by Tim Hopper about how to host your Synology and Synology services on their own (sub)domains all while hiding each service behind a personal VPN. As I was following along the article, implementing this solution on my own Synology, I realized—wait, why couldn't I use my Synology to serve my own LLM service through a custom domain too? For that matter, if I built a RAG around my Obsidian notes (also stored and served on my Synology), I could theoretically have my own note-based RAG accessible anywhere in the world, without taking up precious compute on my local computer to serve it.

What followed was a few hours of tinkering and learning. After troubleshooting a few mistakes made along the way, I had it: my own local model and RAG system hidden behind a lightweight VPN (Tailscale), accessible only by me anywhere in the world (with an internet connection).

In this first article, I will walk you through how I built this system up until you are able to access your own, personal LLM located safely behind a Tailscale VPN. In a follow-up article, I will describe how I built a RAG system for my notes that I can query.

**Services Used In This Article**

| Service                                                 | Description                                                                     | Cost(s)                                                                                                                                                                                        |
| ------------------------------------------------------- | ------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Cloudflare](https://www.cloudflare.com/)               | For hosting a domain.                                                           | Domain reservation, potential transfer costs from a different host                                                                                                                             |
| [Caddy](https://caddyserver.com/)                       | For creating a reverse-proxy service for my sub-domains.                        | Free                                                                                                                                                                                           |
| [Tailscale](https://tailscale.com/)                     | A lightweight VPN to hide my services behind.                                   | Free for personal use                                                                                                                                                                          |
| [Ollama](https://ollama.com/)                           | For building and serving my LLM.                                                | Free                                                                                                                                                                                           |
| [Synology NAS](https://www.synology.com/en-us)          | A personal home cloud solution for hosting files, services, and much more.      | Pricey. Check out [NewEgg](https://www.newegg.com/) or [B\&H](https://www.newegg.com/), they periodically have sales.                                                                          |
| (Optional) [Raspberry Pi](https://www.raspberrypi.com/) | For hosting my reverse proxy service (you can just use Synology if you'd like). | You can get a Raspberry Pi for "cheap" these days on [Amazon](https://a.co/d/eq9d0ql) or wherever you buy your tech. If you want to be really rebellious, you could even try using an old fold |

## Where To Proxy?

A brief note about where to place your reverse proxy. Your Synology NAS (or whatever cloud solution you use) is very likely capable of hosting the reverse proxy. Most of the instructions below will apply the same way. The reason I host my reverse proxy on a separate machine than my NAS is:

1. **Separation of concerns**: My Synology already does a lot and if I can offload something lightweight to my Pi, I will.
2. **Paranoia**: With my reverse proxy on the Pi, that's one step away from the Synology and makes it somewhat more secure.
3. **Troubleshooting**: If I want to adjust the proxy in someway, I just need to mess with the Pi and not the Synology as well.

# **Setting Up Our Reverse Proxy**

### Access Your Reverse Proxy Machine

To get started, let's begin by creating our reverse proxy server. For the uninitiated, a reverse proxy server is basically just system that sits between a client device—which hopes to access certain backend services—and the services themselves. Reverse proxies are appealing for many reasons. For our purposes they're convenient because they:

1. Centralize access to our services through a single, secure point of entry.
2. Act as a central pipeline to reroute client device requests (i.e. CLI or GUI API calls) to their appropriate backend services.

I'm going to be setting up my reverse proxy on my Raspberry Pi. Should you want to set up a different way, there are plenty of articles like [this](https://www.wundertech.net/synology-reverse-proxy-setup-config/) one.

The first thing you'll want to do is find your Raspberry Pi IP address (or whatever machine you plan to host your reverse proxy on). Note, the machine you host on should be an always-on server. So a personal laptop probably won't do. If you don't know what network your Pi / machine is on, you can try the following lines of code try the [arp-scan](https://formulae.brew.sh/formula/arp-scan) package to scan your local network for a Raspberry Pi.

```bash
sudo arp-scan --interface=eth0 --localnet # alternatively try wlan0
```

Once you see your pi, you'll want to `ssh` into the network. You'll need the hostname of the service. Usually the hostname is `raspberrypi`. Altogether you'll type:

```shell
ssh raspberrypi@<LOCAL IP>
```

Here's an example of what that will look like.

![SSHing into your reverse proxy machine via CLI](/assets/2025/01/ssh_into_pi.png)

SSHing into your reverse proxy machine via CLI

## Install and Setup Tailscale on Your Raspberry Pi

Once you’re connected to your “always-on” reverse proxy machine (in my case, a Raspberry Pi), we'll want to install [Tailscale](https://tailscale.com/) to keep everything private. Tailscale creates a lightweight VPN, meaning only devices you’ve authenticated can access your reverse proxy—or any other service behind it.

1. **Install Tailscale**\
   If you’re on a Raspberry Pi, you can follow Tailscale’s official docs or run:

   ```bash
   curl -fsSL https://tailscale.com/install.sh | sh
   ```

   That script detects your Pi’s OS and installs Tailscale for you.

2. **Authenticate Your Pi**

   ```bash
   sudo tailscale up
   ```

   This will give you a link to tailscale.com where you log in with your own account, or SSO using a Google/GitHub/Microsoft account. Once authorized, your Pi will show up in your Tailscale admin panel.

3. **Verify Connectivity**\
   On another device already running Tailscale (like your laptop), run:

   ```bash
   ping <tailscale-ip-of-your-pi>
   ```

If you see responses, you’re good to go. No one else on the internet can see that IP—only your Tailscale-connected devices.

## **Install Tailscale n Your Synology**

Next, let’s do the same on your Synology, so it can join the Tailscale network and expose services via its Tailscale IP.

1. Open Synology Package Center and search for **Tailscale** (or manually install Tailscale following official instructions).
2. Log into Tailscal\* directly from the Synology Tailscale client. The NAS should now appear in your Tailscale admin panel.
3. Grab the Synology Tailscale IP by checking the Tailscale client UI or your admin panel. It typically looks like `100.x.x.x`.

Keep that IP handy—we’ll need it next when we configure Caddy to reverse-proxy Synology services.

## **Obtain a Domain Name**

If you want to access your home services at a nice custom URL (like `home.mydomain.com`), you’ll need a domain. You can purchase (or transfer) a domain in a few ways:

* Through Cloudflare directly, if you want to manage everything in one place.
* Via a separate registrar like Namecheap or GoDaddy. If you do this, just update your domain’s nameservers to point to Cloudflare so Cloudflare can manage the DNS records.

Personally, every domain I have, I have now transferred to Cloudflare. I like what they're doing as a company, and appreciate all the options and quality of life use-cases afforded to me with a Cloudflare account. Whichever route you choose, once you have the domain set up in your dashboard, you’ll be ready to add DNS records for your Tailscale IP and configure Caddy.

## **Add a Cloudflare DNS Record for Your Tailscale IP**

Before we move on to obtaining a Cloudflare API token, let’s create (or update) the DNS record for the domain/subdomain that will point to your Pi.

1. Log In to your Cloudflare dashboard.
2. Select Your Domain from the list.
3. **Go to DNS** → **Records** → Click **Add record**.
4. **Record Type**: Choose **A**.
5. **Name**: Enter the subdomain you’ll be using (e.g. `home` for `home.mydomain.com`).
6. **IPv4 address**: Paste the Tailscale IP of your Pi (e.g. `100.x.x.x`).
7. **Proxy status**: Typically set to “DNS only” so traffic goes directly to your Pi over Tailscale. *(Some folks prefer turning off Cloudflare’s orange-cloud proxying here, since Tailscale is handling security.)*

Save the record. Even though this Tailscale IP isn’t publicly routable, Cloudflare will still let you create an A record for it—this is **key** to how Caddy does its DNS challenge. If you are not using Cloudflare, the API token logic should similarly apply to through your domain provider.

## **Add a Wildcard DNS Record for Your Tailscale IP (Optional)**

If you’d like to use multiple subdomains (e.g., `home.mydomain.com`, `llm.mydomain.com`, `photos.mydomain.com`, etc.) without adding separate A records each time, you can create a **wildcard** A record. This instructs Cloudflare that any subdomain of `mydomain.com` should resolve to the same IP—in our case, your Pi’s Tailscale IP.

1. Log In to your Cloudflare dashboard.
2. Select Your Domain from the list.
3. **Go to DNS** → **Records** → Click **Add Record**.
4. **Record Type**: Choose **A**.
5. **Name**: Enter `*` (this is your wildcard subdomain).
6. **IPv4 address**: Paste the Tailscale IP of your Pi (e.g., `100.x.x.x`).
7. **Proxy status**: Typically set to “DNS only” so traffic goes directly to your Pi over Tailscale.

Click **Save**. Even though `100.x.x.x` isn’t publicly routable, Cloudflare will still let you create an A record for it—this is **key** to how Caddy does its DNS challenge. Now, **any** subdomain like `home.mydomain.com` or `llm.mydomain.com` will resolve to your Pi’s Tailscale IP.

### Install and Setup Caddy

Next, we install [Caddy](https://caddyserver.com/) on the Pi to handle the actual reverse proxying.

1. **Install Caddy**

   **First, update your package list and install necessary tools for secure package management.**

   ```bash
   sudo apt-get update
   sudo apt-get install -y debian-keyring debian-archive-keyring apt-transport-https
   ```

   **This downloads and installs Caddy's GPG security from Cloudsmith (a package distribution platform).**

   ```bash
   curl -1sLf https://dl.cloudsmith.io/public/caddy/stable/gpg.key | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
   ```

   **Add Caddy's official repository to APT package sources.**

   ```bash
   curl -1sLf "https://dl.cloudsmith.io/public/caddy/stable/deb/debian.repo" | sudo tee /etc/apt/sources.list.d/caddy-stable-debian.repo
   ```

   **Install Caddy fully into your system**

   ```bash
   sudo apt-get update
   sudo apt-get install caddy
   ```

2. **Setup your Caddy** folder and permissions. Caddy will need access to `/etc/caddy`.

   ```bash
   # Create the Caddy folder in /etc/
   sudo mkdir /etc/caddy/
   ```

   **Give write permissions to the folder**

   ```bash
   sudo chmod 755 /etc/caddy/
   ```

# Get Your Cloudflare API Token

Here we'll create an API token that has permission to edit / access your DNS records for your personal domain certificate.

1. Log into Cloudflare and navigate to the user icon at the top right of your homepage. Select **My Profile** → **API Tokens**.
2. Select **Create Tokens** → **Edit Zone DNS: Use Template**
3. Next you'll want to go to Zone Resources. For the middle drop-down, as opposed to "all zones" you'll want to select "Specific zone" and then in the next dropdown select the specific domain you'd like to dedicate to your Reverse Proxy private domain server. For more, see the image below.

![Cloudflare DNS Configuration](/assets/2025/01/cloudflare_dns.png)

Accessing your Cloudflare DNS API key

### Create a Caddy Environment File

1. Create a file called `caddy.env` (or `cloudflare.env`, etc.) where Caddy can read environment variables (you can keep it in `/etc/caddy`, for instance). `touch /etc/caddy/caddy.env && nano /etc/caddy/caddy.env` should do fine.

2. Paste your token from the previous step inside the file, like so:

   ```bash
   CLOUDFLARE_API_TOKEN=your_cloudflare_api_token_goes_here
   ```

3. Load this environment file when starting Caddy, or source it into your shell. The approach I took is to reload Caddy after exiting the file via `systemctl`, i.e. `sudo systemctl reload caddy`

### Configure DNS Challenge in Caddyfile

At `/etc/caddy/Caddyfile`, set up your domain(s). Let’s assume you want to expose access to your Synology home screen service at `home.mydomain.com`, forwarded to Synology’s Tailscale IP on port 5001 (or whichever service port you like).

```bash
{
    email [email protected]
    debug
}

(common) {
    header {
        # Enable HSTS
        Strict-Transport-Security "max-age=31536000; includeSubDomains"
        # Prevent clickjacking
        X-Frame-Options "DENY"
        # Help prevent XSS attacks
        X-Content-Type-Options "nosniff"
    }
}

# Handle domain access
home.mydomain.com {
    tls {
        dns cloudflare {env.CLOUDFLARE_API_TOKEN}
    }
    import common
    reverse_proxy 100.xx.xx.xx:5001 {
        transport http {
            tls_insecure_skip_verify
        }
    }
}
```

Where:

* `home.mydomain.com` is the subdomain you created in Cloudflare.
* `100.xx.xx.xx` is the **Synology’s Tailscale IP** you grabbed after installing Tailscale on the NAS.
* `:5001` is an example port—adjust to match the Synology service you want to proxy.

Caddy will automatically create and renew a **publicly trusted** certificate for `home.mydomain.com` using Cloudflare. The key advantage of the DNS challenge is that Caddy doesn’t need to listen on public ports 80 or 443—perfect if you’re behind Tailscale or otherwise hiding your server.

Finally let's reload Caddy with our new settings.

```bash
sudo systemctl reload caddy
```

or (if you prefer an alias in your `~/.bash_aliases`):

```bash
alias caddyreload='sudo systemctl reload caddy' # Then just do: caddyreload
```

That’s it for the reverse proxy. You now have a Pi that’s behind Tailscale and is also running Caddy to proxy any domain or subdomain you like to your home services—assuming your DNS points to your Pi’s Tailscale IP. The best part is, you can repeat this for as many subdomains as you like—maybe `photos.mydomain.com`, `media.mydomain.com`, etc.—all of them hidden behind Tailscale and fronted by a Pi running Caddy.

## **Configure Caddy for Each Subdomain**

If you used a wildcard record, you can define specific sites (subdomains) within Caddy:

```bash
{
    email [email protected]
    debug
}

(common) {
    header {
        Strict-Transport-Security "max-age=31536000; includeSubDomains"
        X-Frame-Options "DENY"
        X-Content-Type-Options "nosniff"
    }
}

# Example #1: home.mydomain.com -> Synology Tailscale IP:5001
home.mydomain.com {
    tls {
        dns cloudflare {env.CLOUDFLARE_API_TOKEN}
    }
    import common
    reverse_proxy 100.x.x.x:5001 {
        transport http {
            tls_insecure_skip_verify
        }
    }
}

# Example #2: files.mydomain.com -> Some other service on port 8000
files.mydomain.com {
    tls {
        dns cloudflare {env.CLOUDFLARE_API_TOKEN}
    }
    import common
    reverse_proxy 100.x.x.x:8000 {
        transport http {
            tls_insecure_skip_verify
        }
    }
}

# (Add more subdomains as needed)
```

Finally, reload Caddy:

```bash
sudo systemctl reload caddy
```

And that’s it! Now you have a wildcard DNS setup plus a fine-grained Caddy config for each subdomain. This allows you to add or remove subdomains in Caddy at will, without needing to touch Cloudflare DNS again.

One note however: you'll want to notice that with each new subdomain youn specify, you'll want to allocate a specific port for that service. That way, despite using the same underlying Synology IP, you'll be able to route to its different services.

## **Building and Serving Our LLM**

Now for the fun part: hosting a local LLM (Large Language Model) so you can query it from anywhere, while still keeping it private behind Tailscale.

### **Install and Setup Ollama**

[Ollama](https://ollama.com/) is a neat utility that makes it easy to download and run large language models on your own hardware—CPU or GPU. We’ll run it in [Container Manager](https://www.synology.com/en-global/dsm/feature/docker) on a Synology NAS in my case, but you can do the same on the Pi or any Docker-capable box.

1. Create an Ollama directory in your volume

   ```bash
   sudo mkdir /volume1/docker/
   ```

   **Give that directory permissions**

   ```bash
   sudo chmod 755 /volume1/docker/
   ```

   **Create the requisite Ollama directory**

   ```bash
   sudo mkdir /volume1/docker/caddy/
   ```

   **Give Ollama permissions**

   ```bash
   sudo chmod 755 /volume1/docker/ollama
   ```

2. **Create a Docker Compose File**\
   On your Synology, open up **Container Manager** (or the Docker UI, depending on DSM version). Create a new **Project** and paste something like:

```yaml
version: "3"

services:
  webui:
    image: ollamawebui/ollama-webui:latest
    ports:
      - "3000:8080"
    environment:
      - OLLAMA_API_BASE_URL=https://llm.mydomain.com
    volumes:
      - open-webui:/data
    depends_on:
      - ollama
    network_mode: synobridge

  ollama:
    image: ollama/ollama:latest
    container_name: ollama
    hostname: llm.mydomain.com
    environment:
      PUID: 1027
      PGID: 65536
      UMASK: 002
      TZ: 'America/Los_Angeles'
      VIRTUAL_HOST: 'llm.mydomain.com'
    volumes:
      - /volume1/docker/ollama:/root/.ollama
    ports:
      - "11434:11434"
    restart: unless-stopped
    network_mode: synobridge
volumes:
  open-webui:
```

That means:

* We’re pulling `ollama/ollama:latest`.
* Port `11434` is exposed, so you can hit the model with `http://<SynologyIP>:11434`.
* We store the models in `/volume1/docker/ollama`.

**Deploy the Container**

* Once saved, start the container. Check logs in Container Manager to confirm it’s running. If you see “Ollama is running” or can `curl http://<SynologyIP>:11434`, you’re in business.

## A Note About Synobridge

In the Docker Compose file, you'll notice we're using `network_mode: synobridge`. Synobridge is Synology's bridge network driver that allows Docker containers to communicate as if they were on your local network. This means containers using `synobridge` can:

* Access your LAN resources directly using local IP addresses
* Be accessed by other devices on your network using the container's port
* Communicate with other containers using their container names as hostnames

To use synobridge, make sure the "Use the same network as Docker Host" option is enabled in Container Manager when creating your container. You can find this under Network settings. If you prefer to use Docker's default bridge network instead, you can simply omit the `network_mode` line entirely - though you might need to set up explicit container-to-container networking if you add more services later. If you do want or need to proceed with `synobridge`, check out [this](https://drfrankenstein.co.uk/step-3-setting-up-a-docker-bridge-network/) article for setup instructions.

### **Download a Model**

Ollama hosts a library of models you can pull. For instance:

```bash
curl -X POST http://<SynologyIP>:11434/api/pull -d '{   "name": "llama3.2:1b" }'
```

Note: We’re using a small 1B param model so it fits in \~4GB RAM. Models like 7B, 13B, or 70B will require significantly more memory.

### **Access The Model**

If you want to pipe the model through your Pi’s reverse proxy:

1. **Edit Caddyfile**\
   Point `llm.yourdomain.com` to `<SynologyIP>:11434` (or whatever your Synology’s LAN IP is).

   ```bash
   llm.yourdomain.com {
   tls {
       dns cloudflare {env.CLOUDFLARE_API_TOKEN}
   }
   import common
   reverse_proxy http://100.xx.xx.xx:11434 {
       header_up Host {http.reverse_proxy.upstream.hostport}
   }
   }
   ```

2. **Reload Caddy**

   ```bash
   caddyreload
   ```

   Now hitting `https://llm.yourdomain.com/api/generate` will forward traffic to your Synology’s Ollama container on port 11434.

***

## Testing Our LLM from a Local Computer

Now that our LLM is safely tucked behind Tailscale, it’s time to actually *use* it! We’ll confirm everything works by accessing the LLM from a local computer (or laptop) that’s already on our Tailscale network.

## Quick CLI Check

First, let’s do a quick check in the terminal to ensure our output is correct:

```bash
curl -v https://llm.mydomain.com/api/version
```

Let's check our output:

![Ollama is Running](/assets/2025/01/ollama_is_running.png)

We have successfully connected to Ollama!

Here’s what’s happening:

1. We’re using our custom domain (`llm.mydomain.com`), which points to the Raspberry Pi’s Tailscale IP.
2. Caddy is listening for requests on HTTPS and forwarding them to Ollama on the Synology (or whichever box you’re using).

## Web UI

If you set up the Ollama Web UI and pointed a domain like `ui.mydomain.com` at it, open your browser:

```
https://ui.mydomain.com
```

You should see a straightforward interface listing any models you’ve downloaded. From there, you can select a model and start chatting. If you hit connection errors, double-check:

* That you’re on Tailscale and can ping your Pi.
* Caddy has a block in `/etc/caddy/Caddyfile` for `ui.mydomain.com`.
* Your Docker Compose for the WebUI maps the correct ports (`3000:8080` or however you set it up).

### 3. Testing the Chat Endpoint

If you’re a command-line fan and want to chat via `curl`, try:

```bash
curl -X POST https://llm.mydomain.com/api/chat \
  -d '{
    "model": "llama3.2:1b",
    "messages": [
      {"role": "user", "content": "Tell me a joke!"}
    ],
    "stream": false
  }'
```

With `"stream": false`, the response should arrive in one shot. If you’d rather see each token appear in real time, set `"stream": true` and watch the output scroll by.

![Ollama Query](/assets/2025/01/ollama_query.png)

In depth Ollama query via your CLI using Ollama. We get a successful response from the LLM!

### 4. Add a Handy Alias

For extra convenience, you can add a quick alias in your `~/.bashrc` (or `~/.zshrc`) to query the LLM without retyping `curl` all the time:

```bash
alias @='f(){ \
  curl -s -X POST "https://llm.mydomain.com/api/chat" \
    -d "{\"model\":\"llama3.2:1b\",\"messages\":[{\"role\":\"user\",\"content\":\"$*\"}],\"stream\":false}" \
    | jq -r .message.content; \
  unset -f f; \
}; f'
```

Then, just open a new terminal (or run `source ~/.bashrc`) and do: `@ "Knock knock"`

![Custom LLM CLI](/assets/2025/01/custom_llm_cli.png)

Response from the CLI API call to the hosted model.

Voila! Instant local LLM request from your Tailscale-protected domain.

***

### Troubleshooting

* **No Response or Timeouts**\
  Confirm you can `ping <your-pi-tailscale-ip>` or `curl <synology-tailscale-ip>:11434`. If that fails, something’s up with Tailscale or your Docker container.
* **SSL or Certificate Errors**\
  Make sure your Cloudflare DNS challenge is set up correctly. Caddy automatically renews certs, but if your domain is new, it might take a few minutes to propagate.
* **Model OOM (Out of Memory)**\
  If the model fails to load, consider picking a smaller one. Check your Synology’s actual RAM; a 7B+ model likely won’t fit on a 4GB NAS.

With this, you’ve proven your local LLM is not only up and running, but also accessible from anywhere you’re connected via Tailscale—fully encrypted, no weird firewall rules, and no random open ports to the public internet.

***

Keep an eye out for part two this series in which I demonstrate how to take your LLM to the next level and operate as your own, private knowledge system you can query with natural from anywhere in the world!
5:["$","article",null,{"className":"post-detail","children":[["$","header",null,{"className":"post-header","children":[["$","div",null,{"className":"breadcrumb","children":["$","$L13",null,{"href":"/posts","children":"← Back to all posts"}]}],["$","h1",null,{"className":"post-title","children":"Host Your Own Local LLM / RAG Behind a Private VPN, Access It From Anywhere"}],["$","div",null,{"className":"post-meta","children":[["$","time",null,{"className":"post-date","children":"January 5, 2025"}],["$","span",null,{"className":"post-separator","children":"•"}],["$","span",null,{"className":"post-reading-time","children":[18," min read"]}]]}],["$","div",null,{"className":"post-tags","children":[["$","$L13","LLM",{"href":"/tags/LLM","className":"post-tag","children":"LLM"}],["$","$L13","RAG",{"href":"/tags/RAG","className":"post-tag","children":"RAG"}],["$","$L13","Synology",{"href":"/tags/Synology","className":"post-tag","children":"Synology"}],["$","$L13","Ollama",{"href":"/tags/Ollama","className":"post-tag","children":"Ollama"}],["$","$L13","Caddy",{"href":"/tags/Caddy","className":"post-tag","children":"Caddy"}],["$","$L13","Tailscale",{"href":"/tags/Tailscale","className":"post-tag","children":"Tailscale"}],["$","$L13","self-hosting",{"href":"/tags/self-hosting","className":"post-tag","children":"self-hosting"}],["$","$L13","reverse proxy",{"href":"/tags/reverse proxy","className":"post-tag","children":"reverse proxy"}],["$","$L13","VPN",{"href":"/tags/VPN","className":"post-tag","children":"VPN"}]]}]]}],"$undefined",["$","div",null,{"className":"post-audio-section","children":["$","$L14",null,{"audioUrl":"https://tech-notes-blog.s3.us-west-2.amazonaws.com/audio/host-your-own-private-llm-access-it-from-anywhere.mp3","title":"Listen to this post","className":"post-audio-player"}]}],["$","div",null,{"className":"post-content","children":["$","$L15",null,{"content":"$16"}]}],["$","footer",null,{"className":"post-footer","children":[["$","div",null,{"className":"post-footer-tags","children":[["$","h3",null,{"children":"Tagged with:"}],["$","div",null,{"className":"post-tags","children":[["$","$L13","LLM",{"href":"/tags/LLM","className":"post-tag","children":"LLM"}],["$","$L13","RAG",{"href":"/tags/RAG","className":"post-tag","children":"RAG"}],["$","$L13","Synology",{"href":"/tags/Synology","className":"post-tag","children":"Synology"}],["$","$L13","Ollama",{"href":"/tags/Ollama","className":"post-tag","children":"Ollama"}],["$","$L13","Caddy",{"href":"/tags/Caddy","className":"post-tag","children":"Caddy"}],["$","$L13","Tailscale",{"href":"/tags/Tailscale","className":"post-tag","children":"Tailscale"}],["$","$L13","self-hosting",{"href":"/tags/self-hosting","className":"post-tag","children":"self-hosting"}],["$","$L13","reverse proxy",{"href":"/tags/reverse proxy","className":"post-tag","children":"reverse proxy"}],["$","$L13","VPN",{"href":"/tags/VPN","className":"post-tag","children":"VPN"}]]}]]}],["$","div",null,{"className":"post-navigation","children":["$","$L13",null,{"href":"/posts","className":"back-to-posts","children":"← View all posts"}]}]]}]]}]
c:[["$","meta","0",{"charSet":"utf-8"}],["$","meta","1",{"name":"viewport","content":"width=device-width, initial-scale=1"}]]
7:null
a:{"metadata":[["$","title","0",{"children":"Host Your Own Local LLM / RAG Behind a Private VPN, Access It From Anywhere | Economic Notes"}],["$","meta","1",{"name":"description","content":"A step-by-step guide on hosting your own private Large Language Model and RAG system using Synology, Tailscale, Caddy, and Ollama—all protected behind a lightweight VPN and accessible anywhere."}],["$","meta","2",{"name":"author","content":"Benjamin Labaschin"}],["$","link","3",{"rel":"manifest","href":"/manifest.json","crossOrigin":"$undefined"}],["$","meta","4",{"name":"keywords","content":"economics,technology,AI,machine learning,blog"}],["$","meta","5",{"property":"og:title","content":"Host Your Own Local LLM / RAG Behind a Private VPN, Access It From Anywhere"}],["$","meta","6",{"property":"og:description","content":"A step-by-step guide on hosting your own private Large Language Model and RAG system using Synology, Tailscale, Caddy, and Ollama—all protected behind a lightweight VPN and accessible anywhere."}],["$","meta","7",{"property":"og:url","content":"https://econoben.dev/posts/host-your-own-private-llm-access-it-from-anywhere"}],["$","meta","8",{"property":"og:site_name","content":"Economic Notes"}],["$","meta","9",{"property":"og:image","content":"https://econoben.dev/api/og?title=Host+Your+Own+Local+LLM+%2F+RAG+Behind+a+Private+VPN%2C+Access+It+From+Anywhere&date=2025-01-06T00%3A00%3A00.000Z&tags=LLM%2CRAG%2CSynology%2COllama%2CCaddy%2CTailscale%2Cself-hosting%2Creverse+proxy%2CVPN&summary=A+step-by-step+guide+on+hosting+your+own+private+Large+Language+Model+and+RAG+system+using+Synology%2C+Tailscale%2C+Caddy%2C+and+Ollama%E2%80%94all+protected+behind+a+lightweight+VPN+and+accessible+anywhere."}],["$","meta","10",{"property":"og:type","content":"article"}],["$","meta","11",{"property":"article:published_time","content":"2025-01-06T00:00:00.000Z"}],["$","meta","12",{"property":"article:author","content":"Benjamin Labaschin"}],["$","meta","13",{"property":"article:tag","content":"LLM"}],["$","meta","14",{"property":"article:tag","content":"RAG"}],["$","meta","15",{"property":"article:tag","content":"Synology"}],["$","meta","16",{"property":"article:tag","content":"Ollama"}],["$","meta","17",{"property":"article:tag","content":"Caddy"}],["$","meta","18",{"property":"article:tag","content":"Tailscale"}],["$","meta","19",{"property":"article:tag","content":"self-hosting"}],["$","meta","20",{"property":"article:tag","content":"reverse proxy"}],["$","meta","21",{"property":"article:tag","content":"VPN"}],["$","meta","22",{"name":"twitter:card","content":"summary_large_image"}],["$","meta","23",{"name":"twitter:title","content":"Host Your Own Local LLM / RAG Behind a Private VPN, Access It From Anywhere"}],["$","meta","24",{"name":"twitter:description","content":"A step-by-step guide on hosting your own private Large Language Model and RAG system using Synology, Tailscale, Caddy, and Ollama—all protected behind a lightweight VPN and accessible anywhere."}],["$","meta","25",{"name":"twitter:image","content":"https://econoben.dev/api/og?title=Host+Your+Own+Local+LLM+%2F+RAG+Behind+a+Private+VPN%2C+Access+It+From+Anywhere&date=2025-01-06T00%3A00%3A00.000Z&tags=LLM%2CRAG%2CSynology%2COllama%2CCaddy%2CTailscale%2Cself-hosting%2Creverse+proxy%2CVPN&summary=A+step-by-step+guide+on+hosting+your+own+private+Large+Language+Model+and+RAG+system+using+Synology%2C+Tailscale%2C+Caddy%2C+and+Ollama%E2%80%94all+protected+behind+a+lightweight+VPN+and+accessible+anywhere."}]],"error":null,"digest":"$undefined"}
12:{"metadata":"$a:metadata","error":null,"digest":"$undefined"}
