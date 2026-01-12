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
0:{"P":null,"b":"ZIsDc9NLOzuz-XovXmNxI","p":"","c":["","posts","github_ssh_and_1password"],"i":false,"f":[[["",{"children":["posts",{"children":[["slug","github_ssh_and_1password","d"],{"children":["__PAGE__",{}]}]}]},"$undefined","$undefined",true],["",["$","$1","c",{"children":[[["$","link","0",{"rel":"stylesheet","href":"/_next/static/css/e67a3fef1494970c.css","precedence":"next","crossOrigin":"$undefined","nonce":"$undefined"}]],["$","html",null,{"lang":"en","children":["$","body",null,{"className":"__className_e8ce0c","children":["$","$L2",null,{"children":["$","$L3",null,{"parallelRouterKey":"children","error":"$undefined","errorStyles":"$undefined","errorScripts":"$undefined","template":["$","$L4",null,{}],"templateStyles":"$undefined","templateScripts":"$undefined","notFound":[[["$","title",null,{"children":"404: This page could not be found."}],["$","div",null,{"style":{"fontFamily":"system-ui,\"Segoe UI\",Roboto,Helvetica,Arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\"","height":"100vh","textAlign":"center","display":"flex","flexDirection":"column","alignItems":"center","justifyContent":"center"},"children":["$","div",null,{"children":[["$","style",null,{"dangerouslySetInnerHTML":{"__html":"body{color:#000;background:#fff;margin:0}.next-error-h1{border-right:1px solid rgba(0,0,0,.3)}@media (prefers-color-scheme:dark){body{color:#fff;background:#000}.next-error-h1{border-right:1px solid rgba(255,255,255,.3)}}"}}],["$","h1",null,{"className":"next-error-h1","style":{"display":"inline-block","margin":"0 20px 0 0","padding":"0 23px 0 0","fontSize":24,"fontWeight":500,"verticalAlign":"top","lineHeight":"49px"},"children":404}],["$","div",null,{"style":{"display":"inline-block"},"children":["$","h2",null,{"style":{"fontSize":14,"fontWeight":400,"lineHeight":"49px","margin":0},"children":"This page could not be found."}]}]]}]}]],[]],"forbidden":"$undefined","unauthorized":"$undefined"}]}]}]}]]}],{"children":["posts",["$","$1","c",{"children":[null,["$","$L3",null,{"parallelRouterKey":"children","error":"$undefined","errorStyles":"$undefined","errorScripts":"$undefined","template":["$","$L4",null,{}],"templateStyles":"$undefined","templateScripts":"$undefined","notFound":"$undefined","forbidden":"$undefined","unauthorized":"$undefined"}]]}],{"children":[["slug","github_ssh_and_1password","d"],["$","$1","c",{"children":[null,["$","$L3",null,{"parallelRouterKey":"children","error":"$undefined","errorStyles":"$undefined","errorScripts":"$undefined","template":["$","$L4",null,{}],"templateStyles":"$undefined","templateScripts":"$undefined","notFound":"$undefined","forbidden":"$undefined","unauthorized":"$undefined"}]]}],{"children":["__PAGE__",["$","$1","c",{"children":["$L5",null,["$","$L6",null,{"children":["$L7","$L8",["$","$L9",null,{"promise":"$@a"}]]}]]}],{},null,false]},null,false]},null,false]},null,false],["$","$1","h",{"children":[null,["$","$1","J3EHp_UbhyDPMEPNOMzEZv",{"children":[["$","$Lb",null,{"children":"$Lc"}],["$","meta",null,{"name":"next-size-adjust","content":""}]]}],["$","$Ld",null,{"children":"$Le"}]]}],false]],"m":"$undefined","G":["$f","$undefined"],"s":false,"S":true}
10:"$Sreact.suspense"
11:I[4911,[],"AsyncMetadata"]
e:["$","div",null,{"hidden":true,"children":["$","$10",null,{"fallback":null,"children":["$","$L11",null,{"promise":"$@12"}]}]}]
8:null
13:I[6874,["874","static/chunks/874-218abc435b2ae46c.js","601","static/chunks/601-bda34c32a07f1aee.js","858","static/chunks/app/posts/%5Bslug%5D/page-9394db66ac0edac0.js"],""]
14:I[4372,["874","static/chunks/874-218abc435b2ae46c.js","601","static/chunks/601-bda34c32a07f1aee.js","858","static/chunks/app/posts/%5Bslug%5D/page-9394db66ac0edac0.js"],"default"]
15:I[1778,["874","static/chunks/874-218abc435b2ae46c.js","601","static/chunks/601-bda34c32a07f1aee.js","858","static/chunks/app/posts/%5Bslug%5D/page-9394db66ac0edac0.js"],"default"]
16:T1310,

## Introduction
Recently I was building a new repo in GitHub and realized I needed a new SSH key to push to GitHub. Upon bringing up GitHub's SSH creation UI, I was prompted by [1Password](https://1password.com/) with a "Create SSH Key..." option. Apparently I had opted into SSH-key creation 1Password and forgotten. What ensued was a few hours of overhauling how I maintain my GitHub SSH keys entirely. In this post, I'll walk you through how I've begun to maintain multiple accounts with 1Password's SSH Key management system (hint: as of `8/21/22` don't follow the 1Password's instructions...).

## Setting Up Multiple GitHub Accounts with SSH

Let's say you're like me and maintain multiple GitHub accounts. From experience you've realized that SSH Keys ("Secure Shell Keys") are a secure, simple method to access these accounts. Typically, you'd open your shell, type `ssh-keygen -t rsa`, point your file to an `~/.ssh/...` folder, and you'd be off to the races. Now, if you use 1Password, you can simply follow these instructions.

### 1Password
First, we're going to activate 1Password's SSH key generation option (that I forgot I had activated...)

1. In your 1Password, go to your ribbon and select `1Password` -> `Preferences` (or type `CMD + ,`)

	<div text-align: center>
   <img src="/assets/2022/08/1pwd_preferences.png" alt="1Password Preferences">
   </div>
2. In the Preferecnes screen, press `Developer`, then check the `Use the SSH agent` and `Display key names when authorizing connections` boxes.
   <div text-align: center>
   <img src="/assets/2022/08/activate_ssh.png" alt="Activate SSH">
   </div>

### GitHub
Next, we need to generate the key and add it to GitHub.

1. Login to your GitHub Account
2. Navigate to Settings
   <div text-align: center>
   <img src="/assets/2022/08/settings.png" alt="GitHub Settings">
   </div>
3. Select SSH and GPG Keys
   <div text-align: center>
   <img src="/assets/2022/08/ssh_gpg.png" alt="SSH and GPG Keys">
   </div>
4. New SSH key
   <div text-align: center>
   <img src="/assets/2022/08/new_ssh_key.png" alt="New SSH Key">
   </div>
5. Click into title (if not logged into 1Password, select the icon and log in)
   <div text-align: center>
   <img src="/assets/2022/08/1password_ssh_example.png" alt="1Password SSH Example">
   </div>
6. Select `Create SSH Key`
7. In the 1Password prompt, enter a simple, one-word title and select ed25519
   <div text-align: center>
   <img src="/assets/2022/08/testgit.png" alt="Test Git">
   </div>
8. Press `Create & Fill` then `Submit`.

### To 1Password Once More...
Now that our key has been generated and assigned to GitHub, we need to grab the information we need.

1. In your 1Password, go to your newly formed ssh key and download the *private key*.

   <div text-align: center>
   <img src="/assets/2022/08/1pwd_private_key.png" alt="1Password Private Key">
   </div>

- Fun Fact: 1Password's instructions tell you to download the *public key*. This does not work (and should not work). *DO NOT FOLLOW THESE INSTRUCTIONS.*
   <div text-align: center>
   <img src="/assets/2022/08/wrong_instructions.png" alt="Wrong Instructions">
   </div>

### To The Terminal! SSH and Git
Now that we have our private SSH key that we assigned to GitHub, we simply need to add that information to an `~/.ssh/config` file and connect our repo to Git.

First need to move our private key to its proper folder:
1.  Open your terminal and type `mv ~/Downloads/id_ed25519 ~/.ssh/[FILE NAME]`, where `FILE NAME` is whatever you'd like to call the private key file. I think `testgitkey` makes sense, so that's what I'll call it:
    <div text-align: center>
    <img src="/assets/2022/08/move_private_key.png" alt="Move Private Key">
    </div>

Next, we need to use our `.ssh/config` file to instruct our computer how to use our `.ssh` file. If you don't have an `.ssh/config` file, simply enter `touch  ~/.ssh/config` in your terminal.

2. Access your `~/.ssh/config` either by `open ~/.ssh/config` or something like `vi ~/.ssh/config`.

3. Paste the following information into your config file, replacing the information as needed
    ```
    # Test GitHub
    Host testgit
    HostName github.com
    User git
    IdentityFile ~/.ssh/testgitkey
    IdentitiesOnly yes
    ```
    Notice that I provided `Host` the exact same name as was written in GitHub's title field. In the same vein, next to IdentityFile, be sure to enter the name you gave your downloaded private key from 1Password.

Finally, we get to connect our GitHub to 1Password!

4. Navigate to a local GitHub directory you'd like to push.
5. Set the remote url to as follows: `<HOST>`:`<ACCOUNT NAME>/<REPO NAME>.git`\
   e.g. `git remote set-url origin testgit:Econoben/testrepo.git`

That's it! Simply rinse and repeat for each GitHub account you maintain, adding each account to your `~/.ssh/config`. Happy coding.
5:["$","article",null,{"className":"post-detail","children":[["$","header",null,{"className":"post-header","children":[["$","div",null,{"className":"breadcrumb","children":["$","$L13",null,{"href":"/posts","children":"← Back to all posts"}]}],["$","h1",null,{"className":"post-title","children":"The *Right* Way to Maintain Multiple GitHub Accounts Using 1Password's SSH Key Agent"}],["$","div",null,{"className":"post-meta","children":[["$","time",null,{"className":"post-date","children":"August 21, 2022"}],["$","span",null,{"className":"post-separator","children":"•"}],["$","span",null,{"className":"post-reading-time","children":[4," min read"]}]]}],["$","div",null,{"className":"post-tags","children":[["$","$L13","SSH",{"href":"/tags/SSH","className":"post-tag","children":"SSH"}],["$","$L13","GitHub",{"href":"/tags/GitHub","className":"post-tag","children":"GitHub"}],["$","$L13","1Password",{"href":"/tags/1Password","className":"post-tag","children":"1Password"}],["$","$L13","Developer Tooling",{"href":"/tags/Developer Tooling","className":"post-tag","children":"Developer Tooling"}],["$","$L13","Multi-Account Setup",{"href":"/tags/Multi-Account Setup","className":"post-tag","children":"Multi-Account Setup"}]]}]]}],"$undefined",["$","div",null,{"className":"post-audio-section","children":["$","$L14",null,{"audioUrl":"https://tech-notes-blog.s3.us-west-2.amazonaws.com/audio/github_ssh_and_1password.mp3","title":"Listen to this post","className":"post-audio-player"}]}],["$","div",null,{"className":"post-content","children":["$","$L15",null,{"content":"$16"}]}],["$","footer",null,{"className":"post-footer","children":[["$","div",null,{"className":"post-footer-tags","children":[["$","h3",null,{"children":"Tagged with:"}],["$","div",null,{"className":"post-tags","children":[["$","$L13","SSH",{"href":"/tags/SSH","className":"post-tag","children":"SSH"}],["$","$L13","GitHub",{"href":"/tags/GitHub","className":"post-tag","children":"GitHub"}],["$","$L13","1Password",{"href":"/tags/1Password","className":"post-tag","children":"1Password"}],["$","$L13","Developer Tooling",{"href":"/tags/Developer Tooling","className":"post-tag","children":"Developer Tooling"}],["$","$L13","Multi-Account Setup",{"href":"/tags/Multi-Account Setup","className":"post-tag","children":"Multi-Account Setup"}]]}]]}],["$","div",null,{"className":"post-navigation","children":["$","$L13",null,{"href":"/posts","className":"back-to-posts","children":"← View all posts"}]}]]}]]}]
c:[["$","meta","0",{"charSet":"utf-8"}],["$","meta","1",{"name":"viewport","content":"width=device-width, initial-scale=1"}]]
7:null
a:{"metadata":[["$","title","0",{"children":"The *Right* Way to Maintain Multiple GitHub Accounts Using 1Password's SSH Key Agent | Economic Notes"}],["$","meta","1",{"name":"description","content":"A walkthrough for managing multiple GitHub accounts with 1Password's SSH key integration, covering common pitfalls and offering a cleaner setup than the official docs."}],["$","meta","2",{"name":"author","content":"Benjamin Labaschin"}],["$","link","3",{"rel":"manifest","href":"/manifest.json","crossOrigin":"$undefined"}],["$","meta","4",{"name":"keywords","content":"economics,technology,AI,machine learning,blog"}],["$","meta","5",{"property":"og:title","content":"The *Right* Way to Maintain Multiple GitHub Accounts Using 1Password's SSH Key Agent"}],["$","meta","6",{"property":"og:description","content":"A walkthrough for managing multiple GitHub accounts with 1Password's SSH key integration, covering common pitfalls and offering a cleaner setup than the official docs."}],["$","meta","7",{"property":"og:url","content":"https://econoben.dev/posts/github_ssh_and_1password"}],["$","meta","8",{"property":"og:site_name","content":"Economic Notes"}],["$","meta","9",{"property":"og:image","content":"https://econoben.dev/api/og?title=The+*Right*+Way+to+Maintain+Multiple+GitHub+Accounts+Using+1Password%27s+SSH+Key+Agent&date=2022-08-22T00%3A00%3A00.000Z&tags=SSH%2CGitHub%2C1Password%2CDeveloper+Tooling%2CMulti-Account+Setup&summary=A+walkthrough+for+managing+multiple+GitHub+accounts+with+1Password%27s+SSH+key+integration%2C+covering+common+pitfalls+and+offering+a+cleaner+setup+than+the+official+docs."}],["$","meta","10",{"property":"og:type","content":"article"}],["$","meta","11",{"property":"article:published_time","content":"2022-08-22T00:00:00.000Z"}],["$","meta","12",{"property":"article:author","content":"Benjamin Labaschin"}],["$","meta","13",{"property":"article:tag","content":"SSH"}],["$","meta","14",{"property":"article:tag","content":"GitHub"}],["$","meta","15",{"property":"article:tag","content":"1Password"}],["$","meta","16",{"property":"article:tag","content":"Developer Tooling"}],["$","meta","17",{"property":"article:tag","content":"Multi-Account Setup"}],["$","meta","18",{"name":"twitter:card","content":"summary_large_image"}],["$","meta","19",{"name":"twitter:title","content":"The *Right* Way to Maintain Multiple GitHub Accounts Using 1Password's SSH Key Agent"}],["$","meta","20",{"name":"twitter:description","content":"A walkthrough for managing multiple GitHub accounts with 1Password's SSH key integration, covering common pitfalls and offering a cleaner setup than the official docs."}],["$","meta","21",{"name":"twitter:image","content":"https://econoben.dev/api/og?title=The+*Right*+Way+to+Maintain+Multiple+GitHub+Accounts+Using+1Password%27s+SSH+Key+Agent&date=2022-08-22T00%3A00%3A00.000Z&tags=SSH%2CGitHub%2C1Password%2CDeveloper+Tooling%2CMulti-Account+Setup&summary=A+walkthrough+for+managing+multiple+GitHub+accounts+with+1Password%27s+SSH+key+integration%2C+covering+common+pitfalls+and+offering+a+cleaner+setup+than+the+official+docs."}]],"error":null,"digest":"$undefined"}
12:{"metadata":"$a:metadata","error":null,"digest":"$undefined"}
